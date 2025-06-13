# ai-model-service/utils/diseaseModel.py
import json
import tensorflow as tf
from pathlib import Path
import numpy as np

BASE = Path(__file__).parent.parent / "models" / "disease-cnn"
MODEL_FILE = BASE / "model.h5"        # point to the .h5 file
LABELS_FILE = BASE / "labels.json"

def load_disease_model():
    if not MODEL_FILE.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_FILE}")
    model = tf.keras.models.load_model(str(MODEL_FILE))
    labels = json.loads(LABELS_FILE.read_text())
    return model, labels

def predict_disease(model, labels, img_tensor):
    preds = model.predict(img_tensor)
    print("🔍 All predictions with confidence:")
    for i, prob in enumerate(preds[0]):
        print(f"  - {labels[i]}: {prob:.4f}")
    
    top_idx = int(np.argmax(preds))
    top_conf = float(preds[0][top_idx])
    return labels[top_idx], top_conf

def predict_all_diseases(model, labels, image_tensor):
    print("🧪 Input tensor shape:", image_tensor.shape)
    print("✅ Model expects input shape:", model.input_shape)

    preds = model.predict(image_tensor)

    print("🔍 Raw prediction:", preds)
    if np.allclose(preds, 0.0):
        print("❌ Model returned all zeros! Something is wrong.")
    elif np.isnan(preds).any():
        print("❌ Model returned NaNs! Check your input.")

    return list(zip(labels, preds[0]))  # List of (label, score)


# def predict_all_diseases(model, labels, image_tensor):
#     preds = model.predict(image_tensor)[0]
#     return list(zip(labels, preds))  # List of (label, score)