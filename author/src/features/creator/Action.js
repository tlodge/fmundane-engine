import {useState, useEffect}  from 'react';
import request from 'superagent';


const _validateactions = (actions)=>{
    
    return actions.map(a=> {
       
        return {
            ...a, 
            params: JSON.parse(a.params),
        }
    });
}

export default function Action({action:_actions=[], actionChanged}) {
    
    //const {speech=[]} = _lines;

    _actions = _actions.length <= 0 ? [] : _actions.map(a=>({...a, params:a.params? JSON.stringify(a.params):"{}"}))

    const [actions, setActions] = useState(_actions);

    const addAction = ()=>{
        setActions([...actions, {"action":"", "delay":0, "params":"{}"}])
    }

    const deleteAction = (index)=>{
         const _actions = actions.reduce((acc,item,i)=>{
            return i == index ? acc : [...acc, item];
        },[]);
        setActions(_actions);
        actionChanged(_validateactions(_actions));
    }

    const setAction = (index,action)=>{
        const _actions = actions.map((item,i)=>{
            return i==index ? {...item, action} : item;
        },[]);
        setActions(_actions);
        actionChanged(_validateactions(_actions));
    }

    const setDelay = (index,delay)=>{
        const _actions = actions.map((item,i)=>{
            return i==index ? {...item, delay} : item;
        },[]);
        setActions(_actions);
        actionChanged(_validateactions(_actions));
    }


    const setParams = (index, params)=>{
        const _actions = actions.map((item,i)=>{
            try{
                return i==index ? {...item, params} : item;
            }catch(err){
                return item;
            }
            
        },[]);
        setActions(_actions);
        actionChanged(_validateactions(_actions));
    }

    const _testActions = async ()=>{
        await request.post('/author/actiontest').set('Content-Type', 'application/json').send({actions:_validateactions(actions)});
    }

    const _testAction = async (i)=>{
        await request.post('/author/actiontest').set('Content-Type', 'application/json').send({actions:_validateactions([actions[i]])});
    }

    const renderActions = ()=>{
        return actions.map((r,i)=>{
            return <div key={i} className="flex flex-row text-sm items-center justify-start mt-1">
                <div className="flex flex-col justify-start">
                    <input style={{width:120}} className="mr-4" type="text" value={r.action} onChange={(e)=>{setAction(i,e.target.value)}}></input>
                </div>
                <div className="flex flex-col justify-start">
                    <input type="text" style={{width:80}} value={r.delay} onChange={(e)=>{setDelay(i,e.target.value)}}></input>
                </div>
                <div className="flex flex-col justify-start">
                    <div className="pl-2">
                        <input type="text" style={{width:400}} value={r.params} onChange={(e)=>{setParams(i,e.target.value)}}></input>
                    </div>
                </div>
                <div onClick={()=>_testAction(i)} className="flex flex-col justify-start pb-4">
                   <div className="flex items-center justify-center ml-4 mr-4 text-black w-6 h-6">▶</div>
                </div>
                <div onClick={()=>deleteAction(i)} className="flex flex-col justify-start pb-4">
                   <div>🗑</div>
                </div>
                
            </div>
        })
    }

    return  <div>
                
                <div className="flex  flex-col shadow p-2 mt-4">
                    <div onClick={()=>addAction()} className="font-bold text-xs flex justify-start">ACTIONS (name,delay,params) (+)</div>                    
                    {renderActions()}
                    <div className="p-2"> <button onClick={_testActions} className="rounded-full h-6 w-6 text-xs bg-pink-500 text-white">▶</button></div>
                </div>
            </div>
}