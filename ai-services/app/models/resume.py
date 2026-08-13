from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
    ValidationInfo,
    field_validator,
)


class ExperienceItem(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore",
        str_strip_whitespace=True,
    )

    title: str = Field(
        default="",
        validation_alias=AliasChoices(
            "title",
            "job_title",
        ),
    )

    company: str = ""

    period: str = Field(
        default="",
        validation_alias=AliasChoices(
            "period",
            "dates",
        ),
    )

    description: str = ""


class ParsedResume(BaseModel):
    model_config = ConfigDict(
        extra="ignore",
        str_strip_whitespace=True,
    )

    full_name: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    summary: str = ""

    skills: list[str] = Field(default_factory=list)

    # Qwen currently returns education entries as strings.
    education: list[str] = Field(default_factory=list)

    experience: list[ExperienceItem] = Field(
        default_factory=list
    )

    projects: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    achievements: list[str] = Field(default_factory=list)

    @field_validator(
        "skills",
        "education",
        "projects",
        "certifications",
        "achievements",
        mode="before",
    )
    @classmethod
    def normalize_string_lists(
        cls,
        value: object,
        info: ValidationInfo,
    ) -> list[str]:
        if value is None:
            return []

        if isinstance(value, str):
            cleaned = value.strip()
            return [cleaned] if cleaned else []

        if not isinstance(value, list):
            raise ValueError(
                f"{info.field_name} must be a list of strings"
            )

        normalized_items: list[str] = []
        seen_items: set[str] = set()

        for item in value:
            if not isinstance(item, str):
                raise ValueError(
                    f"{info.field_name} must contain only strings"
                )

            cleaned_item = item.strip()

            if not cleaned_item:
                continue

            deduplication_key = cleaned_item.casefold()

            if deduplication_key in seen_items:
                continue

            seen_items.add(deduplication_key)
            normalized_items.append(cleaned_item)

        return normalized_items
