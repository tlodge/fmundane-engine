
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


function Tree(t) {
  
    const renderLinks = (links, data)=>{
        return links.map((link)=>{
            //console.log("rendering", link, " and trigger", t.triggered);
            //console.log("rendering link", link);
            return link.to.map((l)=>{
                
                //const labeldata = data[`${link.from.name}->${l.name}`] || [];
                const tx = (l.x-link.from.x)/2;
                const ty = (Math.max(l.y,link.from.y)-Math.min(l.y,link.from.y))/2;
                const anchor = tx == 0 ? "middle" : tx < 0 ? "end": "start";
                const _data = data[l.trigger];
                console.log("k data is", _data);
               // const label = labeldata.actions.map((l,i)=>{
               //     return <text font-size="x-small" text-anchor={anchor} x={link.from.x+tx} y={link.from.y+ty+((i+1)*20)}> {l.join(',')}</text>
              //  });

                //const {rule={}} = labeldata;
                //const operator = rule.operator || "";
                //const operand =  rule.operand || [];
                //const rulelabel = `${operator}, ${operand}`;

                //const ruletext = <text font-size="x-small" fill="red" text-anchor={anchor} x={link.from.x+tx} y={(link.from.y+ty)}>{rulelabel}</text>

                return <g>
                            {_slink(link.from.x, link.from.y, l.x, l.y)}
                            {/*ruletext*/}
                            {/*label*/}
                            
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

        return <g>
                    <circle cx={node.x} cy={node.y} r={10} style={{fill: paint ? "blue":"white", stroke:"black"}}/>
                    <text text-anchor="middle" font-size="x-small"  x={node.x} y={node.y+4}>{node.data.name}</text>
                    {(node.children || []).map(n=>renderTree(n, selected, rid))}
              </g>
    }
 
    console.log("tree to reduce us", t);
    console.log("RIDS ARE", rids(t));
    return <svg width="600" height="600"><g transform={"translate(0,50)"}>
        {renderLinks(links(t), rids(t))}
        {renderTree(t, t.id, t.triggered)}
    </g></svg>
 }
 
 export default Tree;