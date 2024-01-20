import React from "react"
import Die from "./Die"
import SucessDetails from "./SucessDetails"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css'

// ... (other imports and components)

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollTimes, setRollTimes] = React.useState(0);
  const [minutesTaken, setMinutesTaken] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(0);
  const [newTime, setNewTime] = React.useState(0);
  const [secondsTaken, setSecondsTaken] = React.useState(0);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [time, setTime] = React.useState({
    startMin: 0,
    finishMin: 0,
    startSec: 0,
    finishSec: 0,
  });

  React.useEffect(() => {
    const finishDate = new Date();
    setTime((prevTime) => ({
      ...prevTime,
      finishMin: finishDate.getMinutes(),
      finishSec: finishDate.getSeconds(),
    }));
  }, [dice]);

  React.useEffect(() => {
    const secondsDiff =
      time.finishSec >= time.startSec
        ? time.finishSec - time.startSec
        : 60 + time.finishSec - time.startSec;
    const minutesDiff =
      time.finishMin >= time.startMin
        ? time.finishMin - time.startMin
        : 60 + time.finishMin - time.startMin;
  
    setSecondsTaken(secondsDiff);
    setMinutesTaken(minutesDiff);
  
    setNewTime(`${minutesTaken} min ${secondsTaken} sec`);
    console.log(newTime)
  }, [time]);
     
  
 

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  React.useEffect(() => {
    if (tenzies === true) {
      const timeoutId = setTimeout(() => {
        setDetailsVisible(true);
      }, 3500);
      return () => clearTimeout(timeoutId);
    }
  }, [tenzies]);

  React.useEffect(() => {
    const startDate = new Date();
    setTime({
      startMin: startDate.getMinutes(),
      startSec: startDate.getSeconds(),
      finishMin: 0,
      finishSec: 0,
    });
  }, [tenzies]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
      );
      setRollTimes((prevRollTime) => prevRollTime + 1);
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRollTimes(0);
      setSecondsTaken(0);
      setMinutesTaken(0);
      setTime({
        startMin: 0,
        finishMin: 0,
        startSec: 0,
        finishSec: 0,
      });
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => (die.id === id ? { ...die, isHeld: !die.isHeld } : die))
    );
  }

  function toggleShowDetails() {
    setDetailsVisible(false);
  }

  const diceElements = dice.map((die) => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ));

  return (
    <main>
      {detailsVisible && (
        <SucessDetails
          rollTimes={rollTimes}
          toggleShowDetails={toggleShowDetails}
          newTime={newTime}
          bestTime={newTime}
        />
      )}
      {!detailsVisible && (
        <>
          {tenzies && <Confetti />}
          <div className="heading">
            <h1 className="title">Tenzies</h1>
            {tenzies && <p className="displaydetails" onClick={() => setDetailsVisible(true)}>Success Details</p>}
          </div>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
          </p>
          <p className="message">
            <i>{tenzies && 'You did it! Congrats🎉'}{(secondsTaken > 5 && !tenzies)&& 'Not Yet...'}</i>
          </p>
          <div className="dice-container">{diceElements}</div>
          <button className="roll-dice" onClick={rollDice}>
            {tenzies ? 'New Game' : 'Roll'}
          </button>
        </>
      )}
    </main>
  );
}
