import {  createSlice } from '@reduxjs/toolkit';

export const creatorSlice = createSlice({
  name: 'creator',
  
  initialState: {
    selectedNode: null,
    viewAdd: false,
    name: "",
    rule: "",
    speech : [],
    actions:"",
  },

  reducers: {
    setEditNode : (state, action)=>{
      const {name,rule, onstart:speech,actions} = action.payload;
      state.selectedNode = name;
      state.name = name;
      state.rule = rule;
      state.speech = speech;
      state.actions = actions;
    },
    setViewAddNode : (state, action)=>{
      state.viewAdd = action.payload;
    },
    setName : (state, action)=>{
      state.name = action.payload;
    },
    setRule : (state, action)=>{
      state.rule = action.payload;
    },
    setSpeech: (state, action)=>{
      state.speech = action.payload;
    },
    setActions: (state, action)=>{
      state.actions = action.payload;
    }
  }
});

export const { setEditNode,setViewAddNode,setName,setRule, setSpeech,setActions } = creatorSlice.actions;

export const showAddNode = (value)=>{
  return (dispatch, getState)=>{
      dispatch(setViewAddNode(value))
  }
}

export const editNode = (node)=>{
  return (dispatch, getState)=>{
      dispatch(setEditNode(node));
      dispatch(showAddNode(true));
  };
}

export const nodeToEdit         = state => state.creator.selectedNode;
export const selectViewAdd      = state => state.creator.viewAdd;
export const selectName         = state => state.creator.name;
export const selectRule         = state => state.creator.rule;
export const selectSpeech       = state => state.creator.speech;
export const selectActions      = state => state.creator.actions;

export default creatorSlice.reducer;
