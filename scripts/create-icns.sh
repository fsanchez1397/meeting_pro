#!/bin/bash

# Create iconset directory structure
mkdir -p owl-face.iconset

# Generate icons in different sizes
sips -z 16 16     assets/owl-face.png --out owl-face.iconset/icon_16x16.png
sips -z 32 32     assets/owl-face.png --out owl-face.iconset/icon_16x16@2x.png
sips -z 32 32     assets/owl-face.png --out owl-face.iconset/icon_32x32.png
sips -z 64 64     assets/owl-face.png --out owl-face.iconset/icon_32x32@2x.png
sips -z 128 128   assets/owl-face.png --out owl-face.iconset/icon_128x128.png
sips -z 256 256   assets/owl-face.png --out owl-face.iconset/icon_128x128@2x.png
sips -z 256 256   assets/owl-face.png --out owl-face.iconset/icon_256x256.png
sips -z 512 512   assets/owl-face.png --out owl-face.iconset/icon_256x256@2x.png
sips -z 512 512   assets/owl-face.png --out owl-face.iconset/icon_512x512.png
sips -z 1024 1024 assets/owl-face.png --out owl-face.iconset/icon_512x512@2x.png

# Create .icns file
echo "Creating .icns file..."
iconutil -c icns owl-face.iconset -o assets/owl-face.icns

# Clean up
echo "Cleaning up..."
rm -R owl-face.iconset

echo "Done! Created assets/owl-face.icns"
