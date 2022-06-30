import {DropTarget, DragDropContainer} from 'react-drag-drop-container';
import './BoxItem.css';

function BoxItem(props){
    // the things that appear in the boxes
   
    
    const handleDrop = (e) => {
      e.stopPropagation();
      props.swap(e.dragData.index, props.index, e.dragData);
      e.containerElem.style.visibility="hidden";
    };
  
    const deleteMe = () => {
      props.kill(props.uid);
    };
  
   
    return (
    <div className="box_item_component">
        <DragDropContainer
            targetKey="boxItem"
            dragData={{label: props.children, index: props.index}}
            onDrop={deleteMe}
            disappearDraggedElement={true}
            dragHandleClassName="grabber"
        >
            <DropTarget
            onHit={handleDrop}
            targetKey="boxItem"
            >
            <div className="outer">
                <div className="item">
                <span className="grabber">&#8759;</span>
                {props.children}
                </div>
            </div>
        </DropTarget>
        </DragDropContainer>
    </div>
    );
    
  }

  export default BoxItem;