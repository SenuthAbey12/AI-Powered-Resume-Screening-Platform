from app.models.resume import ResumeData


class ResumeMerger:

    SKILL_LABELS = {
        "technical skill",
        "programming language",
        "framework",
        "database",
        "cloud platform",
        "devops tool",
    }

    @staticmethod
    def _clean_string(
        value
    ):

        if value is None:
            return None

        if not isinstance(
            value,
            str
        ):
            return value

        value = value.strip()

        if not value:
            return None

        return value

    @staticmethod
    def _unique_strings(
        values
    ) -> list[str]:

        result = []

        seen = set()

        for value in values:

            if not isinstance(
                value,
                str
            ):
                continue

            value = value.strip()

            if not value:
                continue

            key = value.lower()

            if key in seen:
                continue

            seen.add(key)

            result.append(
                value
            )

        return result

    @classmethod
    def merge(
        cls,
        contacts: dict,
        entities: list[dict],
        structured: dict,
    ) -> ResumeData:

        structured = (
            structured
            if isinstance(
                structured,
                dict
            )
            else {}
        )

        # ================================================
        # Full name
        # ================================================

        full_name = cls._clean_string(
            structured.get(
                "full_name"
            )
        )

        if full_name is None:

            for entity in entities:

                if (
                    entity.get(
                        "label",
                        ""
                    ).lower()
                    == "person name"
                ):

                    full_name = (
                        entity["text"]
                    )

                    break

        # ================================================
        # Skills
        # ================================================

        structured_skills = (
            structured.get(
                "skills"
            )
            or []
        )

        gliner_skills = [
            entity["text"]

            for entity in entities

            if (
                entity
                .get(
                    "label",
                    ""
                )
                .lower()
                in cls.SKILL_LABELS
            )
        ]

        skills = cls._unique_strings(
            list(structured_skills)
            + gliner_skills
        )

        # ================================================
        # Certifications
        # ================================================

        certifications = (
            structured.get(
                "certifications"
            )
            or []
        )

        existing_certifications = {
            (
                item.get(
                    "name",
                    ""
                )
                .strip()
                .lower()
            )

            for item in certifications

            if isinstance(
                item,
                dict
            )
        }

        for entity in entities:

            if (
                entity.get(
                    "label",
                    ""
                ).lower()
                != "certification"
            ):
                continue

            name = (
                entity["text"]
                .strip()
            )

            if (
                name.lower()
                not in
                existing_certifications
            ):

                certifications.append(
                    {
                        "name": name
                    }
                )

                existing_certifications.add(
                    name.lower()
                )

        # ================================================
        # Languages
        # ================================================

        structured_languages = (
            structured.get(
                "languages"
            )
            or []
        )

        gliner_languages = [
            entity["text"]

            for entity in entities

            if (
                entity.get(
                    "label",
                    ""
                ).lower()
                == "language"
            )
        ]

        languages = cls._unique_strings(
            list(
                structured_languages
            )
            + gliner_languages
        )

        # ================================================
        # Final result
        # ================================================

        result = {

            "full_name": full_name,

            "headline": cls._clean_string(
                structured.get(
                    "headline"
                )
            ),

            "summary": cls._clean_string(
                structured.get(
                    "summary"
                )
            ),

            # Rule-based values have priority.
            "contact": contacts,

            "skills": skills,

            "education": (
                structured.get(
                    "education"
                )
                or []
            ),

            "experience": (
                structured.get(
                    "experience"
                )
                or []
            ),

            "projects": (
                structured.get(
                    "projects"
                )
                or []
            ),

            "certifications": (
                certifications
            ),

            "achievements": (
                structured.get(
                    "achievements"
                )
                or []
            ),

            "languages": languages,
        }

        return ResumeData.model_validate(
            result
        )