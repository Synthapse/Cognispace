from langchain import PromptTemplate, LLMChain
from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler


class LlamaAgent:

    def generate(human_input):
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])

        print("Loading Llama model...")

        # Make sure the model path is correct for your system!
        llm = LlamaCpp(
            model_path="AI/Llama2/llama7B-2.bin",
            temperature=0.75,
            max_tokens=2000,
            top_p=1,
            callback_manager=callback_manager,
            verbose=True,
            use_mlock=True,
        )

        print(llm)

        template = """Mood-Based Recipe Generator.
        This agent could generate recipes based on the user's mood or emotions.
        Users could input how they're feeling, and the agent would suggest recipes that match their mood,
        such as comfort foods for a bad day or energizing dishes for a productive day.

        {history}
        Human: {human_input}
        Assistant:"""

        llm(template)
        return llm(template)