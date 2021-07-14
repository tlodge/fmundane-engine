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
      "layer1":{
        parent: null,
        child: null,
        lut : createLut(_nodesById),
        nodesById :  _nodesById,
        nodes: Object.keys(_nodesById),
        authored:[],
      },
      layerid: "layer1"
  },

  reducers: {

    addNode : (state, action)=>{
  

      state[state.layerid].nodes = [...state[state.layerid].nodes, action.payload.id]
      state[state.layerid].nodesById = {
          ...state[state.layerid].nodesById,
          [action.payload.id] : action.payload,
      }
     
    },

    createLink: (state, action)=>{

        const {rule, actions:a, from, to} = action.payload;
        
        
        
        const _from = from.id;
      

        const _actions =  (a||"").split("|").map((line)=>{
            return line.split(",");
        });

       

        state[state.layerid].lut = {
            ...state[state.layerid].lut, 
            [_from] : [...(state[state.layerid].lut[_from]||[]), {id: `${to}_${Date.now()}`, event:to, op:rule, actions:_actions}]
        }
       
    

    },

    loadNodes : (state, action)=>{
       
        state[state.layerid].nodes = Object.keys(action.payload.nodes);
        state[state.layerid].nodesById = action.payload.nodes; 
        state[state.layerid].lut = createLut(state.nodesById);   
    
    },

    updateLink : (state, action)=>{
      
        const {from,to,actions,rules} = action.payload; 
        const _actions =  (actions||"").split("|").map((line)=>{
            return line.split(",");
        });
        
        state[state.layerid].lut = Object.keys(state[state.layerid].lut).reduce((acc, key)=>{
            if (key === from){
                return {
                    ...acc,
                    [key] : state[state.layerid].lut[key].map((item)=>{
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
            return {...acc,[key]:state[state.layerid].lut[key]}

        },{});
    },

    updateNode : (state, action)=>{

        const {node,name,speech,type} = action.payload;
      
      

        //TODO - SORT ROOT NODE - ID THIS IS THE ONE CHANGED!!
        state[state.layerid].nodesById = Object.keys(state[state.layerid].nodesById).reduce((acc, key)=>{
           
            if (key == node){
                return {
                    ...acc,
                    [name] : {
                        ...state[state.layerid].nodesById[key],
                        name,
                        type,
                        id: name.replace(/\s/g, "_"),
                        onstart: speech,
                    }
                }
            }
            return {
                ...acc,
                [key] : state[state.layerid].nodesById[key]
            }
        },{});

        state[state.layerid].nodes = state[state.layerid].nodes.reduce((acc, item)=>{
            if (item == node){
                return [...acc, name]
            }
            return [...acc, item];
        },[])

        state[state.layerid].lut = Object.keys(state[state.layerid].lut).reduce((acc,key)=>{
            if (key === "root"){
                return {
                    ...acc,
                    root : {
                        id : state[state.layerid].lut["root"].id == node ? name : state[state.layerid].lut["root"].id,
                        event : state[state.layerid].lut["root"].event == node ? name : state[state.layerid].lut["root"].event,
                    }
                }
            }
            if (key == node){
                return {
                    ...acc,
                    [name] : state[state.layerid].lut[node].map(n=>{
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
                [key] : state[state.layerid].lut[key].map(n=>{
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
        state[state.layerid].child = action.payload
    },
    setParent : (state, action)=>{
        state[state.layerid].parent = action.payload
    },
    setAuthored : (state, action)=>{
        state[state.layerid].authored = action.payload
    },
    setLookup : (state, action)=>{
        state[state.layerid].lut = action.payload
    },
    generateLookuptable : (state)=>{
        state[state.layerid].lut = createLut(state[state.layerid].nodesById)
    },
   
    updateParent : (state, action)=>{
      
        state[state.layerid].lut = Object.keys(state[state.layerid].lut).reduce((acc,key)=>{
            if (key != state[state.layerid].parent){
                return {
                    ...acc,
                   [key]: state[state.layerid].lut[key]
                }
            }
            else{
                return {
                    ...acc,
                    [key] : [...(state[state.layerid].lut[key] || []), {event: action.payload.next, id: action.payload.next, op:action.payload.op, actions:action.payload.actions}]
                }
            }
        },{});

        state[state.layerid].lut = {
            ...state[state.layerid].lut,
            [action.payload.next] : state[state.layerid].lut[action.payload.next] || []
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
 
      dispatch(setAuthored(alist));
    })
  }

  export const fetchLayers = (layer) => {
    
    return (dispatch)=>{
        
        request.get('/event/layers').query({layer}).then(res => {
            const [layers={}, ...rest] = res.body;
            const {events=[]} = layers;
            
            dispatch(loadNodes({nodes:events}));
        })
        .catch(err => {
            console.log("error resetting events", err);
        });
    }
  }

export const setLookuptable = (lut)=>{
    return (dispatch) => {
        dispatch(setLookup(lut));
    }
}

export const setParentToAddTo = (parent)=>{
    return (dispatch) => {
        dispatch(setParent(parent));
      
    }
}



export const  addToParent = (node, rule, actions,)=>{
    
    console.log("in add to parent!!", node, rule, actions);

    return (dispatch, getState)=>{
        const layerid = getState().layer.layerid;
        console.log("layerid us", layerid);

        const nodes = getState().layer[layerid].nodes;
        console.log("nodes are", nodes);
        const name = unique(node.name, nodes);
        const _node = {...node, type: node.type || "button", name:`${name}`, id:`${name.replace(" ","_")}`};
        dispatch(addNode(_node));
        dispatch(addRulesToParent(rule,actions,_node.name));

   
    }

   

}

export const exportNodes = (name)=>{
    return async (dispatch, getState)=>{
        const layerid = getState().layer.layerid;
        const lut = getState().layer[layerid].lut;

        const _lut = Object.keys(lut).reduce((acc,key)=>{
            if (key==="root")
                return acc;
            return {
                ...acc,
                [key] : lut[key]
            }
        },{});

  

        const nodesById = getState().layer[layerid].nodesById;


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
                "event": getState().layer[layerid].nodes[0]
            },
            "events": items
        }
  
       await request.post('/author/save').set('Content-Type', 'application/json').send({name,layer});
    }
}

export const addRulesToParent = (op, actions, next)=>{

    return (dispatch, getState)=>{
        dispatch(updateParent({op, actions, next}));
        dispatch(showAddNode(false));
    }
}

export const selectNodeIds          = state => state.layer[state.layer.layerid].nodes;
export const selectNodes            = state => state.layer[state.layer.layerid].nodesById;
export const selectParent           = state => state.layer[state.layer.layerid].nodesById[state.layer[state.layer.layerid].parent] ||  {};
export const selectChild            = state => state.layer[state.layer.layerid].child;
export const selectTree             = state => state.layer[state.layer.layerid].lut;
export const selectNodeToEdit       = state => state.layer[state.layer.layerid].node;
export const selectAuthored         = state => state.layer[state.layer.layerid].authored;

export default layerSlice.reducer;
