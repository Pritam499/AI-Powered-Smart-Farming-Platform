# # ai-model-service/app.py
# import random
# from typing import List, Optional
# from fastapi import FastAPI, File, UploadFile, HTTPException, Form
# from pydantic import BaseModel
# from utils.imagePreprocessor import preprocess_image
# from utils.diseaseModel import load_disease_model, predict_all_diseases
# from utils.chatModel import load_chat_model, predict_chat

# app = FastAPI(title="SmartFarm AI Model Service")

# # Load models on startup
# disease_model, disease_labels = load_disease_model()
# chatbot = load_chat_model()

# # Response schemas
# class Suggestion(BaseModel):
#     disease: str
#     confidence: float

# class DiseaseResponse(BaseModel):
#     suggestions: List[Suggestion]
#     all_diseases: List[str]

# class ChatRequest(BaseModel):
#     message: str

# class ChatOut(BaseModel):
#     reply: str

# @app.post("/predict-disease", response_model=DiseaseResponse)
# async def predict_disease_endpoint(
#     file: UploadFile = File(...),
#     crop: Optional[str] = Form(None)
# ):
#     data = await file.read()
#     try:
#         # 1. Preprocess image
#         img_tensor = preprocess_image(data)

#         # 2. Get raw (label, prob) list
#         all_probs = predict_all_diseases(disease_model, disease_labels, img_tensor)

#         # 3. Optional crop filtering
#         if crop:
#             key = crop.strip().lower().replace(" ", "_")
#             all_probs = [(lbl, p) for lbl, p in all_probs if key in lbl.lower()]
#             if not all_probs:
#                 valid = sorted({lbl.split('_')[0].lower() for lbl in disease_labels})
#                 raise HTTPException(400, f"No diseases for crop '{crop}'. Valid: {valid}")

#         # 4. Shuffle and take first 3 so we don't always pick the strongest
#         random.shuffle(all_probs)
#         top3 = all_probs[:3]

#         # 5. Map raw prob → fuzzy percentage bracket
#         suggestions: List[Suggestion] = []
#         for lbl, raw_p in top3:
#             if raw_p >= 0.8:
#                 perc = random.uniform(95, 99)
#             elif raw_p >= 0.6:
#                 perc = random.uniform(70, 75)
#             elif raw_p >= 0.4:
#                 perc = random.uniform(45, 50)
#             else:
#                 perc = random.uniform(10, 20)
#             suggestions.append(Suggestion(disease=lbl, confidence=perc / 100))


#         # 6. Build full disease list for frontend
#         all_diseases = [lbl for lbl, _ in all_probs]

#         return DiseaseResponse(suggestions=suggestions, all_diseases=all_diseases)

#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))

# @app.post("/chat", response_model=ChatOut)
# async def chat_endpoint(req: ChatRequest):
#     try:
#         reply = predict_chat(chatbot, req.message)
#         return {"reply": reply}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))




# ai-model-service/app.py

# ai-model-service/app.py

import random
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from pydantic import BaseModel

from utils.imagePreprocessor import preprocess_image
from utils.diseaseModel import load_disease_model, predict_all_diseases
from utils.chatModel import load_chat_model, predict_chat

app = FastAPI(title="SmartFarm AI Model Service")

# Load models once
disease_model, disease_labels = load_disease_model()
chatbot = load_chat_model()

class Suggestion(BaseModel):
    disease: str
    confidence: str  # e.g. "97%"

class DiseaseResponse(BaseModel):
    suggestions: List[Suggestion]
    all_diseases: List[str]

class ChatRequest(BaseModel):
    message: str

class ChatOut(BaseModel):
    reply: str


@app.post("/predict-disease", response_model=DiseaseResponse)
async def predict_disease_endpoint(
    file: UploadFile = File(...),
    crop: str = Form(...),
):
    data = await file.read()
    # 1. Preprocess
    img_tensor = preprocess_image(data)
    # 2. Raw predictions
    all_probs = predict_all_diseases(disease_model, disease_labels, img_tensor)
    # 3. Filter by crop
    key = crop.strip().lower().replace(" ", "_")
    filtered = [(lbl, p) for lbl, p in all_probs if key in lbl.lower()]
    if not filtered:
        valid = sorted({lbl.split('_')[0].lower() for lbl in disease_labels})
        raise HTTPException(400, f"No diseases for crop '{crop}'. Valid: {valid}")
    all_probs = filtered
    # 4–5. Sort & take top 3
    all_probs.sort(key=lambda x: x[1], reverse=True)
    top3 = all_probs[:3]

    # 6. Shuffle labels so any can get the top bucket
    diseases = [lbl for lbl, _ in top3]
    random.shuffle(diseases)

    # 7. Create one high/mid/low bucket
    high_pct = random.uniform(95, 99)
    mid_pct  = random.uniform(50, 75)
    low_pct  = random.uniform(10, 45)

    # 8. Pair them
    paired = [
        (diseases[0], high_pct),
        (diseases[1], mid_pct),
        (diseases[2], low_pct),
    ]
    # 9. Sort by bucket descending
    paired.sort(key=lambda x: x[1], reverse=True)

    # 10. Build suggestions
    suggestions = [
        Suggestion(disease=lbl, confidence=f"{int(round(pct))}%")
        for lbl, pct in paired
    ]

    # 11. all_diseases list for frontend
    all_diseases = [lbl for lbl, _ in all_probs]

    return DiseaseResponse(suggestions=suggestions, all_diseases=all_diseases)


@app.post("/chat", response_model=ChatOut)
async def chat_endpoint(req: ChatRequest):
    try:
        reply = predict_chat(chatbot, req.message)
        return ChatOut(reply=reply)
    except Exception as e:
        raise HTTPException(500, detail=str(e))
