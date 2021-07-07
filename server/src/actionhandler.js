import superagent from 'superagent';

const request = (r)=>{

    return new Promise((resolve, reject)=>{
        if (r.data.type === "GET"){
            if (r.data.timeout){
                superagent.get(r.data.url).timeout({
                    response: r.data.timeout  
                }).then(res=>resolve(res.body)).catch((err)=>resolve(err));
            }else{
                superagent.get(r.data.url).then(res=>resolve(res.body)).catch((err)=>resolve(err));
            }
            
        }
        else if (r.data.type === "POST"){
            if (r.data.timeout){
                superagent.post(r.data.url).send(r.body || {}).timeout({
                    response: r.data.timeout  
                }).then(res=>resolve(res.body)).catch((err)=>resolve(err));
            }else{
                superagent.post(r.data.url).send(r.body || {}).then(res=>resolve(res.body)).catch((err)=>resolve(err));
            }
        }
    });
}


export const handlespeech = async (speech)=>{
    
    await request({
         "data": {
            "url": "http://localhost:9105/api/speech",
            "type": "POST",
            "contenttype": "application/json"
          },
          "body":{
              speech
          }
    });

}

export const handle = async (r)=>{
    
    
    if (r.type === "request"){
        const response = await request(r);
        return response;
    }
   return;
}