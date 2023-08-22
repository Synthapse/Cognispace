import torch
from transformers import AutoTokenizer, AutomodelForCasualLM, pipeline
from typing import Dict
from huggingface_hub import login
import os

MODEL_NAME = "meta-llama/Llama-2-7b-chat-hf"
DEFAULT_MAX_LENGTH = 128

class Model:

    def __init__(self, data_dir: string, config: Dict, **kwargs) -> None:
        



#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