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
  const [error, setError] = useState(null); // Error state

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

  const validateCaption = (caption) => {
    if (caption.length > 100) {
      setError('Caption should be up to 100 characters');
      return false;
    }
    return true;
  };

  const validateTitle = (title) => {
    if (title.length > 14) {
      setError('Title should be up to 14 characters');
      return false;
    }
    return true;
  };

  const handlePost = () => {
    setError(null); // Reset the error state

    if (!validateTitle(title) || !validateCaption(caption)) {
      return; // Validation failed, exit the function
    }

    const pictureData = {
      title: title,
      caption: caption,
      drawingData: JSON.stringify(pixels),
    };

    // Send the pictureData to the backend API
    axios
      .post("/pix", pictureData)
      .then((response) => {
        console.log("Picture model saved successfully!", response.data);
        closeModal(); // Close the modal after successful save
      })
      .catch((error) => {
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

        {/* Title form */}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        {/* Caption form */}
        <div className="form-group">
          <label htmlFor="caption">Caption:</label>
          <textarea
            id="caption"
            value={caption}
            onChange={handleCaptionChange}
          />
        </div>

        {error && <p className="error-message">{error}</p>} {/* Display error message if there's an error */}

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
