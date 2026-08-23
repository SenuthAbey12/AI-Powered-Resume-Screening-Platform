import json
import threading

import torch

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
)

from app.config import (
    CPU_THREADS,
    NUEXTRACT_MAX_INPUT_TOKENS,
    NUEXTRACT_MAX_NEW_TOKENS,
    NUEXTRACT_MODEL_NAME,
)


RESUME_TEMPLATE = {

    "full_name": "",

    "headline": "",

    "summary": "",

    "skills": [],

    "education": [
        {
            "institution": "",
            "degree": "",
            "field_of_study": "",
            "start_date": "",
            "end_date": "",
            "description": "",
        }
    ],

    "experience": [
        {
            "company": "",
            "job_title": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "description": "",
        }
    ],

    "projects": [
        {
            "name": "",
            "description": "",
            "technologies": [],
            "url": "",
        }
    ],

    "certifications": [
        {
            "name": "",
            "issuer": "",
            "issue_date": "",
            "credential_id": "",
        }
    ],

    "achievements": [],

    "languages": [],
}


class StructuredExtractor:

    _model = None
    _tokenizer = None

    _lock = threading.Lock()

    @classmethod
    def _load_model(cls):

        if (
            cls._model is not None
            and cls._tokenizer is not None
        ):
            return (
                cls._model,
                cls._tokenizer,
            )

        with cls._lock:

            if cls._model is None:

                print(
                    "Loading NuExtract model: "
                    f"{NUEXTRACT_MODEL_NAME}"
                )

                torch.set_num_threads(
                    CPU_THREADS
                )

                cls._tokenizer = (
                    AutoTokenizer
                    .from_pretrained(
                        NUEXTRACT_MODEL_NAME,
                        trust_remote_code=True,
                    )
                )

                # The checkpoint is stored in bfloat16. Loading it as
                # float32 doubles resident memory (~3.4GB -> ~6.9GB)
                # for no accuracy gain and gets the worker killed on
                # a 16GB laptop that also holds GLiNER.
                cls._model = (
                    AutoModelForCausalLM
                    .from_pretrained(
                        NUEXTRACT_MODEL_NAME,
                        dtype=torch.bfloat16,
                        trust_remote_code=True,
                    )
                )

                cls._model.to("cpu")

                cls._model.eval()

                print(
                    "NuExtract loaded successfully."
                )

        return (
            cls._model,
            cls._tokenizer,
        )

    @staticmethod
    def _build_prompt(
        text: str
    ) -> str:

        template = json.dumps(
            RESUME_TEMPLATE,
            indent=4,
            ensure_ascii=False,
        )

        return (
            "<|input|>\n"
            "### Template:\n"
            f"{template}\n"
            "### Text:\n"
            f"{text}\n\n"
            "<|output|>"
        )

    @staticmethod
    def _extract_json(
        generated_text: str
    ) -> dict:

        cleaned = (
            generated_text
            .strip()
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end == -1:
            raise ValueError(
                "NuExtract did not return "
                "a valid JSON object."
            )

        json_text = cleaned[
            start:end + 1
        ]

        try:
            return json.loads(
                json_text
            )

        except json.JSONDecodeError as exc:

            raise ValueError(
                "Failed to decode "
                "NuExtract JSON output."
            ) from exc

    @classmethod
    def extract(
        cls,
        text: str
    ) -> dict:

        model, tokenizer = (
            cls._load_model()
        )

        prompt = cls._build_prompt(
            text
        )

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=(
                NUEXTRACT_MAX_INPUT_TOKENS
            ),
        )

        prompt_length = (
            inputs["input_ids"]
            .shape[1]
        )

        with torch.inference_mode():

            output_ids = model.generate(
                **inputs,

                max_new_tokens=(
                    NUEXTRACT_MAX_NEW_TOKENS
                ),

                # Deterministic extraction
                do_sample=False,

                pad_token_id=(
                    tokenizer.eos_token_id
                ),
            )

        generated_tokens = (
            output_ids[0][
                prompt_length:
            ]
        )

        generated_text = (
            tokenizer.decode(
                generated_tokens,
                skip_special_tokens=True,
            )
        )

        return cls._extract_json(
            generated_text
        )