
export const evaluate = (operator, operand=[], value)=>{

  console.log("speech in evaluate", operator, operand, value);

   if (operator === "contains"){
      const _operand = operand.map(o=>o.trim());
      for (const word of value.split(/[ ]+/)){
           if ( _operand.indexOf(word.toLowerCase().trim()) != -1){
                return true;
           }
       }
   }
   if (operator === "any"){
     return true;
   }
   return false;
}