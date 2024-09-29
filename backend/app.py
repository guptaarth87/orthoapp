from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from PIL import Image
import io
import base64
from bson import ObjectId
from flask import jsonify
import tensorflow as tf
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# MongoDB client setup
client = MongoClient('mongodb+srv://arth1234samepass:arth1234@cluster0.pdgx6ns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')  # Update with your MongoDB URI if needed
db = client['Xray']  # Database name
users_collection = db['User']  # Collection for user authentication
xraydata_collection = db['xraydata']  # Collection for storing images


# Helper function to process images (replace this with your actual image processing code)

    

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'success', 'message': 'app running successfully'}), 201

@app.route('/view-users', methods=['GET'])
def view_users():
    try:
        users = users_collection.find()
        user_list = []

        for user in users:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            user_list.append(user)

        return jsonify({'status': 'success', 'data': user_list}), 200
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500
    
@app.route('/getusers', methods=['GET'])
def getuser():
    try:
        users = users_collection.find()
        user_list = []
        
        for user in users:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
            user_list.append(user)
        
        return jsonify({'status': 'success', 'data': user_list}), 200
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

@app.route('/delete-user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = users_collection.delete_one({'_id': ObjectId(user_id)})
        if result.deleted_count > 0:
            return jsonify({'status': 'success', 'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'status': 'fail', 'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500
    
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name_ = data['name_']
        phoneNo = data['phoneNo']
        email = data['email']
        password = data['password']

        # Check if user already exists
        if users_collection.find_one({'email': email}):
            print(users_collection.find_one({'email': email}))
            return jsonify({'status': 'fail', 'message': 'User already exists'}), 400

        # Hash the password and store the user
        hashed_password = generate_password_hash(password, method='sha256')
        users_collection.insert_one({'name_':name_ ,'phoneNo':phoneNo , 'email': email, 'password': hashed_password})
        return jsonify({'status': 'success', 'message': 'User created successfully'}), 201

    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

# Signin route

@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        print(email)
        print(password)
        user = users_collection.find_one({'email': email})
        if user and check_password_hash(user['password'], password):
            return jsonify({'status': 'success', 'message': 'Logged in successfully'}), 200
        else:
            return jsonify({'status': 'fail', 'message': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

def process_image(image):
    # Convert the image to grayscale
    output_image = image.convert("L")
    
    # Load your model
    model = tf.keras.models.load_model("model/best_model_efficientnetv2s_2.keras")
    target_size = (224, 224)

    # Resize the image to match the model's input size
    img = image.resize(target_size)
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    
    # Preprocessing for EfficientNet model
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = np.float32(img_array)
    img_array = tf.keras.applications.efficientnet_v2.preprocess_input(img_array)

    # Make the prediction
    y_pred = model.predict(img_array)
    
    return y_pred, output_image  # Return prediction and processed grayscale image
 

@app.route('/process-image', methods=['POST'])
def process_image_route():
    try:
        # Extract email and image from the request
        email = request.form['email']
        input_image_file = request.files['image']
        print(email)
        
        # Load the input image using PIL
        input_image = Image.open(input_image_file)

        # Process the image using the process_image function
        y_pred, output_image = process_image(input_image)
        y_pred = y_pred[0]
        
        # Convert predictions to a list of Python float values
        y_pred = [float(val) for val in y_pred]
        
        # Save input and output images as bytes in memory
        input_image_bytes = io.BytesIO()
        output_image_bytes = io.BytesIO()
        input_image.save(input_image_bytes, format='PNG')
        output_image.save(output_image_bytes, format='PNG')

        # Encode images to base64 strings
        input_image_str = base64.b64encode(input_image_bytes.getvalue()).decode('utf-8')
        output_image_str = base64.b64encode(output_image_bytes.getvalue()).decode('utf-8')

        # Store the images and email in MongoDB
        xraydata_collection.insert_one({
            'email': email,
            'input_image': input_image_str,
            'output_image': output_image_str
        })

        # Prepare additional data (if any)
        dataArray = {
            "Healthy": y_pred[0], 
            "Doubtful": y_pred[1], 
            "Minimal": y_pred[2], 
            "Moderate": y_pred[3], 
            "Severe": y_pred[4]
        }

        # Return the processed image and status
        return jsonify({'status': 'success', 'output_image': output_image_str, 'data': dataArray}), 200

    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

@app.route('/view-xraydata', methods=['GET'])
def view_xraydata():
    try:
        xraydata = xraydata_collection.find()
        xraydata_list = []

        for xray in xraydata:
            xray['_id'] = str(xray['_id'])  # Convert ObjectId to string
            xraydata_list.append(xray)

        return jsonify({'status': 'success', 'data': xraydata_list}), 200
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500

# Function to delete xraydata by ID
@app.route('/delete-xraydata/<xray_id>', methods=['DELETE'])
def delete_xraydata(xray_id):
    try:
        result = xraydata_collection.delete_one({'_id': ObjectId(xray_id)})
        if result.deleted_count > 0:
            return jsonify({'status': 'success', 'message': 'X-ray data deleted successfully'}), 200
        else:
            return jsonify({'status': 'fail', 'message': 'X-ray data not found'}), 404
    except Exception as e:
        return jsonify({'status': 'fail', 'message': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
