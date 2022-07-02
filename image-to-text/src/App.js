import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [processing,setProcessing] = useState(0);
 
  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));

    
  }

  const handleClick = () => {

    Tesseract.recognize(
      imagePath,'eng',
      { 
        logger: m =>  {
          console.log(m) 
          setProcessing(m.progress * 100)
        }
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.data.confidence
      let text = result.data.text
      console.log("done", confidence, result);
      setText(text);
    })
  } 

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img src={imagePath} className="id-image"/>
        Processing: {processing}
        <h3>Extracted text</h3>

        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick}> convert to text</button>
      </main>
    </div>
  );
}

export default App