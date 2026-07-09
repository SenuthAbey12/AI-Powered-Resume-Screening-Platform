from pathlib import Path


# Get the absolute path to the prompt file
PROMPT_FILE = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "resume_prompt.txt"
)


def load_resume_prompt() -> str:
    """
    Load the resume parsing prompt from the prompt file.
    """

    with open(PROMPT_FILE, "r", encoding="utf-8") as file:
        return file.read()