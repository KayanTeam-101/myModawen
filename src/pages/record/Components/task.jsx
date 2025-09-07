import React, { useState, useRef, useEffect } from 'react';
import { RiDeleteBinLine, RiCloseLine, RiZoomInLine, RiDownloadLine } from 'react-icons/ri';
import { FaDeleteLeft, FaImage } from "react-icons/fa6";
import { BsImage, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
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
  const [imageLoaded, setImageLoaded] = useState(false);
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
    setImageLoaded(false);
  };

  // Download image
  const downloadImage = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'image'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // themed classes
  const container = `w-full h-fit p-3 transition-colors duration-200 flex items-start relative group ${isDark ? 'bg-black border-gray-700' : 'bg-white border-gray-100'}`;
  const countBadge = `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} w-8 h-8 select-none rounded-full flex-shrink-0 flex justify-center items-center font-bold mr-3 mt-0.5`;
  const nameText = `${isDark ? 'text-gray-100' : 'text-gray-800'} font-medium text-base line-clamp-1 pr-2`;
  const timeText = `${isDark ? 'text-gray-300' : 'text-gray-400'} text-xs flex items-center`;
  const priceText = `${isDark ? 'text-red-400' : 'text-red-500'} font-semibold whitespace-nowrap cursor-pointer`;
  const photoIcon = `${isDark ? 'text-indigo-50' : 'text-indigo-600'} text-lg`;
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

      {/* Image Preview Modal - Completely Restyled */}
      {showImageModal && (
        <div 
          className={`showSmoothy fixed h-screen w-screen inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${isDark ? 'bg-gray-900/70' : 'bg-indigo-100/70'}`}
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header with title and close button */}
            <div className="flex justify-between items-center  p-4 bg-gray-800 rounded-t-xl">
              <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(false);
                }}
              >
                <RiCloseLine className="text-white text-xl" />
              </button>
            </div>
            
            {/* Image container */}
            <div className="relative bg-black rounded-lg overflow-hidden flex-1 flex items-center justify-center">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <BsImage className="text-gray-600 text-4xl mb-2" />
                    <span className="text-gray-500">جاري تحميل الصورة...</span>
                  </div>
                </div>
              )}
              
              <img 
                src={photo} 
                alt={name}
                className={`max-w-full max-h-[70vh] object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Footer with price and actions */}
            <div className=" p-4 bg-white dark:bg-gray-800 rounded-b-xl flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-red-500 dark:text-red-400">-{price} ج.م</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{time}</div>
              </div>
              
              <div className="flex gap-2">
                <button
                  className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                  onClick={downloadImage}
                  title="تحميل الصورة"
                >
                  <RiDownloadLine className="text-lg" />
                </button>
                
               
              </div>
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
          className={`h-full p-2 mr-2 flex justify-center items-center cursor-pointer ${isDark ? 'text-indigo-50' : 'text-indigo-600'} group`}
          onClick={openImageModal}
        >
          <div className="relative">
            <FaImage size={24} className={`${photoIcon} group-hover:scale-110 transition-transform`}/>
           
          </div>
        </div>
      )} 
    </div>
  );
};

export default Task;