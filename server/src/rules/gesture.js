
export const evaluate = (operator, operand, value)=>{
   


    if (operator === "equals"){
        return operand.map(o=>o.toLowerCase().trim()).indexOf(value.toLowerCase().trim()) != -1;
    }
    return false;
}