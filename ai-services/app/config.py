import os


# =========================================================
# MODEL CONFIGURATION
# =========================================================

GLINER_MODEL_NAME = os.getenv(
    "GLINER_MODEL_NAME",
    "urchade/gliner_medium-v2.1"
)

NUEXTRACT_MODEL_NAME = os.getenv(
    "NUEXTRACT_MODEL_NAME",
    "numind/NuExtract-1.5-smol"
)


# =========================================================
# GLINER CONFIGURATION
# =========================================================

GLINER_THRESHOLD = float(
    os.getenv("GLINER_THRESHOLD", "0.45")
)

GLINER_CHUNK_WORDS = int(
    os.getenv("GLINER_CHUNK_WORDS", "250")
)

GLINER_CHUNK_OVERLAP = int(
    os.getenv("GLINER_CHUNK_OVERLAP", "40")
)


# =========================================================
# NUEXTRACT CONFIGURATION
# =========================================================

# The model has no GQA (32 KV heads for 32 attention heads), so the
# KV cache costs ~192KB per token at bfloat16. Budgeting for the
# model's full 8192-token window would reserve gigabytes we never
# use -- a resume is typically 1-2k tokens.
NUEXTRACT_MAX_INPUT_TOKENS = int(
    os.getenv("NUEXTRACT_MAX_INPUT_TOKENS", "3000")
)

NUEXTRACT_MAX_NEW_TOKENS = int(
    os.getenv("NUEXTRACT_MAX_NEW_TOKENS", "1024")
)


# =========================================================
# CPU CONFIGURATION
# =========================================================

AVAILABLE_CPU_THREADS = os.cpu_count() or 4

# Don't automatically consume every CPU thread on the laptop.
CPU_THREADS = int(
    os.getenv(
        "AI_CPU_THREADS",
        str(max(1, AVAILABLE_CPU_THREADS // 2))
    )
)