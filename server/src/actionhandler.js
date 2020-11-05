import superagent from 'superagent';

const request = (r)=>{

    return new Promise((resolve, reject)=>{
        if (r.data.type === "GET"){
            superagent.get(r.data.url).then(res=>resolve(res.body)).catch((err)=>reject(err));
        }
        else if (r.data.type === "POST"){
            superagent.post(r.data.url).send(r.body || {}).then(res=>resolve(res.body)).catch((err)=>reject(err));
        }
    });
}

export const handle = async (r)=>{
    if (r.type === "request"){
        await request(r);
    }
   return;
}