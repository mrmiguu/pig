import React, { useState } from 'react'
import Chip from '@material-ui/core/Chip'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Link from '@material-ui/core/Link'
import GMIcon from './GMIcon'
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

const gmChoices = {
  '4'  : ['1', '2', '3', '4'],
  '6'  : ['1', '2', '3', '4', '5', '6'],
  '8'  : ['1', '2', '3', '4', '5', '6', '7', '8'],
  '10' : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  '12' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  '20' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
  '90' : ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
}

const amzDice = 'https://www.amazon.com/s?k=7-die+dice+set'

function Roll({ dice, onEnd, isGM }) {
  const [ roll, setRoll ] = useState([])
  const [ cur, setCur ] = useState(dice[0])
  const [ remind, setRemind ] = useState(false)

  return (
    <div className={styles.roll}>
    
      {
        !isGM? (
          <Dialog
            open={remind}
            onClick={() => setRemind(false)}
          >
            <DialogTitle>Roll Your Dice!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Using your own <Link href={amzDice} target="_blank" rel="noopener">7-die dice set</Link>,
                roll the displayed combination and read them out for your GM.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : (
          <GMIcon />
        )
      }
    
      <div className={styles.dice}>
        {
          dice.map((d, i) =>
            <img
              key={d}
              className={isGM? i === roll.length? styles.gmCur : styles.gmDie : undefined}
              src={die[d]}
              alt="die"
              onClick={() => !isGM && setRemind(true)}
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
