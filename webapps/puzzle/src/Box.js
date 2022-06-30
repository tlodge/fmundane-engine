import {useState} from 'react';
import shortid from 'shortid';
import {DropTarget} from 'react-drag-drop-container';
import BoxItem from './BoxItem';
function Box(props){
    const [items,setItems] = useState([])
   
  
    const handleDrop = (e) => {
      const _items = [...items.slice(), {label: e.dragData.label, uid: shortid.generate()}]
      setItems(_items)
      e.containerElem.style.visibility="hidden";
      props.itemsChanged(_items);
    };
  
    const swap = (fromIndex, toIndex, dragData) => {
      let _items = items.slice();
      const item = {label: dragData.label, uid: shortid.generate()};
      _items.splice(toIndex, 0, item);
      setItems(_items);
      props.itemsChanged(_items);
    };
  
    const kill = (uid) => {
      const _items = items.filter(item=>item.uid != uid)
      setItems(_items)
      props.itemsChanged(_items);
    };
  

    return (
        <div className="component_box">
            <DropTarget
              onHit={handleDrop}
              targetKey={props.targetKey}
              dropData={{name: props.name}}
            >
              <DropTarget
                onHit={handleDrop}
                targetKey="boxItem"
                dropData={{name: props.name}}
              >
                <div className="box">
                  {items.map((item, index) => {
                    return (
                      <BoxItem key={item.uid} uid={item.uid} kill={kill} index={index} swap={swap}>
                        {item.label}
                      </BoxItem>
                    )
                  })}
                </div>
              </DropTarget>
            </DropTarget>
        </div>
      );
}

export default Box;
  