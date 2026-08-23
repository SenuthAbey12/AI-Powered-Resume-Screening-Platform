from huggingface_hub import (
    snapshot_download,
)


MODELS = [
    "urchade/gliner_medium-v2.1",
    "numind/NuExtract-1.5-smol",
]


def main():

    print(
        "Downloading AI models..."
    )

    for model_name in MODELS:

        print(
            f"\nDownloading: "
            f"{model_name}"
        )

        path = snapshot_download(
            repo_id=model_name
        )

        print(
            f"Stored in cache: "
            f"{path}"
        )

    print(
        "\nAll models downloaded."
    )


if __name__ == "__main__":
    main()