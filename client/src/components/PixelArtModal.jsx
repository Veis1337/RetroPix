import React, { useState } from "react";
import "./PixelArtModal.css";
import axios from "axios";

const PixelArtModal = ({ closeModal }) => {
  const [gridSize, setGridSize] = useState(15);
  const [pixels, setPixels] = useState(Array(gridSize * gridSize).fill("#ffffff"));
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isGridTransparent, setIsGridTransparent] = useState(true);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const handlePixelClick = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = selectedColor;
    setPixels(newPixels);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const handleGridToggle = () => {
    setIsGridTransparent(!isGridTransparent);
  };

  const handleSizeChange = (size) => {
    setGridSize(size);
    setPixels(Array(size * size).fill("#ffffff"));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const renderPixels = () => {
    return pixels.map((color, index) => (
      <div
        key={index}
        className="pixel"
        style={{ backgroundColor: color }}
        onClick={() => handlePixelClick(index)}
      />
    ));
  };

  const handlePost = () => {
    const pictureData = {
      title: title,
      caption: caption,
      drawingData: JSON.stringify(pixels),
    };

    // Send the pictureData to your backend API
    axios
      .post("/pix", pictureData)
      .then((response) => {
        // Handle the successful response
        console.log("Picture model saved successfully!", response.data);
        closeModal(); // Close the modal after successful save
      })
      .catch((error) => {
        // Handle the error
        console.error("Error saving the Picture model:", error);
      });
  };

  return (
    <div className="pixel-art-modal">
      <div className="modal-content">
        <div className="size-selection">
          <span className="color-selector-text">Color Selector</span>
          <br />
          <br />
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
          />
        </div>

        <div
          className={`pixel-grid ${isGridTransparent ? "transparent-grid" : ""}`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {renderPixels()}
        </div>

        <div className="grid-toggle">
          <span className="toggle-label">Grid Toggle:</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!isGridTransparent}
              onChange={handleGridToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="grid-size-toggle">
          <button
            className={`grid-size-button ${gridSize === 15 ? "active" : ""}`}
            onClick={() => handleSizeChange(15)}
          >
            15x15
          </button>
          <button
            className={`grid-size-button ${gridSize === 25 ? "active" : ""}`}
            onClick={() => handleSizeChange(25)}
          >
            25x25
          </button>
          <button
            className={`grid-size-button ${gridSize === 50 ? "active" : ""}`}
            onClick={() => handleSizeChange(50)}
          >
            50x50
          </button>
        </div>

        <div className="modal-toggle">
          <button className="toggle-button" onClick={handlePost}>
            Post
          </button>
          <button className="toggle-button" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixelArtModal;
