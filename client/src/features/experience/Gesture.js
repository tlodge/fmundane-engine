import {useCamera} from "../../useCamera";
import React, { createRef } from 'react';

function Gesture({rules, gestureObserved}) {
      const videoRef = createRef();
      const [video, isCameraInitialised, running, setPlaying, error] = useCamera(videoRef);
      
      const renderOperands = ()=>{
            const operands = rules.reduce((acc, item)=>{
                  return [...acc, ...item.rule.operand]
            },[]);
      
      
      
            return  operands.map(b=>{
                  return   <button key={b} onClick={()=>gestureObserved(b)} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{b}</button>
            });
      }
      
      const renderCamera = ()=>{
            return <><video
            ref={videoRef}
            autoPlay={true}
            muted={true}
            controls
            width="auto"
            height={400}/>
            
            </>
            
      }

      return (<div>
                  {renderCamera()}
                  <div className="p-4">{renderOperands()}</div>     
            </div>);
 }
 
 export default Gesture;