import './style.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Start() {
  const [room, setRoom] = useState('');

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  return (
    <div className='start1'>
      <div className='start2'>
        <input
          type='text'
          placeholder='Code'
          onChange={(event) => setRoom(event.target.value)}
        />
        <Link to={`/game?room=${room}`}>
          <button className='startButton'>JOIN GAME</button>
        </Link>

        <h1>OR</h1>
        <div className='start5'>
          <Link to={`/game?room=${makeid(5)}`}>
            <button className='startButton'>CREATE A GAME</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;
