import React from 'react'

export default function DiceComponent(props) {
    const diceFaces = props.dice.map((die) => {
        let styling = {}
        if (props.rollClicked > 0 && props.timer === 0) {
            styling = {
                backgroundColor: "#e63946"
            }
        } else {
            styling = {
                backgroundColor: die.isHeld && "#59E391"
            }
        }

        return <div style={styling} key={die.id} className='dice' onClick={() => props.holdDice(die.id)}>
            <h1 className='dice-num'>{die.value}</h1>
        </div>
    })

    return (
        <div>
            <div className="dice-container">
                {diceFaces}
            </div>
        </div>
    )
}