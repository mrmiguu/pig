import React, { useState } from 'react'
import Roll from './Roll'
import styles from './App.module.scss'

function App() {
  const [ isGM, setIsGM ] = useState(true)
  const dice = ['4', '6', '8', '10', '12', '20', '90']
  // const dice = ['6']

  return (
    <div className={styles.app}>
    
      <Roll
        dice={dice}
        isGM={isGM}
        onEnd={r => {
          console.log(`dice=${dice} roll=${r}`)
          setIsGM(!isGM)
        }}
      />

    </div>
  )
}

export default App
