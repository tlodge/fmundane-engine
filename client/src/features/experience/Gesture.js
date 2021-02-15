import {useCamera} from "../../useCamera";
import React, { createRef } from 'react';
import {gestureObserved} from './experienceSlice';
import {useDispatch } from 'react-redux';


function Gesture({rules}) {
      const dispatch = useDispatch();
      const videoRef = createRef();
      const [video, isCameraInitialised, running, setPlaying, error] = useCamera(videoRef);
      
      const renderOperands = ()=>{

            const operands = rules.reduce((acc, item)=>{
                  return [...acc, ...item.rule.operand.map(o=>({
                        operand: o,
                        next: item.next,
                  }))]
            },[]);
      
            return  operands.map(b=>{
                  return   <button key={b.operand} onClick={()=>dispatch(gestureObserved(b.operand))} className="bg-blue-500 mr-2 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{`${b.operand} (${b.next})`}</button>
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
                  <div className="p-4 bg-gray-400">
                        <div className="font-semibold text-lg pb-4">override</div>
                        {renderOperands()}
                  </div>     
            </div>);
 }
 
 export default Gesture;