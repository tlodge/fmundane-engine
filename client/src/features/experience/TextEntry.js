import {useState} from 'react';


export function TextEntry({close=()=>{}, done=()=>{}}){

   
    const [text, setText] = useState();
    
    return <div className="relative flex justify-end">
        <div className="text-center shadow-lg flex flex-col" style={{width:400}}>
            
                <textarea className="border border-black" rows={4} onChange={e=>setText(e.target.value)} value={text}/>
                <div className="flex flex-row p-4 items-center justify-center">
                    <div onClick={()=>done(text)} className="m-2 p-2 bg-blue-500 text-white">set</div>
                    <div onClick={close} className="m-2 p-2 bg-blue-500 text-white">CANCEL</div>
                </div>
        </div>
        
    </div>
}