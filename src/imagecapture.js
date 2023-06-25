import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import fileSaver from 'file-saver';
import './App.css';
import PersonList from './personlist';
import axios from 'axios';
function MyComponent() {
  const [imageSrc, setImageSrc] = useState(null);
  const [showPersonList, setShowPersonList] = useState(false);

  const webcamRef = useRef(null);

  const capture = () => {
    const webcam = webcamRef.current;
    const imageSrc = webcam.getScreenshot();
    setImageSrc(imageSrc);
    saveImageToFile(imageSrc);
    setShowPersonList(true);
   
   
  };

  const saveImageToFile = (imageSrc) => {
    // use a library like FileSaver.js to save the image to a file
    const blob = dataURLToBlob(imageSrc);
    fileSaver.saveAs(blob, 'capturedImage.jpg');
  };

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  return (


    <div >

      <div className="row flex-column bg-primary text-white p-2">
        <h1 className="text-center display-6 col-md-12" style={{ fontSize: '1.5rem' }}>Photo capturing and displaying details</h1>
      </div>
      <div className='container mt-4'>
        <div className="webcam-personlist-container" style={{ display: 'flex' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          {showPersonList && <PersonList />}
        </div>
        <div className="col-sm-8 offset-sm-2 col-md-4 offset-md-3 mt-4 text-center">
          <button className='btn btn-primary' onClick={capture}>Capture</button>
        </div>

      </div>
    </div>

  );
}


export default MyComponent;