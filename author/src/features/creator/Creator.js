import {useState}  from 'react';
import {LinkCreator} from './LinkCreator';
import { useSelector, useDispatch } from 'react-redux';
import Speech from './Speech';

import {
   selectParent,   
   addToParent,
   updateNode,
} from '../layer/layerSlice';


import {
   setName,
   setRule,
   setType,
   setSpeech,
   setViewAddNode,
   setActions, 
   selectName,  
   selectRule,        
   selectSpeech,    
   selectActions,
   selectType,
} from './creatorSlice';
//mirror a local copy and only update on button press, which then means that we keep the old identity locally before
//making the change from,to
export function Creator({onClose}) {
    const dispatch = useDispatch();
    const [tab, setTab] = useState("new");

    
    const {id:parent, type:parenttype}    = useSelector(selectParent);

    const name      = useSelector(selectName);
    const rule      = useSelector(selectRule);
    const speech    = useSelector(selectSpeech);
    const actions   = useSelector(selectActions);
    const type      = useSelector(selectType);


    const [node, setNode] = useState({name,rule,speech,actions,type});
   
    const createNode = ()=>{
        
        const _node = {
            name: node.name.replace(/\s/g, ""),
            id: node.name.replace(/\s/g, "_"),
            onstart: node.speech,
            type:node.type,
            subscription : node.type == "button" || node.type.trim()=="" ? `/press` : `/${node.type}`,
        }
        const _actions =  (node.actions||"").split("|").map((line)=>{
            return line.split(",");
        });

        dispatch(addToParent(_node, node.rule, _actions));
        reset();
    }
    
    const speechChanged = ({speech = {}})=>{
        setNode({...node, speech})
        dispatch(setSpeech(speech));
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
        setNode({...node, actions})
        //dispatch(setActions(action));
       
    }

    const typeChanged = (type)=>{
        const subscription = type=="speech" ? "/speech" : "/press";
        setNode({...node, type, subscription})
    }

    const _updateNode = ()=>{
     
        dispatch(updateNode({node:name, ...node}));
        dispatch(setViewAddNode(false))
        reset();
    }

    const reset = ()=>{
        dispatch(setName(""));
        dispatch(setRule(""));
        dispatch(setSpeech([]));
        dispatch(setActions(""));
        dispatch(setType(""));
        setNode({name:"",rule:"", speech:[], actions:"", type:"button"});
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
        <div className="flex  flex-col shadow p-2 mt-4">
            <div className="font-bold text-xs flex justify-start">SPEECH (when this node starts)</div>
            <div className="flex flex-col mt-2 items-start">
                <Speech lines={node.speech} speechChanged={speechChanged}/>
            </div>
        </div>
        {parent && <div className="flex  flex-col shadow p-2 mt-4">
            <div className="font-bold text-xs flex justify-start">ACTION (what is called when this node is triggered)</div>
            <div className="flex flex-col mt-2 items-start">
                <input type="text" placeholder="action list" value={node.action} onChange={(e)=>{actionChanged(e.target.value)}}></input>
                <label className="text-xs mt-1 justify-start">format: a1,a2,a3|a5,a6 </label>
            </div>
        </div>}
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