import {useState} from 'react';

export function Importer({save, cancel}){
    
    const [json, setJSON] = useState("{}");
    const [error, setError] = useState("");
    const [name, setName] = useState("");

    const handleChange = (e)=>{
        setJSON(e.target.value);
    }

    const importIt = ()=>{
        try {
            const toimport = JSON.parse(json);
            setError("");
            if (name.trim()==""){
                setError("Please provide a name for this file");
                return;
            }
            save(name,toimport);
        }catch(err){
            setError("Error with JSON file, please correct and try again")
        }
    }

    const renderError = ()=>{
        return <div className="text-red-600 p-4 text-bold justify-center">{error}</div>
    }


    return <div className="absolute top-0 flex items-center justify-center w-screen h-screen">
        <div className="w-1/2 text-center shadow flex flex-col">
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="name" className="p-2 bg-gray-400"></input>
            <textarea rows={30} value={json} onChange={handleChange} style={{width:"100%"}} className="p-4" placeholder="JSON file"></textarea> 
            {error.trim != "" && renderError()}
            <div className="flex flex-row justify-center"><div onClick={importIt} className="m-2 p-2 bg-blue-500 text-white">IMPORT!</div><div onClick={cancel} className="m-2 p-2 bg-blue-500 text-white">CANCEL</div></div>
        </div>
        
    </div>
}