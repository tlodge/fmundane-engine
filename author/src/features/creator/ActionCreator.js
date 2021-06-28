import {useState}  from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    linkToEdit,
    setEditLink,
} from './creatorSlice';

import {
    updateActions
} from '../layer/layerSlice';

export function ActionCreator() {
    const dispatch = useDispatch();
    const link    = useSelector(linkToEdit) || {};

    
    const {from={},to={}} = link;
    
    const [actions, setActions] = useState((to.actions||[]).join(","))
    
    const actionChanged = (value)=>{
        setActions(value);
    }

    const _updateLink = ()=>{
        dispatch(updateActions({from:from.name, to:to.name, actions:actions}))
        dispatch(setEditLink());
    }

    return <div className="flex flex-col shadow p-2 mt-4">
                <div className="font-bold text-base flex justify-start">ACTIONs</div>
                <div className="font-bold text-xs flex justify-start">{`actions triggered on move from ${from.name} to ${to.name}`}</div>
                <div className="flex flex-col mt-2 items-start">
                    <input type="text" placeholder="action list" value={actions} onChange={(e)=>{actionChanged(e.target.value)}}></input>
                    <label className="text-xs mt-1 justify-start">format: a1,a2,a3|a5,a6 </label>
                </div>
                <button onClick={_updateLink} className="p-2 mt-4 bg-blue-500 text-white">Update actions</button>
            </div>
}