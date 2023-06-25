

import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import fileSaver from 'file-saver';
import './App.css';
import PersonList from './personlist';
import axios from 'axios';
function MyComponent() {
  const [imageSrc, setImageSrc] = useState(null);
  const [people, setPeople] = useState([]);
  const [showPersonList, setShowPersonList] = useState(false);

  const webcamRef = useRef(null);

  const capture = () => {
    const webcam = webcamRef.current;
    const imageSrc = webcam.getScreenshot();
    setImageSrc(imageSrc);

    const formData = new FormData();
    formData.append('image', dataURLToBlob(imageSrc), 'capturedImage.jpg');

    axios.post('http://localhost:3001/api/storeimage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      setPeople(response.data.person)
      console.log(response.data);
      if (response.data) {
        console.log('recognized')
        setShowPersonList(true);

      }
    }).catch(error => {
      console.log(error);
    });
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
          {showPersonList && <PersonList people={people} />}
        </div>
        <div className="col-sm-8 offset-sm-2 col-md-4 offset-md-3 mt-4 text-center">
          <button className='btn btn-primary' onClick={capture}>Capture</button>
        </div>

      </div>
    </div>

  );
}


export default MyComponent;