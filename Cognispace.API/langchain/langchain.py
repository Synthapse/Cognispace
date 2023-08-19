from langchain import LLMChain, PromptTemplate
from langchain.memory import ConversationBufferWindowMemory

template = """Mood-Based Recipe Generator.
This agent could generate recipes based on the user's mood or emotions.
Users could input how they're feeling, and the agent would suggest recipes that match their mood,
such as comfort foods for a bad day or energizing dishes for a productive day.

{history}
Human: {human_input}
Assistant:"""

prompt = PromptTemplate(input_variables=["history", "human_input"], template=template)