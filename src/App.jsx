import React, { useState, useEffect } from "react";

import "./Styles/css/uploadFile.css";

function App() {
	const [selectedFile, setSelectedFile] = useState();
	const [previewURL, setPreviewURL] = useState();

	const [pixelSize, setPixelSize] = useState(8); // Initial pixel size

	const [colors, setColors] = useState([]); // Custom colors
	const [selectedColor, setSelectedColor] = useState("#fff"); // Selected color

	const processImage = (file, pixelSize, customColors) => {
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
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			// If custom colors are defined, replace each pixel color with the closest custom color
			if (customColors && customColors.length > 0) {
				const imageData = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				);

				for (let i = 0; i < imageData.data.length; i += 4) {
					const pixelData = imageData.data.slice(i, i + 4);
					const color = closestColor(pixelData);

					if (color) {
						imageData.data[i] = parseInt(color.slice(1, 3), 16);
						imageData.data[i + 1] = parseInt(color.slice(3, 5), 16);
						imageData.data[i + 2] = parseInt(color.slice(5, 7), 16);
					}
				}

				ctx.putImageData(imageData, 0, 0);
			}

			// Draw the scaled down image back up to the original size
			scaledCtx.drawImage(
				canvas,
				0,
				0,
				scaledCanvas.width,
				scaledCanvas.height
			);

			setPreviewURL(scaledCanvas.toDataURL());
		};
	};

	const addColor = () => {
		setColors([...colors, selectedColor]);
	};

	const removeColor = (index) => {
		setColors(colors.filter((_, i) => i !== index));
	};

	const applyColors = () => {
		if (selectedFile) {
			processImage(selectedFile, pixelSize, colors);
		}
	};

	const resetColors = () => {
		setColors([]);

		if (selectedFile) {
			processImage(selectedFile, pixelSize);
		}
	};

	const closestColor = (pixelData) => {
		let minDistance = Infinity;
		let closestColor = null;

		for (const color of colors) {
			const r1 = parseInt(color.slice(1, 3), 16);
			const g1 = parseInt(color.slice(3, 5), 16);
			const b1 = parseInt(color.slice(5, 7), 16);

			const r2 = pixelData[0];
			const g2 = pixelData[1];
			const b2 = pixelData[2];

			const distance = Math.sqrt(
				Math.pow(r1 - r2, 2) +
					Math.pow(g1 - g2, 2) +
					Math.pow(b1 - b2, 2)
			);

			if (distance < minDistance) {
				minDistance = distance;
				closestColor = color;
			}
		}

		return closestColor;
	};

	const handleColorChange = (event) => {
		setSelectedColor(event.target.value);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file && file.type.startsWith("image/")) {
			setSelectedFile(file);
			setColors([]);
			processImage(file, pixelSize);
		} else {
			setSelectedFile(null);
			setPreviewURL(null);
			alert("Please select an image file");
		}
	};

	useEffect(() => {
		if (selectedFile) {
			processImage(selectedFile, pixelSize, colors);
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

							<div className="app__sliderContainer">
								<label
									className="app__sliderLabel"
									htmlFor="colorPicker"
								>
									Color Picker
								</label>
								<input
									id="colorPicker"
									className="app__colorInput"
									type="color"
									value={selectedColor}
									onChange={handleColorChange}
								/>
								<button
									className="app__addColorButton btn"
									onClick={addColor}
								>
									+
								</button>
							</div>
						</div>

						<div className="app__btns">
							<button
								className="app__applyColorsButton btn"
								onClick={applyColors}
							>
								Apply Colors
							</button>
							<button
								className="app__resetColorsButton btn"
								onClick={resetColors}
							>
								Reset Colors
							</button>
						</div>

						<div className="app__colorPalette">
							{colors.map((color, index) => (
								<div
									key={index}
									className="app__color"
									style={{ backgroundColor: color }}
									onClick={() => removeColor(index)}
								/>
							))}
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
