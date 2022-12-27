import cv2
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image as im


def uploadImages():
    Image1 = cv2.imread('server/static/assets/Image1.jpg')
    Image1 = cv2.cvtColor(Image1, cv2.COLOR_BGR2GRAY)
    Image1 = cv2.resize(Image1, (300, 300))

    Image2 = cv2.imread('server/static/assets/Image2.jpg')
    Image2 = cv2.cvtColor(Image2, cv2.COLOR_BGR2GRAY)
    Image2 = cv2.resize(Image2, (300, 300))
    return Image1, Image2


def applyFFTShift(Image1, Image2):

    Image1_fft = np.fft.fftshift(np.fft.fft2(Image1))
    Image2_fft = np.fft.fftshift(np.fft.fft2(Image2))

    Img1_amplitude = np.abs(Image1_fft)
    Img1_phase = np.angle(Image1_fft)

    Img2_amplitude = np.abs(Image2_fft)
    Img2_phase = np.angle(Image2_fft)
    return Img1_amplitude, Img1_phase, Img2_amplitude, Img2_phase


def saveMagnitudeImages(Img_magnitude, filename):

    Img_amplitude_data = scale(20 * np.log(Img_magnitude))
    cv2.imwrite(filename, Img_amplitude_data)


def savePhaseImages(Img_phase, filename):

    Img_phase_data = scale(Img_phase)
    cv2.imwrite(filename, Img_phase_data)


def scale(image_array):

    image = ((image_array - image_array.min()) *
             (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
    return image


