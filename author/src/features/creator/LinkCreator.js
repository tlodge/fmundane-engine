import {useState}  from 'react';
import { useSelector, useDispatch } from 'react-redux';



import {
   selectNodeIds,
   selectParent,
   createLink
} from '../layer/layerSlice';


//mirror a local copy and only update on button press, which then means that we keep the old identity locally before
//making the change from,to
export function LinkCreator({onClose}) {
    const dispatch = useDispatch();
    const nodes     = useSelector(selectNodeIds);
    const [linknode, setLinkNode] = useState(nodes[0]);
    const [rule, setRule] = useState("");
    const [actions, setActions] = useState("");
    const parent    = useSelector(selectParent);

    const _createLink = ()=>{
        dispatch(createLink({from:parent, to:linknode, rule, actions}))
    }

    const ruleChanged = (rule = "")=>{
        setRule(rule);
        //setNode({...node, rule})
        //dispatch(setRule(rule));
    }

    const actionChanged = (actions)=>{
        setActions(actions);
        //setNode({...node, actions})
        //dispatch(setActions(action));
       
    }

    const selectLinkNode = (e)=>{
        setLinkNode(e.target.value)
    }


    const renderActions = ()=>{


       return   <div className="flex flex-col mt-2 items-start p-4">
                    <div className="font-bold text-xs flex justify-start">ACTION</div>
                    <div className="flex flex-col mt-2 items-start">
                        <input type="text" placeholder="action list" value={actions} onChange={(e)=>{actionChanged(e.target.value)}}></input>
                        <label className="text-xs mt-1 justify-start">format: a1,a2,a3|a5,a6 </label>
                    </div>
                 </div>
    }

    const renderRules = ()=>{
        return <div className="flex flex-col mt-2 items-start p-4">
                    <div className="font-bold text-xs flex justify-start">RULE</div>
                    <div className="flex flex-col mt-2 items-start">
                        <input type="text" placeholder="rule list"  value={rule} onChange={(e)=>{ruleChanged(e.target.value)}}></input>
                        <label className="text-xs mt-1 justify-start">button name</label>
                    </div>
                </div>
    }

   

    const renderLinkTo = ()=>{
        
        const items = nodes.map(n=><option key={n} value={n}>{n}</option>);
        
        return <div className="flex flex-col mt-2 items-start p-4">
            <label>node</label>
                    <select value={linknode} onChange={selectLinkNode}>
                    {items}
                </select>
                </div>
    }
  
    return <div className="flex flex-col">
    <div className="flex flex-row shadow p-2 mt-4">
            <div className="flex  flex-col">
                {renderLinkTo()}
            </div>
            <div className="flex  flex-col">
                {renderRules()}
            </div>
            <div className="flex  flex-col ">
                {renderActions()}
            </div>
           
    </div>
    <div> <button onClick={()=>{_createLink()}} className="p-2 mt-4 bg-blue-500 text-white">create link</button></div>
    </div>
    
}