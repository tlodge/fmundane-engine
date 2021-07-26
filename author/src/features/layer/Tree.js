import {useEffect} from 'react';
import * as d3h from 'd3-hierarchy';
import * as d3z from 'd3-zoom';
import { interpolatePath } from 'd3-interpolate-path';
import {useD3} from '../../hooks/useD3.js';

const SLIDEWIDTH  = 192;
const WHRATIO = 0.5625;
const XPADDING = 18;
const YPADDING = 178;
const sw = SLIDEWIDTH;
const sh = SLIDEWIDTH*WHRATIO;
const TARGETBIGR = 8;
const TARGETSMALLR = 3;
const LINKDELTA = 18;

const ANIMATION_DURATION = 800;

const _flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? _flatten(b) : b), []
);

const _clink = (sx, sy, tx, ty) => {
  return `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`;  
}

const _loopback = (sx, sy, tx, ty) =>{
  return `M ${sx} ${sy} C ${(sx + tx)*1.5} ${sy}, ${(sx + tx)*1.5} ${ty}, ${tx} ${ty}`;  
}

let _seen   = {};
let _loops  = [];

const insert = (lookup, event, nodes={})=>{
   
    const children = lookup[event.event] || [];
 console.log("have event", event.event);
    //console.log(nodes[event.event].name || "").split(".");
    const [name=["x"]] = (nodes[event.event].name || "").split(".");
    const {onstart="",type="button"} = nodes[event.event]
    //if (_seen[event.event]){
    //  children.map(c=>{
    //    console.log("insert link", parent.event, "=>", event.event);
    //  })
     // return {event, onstart, type, name, children:[]};
   // }
    _seen[event.event] = true;
    //if (seen.indexOf(event.event)!=-1){
    //  return {event, onstart, type, name, children:[]};
    //}
    return {event, onstart, type, name, children : children.reduce((acc,c) => {
      if (!_seen[c.event]){
        return [...acc,insert(lookup, c, nodes)]
      }
      _loops = [..._loops, {from:event, to: c}];
      return acc;
    },[])}
    
}

const convertToHierarchy = (lut,nodes={})=>{
   _seen = {}; _loops = [];
    return insert (lut, lut["root"],nodes);
}

const _printableactions = (actions)=>{
  return actions.map(a=>[...new Set(a.map(l=>l.action))]);
}

const links = (node={})=>{
 
  if (Object.keys(node).length <= 0){
    return [];
  }
  return  _flatten([
    {    
      from : {
        name:node.data.event.event,
        x: node.x,
        y: node.y + sh 
      },
      to : (node.children||[]).map(c=>{
      
        return {name:c.data.event.event,x:c.x, y:c.y+LINKDELTA, op:c.data.event.op, actions: _printableactions(c.data.event.actions)}
      })
    },
    ...(node.children || []).map(c=>links(c))
  ]);
}

const _expanded = (arr)=>{
  //TODO: ffs the tos can be {} or []!  FIX THIS!
  return arr.reduce((acc,item)=>{
      const {from={}, to=[]} = item;
      const _to = Array.isArray(to) ? to : [to];
      return [...acc,...(_to.map(t=>({from:from, "to":t})))]
  },[]);
}


const lookuplinks = (lnks)=>{
  return lnks.reduce((acc, link)=>{
    return {
              ...acc,
              [`${link.from.name}_${link.to.name}`]: {from: link.from.name, to: link.to.name, op:link.to.op, actions:link.to.actions, x1:link.from.x, y1: link.from.y, x2:link.to.x, y2:link.to.y} 
          }
  },{})
}


export default function Tree({lookuptable,nodes,parent,child,toggleAddNew,closeEditAction,setParentToAddTo,setLookuptable,addNew,editNode,editLink,editRules,setParent,setChild}) {
 
  const reset = ()=>{
      setChild();
      setParent();
      toggleAddNew(false);
      closeEditAction();
  }

  const childSelected =(e,node)=>{
    toggleAddNew(false);
    setChild(node.data.event);
  }

  const nodeSelected = (e, node)=>{
    editNode(node.data);
  }

  const linkSelected = (d, link)=>{
    editLink(link);
  }

  const ruleSelected = (d, link)=>{
    editRules(link);
  }

  const parentSelected = (e, node)=>{
   
    if (!child){
  
       toggleAddNew(true)
    }else{
        toggleAddNew(false)
    }

    setParent(node.data.event.event);
    setParentToAddTo(node.data.event.event);
  }

  useEffect(()=>{
      if (!addNew){
        setParent();
        setChild();
      }
  },[addNew])
  
  useEffect(()=>{ 

   

    if (!child){    
       return;
    }
  

    if (!child || !parent)
      return;

    
    const lut = {...lookuptable};

    lut[parent] = lut[parent] || [];

    const filtered = Object.keys(lut).reduce((acc, key)=>{
        //ignore root!
        if (key === "root"){
          return {
            ...acc,
            [key]:lut[key]
          }
        }

        const children = lut[key] || [];
        
        if (key==parent){
            return {
              ...acc,
              [key]: [...children, child]
            }
        }

   

        if (children.map(c=>c.event).indexOf(child.event) !== -1){
          return {
            ...acc,
            [key] : [...children.filter(i=>i.event!==child.event)]
          }
        }

        //return unchanged
        return {
          ...acc,
          [key] : children,
        }
    },{});

    setLookuptable(filtered);
   
  },[child,parent]);

  const svgref = useD3(
   
    (svg) => {
      const dgbox = svg.select("g#dragbox");
      svg.call(d3z.zoom().on("zoom",  (e)=>{
        dgbox.attr("transform", e.transform)
      }))
    } 
 ,[]);

//LOTS of gotchas here - need to make sure we re-bind the clicks and that we use useEffect to see the changes to state objects AND
//pass in the changed items
const allexcept = (tree, nodestoignore=[])=>{
  const eligible = [];
  tree.each(n=>{
      if (nodestoignore.indexOf(n.data.name)==-1){
         eligible.push(n.data.name);
      }
  })
  return eligible;
}

const allchildren = (node, lut)=>{
    if (!lut[node] || lut[node].length <= 0){
        return []
    }
    return [...lut[node], ...lut[node].reduce((acc, n)=>{
        return [...acc, ...allchildren(n.event,lut)]
    },[])]
}


//NASTY!
const _empty = (arr)=>{

  console.log("checing if empty", arr);
  if (!arr || arr.length <= 0 || arr.length <= 0 || arr[0].length <= 0){
    return true;
  } 

  /*const x = arr[0][0];
  if (typeof x == "string"){
    if (x.trim()=="")
      return true;
  }*/
  return false;
}

const treeref = useD3((root) => {
    console.log("lookuptable is", lookuptable);
    console.log("nodes are", nodes);
    const jsontree = convertToHierarchy(lookuptable,nodes);
    const hier = (d3h.hierarchy(jsontree, d=>d.children));
    let _lookup = {}
  
    const tree   =  d3h.tree().nodeSize([sw+XPADDING,sh+YPADDING])(hier);  

    //we use this table to generate the loop links
    for (const n of tree.descendants()){
      _lookup[n.data.event.event] = {x:n.x, y:n.y}
    }
   

    
  
    _loops = _loops.map(l=>{
      return {
        from : {name: l.from.event, x:_lookup[l.from.event].x, y:_lookup[l.from.event].y+ sh} ,
        to: { name: l.to.event, x:_lookup[l.to.event].x, y:_lookup[l.to.event].y+ LINKDELTA, op:l.to.op, actions:_printableactions(l.to.actions)}
      }
    })

    const _links  = [..._expanded(links(tree)), ..._loops];

    const currentlinks = lookuplinks(_links);

    let eligible = [];
    
    
    const isloopback = (l)=>{
      return l.from.x === l.to.x && l.from.y > l.to.y;
    }

    const parentfor = Object.keys(lookuptable).reduce((acc,key)=>{
        if (key === "root"){
            return acc;
        }
        const item = lookuptable[key];
        
        return {
                    ...acc, 
                    ...(item.reduce((acc,obj)=>{
                        return {
                            ...acc,
                            [obj.event] : key,
                        }
                    },{}))
        }
    },{});
    
    if (child){
      
      //ignore all children, current parent and self as candidates for new parent
      const nodestoignore = [...allchildren(child.event,lookuptable).map(e=>e.event), parentfor[child.event], child.event];
      eligible = allexcept(tree,nodestoignore);
    }

    root.selectAll("g#slide")
        .data(tree.descendants(), (d) => {
            return d.data.event.id
        }) 
        .join(
        enter => {

          //render slides!
          const node = enter.append("g")
                            .attr("id", "slide")
                            .attr("transform", (d, i) => `translate(${d.x},${d.y+20})`)
          
          node.append("circle")
              .attr("id", d=>d.data.name)
              .attr("cx", sw/2)
              .attr("cy",sh/2)
              .attr("r", sh/2)
              .style("stroke","black")
              .style("stroke-width", "1.87px")
              .style("fill", "white")
              .on("dblclick", (e,n)=>nodeSelected(e,n))

           node.append("text")
                .attr("x", sw/2)
                .attr("y", sh/2+5)
                .style("text-anchor", "middle")
                .text((d)=>d.data.name)
                .on("dblclick", (e,n)=>nodeSelected(e,n))
        },
        update =>{
          update.transition().duration(ANIMATION_DURATION).attr("transform", (d, i) => `translate(${d.x},${d.y+20})`);
          update.select("circle").on("dblclick", (e,n)=>nodeSelected(e,n))
          update.select("text").on("dblclick", (e,n)=>nodeSelected(e,n))
        },
        
        exit => exit.call(exit =>
              exit.remove().transition()
                  .duration(ANIMATION_DURATION)
                  .delay((d, i) => i * 100)
                  .attr("transform", (d,i) => `translate(${i * 50},50)`)
                  .style("opacity", 0)
                  .remove()
            )
        )//update passed through to this..
       
        
    //render links!
    const link = root.selectAll("path#link").data(_links, d=>`${d.from.name}${d.to.name}${d.to.actions.join(",")}`).join(
          enter => {
            enter.append("path").attr("id", "link").attr("d", l=>{
              if (isloopback(l)){
                return _loopback(l.from.x+(sw/2), l.from.y+LINKDELTA, l.to.x+(sw/2), l.to.y)
              }
              return _clink(l.from.x+(sw/2), l.from.y+LINKDELTA+TARGETBIGR, l.to.x+(sw/2), l.to.y-TARGETBIGR);
            })
            .style("stroke","#000")
            .style("opacity",1)
            .style("stroke-width", 2.5)
            .style("fill", "none")
            .transition().duration(ANIMATION_DURATION).style("opacity", 1);
          },
          update=>update,
          exit => exit.call(exit=>exit.remove())
      )
      .transition()
      .duration(ANIMATION_DURATION)
      .attrTween("d", l=>{
          const last = treeref.current.last || {};
          const l1 = last[`${l.from.name}_${l.to.name}`];
          

          var previous = l1 ?  _clink(l1.x1+(sw/2), l1.y1+LINKDELTA+TARGETBIGR, l1.x2+(sw/2), l1.y2-TARGETBIGR) : _clink(l.from.x+(sw/2), l.from.y+LINKDELTA+TARGETBIGR, l.to.x+(sw/2), l.to.y-TARGETBIGR);
          var current =  isloopback(l) ? _loopback(l.from.x+(sw/2), l.from.y+LINKDELTA, l.to.x+(sw/2), l.to.y) : _clink(l.from.x+(sw/2), l.from.y+LINKDELTA+TARGETBIGR, l.to.x+(sw/2), l.to.y-TARGETBIGR);
          
          return interpolatePath(previous, current);
      }).on("end", ()=>{
        treeref.current.last = currentlinks; //memoise the previous links
      });
    
     //render actions within links
     root.selectAll("g#link").data(_links, d=>{return`${d.from.name}${d.to.name}${d.to.actions.join(",")}${d.to.op}`}).join(
        enter => {
            const target = enter.append("g").attr("id", "link").attr("transform", l=>`translate(${l.from.x+sw/2 - (l.from.x-l.to.x)/2}, ${l.to.y+ (l.from.y+LINKDELTA-l.to.y)/2})`);
           
            target.append("circle").attr("id", "link").style("opacity",0).style("fill","rgb(243, 244, 246)").style("stroke","none").attr("cx", 0).attr("cy",-YPADDING+sh).attr("r",10).transition().duration(ANIMATION_DURATION).style("opacity",1);
            target.append("text").attr("id", "rule").style("text-anchor", "middle").style("font-weight", "bold").style("font-size", "10px").attr("x",0).attr("y",-YPADDING+sh).text(l=>l.to.op).on("click", (e,l)=>linkSelected(e,l))
           
            target.append("circle").attr("id", "label").style("fill","rgb(243, 244, 246)").style("opacity", l=>l.to.actions && l.to.actions.length > 0 ? 1 : 0).style("stroke","none").attr("cx", l=>isloopback(l) ? (sw/2)*1.5:0).attr("cy",0).attr("r",20).on("click", (e,l)=>linkSelected(e,l))
            target.append("text").attr("id","action").style("font-size", "10px").style("text-anchor", "middle").attr("x",l=>isloopback(l) ? (sw/2)*1.5:0).attr("y",0).text(l=>_empty(l.to.actions) ? "+" : l.to.actions).on("click", (e,l)=>linkSelected(e,l))
            
        },
        update=>{
            update.transition().duration(ANIMATION_DURATION).attr("transform", l=>`translate(${l.from.x+sw/2 - (l.from.x-l.to.x)/2}, ${l.to.y+ (l.from.y+LINKDELTA-l.to.y)/2})`);
            update.select("circle#label").style("opacity", l=>l.to.actions && l.to.actions.length > 0 ? 1 : 0).on("click", (e,l)=>linkSelected(e,l))
            update.select("text#action").on("click", (e,l)=>linkSelected(e,l));
            update.select("text#rule").on("click", (e,l)=>linkSelected(e,l));
        },
        exit => exit.call(exit=>exit.remove())
    );

    const _parentSelected = (e, n)=>{
        if (!child || eligible.indexOf(n.data.event.event) != -1){
            parentSelected(e,n);
        }
    }
    //render targets!
    root.selectAll("g#target")
        .data(tree.descendants(), d => `${d.data.name}${child ? d.data.name==child ? "_" : "" : ""}`)
        .join(
          enter=>{
            const target = enter.append("g").attr("id", "target").attr("transform", d=>`translate(${d.x-sw/2}, ${d.y})`)
          
            //to target
            target.append("circle").attr("id", "bigtotarget").attr("cx",sw).attr("cy", LINKDELTA+TARGETSMALLR).attr("r", TARGETBIGR).style("fill","#fff").style("stroke","#762bae").attr("stroke-width",2.5).on("click",childSelected)
            target.append("circle").attr("id", "smalltotarget").attr("cx",sw).attr("cy", LINKDELTA+TARGETSMALLR).attr("r", TARGETSMALLR).style("fill","#ae2b4d").style("stroke","#6F67CC").attr("stroke-width",2.5).on("click",childSelected)
           
            //from target
            target.append("circle").attr("id", "bigfromtarget").attr("cx",sw).attr("cy", sh+LINKDELTA).attr("r",  TARGETBIGR).style("fill", d=> parent && parent == d.data.name ? "#ae2b4d":"white").style("stroke","black").attr("stroke-width",2.5).on("click", _parentSelected)
            target.append("circle").attr("id", "smallfromtarget").attr("cx",sw).attr("cy", sh+LINKDELTA).style("opacity", child ? 1 : 0).attr("r",  TARGETSMALLR).style("fill", d=> parent && parent == d.data.name ? "#ae2b4d":"white").style("stroke","#cc6767").attr("stroke-width",2.5).on("click",_parentSelected)
            target.append("text").attr("id", "smalltotarget").attr("x",sw).attr("y",sh+LINKDELTA+5).text("+").style("text-anchor", "middle").style("fill","black").on("click", _parentSelected)
            
          
        },
        update=>{
            
            update.transition().duration(ANIMATION_DURATION).attr("transform", d=>`translate(${d.x-sw/2}, ${d.y})`)
            update.selectAll("circle#bigtotarget").style("fill", (d)=> child && child == d.data.name ? "red" : "white").style("stroke", (d)=>child && child == d.data.name ? "white" : "#762bae").on("click", childSelected)
            update.selectAll("circle#smalltotarget").style("fill", (d)=>child && child== d.data.name ? "red" : "#ae2b4d").style("stroke",(d)=>child && child == d.data.name ? "white" : "#6F67CC").on("click", childSelected)   
            update.selectAll("circle#bigfromtarget").style("stroke", child ? "#ae2b4d" : "black").style("fill", d=> parent && parent == d.data.name ? "#ae2b4d":"white").on("click", _parentSelected).transition().duration(ANIMATION_DURATION).attr("r", d=>eligible.indexOf(d.data.name) == -1 ? TARGETBIGR :  TARGETBIGR+4)
            update.selectAll("circle#smallfromtarget").style("opacity", child ? 1 : 0).style("fill",  d=> parent &&  parent == d.data.name ? "#ae2b4d":"white").on("click", _parentSelected).transition().duration(ANIMATION_DURATION).attr("r", d=>eligible.indexOf(d.data.name) == -1 ? TARGETSMALLR : TARGETSMALLR+2).attr("class", d=>eligible.indexOf(d.data.name) == -1 ? "":"pulse");
            update.selectAll("text#smalltotarget").style("opacity", child ? 0 : 1).on("click",_parentSelected)
           
          
          },
          exit=> exit.call(exit=>exit.remove())
        )

      
  }, [child, parent, lookuptable, nodes]);

 
  //can we do the rendertree, renderlinks and rendertargets in d3 hook?  
  //we can even have two ref objects to deal with the zoom box?
  return (
    <div >
     
      <main>
            <div className="flex justify-center items-center flex-col">
                
            <svg onClick={()=>reset()} ref={svgref} width={"100vw"} height={"100vh"}>
                <g  id="dragbox">
                    <g onClick={(e)=>{e.stopPropagation()}}  ref={treeref}>
                    </g>
                </g>
            </svg>
           
            </div>
      </main>
    </div>
  )
}
