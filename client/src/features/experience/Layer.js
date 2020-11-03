import Buttons from "./Buttons";
import Speech from "./Speech";
import superagent from "superagent";

function Layer(e) {

    const renderEvent = (event)=>{
       
        switch (event.type){
            case "button":
                return <Buttons names={event.data} buttonPressed={(b)=>{
                    
                    superagent.get("/event/press").query({name:b}).end((err, res) => {
                    if (err){
                        console.log(err);
                    }  
                   
                    });
                }}/>
            case "speech":
                return <Speech/>
            default:
                return JSON.stringify(event,null,4)
        }
    }

    return (
        <div className="max-w-sm text-black m-2 p-4 rounded bg-white overflow-hidden shadow-lg"> 
            <div className="text-xs mb-4">{`${e.id} (${e.data.type})`} </div> 
            <div>{renderEvent(e.data)}</div>
        </div>
    );
}

export default Layer;