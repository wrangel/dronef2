import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPlayer from "react-player";
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
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const videoRef = useRef(null);

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "video/mp4") {
      setVideoFile(URL.createObjectURL(file));
      generateThumbnail(file);
    } else {
      alert("Please upload a valid MP4 video file.");
    }
  };

  const generateThumbnail = (file) => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(file);

    videoElement.addEventListener("loadeddata", () => {
      if (videoElement.readyState >= 2) {
        const canvas = document.createElement("canvas");
        canvas.width = 320; // Set your desired width
        canvas.height = 180; // Set your desired height
        const context = canvas.getContext("2d");
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/png");
        setThumbnail(thumbnailUrl);
        videoElement.pause();
        URL.revokeObjectURL(videoElement.src); // Clean up
      }
    });
  };

  return (
    <div className="app">
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
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
            <ReactPlayer
              url={selectedImage}
              controls={true}
              ref={videoRef}
              style={{ transform: `scale(${zoomLevel})` }}
              width="90%"
              height="90%"
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
      {videoFile && (
        <div>
          <h3>Uploaded Video Preview:</h3>
          <ReactPlayer url={videoFile} controls={true} />
          {thumbnail && (
            <div>
              <h3>Thumbnail:</h3>
              <img src={thumbnail} alt="Video Thumbnail" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
