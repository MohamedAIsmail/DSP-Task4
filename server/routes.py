from server import app
from flask import request
import os
from server import utils as fn
import numpy as np
import cv2


img1 = fn.Image()
img2 = fn.Image()
outputImageObject = fn.Image()


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

        img1.uploadImages('server/static/assets/Image1.jpg')
        img2.uploadImages('server/static/assets/Image2.jpg')

        img1.applyFFTShift()
        img2.applyFFTShift()

        img1.saveMagnitudeImages(
            "server//static//assets//Image1_Magnitude.jpg")
        img2.savePhaseImages("server//static//assets//Image2_Phase.jpg")

    return []


@app.route('/updateOutput',  methods=['POST'])
def updateOutput():
    global outputImageObject
    Output_Magnitudes = []
    Output_Phases = []
    jsonData = request.get_json()
    shapes1 = jsonData['shapes1']
    shapes2 = jsonData['shapes2']

    if (len(shapes1) != 0):
        for shape in shapes1:
            if (shape["type"] == 'rect'):
                Output_Magnitudes.append(img1.fourierRectMasker(
                    shape["x"], shape["y"], shape["width"], shape["height"], 'amp'))

            if (shape["type"] == 'ellipse'):
                Output_Magnitudes.append(img1.fourierEllpiseMasker(
                    shape["x"], shape["y"], shape["Rx"], shape["Ry"], 'amp'))
        outputImageObject.magntiude = Output_Magnitudes[0]
        if len(shapes1) > 1:
            index1 = -1
            for shapeOutput in Output_Magnitudes:
                index1 += 1
                if index1 == 0:
                    continue
                outputImageObject.magntiude = cv2.bitwise_xor(
                    outputImageObject.magntiude, shapeOutput)
    else:
        outputImageObject.magntiude = np.ones((300, 300))

    if (len(shapes2) != 0):
        for shape in shapes2:
            if (shape["type"] == 'rect'):
                Output_Phases.append(img2.fourierRectMasker(
                    shape['x'], shape['y'], shape["width"], shape["height"], 'phase'))

            if (shape["type"] == 'ellipse'):
                Output_Phases.append(img2.fourierEllpiseMasker(
                    shape['x'], shape['y'], shape["Rx"], shape["Ry"], 'phase'))
        outputImageObject.phase = Output_Phases[0]
        if len(shapes2) > 1:
            index2 = -1
            for shapeOutput in Output_Phases:
                index2 += 1
                if index2 == 0:
                    continue
                outputImageObject.phase = cv2.bitwise_xor(
                    outputImageObject.phase, shapeOutput)
    else:
        outputImageObject.phase = np.ones((300, 300))

    outputImageObject = fn.combine_img.finalImageFormation(
        outputImageObject, outputImageObject)
    fn.combine_img.controller(outputImageObject)
    fn.combine_img.saveOutputImage(
        "server//static//assets//Output.jpg", outputImageObject)
    print("DONE")

    return []
