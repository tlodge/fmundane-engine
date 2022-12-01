import request from "superagent";

export function placeholderType(url){
    return "image"
}

export async function updatePlaceholder (key, value){
    const {text} = await request.get("/placeholders/set").query({key,value});
    console.log(JSON.parse(text))
}