# Image compression /filtering visualization tool
![general demo](server/static/assets/home_page.jpg)
## Description
This project is a tool meant to visualize compression and filtering of images by allowing the user to select different sections of the image in the frequency domain.

Note: all the output images are in greyscale

## Steps for installation
1. Install required packages \
   `pip install -r requirements.txt`
2. run the file titled "app.py"
3. go to your localhost and start using the project :)

## General features
### Crop magnitude
Allows you to select certain masks of the magnitude image, incase of using multiple shapes, the output is the intersection of them.

![Select magnitude](server/static/assets/clip_mag.jpg)

### Crop phase

Same but in the phase part of the image

![select Phase](server/static/assets/clip_phase.jpg)


## Scenarios

### Low pass filter
In other places this would be referred to as a blurring strategy, here we're filtering in the fourier domain and then reconstructing the image

![low pass filter](server/static/assets/low_pass.jpg)

### High pass filter
In other places this is used for edge detection.

![high pass filter](server/static/assets/high_pass.jpg)