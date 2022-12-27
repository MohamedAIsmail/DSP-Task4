from server import app
from flask import request
import os
from server import utils as fn
import numpy as np


outputAmp = 0
outputPhase = 0
originalPhase = 0
originalAmp = 0
magn_shapes = []
phase_shapes = []


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

        global outputAmp, outputPhase, originalAmp, originalPhase
        outputAmp = Img1_amplitude
        originalAmp = Img1_amplitude

        outputPhase = Img2_phase
        originalPhase = Img2_phase

        fn.saveMagnitudeImages(
            Img1_amplitude, "server//static//assets//Image1_Magnitude.jpg")
        fn.saveMagnitudeImages(
            Img2_amplitude, "server//static//assets//Image2_Magnitude.jpg")
        fn.savePhaseImages(
            Img1_phase, "server//static//assets//Image1_Phase.jpg")
        fn.savePhaseImages(
            Img2_phase, "server//static//assets//Image2_Phase.jpg")

        Output = fn.finalImageFormation(Img1_amplitude, Img2_phase)
        fn.saveOutputImage(Output)

    return []


@app.route('/updateOutput',  methods=['POST'])
def updateOutput():
    global outputAmp, outputPhase, originalAmp, originalPhase, magn_shapes, phase_shapes

    Output_Magnitudes = []
    Output_Phases = []
    jsonData = request.get_json()

    shapes1 = jsonData['shapes1']
    shapes2 = jsonData['shapes2']

    if (len(shapes1) != 0):
        for shape in shapes1:
            if (shape["type"] == 'rect'):
                Output_Magnitudes.append(fn.fourier_masker(
                    shape["x"], shape["y"], shape["width"], shape["height"], originalAmp))

            if (shape["type"] == 'ellipse'):
                Output_Magnitudes.append(fn.fourier_ellpise_masker(
                    shape["x"], shape["y"], shape["Rx"], shape["Ry"], originalAmp))
            outputAmp = Output_Magnitudes[0]
            for shapeOutput in Output_Magnitudes:
                outputAmp = np.logical_or(outputAmp, shapeOutput) * originalAmp
    else:
        outputAmp = originalAmp

    if (len(shapes2) != 0):
        for shape in shapes2:
            if (shape["type"] == 'rect'):
                Output_Phases.append(fn.fourier_masker(
                    shape['x'], shape['y'], shape["width"], shape["height"], originalPhase))

            if (shape["type"] == 'ellipse'):
                Output_Phases.append(fn.fourier_ellpise_masker(
                    shape['x'], shape['y'], shape["Rx"], shape["Ry"], originalPhase))
        outputPhase = Output_Phases[0]
        for shapeOutput in Output_Phases:
            outputPhase = np.logical_or(
                outputPhase, shapeOutput) * originalPhase
    else:
        outputPhase = originalPhase

    Output = fn.finalImageFormation(outputAmp, outputPhase)
    fn.saveOutputImage(Output)
    print("DONE")

    return []
