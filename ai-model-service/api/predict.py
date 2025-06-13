
import random
from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


# Your real label set (just strings, no model required)
LABELS = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
    "Tomato_healthy"
]

app = FastAPI(title="SmartFarm Fake‐AI Service")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:4200"],  # your Angular dev
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class Suggestion(BaseModel):
    disease: str
    confidence: str   # e.g. "97%"

class DiseaseResponse(BaseModel):
    suggestions: List[Suggestion]
    all_diseases: List[str]


@app.post("/predict-disease", response_model=DiseaseResponse)
async def predict_disease_endpoint(
    file: UploadFile = File(...),   # accept the image but ignore it
    crop: str = Form(...),
):
    key = crop.strip().lower().replace(" ", "_")
    # Filter the label list by crop keyword
    candidates = [lbl for lbl in LABELS if key in lbl.lower()]
    if not candidates:
        valid = sorted({lbl.split('_')[0].lower() for lbl in LABELS})
        raise HTTPException(
            status_code=400,
            detail=f"No diseases found for '{crop}'. Valid crops: {valid}"
        )

    sample = random.sample(candidates, k=min(3, len(candidates)))

    # Make one high / mid / low confidence value
    buckets = [
        random.randint(95, 99),
        random.randint(50, 75),
        random.randint(10, 45),
    ]
    random.shuffle(buckets)

    # Build suggestions with confidence
    suggestions = [
        Suggestion(disease=lbl, confidence=f"{pct}%")
        for lbl, pct in zip(sample, buckets)
    ]

    # ✅ Sort suggestions by confidence (highest first)
    suggestions.sort(key=lambda s: int(s.confidence.rstrip('%')), reverse=True)

    return DiseaseResponse(
        suggestions=suggestions,
        all_diseases=sorted(candidates)
    )
