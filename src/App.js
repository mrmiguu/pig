import React, { useState } from 'react'
import Roll from './Roll'
import styles from './App.module.scss'

const dice = ['4','6','8','10','00','12','20']

function App() {
  const [ i, setI ] = useState(0)
  const [ d, setD ] = useState(dice[i])

  return (
    <div className={styles.app}>
      <Roll
        d={d}

        onEnd={r => {
          console.log(`d${dice[i]} roll=${r}`)
          setD(dice[(i+1)%dice.length])
          setI(i+1)
        }}
        
      />
    </div>
  )
}

export default App
