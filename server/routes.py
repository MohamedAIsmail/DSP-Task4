from server import app
from flask import request
import os
from server import utils as fn 
import numpy as np
import cv2


img = fn.combine_img()


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

        Image1, Image2 = img.uploadImages()

        Img1_amplitude, Img1_phase, Img2_amplitude, Img2_phase = img.applyFFTShift(
            Image1, Image2)

        img.originalAmp = Img1_amplitude

        img.originalPhase = Img2_phase

        img.saveMagnitudeImages(
            Img1_amplitude, "server//static//assets//Image1_Magnitude.jpg")
        img.saveMagnitudeImages(
            Img2_amplitude, "server//static//assets//Image2_Magnitude.jpg")
        img.savePhaseImages(
            Img1_phase, "server//static//assets//Image1_Phase.jpg")
        img.savePhaseImages(
            Img2_phase, "server//static//assets//Image2_Phase.jpg")

        Output = img.finalImageFormation(img.outputAmp, img.outputPhase)
        img.saveOutputImage(Output)

    return []


@app.route('/updateOutput',  methods=['POST'])
def updateOutput():

    Output_Magnitudes = []
    Output_Phases = []
    jsonData = request.get_json()

    shapes1 = jsonData['shapes1']
    shapes2 = jsonData['shapes2']

    if (len(shapes1) != 0):
        for shape in shapes1:
            if (shape["type"] == 'rect'):
                Output_Magnitudes.append(img.fourier_masker(
                    shape["x"], shape["y"], shape["width"], shape["height"], img.originalAmp))

            if (shape["type"] == 'ellipse'):
                Output_Magnitudes.append(img.fourier_ellpise_masker(
                    shape["x"], shape["y"], shape["Rx"], shape["Ry"], img.originalAmp))
        img.outputAmp = Output_Magnitudes[0]
        if  len(shapes1) > 1:
            index1 = -1
            for shapeOutput in Output_Magnitudes:
                index1 +=1
                if index1 == 0: 
                    continue
                img.outputAmp = cv2.bitwise_xor(img.outputAmp, shapeOutput) 
    else:
        img.outputAmp = np.ones((300,300))

    if (len(shapes2) != 0):
        for shape in shapes2:
            if (shape["type"] == 'rect'):
                Output_Phases.append(img.fourier_masker(
                    shape['x'], shape['y'], shape["width"], shape["height"], img.originalPhase))

            if (shape["type"] == 'ellipse'):
                Output_Phases.append(img.fourier_ellpise_masker(
                    shape['x'], shape['y'], shape["Rx"], shape["Ry"], img.originalPhase))
        img.outputPhase = Output_Phases[0]
        if len(shapes2) > 1:
            index2 = -1
            for shapeOutput in Output_Phases:
                index2 +=1
                if index2 == 0: 
                    continue
                img.outputPhase = cv2.bitwise_xor(
                    img.outputPhase, shapeOutput)
    else:
        img.outputPhase = np.ones((300,300))

    Output = img.finalImageFormation(img.outputAmp, img.outputPhase)
    img.saveOutputImage(Output)
    print("DONE")

    return []
