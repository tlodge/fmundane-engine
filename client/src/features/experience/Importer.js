import {useState} from 'react';
import {useDispatch } from 'react-redux';
import {fetchAuthored} from './experienceSlice';

export function Importer({save, cancel}){
    const dispatch = useDispatch();
    const [json, setJSON] = useState({});
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState();

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = () => {
        const fileReader = new FileReader();
        fileReader.readAsText(selectedFile, "UTF-8");
        fileReader.onload = e => {
            try{
                setJSON(JSON.parse(e.target.result))
            }catch(err){

            }
        };
	};

    const importIt = async ()=>{
        try {
            
            setError("");
            if (name.trim()==""){
                setError("Please provide a name for this file");
                return;
            }
            await save(name,json);
            dispatch(fetchAuthored());
        }catch(err){
            setError("Error with JSON file, please correct and try again")
        }
    }

    const renderError = ()=>{
        return <div className="text-red-600 p-4 text-bold justify-center">{error}</div>
    }
    const renderUpload = ()=>{
        return <div className="flex flex-row p-4 items-center">
            <input type="file" name="file" onChange={changeHandler} />
            {selectedFile &&  <div onClick={handleSubmission} className="m-2 p-2 bg-blue-500 text-white">upload</div>}
            <div onClick={cancel} className="m-2 p-2 bg-blue-500 text-white">CANCEL</div>
        </div>
    }
    
    const renderName = ()=>{
        return   <div className="flex flex-col text-center p-4 items-center justify-center">
                    <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="give it a name" className="w-64 p-2 bg-gray-400"></input>
                    <div className="flex flex-row justify-center items-center">
                        <div onClick={importIt} className="m-2 p-2 bg-blue-500 text-white">IMPORT!</div>
                        <div onClick={cancel} className="m-2 p-2 bg-blue-500 text-white">CANCEL</div>
                    </div>
                </div>
    }

    return <div className="relative flex justify-end">
        <div className="text-center shadow-lg flex flex-col">
            {Object.keys(json).length > 0 && renderName()}
            {Object.keys(json).length <= 0 && renderUpload()}
            {error && renderError()}
        </div>
        
    </div>
}