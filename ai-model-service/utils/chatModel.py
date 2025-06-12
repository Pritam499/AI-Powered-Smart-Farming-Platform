# ai-model-service/utils/chatModel.py

from transformers import AutoTokenizer, AutoModelForCausalLM

def load_chat_model():
    tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
    model = AutoModelForCausalLM.from_pretrained("distilgpt2")
    return {"tokenizer": tokenizer, "model": model}

def predict_chat(chatbot, message: str) -> str:
    tokenizer, model = chatbot["tokenizer"], chatbot["model"]
    prompt = f"User: {message}"
    inputs = tokenizer.encode(prompt, return_tensors="pt")

    outputs = model.generate(
        inputs,
        max_length=100,
        num_return_sequences=1,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        # do_sample=False,
        top_p=0.9,
        top_k=30
    )

    reply = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
    return reply.strip().replace("User:", "").replace("Bot:", "",).replace("AI:", "").replace("\n", "").strip()


# def predict_chat(chatbot, message: str) -> str:
#     tokenizer, model = chatbot["tokenizer"], chatbot["model"]
#     inputs = tokenizer.encode(message, return_tensors="pt")

#     # Generate better-quality responses with stopping criteria
#     outputs = model.generate(
#         inputs,
#         max_length=100,
#         num_return_sequences=1,
#         pad_token_id=tokenizer.eos_token_id,  # Required to stop at end-of-sentence
#         do_sample=True,
#         top_p=0.95,
#         top_k=50
#     )

#     # Decode the output and clean it up
#     reply = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
#     return reply.strip()  # Remove trailing whitespace/newlines


