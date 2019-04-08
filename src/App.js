import React from 'react'
import Roll from './Roll'
import styles from './App.module.scss'

function App() {
  const dice = ['4', '6', '8']

  return (
    <div className={styles.app}>
      <Roll
        dice={dice}
        onEnd={r => {
          console.log(`dice=${dice} roll=${r}`)
        }}
      />
    </div>
  )
}

export default App
