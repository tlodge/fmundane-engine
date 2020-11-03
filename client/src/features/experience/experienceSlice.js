import { createSlice } from '@reduxjs/toolkit';
import io from 'socket.io-client';
import superagent from 'superagent';

//import Layer from './Layer';

const socket = io('http://localhost:3001');
let recognition, voice;

export const experienceSlice = createSlice({
  name: 'experience',
  
  initialState: {
    layers: [],
    transcript: "",
    lastsenttranscript:"",
    talking: false,
  },

  reducers: {
    setTalking: (state, action)=>{
      state.talking = action.payload;
    },
    setLayers: (state, action)=>{
      state.layers = action.payload;
    },
    setLayer: (state, action) => {
      state.layers = [...state.layers.filter(l=>l.id !== action.payload.id), action.payload];
    },
    setTranscript: (state, action)=>{
      state.transcript = action.payload;
      
    },

    sentTranscript: (state)=>{
      state.lastsenttranscript = state.transcript;
    }
  }
});

export const { setLayer, setLayers, setTalking, setTranscript,sentTranscript } = experienceSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

export const reset = ()=>dispatch=>{
  superagent.get('/event/start').then(res => {
    dispatch(setLayers(res.body));
    dispatch(setTranscript(""));
 })
 .catch(err => {
   console.log("error resetting events", err);
    // err.message, err.response
 });
}

const delay = (ms) =>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      console.log("timeout complete!!!");
      resolve()
    }, ms);
  });
}

const getVoices = () => {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices()
    if (voices.length) {
      resolve(voices)
      return
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}

const sayWords = async (window, words, voice)=>{
  var msg = new SpeechSynthesisUtterance();
 

  msg.text = words;
  msg.voice = voice;
  window.speechSynthesis.speak(msg);
  
  return new Promise(resolve => {
    msg.onend = resolve;
  });
}

export const listenOnActions = (window) => async dispatch => {
  const voices = await getVoices();

  socket.on('action', async actions => {
  
 
  console.log("ok have voices", voices);
  for (const payload of actions){
    dispatch(setTalking(true));
    recognition.stop();
    if (payload.type==="browserspeech"){
      for (const sentence of payload.data.speech){
        await sayWords(window, sentence.words,voices[51]);
        if (sentence.delay){
          await delay(sentence.delay);
        }
      }
      dispatch(setTalking(false));
      
      //window.speechSynthesis.speak(new SpeechSynthesisUtterance(payload.data.words));
    }
    try{
      recognition.start();
    }catch(err){
     
    }
  }
  
  console.log("seen new actions!", actions)
 });
}

export const listenOnEvents = () => dispatch => {

  //superagent.get('/event/start').then(res => {
  //   dispatch(setLayers(res.body));
  //})
  //.catch(err => {
  //  console.log("error getting events", err);
   //  // err.message, err.response
  //});
  console.log("ok listening on events!!");
  socket.on('event', payload => {
    console.log("seen a new event!", payload)
    dispatch(setLayer(payload));
  });
}

export const sendTranscript = () => (dispatch, getState) =>{
    
    const {transcript, lastsenttranscript} = getState().experience;
   
    if (lastsenttranscript.trim() != transcript.trim()){
     
      superagent.get("/event/speech").query({speech:getState().experience.transcript}).end((err, res)=>{
        if (!err){
          dispatch(sentTranscript())
        }
      });
    }
};

export const listenToSpeech = (r) => (dispatch, getState) => {
  
  recognition = r;

  recognition.onend = () => {
    //dispatch(setTranscript(""));
    if (!getState().experience.talking){
      try{
        recognition.start();
      }catch(err){
        
      }
    }
  }

  recognition.onresult = event => {    
        
    let interimTranscript = ''
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal){ 
        if (transcript.trim() != ""){
          dispatch(setTranscript(transcript + ' '));
        }
      }
      else{ 
        interimTranscript += transcript;
      }
    }
    dispatch(sendTranscript());
  }

  recognition.start();
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLayers= state => {
  return  [...(state.experience.layers || [])].sort((a,b)=>{
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return -1;
  });
}
export const selectSpeech= state => state.experience.transcript;

export default experienceSlice.reducer;
