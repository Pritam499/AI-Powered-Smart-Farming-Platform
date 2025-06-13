# # ai-model-service/routes/predict_disease.py

# import io, json
# import numpy as np
# from fastapi import APIRouter, File, UploadFile, HTTPException
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image
# from PIL import Image
# from pathlib import Path

# router = APIRouter()

# # Load model and labels
# MODEL_PATH = Path(__file__).parent.parent / "models" / "disease-cnn" / "model.h5"
# LABELS_PATH = Path(__file__).parent.parent / "models" / "disease-cnn" / "labels.json"

# try:
#     model = load_model(MODEL_PATH)
#     with open(LABELS_PATH, "r") as f:
#         class_names = json.load(f)
# except Exception as e:
#     raise RuntimeError(f"Failed to load model or labels: {e}")

# IMG_SIZE = (128, 128)

# @router.post("/predict-disease")
# async def predict_disease(file: UploadFile = File(...)):
#     if not file.filename.lower().endswith((".jpg", ".jpeg", ".png")):
#         raise HTTPException(status_code=400, detail="Invalid file type. Upload a .jpg/.jpeg/.png image.")

#     try:
#         # Read and preprocess image
#         img_bytes = await file.read()
#         img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
#         img = img.resize(IMG_SIZE)
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array / 255.0, axis=0)  # Normalize and batch

#         # Prediction
#         predictions = model.predict(img_array)
#         predicted_index = np.argmax(predictions[0])
#         confidence = float(predictions[0][predicted_index])
#         predicted_label = class_names[predicted_index]

#         return {
#             "predicted_class": predicted_label,
#             "confidence": round(confidence, 4)
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


# ai-model-service/routes/predict_disease.py

import io, json, numpy as np
from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
from pathlib import Path
import tflite_runtime.interpreter as tflite

router = APIRouter()

# Paths
MODEL_PATH  = Path(__file__).parent.parent / "models" / "disease-cnn" / "model.tflite"
LABELS_PATH = MODEL_PATH.parent / "labels.json"
IMG_SIZE    = (128, 128)

# Load interpreter & labels once
try:
    interpreter = tflite.Interpreter(model_path=str(MODEL_PATH))
    interpreter.allocate_tensors()
    inp_details  = interpreter.get_input_details()[0]
    out_details = interpreter.get_output_details()[0]

    with open(LABELS_PATH, "r") as f:
        class_names = json.load(f)
except Exception as e:
    raise RuntimeError(f"📛 Failed to initialize TFLite model: {e}")

@router.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    # validate extension
    if not file.filename.lower().endswith((".jpg",".jpeg",".png")):
        raise HTTPException(400, "Upload a .jpg/.jpeg/.png image.")

    try:
        # 1. Read & preprocess
        data = await file.read()
        img  = Image.open(io.BytesIO(data)).convert("RGB")
        img  = img.resize(IMG_SIZE)
        arr  = np.expand_dims(np.array(img)/255.0, axis=0).astype(np.float32)

        # 2. Run TFLite
        interpreter.set_tensor(inp_details["index"], arr)
        interpreter.invoke()
        preds = interpreter.get_tensor(out_details["index"])[0]

        # 3. Pick top
        idx  = int(preds.argmax())
        conf = float(preds[idx])
        label = class_names[idx]

        return {"predicted_class": label, "confidence": round(conf, 4)}

    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {e}")
