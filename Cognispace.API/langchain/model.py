import torch
import transformers

# bnb_config. This object enables us to quantize our model,
# allowing us to fit it onto a single A100 GPU 
# — without quantization we would actually need ~7 A100s.

bnb_config = transformers.BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type='nf4',
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype=torch.bfloat16
)

model_id = 'meta-llama/Llama-2-7b-chat-hf'
#model_id = 'togethercomputer/LLaMA-2-7B-32K'

# begin initializing HF items, need auth token for these
write_hf_auth = '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'
read_hf_auth = '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'

model_config = transformers.AutoConfig.from_pretrained(
    model_id,
    use_auth_token=read_hf_auth
)

print(model_config)

# initialize the model
model = transformers.AutoModelForCausalLM.from_pretrained(
    model_id,
    trust_remote_code=True,
    config=model_config,
    quantization_config=bnb_config,
    device_map='auto',
    use_auth_token=read_hf_auth
)

print(model)

model.eval()
