import request from "superagent";

export function placeholderType(url){
    if (url.indexOf("/image") != -1){
        return "image";
    }
    if (url.indexOf("/speech") != -1){
        return "speech";
    }
    return "";
}

export async function updatePlaceholder (key, value){
    const {text} = await request.get("/placeholders/set").query({key,value});
    console.log(JSON.parse(text))
}