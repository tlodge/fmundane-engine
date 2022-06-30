import logo from './logo.svg';
import './App.css';
import Boxable from './Boxable';
import Box from './Box';
import './DragThingsToBoxesDemo.css';
import {useState, useEffect} from 'react';
import request from 'superagent';

function App() {

  const [box1,setBox1] = useState([]);
  const [box2,setBox2] = useState([]);

  useEffect(()=>{
    const dropped = [...box1, ...box2];
    //call the webhook here;
    const fire = async ()=>{
      console.log("calling webhook!!!");
      await request.get("/event/webhook?trigger=green")
    }

    if (dropped.length >= 6){
      fire();
    }
  },[box1,box2]);

  const onDrop = ()=>{
    console.log("succesfully dropped!!!!");
  }
  const handleChanged = (id, items)=>{
     if (id == "box1"){
       setBox1(items);
     }else if (id=="box2"){
       setBox2(items);
     }
  }

  return (
    <div style={{background:"black", height:"100vh", overflow:"none", justifyContent:"center", display:"flex", alignItems:"center"}}>
      <div className="drag_things_to_boxes" style={{background:"black",display:"flex", flexDirection:"column", }}>
        <div style={{display:'flex', flexDirection:"row", justifyContent:"center"}}>
          <Boxable targetKey="box" label="A"/>
          <Boxable targetKey="box" label="1" />
          <Boxable targetKey="box" label="6" />
          <Boxable targetKey="box" label="9" />
          <Boxable targetKey="box" label="W" />
          <Boxable targetKey="box" label="P" />
        </div>
        <div style={{display:'flex', flexDirection:"row", justifyContent:"center"}}>
          <Box targetKey="box" itemsChanged={(items)=>handleChanged("box1",items)}/>
          <Box targetKey="box" itemsChanged={(items)=>handleChanged("box2",items)}/>
        </div>
      </div>
      </div>
  );
}

export default App;
