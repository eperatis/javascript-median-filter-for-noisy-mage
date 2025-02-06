/**
 * Medial filter image processing
 * @author eperatis
 */

//testing that the site is working
function getSize() {
    let canvas = document.getElementById('uploadedImage');
    let message = canvas.height + '; ' + canvas.width;
    alert(message);
}

//upload the image
document.getElementById('imageLoader').onchange = function () {
    const img = new Image();
    img.onload = drawTheUploadedImage;
    img.onerror = failedTheUpload;
    img.src = URL.createObjectURL(this.files[0]);
}

//draw the uploaded image to canvas
function drawTheUploadedImage() {
    let canvas = document.getElementById('uploadedImage');
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }
    let context = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(this, 0, 0);
}

//error handling for failed upload
function failedTheUpload() {
    console.error('The provided file could not be loaded as an image');
}