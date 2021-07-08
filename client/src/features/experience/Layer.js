import Buttons from "./Buttons";
import Speech from "./Speech";
import Gesture from "./Gesture";
import {gestureObserved, setTranscript, sendTranscript, buttonPressed} from './experienceSlice';
import {useDispatch } from 'react-redux';

function Layer(e) {

    const dispatch = useDispatch();
    const renderEvent = (event)=>{

        switch (event.type){
            case "button":
                return <Buttons 
                            ready={event.ready} 
                            names={event.data} 
                            handleAction={(b)=>{
                                console.log("button pressed!!!", b);
                                dispatch(buttonPressed(b));
                            }}/>
            case "speech":
                return <Speech  
                            rules={event.rules} 
                            ready={event.ready} 
                            handleChange={(transcript)=>{
                                console.log("setting transcript", transcript);
                                dispatch(setTranscript(transcript));
                            }}
                            handleAction={()=>{
                                console.log("sending transcript");
                                dispatch(sendTranscript());
                            }}/>

            case "gesture":
                return <Gesture rules={event.rules} ready={event.ready} handleAction={(op)=>{
                    dispatch(gestureObserved(op));
                }}/>

            default:
                return JSON.stringify(event,null,4)
        }
    }

    return (
        <div className="w-full text-black  bg-gray-600 overflow-hidden shadow-lg flex flex-grow flex-col"> 
            <div className="text-xs font-semibold mb-4 p-4  bg-gray-400">{`${e.id} (${e.data.type})`} </div> 
            <div className="flex justify-center items-center flex-grow">{renderEvent({...e.data, ready:e.ready||false})}</div>
        </div>
    );
}

export default Layer;