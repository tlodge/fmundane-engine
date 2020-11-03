import {useEffect, useState} from 'react';

import superagent from 'superagent';
import io from 'socket.io-client';
import Layer from './Layer';

const socket = io('http://localhost:3001');

function App() {

 
  const [layers, setLayers] = useState([]);
  const [amListening, setListening] = useState(false); 
  
  const BrowserSpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition)

  const recognition = BrowserSpeechRecognition ? new BrowserSpeechRecognition() : null;
  recognition.continous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  
  let finalTranscript = '';
  
  recognition.onend = () => {
    finalTranscript = "";
    recognition.start();
  }

  recognition.onresult = event => {    
        
    let interimTranscript = ''
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal){ 
        finalTranscript += transcript + ' ';
      }
      else{ 
        interimTranscript += transcript;
      }
    }
    superagent.get("http://localhost:3001/event/speech").query({speech:finalTranscript}).end((err, res)=>{
      
    });
  }

  const handleListen = ()=>{ 
    if (!amListening) {
      recognition.start();
    } 
  } 

  useEffect(() => {
    let _layers = [];
    socket.on('stateupdate', payload => {
      console.log("seen layers", payload);
      _layers = [..._layers.filter(l=>l.id !== payload.id), payload];
      setLayers(_layers);
    });

    //start listening!
    handleListen();
  }, []); //only re-run the effect if new message comes in

  const layerlist = layers.map(e=><Layer key={e.id} {...e} />);

  return (
    <div className="App">
      <header className="App-header">
        {layerlist}
      </header>
    </div>
  );
}

export default App;
