# ai-model-service/utils/imagePreprocessor.py

from PIL import Image
import numpy as np
import io
import tensorflow as tf

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # img = img.resize((224, 224))  # Match model input shape
    img = img.resize((128, 128))  # Match model input shape
    img_array = np.array(img) / 255.0  # Normalize if model doesn't already
    img_tensor = tf.convert_to_tensor(img_array, dtype=tf.float32)
    img_tensor = tf.expand_dims(img_tensor, axis=0)  # Add batch dimension
    return img_tensor


# from PIL import Image
# import numpy as np
# from io import BytesIO

# def preprocess_image(data: bytes) -> np.ndarray:
#     img = Image.open(BytesIO(data)).convert("RGB").resize((224, 224))
#     arr = np.asarray(img) / 255.0
#     # shape: (1, 224, 224, 3)
#     return arr[np.newaxis, ...].astype(np.float32)