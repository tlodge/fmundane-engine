import { createAsyncThunk, createSlice, isAsyncThunkAction } from '@reduxjs/toolkit';
import {showAddNode} from '../creator/creatorSlice';

const _nodesById = {
      "e1" : {
        "name": "e1",
        "id": "e1",
        "onstart": [
            {
                "speech": "something to say",
                "duration": 1000
            },
            {
                "speech": "and something after a second.",
            }
        ],
        "type": "button",
        "subscription": "/press",
        "rules": []
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
    //not used?
    addNode : (state, action)=>{
      state.nodes = [...state.nodes, action.payload.id]
      state.nodesById = {
          ...state.nodesById,
          [action.payload.id] : action.payload,
      }
    },
    updateNode : (state, action)=>{

        const {node,name,speech} = action.payload;
        console.log("have ", node, name, speech);

        //TODO - SORT ROOT NODE - ID THIS IS THE ONE CHANGED!!
        state.nodesById = Object.keys(state.nodesById).reduce((acc, key)=>{
            console.log("key is", key, " node is", node);
            if (key == node){
                console.log("a match!!", name);
                return {
                    ...acc,
                    [name] : {
                        ...state.nodesById[key],
                        name,
                        id: name.replace(/\s/g, "_"),
                        onstart: speech,
                        rules :  (state.nodesById[key].rules || []).map((rule)=>{
                            if (rule.next === node){
                                return {...rule, next:name}
                            }
                            return rule;
                        })
                    }
                }
            }
            return {
                ...acc,
                [key] : {
                    ...state.nodesById[key],
                    rules :  (state.nodesById[key].rules || []).map((rule)=>{
                        if (rule.next === node){
                            return {...rule, next:name}
                        }
                        return rule;
                    })
                }
            }
        },{});

        state.nodes = state.nodes.reduce((acc, item)=>{
            if (item == node){
                return [...acc, name]
            }
            return [...acc, item];
        },[])

        state.lut = createLut(state.nodesById);
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
        state.nodesById = Object.keys(state.nodesById).reduce((acc,key)=>{
            const node = state.nodesById[key];
            if (key !== state.parent){
                return {
                    ...acc,
                    [key] : node
                }
            }else{
                return {
                    ...acc,
                    [key] : {
                        ...node,
                        rules : [...node.rules, {rule: {"operator":"equals", "operand":action.payload.op}, actions:action.payload.actions, next:action.payload.next}]
                    }
                }
            }
        },{})
    }
  }
});



export const { addNode, setParent, setChild, updateParent,setLookup,generateLookuptable,setEditNode,updateNode} = layerSlice.actions;

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
    return (dispatch, getState)=>{
       
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
            return {
                        ...acc,
                        [key] : {
                            ...nodesById[key],
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
                    }
        },{});

       console.log(JSON.stringify(items,null,4));
    }
}

export const addRulesToParent = (op, actions, next)=>{

    return (dispatch, getState)=>{
        dispatch(updateParent({op, actions, next}));
        dispatch(generateLookuptable());
        dispatch(showAddNode(false));
    }
}

export const selectNodes        = state => state.layer.nodesById;
export const selectParent       = state => state.layer.parent;
export const selectChild        = state => state.layer.child;
export const selectTree         = state => state.layer.lut;
export const selectNodeToEdit   = state => state.layer.node;

export default layerSlice.reducer;
