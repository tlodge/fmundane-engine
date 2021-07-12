import { createSlice } from '@reduxjs/toolkit';
import {showAddNode} from '../creator/creatorSlice';
import request from 'superagent';

const _nodesById = {
      "e1" : {
        "name": "e1",
        "id": "e1",
        "onstart": {"speech":[
            {
                "words": "something to say",
                "delay": 1000,
                "voice":"Daniel",
                "background":"",

            },
            {
                "words": "and something after a second.",
                "voice":"Daniel",
                "background":"",
            }
        ]},
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
    authored:[],
  },

  reducers: {

    addNode : (state, action)=>{
      console.log("am in add node", action.payload);

      state.nodes = [...state.nodes, action.payload.id]
      state.nodesById = {
          ...state.nodesById,
          [action.payload.id] : action.payload,
      }
     
    },

    createLink: (state, action)=>{

        const {rule, action:a, from, to} = action.payload;
        
        
        
        const _from = from.id;
        console.log("in create link", _from, to);

        const _actions =  (a||"").split("|").map((line)=>{
            return line.split(",");
        });

        console.log("actions are", _actions);
        console.log("b4");
        console.log(JSON.stringify(state.lut,null,4));

        state.lut = {
            ...state.lut, 
            [_from] : [...(state.lut[_from]||[]), {id: `${to}_${Date.now()}`, event:to, op:rule, actions:_actions}]
        }
       
        console.log(JSON.stringify(state.lut,null,4));

    },

    loadNodes : (state, action)=>{
       
        state.nodes = Object.keys(action.payload.nodes);
        state.nodesById = action.payload.nodes; 
        state.lut = createLut(state.nodesById);   
    
    },

    updateLink : (state, action)=>{
      
        const {from,to,actions,rules} = action.payload; 
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
                                op:rules,
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

        const {node,name,speech,type} = action.payload;
      
        console.log("update node", action.payload);

        //TODO - SORT ROOT NODE - ID THIS IS THE ONE CHANGED!!
        state.nodesById = Object.keys(state.nodesById).reduce((acc, key)=>{
           
            if (key == node){
                return {
                    ...acc,
                    [name] : {
                        ...state.nodesById[key],
                        name,
                        type,
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
    setAuthored : (state, action)=>{
        state.authored = action.payload
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



export const { addNode, loadNodes,setParent, setChild, updateParent,setLookup,setAuthored, generateLookuptable,setEditNode,updateNode,updateLink,createLink} = layerSlice.actions;

const unique = (value="", arr=[])=>{
  
    let _value = value;
    let i = 0;
    while (arr.indexOf(_value) != -1){
        _value = `${_value}_${++i}`
    }
   
    return _value;
}

export const fetchAuthored = ()=>(dispatch)=>{
    request.get('/author/authored').then(res => {
      const alist = res.body.layers;
      console.log("great have alist", alist);
      dispatch(setAuthored(alist));
    })
  }

  export const fetchLayers = (layer) => {
    
    return (dispatch, getState)=>{
        request.get('/event/layers').query({layer}).then(res => {
            const [layers={}, ...rest] = res.body;
            const {events=[]} = layers;
            console.log("ok have events", events);
            dispatch(loadNodes({nodes:events}));
        })
        .catch(err => {
            console.log("error resetting events", err);
        });
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



export const  addToParent = (node, rule, actions,)=>{
    
    

    return (dispatch, getState)=>{
        const nodes = getState().layer.nodes;
        const name = unique(node.name, nodes);
        const _node = {...node, type: node.type || "button", name:`${name}`, id:`${name.replace(" ","_")}`};
        dispatch(addNode(_node));
        dispatch(addRulesToParent(rule,actions,_node.name));

        console.log(JSON.stringify(getState().layer.nodesById,null,4));
        console.log(JSON.stringify(getState().layer.lut,null,4));
    }

   

}

export const exportNodes = (name)=>{
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

        console.log("OK LUT IS", JSON.stringify(_lut,null,4));

        const nodesById = getState().layer.nodesById;


        const items = Object.keys(_lut).reduce((acc,key)=>{
            const {type} = nodesById[key];

            if (type==="button"){
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
            }
            if (type === "speech"){
                return [
                    ...acc,
                    {
                        id: key,
                        ...nodesById[key],
                        rules : _lut[key].map(k=>{
                            if (k.op){
                                return {
                                     "rule": {
                                        "operator": "contains",
                                        "operand": k.op
                                    },
                                    "actions": k.actions,
                                    "next": k.event
                                }
                            }else{
                                return {
                                    "rule": {
                                       "operator": "any",
                                   },
                                   "actions": k.actions,
                                   "next": k.event
                               }
                            }
                        })
                    }
                ]
            }
            return acc;
        },[]);

        const layer = {
            "id" : name,
            "start": {
                "actions": [[]],
                "event": getState().layer.nodes[0]
            },
            "events": items
        }
        console.log(JSON.stringify(layer,null,4));
       await request.post('/author/save').set('Content-Type', 'application/json').send({name,layer});
    }
}

export const addRulesToParent = (op, actions, next)=>{

    return (dispatch, getState)=>{
        dispatch(updateParent({op, actions, next}));
        dispatch(showAddNode(false));
    }
}

export const selectNodeIds          = state => state.layer.nodes;
export const selectNodes            = state => state.layer.nodesById;
export const selectParent           = state => state.layer.nodesById[state.layer.parent] ||  {};
export const selectChild            = state => state.layer.child;
export const selectTree             = state => state.layer.lut;
export const selectNodeToEdit       = state => state.layer.node;
export const selectAuthored         = state => state.layer.authored;

export default layerSlice.reducer;
