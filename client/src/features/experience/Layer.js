import Buttons from "./Buttons";
import Speech from "./Speech";
import Gesture from "./Gesture";

import superagent from "superagent";

function Layer(e) {

    console.log("in render layer wit", e);
    const renderEvent = (event)=>{

        switch (event.type){
            case "button":
                return <Buttons ready={event.ready} names={event.data} buttonPressed={(b)=>{
                    
                    superagent.get("/event/press").query({name:b}).end((err, res) => {
                    if (err){
                        console.log(err);
                    }  
                   
                    });
                }}/>
            case "speech":
                return <Speech  {...event}/>

            case "gesture":
                return <Gesture {...event}/>

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