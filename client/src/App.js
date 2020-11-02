import {useEffect, useState} from 'react';


import io from 'socket.io-client';
import Experience from './Experience';

const socket = io('http://localhost:3001');

function App() {

 
  const [experiences, setExperience] = useState([]);

  useEffect(() => {
    let _experiences = [];
    socket.on('stateupdate', payload => {
      console.log("seen expereinces", payload);
      _experiences = [..._experiences.filter(e=>e.id !== payload.id), payload];
      setExperience(_experiences);
    });
  }, []); //only re-run the effect if new message comes in

  const experiencelist = experiences.map(e=><Experience key={e.id} {...e} />);

  return (
    <div className="App">
      <header className="App-header">
        {experiencelist}
      </header>
    </div>
  );
}

export default App;
