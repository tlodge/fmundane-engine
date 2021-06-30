import { useSelector, useDispatch } from 'react-redux';
import Tree from './Tree';
import {useEffect} from 'react';

import {
   selectTree,
   selectNodes,
   selectParent,
   selectChild,
   selectAuthored,
   setLookuptable, 
   setParentToAddTo,
   setParent,
   setChild,
   exportNodes,
   fetchAuthored,
   fetchLayers,
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
    const authored = useSelector(selectAuthored);
    const _exportNodes = ()=>dispatch(exportNodes());


  useEffect(()=>{
    dispatch(fetchAuthored());
  },[])

    const renderAuthored = ()=>{
        return authored.map(a=>{
          return <div key={a} className="p-2 text-white text-xs" onClick={()=>{dispatch(fetchLayers(a))}}>{a}</div>
        })
      }

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
                    closeEditAction     = {()=>dispatch(setEditLink())} 
                    setParentToAddTo    = {(parent)=>dispatch(setParentToAddTo(parent))} 
                    editNode            = {(node)=>dispatch(editNode(node))}
                    editActions         = {(link)=>dispatch(setEditLink(link))}
                    setParent           = {(parent)=>dispatch(setParent(parent))}
                    setChild            = {(child)=>dispatch(setChild(child))}
            />
        }
    }
    return  <div>
                <div  className="bg-blue-500 text-white w-screen h-12 fixed flex items-center">
                    <div className="flex flex-grow pl-4 text-xs" onClick={()=>{_exportNodes()}}>SAVE & EXPORT</div>
                    <div className="flex justify-end items-center"><div className="text-xs p-2">LOAD</div>{renderAuthored()}</div>
                </div>
                {renderTree()}
               
            </div>
}