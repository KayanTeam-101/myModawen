import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiCameraLine, RiAddLine, RiCheckLine, RiSubtractLine } from 'react-icons/ri';
import { Utilities } from '../../../utilities/utilities';

const AddItem = ({ onClose }) => {
  const utilities = new Utilities();
  const [isclicked, Setisclicked] = useState(false);
  const [item, setItem] = useState({
    name: '',
    price: 1,
    photo: null,        // Will store the base64 string
    photoPreview: null  // For preview only
  });
  const [hoveredShortcut, setHoveredShortcut] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const priceInput = useRef(null);
  const itemNameInput = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    setShowModal(true);
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Long press handler for item name input
  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      Setisclicked(true);
    }, 250);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  // Handle price increment/decrement without formatting
  const adjustPrice = (amount) => {
    utilities.sound();
    const currentValue = parseFloat(item.price) || 0;
    const newValue = Math.max(0, currentValue + amount);
    setItem(prev => ({
      ...prev,
      price: newValue.toString() // Keep as string without formatting
    }));
  };
  
  // Fixed photo change handler
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (2MB max)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("الرجاء اختيار صورة أقل من ٢ ميجابايت");
        return;
      }

      setIsProcessingPhoto(true);
      
      // Create a FileReader to convert image to base64
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64String = event.target.result;
        
        // Update state with base64 string
        setItem(prev => ({
          ...prev,
          photo: base64String,
          photoPreview: base64String
        }));
        setIsProcessingPhoto(false);
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("حدث خطأ أثناء قراءة الصورة");
        setIsProcessingPhoto(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!item.name.trim()) {
      alert('الرجاء إدخال اسم العنصر');
      return;
    }

    if (!item.price || parseFloat(item.price) <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return;
    }

    // Save the base64 string (item.photo) instead of photoPreview
    utilities.storeItem(item.name, item.price, item.photo);
    utilities.sound();

    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose?.();
      window.location.reload();
    }, 300);
  };

  // Shortcuts management
  const getShortcuts = () => {
    try {
      const data = localStorage.getItem('shortcuts');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('فشل في قراءة الاختصارات من localStorage:', err);
      return [];
    }
  };

  const addNewShortcut = () => {
    const newShortcut = prompt('أضف اختصار جديد');
    if (!newShortcut?.trim()) return;
    
    const shortcuts = getShortcuts();
    if (!shortcuts.includes(newShortcut.trim())) {
      const updatedShortcuts = [...shortcuts, newShortcut.trim()];
      localStorage.setItem('shortcuts', JSON.stringify(updatedShortcuts));
      Setisclicked(true);
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div 
      className={`fixed inset-0 bg-indigo-100/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 transition-all duration-300 transform ${
        showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">إضافة عنصر جديد</h2>
          <button 
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine className="text-gray-500 text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Item Name */}
          <div className="mb-6 relative">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
              اسم العنصر
            </label>
            
            <div className="relative">
              <input
                id="itemName"
                ref={itemNameInput}
                name="name"
                type="text"
                value={item.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                placeholder="أدخل اسم العنصر"
                onMouseDown={startLongPress}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={endLongPress}
              />
              
              <button
                type="button"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-10 w-10 focus bg-gray-100 flex items-center justify-center text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => Setisclicked(!isclicked)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              
              {isclicked && (
                <div 
                  className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden transition-all duration-300 showSmoothy"
                >
                  <div className="max-h-60 overflow-y-auto">
                    {shortcuts.length > 0 ? (
                      shortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          className={`px-4 py-3 transition-all duration-200 cursor-pointer flex items-center ${
                            hoveredShortcut === shortcut 
                              ? 'bg-indigo-50 border-l-4 border-indigo-500 pl-3' 
                              : 'text-gray-700'
                          }`}
                          onMouseEnter={() => {
                            setHoveredShortcut(shortcut);
                            setItem(prev => ({ ...prev, name: shortcut }));
                          }}
                          onMouseLeave={() => setHoveredShortcut(null)}
                          onClick={() => {
                            utilities.sound();
                            setItem(prev => ({ ...prev, name: shortcut }));
                            Setisclicked(false);
                            setTimeout(() => {
                              if (priceInput.current) {
                                priceInput.current.focus();
                              }
                            }, 50);
                          }}
                        >
                          <span className="flex-1">{shortcut}</span>
                          {hoveredShortcut === shortcut && (
                            <div className="ml-2 flex items-center text-indigo-500 animate-pulse">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400 text-center">
                        لا توجد اختصارات
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="px-4 py-3 flex items-center justify-between text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors border-t border-gray-100"
                    onClick={addNewShortcut}
                  >
                    <span>إضافة جديد</span>
                    <RiAddLine className="text-indigo-500 text-xl" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price with adjustment buttons */}
          <div className="mb-6">
            <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-2">
              السعر
            </label>
            <div className="relative">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => adjustPrice(-1)}
                  className="flex items-center justify-center w-12 bg-gray-100 rounded-r-lg border border-gray-200 border-l-0 hover:bg-gray-200 transition-colors"
                >
                  <RiSubtractLine className="text-gray-600" />
                </button>
                
                <div className="relative flex-1">
                  <input
                    id="itemPrice"
                    name="price"
                    type="number"
                    ref={priceInput}
                    value={item.price}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => adjustPrice(1)}
                  className="flex items-center justify-center w-12 bg-gray-100 rounded-l-lg border border-gray-200 border-r-0 hover:bg-gray-200 transition-colors"
                >
                  <RiAddLine className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة العنصر (اختياري)
            </label>
            <div
              onClick={triggerFileInput}
              className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-indigo-50"
            >
              {isProcessingPhoto ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                  <p className="text-gray-600 mt-3">جارٍ تحميل الصورة...</p>
                </div>
              ) : item.photoPreview ? (
                <div className="relative">
                  <img
                    src={item.photoPreview}
                    alt="معاينة الصورة"
                    className="mx-auto max-h-40 object-contain rounded-lg"
                  />
                  <div className="mt-4 text-indigo-600 font-medium flex items-center justify-center">
                    <RiCameraLine className="mr-1" />
                    تغيير الصورة
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-indigo-100 rounded-full p-3 mb-3 inline-block">
                    <RiCameraLine className="text-indigo-400 text-2xl" />
                  </div>
                  <p className="text-gray-600">اضغط لاختيار صورة</p>
                  <p className="text-gray-400 text-sm mt-1">أو اسحب الصورة هنا</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={utilities.sound}
            type="submit"
            disabled={!item.name.trim() || !item.price || parseFloat(item.price) <= 0 || isProcessingPhoto}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors ${
              !isProcessingPhoto && item.name.trim() && item.price && parseFloat(item.price) > 0
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-500 hover:from-indigo-600 hover:to-indigo-600 shadow-md'
                : 'bg-indigo-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isProcessingPhoto ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جارٍ معالجة الصورة
              </>
            ) : (
              <>
                <RiCheckLine size={24} />
                إضافة العنصر
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;