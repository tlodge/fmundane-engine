
export const evaluate = (operator, operand, value)=>{
    if (operator === "equals"){
        return operand.toLowerCase().trim() === value.toLowerCase().trim();
    }
    return false;
}