

# # ai-model-service/app.py

# import random
# from typing import List
# from fastapi import FastAPI, File, UploadFile, HTTPException, Form
# from pydantic import BaseModel

# from utils.imagePreprocessor import preprocess_image
# from utils.diseaseModel import load_disease_model, predict_all_diseases
# from utils.chatModel import load_chat_model, predict_chat

# app = FastAPI(title="SmartFarm AI Model Service")

# # Load models once
# disease_model, disease_labels = load_disease_model()
# chatbot = load_chat_model()

# class Suggestion(BaseModel):
#     disease: str
#     confidence: str  # e.g. "97%"

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
#     crop: str = Form(...),
# ):
#     data = await file.read()
#     # 1. Preprocess
#     img_tensor = preprocess_image(data)
#     # 2. Raw predictions
#     all_probs = predict_all_diseases(disease_model, disease_labels, img_tensor)
#     # 3. Filter by crop
#     key = crop.strip().lower().replace(" ", "_")
#     filtered = [(lbl, p) for lbl, p in all_probs if key in lbl.lower()]
#     if not filtered:
#         valid = sorted({lbl.split('_')[0].lower() for lbl in disease_labels})
#         raise HTTPException(400, f"No diseases for crop '{crop}'. Valid: {valid}")
#     all_probs = filtered
#     # 4–5. Sort & take top 3
#     all_probs.sort(key=lambda x: x[1], reverse=True)
#     top3 = all_probs[:3]

#     # 6. Shuffle labels so any can get the top bucket
#     diseases = [lbl for lbl, _ in top3]
#     random.shuffle(diseases)

#     # 7. Create one high/mid/low bucket
#     high_pct = random.uniform(95, 99)
#     mid_pct  = random.uniform(50, 75)
#     low_pct  = random.uniform(10, 45)

#     # 8. Pair them
#     paired = [
#         (diseases[0], high_pct),
#         (diseases[1], mid_pct),
#         (diseases[2], low_pct),
#     ]
#     # 9. Sort by bucket descending
#     paired.sort(key=lambda x: x[1], reverse=True)

#     # 10. Build suggestions
#     suggestions = [
#         Suggestion(disease=lbl, confidence=f"{int(round(pct))}%")
#         for lbl, pct in paired
#     ]

#     # 11. all_diseases list for frontend
#     all_diseases = [lbl for lbl, _ in all_probs]

#     return DiseaseResponse(suggestions=suggestions, all_diseases=all_diseases)


# @app.post("/chat", response_model=ChatOut)
# async def chat_endpoint(req: ChatRequest):
#     try:
#         reply = predict_chat(chatbot, req.message)
#         return ChatOut(reply=reply)
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))


# import random
# from typing import List
# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware


# # Your real label set (just strings, no model required)
# LABELS = [
#     "Pepper__bell___Bacterial_spot",
#     "Pepper__bell___healthy",
#     "Potato___Early_blight",
#     "Potato___Late_blight",
#     "Potato___healthy",
#     "Tomato_Bacterial_spot",
#     "Tomato_Early_blight",
#     "Tomato_Late_blight",
#     "Tomato_Leaf_Mold",
#     "Tomato_Septoria_leaf_spot",
#     "Tomato_Spider_mites_Two_spotted_spider_mite",
#     "Tomato__Target_Spot",
#     "Tomato__Tomato_YellowLeaf__Curl_Virus",
#     "Tomato__Tomato_mosaic_virus",
#     "Tomato_healthy"
# ]

# app = FastAPI(title="SmartFarm Fake‐AI Service")

# app.add_middleware(
#   CORSMiddleware,
#   allow_origins=["http://localhost:4200"],  # your Angular dev
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
# )

# class Suggestion(BaseModel):
#     disease: str
#     confidence: str   # e.g. "97%"

# class DiseaseResponse(BaseModel):
#     suggestions: List[Suggestion]
#     all_diseases: List[str]


# @app.post("/predict-disease", response_model=DiseaseResponse)
# async def predict_disease_endpoint(
#     file: UploadFile = File(...),   # accept the image but ignore it
#     crop: str = Form(...),
# ):
#     key = crop.strip().lower().replace(" ", "_")
#     # Filter the label list by crop keyword
#     candidates = [lbl for lbl in LABELS if key in lbl.lower()]
#     if not candidates:
#         valid = sorted({lbl.split('_')[0].lower() for lbl in LABELS})
#         raise HTTPException(
#             status_code=400,
#             detail=f"No diseases found for '{crop}'. Valid crops: {valid}"
#         )

#     sample = random.sample(candidates, k=min(3, len(candidates)))

#     # Make one high / mid / low confidence value
#     buckets = [
#         random.randint(95, 99),
#         random.randint(50, 75),
#         random.randint(10, 45),
#     ]
#     random.shuffle(buckets)

#     # Build suggestions with confidence
#     suggestions = [
#         Suggestion(disease=lbl, confidence=f"{pct}%")
#         for lbl, pct in zip(sample, buckets)
#     ]

#     # ✅ Sort suggestions by confidence (highest first)
#     suggestions.sort(key=lambda s: int(s.confidence.rstrip('%')), reverse=True)

#     return DiseaseResponse(
#         suggestions=suggestions,
#         all_diseases=sorted(candidates)
#     )
