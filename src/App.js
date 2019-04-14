import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import Roll from './Roll'
import styles from './App.module.scss'
 
var config = {
  apiKey: "AIzaSyCKE8XTWiaGoLE876gg_fTMMj0yDLV7L2Q",
  authDomain: "test-3bb26.firebaseapp.com",
  databaseURL: "https://test-3bb26.firebaseio.com",
  projectId: "test-3bb26",
  storageBucket: "test-3bb26.appspot.com",
  messagingSenderId: "198127730795"
}
firebase.initializeApp(config)

function Login({ render: View }) {
  const { initialising, user } = useAuthState(firebase.auth())

  const login = () => {
    firebase.auth().signInAnonymously()
  }

  // const logout = () => {
  //   firebase.auth().signOut()
  // }
 
  return <>
    {!initialising && !user && <button onClick={login}>Login</button>}
    {initialising && <pre>Initializing user...</pre>}
    {user && <View uid={user.uid} />}
  </>
}

function Us({ uid }) {
  console.log(`Us!\n\tuid:${uid}`)

  // hooks
  const { error, loading, value: us } = useDocument(
    firebase.firestore().doc(`matches/${uid}`)
  )

  if (error) {
    return <pre>Error: {error}</pre>
  }
  if (loading) {
    return <pre>Loading match... (1/2)</pre>
  }
  if (!us) {
    return <pre>No document found for self</pre>
  }

  return <Them uid={uid} us={us} />
}

function Them({ uid, us }) {
  const our = us.data()
  
  console.log(`Them!\n\tour:${JSON.stringify(our)}`)

  // hooks
  const { error, loading, value: them } = useDocument(
    firebase.firestore().doc(`matches/${our.opponent}`)
  )
  
  if (error) {
    return <pre>Error: {error}</pre>
  }
  if (loading) {
    return <pre>Loading match... (2/2)</pre>
  }
  if (!them) {
    return <pre>No document found for opponent</pre>
  }
  
  const their = them.data()
  
  if (their.opponent !== uid) {
    return <pre>We're not their opponent (desync)</pre>
  }
  
  return <Match us={us} them={them} />
}

function Match({ us, them }) {
  const our = us.data()
  const their = them.data()
  
  console.log(`Match!\n\tour:${JSON.stringify(our)}\n\ttheir:${JSON.stringify(their)}`)

  const dice = ['6']

  const theirRolls = their.rolls || {}
  const ourRolls = our.rolls || {}
  const theirLast = theirRolls[Object.keys(theirRolls).slice(-1)] || []
  const ourLast = ourRolls[Object.keys(ourRolls).slice(-1)] || []
  const theirLatest = (Object.keys(theirRolls).sort().slice(-1)||[])[0] || ''
  const ourLatest = (Object.keys(ourRolls).sort().slice(-1)||[])[0] || ''

  console.log(`theirLatest:\n\t${JSON.stringify(theirLatest)}`)
  console.log(`ourLatest:\n\t${JSON.stringify(ourLatest)}`)
  console.log(`theirLatest > ourLatest (${theirLatest > ourLatest})`)

  const allStarting = !their.rolls && !our.rolls
  const theyreStarting = theirLast[0] === '1' || theirLast[0] === '-'
  
  const isGM = allStarting?
    their.opponent < our.opponent
    : theirLatest > ourLatest?
      theyreStarting?
        false
        : true
          : ourLast[0] === '1' || ourLast[0] === '-'?
            true
            : false
  
  return (
    <div className={styles.app}>

      <Roll
        dice={dice}
        isGM={isGM}
        onEnd={r => {
          console.log(`dice=${dice} roll=${r}`)
          
          them.ref.update({
            rolls: {...theirRolls, [Date.now()]: r}
          })
        }}
      />

      {
        !isGM || (theyreStarting || !their.rolls)?
          null
        : (
          <Button
            className={styles.hold}
            variant="contained"
            onClick={() => {
              them.ref.update({
                rolls: {...theirRolls, [Date.now()]: ['-']}
              })
            }}
          >
            Hold
          </Button>
        )
      }

    </div>
  )
}

function App() {
  return <Login render={Us} />
}

export default App
