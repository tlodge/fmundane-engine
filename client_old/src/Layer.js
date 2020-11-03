
import Buttons from "./Buttons";
import superagent from "superagent";

function Layer(e) {

    const renderEvent = (event)=>{
        console.log("rendeimng", event);
        switch (event.type){
            case "button":
                return <Buttons names={event.data} buttonPressed={(b)=>{
                    console.log(`[${b}] button pressed`);
                    superagent.get("http://localhost:3001/event/press").query({name:b}).end((err, res) => {
                    if (err){
                        console.log(err);
                    }  
                    console.log("pushed event press");
                    });
                }}/>
            default:
                return JSON.stringify(event,null,4)
        }
    }

    return (
        <div className="max-w-sm text-black m-2 p-4 rounded bg-white overflow-hidden shadow-lg"> 
            <div className="text-xs mb-4">{e.id}</div> 
            <div>{renderEvent(e.data)}</div>
        </div>
    );
}

export default Layer;