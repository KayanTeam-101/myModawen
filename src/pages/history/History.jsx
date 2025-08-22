import React from 'react'
import List from './components/list'
const History = () => {
    if (!localStorage.getItem('data')) {
      window.location.href='/'
    }
  return (
    <div className=''>
        <div className="mb-8 text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text">
            سجل الصرف  
          </h1>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            رصد وتحليل أنماط صرفك اليومية بسهولة ودقة
          </p>
        </div>
      <List />
    </div>
  )
}

export default History
