// const imageInput = document.getElementById('image-upload');
//     const imagePreview = document.getElementById('image-preview');

//     imageInput.addEventListener('change', function () {
//         const file = this.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 imagePreview.src = e.target.result;
//                 imagePreview.style.display = 'block';
//             };
//             reader.readAsDataURL(file);
//         } else {
//             imagePreview.src = '';
//             imagePreview.style.display = 'none';
//         }
//     });

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
    
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    // Update clock immediately and set interval to update every second
    updateClock();
    setInterval(updateClock, 1000);

    const words = ["Time", "L'heure", "Tiempo", "Zeit", "Tempo", "時間"];

    let currentIndex = 0;

    function updateText() {
        const textElement = document.getElementById("changing-text");

        // Fade-out effect
        textElement.style.opacity = 0;

        // Change the word after fade-out
        setTimeout(() => {
            textElement.textContent = words[currentIndex];
            textElement.style.opacity = 1; // Fade-in effect

            // Move to the next word, loop back to the start if at the end
            currentIndex = (currentIndex + 1) % words.length;
        }, 1000); // Match the fade-out duration
    }

    // Start the cycle and repeat every 4 seconds
    updateText();
    setInterval(updateText, 4000);


    // Device Detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Button Elements
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const cameraStream = document.getElementById('cameraStream');
    const video = document.getElementById('video');
    const captureBtn = document.getElementById('captureBtn');

    // Function to send image to backend and get prediction
    async function sendImage(imageBlob) {
        const formData = new FormData();
        formData.append('image', imageBlob, 'uploaded_image.png');

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                displayPrediction(result);
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while making the prediction.');
        }
    }

    // Function to display prediction results
    function displayPrediction(result) {
        const predictionElement = document.getElementById('prediction');
        predictionElement.innerHTML = `
            <p><strong>Predicted Class:</strong> ${result.prediction}</p>
            <p><strong>Confidence:</strong> ${(result.confidence * 100).toFixed(2)}%</p>
        `;
    }

    // Event Listener for Upload Image Button
    uploadImageBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Allow images only
        fileInput.click();

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                previewImage.src = URL.createObjectURL(file);
                imagePreview.style.display = 'block';
                sendImage(file);
            }
        });
    });

    // Event Listener for Camera Button
    cameraBtn.addEventListener('click', () => {
        if (isMobile) {
            // For Mobile Devices: Open Camera
            const mobileInput = document.createElement('input');
            mobileInput.type = 'file';
            mobileInput.accept = 'image/*';
            mobileInput.capture = 'camera'; // Request camera
            mobileInput.click();

            mobileInput.addEventListener('change', () => {
                const file = mobileInput.files[0];
                if (file) {
                    previewImage.src = URL.createObjectURL(file);
                    imagePreview.style.display = 'block';
                    sendImage(file);
                }
            });
        } else {
            // For Desktop Devices: Show Video Stream
            cameraStream.style.display = 'block';
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    video.srcObject = stream;
                })
                .catch((err) => {
                    console.error('Error accessing camera:', err);
                });
        }
    });

    // Event Listener for Capture Button
    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            previewImage.src = URL.createObjectURL(blob);
            imagePreview.style.display = 'block';
            sendImage(blob);
        }, 'image/png');

        // Stop the Video Stream After Capture
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        cameraStream.style.display = 'none';
    });