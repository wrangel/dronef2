import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const images = [
  require("./images/DJI_20240723151653_0006_D-2-HDR.jpeg"),
  require("./images/DJI_20240726133608_0011_D-HDR.jpg"),
  require("./images/DJI_20240726133633_0016_D-HDR.jpeg"),
  require("./images/DJI_20240726134125_0023_D-HDR.jpeg"),
  require("./images/DJI_20240726134248_0028_D-HDR.jpeg"),
  require("./images/DJI_20240726155734_0034_D-HDR.jpeg"),
  require("./images/DJI_20240726155751_0039_D-HDR.jpeg"),
  require("./images/DJI_20240726155823_0044_D-HDR.jpeg"),
  require("./images/DJI_20240726155854_0049_D-HDR.jpeg"),
  require("./images/DJI_20240723200636_0020_D.MP4"),
];

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const openImagePopup = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsImageEnlarged(true);
    setIsVideo(image.endsWith(".mp4"));
  };

  const closeImagePopup = useCallback(() => {
    setSelectedImage(null);
    setIsImageEnlarged(false);
  }, []);

  const previousImage = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(images[selectedIndex - 1]);
      setIsVideo(images[selectedIndex - 1].endsWith(".mp4"));
    }
  }, [selectedIndex]);

  const nextImage = useCallback(() => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(images[selectedIndex + 1]);
      setIsVideo(images[selectedIndex + 1].endsWith(".mp4"));
    }
  }, [selectedIndex]);

  const zoomIn = () => {
    setZoomLevel(zoomLevel + 0.1);
  };

  const zoomOut = () => {
    setZoomLevel(zoomLevel - 0.1);
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        closeImagePopup();
      }
    };

    const handleArrowKeys = (event) => {
      if (event.key === "ArrowLeft") {
        previousImage();
      } else if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("keydown", handleArrowKeys);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, [closeImagePopup, previousImage, nextImage]);

  return (
    <div className="app">
      <div className={`title ${isImageEnlarged ? "hidden" : ""}`}>
        My Image Gallery
      </div>
      <div className="masonry">
        {images.map((image, index) => (
          <div
            key={index}
            className="masonry-item"
            onClick={() => openImagePopup(image, index)}
          >
            <img src={image} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="image-popup">
          {isVideo ? (
            <video
              src={selectedImage}
              alt=""
              style={{ transform: `scale(${zoomLevel})` }}
              autoPlay
              controls
              preload="metadata"
            />
          ) : (
            <img
              src={selectedImage}
              alt=""
              style={{ transform: `scale(${zoomLevel})` }}
            />
          )}
          <button className="zoom-in" onClick={zoomIn}>
            +
          </button>
          <button className="zoom-out" onClick={zoomOut}>
            -
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
