import {useState} from 'react';
import request from 'superagent';

export function Uploader({close=()=>{}, success=()=>{}}){

    const [error, setError] = useState("");
    const [file, setFile] = useState();

    const changeHandler = (event) => {
		setFile(event.target.files[0]);
	};

	const handleSubmission = () => {
        console.log(file);
        const formData = new FormData(); 
     
            // Update the formData object 
        formData.append( 
            "mediaFile", 
            file,
            file.name 
        ); 

        request.post("/media/upload").send(formData).end(function(err, response) {
            console.log(err, response);
            if (!err){
                setFile(undefined);
                success(file.name);
            }
        });
	};

    const renderError = ()=>{
        return <div className="text-red-600 p-4 text-bold justify-center">{error}</div>
    }
    const renderUpload = ()=>{
        return <div className="flex flex-col p-4 items-center">
            <input type="file" name="file" onChange={changeHandler} />
            <div className="flex flex-row p-4 items-center">
            {file &&  <div onClick={handleSubmission} className="m-2 p-2 bg-blue-500 text-white">upload</div>}
            <div onClick={close} className="m-2 p-2 bg-blue-500 text-white">CANCEL</div>
            </div>
        </div>
    }
    
    return <div style={{width:350}}>
        <div className="text-center shadow-lg flex flex-col">
            {renderUpload()}
            {error && renderError()}
        </div>
        
    </div>
}