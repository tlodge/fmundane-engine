import * as React from "react";
import * as d3 from "d3";

const _flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? _flatten(b) : b), []
);


const links = (node)=>{
   
    return _flatten([
      {    
        links: node.data.links,
        trigger: node.data.trigger,
        from : {
          name:node.data.name,
          x: node.x,
          y: node.y
        },
        to : (node.children||[]).map(c=>({trigger:c.data.trigger, name:c.data.name,x:c.x, y:c.y}))
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

const _slink = (sx, sy, tx, ty) =>{
    return <line key={`${tx}${ty}`} x1={sx} y1={sy} x2={tx} y2={ty} stroke="#D1D1D1"></line>       
}
const _clink = (sx, sy, tx, ty) => {
    
    return `M ${sx},${sy} C ${(sx + tx) / 2},${sy} ${(sx + tx) / 2},${ty} ${tx},${ty}`;
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

const moveChart = (gtree, t)=>{
 
    const g = d3.select(gtree.current);

    if (t.triggered){
        const node = findNode(t, t.id);
        let ty = 0;

        if (node.parent){
            ty = node.x - node.parent.x;
        }
        g.transition()
            .duration(2000)
            .attr("transform", `translate(-${node.depth * 120} ,${-ty})`);
    }
}

function Tree(t) {
  
    const gtree = React.useRef(null);
  
    React.useEffect(() => {
        moveChart(gtree, t);
    }, [t]);

    const renderLinks = (links, data)=>{
        return links.map((link)=>{
    
            return link.to.map((l)=>{
                
                //const labeldata = data[`${link.from.name}->${l.name}`] || [];
                const tx = (l.x-link.from.x)/2;
                const ty = (Math.max(l.y,link.from.y)-Math.min(l.y,link.from.y))/2;
                const anchor = "middle";//tx == 0 ? "middle" : tx < 0 ? "end": "start";
                const labeldata = data[l.trigger];
                
                const label = labeldata.actions.map((ld,i)=>{
                    return <text key={ld.join(",")} fontSize="x-small" textAnchor={"middle"} x={l.y} y={l.x-30 + (i*10)} > {ld.join(',')}</text>
                });

                const {rule={}} = labeldata;
                const operator = rule.operator || "";
                const operand =  rule.operand || [];
                const rulelabel = `${operator}, ${operand}`;

                const ruletext = <text fontSize="x-small" fill="red" textAnchor={anchor} y={link.from.x+tx} x={(link.from.y+ty)}>{rulelabel}</text>

                return <g key={`${l.x},${l.y}`}>
                            {_slink(link.from.y, link.from.x, l.y, l.x)}
                            {ruletext}
                            {label}
                            
                       </g>
            });
           //return link.to.map((l)=><path d={_clink(link.from.x, link.from.y,l.x, l.y)} stroke="#D1D1D1" fill="none"/>);
        });
    }

    const renderTree = (node,selected,rid)=>{
       
        let paint = false;

        if (!rid){
            paint = selected==node.data.name && node.children && node.children.length > 0;
        }else{
            paint = selected===node.data.name && node.data.trigger == rid;
        }

        return <g key={`${node.x},${node.y}`}> 
                    <circle cx={node.y} cy={node.x} r={10} style={{fill: paint ? "#4299e1":"white", stroke:"black"}}/>
                    <text textAnchor="middle" fontSize="x-small"  x={node.y} y={node.x+4}>{node.data.name}</text>
                    {(node.children || []).map(n=>renderTree(n, selected, rid))}
              </g>
    }
 
    return <svg  width="600" height="600"><g transform={"translate(50,0)"}>
        <g ref={gtree}>
        {renderLinks(links(t), rids(t))}
        {renderTree(t, t.id, t.triggered)}
        </g>
    </g></svg>
 }
 
 export default Tree;