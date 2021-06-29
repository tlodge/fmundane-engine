import './App.css';
import Creator from './features/creator';
import {ActionCreator} from './features/creator/ActionCreator';
import Layer from './features/layer';
import { useSelector, useDispatch} from 'react-redux';

import {
  selectViewAdd,
  linkToEdit,
  setViewAddNode,
} from './features/creator/creatorSlice';

function App() {
  const dispatch = useDispatch();
  const viewAdd  = useSelector(selectViewAdd);
  const link = useSelector(linkToEdit);

  const renderCreate = ()=>{
    return <div onClick={()=> {dispatch(setViewAddNode(false))}} className="absolute flex w-screen h-screen  items-center justify-center">
              <div onClick={(e)=> {e.stopPropagation()}}  className="shadow-xl p-2 bg-white rounded"><Creator/></div>
            </div>
  }
 
  return (
    <div className="App w-screen">
       <div className="flex flex-row shadow p-4">
            {link && <div className="flex flex-grow absolute shadow-xl p-2 bg-white rounded" ><ActionCreator/></div>}
            {viewAdd && renderCreate()}
            <div className="flex flex-grow"><Layer/></div>
       </div>
    </div>
  );
}

export default App;
