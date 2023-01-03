import cv2
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image as im

class Image:
    def __init__(self): 
        self.magntiude = np.ones((300,300))
        self.phase = np.ones((300,300))
        self.image = False

    def uploadImages(self, path, size=(300,300), grayScale = True):
        self.image = cv2.imread(path)
        self.resize(size)
        if grayScale:
            self.grayScale()


    def resize(self, size):
        self.image = image = cv2.resize(self.image, size)
        
    def grayScale(self):
        self.image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)

        


    def applyFFTShift(self):

        Image_fft = np.fft.fftshift(np.fft.fft2(self.image))
        self.magntiude = np.abs(Image_fft)
        self.phase = np.angle(Image_fft)
        



    def saveMagnitudeImages(self, filename):

        Img_amplitude_data = self.scale(20 * np.log(self.magntiude))
        cv2.imwrite(filename, Img_amplitude_data)


    def savePhaseImages(self, filename):

        Img_phase_data = self.scale(self.phase)
        cv2.imwrite(filename, Img_phase_data)


    def scale(self, image_array):

        image = ((image_array - image_array.min()) *
                (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image


    def fourier_rect_masker(self, x, y, width, height, img_type):

        Output = np.zeros((300, 300))
        if img_type == 'amp':
            Output[y: y+height, x:x +
                width] = self.magntiude[y:y+height, x:x+width]
        else:
            Output[y: y+height, x:x +
                width] = self.phase[y:y+height, x:x+width]

        return Output


    def fourier_ellpise_masker(self, x0, y0, Rx, Ry, img_type):

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
        if img_type == 'amp':
            Output[y1:y2, x1:x2] = self.magntiude[y1:y2, x1:x2]
        else:
            Output[y1:y2, x1:x2] = self.phase[y1:y2, x1:x2]    
        Output[y1:y2, x1:x2] = Output[y1:y2, x1:x2] * ellipse
        return Output



class combine_img:
    def __init__(self):
        return

    def saveOutputImage(path, imageObject):
        # self.FinalImage = self.scale(self.FinalImage)    
        # FinalImage = cv2.equalizeHist(FinalImage)
        cv2.imwrite(path, imageObject.image)


    def finalImageFormation (imgObject1, imgObject2):
        combined_img = Image()
        combined_img.magntiude = imgObject1.magntiude
        combined_img.phase = imgObject2.phase
        OutputImage = np.multiply(imgObject1.magntiude, np.exp(1j * imgObject2.phase))
        FinalImage = np.real(np.fft.ifft2(OutputImage))
        FinalImage = np.abs(FinalImage)
        combined_img.image = FinalImage
        
        return combined_img
        
    
    
    def controller(imageObject, brightness=400, contrast=150):
        brightness = int((brightness - 0) * (255 - (-255)) / (510 - 0) + (-255))
    
        contrast = int((contrast - 0) * (127 - (-127)) / (254 - 0) + (-127))
    
        if brightness != 0:
    
            if brightness > 0:
    
                shadow = brightness
    
                max = 255
    
            else:
    
                shadow = 0
                max = 255 + brightness
    
            al_pha = (max - shadow) / 255
            ga_mma = shadow
    
            # The function addWeighted
            # calculates the weighted sum
            # of two arrays
            cal = cv2.addWeighted(imageObject.image, al_pha,
                                imageObject.image, 0, ga_mma)
    
        else:
            cal = imageObject.image
    
        if contrast != 0:
            Alpha = float(131 * (contrast + 127)) / (127 * (131 - contrast))
            Gamma = 127 * (1 - Alpha)
    
            # The function addWeighted calculates
            # the weighted sum of two arrays
            cal = cv2.addWeighted(cal, Alpha,
                                cal, 0, Gamma)
    
        imageObject.image = cal
    
    
    # def scale(self, image_array):

    #     image = ((image_array - image_array.min()) *
    #             (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
    #     return image