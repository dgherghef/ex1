import './style.css';
import { useState, useEffect } from 'react';
import queryString from 'query-string';
import BACK from './cards/BACK.png';
import Code from './Code';

import io from 'socket.io-client';

let socket;
var nr = 0;
var nr1 = 0;
var k = 0;
var flux;

function Game({ location }) {
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [playerCard, setPlayerCard] = useState('');
  let message = '';
  const ENDPOINT = 'localhost:5000';
  const [playerSum, setPlayerSum] = useState(0);
  const [youSum, setYouSum] = useState(0);
  var sum1 = 0;
  var sum2 = 0;
  const [countAPlayer, setCountAPlayer] = useState(0);
  const [countAYou, setCountAYou] = useState(0);
  var countAceP = 0,
    countAceY = 0;
  //var countAYou = 0;
  let checkClient = false;
  var firstCard;
  var hide = [];
  var youCards = [];
  const [hide1, setHide1] = useState([]);
  var deck = [];
  const [youCards1, setYouCards1] = useState([]);
  const [elem, setElem] = useState([]);
  var hideCards;

  // window.onload = function () {
  //   onDeck();

  //   shuffleCards();
  //   play();
  // };
  useEffect(() => {
    while (nr1 == 0) {
      onDeck();
      shuffleCards();
      play();
      console.log(playerSum);
      nr1++;
    }
  }, []);
  useEffect(() => {
    const { room } = queryString.parse(window.location.search);

    socket = io.connect(ENDPOINT);
    setRoom(room);

    socket.emit('join', { room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    var player2 = youCards;
    hideCards = hide;
    socket.emit('card', hideCards, player2);
    socket.on('card', receivingCards1);
    //socket.on('cardBack', receivingCards2);
  }, [ENDPOINT, window.location.search]);

  function receivingCards1(data) {
    console.log(' player1:' + data.player1);
    setHide1(data.player2);

    //setYouCards1(data.player1);

    console.log('Hide: ' + hide1);
  }
  function receivingCards2(data) {
    console.log(data.player1);
    //youCards = data.player1;
    hide = data.player2;
  }
  useEffect(() => {
    socket.on('roomData', (users) => {
      setUsers(users.users);
    });
  }, []);

  console.log(users);

  // if (users.length / 2 < 2) message = 'Waiting for player2!';
  // else if (users.length / 2 > 2) message = 'Full Room';
  // else
  checkClient = true;

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  }

  const images = importAll(
    require.context('./cards', false, /\.(png|jpe?g|svg)$/)
  );

  function onDeck() {
    let values = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ];
    let types = ['C', 'D', 'H', 'S'];

    types.map((elemType) => {
      values.map((elemValue) => {
        deck.push(elemValue + '-' + elemType);
      });
    });
  }

  function shuffleCards() {
    for (let i = 0; i < deck.length; i++) {
      let randomNum = Math.floor(Math.random() * deck.length);
      let aux = deck[i];
      deck[i] = deck[randomNum];
      deck[randomNum] = aux;
    }
    console.log(deck);
  }
  function play() {
    while (nr == 0) {
      // firstCard = deck.pop();
      // sum1 = sum1 + returnValue(firstCard);
      // countAceP = countAceP + countAce(firstCard.split('-')[0]);

      // hide.push(firstCard);
      // console.log(sum1);
      while (hide.length < 2) {
        let imag = document.createElement('img');
        let card = deck.pop();
        imag.src = images['BACK.png'];
        imag.alt = card + '.png';
        sum1 = sum1 + returnValue(card);
        countAceP = countAceP + countAce(card.split('-')[0]);
        document.getElementById('player-cards').append(imag);
        hide.push(card);
      }
      console.log(hide);
      //console.log(playerSum);
      while (youCards.length < 2) {
        let imag = document.createElement('img');
        let card = deck.pop();
        imag.src = images[card + '.png'];
        sum2 = sum2 + returnValue(card);
        countAceY = countAceY + countAce(card.split('-')[0]);
        //console.log(card.split('-')[0]);
        document.getElementById('you-cards').append(imag);
        youCards.push(card);
      }
      setPlayerSum(sum1);
      setYouSum(sum2);
      setCountAPlayer(countAceP);
      setCountAYou(countAceY);
      setHide1(hide);
      setYouCards1(youCards);

      console.log('player ' + youCards1);
      console.log('ur sum: ' + youSum);
      nr++;
    }
  }
  // console.log(playerSum);
  function returnValue(element) {
    let card = element.split('-');
    let cardValue = card[0];

    if (isNaN(cardValue)) {
      if (cardValue === 'A') {
        return 11;
      }
      return 10;
    }
    return parseInt(cardValue);
  }
  function countAce(element) {
    if (element === 'A') return 1;
    return 0;
  }
  // function returnSum() {}
  function onHit() {
    onDeck();
    shuffleCards();
    //console.log(youCards);
    let imag = document.createElement('img');
    let card1 = deck.pop();
    console.log(card1);
    imag.src = images[card1 + '.png'];
    var elem = youSum + returnValue(card1);
    setYouSum(elem);
    countAceY = countAceY + countAce(card1.split('-')[0]);
    document.getElementById('you-cards').append(imag);
    youCards.push(card1);
    setYouCards1(youCards);

    if (checkAs(youSum, countAYou) > 21) {
      document.getElementById('hit').style.backgroundColor =
        'rgb(207, 209, 212)';
      document.getElementById('hit').disabled = true;
    }
  }
  function checkAs(elem, count) {
    while (elem >= 21 && count > 0) {
      elem = elem - 10;
      count = count - 1;
    }
    return elem;
  }
  function onStand() {
    //const cardValues = { player1: hide1 };
    //console.log(youCards1);
    //receivingCards1(cardValues);
    var valuePC = checkAs(playerSum, countAPlayer);
    var valueYC = checkAs(youSum, countAYou);
    setPlayerSum(valuePC);
    setYouSum(valueYC);

    document.getElementById('hit').disabled = true;

    document.getElementById('player-cards').innerHTML = '';
    console.log(hide1);
    hide1.map((el) => {
      let imag = document.createElement('img');
      imag.src = images[el + '.png'];
      document.getElementById('player-cards').append(imag);
    });

    console.log(youSum);
    let msg = '';
    if (valueYC > 21) {
      msg = 'Loser';
    } else if (valuePC > 21) msg = 'Winner';
    else if (valueYC === valuePC) msg = 'Tie';
    else if (valueYC > valuePC) msg = 'Winner';
    else msg = 'Loser';
    document.getElementById('player').innerText = valuePC;
    document.getElementById('you').innerText = valueYC;
    document.getElementById('results').innerText = msg;
  }
  return (
    <div className='container1'>
      <Code room={room} />
      {checkClient ? (
        <div>
          <h1>Player:</h1>
          <a id='player'></a>
          <div id='player-cards'>
            <img alt='back card' id='hide' src={BACK}></img>
          </div>
          <button id='hit' onClick={onHit}>
            Hit
          </button>
          <button id='stand' onClick={onStand}>
            Stand
          </button>
          <h1>You:</h1>
          <a id='you'></a>

          <div id='you-cards'></div>

          <p id='results'></p>
        </div>
      ) : (
        <h1>{message}</h1>
      )}
    </div>
  );
}
export default Game;
