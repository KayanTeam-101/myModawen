import React, { useState, useRef, useEffect } from 'react';
import { RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';
import { FaDeleteLeft } from "react-icons/fa6";

const Task = ({ 
  name, 
  price, 
  time, 
  count, 
  dateKey, 
  id, 
  onPriceChange,
  onDelete // New prop for deletion
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(price);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const inputRef = useRef(null);
  const pressTimer = useRef(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Long press handlers
  const startPressTimer = () => {
    pressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      setShowDeleteModal(true);
    window.navigator.vibrate(200)

    }, 500);
  };

  const cancelPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  const handleLongPress = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    onDelete(dateKey, id);
    setShowDeleteModal(false);
  };

  // Edit handlers
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(price);
  };

  const handleSave = () => {
    if (!editValue.trim()) return cancelEdit();
    
    // Validate input (numbers only)
    const validValue = editValue.replace(/[^0-9]/g, '');
    if (!validValue) return cancelEdit();

    // Update if value changed
    if (validValue !== price) {
      onPriceChange(dateKey, id, validValue);
    }
    
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') cancelEdit();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue(price);
  };

  return (
    <div 
      className='w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-start relative group'
      onMouseDown={startPressTimer}
      onMouseUp={cancelPressTimer}
      onMouseLeave={cancelPressTimer}
      onTouchStart={startPressTimer}
      onTouchEnd={cancelPressTimer}
    >
      {/* Long press indicator */}
      {isLongPressing && (
        <div className="absolute inset-0 bg-indigo-100 opacity-70 rounded-lg z-10 flex items-center justify-center">
          <div className="animate-pulse text-indigo-600 font-medium">
            تحرير العنصر...
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg z-20 flex flex-col items-center justify-center p-4 shadow-lg select-none border border-red-200">
          <div className="text-center mb-3">
            <div className=" w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
            </div>
            <h3 className="font-medium text-gray-800">هل أنت متأكد من الحذف؟</h3>
            <p className="text-sm text-gray-600 mt-1">لا يمكن استرجاع العنصر بعد الحذف</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg flex items-center gap-1"
            >
              <RiCloseLine />
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center gap-1 shadow-md"
            >
              <FaDeleteLeft />
              حذف
            </button>
          </div>
        </div>
      )}

      <div className='w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex justify-center items-center text-gray-500 font-bold mr-3 mt-0.5'>
        {count}
      </div>
      
      <div className='flex-1 flex flex-col select-none'>
        <div className='flex justify-between items-start w-full'>
          <span className='text-gray-800 font-medium text-base line-clamp-1 pr-2 '>
            {name}
          </span>
          
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="bg-gray-100 font-semibold w-20 p-0.5 caret-red-500 rounded-lg outline-none text-right"
              type="text"
              inputMode="numeric"
            />
          ) : (
            <span 
              className='text-red-500 font-semibold whitespace-nowrap cursor-pointer'
              onDoubleClick={handleDoubleClick}
            >
              -{price} ج.م
            </span>
          )}
        </div>
        
        <div className='flex justify-between items-center mt-1'>
          <span className='text-xs text-gray-400 flex items-center'>
            <svg className='w-3 h-3 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        </div>
      </div>
      
      <div className='absolute inset-y-0 left-0 w-1 bg-transparent transition-colors duration-300'></div>
    </div>
  );
};

export default Task;