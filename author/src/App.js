import './App.css';
import Creator from './features/creator';
import Layer from './features/layer';
import { useSelector } from 'react-redux';

import {
  selectViewAdd
} from './features/creator/creatorSlice';

function App() {
  const viewAdd  = useSelector(selectViewAdd);

  console.log("ok in APP view have", viewAdd)
  return (
    <div className="App w-screen">
       <div className="flex flex-row shadow p-4">
            {viewAdd && <div className="flex flex-grow absolute shadow-xl p-2 bg-white rounded" style={{width:475}}><Creator/></div>}
            <div className="flex flex-grow"><Layer/></div>
       </div>
    </div>
  );
}

export default App;
