import './App.css';
import Creator from './features/creator';
import {ActionCreator} from './features/creator/ActionCreator';
import Layer from './features/layer';
import { useSelector, useDispatch} from 'react-redux';

import {
  selectViewAdd,
  linkToEdit,
  setViewAddNode,
  setEditLink,
} from './features/creator/creatorSlice';

function App() {
  const dispatch = useDispatch();
  const viewAdd  = useSelector(selectViewAdd);
  const link = useSelector(linkToEdit);

  const onClose = ()=>{
    dispatch(setViewAddNode(false))
    dispatch(setEditLink());
  }

  const renderCreate = ()=>{
    return <div className="absolute flex w-screen h-screen  items-center justify-center" style={{zIndex:30}}>
              <div   className="shadow-xl p-2 bg-white rounded overflow-auto" style={{maxHeight: "80vh",  width:"900px"}}><Creator onClose={onClose}/></div>
            </div>
  }
 
  const renderActions = ()=>{
    return <div  className="absolute flex w-screen h-screen  items-center justify-center" style={{zIndex:30}}>
    <div className="flex flex-grow absolute shadow-xl p-2 bg-white rounded overflow-auto" style={{maxHeight: "80vh",  width:"745px"}} ><ActionCreator onClose={onClose}/></div>
    </div>
  }

  return (
    <div className="App w-screen">
       <div className="flex flex-row shadow bg-gray-100">
            {link && renderActions()}
            {viewAdd && renderCreate()}
            <div className="flex flex-grow"><Layer/></div>
       </div>
    </div>
  );
}

export default App;
