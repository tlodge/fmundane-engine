import {useState, useEffect}  from 'react';


export default function Speech({lines:_lines=[], speechChanged}) {
    
    const voices = ["Kate", "Daniel", "Oliver", "Ava", "Alex", "Bruce", "Junior", "Ralph", "Tom", "Serena"];

    _lines = _lines.length <= 0 ? [{"words":"", "delay":0, "voice":"Kate","background":"", wpm:180}] : _lines;

    const [lines, setLines] = useState(_lines);

    const addLine = ()=>{
        setLines([...lines, {"words":"", "delay":0, "voice":"Kate", "background":"", wpm:180}])
    }

    const deleteLine = (index)=>{
         const _lines = lines.reduce((acc,item,i)=>{
            return i == index ? acc : [...acc, item];
        },[]);
        setLines(_lines);
        speechChanged(_lines);
    }

    const setText = (index,text)=>{
        const _lines = lines.map((item,i)=>{
            return i==index ? {...item, words:text} : item;
        },[]);
        setLines(_lines);
        speechChanged(_lines);
    }

    const setVoice = (index,voice)=>{
        const _lines = lines.map((item,i)=>{
            return i==index ? {...item, voice} : item;
        },[]);
        setLines(_lines);
        speechChanged(_lines);
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
        speechChanged(_lines);
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
        speechChanged(_lines);
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
        speechChanged(_lines);
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
                        <input type="text" style={{width:80}} value={r.rate || 180} onChange={(e)=>{setRate(i,e.target.value)}}></input>
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
                <div onClick={()=>deleteLine(i)} className="flex flex-col justify-start pl-2">
                   <div>🗑</div>
                </div>
            </div>
        })
    }

    return  <div>
                
                <div className="flex  flex-col shadow p-2 mt-4">
                    <div onClick={()=>addLine()} className="font-bold text-xs flex justify-start">LINES (+)</div>                    
                    {renderLines()}
                </div>
            </div>
}