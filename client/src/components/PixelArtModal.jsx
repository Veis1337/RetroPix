import React, { useState, useEffect, useRef } from "react";
import "./PixelArtModal.css";
import axios from "axios";

const PixelArtModal = ({ closeModal }) => {
  const [gridSize, setGridSize] = useState(15);
  const [pixels, setPixels] = useState(
    Array(gridSize * gridSize).fill("#ffffff")
  );
  const [leftClickColor, setLeftClickColor] = useState("#000000");
  const [rightClickColor, setRightClickColor] = useState("#ffffff");
  const [isGridTransparent, setIsGridTransparent] = useState(true);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(null); // Error state
  const [eraserMode, setEraserMode] = useState(false);


  const mouseDownRef = useRef(false); // Track mouse down state
  const prevPixelIndexRef = useRef(null); // Track the previously colored pixel index

  useEffect(() => {
    // Add event listeners for mouse move and up events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Clean up the event listeners on component unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handlePixelClick = (index, isRightClick) => {
    const newPixels = [...pixels];
    const color = eraserMode
      ? "#ffffff"
      : isRightClick
      ? rightClickColor
      : leftClickColor;
    newPixels[index] = color;
    setPixels(newPixels);
  };

  const handlePixelMouseDown = (index, isRightClick) => {
    mouseDownRef.current = true;
    handlePixelClick(index, isRightClick);
    prevPixelIndexRef.current = index;
  };

  const handlePixelMouseEnter = (index, isRightClick) => {
    if (mouseDownRef.current && index !== prevPixelIndexRef.current) {
      handlePixelClick(index, isRightClick);
      prevPixelIndexRef.current = index;
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
    prevPixelIndexRef.current = null;
  };

  const handleLeftClickColorChange = (e) => {
    setLeftClickColor(e.target.value);
  };

  const handleRightClickColorChange = (e) => {
    setRightClickColor(e.target.value);
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

  const validateCaption = (caption) => {
    if (caption.length > 100) {
      setError("Caption can only be up to 100 characters.");
      return false;
    }
    return true;
  };

  const validateTitle = (title) => {
    if (title.length > 14) {
      setError("Title can only be up to 14 characters.");
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

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Send the pictureData to the backend API with the token included in the headers
    axios
      .post("/pix", pictureData, { headers })
      .then((response) => {
        console.log("Picture model saved successfully!", response.data);
        closeModal(); // Close the modal after successful save
        window.location.reload(); // Refresh the page
      })
      .catch((error) => {
        console.error("Error saving the Picture model:", error);
      });
  };

  const renderPixels = () => {
    return pixels.map((color, index) => (
      <div
        key={index}
        className="pixel"
        style={{ backgroundColor: color }}
        onMouseDown={
          (e) => handlePixelMouseDown(index, e.button === 2) // 2 represents the right mouse button
        }
        onMouseEnter={
          (e) => handlePixelMouseEnter(index, e.buttons === 2) // Check if right mouse button is pressed during mouse enter
        }
        onTouchStart={(e) => handlePixelTouchStart(e, index)}
        onTouchMove={(e) => handlePixelTouchMove(e, index)}
        onTouchEnd={handlePixelTouchEnd}
        onContextMenu={(e) => e.preventDefault()} // Prevent default right-click context menu
      />
    ));
  };

  const handlePixelTouchStart = (e, index) => {
    e.preventDefault();
    mouseDownRef.current = true;
    handlePixelClick(index, false);
    prevPixelIndexRef.current = index;
  };
  

  const handlePixelTouchMove = (e, index) => {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('pixel')) {
      const pixelIndex = Array.from(target.parentNode.children).indexOf(target);
      handlePixelMouseEnter(pixelIndex, false);
    }
  };
  

  const handlePixelTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };
  

  return (
    <div className="pixel-art-modal">
      <div className="modal-content">
        <div className="size-selection">
          {!eraserMode && (
            <>
              <input
                type="color"
                value={leftClickColor}
                onChange={handleLeftClickColorChange}
              />
              <input
                type="color"
                value={rightClickColor}
                onChange={handleRightClickColorChange}
                className="collapse md:visible"
              />
            </>
          )}
          <br></br>
          <button
            className={`eraser-button ${eraserMode ? "active" : ""}`}
            onClick={() => setEraserMode(!eraserMode)}
          >
            Eraser
          </button>
        </div>
        <div
          className={`pixel-grid ${
            isGridTransparent ? "transparent-grid" : ""
          }`}
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
            className={`grid-size-button collapse md:visible ${
              gridSize === 15 ? "active" : ""
            }`}
            onClick={() => handleSizeChange(15)}
          >
            15x15
          </button>
          <button
            className={`grid-size-button collapse md:visible ${
              gridSize === 25 ? "active" : ""
            }`}
            onClick={() => handleSizeChange(25)}
          >
            25x25
          </button>
          <button
            className={`grid-size-button collapse md:visible ${
              gridSize === 50 ? "active" : ""
            }`}
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
            maxLength={14}
          />
        </div>
        {/* Caption form */}
        <div className="form-group">
          <label htmlFor="caption">Caption:</label>
          <textarea
            id="caption"
            value={caption}
            onChange={handleCaptionChange}
            maxLength={100}
          />
        </div>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message if there's an error */}
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
