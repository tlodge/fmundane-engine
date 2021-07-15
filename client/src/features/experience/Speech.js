import React, {useState,} from 'react';
import { useSelector} from 'react-redux';

import {
    selectSpeech,
} from './experienceSlice';

export default function Speech({rules, ready, handleAction, handleChange}) {
 

  const [words, setWords] = useState("");

  const _handleChange = (value) =>{
    handleChange(value);
    setWords(value);
  }

  const _handleAction = ()=>{
    setWords("");
    handleAction();
  }

  const renderOperands = ()=>{

    const operands = rules.reduce((acc, item)=>{
          return [...acc, ...(item.rule.operand || []).map(o=>({
                operand: o,
                next: item.next,
          }))]
    },[]);

    if (operands.length === 0){
      return <div className="flex flex-col overflow-auto">
            <input onChange={(e)=>_handleChange(e.target.value)} value={words} className="h-10 pl-2 m-4 rounded" type="text" placeholder="simulate some words"></input>
            <button onClick={()=>{_handleAction()}} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">say it!</button>
        </div>
    }else{
      return  operands.map(b=>{
            return   <button key={b.operand} onClick={()=>{ _handleChange(b.operand);_handleAction();}} className="bg-blue-500 m-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2rounded">{`${b.operand} (${b.next})`}</button>
      });
    }
}

  const speech = useSelector(selectSpeech);

  return (
    <div className="flex flex-col h-full w-full">
      <div style={{height:50}} className="flex text-xs font-bold justify-center items-center">{speech.trim()=="" ? "[listening for speech]" : `"${speech}"`}</div>
      {ready && <div className="p-6 bg-black flex flex-grow flex-col">
          <div className="font-semibold text-white text-base pb-2">override</div>
          {renderOperands()}
      </div>}
    </div>  
  );
  
}
