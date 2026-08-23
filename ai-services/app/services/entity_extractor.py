import threading

from gliner import GLiNER

from app.config import (
    GLINER_CHUNK_OVERLAP,
    GLINER_CHUNK_WORDS,
    GLINER_MODEL_NAME,
    GLINER_THRESHOLD,
)


class EntityExtractor:

    _model = None
    _lock = threading.Lock()

    LABELS = [
        "person name",
        "technical skill",
        "programming language",
        "framework",
        "database",
        "cloud platform",
        "devops tool",
        "company",
        "job title",
        "university",
        "degree",
        "field of study",
        "certification",
        "language",
    ]

    @classmethod
    def _load_model(cls):

        if cls._model is not None:
            return cls._model

        with cls._lock:

            if cls._model is None:

                print(
                    f"Loading GLiNER model: "
                    f"{GLINER_MODEL_NAME}"
                )

                cls._model = GLiNER.from_pretrained(
                    GLINER_MODEL_NAME
                )

                print("GLiNER loaded successfully.")

        return cls._model

    @staticmethod
    def _chunk_text(
        text: str,
        chunk_words: int,
        overlap: int,
    ) -> list[str]:

        words = text.split()

        if len(words) <= chunk_words:
            return [text]

        chunks = []

        step = max(
            1,
            chunk_words - overlap
        )

        for start in range(
            0,
            len(words),
            step
        ):

            end = start + chunk_words

            chunk = " ".join(
                words[start:end]
            )

            chunks.append(chunk)

            if end >= len(words):
                break

        return chunks

    @staticmethod
    def _deduplicate(
        entities: list[dict]
    ) -> list[dict]:

        best_entities = {}

        for entity in entities:

            text = entity.get(
                "text",
                ""
            ).strip()

            label = entity.get(
                "label",
                ""
            ).strip()

            score = float(
                entity.get(
                    "score",
                    0
                )
            )

            if not text or not label:
                continue

            key = (
                text.lower(),
                label.lower()
            )

            current = best_entities.get(key)

            if (
                current is None
                or score
                > float(
                    current.get(
                        "score",
                        0
                    )
                )
            ):
                best_entities[key] = {
                    "text": text,
                    "label": label,
                    "score": score,
                }

        return sorted(
            best_entities.values(),
            key=lambda item: item["score"],
            reverse=True,
        )

    @classmethod
    def extract(
        cls,
        text: str
    ) -> list[dict]:

        model = cls._load_model()

        chunks = cls._chunk_text(
            text=text,
            chunk_words=GLINER_CHUNK_WORDS,
            overlap=GLINER_CHUNK_OVERLAP,
        )

        all_entities = []

        for chunk in chunks:

            entities = model.predict_entities(
                chunk,
                cls.LABELS,
                threshold=GLINER_THRESHOLD,
            )

            all_entities.extend(
                entities
            )

        return cls._deduplicate(
            all_entities
        )