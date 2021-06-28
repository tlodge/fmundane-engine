import { createSlice } from '@reduxjs/toolkit';
import {showAddNode} from '../creator/creatorSlice';
import request from 'superagent';

const _nodesById = {
      "e1" : {
        "name": "e1",
        "id": "e1",
        "onstart": [
            {
                "words": "something to say",
                "duration": 1000
            },
            {
                "words": "and something after a second.",
            }
        ],
        "type": "button",
        "subscription": "/press",
    }
} 

const createLut = (nbi)=>{
    return Object.keys(nbi).reduce((acc, key, index)=>{
        
        const item = nbi[key];

        if (index == 0){
            acc["root"] = {id:item.id, event:item.id}
        }
        return {
            ...acc,
            [item.id] : (item.rules || []).reduce((acc, item, i)=>{
                if (item.next && item.next.trim() != ""){
                    return [...acc, {id:`${item.next}_${index}_${i}`, event: item.next || "", op:item.rule.operand, actions:item.actions} ]
                }
                return acc;
            },[])
        }
    },{});
}
export const layerSlice = createSlice({
  name: 'layer',
  
  initialState: {
    parent: null,
    child: null,
    lut : createLut(_nodesById),
    nodesById :  _nodesById,
    nodes: Object.keys(_nodesById),
  },

  reducers: {

    addNode : (state, action)=>{
    
      state.nodes = [...state.nodes, action.payload.id]
      state.nodesById = {
          ...state.nodesById,
          [action.payload.id] : action.payload,
      }
     
    },

    updateActions : (state, action)=>{
      
        const {from,to,actions} = action.payload; 
        const _actions =  (actions||"").split("|").map((line)=>{
            return line.split(",");
        });
        
        state.lut = Object.keys(state.lut).reduce((acc, key)=>{
            if (key === from){
                return {
                    ...acc,
                    [key] : state.lut[key].map((item)=>{
                        if (item.event === to){
                            return {
                                ...item,
                                actions: _actions,
                            }
                        }
                        return item;
                    })
                }
            }
            return {...acc,[key]:state.lut[key]}

        },{});
    },

    updateNode : (state, action)=>{

        const {node,name,speech} = action.payload;
      

        //TODO - SORT ROOT NODE - ID THIS IS THE ONE CHANGED!!
        state.nodesById = Object.keys(state.nodesById).reduce((acc, key)=>{
           
            if (key == node){
                return {
                    ...acc,
                    [name] : {
                        ...state.nodesById[key],
                        name,
                        id: name.replace(/\s/g, "_"),
                        onstart: speech,
                    }
                }
            }
            return {
                ...acc,
                [key] : state.nodesById[key]
            }
        },{});

        state.nodes = state.nodes.reduce((acc, item)=>{
            if (item == node){
                return [...acc, name]
            }
            return [...acc, item];
        },[])

        state.lut = Object.keys(state.lut).reduce((acc,key)=>{
            if (key === "root"){
                return {
                    ...acc,
                    root : {
                        id : state.lut["root"].id == node ? name : state.lut["root"].id,
                        event : state.lut["root"].event == node ? name : state.lut["root"].event,
                    }
                }
            }
            if (key == node){
                return {
                    ...acc,
                    [name] : state.lut[node].map(n=>{
                            if (n.event === node){
                                return {
                                    ...n,
                                    event: name,
                                    id: name,
                                }
                            }
                            return n;
                    })
                }
            }
            return {
                ...acc,
                [key] : state.lut[key].map(n=>{
                    if (n.event === node){
                        return {
                            ...n,
                            event: name,
                            id: name,
                        }
                    }
                    return n;
                })
            }
        },{});
    },
    setChild : (state, action)=>{
        state.child = action.payload
    },
    setParent : (state, action)=>{
        state.parent = action.payload
    },
    setLookup : (state, action)=>{
        state.lut = action.payload
    },
    generateLookuptable : (state)=>{
        state.lut = createLut(state.nodesById)
    },
   
    updateParent : (state, action)=>{
      
        state.lut = Object.keys(state.lut).reduce((acc,key)=>{
            if (key != state.parent){
                return {
                    ...acc,
                   [key]: state.lut[key]
                }
            }
            else{
                return {
                    ...acc,
                    [key] : [...(state.lut[key] || []), {event: action.payload.next, id: action.payload.next, op:action.payload.op, actions:action.payload.actions}]
                }
            }
        },{});

        state.lut = {
            ...state.lut,
            [action.payload.next] : state.lut[action.payload.next] || []
        }
    }
  }
});



export const { addNode, setParent, setChild, updateParent,setLookup,generateLookuptable,setEditNode,updateNode,updateActions} = layerSlice.actions;

const unique = (value="", arr=[])=>{
  
    let _value = value;
    let i = 0;
    while (arr.indexOf(_value) != -1){
        _value = `${_value}_${++i}`
    }
   
    return _value;
}
export const addNewNode = (node) => {
  return (dispatch, getState) => {
       dispatch(addNode(node));
  }
}


export const setLookuptable = (lut)=>{
    return (dispatch, getState) => {
        dispatch(setLookup(lut));
    }
}

export const setParentToAddTo = (parent)=>{
    return (dispatch, getState) => {
        dispatch(setParent(parent));
      
    }
}



export const  addToParent = (node, rule, actions)=>{
    return (dispatch, getState)=>{
        const nodes = getState().layer.nodes;
        const name = unique(node.name, nodes);
        const _node = {...node, name:`${name}`, id:`${name.replace(" ","_")}`};
        dispatch(addNewNode(_node));
        dispatch(addRulesToParent(rule,actions,_node.name))
    }
}

export const exportNodes = ()=>{
    return async (dispatch, getState)=>{
       
        const lut = getState().layer.lut
        const _lut = Object.keys(lut).reduce((acc,key)=>{
            if (key==="root")
                return acc;
            return {
                ...acc,
                [key] : lut[key]
            }
        },{});

        const nodesById = getState().layer.nodesById;


        const items = Object.keys(_lut).reduce((acc,key)=>{
            return [
                    ...acc,
                    {
                        id: key,
                        ...nodesById[key],
                        data: _lut[key].map(k=>k.op),
                        rules : _lut[key].map(k=>{
                               return {
                                 "rule": {
                                    "operator": "equals",
                                    "operand": k.op
                                  },
                                  "actions": k.actions,
                                  "next": k.event
                                }
                        })
                        
                    }
            ]
        },[]);

        console.log(JSON.stringify(items,null,4));

        const layer = {
            "id" : "layer1",
            "start": {
                "actions": [[]],
                "event": getState().layer.nodes[0]
            },
            "events": items
        }

        await request.post('/author/save').set('Content-Type', 'application/json').send(layer);
    }
}

export const addRulesToParent = (op, actions, next)=>{

    return (dispatch, getState)=>{
        dispatch(updateParent({op, actions, next}));
        dispatch(showAddNode(false));
    }
}

export const selectNodes        = state => state.layer.nodesById;
export const selectParent       = state => state.layer.parent;
export const selectChild        = state => state.layer.child;
export const selectTree         = state => state.layer.lut;
export const selectNodeToEdit   = state => state.layer.node;

export default layerSlice.reducer;
