import {useState}  from 'react';
import Speech from './Speech';

import { useSelector, useDispatch } from 'react-redux';



import {
   addNewNode,
   selectParent,   
   addToParent,
   updateNode,
} from '../layer/layerSlice';


import {
   setName,
   setRule,
   setSpeech,
   setActions, 
   selectName,  
   selectRule,        
   selectSpeech,    
   selectActions,    
} from './creatorSlice';

//mirror a local copy and only update on button press, which then means that we keep the old identity locally before
//making the change from,to
export function Creator() {
    const dispatch = useDispatch();
    const parent    = useSelector(selectParent);
    const name      = useSelector(selectName);
    const rule      = useSelector(selectRule);
    const speech    = useSelector(selectSpeech);
    const actions   = useSelector(selectActions);

    const [node, setNode] = useState({name,rule,speech,actions});

    const createNode = ()=>{
        
        const _node = {
            name: node.name,
            id: node.name.replace(/\s/g, "_"),
            onstart: node.speech,
            type:"button",
            subscription : `/press`,
            rules: [],
        }
        const _actions =  (node.actions||"").split("|").map((line)=>{
            return line.split(",");
        });

        dispatch(addToParent(_node, node.rule, _actions));
        reset();
    }
    
    const speechChanged = (speech = [])=>{
        console.log("setting speech", speech);
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

    const _updateNode = ()=>{
        dispatch(updateNode({node:name, name:node.name,speech:node.speech}));
        //reset();
    }

    const reset = ()=>{
        dispatch(setName(""));
        dispatch(setRule(""));
        dispatch(setSpeech([]));
        dispatch(setActions(""));
        setNode({name:"",rule:"", speech:[], actions:""});
    }

    const renderRule = ()=>{
        return <div className="flex flex-col mt-2 items-start">
            <label>rule</label>
            <input type="text" value={node.rule} onChange={(e)=>{ruleChanged(e.target.value)}} className="p-1 mt-2"></input>
            <label className="text-xs mt-1">the name of the button that will trigger this event</label>
        </div>
    }

    return<div className="flex flex-col">
        <div className="flex justify-start flex-col">
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
            </div>
            {parent &&  <div> <button onClick={createNode} className="p-2 mt-4 bg-blue-500 text-white">Create node!</button></div>}
            {!parent &&  <div> <button onClick={_updateNode} className="p-2 mt-4 bg-blue-500 text-white">Update node</button></div>}
    </div>
}