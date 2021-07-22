import superagent from 'superagent';
import ips from './actions/IPs.json';
const request = (r)=>{

    return new Promise((resolve, reject)=>{
        if (r.data.type === "GET"){
            if (r.data.timeout){
                superagent.get(r.data.url).query(r.query || {}).timeout({
                    response: r.data.timeout  
                }).then(res=>resolve(res.body)).catch((err)=>resolve(err));
            }else{
                superagent.get(r.data.url).query(r.query || {}).then(res=>resolve(res.body)).catch((err)=>resolve(err));
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
    if (!speech || speech.length <= 0)
        return;
    console.log("ips us", ips);
    console.log("speech is", ips["speech"]);

    await request({
         "data": {
            "url": `http://${ips["speech"] || "127.0.0.1"}:9105/api/speech`,
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