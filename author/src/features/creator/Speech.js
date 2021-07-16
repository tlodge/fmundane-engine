import {useState, useEffect}  from 'react';
import request from 'superagent';


const _validatelines = (lines)=>{
    
    return lines.map(l=> {
        const rate = (l.rate || "").trim()=="" ? "180" : l.rate;
        return {
            ...l, 
            rate
        }
    });
}

export default function Speech({lines:_lines={}, speechChanged}) {
    
    const voices = ["Kate", "Daniel", "Oliver", "Ava", "Alex", "Bruce", "Junior", "Ralph", "Tom", "Serena"];

    const {speech=[]} = _lines;

    _lines = speech.length <= 0 ? [{"words":"", "delay":0, "voice":"Kate","background":"", rate:"180"}] : speech ;

    const [lines, setLines] = useState(_lines);

    const addLine = ()=>{
        setLines([...lines, {"words":"", "delay":0, "voice":"Kate", "background":"", rate:"180"}])
    }

    const deleteLine = (index)=>{
         const _lines = lines.reduce((acc,item,i)=>{
            return i == index ? acc : [...acc, item];
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }

    const setText = (index,text)=>{
        const _lines = lines.map((item,i)=>{
            return i==index ? {...item, words:text} : item;
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }

    const setVoice = (index,voice)=>{
        const _lines = lines.map((item,i)=>{
            return i==index ? {...item, voice} : item;
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }


    const setDuration = (index, ms)=>{
        const _lines = lines.map((item,i)=>{
            try{
                return i==index ? {...item, delay:ms} : item;
            }catch(err){
                return item;
            }
            
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }

    const setRate = (index, wpm)=>{
        const _lines = lines.map((item,i)=>{
            try{
                return i==index ? {...item, rate:wpm} : item;
            }catch(err){
                return item;
            }
            
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }

    const setBackground = (index, background)=>{
        const _lines = lines.map((item,i)=>{
            try{
                return i==index ? {...item, background} : item;
            }catch(err){
                return item;
            }
            
        },[]);
        setLines(_lines);
        speechChanged({speech:_validatelines(_lines)});
    }

    const _testSpeech = async ()=>{
        await request.post('/author/audiotest').set('Content-Type', 'application/json').send({lines:_validatelines(lines)});
    }

    const _testLine = async (i)=>{
        await request.post('/author/audiotest').set('Content-Type', 'application/json').send({lines:_validatelines([lines[i]])});
    }

    const renderSelect = (r,index)=>{
        const options =  voices.map(v=><option key={v} value={v}>{v}</option>);
        return <select key={index} value={r.voice || "Kate"} onChange={(e)=>setVoice(index,e.target.value)} style={{width:120}}>{options}</select>
    }

    const renderLines = ()=>{
        return lines.map((r,i)=>{
            return <div key={i} className="flex flex-row text-sm items-center justify-start mt-4">
                <div className="flex flex-col justify-start">
                    <input style={{minWidth:300}} className="mr-4" type="text" value={r.words} onChange={(e)=>{setText(i,e.target.value)}}></input>
                    <label className="flex justify-start">what to say</label>
                </div>
                <div className="flex flex-col justify-start">
                    <input type="text" style={{width:80}} value={r.delay} onChange={(e)=>{setDuration(i,e.target.value)}}></input>
                    <label className="flex justify-start">pause (ms)</label>
                </div>
                <div className="flex flex-col justify-start">
                    <div className="pl-2">
                        <input type="text" style={{width:80}} value={r.rate} onChange={(e)=>{setRate(i,e.target.value)}}></input>
                        <label className="flex justify-start">words/min</label>
                    </div>
                </div>
                <div className="flex flex-col justify-start">
                   <div className="pl-2">
                   {renderSelect(r,i)}
                   <label className="flex justify-start">voice</label>
                   </div>
                </div>
                <div className="flex flex-col justify-start">
                    <div className="pl-2">
                        <input type="text" style={{width:120}} value={r.background} onChange={(e)=>{setBackground(i,e.target.value)}}></input>
                        <label className="flex justify-start">sound effect</label>
                    </div>
                </div>
                <div onClick={()=>_testLine(i)} className="flex flex-col justify-start pb-4">
                   <div className="flex items-center justify-center ml-4 mr-4 text-black w-6 h-6">▶</div>
                </div>
                <div onClick={()=>deleteLine(i)} className="flex flex-col justify-start pb-4">
                   <div>🗑</div>
                </div>
                
            </div>
        })
    }

    return  <div>
                
                <div className="flex  flex-col shadow p-2 mt-4">
                    <div onClick={()=>addLine()} className="font-bold text-xs flex justify-start">LINES (+)</div>                    
                    {renderLines()}
                    <div className="p-8"> <button onClick={_testSpeech} className="rounded-full h-10 w-10 bg-pink-500 text-white">▶</button></div>
                </div>
            </div>
}