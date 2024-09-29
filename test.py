import tensorflow as tf
print(tf.__version__)

 # class_names = ["Healthy", "Doubtful", "Minimal", "Moderate", "Severe"]
    # model = tf.keras.models.load_model("./model/model_Xception_ft.hdf5")
    # target_size = (224, 224)

    # # uploaded_file_path = "1_z.jpg"
    # img = tf.keras.preprocessing.image.load_img(
    #     uploaded_file_path, target_size=target_size
    # )
    # # img = Image.open("1_z.jpg")
    # img = tf.keras.preprocessing.image.img_to_array(img)
    # img_array = np.expand_dims(img, axis=0)
    # img_array = np.float32(img_array)
    # img_array = tf.keras.applications.xception.preprocess_input(img_array)
    # y_pred = model.predict(img_array)
    # return y_pred ,output_image
