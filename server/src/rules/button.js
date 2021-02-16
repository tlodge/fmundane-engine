
export const evaluate = (operator, operand, value)=>{
    console.log("have operantor", operator)
    console.log("operand", operand);
    console.log("value", value);
    if (operator === "equals"){
        return operand.toLowerCase().trim() === value.toLowerCase().trim();
    }
    return false;
}