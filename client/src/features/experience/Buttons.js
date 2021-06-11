import React, { useState, useEffect } from 'react';

function Buttons({ready, names, buttonPressed}) {
    

      const renderButtons = ()=>{
            if(ready){
                  return <div>{buttons}</div>
            }else{
                  return <></>;
            }
      }
    const buttons = names.map(b=>{
       
          return   <button key={b} onClick={()=>buttonPressed(b)} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{b}</button>
         
    });
    
    return renderButtons();
 }
 
 export default Buttons;