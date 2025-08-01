import React from 'react';

const Task = ({ name, price, time, count }) => {
  return (
    <div className='w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-start relative group'>
      {/* Count Badge */}
      <div className='w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex justify-center items-center text-gray-500 font-bold mr-3 mt-0.5'>
        {count}
      </div>
      
      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='flex justify-between items-start w-full'>
          <span className='text-gray-800 font-medium text-base line-clamp-1 pr-2'>{name}</span>
          <span className='text-red-500 font-semibold whitespace-nowrap'>-{price} ج.م</span>
        </div>
        
        {/* Time and optional additional info */}
        <div className='flex justify-between items-center mt-1'>
          <span className='text-xs text-gray-400 flex items-center'>
            <svg className='w-3 h-3 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        </div>
      </div>
      
      {/* Hover effect indicator */}
      <div className='absolute inset-y-0 left-0 w-1 bg-transparent  transition-colors duration-300'></div>
    </div>
  )
}

export default Task;