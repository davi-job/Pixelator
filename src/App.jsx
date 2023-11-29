import React, { useState, useEffect } from "react";

import "./Styles/css/uploadFile.css";

function App() {
	const [selectedFile, setSelectedFile] = useState();
	const [previewURL, setPreviewURL] = useState();
	const [pixelSize, setPixelSize] = useState(8); // Initial pixel size

	const processImage = (file, pixelSize) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			const maxDimension = 600; // Maximum width or height
			let width, height;
			if (img.width > img.height) {
				width = maxDimension;
				height = (img.height / img.width) * maxDimension;
			} else {
				height = maxDimension;
				width = (img.width / img.height) * maxDimension;
			}

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			canvas.width = img.width;
			canvas.height = img.height;

			ctx.imageSmoothingEnabled = false;

			ctx.drawImage(
				img,
				0,
				0,
				img.width / pixelSize,
				img.height / pixelSize
			);

			ctx.drawImage(
				canvas,
				0,
				0,
				img.width / pixelSize,
				img.height / pixelSize,
				0,
				0,
				img.width,
				img.height
			);

			setPreviewURL(canvas.toDataURL());
		};

		img.src = url;
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
	}, [pixelSize, selectedFile]);

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
								min="2"
								max="64"
								value={pixelSize}
								onChange={(e) => setPixelSize(e.target.value)}
							/>
						</div>

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
								max="64"
								value={pixelSize}
								onChange={(e) => setPixelSize(e.target.value)}
							/>
						</div>
					</div>
				)}

				{previewURL && (
					<img
						className="app__previewImage"
						src={previewURL}
						height={500}
						alt="Preview"
					/>
				)}
			</div>
		</>
	);
}

export default App;
