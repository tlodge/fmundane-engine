import { useSelector, useDispatch } from 'react-redux';
import Tree from './Tree';
import {useEffect, useState} from 'react';

import {
   selectTree,
   selectLayers,
   selectLayerId,
   selectNodes,
   selectParent,
   selectChild,
   selectAuthored,
   setLookuptable, 
   setParentToAddTo,
   setParent,
   setChild,
   setLayer,
   exportNodes,
   fetchAuthored,
   fetchLayers,
   addLayer
} from './layerSlice';

import {
    setViewAddNode,
    selectViewAdd,
    editNode,
    setEditLink,
} from '../creator/creatorSlice'

export function Layer() {

  const dispatch = useDispatch();
  const nodes = useSelector(selectNodes);
  const lut  = useSelector(selectTree);
  const addNew  = useSelector(selectViewAdd);
  const {id:parent} = useSelector(selectParent);
  const child = useSelector(selectChild);
  const authored = useSelector(selectAuthored);
  const _layers = useSelector(selectLayers);
  const layerid = useSelector(selectLayerId);

  const _exportNodes = (name)=>{ 
      dispatch(exportNodes(name));
      toggleSaveDialog(false);
  }

  const [saveDialog, toggleSaveDialog] = useState(false);
  const [name, setName] = useState("");
  const [currentLayer, setCurrentLayer] = useState("");

  useEffect(()=>{
    dispatch(fetchAuthored());
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const {layers=null} = params;
    if (layers){
      dispatch(fetchLayers(layers))
      setCurrentLayer(layers);
    }
  },[])

  const renderAuthored = ()=>{
        return authored.map(a=>{
          //return <div key={a} className="p-2 text-white text-xs" onClick={()=>{dispatch(fetchLayers(a))}}>{a}</div>
          return <a key={a} className="p-2 text-white text-xs" href={encodeURI(`author?layers=${a}`)}>{a}</a>
        })
  }

  const renderSaveDialog = ()=>{
    return <div className="absolute flex w-screen h-screen  items-center justify-center">
              <div className="flex flex-col shadow-xl p-4 bg-white rounded flex justify-items-end items-end ">
                <button onClick={()=>toggleSaveDialog(!saveDialog)} className="rounded-full h-6 w-6 bg-pink-500 text-white">x</button> 
                <div className=" flex flex-row p-4 items-center">
                  <input type="text" className="p-4 mr-4" placeholder="filename" value={name} onChange={(e)=>setName(e.target.value)}></input>     
                  <button onClick={()=>_exportNodes(name)} className="rounded-full h-10 w-10 bg-blue-500 text-white">save</button>              
              </div>
              </div>
            </div>
  }

  const renderLayerSelection = ()=>{
    const _items = _layers.map(l=>{
      const selected = l === layerid;
      return <div className={`p-2 text-xs ${selected ? "font-bold":"text-gray-400"}`} key ={l} onClick={()=>dispatch(setLayer(l))}>{l}</div>
    })
    return <div className="h-10 flex flex-row  mt-12 w-screen bg-black text-white  items-center">
        {_items}
        <div className="ml-4 p-2 text-xs flex items-center justify-center rounded-full bg-white text-black w-4 h-4" key ="add" onClick={()=>{dispatch(addLayer())}}>+</div>
    </div>
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
                    editLink            = {(link)=>dispatch(setEditLink(link))}
                    setParent           = {(parent)=>dispatch(setParent(parent))}
                    setChild            = {(child)=>dispatch(setChild(child))}
            />
        }
  }
  
  return  <div>
     {saveDialog && renderSaveDialog()}
                <div  className="bg-blue-500 text-white w-screen h-12 fixed flex items-center">
                   
                    <div className="flex flex-grow pl-4 text-xs">
                      <div onClick={()=>toggleSaveDialog(!saveDialog)}>SAVE & EXPORT</div>
                      {currentLayer && <a className="flex flex-grow pl-4 text-xs" target="_blank" href={`../?layers=${currentLayer}`}>▶</a>}
                    </div>
                    <div className="flex justify-end items-center mr-8"><div className="text-xs p-2">LOAD</div>{renderAuthored()}</div>
                </div>
                {renderLayerSelection()}
                {renderTree()}
               
            </div>
}