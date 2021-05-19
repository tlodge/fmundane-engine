import React from 'react';
import { useSelector, useDispatch, } from 'react-redux';
import {setTranscript, sendTranscript} from './experienceSlice';


import {
    selectSpeech,
} from './experienceSlice';


export default function Speech({rules}) {
  const dispatch = useDispatch();

  const [words, setWords] = React.useState("");

  const handleChange = (e) =>{
    dispatch(setTranscript(e.target.value));
    setWords(e.target.value);
  }
  const renderOperands = ()=>{

    const operands = rules.reduce((acc, item)=>{
          return [...acc, ...(item.rule.operand || []).map(o=>({
                operand: o,
                next: item.next,
          }))]
    },[]);

    if (operands.length === 0){
      return <div className="flex flex-row items-center">
            <input onChange={handleChange} value={words} className="h-10 pl-2 mr-4 rounded" type="text" placeholder="simulate some words"></input>
            <button onClick={()=>{dispatch(sendTranscript())}} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">say it!</button>
        </div>
    }else{
      return  operands.map(b=>{
            return   <button key={b.operand} onClick={()=>{
              dispatch(setTranscript(b.operand));
              dispatch(sendTranscript());
            }} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2rounded">{`${b.operand} (${b.next})`}</button>
      });
    }
}

  const speech = useSelector(selectSpeech);

  return (
    <div className="flex flex-col h-full w-full">
      <div style={{minHeight:190}} className="flex text-xl font-bold justify-center items-center flex-grow">{speech.trim()=="" ? "[listening for speech]" : `"${speech}"`}</div>
      <div className="p-6 bg-black">
          <div className="font-semibold text-white text-lg pb-4">override</div>
          {renderOperands()}
      </div>  
    </div>  
  );
  
}
