import cv2
import numpy as np
from matplotlib import pyplot as plt

def upload_image(img1_name, img2_name):
    img1 = cv2.imread(img1_name)
    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    img1 = cv2.resize(img1, (300, 300))

    img2 = cv2.imread(img2_name)
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    img2 = cv2.resize(img2, (300, 300))

    plt.figure(figsize=(10, 10))
    plt.subplot(121)
    plt.imshow(img1, cmap='gray')
    plt.subplot(122)
    plt.imshow(img2, cmap='gray')
    plt.show()
