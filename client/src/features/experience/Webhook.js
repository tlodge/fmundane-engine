import React, { useState, useEffect } from 'react';

function Webhook({ready, names, handleAction}) {
    

      const renderWebhooks = ()=>{
            if(ready){
                  return <div>{webhooks}</div>
            }else{
                  return <></>;
            }
      }
    const webhooks = names.map(w=>{
       
          return   <button key={w} onClick={()=>handleAction(w)} className="bg-green-500 m-2 text-xs hover:bg-green-700 text-white font-bold py-2 px-4 rounded">{w}</button>
         
    });
    
    return renderWebhooks();
 }
 
 export default Webhook;