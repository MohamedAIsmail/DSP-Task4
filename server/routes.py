from server import app
from flask import request
import os
from server import utils as fn
import numpy as np


outputAmp = 0
outputPhase = 0


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

        global outputAmp, outputPhase
        outputAmp = Img1_amplitude
        outputPhase = Img2_phase

        fn.saveMagnitudeImages(
            Img1_amplitude, "server//static//assets//Image1_Magnitude.jpg")
        fn.saveMagnitudeImages(
            Img2_amplitude, "server//static//assets//Image2_Magnitude.jpg")
        fn.savePhaseImages(
            Img1_phase, "server//static//assets//Image1_Phase.jpg")
        fn.savePhaseImages(
            Img2_phase, "server//static//assets//Image2_Phase.jpg")

        Output = fn.finalImageFormation(Img1_amplitude, Img2_phase)

    return []


@app.route('/updateOutput',  methods=['POST'])
def updateOutput():
    global outputAmp, outputPhase

    Output_Magnitudes = []
    Output_Phases = []
    jsonData = request.get_json()

    shapes = jsonData['shapes']
    imgType = jsonData['imgType']

    if (imgType == "magnitude"):
        for shape in shapes:
            if (shape["type"] == 'rect'):
                Output_Magnitudes.append(fn.fourier_masker(
                    shape["x"], shape["y"], shape["width"], shape["height"], outputAmp))

            if (shapes == 'ellipse'):
                Output_Magnitudes.append(fn.fourier_ellpise_masker(
                    shape["x"], shape["y"], shape["Rx"], shape["Ry"], outputAmp))
        outputAmp = Output_Magnitudes[0]
        for shapeOutput in Output_Magnitudes:
            outputAmp = np.logical_or(outputAmp, shapeOutput)

    if (imgType == "phase"):
        for shape in shapes:
            if (shape["type"] == 'rect'):
                Output_Phases.append(fn.fourier_masker(
                    shape['x'], shape['y'], shape["width"], shape["height"], outputPhase))

            if (shapes == 'ellipse'):
                Output_Phases.append(fn.fourier_ellpise_masker(
                    shape['x'], shape['y'], shape["Rx"], shape["Ry"], outputPhase))
        outputPhase = Output_Phases[0]
        for shapeOutput in Output_Phases:
            outputPhase = np.logical_or(outputPhase, shapeOutput)

    Output = fn.finalImageFormation(outputAmp, outputPhase)
    fn.saveOutputImage(Output)

    return []
