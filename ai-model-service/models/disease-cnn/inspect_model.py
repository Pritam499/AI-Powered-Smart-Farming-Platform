# from tensorflow.keras.models import load_model
# import numpy as np
# from PIL import Image
# import json

# # Load model
# model = load_model("model.h5")
# labels = json.load(open("labels.json"))

# # Test image
# img = Image.open("image1.jpg").convert("RGB")
# img = img.resize((224, 224))
# img_array = np.array(img) / 255.0
# img_tensor = np.expand_dims(img_array, axis=0)

# # Predict
# preds = model.predict(img_tensor)[0]
# top_idx = np.argmax(preds)
# print("\n🔍 Top prediction:", labels[top_idx], f"({preds[top_idx]:.4f})")

# print("\n🔍 All predictions:")
# for i, prob in enumerate(preds):
#     print(f"  - {labels[i]}: {prob:.4f}")

from collections import Counter
import os

data_dir = "../../training_data/PlantVillage"
labels = [folder for folder in os.listdir(data_dir)]
print("Total classes:", len(labels))

counts = {label: len(os.listdir(os.path.join(data_dir, label))) for label in labels}
print("Sample count per class:")
print(counts)