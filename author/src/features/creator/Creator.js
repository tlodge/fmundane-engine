import {useState}  from 'react';
import {LinkCreator} from './LinkCreator';
import { useSelector, useDispatch } from 'react-redux';
import Speech from './Speech';
import Actions from './Actions';
import {
   selectParent,   
   addToParent,
   updateNode,
} from '../layer/layerSlice';


import {
   setName,
   setRule,
   setType,
   setOnstart,
   setViewAddNode,
   setActions, 
   selectName,  
   selectRule,        
   selectOnstart,    
   selectActions,
   selectType,
} from './creatorSlice';
//mirror a local copy and only update on button press, which then means that we keep the old identity locally before
//making the change from,to
export function Creator({onClose}) {
    const dispatch = useDispatch();
    const [tab, setTab] = useState("new");

    const [speechTab, setSpeechTab] = useState(true);

    const {id:parent, type:parenttype}    = useSelector(selectParent);

    const name      = useSelector(selectName);
    const rule      = useSelector(selectRule);
    const onstart    = useSelector(selectOnstart);
    const actions   = useSelector(selectActions);
    const type      = useSelector(selectType);

    console.log("onstart is", onstart);

    const [node, setNode] = useState({name,rule,onstart,actions,type});
   
    const createNode = ()=>{
        
        const _node = {
            name: node.name.replace(/\s/g, ""),
            id: node.name.replace(/\s/g, "_"),
            onstart: node.onstart,
            type:node.type,
            subscription : node.type == "button" || node.type.trim()=="" ? `/press` : `/${node.type}`,
        }
     
        dispatch(addToParent(_node, node.rule, [[]]));
        reset();
    }
    
    const speechChanged = (lines)=>{
        setNode({...node, onstart:{...node.onstart,speech:lines}});
        dispatch(setOnstart({...node.onstart,speech:lines}));
    }

    const ruleChanged = (rule = "")=>{
        setNode({...node, rule})
        //dispatch(setRule(rule));
    }

    const nameChanged = (name = "")=>{
        setNode({...node, name})
        //dispatch(setName(name));
    }

    const actionChanged = (actions)=>{
        setNode({...node, onstart:{...node.onstart,actions}});
        dispatch(setOnstart({...node.onstart,actions}));
    }

    const typeChanged = (type)=>{
        const subscription = type=="speech" ? "/speech" : "/press";
        setNode({...node, type, subscription})
    }

    const _updateNode = ()=>{
        console.log("UPdating node", {node:name, ...node});
        dispatch(updateNode({node:name, ...node}));
        dispatch(setViewAddNode(false))
        reset();
    }

    const reset = ()=>{
        dispatch(setName(""));
        dispatch(setRule(""));
        dispatch(setOnstart({}));
        dispatch(setType(""));
        setNode({name:"",rule:"", onstart:{}, actions:"", type:"button"});
    }

    const renderSpeech = ()=>{
        console.log("in rendr sppech with", node);
        return <div className="flex  flex-col shadow p-2 mt-4">
                    <div className="font-bold text-xs flex justify-start">SPEECH (when this node starts)</div>
                    <div className="flex flex-col mt-2 items-start">
                        <Speech lines={node.onstart.speech} speechChanged={speechChanged}/>
                    </div>
                </div>
    }

    const renderActions = ()=>{
        return <div><Actions actions={node.onstart.actions} actionChanged={actionChanged}/></div>
    }

    const renderRule = ()=>{
        if (!parent){
            return;
        }
        const info = parenttype === "button" ? `the name of the button pressed to trigger ${parent}->this node` : `the keyword(s) that are spoken to trigger ${parent}->this node`;
        return <div className="flex flex-col mt-2 items-start">
            <label>rule</label>
            <input type="text" value={node.rule} onChange={(e)=>{ruleChanged(e.target.value)}} className="p-1 mt-2"></input>
            <label className="text-xs mt-1">{info}</label>
        </div>
    }
    const renderCurrent = ()=> <LinkCreator/>

    const renderNew = ()=>{
        return <div className="flex justify-start flex-col">
        <div className="flex flex-col mt-2 items-start">
            <label>node name</label>
            <input type="text" value={node.name} onChange={(e)=>{nameChanged(e.target.value)}} className="p-1 mt-2"></input>
            <label className="text-xs mt-1">a unique name for this node</label>
        </div>
        {parent && renderRule()}
       
       <div className="bg-gray-100 mt-4">
            <div className="flex items-start flex-col p-4">
                <div>on start</div>
                <div className="text-xs text-gray-500">(the speech and actions that run when this node is triggered)</div>
            </div>
           
                <div className="flex flex-row ">
                    <div onClick={()=>{setSpeechTab(true)}} className={`text-xs font-bold p-4 ${speechTab  ? "text-blue-500" : "text-gray-500"}`}>speech</div>
                    <div onClick={()=>{setSpeechTab(false)}} className={`text-xs font-bold p-4 ${!speechTab ? "text-blue-500" : "text-gray-500"}`}>actions</div>
                </div>
                {speechTab && renderSpeech()}
                {!speechTab && renderActions()}
      
        </div>
        <div className="flex flex-row justify-center items-center">
            {parent &&  <div> <button onClick={createNode} className="p-2 mt-4 bg-blue-500 text-white">Create node!</button></div>}
            {!parent &&  <div> <button onClick={_updateNode} className="p-2 mt-4 bg-blue-500 text-white">Update node</button></div>}
            <div> <button onClick={onClose} className="ml-4 p-2 mt-4 bg-blue-500 text-white">Close</button></div>
        </div>
    </div>
    }

    return  <div className="flex flex-col">
                <div className="flex justify-end items-center text-xl"><div  onClick={onClose} className="flex justify-center items-center  rounded-full  text-xs bg-pink-500 text-white h-6 w-6 shadow">x</div></div>
                <div className="flex flex-row ">
                    <div onClick={()=>{setTab("new")}} className={`font-bold p-4 ${tab=="new" ? "text-blue-500" : "text-gray-500"}`}>new node</div>
                    <div onClick={()=>{setTab("current")}} className={`font-bold p-4 ${tab=="current" ? "text-blue-500" : "text-gray-500"}`}>existing node</div>
                </div>
                <div className="flex flex-row ">
                    <div onClick={()=>{typeChanged("button")}} className={`text-xs font-bold p-4 ${node.type=="button" ? "text-blue-500" : "text-gray-500"}`}>button</div>
                    <div onClick={()=>{typeChanged("speech")}} className={`text-xs font-bold p-4 ${node.type=="speech" ? "text-blue-500" : "text-gray-500"}`}>speech</div>
                </div>
                {tab=="new" && renderNew()}
                {tab=="current" && renderCurrent()}
            </div>
}