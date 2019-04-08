import React, { useState } from 'react'
import Chip from '@material-ui/core/Chip'
import d4 from './assets/d4.png'
import d6 from './assets/d6.png'
import d8 from './assets/d8.png'
import d10 from './assets/d10.png'
import d12 from './assets/d12.png'
import d20 from './assets/d20.png'
import d90 from './assets/d90.png'
import styles from './Roll.module.scss'

const die = {
  '4'  : d4,
  '6'  : d6,
  '8'  : d8,
  '10' : d10,
  '12' : d12,
  '20' : d20,
  '90' : d90,
}

const isGM = true

const gmChoices = {
  '4'  : ['1', '2', '3', '4'],
  '6'  : ['1', '2', '3', '4', '5', '6'],
  '8'  : ['1', '2', '3', '4', '5', '6', '7', '8'],
  '10' : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  '12' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  '20' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
  '90' : ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
}

function Roll({ dice, onEnd }) {
  const [ roll, setRoll ] = useState([])
  const [ cur, setCur ] = useState(dice[0])

  return (
    <div className={styles.roll}>
    
      {
        !isGM? (
          <Chip
            className={styles.label}
            label="ROLL"
            variant="outlined"
          />
        ) : null
      }
    
      <div className={styles.die}>
        {
          dice.map((d, i) =>
            <img
              key={d}
              className={isGM? i === roll.length? styles.gmCur : styles.gmDie : undefined}
              src={die[d]}
              alt="die"
            />
          )
        }
      </div>

      {
        isGM? (
          <div className={styles.nums}>
            {
              gmChoices[cur].map(n =>
                <Chip
                  key={n}
                  variant="outlined"
                  color="secondary"
                  label={n}

                  onClick={() => {

                    if (roll.length+1 >= dice.length) {
                      setRoll([])
                      setCur(dice[0])
                      onEnd([...roll, n])

                      return
                    }

                    setRoll([...roll, n])
                    setCur(dice[(roll.length + 1) % dice.length])
                  }}

                />
              )
            }
          </div>
        ) : null
      }
      
    </div>
  )
}

export default Roll
