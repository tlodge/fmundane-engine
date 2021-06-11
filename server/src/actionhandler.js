import superagent from 'superagent';

const request = (r)=>{

    return new Promise((resolve, reject)=>{
        if (r.data.type === "GET"){
            superagent.get(r.data.url).then(res=>resolve(res.body)).catch((err)=>resolve(err));
        }
        else if (r.data.type === "POST"){
            console.log("seen a post, sending data", r.body);
            superagent.post(r.data.url).send(r.body || {}).then(res=>resolve(res.body)).catch((err)=>resolve(err));
        }
    });
}

export const handle = async (r)=>{
    console.log("handling", r);
    
    if (r.type === "request"){
        const response = await request(r);
        return response;
    }
   return;
}