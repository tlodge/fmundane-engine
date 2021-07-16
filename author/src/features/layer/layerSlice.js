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

const templateLayer = ()=>{
    return {
        parent: null,
        child: null,
        lut : createLut(_nodesById),
        nodesById :  _nodesById,
        nodes: Object.keys(_nodesById),
    }
}

const uniqueLayerName = (existing=[])=>{
  let index = 0;
  while (existing.indexOf(`layer${++index}`) != -1){}
  return `layer${index}`;
}

export const layerSlice = createSlice({
  name: 'layer',
  
  initialState: {
      layers:{
        "layer1": templateLayer()
      },
      authored:[],
      layerid: "layer1"
  },

  reducers: {

    addNode : (state, action)=>{
  

      state.layers[state.layerid].nodes = [...state.layers[state.layerid].nodes, action.payload.id]
      state.layers[state.layerid].nodesById = {
          ...state.layers[state.layerid].nodesById,
          [action.payload.id] : action.payload,
      }
     
    },

    setLayer : (state, action)=>{
        state.layerid = action.payload;  
    },

    addLayer : (state, action)=>{
        state.layers = {
            ...state.layers,
            [uniqueLayerName(Object.keys(state.layers))] : templateLayer()
        }
    },

    createLink: (state, action)=>{

        const {rule, actions:a, from, to} = action.payload;
        
        
        
        const _from = from.id;
      

        const _actions =  (a||"").split("|").map((line)=>{
            return line.split(",");
        });

     
     

        state.layers[state.layerid].lut = {
            ...state.layers[state.layerid].lut, 
            [_from] : [...(state.layers[state.layerid].lut[_from]||[]), {id: `${to}_${Date.now()}`, event:to, op:rule, actions:_actions}]
        }
       
    },

    loadNodes : (state, action)=>{

        state.layers = {};
        for (const {nodes, layer} of action.payload.reverse()){
            state.layers[layer] = state.layers[layer] || {};
            state.layers[layer].nodes = Object.keys(nodes);
            state.layers[layer].nodesById = nodes; 
            state.layers[layer].lut = createLut(state.layers[layer].nodesById);   
            state.layers[layer].parent = null;
            state.layers[layer].child =null;
            state.layerid = layer;
        }
    },

    updateLink : (state, action)=>{
      
        const {from,to,actions,rules} = action.payload; 
        const _actions =  (actions||"").split("|").map((line)=>{
            return line.split(",");
        });
        
        state.layers[state.layerid].lut = Object.keys(state.layers[state.layerid].lut).reduce((acc, key)=>{
            if (key === from){
                return {
                    ...acc,
                    [key] : state.layers[state.layerid].lut[key].map((item)=>{
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
            return {...acc,[key]:state.layers[state.layerid].lut[key]}

        },{});
    },

    updateNode : (state, action)=>{

        const {node,name,speech,type,subscription="/press"} = action.payload;
      
        
      

        //TODO - SORT ROOT NODE - ID THIS IS THE ONE CHANGED!!
        state.layers[state.layerid].nodesById = Object.keys(state.layers[state.layerid].nodesById).reduce((acc, key)=>{
         
            if (key == node){
                return {
                    ...acc,
                    [name] : {
                        ...state.layers[state.layerid].nodesById[key],
                        name,
                        type,
                        subscription,
                        id: name.replace(/\s/g, "_"),
                        onstart: speech,
                    }
                }
            }
            return {
                ...acc,
                [key] : state.layers[state.layerid].nodesById[key]
            }
        },{});

        state.layers[state.layerid].nodes = state.layers[state.layerid].nodes.reduce((acc, item)=>{
            if (item == node){
                return [...acc, name]
            }
            return [...acc, item];
        },[])

        state.layers[state.layerid].lut = Object.keys(state.layers[state.layerid].lut).reduce((acc,key)=>{
            if (key === "root"){
                return {
                    ...acc,
                    root : {
                        id : state.layers[state.layerid].lut["root"].id == node ? name : state.layers[state.layerid].lut["root"].id,
                        event : state.layers[state.layerid].lut["root"].event == node ? name : state.layers[state.layerid].lut["root"].event,
                    }
                }
            }
            if (key == node){
                return {
                    ...acc,
                    [name] : state.layers[state.layerid].lut[node].map(n=>{
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
                [key] : state.layers[state.layerid].lut[key].map(n=>{
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
        state.layers[state.layerid].child = action.payload
    },
    setParent : (state, action)=>{
        state.layers[state.layerid].parent = action.payload
    },
    setAuthored : (state, action)=>{
        state.authored = action.payload
    },
    setLookup : (state, action)=>{
        state.layers[state.layerid].lut = action.payload
    },
    generateLookuptable : (state)=>{
        state.layers[state.layerid].lut = createLut(state.layers[state.layerid].nodesById)
    },
   
    updateParent : (state, action)=>{
      
        state.layers[state.layerid].lut = Object.keys(state.layers[state.layerid].lut).reduce((acc,key)=>{
            if (key != state.layers[state.layerid].parent){
                return {
                    ...acc,
                   [key]: state.layers[state.layerid].lut[key]
                }
            }
            else{
                return {
                    ...acc,
                    [key] : [...(state.layers[state.layerid].lut[key] || []), {event: action.payload.next, id: action.payload.next, op:action.payload.op, actions:action.payload.actions}]
                }
            }
        },{});

        state.layers[state.layerid].lut = {
            ...state.layers[state.layerid].lut,
            [action.payload.next] : state.layers[state.layerid].lut[action.payload.next] || []
        }
    }
  }
});



export const { addNode, loadNodes, addLayer, setLayer, setParent, setChild, updateParent,setLookup,setAuthored, generateLookuptable,setEditNode,updateNode,updateLink,createLink} = layerSlice.actions;

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
            //const [layers={}, ...rest] = res.body;
            
            const nodes = (res.body || []).map((l,i)=>{
                const {events=[], layerid} = l;
                return {nodes:events, layer: layerid || `layer${i}`}
            })

            dispatch(loadNodes(nodes))
           
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
    

    return (dispatch, getState)=>{
        const layerid = getState().layer.layerid;
        const nodes = getState().layer.layers[layerid].nodes;
        const name = unique(node.name, nodes);
        const _node = {...node, type: node.type || "button", name:`${name}`, id:`${name.replace(" ","_")}`};
        dispatch(addNode(_node));
        dispatch(addRulesToParent(rule,actions,_node.name));

   
    }

   

}


export const exportNodes = (name)=>{
    return async (dispatch, getState)=>{

        const _layers = getState().layer.layers;
        const towrite = Object.keys(_layers).reduce((acc, layerid)=>{
            
            const lut       = _layers[layerid].lut;
            const nodesById = _layers[layerid].nodesById;

            const _lut = Object.keys(lut).reduce((acc,key)=>{
                if (key==="root")
                    return acc;
                return {
                    ...acc,
                    [key] : lut[key]
                }
            },{});

            const items = Object.keys(_lut).reduce((acc,key)=>{
                const {type} = nodesById[key];
    
                if (type==="button"){
                    return [
                        ...acc,
                        {
                            id: key,
                            ...nodesById[key],
                            subscription: "/press",
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
                    //NB: operand may be a string if created in this session, or array if read from server
                    //TODO: - save in array format when speech so is always an array..!
                    return [
                        ...acc,
                        {
                            id: key,
                            ...nodesById[key],
                            subscription: "/speech",
                            rules : _lut[key].map(k=>{
                                if (k.op){
                                    return {
                                         "rule": {
                                            "operator": "contains",
                                            "operand": Array.isArray(k.op) ? k.op : k.op.split(","),
                                        },
                                        "actions":  k.actions,
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
            

            return [
                ...acc,
                {
                    
                    "id" : layerid,
                    "start": {
                        "actions": [[]],
                        "event": getState().layer.layers[layerid].nodes[0]
                    },
                    "events": items
                }
            ]
        },[]);

        console.log(JSON.stringify(towrite,null,4));
        await request.post('/author/save').set('Content-Type', 'application/json').send({name,layer:towrite});
    }
}

export const addRulesToParent = (op, actions, next)=>{

    return (dispatch, getState)=>{
        dispatch(updateParent({op, actions, next}));
        dispatch(showAddNode(false));
    }
}


export const selectNodeIds          = state => state.layer.layers[state.layer.layerid].nodes;
export const selectNodes            = state => state.layer.layers[state.layer.layerid].nodesById;
export const selectParent           = state => state.layer.layers[state.layer.layerid].nodesById[state.layer.layers[state.layer.layerid].parent] ||  {};
export const selectChild            = state => state.layer.layers[state.layer.layerid].child;
export const selectTree             = state => state.layer.layers[state.layer.layerid].lut;
export const selectNodeToEdit       = state => state.layer.layers[state.layer.layerid].node;
export const selectAuthored         = state => state.layer.authored;
export const selectLayers           = state => Object.keys(state.layer.layers || {}).sort();
export const selectLayerId          = state => state.layer.layerid;

export default layerSlice.reducer;
