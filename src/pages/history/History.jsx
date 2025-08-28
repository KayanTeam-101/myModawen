import React from 'react'
import List from './components/list'
const History = () => {
    if (!localStorage.getItem('data')) {
      window.location.href='/'
    }
  return (
   
      <List />
  )
}

export default History
