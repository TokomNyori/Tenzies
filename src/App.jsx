import React, { useState, useEffect, useRef } from 'react';
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import ConfettiAudio from "./assets/confetti.mp3"
import HeartBeat from "./assets/heartBeat.mp3"
import DiceComponent from './DiceComponent';
//import useWindowSize from 'react-use/lib/useWindowSize'
import { useWindowSize } from 'react-use'
import './index.css'
import './gameInfo.css'
import './instructions.css'

export default function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [timer, setTimer] = useState(18)
  const [timerTracker, setTimerTraker] = useState(18)
  const [rollBtn, setRollBtn] = useState('Roll')
  const [rollClicked, setRollClicked] = useState(0)
  const intervalSetter = useRef()
  const { width, height } = useWindowSize()

  useEffect(() => {
    // Longer traditional way
    // console.log('Dice state changed!')
    // let diceVals = []
    // let diceHolds = []
    // for (let i = 0; i < dice.length; i++) {
    //   diceVals[i] = dice[i].value;
    //   diceHolds[i] = dice[i].isHeld;
    // }
    // if (diceVals.every(val => val === diceVals[0]) && diceHolds.every(val => val === diceHolds[0])) {
    //setTenzies(true)
    //   console.log('Tenzies')
    // }

    // Shorter modern way
    // const allHeld = dice.every(die => die.isHeld)
    // const allSameValue = dice.every(die => die.value === dice[0].value)
    // if (allHeld && allSameValue) {
    //   setTenzies(true)
    //   console.log("Tenzies")
    // }

    // Shorter traditional way way
    // if (timer < 1) {
    //   setDice(allNewDice())
    // }

    if (timer === 0) {
      return
    }

    for (let i = 0; i < dice.length; i++) {
      if (dice[i].value !== dice[0].value || dice[i].isHeld !== dice[0].isHeld) {
        return
      }
    }
    setTenzies(true)
    const timeTaken = timerTracker - timer
    setTimerTraker(timeTaken)
    clearInterval(intervalSetter.current)
    setRollBtn('New Game')
  }, [dice])

  useEffect(() => {
    if (tenzies) {
      const audio = new Audio(ConfettiAudio);
      audio.play();
    }
  }, [tenzies])

  let audio2

  useEffect(() => {

    if (rollClicked === 1 && timer > 0) {
      countDown()
    }

    if (timer === 0) {
      setRollBtn('New Game')
      audio2 = new Audio(HeartBeat);
      audio2.play();
    }

    return () => clearInterval(intervalSetter.current)
  }, [rollClicked, timer])

  function allNewDice() {
    const min = 1
    const max = 6
    let diceObject = []
    for (let i = 0; i < 10; i++) {
      diceObject.push({
        id: nanoid(),
        value: Math.floor(Math.random() * (max - min + 1) + min),
        isHeld: false
      })
    }
    return diceObject
  }

  function changeTimer(event) {
    const targetValue = event.target.value
    if (targetValue < 1 || targetValue > 60) {
      setTimer("")
    } else {
      setTimer(targetValue)
      setTimerTraker(targetValue)
    }
  }

  console.log("TimeTracker: " + timerTracker)

  function countDown() {
    intervalSetter.current = setInterval(() => {
      setTimer(prevState => prevState - 1)
    }, 1000)
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false)
      setDice(allNewDice())
      setRollBtn('Roll')
      setRollClicked(0)
      setTimer(18)
      setTimerTraker(18)
      return
    }

    if (rollClicked > 0 && timer === 0) {
      setDice(allNewDice())
      setRollBtn('Roll')
      setRollClicked(0)
      setTimer(18)
      setTimerTraker(18)
      return
    }

    if (rollClicked === 0) {
      setRollClicked(1)
    }

    const oldDice = [...dice]
    const newDice = allNewDice()
    const modifiedDice = []
    for (let i = 0; i < oldDice.length; i++) {
      oldDice[i].isHeld ? modifiedDice[i] = oldDice[i] : modifiedDice[i] = newDice[i] //Ternary operator
    }
    setDice(modifiedDice)
  }

  function holdDice(id) {
    // Traditional way
    // const newDice = [...dice]
    // for (let i = 0; i < newDice.length; i++) {
    //   if (newDice[i].id === id) {
    //     newDice[i].isHeld = !newDice[i].isHeld
    //   }
    // }
    // setDice(newDice)

    //Modern way in es6
    setDice(prevState => prevState.map((die) => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    })
    )
  }

  function gameInfo() {
    if (tenzies) {
      return <p className="tenzies">Took {timerTracker}s</p>
    } else if (rollClicked > 0 && timer === 0) {
      return <p className="game-over">Game over</p>
    } else if (rollClicked > 0 && timer > 0) {
      return <p className="message">{timer}s</p>
    } else {
      return <input className='message-input' type="number" min="1" value={timer} max="59" name="timer-input" onChange={changeTimer} />
    }
  }

  function titleStyling() {
    if (tenzies) {
      return "glowing-green"
    } else if (rollClicked > 0 && timer === 0) {
      return "glowing-red"
    } else {
      return "title"
    }
  }

  return (
    <main>
      {tenzies && <Confetti width={width} height={height} />}
      <div className="instructions-container">
        <h1 className="instruction-heading">Instruction</h1>
        <p className="instructions">
          Roll the dice until they all show the same number before the timer runs out. You can freeze a die by clicking on it.
          The timer is set to 18 seconds by default.
        </p>
      </div>
      <div className="frame">
        <div className="board">
          <div className="game-info">
            <h1 className={titleStyling()}>Tenzies</h1>
            {gameInfo()}
          </div>
          <DiceComponent dice={dice} holdDice={holdDice} timer={timer} rollClicked={rollClicked} tenzies={tenzies} />
          <button className='roll-btn' onClick={() => rollDice()} >{rollBtn}</button>
        </div>
      </div>
    </main>
  )

}