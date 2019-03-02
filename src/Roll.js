import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import d4 from './assets/Tetrahedron.svg'
import d6 from './assets/Hexahedron.svg'
import d8 from './assets/Octahedron.svg'
import d10 from './assets/Pentagonal_trapezohedron.svg'
import d00 from './assets/Pentagonal_trapezohedron.svg'
import d12 from './assets/Dodecahedron.svg'
import d20 from './assets/Icosahedron.svg'
import styles from './Roll.module.scss'

const isGM = true

const gmChoices = {
  '4'  : ['1', '2', '3', '4'],
  '6'  : ['1', '2', '3', '4', '5', '6'],
  '8'  : ['1', '2', '3', '4', '5', '6', '7', '8'],
  '10' : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  '00' : ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
  '12' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  '20' : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
}

const dice = {
  '4'  : d4,
  '6'  : d6,
  '8'  : d8,
  '10' : d10,
  '00' : d00,
  '12' : d12,
  '20' : d20,
}

function Roll({ d, onEnd }) {
  if (!d) {
    console.error('Roll component missing d prop.')
    return null
  }

  if (!onEnd) {
    console.error('Roll component missing onEnd prop.')
    return null
  }
  
  const [ roll, setRoll ] = useState('')

  const bad = !gmChoices[d]
    .reduce((ok, n) => ok || n === roll, false)

  const [ lo ] = gmChoices[d]
  const [ hi ] = gmChoices[d].slice(-1)

  const onSubmit = e => {
    e.preventDefault()
    if (bad) return
    onEnd(roll)
    setRoll('')
  }

  return (
    <div className={styles.roll}>
      <img src={dice[d]} className={styles.die} alt="logo" />

      {
        isGM? (
          <form {...{onSubmit}}>
            <TextField
              className={styles.gmInput}

              type="tel"
              variant="outlined"
              error={bad}
              
              label={`${lo}-${hi}`}
              value={roll}

              onChange={e => {
                const dN = e.target.value
                
                const ok = gmChoices[d]
                  .reduce((ok, n) => ok || n.indexOf(dN) === 0, false)
                
                if (dN && !ok) return
                setRoll(dN)
              }}

              onBlur={onSubmit}
            />
          </form>
        ) : null
      }
      
    </div>
  )
}

export default Roll
