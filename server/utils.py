import cv2
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image as im

class combine_img:
    def __init__(self): 
        self.originalAmp = np.ones((300,300))
        self.outputAmp = np.ones((300,300))
        self.originalPhase = np.ones((300,300))
        self.outputPhase = np.ones((300,300))
        self.magn_shapes = []
        self.phase_shapes = []

    def uploadImages(self):
        Image1 = cv2.imread('server/static/assets/Image1.jpg')
        Image1 = cv2.cvtColor(Image1, cv2.COLOR_BGR2GRAY)
        Image1 = cv2.resize(Image1, (300, 300))

        Image2 = cv2.imread('server/static/assets/Image2.jpg')
        Image2 = cv2.cvtColor(Image2, cv2.COLOR_BGR2GRAY)
        Image2 = cv2.resize(Image2, (300, 300))
        return Image1, Image2


    def applyFFTShift(self, Image1, Image2):

        Image1_fft = np.fft.fftshift(np.fft.fft2(Image1))
        Image2_fft = np.fft.fftshift(np.fft.fft2(Image2))

        Img1_amplitude = np.abs(Image1_fft)
        Img1_phase = np.angle(Image1_fft)

        Img2_amplitude = np.abs(Image2_fft)
        Img2_phase = np.angle(Image2_fft)
        return Img1_amplitude, Img1_phase, Img2_amplitude, Img2_phase


    def saveMagnitudeImages(self, Img_magnitude, filename):

        Img_amplitude_data = self.scale(20 * np.log(Img_magnitude))
        cv2.imwrite(filename, Img_amplitude_data)


    def savePhaseImages(self, Img_phase, filename):

        Img_phase_data = self.scale(Img_phase)
        cv2.imwrite(filename, Img_phase_data)


    def scale(self, image_array):

        image = ((image_array - image_array.min()) *
                (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image


    def fourier_masker(self, x, y, width, height, rect_Image):

        Output = np.zeros((300, 300))
        Output[y: y+height, x:x +
            width] = rect_Image[y:y+height, x:x+width]

        return Output


    def fourier_ellpise_masker(self, x0, y0, Rx, Ry, ellipse_Image):

        x1 = int(x0 - Rx)
        x2 = int(x0 + Rx)

        y1 = int(y0 - Ry)
        y2 = int(y0 + Ry)
        x = list(range(x1, x2, 1))
        x = np.array(x, dtype=float)  # x values of interest

        y = list(range(y1, y2, 1))
        # y values of interest, as a "column" array
        y = np.array(y, dtype=float)[:, None]

        # True for points inside the ellipse
        ellipse = ((x-x0)/Rx)**2 + ((y-y0)/Ry)**2 <= 1
        ellipse = ellipse.astype(int)

        Output = np.zeros((300, 300))
        Output[y1:y2, x1:x2] = ellipse_Image[y1:y2, x1:x2]
        Output[y1:y2,
            x1:x2] = Output[y1:y2, x1:x2] * ellipse
        return Output


    def saveOutputImage(self, FinalImage):
        cv2.imwrite("server//static//assets//Output.jpg", FinalImage)


    def finalImageFormation(self, outputAmpltiude, outputPhase):
        OutputImage = np.multiply(outputAmpltiude, np.exp(1j * outputPhase))
        FinalImage = np.real(np.fft.ifft2(OutputImage))
        return np.abs(FinalImage)
