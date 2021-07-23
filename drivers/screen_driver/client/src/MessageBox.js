import "./MessageBox.css";

export default function MessageBox({message}) {
    
    const show = message.trim() != "";
    
    const renderMessage = ()=>{

                return <div style={{position: "absolute", zIndex:10000, bottom: 0, background: "black", width:"100vw", display:"flex", justifyContent:"center"}}>
                            <div style={{justifyContent:"center", alignItems:"center", height:"150px", display:"flex"}}>
                                <div className="typewriter" style={{fontSize:"50px", fontFamily:"monospace", color:"white"}}>{message}</div>
                            </div>
                      </div>
    }

    return show && renderMessage()
}