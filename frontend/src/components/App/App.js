import React, { useState } from 'react';
import './App.css';

import Navigation from '../Navigation/Navigation';
import Routes from '../../Routes';

function App() {
  const [username, setUsername] = useState('');
  const setUser = username => {
    setUsername(username);
  }

  return (
    <>
      <Navigation username={username} />
      <Routes setUser={setUser}  />
    </>
  );
}

export default App;
