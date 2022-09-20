import onestar from './1star.svg';
import twostars from './2stars.svg';
import threestars from './3stars.svg';
import bucket from './bucket.svg';
import dedupdata from './dedupdata.svg';
import storage from './storage.svg';
import lock from './lock.svg';
import './App.css';
import {useEffect, useState, useRef} from 'react';
import request from 'superagent';

function App() {
   
  const [selected, setSelected] = useState({
    "option1": false,
    "option2": false,
    "option3": false,
  });

  const _toggleSelection = (option)=>{
    setSelected({
      ...selected,
      [option]: !selected[option]
    })
  }

  const trigger = async ()=>{
    console.log("triggering!");
    await request.get("/event/webhook?trigger=optionscomplete")
  }
  
  return (
    <div className="App" style={{overflow:"hidden"}}>
      
      <div style={{background:"rgb(151,77,242)", width:"100vw", display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div className="optionsarea">
            <div className="boxrow">
                  <div onClick={()=>_toggleSelection("option1")} className="option" >
                      <div className="innerborder" style={{background: selected["option1"] ? "#4C17BD":"transparent"}}>
                        <img className="imgoption" src={bucket}/>
                      </div>
                  </div>
                  <div onClick={()=>_toggleSelection("star1")} className="starrating">
                  <div className="innerborder" style={{background: selected["star1"] ? "#4C17BD":"transparent"}}>
                    <img  className="imgstar" src={threestars}/>
                    </div>
                  </div>
            </div>
            <div className="boxrow">
                  <div onClick={()=>_toggleSelection("option2")} className="option">
                    <div className="innerborder" style={{background: selected["option2"] ? "#4C17BD":"transparent"}}>
                      <img className="imgoption" src={storage}/>
                    </div>
                  </div>
                  <div onClick={()=>_toggleSelection("star2")} className="starrating">
                  <div className="innerborder" style={{background: selected["star2"] ? "#4C17BD":"transparent"}}>
                    <img  className="imgstar" src={twostars}/>
                  </div>
                  </div>
            </div>
            <div className="boxrow">
                  <div onClick={()=>_toggleSelection("option3")} className="option">
                  <div className="innerborder" style={{background: selected["option3"] ? "#4C17BD":"transparent"}}>
                    <img className="imgoption" src={dedupdata}/>
                    </div>
                  </div>
                  <div onClick={()=>_toggleSelection("star3")} className="starrating">
                  <div className="innerborder" style={{background: selected["star3"] ? "#4C17BD":"transparent"}}>
                    <img className="imgstar" src={onestar}/>
                    </div>
                  </div>
            </div>
        </div>
        <div className="lockincontainer">
              <div onClick={trigger} className="lockin"><img className="imglock" src={lock}/>Lock in choices</div>
        </div>
        <div className="bottombox">

          <div className="textcontainer">
            <div className="bottomtext">Select which sustainable options you would like for your caravan.</div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default App;
