import React, { useState, useRef  } from 'react';
import preprocessImage from './preprocess';
import { createWorker } from 'tesseract.js';
import './App.css';


function App() {

  const worker = createWorker({
    logger: m => { 
      setStatus('0 %  .. Processing...');
      if(m.status === 'recognizing text')
        setStatus(Math.floor(m.progress * 100) + ' % ' + m.status)
    },
  })


  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);


  const handleImageSelection = (event) => {
    setStatus('');
    setImage(URL.createObjectURL(event.target.files[0]))
  }



  const performOcr = async() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
 
    console.log(imageRef.current)
    ctx.drawImage(imageRef.current, 0, 0, 700, 450);
    ctx.putImageData(preprocessImage(canvas),0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
     
      const { data: { text } } = await worker.recognize(dataUrl);
      console.log('text', text);
      await worker.terminate();
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={image} className="App-logo" ref={imageRef}  />
        <canvas ref={canvasRef} width={700} height={450}></canvas>
        <span style={{color: "red"}}>{status}</span>
        <input type="file" onChange={handleImageSelection}   />
         <button onClick={() => { performOcr(); }}>Read Image</button>
          <div className="text-box">
              <p> {text} </p>
          </div>
      </header>
    </div>
  );
}

export default App;
