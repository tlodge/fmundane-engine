import Buttons from "./Buttons";
import Speech from "./Speech";
//import Gesture from "./Gesture";
import {setTranscript, sendTranscript, buttonPressed} from './experienceSlice';
import {useDispatch } from 'react-redux';

function Layer(e) {
    const {id} = e;
    const dispatch = useDispatch();
    const renderEvent = (event)=>{

        switch (event.type){
            case "button":
                return <Buttons 
                            ready={event.ready} 
                            names={event.data} 
                            handleAction={(b)=>{
                              
                                dispatch(buttonPressed(b,id));
                            }}/>
            case "speech":
                return <Speech  
                            rules={event.rules} 
                            ready={event.ready} 
                            handleChange={(transcript)=>{
                               
                                dispatch(setTranscript({transcript,layerid:id}));
                            }}
                            handleAction={()=>{
                              
                                dispatch(sendTranscript());
                            }}/>

           

            default:
                return JSON.stringify(event,null,4)
        }
    }

    return (
        <div className="w-full text-black  bg-gray-600 overflow-hidden shadow-lg flex flex-grow flex-col" style={{minHeight:280, overflow:"auto"}}> 
            <div className="flex flex-row text-xs font-semibold p-4 bg-gray-400">
                    <div className="flex flex-grow">{`${e.id} (${e.data.type})`} </div>
                    <div onClick={()=>e.toggleTree(e.id)} className="flex">tree</div>
            </div> 
            <div className="flex justify-center flex-grow">
                {renderEvent({...e.data, ready:e.ready||false})}
            </div>
        </div>
    );
}

export default Layer;