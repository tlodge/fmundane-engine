
export const evaluate = (operator, operand=[], value)=>{

  console.log("speech in evaluate", operator, operand, value);
   if (operator === "contains"){
       for (const word of value.split(" ")){
           console.log("checking for", word, " in", operand);
           if (operand.indexOf(word) != -1){
              console.log("returin true!!");
                return true;
           }
       }
   }
   if (operator === "any"){
     return true;
   }
   return false;
}