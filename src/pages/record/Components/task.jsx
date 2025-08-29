import React, { useState, useRef, useEffect } from 'react';
import { RiDeleteBinLine, RiCloseLine, RiZoomInLine } from 'react-icons/ri';
import { FaDeleteLeft, FaImage } from "react-icons/fa6";
import { BsImage } from 'react-icons/bs';
import '../../../index.css';

const Task = ({ 
  name, 
  price, 
  time, 
  count, 
  dateKey, 
  id, 
  onPriceChange,
  onDelete,
  photo
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(price);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const inputRef = useRef(null);
  const pressTimer = useRef(null);

  // theme
  const THEME = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
  const isDark = THEME === 'dark';

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
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(200);
    }, 500);
  };

  const cancelPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsLongPressing(false);
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

  // Handle image modal
  const openImageModal = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  // themed classes
  const container = `w-full h-fit p-3  transition-colors duration-200 flex items-start relative group ${isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-100'}`;
  const countBadge = `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} w-8 h-8 select-none rounded-full flex-shrink-0 flex justify-center items-center font-bold mr-3 mt-0.5`;
  const nameText = `${isDark ? 'text-gray-100' : 'text-gray-800'} font-medium text-base line-clamp-1 pr-2`;
  const timeText = `${isDark ? 'text-gray-300' : 'text-gray-400'} text-xs flex items-center`;
  const priceText = `${isDark ? 'text-red-400' : 'text-red-500'} font-semibold whitespace-nowrap cursor-pointer`;
  const photoIcon = `${isDark ? 'text-indigo-300' : 'text-indigo-600'} text-lg`;
  const longPressOverlay = `absolute inset-0 ${isDark ? 'bg-indigo-900/20' : 'bg-indigo-100/70'} opacity-95 rounded-lg z-10 flex items-center justify-center`;

  return (
    <div 
      className={container}
      onMouseDown={startPressTimer}
      onMouseUp={cancelPressTimer}
      onMouseLeave={cancelPressTimer}
      onTouchStart={startPressTimer}
      onTouchEnd={cancelPressTimer}
    >
      {/* Long press indicator */}
      {isLongPressing && (
        <div className={longPressOverlay}>
          <div className={`${isDark ? 'text-indigo-200' : 'text-indigo-600'} animate-pulse font-medium`}>
            تحرير العنصر...
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="absolute rounded-none inset-0 z-20 flex flex-col items-center justify-center p-4 select-none showSmoothy backdrop-blur-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className={`${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} px-4 py-2 rounded-lg flex items-center gap-1`}
            >
              <RiCloseLine />
              إلغاء
            </button>
            <button
              onDoubleClick={handleDelete}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center gap-1 shadow-md"
            >
              <FaDeleteLeft />
              حذف
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div 
          className="showSmoothy fixed h-screen w-screen inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(2,6,23,0.9)' }}
          onClick={() => setShowImageModal(false)}
        >
          <div className={`relative max-w-[90%] max-h-[90vh]`}>            
            <img 
              src={photo} 
              alt={name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              className={`absolute top-4 right-4 rounded-full p-2 transition ${isDark ? 'bg-gray-700/60 hover:bg-gray-600/60' : 'bg-indigo-600/80 hover:bg-indigo-500'}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowImageModal(false);
              }}
            >
              <RiCloseLine className={`text-white text-xl`} />
            </button>
            <div className="text-center mt-4">
              <div className={`${isDark ? 'text-indigo-300' : 'text-indigo-600'} font-medium`}>{name}</div>
              <div className={`${isDark ? 'text-gray-300' : 'text-indigo-400'} text-sm`}>-{price} ج.م</div>
            </div>
          </div>
        </div>
      )}

      <div className={countBadge}>
        {count}
      </div>
      
      <div className='flex-1 flex flex-col select-none'>
        <div className='flex justify-between items-start w-full'>
          <span className={nameText}>
            {name}
          </span>
          
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={`bg-transparent font-semibold w-20 p-0.5 caret-red-500 rounded-lg outline-none text-right ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
              type="text"
              inputMode="numeric"
            />
          ) : (
            <span 
              className={priceText}
              onDoubleClick={handleDoubleClick}
            >
              -{price} ج.م
            </span>
          )}
        </div>
        
        <div className='flex justify-between items-center mt-1'>
          <span className={timeText}>
            <svg className='w-3 h-3 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        </div>
      </div>
      
      {photo && (
        <div 
          className={`h-full p-2 mr-2 flex justify-center items-center cursor-pointer ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
          onClick={openImageModal}
        >
          <div className="relative">
            <FaImage size={24} className={photoIcon}/>
          </div>
        </div>
      )} 
    </div>
  );
};

export default Task;
