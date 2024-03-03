from flask import Flask, request, redirect, url_for

from PIL import Image
from app import app
from ultralytics import YOLO

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
model = YOLO('./best.pt')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Ensure the upload folder exists


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def is_image(filename):
    try:
        Image.open(filename).verify()
        return True
    except (IOError, SyntaxError):
        return False

@app.route('/')
def index():
    return "render_template('upload.html')"

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    # If user does not select file, browser also
    # submit an empty part without filename

    if file and allowed_file(file.filename):
       
    
        
        # transform = transforms.PILToTensor()
        # Convert the PIL image to Torch tensor
        
        

        # print(file)
        image = Image.open(file.stream)
        print('started')
        results = model(image) 

        print('finished')
        # print the converted Torch tensor
        for result in results:
            boxes = result.boxes  # Boxes object for bounding box outputs
            masks = result.masks  # Masks object for segmentation masks outputs
            keypoints = result.keypoints  # Keypoints object for pose outputs
            probs = result.probs  # Probs object for classification outputs
         
            # result.show()  # display to screen
            # result.save(filename='result.jpg') 
    return str(boxes.shape[0])
      

# if __name__ == "__main__":
#     app.run(debug=True)
