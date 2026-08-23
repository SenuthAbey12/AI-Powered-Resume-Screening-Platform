import json
import sys
from pathlib import Path

from app.services.hybrid_parser import (
    HybridResumeParser,
)


REPO_ROOT = (
    Path(__file__)
    .resolve()
    .parents[2]
)

DEFAULT_FILE_PATH = (
    REPO_ROOT
    / "backend"
    / "uploads"
    / "Robert.pdf"
)


def main():

    file_path = (
        sys.argv[1]
        if len(sys.argv) > 1
        else str(DEFAULT_FILE_PATH)
    )

    result = (
        HybridResumeParser
        .parse_file(
            file_path,
            include_debug=True,
        )
    )

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()