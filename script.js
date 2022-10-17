const Video = document.getElementById('video')

Promise.all({
    faceapi.nets.tinyFaceDetector.loadFromUri('/model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/model'),
    faceapi.nets.faceExpressionNet.loadFromUri('/model'),
}).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {
            video: {}
        },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, hight: video.hight }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.tinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d'), clearRect(0, 0, canvas.width, canvas.hight)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.darwFaceLandmarks(canvas, resizedDetections)
    }, 100);
})