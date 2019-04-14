import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Link from '@material-ui/core/Link'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import Roll from './Roll'
import { pig } from './help'
import styles from './App.module.scss'

const pigRules = 'https://en.wikipedia.org/wiki/Pig_(dice_game)'
 
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

  const theirRollData = their.rolls || {}
  const ourRollData = our.rolls || {}
  const theirLast = theirRollData[Object.keys(theirRollData).slice(-1)] || []
  const ourLast = ourRollData[Object.keys(ourRollData).slice(-1)] || []
  const theirLatest = (Object.keys(theirRollData).sort().slice(-1)||[])[0] || ''
  const ourLatest = (Object.keys(ourRollData).sort().slice(-1)||[])[0] || ''

  console.log(`theirLatest:\n\t${JSON.stringify(theirLatest)}`)
  console.log(`ourLatest:\n\t${JSON.stringify(ourLatest)}`)
  console.log(`theirLatest > ourLatest (${theirLatest > ourLatest})`)

  const theyreStarting = theirLast[0] === '1' || theirLast[0] === '-'
  
  const isGM = !their.rolls && !our.rolls?
    their.opponent < our.opponent
    : theirLatest > ourLatest?
      theyreStarting?
        false
        : true
          : ourLast[0] === '1' || ourLast[0] === '-'?
            true
            : false
  
  const ourRolls = Object.keys(ourRollData)
    .map(t => ourRollData[t][0])
  const theirRolls = Object.keys(theirRollData)
    .map(t => theirRollData[t][0])
  
  const ourScore = pig(ourRolls)
  const theirScore = pig(theirRolls)

  console.log(`ourScore: ${ourScore}`)
  console.log(`theirScore: ${theirScore}`)
  
  return (
    <div className={styles.app}>

      {
        ourScore >= 100? (
          <Dialog
            open
          >
            <DialogTitle>You Win!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The first to 100 points wins. You scored {ourScore} points, which makes you the winner.
                Feel free to <Link href={pigRules} target="_blank" rel="noopener">learn more</Link> about the dice game Pig.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : theirScore >= 100? (
          <Dialog
            open
          >
            <DialogTitle>You Lose...</DialogTitle>
            <DialogContent>
              <DialogContentText>
                The first to 100 points wins. Your opponent scored {theirScore} points, which makes them the winner.
                Feel free to <Link href={pigRules} target="_blank" rel="noopener">learn more</Link> about the dice game Pig.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : null
      }

      <Roll
        dice={dice}
        isGM={isGM}
        onEnd={r => {
          console.log(`dice=${dice} roll=${r}`)
          
          them.ref.update({
            rolls: {...theirRollData, [Date.now()]: r}
          })
        }}
      />

      <Card className={styles.scoreBoard}>
        <CardContent>

          <Paper className={styles.ourScore} elevation={1}>
            <Typography>{ourScore}</Typography>
          </Paper>

          <Paper className={styles.theirScore} elevation={1}>
            <Typography>{theirScore}</Typography>
          </Paper>

        </CardContent>
      </Card>

      {
        isGM && !theyreStarting && their.rolls? (
          <Button
            className={styles.hold}
            variant="contained"
            onClick={() => {
              them.ref.update({
                rolls: {...theirRollData, [Date.now()]: ['-']}
              })
            }}
          >
            Hold
          </Button>
        ) : null
      }

    </div>
  )
}

function App() {
  return <Login render={Us} />
}

export default App
