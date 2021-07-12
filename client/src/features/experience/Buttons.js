import React, { useState, useEffect } from 'react';

function Buttons({ready, names, handleAction}) {
    

      const renderButtons = ()=>{
            if(ready){
                  return <div>{buttons}</div>
            }else{
                  return <></>;
            }
      }
    const buttons = names.map(b=>{
       
          return   <button key={b} onClick={()=>handleAction(b)} className="bg-blue-500 m-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{b}</button>
         
    });
    
    return renderButtons();
 }
 
 export default Buttons;