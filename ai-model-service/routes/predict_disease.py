# ai-model-service/routes/predict_disease.py

import io, json
import numpy as np
from fastapi import APIRouter, File, UploadFile, HTTPException
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
from pathlib import Path

router = APIRouter()

# Load model and labels
MODEL_PATH = Path(__file__).parent.parent / "models" / "disease-cnn" / "model.h5"
LABELS_PATH = Path(__file__).parent.parent / "models" / "disease-cnn" / "labels.json"

try:
    model = load_model(MODEL_PATH)
    with open(LABELS_PATH, "r") as f:
        class_names = json.load(f)
except Exception as e:
    raise RuntimeError(f"Failed to load model or labels: {e}")

IMG_SIZE = (128, 128)

@router.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
        raise HTTPException(status_code=400, detail="Invalid file type. Upload a .jpg/.jpeg/.png image.")

    try:
        # Read and preprocess image
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = img.resize(IMG_SIZE)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array / 255.0, axis=0)  # Normalize and batch

        # Prediction
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_index])
        predicted_label = class_names[predicted_index]

        return {
            "predicted_class": predicted_label,
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
