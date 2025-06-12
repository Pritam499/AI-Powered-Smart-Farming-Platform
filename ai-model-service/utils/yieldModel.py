# ai-model-service/utils/yieldModel.py
from pathlib import Path
import onnxruntime as rt
import numpy as np
from datetime import datetime, timedelta

MODEL_PATH = Path(__file__).parent.parent / "models" / "yield-model" / "model.onnx"

def load_yield_model():
    return rt.InferenceSession(str(MODEL_PATH))

def predict_yield(model, lat, lng, startDate, endDate):
    # Example: generate synthetic forecasts for MVP
    start = datetime.fromisoformat(startDate)
    end = datetime.fromisoformat(endDate)
    days = (end - start).days + 1
    # Fake data: random or mean value
    forecast = []
    for i in range(days):
        date = (start + timedelta(days=i)).date().isoformat()
        yield_val = float(np.random.uniform(1.0, 5.0))  # replace with real inference
        forecast.append({"date": date, "yield": yield_val})
    return forecast


# In production, replace the random stub with actual ONNX inference, e.g.:


# inputs = {
#   "lat": np.array([[lat]], dtype=np.float32),
#   "lng": np.array([[lng]], dtype=np.float32),
#   "days": np.array([[days]], dtype=np.float32)
# }
# outputs = model.run(None, inputs)[0].flatten()