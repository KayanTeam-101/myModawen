import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiCameraLine, RiAddLine, RiCheckLine } from 'react-icons/ri';
import { Utilities } from '../../../utilities/utilities';

const AddItem = ({ onClose }) => {
  const utilities = new Utilities();
  const [isclicked, Setisclicked] = useState(false);
  const [item, setItem] = useState({
    name: '',
    price: '',
    photo: null,
    photoPreview: null
  });

  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setShowModal(true);
    return () => {};
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setItem(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
    console.log(item);
    
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

    utilities.storeItem(item.name, item.price);
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
      Setisclicked(true); // Keep dropdown open after adding
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div 
      className={`fixed inset-0 bg-gray-400/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
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
                name="name"
                type="text"
                value={item.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-colors"
                placeholder="أدخل اسم العنصر"
              />
              
              <button
                type="button"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-gray-100 flex items-center justify-center text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                onClick={() => Setisclicked(!isclicked)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              
              {isclicked && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden transition-all duration-300">
                  <div className="max-h-60 overflow-y-auto">
                    {shortcuts.length > 0 ? (
                      shortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => {
                            utilities.sound();
                            setItem(prev => ({ ...prev, name: shortcut }));
                            Setisclicked(false);
                          }}
                        >
                          {shortcut}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-400 text-center">
                        لا توجد اختصارات
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="px-4 py-3 flex items-center justify-between text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors border-t border-gray-100"
                    onClick={addNewShortcut}
                  >
                    <span>إضافة جديد</span>
                    <RiAddLine className="text-blue-500 text-xl" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-2">
              السعر
            </label>
            <div className="relative">
              <input
                id="itemPrice"
                name="price"
                type="number"
                value={item.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-colors pr-12"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">
                ج.م
              </span>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة العنصر (اختياري)
            </label>
            <div
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
            >
              {item.photoPreview ? (
                <div className="relative">
                  <img
                    src={item.photoPreview}
                    alt="معاينة الصورة"
                    className="mx-auto max-h-40 object-contain rounded-lg"
                  />
                  <div className="mt-4 text-blue-600 font-medium flex items-center justify-center">
                    <RiCameraLine className="mr-1" />
                    تغيير الصورة
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-200 rounded-full p-3 mb-3 inline-block">
                    <RiCameraLine className="text-gray-500 text-2xl" />
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
            type="submit"
            disabled={!item.name.trim() || !item.price || parseFloat(item.price) <= 0}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              item.name.trim() && item.price && parseFloat(item.price) > 0
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <RiCheckLine size={24} />
            إضافة العنصر
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;