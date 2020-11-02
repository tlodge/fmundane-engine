function Buttons({names, buttonPressed}) {
    console.log("in buttond with names", names);
   const buttons = names.map(b=>{
      
         return   <button key={b} onClick={()=>buttonPressed(b)} className="bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{b}</button>
        
   });
   
   return (<div>{buttons}</div>);
}

export default Buttons;