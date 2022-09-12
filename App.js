import Start from './client/Start';
import Game from './client/Game';

import io from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//const socket = io('http://localhost:3001');
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Start />} />
          <Route path='/game' element={<Game />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
