import './App.css';
import Creator from './features/creator';
import {ActionCreator} from './features/creator/ActionCreator';
import Layer from './features/layer';
import { useSelector } from 'react-redux';

import {
  selectViewAdd,
  linkToEdit
} from './features/creator/creatorSlice';

function App() {
  const viewAdd  = useSelector(selectViewAdd);
  const link = useSelector(linkToEdit);

  console.log("ok in APP view have", viewAdd)
  return (
    <div className="App w-screen">
       <div className="flex flex-row shadow p-4">
            {link && <div className="flex flex-grow absolute shadow-xl p-2 bg-white rounded" ><ActionCreator/></div>}
            {viewAdd && <div className="flex flex-grow absolute shadow-xl p-2 bg-white rounded" style={{width:475}}><Creator/></div>}
            <div className="flex flex-grow"><Layer/></div>
       </div>
    </div>
  );
}

export default App;
