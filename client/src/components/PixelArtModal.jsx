import React, { useState } from "react";
import "./PixelArtModal.css";

const PixelArtModal = ({ closeModal }) => {
  const [pixels, setPixels] = useState(Array(2500).fill("#ffffff"));
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedSize, setSelectedSize] = useState(50);
  const [isGridTransparent, setIsGridTransparent] = useState(true);

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

  return (
    <div className="pixel-art-modal">
      <div className="modal-content">
        <div className="size-selection">
          <span className="color-selector-text">Color Selector</span>
          <br></br>
          <br></br>
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
          />
        </div>

        <div className={`pixel-grid ${isGridTransparent ? "transparent-grid" : ""}`}>
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

        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default PixelArtModal;
