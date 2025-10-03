import os

from PIL import Image

images = []

def convert_images_to_jpg(): 
    # Get all the images (On the same folder as this script)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    for file in os.listdir('.'):
        if file.endswith('.tif'):
            images.append(file)
            
    # Convert to JPG
    for file in images:
        img = Image.open(file)
        rgb_img = img.convert('RGB')
        jpg_file = file.replace('.tif', '.jpg')
        rgb_img.save(jpg_file, quality=95)
        print(f'Converted {file} to {jpg_file}')


if __name__ == "__main__":
    convert_images_to_jpg()
    print("All images converted.")