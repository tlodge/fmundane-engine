/*
    Boxable -- a thing you can drag into a Box
*/
import {DragDropContainer} from 'react-drag-drop-container';

function Boxable(props){
      return (
        <div className="boxable_component" style={{display: 'inline-block'}}>
          <DragDropContainer
            targetKey={props.targetKey}
            dragData={{label: props.label}}
            customDragElement={props.customDragElement}
            onDragStart={()=>(console.log('start'))}
            onDrag={()=>(console.log('dragging'))}
            onDragEnd={()=>(console.log('end'))}
            onDrop={(e)=>(console.log(e))}>
            <div style={{display:"flex", alignItems:"center", border:"2px solid white", color:"white", justifyContent:"center", width:29, height:29, borderRadius:20, background:"black", margin:10}}>{props.label}</div>
          </DragDropContainer>
        </div>
      );
  }


export default Boxable;