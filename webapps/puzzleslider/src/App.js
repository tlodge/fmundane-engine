import eye from './eye.svg';
import finger from './finger.svg';
import './App.css';
import {useEffect, useState, useRef} from 'react';
import ReactSlider from 'react-slider';
import request from 'superagent';

function App() {
 
  const [pattern, setPattern] = useState([0,0,0,0,0]);
  const [sent, setSent] = useState(false);
  useEffect(()=>{

    const sendit = async ()=>{
      await request.get("/event/webhook?trigger=slidercomplete")
    }
    if (!sent){
      if (pattern[0] > 90 && pattern[1]>90 && pattern[2]>90 && pattern[3]>90 && pattern[4]>90){
        console.log("sending");
        sendit();
        setSent(true);
      }  
    }
  },[pattern]);

  return (
    <div className="App" style={{overflow:"hidden"}}>
      
      <div style={{background:"rgb(151,77,242)", width:"100vw", display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div className="topbox">
          <img src={eye} className="App-logo" alt="eye" />
          <div className="toptext">Help me stop the hack</div>
        </div>
        <div className="innerbox">
          <div>
            <ReactSlider
                className="vertical-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                orientation="vertical"
                onChange={(value)=>{
                    setPattern([value, pattern[1], pattern[2], pattern[3], pattern[4]]);
                }}
                renderThumb={(props, state) => <div {...props}><div style={{marginLeft:3, marginTop:3, width:30, height:30, borderRadius:15, background:"rgb(0,255,123)"}}></div></div>}
            />
            <div style={{margin:5, color:"white"}}>1</div>
          </div>
          <div>
            <ReactSlider
                className="vertical-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                orientation="vertical"
                onChange={(value)=>{
                  setPattern([pattern[0], value, pattern[2], pattern[3], pattern[4]]);
                }}
                renderThumb={(props, state) => <div {...props}><div style={{marginLeft:3, marginTop:3, width:30, height:30, borderRadius:15, background:"rgb(0,255,123)"}}></div></div>}
            />
            <div style={{margin:5, color:"white"}}>2</div>
          </div>
          <div>
            <ReactSlider
                className="vertical-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                orientation="vertical"
                onChange={(value)=>{
                  setPattern([pattern[0], pattern[1], value, pattern[3], pattern[4]]);
                }}
                renderThumb={(props, state) => <div {...props}><div style={{marginLeft:3, marginTop:3, width:30, height:30, borderRadius:15, background:"rgb(0,255,123)"}}></div></div>}
            />
            <div style={{margin:5, color:"white"}}>3</div>
          </div>
          <div>
            <ReactSlider
                className="vertical-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                orientation="vertical"
                onChange={(value)=>{
                  setPattern([pattern[0], pattern[1], pattern[2], value, pattern[4]]);
                }}
                renderThumb={(props, state) => <div {...props}><div style={{marginLeft:3, marginTop:3, width:30, height:30, borderRadius:15, background:"rgb(0,255,123)"}}></div></div>}
            />
            <div style={{margin:5, color:"white"}}>4</div>
          </div>
          <div>
            <ReactSlider
                className="vertical-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                orientation="vertical"
                onChange={(value)=>{
                  setPattern([pattern[0], pattern[1], pattern[2], pattern[3], value]);
                }}
                renderThumb={(props, state) => <div {...props}><div style={{marginLeft:3, marginTop:3, width:30, height:30, borderRadius:15, background:"rgb(0,255,123)"}}></div></div>}
            />
            <div style={{margin:5, color:"white"}}>5</div>
          </div>
          
        </div>
        <div className="bottombox">

          <div className="textcontainer">
            <div className="bottomtext">Pull down the sliders in the order as shown on the screen</div>
          </div>
          <img src={finger} className="finger" alt="finger" />
        </div>
      </div>
    </div>
  );
}

export default App;
