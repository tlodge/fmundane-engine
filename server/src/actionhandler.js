import superagent from 'superagent';
import ips from './actions/IPs.json';

/*
query
{
          "media":"tbu-pos-scifi-insta.mp4",
          "delay":200
}

body
{
           "media":"tbu-pos-scifi-insta.mp4",
           "nowait":true
}
*/


const request = (r, delay)=>{
    
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
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
            }
            ,delay);
        });
}


export const handlespeech = async (speech)=>{
    if (!speech || speech.length <= 0)
        return;

    return await request({
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

export const handle = async ({action, delay=0, params={}})=>{
    

    console.log("action handler seen", action);

    if (action.type === "request"){
          
        const _action = Object.keys(params).reduce((acc, key)=>{
            return {...acc, [key]:params[key]}
        }, action);

        const response = await request(_action, delay);
        console.log("returning from handle!", response);
        return response;
    }
   return;
}