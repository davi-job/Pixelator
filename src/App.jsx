import React, { useState, useEffect } from "react";

import "./Styles/css/uploadFile.css";

function App() {
	const [selectedFile, setSelectedFile] = useState();
	const [previewURL, setPreviewURL] = useState();
	const [pixelSize, setPixelSize] = useState(8); // Initial pixel size

	const processImage = (file, pixelSize) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.src = url;

		img.onload = () => {
			// Create a canvas with the image scaled down by the pixel size
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			canvas.width = img.width / pixelSize;
			canvas.height = img.height / pixelSize;

			// Create a canvas with the image scaled back up to the original size
			const scaledCanvas = document.createElement("canvas");
			const scaledCtx = scaledCanvas.getContext("2d");

			scaledCanvas.width = img.width;
			scaledCanvas.height = img.height;

			// Disable image smoothing to keep the pixelated effect
			ctx.imageSmoothingEnabled = false;
			scaledCtx.imageSmoothingEnabled = false;

			// Draw the image scaled down by the pixel size
			ctx.drawImage(
				img,
				0,
				0,
				img.width / pixelSize,
				img.height / pixelSize
			);

			// Draw the scaled down image back up to the original size
			scaledCtx.drawImage(canvas, 0, 0, img.width, img.height);

			setPreviewURL(scaledCanvas.toDataURL());
		};
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file && file.type.startsWith("image/")) {
			setSelectedFile(file);
			processImage(file, pixelSize);
		} else {
			setSelectedFile(null);
			setPreviewURL(null);
			alert("Please select an image file");
		}
	};

	useEffect(() => {
		if (selectedFile) {
			processImage(selectedFile, pixelSize);
		}
	}, [pixelSize]);

	return (
		<>
			<div className="app__container">
				<label className="app__uploadButton" htmlFor="fileUpload">
					Upload Image
				</label>
				<input
					className="app__fileInput"
					type="file"
					onChange={handleFileChange}
					style={{ display: "none" }}
					id="fileUpload"
				/>

				{previewURL && (
					<>
						<div className="app__sliders">
							<div className="app__sliderContainer">
								<label
									className="app__sliderLabel"
									htmlFor="pixelSize"
								>
									Pixel Size
								</label>
								<input
									id="pixelSize"
									className="app__sliderInput"
									type="range"
									min="1"
									max="128"
									value={pixelSize}
									onChange={(e) =>
										setPixelSize(e.target.value)
									}
								/>
							</div>
						</div>

						<img
							className="app__previewImage"
							src={previewURL}
							width={900}
							alt="Preview image"
						/>
					</>
				)}
			</div>
		</>
	);
}

export default App;
