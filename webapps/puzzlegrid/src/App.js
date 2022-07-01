import eye from './eye.svg';
import finger from './finger.svg';
import './App.css';
import {useEffect, useState, useRef} from 'react';
import request from 'superagent';

const RADIUS = 18;

const pattern = [0,1,2,3,4,7,12,17,22];

const SPACINGY = 33;
const SPACINGX = 45;

const SVGWIDTH = ((RADIUS*2) * 5) + (6* (SPACINGX-RADIUS));
const SVGHEIGHT = ((RADIUS*2)* 5) + (6 * (SPACINGY-RADIUS));

function App() {
  const [selected, setSelected] = useState({});
  const [moving, setMoving] = useState(false);
  const [coords, setCoords] = useState({x:0,y:0})
  const [painted, setPainted] = useState({});
  const [complete, setComplete] = useState(false);
  const svgRef = useRef();

  useEffect(()=>{
    if (!moving){
      setPainted({});
    }
  },[moving]);
  
  useEffect(()=>{
    const lines = Array.from({ length: 25 }, (_, i) => i)
    const _complete = lines.reduce((acc, index)=>{
      const inpattern = pattern.indexOf(index) !== -1;;
      return acc && inpattern == (selected[index] || false);
    },true);
    const sendevent = async ()=>{
      await request.get("/event/webhook?trigger=puzzlegrid")
    }
    sendevent();
    setComplete(_complete)
  },[selected])

  useEffect(()=>{
    const lines = Array.from({ length: 25 }, (_, i) => i)
   
    lines.forEach((l)=>{
      
      const cx = SPACINGX + ((l%5)*(SPACINGX+RADIUS));
      const cy = SPACINGY + Math.floor(l/5)*(SPACINGY+RADIUS);
        if ( (coords.x > cx - RADIUS && coords.x < cx + RADIUS) && (coords.y > cy - RADIUS && coords.y < cy+RADIUS)){
          if (!painted[l]){  
           
            setSelected({
              ...selected,
              [l]: !selected[l]
            }) 

            setPainted({
              ...painted,
              [l]:true
            });
          }
        }
    })
    
  },[coords]);

  const setEnded = (e)=>{
    setMoving(false);
  }

  const toggleSelectedAt = (e)=>{
    const lines = Array.from({ length: 25 }, (_, i) => i)
    lines.forEach((l)=>{

   
      const cx = SPACINGX + ((l%5)*(SPACINGX+RADIUS));
      const cy = SPACINGY + Math.floor(l/5)*(SPACINGY+RADIUS);
        const {top,left} = svgRef.current.getBoundingClientRect();
        const x = e.pageX - left;
        const y = e.pageY - top;

        if ( (x > cx - RADIUS && x < cx + RADIUS) && (y > cy - RADIUS && y < cy+RADIUS)){
         
          setSelected({
            ...selected,
            [l]: !selected[l]
          }) 

          setPainted({
            ...painted,
            [l]:true
          });
      }
    }); 
  }

  const updateGrid = (e)=>{
      console.log(e);
      const {top,left} = svgRef.current.getBoundingClientRect();
      console.log(top,left);
      console.log(({x:e.nativeEvent.pageX-left,y:e.nativeEvent.pageY-top}));
      setCoords ({x:e.nativeEvent.pageX-left,y:e.nativeEvent.pageY-top})
  }
  
 
  const renderGrid = ()=>{
    const lines = Array.from({ length: 25 }, (_, i) => i)
    return lines.map((l)=>{
      const cx = SPACINGX + ((l%5)*(SPACINGX+RADIUS));
      const cy = SPACINGY + Math.floor(l/5)*(SPACINGY+RADIUS);
      return  <g key={l}>
        <circle r={RADIUS - (complete ? 5: 0) } cx={cx} cy={cy} className="outer"></circle>
        <circle r={(RADIUS-5) - (complete ? 5: 0)} cx={cx} cy={cy} className="inner" style={{fill: selected[l] ? "black" : "rgb(0,255,123)"}}></circle>

      </g>
    });
  }

  return (
    <div className="App" style={{overflow:"hidden"}}>
      
      <div style={{background:"rgb(151,77,242)", width:"100vw", display:"flex", flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <div className="topbox">
          <img src={eye} className="App-logo" alt="eye" />
          <div className="toptext">Help me stop the hack</div>
        </div>
        <div className="innerbox">
          <svg width={SVGWIDTH} height={SVGHEIGHT} className="grid" >   
            {renderGrid()}
            <rect ref={svgRef} onClick={(e)=>toggleSelectedAt(e)} onTouchMove={updateGrid} onTouchStart={()=>setMoving(true)} onTouchEnd={()=>setMoving(false)} x={0} y={0} width={SVGWIDTH} height={SVGHEIGHT} style={{fill:"transparent"}} />
          </svg>
        </div>
        <div className="bottombox">

          <div className="textcontainer">
            <div className="bottomtext">Just draw the shape shown on the screen using your finger tip</div>
          </div>
          <img src={finger} className="finger" alt="finger" />
        </div>
      </div>
    </div>
  );
}

export default App;
