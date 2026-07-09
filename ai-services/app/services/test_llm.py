#test_llm.py
from llm import LLMService

response = LLMService.generate("Say Hello in one sentence.")

print(response)