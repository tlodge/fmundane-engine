import * as React from "react";
import * as d3 from "d3";
import * as d3z from "d3-zoom";
import {useD3} from '../../hooks/useD3';


let _seen = {};

const _flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? _flatten(b) : b), []
);


const links = (node)=>{
   
    return _flatten([
      {    
        links: node.data.links,
        trigger: node.data.trigger,
        from : {
          name:node.data.id,
          x: _seen[node.data.id].x,
          y: _seen[node.data.id].y + 60
        },
        to : (node.children||[]).map(c=>({trigger:c.data.trigger, name:c.data.id,x:_seen[c.data.id].x, y:_seen[c.data.id].y-60}))
      },
      ...(node.children || []).map(c=>links(c))
    ])
  }

  const rids = (node)=>{
        const root = Object.keys(node.data.links || {}).reduce((acc, key)=>{
            const item = node.data.links[key];
            return {
                ...acc,
                [item.rid]: item
            }
        },{})
  
        return {
            ...root,
            ...(node.children || []).reduce((acc, item)=>{
                return {
                    ...acc,
                    ...rids(item)
                }
            },{})
        }
  }

const linkdata = (node)=>{
    return {...(node.data.links || {}), ...(node.children || []).reduce((acc,item)=>{
        return {
            ...acc,
            ...linkdata(item),
        }
    },{})}
}

const _clink = (sx, sy, tx, ty) => {
    return <path d={`M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`} style={{stroke:"#000", strokeWidth:"2", fill:"none"}}></path> 
}

const _loopback = (sx, sy, tx, ty) =>{
    //(link.from.y + (l.y-link.from.y)/2)
    
    return <path d={`M ${sx} ${sy} C ${(sx)} ${sy+60}, ${(sx-120) } ${ty+60}, ${tx} ${ty}`} style={{stroke:"#444", strokeWidth:"1", fill:"none"}}></path> 
}

const isloopback = (l)=>{
    
    const result = l.from.y > l.to.y;
    return result;
  }
  

const findNode = (t, name)=>{

    if ((t.data || {}).name == name){
        return t;
    }

    if ((t.children || []).length <= 0){
        return null;
    }
    
    //search children

    let node = null;
    for (let i = 0; i < t.children.length; i++){
        node = findNode(t.children[i], name);
        if (node != null){
            break;
        }
    }
    return node;
}

const recenter = (gtree,t)=>{
    const g = d3.select(gtree.current);
    const db = g.select("g#dragbox");
    const {x,y} = _seen[t.id] || {x:0, y:0};

    g.call(d3z.zoom().on("zoom",  (e)=>{
        db.attr("transform", e.transform)
    })).call(d3z.zoom, d3z.zoomIdentity.scale(0.8).translate([-y+200,-x+t.height/2]));

    db.attr("transform", `translate(0,0)`);
    g.attr("transform", `translate(${-y+200},${-x+t.height/2})`);
}

const moveChart = (gtree, t)=>{
    
    //const g = d3.select(gtree.current);
    //if (_seen[t.id]){
     //   const {x,y} = _seen[t.id];
    //    g.transition().duration(2000).attr("transform", `translate(${-y+200},${-x+t.height/2})`);
   // }
}

function Tree(t) {
  

    const gtree = React.useRef();
 
    React.useEffect(() => {
        moveChart(gtree, t);
    }, [t]);
    
    const {x,y} = _seen[t.id] || {x:0, y:0};

    const mytree = useD3((svg) => {
        
       const dgbox = svg.select("g#dragbox");
       
       svg.call(d3z.zoom().on("zoom",  (e)=>{
            dgbox.attr("transform", e.transform)
        })).call(d3z.zoom, d3z.zoomIdentity.scale(0.8).translate([x,y]))

    }, []);

    const renderLinks = (links, data)=>{
        const seenlinks = {};

        return links.map((link)=>{
          
            return link.to.map((l)=>{
           
           
                if (seenlinks[`${link.from.name},${l.name}`]){
                    return <g></g>
                }else{    
                    seenlinks[`${link.from.name},${l.name}`]= true;
                //const labeldata = data[`${link.from.name}->${l.name}`] || [];
                const tx = (l.x-link.from.x)/2;
                const ty = (Math.max(l.y,link.from.y)-Math.min(l.y,link.from.y))/2;
                const anchor = "middle";//tx == 0 ? "middle" : tx < 0 ? "end": "start";
                const labeldata = data[l.trigger];
                const mx = 20 + (labeldata.actions.length - 1) * 20;

                const label = labeldata.actions.map((ld,i)=>{
                    
                    return <text key={ld.map(a=>a.action).join(",")} fontSize="x-small" textAnchor={"middle"} x={l.y+60} y={l.x-mx + (i*18)} > {[...new Set(ld.map(l=>l.action))].join(',')}</text>
                });

                const {rule={}} = labeldata;
                const operator = rule.operator || "";
                const operand =  rule.operand || [];
                const rulelabel = `${operator}, ${operand}`;
                const renderText = ()=>{
                    if (isloopback({from:link.from, to:l})){
                       return  <text fontSize="x-small" fontWeight="bold" fill="#000" opacity="0.5" textAnchor={anchor} y={link.from.x+tx-5+70} x={(link.from.y + (l.y-link.from.y)/2)}>{rulelabel}</text>
                    }
                   return  <text fontSize="x-small" fontWeight="bold" fill="black" textAnchor={anchor} y={link.from.x+tx-5} x={(link.from.y+ty)}>{rulelabel}</text>
                }

                const ruletext =    <g>
                                        <rect x={link.from.y-20+ty} y={link.from.x-13+tx} width={40} height={12} style={{fill: "#edf2f7"}}/>
                                       {renderText()}
                                    </g>


                return <g key={`${l.x},${l.y}`}>
                            {isloopback({from:link.from, to:l}) ? _loopback(link.from.y, link.from.x, l.y, l.x) : _clink(link.from.y, link.from.x, l.y, l.x)}
                            {ruletext}
                            {label}
                            
                       </g>
                }

            });
           //return link.to.map((l)=><path d={_clink(link.from.x, link.from.y,l.x, l.y)} stroke="#D1D1D1" fill="none"/>);
        });
    }

    const renderTree = (node,selected,rid, handleClick)=>{
       

        let paint = false;
       
        if (_seen[node.data.id].x !== node.x || _seen[node.data.id].y != node.y){
            return;
        }
        
        if (!rid){
            paint = selected==node.data.id;// && node.children && node.children.length > 0;
        }else{
            paint = selected===node.data.id;// && node.data.trigger == rid;
        }

        return <g key={`${node.x},${node.y}`}> 
                
                    <rect onClick={()=>handleClick(node.data.id)} x={node.y-60} y={node.x-10} width={120} height={20} rx={10} style={{fill: paint ? "#4299e1":"white", stroke:"black"}}/>
                    <text onClick={()=>handleClick(node.data.id)} textAnchor="middle" fontSize="x-small"  x={node.y} y={node.x+4}>{node.data.name}</text>
                    {(node.children || []).map(n=>renderTree(n, selected, rid,handleClick))}
            </g>

        
    }

    _seen = {};

    const generatecoords = (node)=>{
        if (!_seen[node.data.id]){
            _seen[node.data.id] = {x:node.x, y:node.y};
            (node.children || []).map(n=>generatecoords(n))
        }
    }

    generatecoords(t);

    return <div className="text-black bg-gray-200 rounded bg-white overflow-hidden shadow-lg"> 
        <svg ref={mytree} height={t.height} style={{width:`calc(100vw - 280px)`}}>
            <circle onClick={()=>{recenter(gtree,t)}} cx={50} cy={50} r="10" fill="white" strokeWidth={2} stroke="#000"></circle>
            <g ref ={gtree} transform={`translate(120,${t.height/2})`}>
                <g id="dragbox"> 
                    {renderLinks(links(t), rids(t))}
                    {renderTree(t, t.id, t.triggered, t.handleClick)}
                </g>
            </g>   
        </svg>
    </div>
 }
 
 export default Tree;