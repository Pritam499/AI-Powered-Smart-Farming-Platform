🧠🌿 AI-Powered Smart Farming Platform – Full Stack Project (AI + Angular + Node.js + Python + ML + Docker)
This project is my own full-stack smart farming platform to help farmers detect leaf diseases using AI, and also track crop/yield prediction. It includes user auth, file upload for leaf images, and secure backend + AI model prediction using Python.

🔧 Key Tech Stack
Frontend: Angular (Component-based, Auth Guard, Dashboard, Try Page)

Backend: Node.js, Express.js, JWT Auth, OTP (Send/Verify), MongoDB/PostgreSQL

AI Service: Python (Flask/FastAPI style), TensorFlow CNN Model + TFLite for mobile-ready inference

Model Trained On: PlantVillage dataset + some augmentations

Deployment Ready: Docker setup, Vercel config for API + frontend, Redis setup (for future speedup)

🔍 My Work
I trained the leaf disease classification model with CNN, converted it to .h5 and .tflite.

I built the full backend with OTP flow, user tracking, IP based API access control, and a proxy API to talk to AI model.

I wrote image preprocessing and prediction handling in Python (imagePreprocessor.py, diseaseModel.py).

Built the full Angular frontend with login/signup/verify, and a test prediction dashboard with file upload UI.

✅ Features
Upload leaf image → get disease prediction using trained CNN model.

Secure Auth: Email OTP-based login system with validation.

Structured MVC-based backend code.

Reusable services, clear folder architecture, and Docker config.

Full AI + App integration from scratch (0 to 1).

🔗 Coming Soon
I’ll deploy the full app (frontend + backend + AI model) on Netlify/Vercel and share the live demo.
