import {useState}  from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from './Actions';

import {
    linkToEdit,
    setEditLink,
} from './creatorSlice';

import {
    updateLink
} from '../layer/layerSlice';

export function ActionCreator({onClose}) {
    const dispatch = useDispatch();
    const link    = useSelector(linkToEdit) || {};
    const {from={},to={}} = link;
    
    const [actions, setActions] = useState(to.actions)
    const [rules, setRules] = useState(to.op||"");

    /*
      <div className="flex flex-col mt-2 items-start">
                    <input type="text" placeholder="action list" value={actions} onChange={(e)=>{actionChanged(e.target.value)}}></input>
                    <label className="text-xs mt-1 justify-start">format: a1,a2,a3|a5,a6 </label>
                </div>*/

    const actionChanged = (actions)=>{
        console.log("seen action changed!", actions);
        setActions(actions);
    }

    const ruleChanged = (value)=>{
        setRules(value);
    }
    const _updateLink = ()=>{
        dispatch(updateLink({from:from.name, to:to.name, actions:actions, rules:rules}))
        dispatch(setEditLink());
    }

    const renderRules = ()=>{
           return  <>
                <div className="font-bold text-xs flex justify-start">rules</div>
                <div className="font-bold text-xs flex justify-start">{`rules to trigger move from ${from.name} to ${to.name}`}</div>
                <div className="flex flex-col mt-2 items-start">
                    <input type="text" placeholder="action list" value={rules} onChange={(e)=>{ruleChanged(e.target.value)}}></input>
                    <label className="text-xs mt-1 justify-start">format: a,b,c</label>
                </div>
            </>
    }

    const renderActions = ()=>{
        return <>
                <div className="font-bold text-xs flex justify-start">actions</div>
                <div className="font-bold text-xs flex justify-start">{`actions executed on move from ${from.name} to ${to.name}`}</div>
                <Actions actions={actions} actionChanged={actionChanged}/>
              
            </>
    }
    return <div className="flex flex-col shadow p-2 mt-4">
                <div className="flex justify-end items-center text-xl"><div  onClick={onClose} className="flex justify-center items-center  rounded-full  text-xs bg-pink-500 text-white h-6 w-6 shadow">x</div></div>
                {renderRules()}
                {renderActions()}
                <button onClick={_updateLink} className="p-2 mt-4 bg-blue-500 text-white">Update link</button>
            </div>
}