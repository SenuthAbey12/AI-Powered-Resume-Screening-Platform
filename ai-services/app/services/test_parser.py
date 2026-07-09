#
from parser import ResumeParser

text = """
John Doe
Email: john.doe@example.com
Phone: +1 555-123-4567

Skills:
Python, Java, React

Education:
BSc Computer Science
"""

result = ResumeParser.parse(text)

print(result)