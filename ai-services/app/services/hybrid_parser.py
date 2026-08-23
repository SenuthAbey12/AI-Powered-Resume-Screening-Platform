from pathlib import Path
from time import perf_counter

from app.services.contact_extractor import (
    ContactExtractor,
)

from app.services.entity_extractor import (
    EntityExtractor,
)

from app.services.extractor import (
    TextExtractor,
)

from app.services.resume_merger import (
    ResumeMerger,
)

from app.services.structured_extractor import (
    StructuredExtractor,
)


class HybridResumeParser:

    @staticmethod
    def parse_file(
        file_path: str,
        include_debug: bool = False,
    ) -> dict:

        path = Path(
            file_path
        )

        if not path.exists():
            raise FileNotFoundError(
                f"Resume not found: "
                f"{file_path}"
            )

        total_start = perf_counter()

        # ==============================================
        # 1. Extract document text
        # ==============================================

        start = perf_counter()

        text = TextExtractor.extract_text(
            file_path
        )

        text_time = (
            perf_counter()
            - start
        )

        if not text.strip():

            raise ValueError(
                "No readable text was "
                "extracted from the resume."
            )

        # ==============================================
        # 2. Deterministic contacts
        # ==============================================

        start = perf_counter()

        contacts = (
            ContactExtractor.extract(
                text
            )
        )

        contact_time = (
            perf_counter()
            - start
        )

        # ==============================================
        # 3. GLiNER entities
        # ==============================================

        start = perf_counter()

        entities = (
            EntityExtractor.extract(
                text
            )
        )

        gliner_time = (
            perf_counter()
            - start
        )

        # ==============================================
        # 4. NuExtract structured extraction
        # ==============================================

        start = perf_counter()

        structured = (
            StructuredExtractor.extract(
                text
            )
        )

        nuextract_time = (
            perf_counter()
            - start
        )

        # ==============================================
        # 5. Merge + validate
        # ==============================================

        start = perf_counter()

        resume_data = (
            ResumeMerger.merge(
                contacts=contacts,
                entities=entities,
                structured=structured,
            )
        )

        validation_time = (
            perf_counter()
            - start
        )

        total_time = (
            perf_counter()
            - total_start
        )

        response = {
            "success": True,

            "data": (
                resume_data.model_dump()
            ),

            "timings": {
                "text_extraction_seconds":
                    round(
                        text_time,
                        3
                    ),

                "contact_extraction_seconds":
                    round(
                        contact_time,
                        3
                    ),

                "gliner_seconds":
                    round(
                        gliner_time,
                        3
                    ),

                "nuextract_seconds":
                    round(
                        nuextract_time,
                        3
                    ),

                "validation_seconds":
                    round(
                        validation_time,
                        3
                    ),

                "total_seconds":
                    round(
                        total_time,
                        3
                    ),
            },
        }

        if include_debug:

            response["debug"] = {

                "contacts": contacts,

                "entities": entities,

                "nuextract_output":
                    structured,

                "raw_text": text,
            }

        return response