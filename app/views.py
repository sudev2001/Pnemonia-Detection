from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Load the model
my_model = load_model("cnn_model.keras")

def home(request):
    return render(request, "index.html")

def pnemonia_detection(request):
    if request.method == "POST" and request.FILES.get("xray_image"):
        uploaded_file = request.FILES["xray_image"]

        # Save file temporarily
        file_path = default_storage.save(f"uploads/{uploaded_file.name}", ContentFile(uploaded_file.read()))
        absolute_path = default_storage.path(file_path)
        relative_path = f"/media/uploads/{uploaded_file.name}"  # Path for HTML

        print("📂 File saved at:", absolute_path)

        if not os.path.exists(absolute_path):
            return JsonResponse({"error": "Saved file not found!"}, status=500)

        try:
            # Load and preprocess the image
            img = image.load_img(absolute_path, target_size=(256, 256))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0  # Normalize

            # Predict using the model
            prediction = my_model.predict(img_array)[0][0]  # Get probability score
            predicted_class = int(np.round(prediction))  # Convert probability to class
            result = "Pneumonia Detected" if predicted_class == 1 else "Normal X-Ray"

            print("✅ Prediction:", result)

            return render(request, "index.html", {"result": result, "image_url": relative_path})

        except Exception as e:
            return render(request, "index.html", {"error": str(e)})

    return render(request, "index.html", {"error": "No file uploaded"})
