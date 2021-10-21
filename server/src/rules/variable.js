
export const evaluate = (operator, operand, value)=>{
     console.log("evaluating variable!!", operator, operand, value);

     if (operator === "equals"){
        if (operand && value){
            return operand.trim().toLowerCase() == value.trim().toLowerCase();
        }
     }
     return false;
  }