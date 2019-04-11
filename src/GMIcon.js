import React from 'react'
import styles from './GMIcon.module.scss'

function GMIcon() {
  return (
    <div className={styles.gmIcon}>
      <span className={styles.gm}>
        <span className={styles.g}>G</span>
        <span className={styles.m}>M</span>
      </span>
    </div>
  )
}

export default GMIcon
