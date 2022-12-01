import {useState, useEffect} from 'react';
import { placeholderType, updatePlaceholder } from '../../utils';
import { Uploader } from "./Uploader";
import {TextEntry} from "./TextEntry";
import request from 'superagent';

export function PlaceholderManager({placeholders={}, close=()=>{}}){

    const [placeholderValues, setPlaceholderValues] = useState({});
    const [expand, setExpand] = useState({});

    const fetchPlaceHolderValues = async()=>{
        const {text="{}"} = await request.get("/placeholders/");
        setPlaceholderValues(JSON.parse(text));
    }

    useEffect(() => {   
       fetchPlaceHolderValues();
    }, []);

    const togglePlaceholders = (value)=>{
        close();
    }

    const toggleExpand = (id, value)=>{
        setExpand({
                ...expand, 
                [`${id}${value}`] : expand[`${id}${value}`] ? false: true
        });
    }

    const _updatePlaceholder= (value, text)=>{
        updatePlaceholder(value, text);
        fetchPlaceHolderValues();
    }

    const renderSpeechPlaceHolder = (value, id)=>{
        return <div key={value} className="flex flex-col pt-2">
                    <div onClick={()=>toggleExpand(id, value)} className="text-sm text-blue-500">{`current text: ${placeholderValues[value] || "[empty]"}`}</div>
                     {expand[`${id}${value}`] && <div>
                        <div className="p-4"> {`set speech for`} <strong>{value}</strong> {"placeholder"}</div>
                        <TextEntry close={()=>{toggleExpand(id, value)}} done={(text)=>{toggleExpand(id, value); _updatePlaceholder(value, text)}}/>
                    </div>}
                </div>
    }

    const renderImagePlaceHolder = (value, id)=>{
        return     <div key={value} className="flex flex-col pt-2">
                        <div onClick={()=>toggleExpand(id, value)} className="p-4 text-blue-500"> {`upload image for`} <strong>{value}</strong> {"placeholder"}</div>
                        <div className="flex justify-center "><img onClick={()=>toggleExpand(id, value)} className="shadow-md" width="250px"  style={{border: "4px solid white"}} src={`assets/${placeholderValues[value]}`}/></div>
                        {expand[`${id}${value}`] && <div>
                            <Uploader close={()=>{toggleExpand(id, value)}} success={(name)=>{toggleExpand(id, value); _updatePlaceholder(value, name)}}/>
                        </div>}
                    </div>
    }

    const renderPlaceholder = (url, placeholder, key)=>{
        const type = placeholderType(url);
        switch (type){
            case "speech":
                return renderSpeechPlaceHolder(placeholder,key);

            case "image":
                return renderImagePlaceHolder(placeholder,key);
        }
    }

    const renderPlaceholders = (key,placeholders)=>{

        const items = Object.keys(placeholders).map(url=>{
            return placeholders[url].map(placeholder=>renderPlaceholder(url, placeholder, key));
        })
        return <div>
            <div className="uppercase font-semibold">{key}</div> 
            {items}      
        </div>
    }

    const renderList = () => Object.keys(placeholders).map((key)=>{
        const placeholder = placeholders[key];
        return <div className="p-4" key={key}>
                    {renderPlaceholders(key, placeholder)}
                   
                </div>
    });

    return <div  className="flex absolute" style={{top:80, left:0, width:"100vw", height:"calc(100vh - 80px)", background:"#ffffff99"}}>
        <div className="bg-white flex flex-col p-4 shadow-lg" style={{width:400, overflowY:"auto", height:"calc(100vh - 100px)"}}>
            <div onClick={togglePlaceholders} className="flex justify-end justify-items-end m-2 p-2 text-black">
               <div className="flex justify-center items-center bg-gray-600 text-white" style={{paddingBottom:5, width:20, height:20, borderRadius:10}}>x</div> 
            </div>
            <div className="text-lg font-semibold text-center w-full">Manage Dynamic Content</div>
           
            {renderList()}
           
        </div>
    </div>
}