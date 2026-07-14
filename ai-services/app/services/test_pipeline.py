from extractor import TextExtractor
from parser import ResumeParser

file_path = "../../backend/uploads/Robert.pdf"

text = TextExtractor.extract_text(file_path)

result = ResumeParser.parse(text)

print(result)
