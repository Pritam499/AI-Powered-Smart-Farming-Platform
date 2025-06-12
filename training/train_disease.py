# # training/train_disease.py

# import os, json
# import tensorflow as tf
# from tensorflow.keras.preprocessing import image_dataset_from_directory
# from pathlib import Path

# # Paths
# ROOT = Path(__file__).parent.parent
# DATA_DIR = ROOT / "training_data" / "PlantVillage"   # ✅ FIXED: use PlantVillage subfolder
# MODEL_DIR = ROOT / "ai-model-service" / "models" / "disease-cnn"
# MODEL_DIR.mkdir(parents=True, exist_ok=True)
# MODEL_FILE = MODEL_DIR / "model.h5"
# LABELS_FILE = MODEL_DIR / "labels.json"

# # Hyperparams
# # IMG_SIZE = (128, 128)
# IMG_SIZE = (224, 224)
# BATCH_SIZE = 32
# EPOCHS = 3

# # 1. Load datasets from local dirs
# train_ds = image_dataset_from_directory(
#     DATA_DIR,
#     validation_split=0.2,
#     subset="training",
#     seed=123,
#     image_size=IMG_SIZE,
#     batch_size=BATCH_SIZE,
# )
# val_ds = image_dataset_from_directory(
#     DATA_DIR,
#     validation_split=0.2,
#     subset="validation",
#     seed=123,
#     image_size=IMG_SIZE,
#     batch_size=BATCH_SIZE,
# )

# # 2. Extract labels
# class_names = train_ds.class_names
# with open(LABELS_FILE, "w") as f:
#     json.dump(class_names, f, indent=2)

# # 3. Prefetch & normalization
# AUTOTUNE = tf.data.AUTOTUNE
# train_ds = train_ds.prefetch(AUTOTUNE)
# val_ds = val_ds.prefetch(AUTOTUNE)

# # 4. Define a simple CNN
# model = tf.keras.Sequential([
#     tf.keras.layers.Rescaling(1./255, input_shape=(*IMG_SIZE, 3)),
#     tf.keras.layers.Conv2D(32, 3, activation="relu"),
#     tf.keras.layers.MaxPool2D(),
#     tf.keras.layers.Conv2D(64, 3, activation="relu"),
#     tf.keras.layers.MaxPool2D(),
#     tf.keras.layers.Flatten(),
#     tf.keras.layers.Dense(128, activation="relu"),
#     tf.keras.layers.Dense(len(class_names), activation="softmax"),
# ])

# model.compile(
#     optimizer="adam",
#     loss="sparse_categorical_crossentropy",
#     metrics=["accuracy"]
# )

# # 5. Train
# model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

# # 6. Save
# model.save(MODEL_FILE)
# print(f"✅ Model saved to {MODEL_FILE}")

import os
import json
import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras import layers, models
from pathlib import Path

# Paths
DATA_DIR = Path("../training_data/PlantVillage")
OUTPUT_DIR = Path("model_output")
OUTPUT_DIR.mkdir(exist_ok=True)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

# Load dataset
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=42,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# Get class names and save to JSON
class_names = train_ds.class_names
labels_path = OUTPUT_DIR / "labels.json"
with open(labels_path, "w") as f:
    json.dump(class_names, f)

print("✅ Class labels saved:", labels_path)

# Optimize dataset loading
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# Data augmentation
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])

# Build model
model = models.Sequential([
    layers.Rescaling(1./255, input_shape=(224, 224, 3)),
    data_augmentation,
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(len(class_names), activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Compute class weights
labels = []
for batch in train_ds:
    images, batch_labels = batch
    labels.extend(batch_labels.numpy())
labels = np.array(labels)

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(labels),
    y=labels
)
class_weights_dict = dict(enumerate(class_weights))

# Train
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights_dict
)

# Save model
model_path = OUTPUT_DIR / "model.h5"
model.save(model_path)
print("✅ Model saved:", model_path)


# # training/train_disease.py

# import os
# import tensorflow as tf
# import tensorflow_datasets as tfds

# # 1. Config
# MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'ai-model-service', 'models', 'disease-cnn')
# os.makedirs(MODEL_DIR, exist_ok=True)
# H5_PATH = os.path.join(MODEL_DIR, 'model.h5')
# LABELS_PATH = os.path.join(MODEL_DIR, 'labels.json')

# BATCH_SIZE = 32
# IMG_SIZE = (128, 128)
# EPOCHS = 3  # bump later

# # 2. Load data
# (ds_train, ds_val), ds_info = tfds.load(
#     'plant_village', 
#     split=['train[:80%]', 'train[80%:]'],
#     as_supervised=True,
#     with_info=True
# )

# class_names = ds_info.features['label'].names
# import json
# with open(LABELS_PATH, 'w') as f:
#     json.dump(class_names, f, indent=2)

# # 3. Preprocessing pipeline
# def preprocess(image, label):
#     image = tf.image.resize(image, IMG_SIZE) / 255.0
#     return image, label

# ds_train = ds_train.map(preprocess).batch(BATCH_SIZE).prefetch(1)
# ds_val   = ds_val.map(preprocess).batch(BATCH_SIZE).prefetch(1)

# # 4. Build a simple CNN
# model = tf.keras.Sequential([
#     tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(*IMG_SIZE, 3)),
#     tf.keras.layers.MaxPool2D(),
#     tf.keras.layers.Conv2D(64, 3, activation='relu'),
#     tf.keras.layers.MaxPool2D(),
#     tf.keras.layers.Flatten(),
#     tf.keras.layers.Dense(128, activation='relu'),
#     tf.keras.layers.Dense(len(class_names), activation='softmax'),
# ])

# model.compile(
#     optimizer='adam',
#     loss='sparse_categorical_crossentropy',
#     metrics=['accuracy']
# )

# # 5. Train
# model.fit(ds_train, validation_data=ds_val, epochs=EPOCHS)

# # 6. Save
# model.save(H5_PATH)
# print(f"Model saved to {H5_PATH}")
