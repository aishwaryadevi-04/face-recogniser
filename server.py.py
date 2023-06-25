from deepface import DeepFace
import os
import cv2
import numpy as np
from scipy.spatial.distance import cosine
import requests

from flask import Flask,jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
CORS(app)


@app.route("/api/storeimage", methods=["POST"])
def storeimage():
    details = [
            {'name':'Aishwarya', 'age': 18, 'department': 'Computer Science'},
            {'name':'Thasneem', 'age': 19, 'department': 'Computer Science'},
            {'name':'Ramya', 'age': 20, 'department': 'Computer Science'},

                ]
    print('storeimage')
    app.config['UPLOAD_FOLDER'] = 'C:/Users/USER/Downloads/pyimage'
    file = request.files['image']
    img = Image.open(file.stream)
    filename = secure_filename(file.filename)
    filename = os.path.splitext(filename)[0] + '.jpg'
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    img.save(filepath, 'JPEG')
    # Test face recognition
    test_image_path = "C:/Users/USER/Downloads/pyimage/capturedImage.jpg"
    recognized_person = recognize_face(test_image_path)
    print('recognized')
    if recognized_person:
        requests.get(f"http://localhost:3001/name/{recognized_person}")
        # return get_details(recognized_person)
    # if os.path.exists(test_image_path):# Replace with the actual test image path
    #     recognize_face(test_image_path)
    # return "Image received and saved as " + file.filename
    for detail in details:
            if detail['name'] == recognized_person:
                # extract the details of the professor
                data = {
                    'name': detail['name'],
                    'age': detail['age'],
                    'department': detail['department']
                }
    response_data = {'filename': file.filename, 'person': data}
    return jsonify(response_data)



# Define a list of people to recognize
people = [ 'Aishwarya','Thasneem','Ramya' ]

# Function to register a person's face
def register_face(person_name, image_path):
    try:
        # Detect and align face
        image = cv2.imread(image_path)

        # Create a face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Convert the image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            # Take the first detected face
            (x, y, w, h) = faces[0]

            # Extract the face region
            face = image[y:y+h, x:x+w]

            # Resize the face to a fixed size (optional)
            face = cv2.resize(face, (160, 160))

        # Calculate face embedding
        face_embedding = DeepFace.represent(face, model_name='Facenet512', enforce_detection=False)
        # Save face embedding for the person
        embedding_path = f"embeddings/{person_name}.npy"
        os.makedirs("embeddings", exist_ok=True)
        np.save(embedding_path, face_embedding)

        # print(f"Face registered for {person_name}.")
    except Exception as e:
        print(f"An error occurred while registering the face for {person_name}.")
        print(str(e))

# Function to recognize a person's face
def recognize_face(image_path):
    try:
        # Detect and align face
        image = cv2.imread(image_path)

        # Create a face detector
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Convert the image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            # Take the first detected face
            (x, y, w, h) = faces[0]

            # Extract the face region
            face = image[y:y+h, x:x+w]

            # Resize the face to a fixed size (optional)
            face = cv2.resize(face, (160, 160))

        # Calculate face embedding
        face_embedding = DeepFace.represent(face, model_name='Facenet512', enforce_detection=False)
        recognized_person = None
        min_distance = float('inf')

        # Compare the face embedding with registered embeddings
        for person in people:
            embedding_path = f"embeddings/{person}.npy"
            registered_embedding = np.load(embedding_path, allow_pickle=True)

            distance = cosine(registered_embedding[0]['embedding'], face_embedding[0]['embedding'])

            if distance < min_distance:
                min_distance = distance
                recognized_person = person

        if recognized_person and min_distance < 0.6:  # Set threshold for recognition
            print(f"Face recognized as {recognized_person}.")
            return recognized_person
        else:
            print("Face not recognized.")

    except Exception as e:
        print("An error occurred while recognizing the face.")
        print(str(e))

#Register faces for all people
for person in people:
    input_folder = f'C:/Users/USER/Downloads/images/{person}'  # Replace with the actual folder path
    image_files = [f for f in os.listdir(input_folder) if f.endswith('.jpg') or f.endswith('.png')]

    for image_file in image_files:
        image_path = os.path.join(input_folder, image_file)
        register_face(person, image_path)


if __name__ == "__main__":
    app.run(port=3001)
