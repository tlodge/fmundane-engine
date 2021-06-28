import { useSelector, useDispatch } from 'react-redux';
import Tree from './Tree';

import {
   selectTree,
   selectNodes,
   selectParent,
   selectChild,
   setLookuptable, 
   setParentToAddTo,
   setParent,
   setChild,
   exportNodes,
  
} from './layerSlice';

import {
    setViewAddNode,
    selectViewAdd,
    editNode,
    setEditLink
} from '../creator/creatorSlice'

export function Layer() {

    const dispatch = useDispatch();
    const nodes = useSelector(selectNodes);
    const lut  = useSelector(selectTree);
    const addNew  = useSelector(selectViewAdd);
    const parent = useSelector(selectParent);
    const child = useSelector(selectChild);



    const renderTree = ()=>{
        if (lut){
            return <Tree    
                    lookuptable={lut} 
                    nodes={nodes} 
                    addNew={addNew} 
                    parent={parent}
                    child={child}
                    setLookuptable      = {(lut)=>dispatch(setLookuptable(lut))} 
                    toggleAddNew        = {(value)=>dispatch(setViewAddNode(value))} 
                    closeEditAction     = {(value)=>dispatch(setEditLink())} 
                    setParentToAddTo    = {(parent)=>dispatch(setParentToAddTo(parent))} 
                    exportNodes         = {(nodes)=>dispatch(exportNodes(nodes))}
                    editNode            = {(node)=>dispatch(editNode(node))}
                    editActions         = {(link)=>dispatch(setEditLink(link))}
                    setParent           = {(parent)=>dispatch(setParent(parent))}
                    setChild            = {(child)=>dispatch(setChild(child))}
            />
        }
    }
    return  <div>
                {renderTree()}
            </div>
}