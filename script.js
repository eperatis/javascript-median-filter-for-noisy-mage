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
    let context = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(this, 0, 0);
}

//error handling for failed upload
function failedTheUpload() {
    console.error('The provided file could not be loaded as an image');
}

/**
 * copy uploaded picture to new canvas 
 * why?
 * because, if we don't copy the image the other canvas will not have imageData and * we need this to modify each pixel
 */
function copyUploadedToModify() {
    let sourceCanvas = document.getElementById('uploadedImage');
    let destinationCanvas = document.getElementById('modifiedImage');
    let destinationContext = destinationCanvas.getContext('2d');


    destinationCanvas.width = sourceCanvas.width;
    destinationCanvas.height = sourceCanvas.height;

    destinationContext.drawImage(sourceCanvas, 0, 0);
}

// max runtime
const max_cycle = 10000;

function medianFiltering(startIndex, imageData, width, callback) {
    let endIndex = Math.min(imageData.data.length, startIndex + max_cycle);
    
    let resultData = new Uint8ClampedArray(imageData.data); // Copy original data

    for (let i = startIndex; i < endIndex; i += 4) {
        let neighbors = [[], [], []]; // Separate arrays for R, G, B channels

        let x = (i / 4) % width;   // X-coordinate in the image
        let y = Math.floor((i / 4) / width); // Y-coordinate in the image

        // Get 5x5 neighborhood pixels
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                let nx = x + dx;
                let ny = y + dy;

                // Ensure the neighbor is within bounds
                if (nx >= 0 && nx < width && ny >= 0 && ny < imageData.height) {
                    let neighborIndex = (ny * width + nx) * 4;
                    neighbors[0].push(imageData.data[neighborIndex]);     // R
                    neighbors[1].push(imageData.data[neighborIndex + 1]); // G
                    neighbors[2].push(imageData.data[neighborIndex + 2]); // B
                }
            }
        }

        // Sort and take median for each color channel
        neighbors.forEach(channel => channel.sort((a, b) => a - b));
        let medianIndex = Math.floor(neighbors[0].length / 2);

        resultData[i] = neighbors[0][medianIndex];     // R
        resultData[i + 1] = neighbors[1][medianIndex]; // G
        resultData[i + 2] = neighbors[2][medianIndex]; // B
        resultData[i + 3] = imageData.data[i + 3];     // Keep original alpha
    }

    if (endIndex < imageData.data.length) {
        setTimeout(() => medianFiltering(endIndex, { data: resultData, width: imageData.width, height: imageData.height }, width, callback), 0);
    } else {
        callback(resultData);
    }
}

// Run the algorithm
document.getElementById('imageChangeButton').addEventListener('click', () => {
    let sourceCanvas = document.getElementById('uploadedImage');
    let context = sourceCanvas.getContext('2d');
    let imageData = context.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

    copyUploadedToModify();

    medianFiltering(0, imageData, sourceCanvas.width, (modifiedData) => {
        let modifiedCanvas = document.getElementById('modifiedImage');
        let modifiedContext = modifiedCanvas.getContext('2d');

        let modifiedImageData = modifiedContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        modifiedImageData.data.set(modifiedData);

        modifiedContext.putImageData(modifiedImageData, 0, 0);
    });
});
