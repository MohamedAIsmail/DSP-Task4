from server import app
from flask import request
import os
from server import utils as fn


@app.route('/uploadImage',  methods=['POST'])
def uploadImage():

    if request.method == 'POST':
        try:
            file1 = request.files["Image_File1"]
            file1.save(os.path.join(
                'server/static/assets/Image1.jpg'))
        except:
            file2 = request.files["Image_File2"]
            file2.save(os.path.join(
                'server/static/assets/Image2.jpg'))

        Image1, Image2 = fn.uploadImages()

        Img1_amplitude, Img1_phase, Img2_amplitude, Img2_phase = fn.applyFFTShift(
            Image1, Image2)

        fn.saveMagnitudeImages(
            Img1_amplitude, "server//static//assets//Image1_Magnitude.jpg")
        fn.saveMagnitudeImages(
            Img2_amplitude, "server//static//assets//Image2_Magnitude.jpg")
        fn.savePhaseImages(
            Img1_phase, "server//static//assets//Image1_Phase.jpg")
        fn.savePhaseImages(
            Img2_phase, "server//static//assets//Image2_Phase.jpg")

    return []
