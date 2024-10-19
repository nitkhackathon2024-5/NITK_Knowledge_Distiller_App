# import PyPDF2
# import sys
# import os
# from PIL import Image
# import pytesseract
# import numpy as np
# from pytesseract import Output
# import cv2 

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# # get grayscale image
# def get_grayscale(image):
#     return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # noise removal
# def remove_noise(image):
#     return cv2.medianBlur(image,5)
 
# #thresholding
# def thresholding(image):
#     return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

# #dilation
# def dilate(image):
#     kernel = np.ones((5,5),np.uint8)
#     return cv2.dilate(image, kernel, iterations = 1)
    
# #erosion
# def erode(image):
#     kernel = np.ones((5,5),np.uint8)
#     return cv2.erode(image, kernel, iterations = 1)

# #opening - erosion followed by dilation
# def opening(image):
#     kernel = np.ones((5,5),np.uint8)
#     return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

# #canny edge detection
# def canny(image):
#     return cv2.Canny(image, 100, 200)

# #skew correction
# def deskew(image):
#     coords = np.column_stack(np.where(image > 0))
#     angle = cv2.minAreaRect(coords)[-1]
#     if angle < -45:
#         angle = -(90 + angle)
#     else:
#         angle = -angle
#     (h, w) = image.shape[:2]
#     center = (w // 2, h // 2)
#     M = cv2.getRotationMatrix2D(center, angle, 1.0)
#     rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
#     return rotated

# #template matching
# def match_template(image, template):
#     return cv2.matchTemplate(image, template, cv2.TM_CCOEFF_NORMED) 

# def scanned_image(image):
#     gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # Apply Gaussian blur to reduce noise
#     blurred_image = cv2.GaussianBlur(gray_image, (5, 5), 0)

#     # Apply adaptive thresholding to make the text stand out
#     scanned_image = cv2.adaptiveThreshold(blurred_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
#                                         cv2.THRESH_BINARY, 11, 2)

#     # Save or display the processed image
#     output_path = "scanned_image.png"
#     cv2.imwrite(output_path, scanned_image)






# def pdf_to_text(uploaded_file):

#     reader = PyPDF2.PdfReader(uploaded_file)
#     text = ""
    
#     for page_num in range(len(reader.pages)):
#         page = reader.pages[page_num]
#         text += page.extract_text()
    
#     return text




# # If you're on Windows, specify the Tesseract-OCR path
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# def extract_text_from_image(image_path):
#     # img = Image.open(image_path)
    
#     # text = pytesseract.image_to_string(img)

#     # img = np.array(Image.open(image_path))
#     img = cv2.imread(image_path)
#     scanned_image(img)
#     img = cv2.imread("scanned_image.png")
#     gray = get_grayscale(img)
#     thresh = thresholding(gray)
#     open = opening(gray)
#     can = canny(gray)
    

#     # Adding custom options
#     custom_config = r'--oem 1 --psm 6'
#     text = pytesseract.image_to_string(thresh , config=custom_config)
#     # print(text)
#     return text

# # image_path = "./data/img.jpg"
# # extracted_text = extract_text_from_image(image_path)
# # print(extracted_text)




