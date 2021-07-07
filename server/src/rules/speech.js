
export const evaluate = (operator, operand=[], value)=>{
   if (operator === "contains"){
       for (const word of value.split(" ")){
           if (operand.indexOf(word) != -1){
                return true;
           }
       }
   }
   if (operator === "any"){
     return true;
   }
   return false;
}