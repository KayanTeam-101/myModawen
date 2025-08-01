import React, { useState, useRef ,useEffect} from 'react';
import { IoMdClose, IoMdCamera } from 'react-icons/io';
import { BsThreeDotsVertical, BsCheck,BsPlus } from 'react-icons/bs';
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

   useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', '#555');
    }
  }, []);

  const fileInputRef = useRef(null);

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

    onClose?.();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden rtl">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">إضافة عنصر جديد</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* اسم العنصر */}
          <div className="mb-6">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
              اسم العنصر
            </label>
            <div className="relative flex items-center">
              <input
                id="itemName"
                name="name"
                type="text"
                value={item.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:shadow-blue-300 focus:border-blue-500 outline-none"
                placeholder="أدخل اسم العنصر"
              />
              <div
                className="absolute h-10 w-10 m-1.5 bg-gray-100 top-0 left-0 flex items-center justify-center text-gray-600 rounded-xl active:bg-blue-50 transition-all active:text-blue-950"
                onClick={() => Setisclicked(!isclicked)}
              >
                <BsThreeDotsVertical />
    {isclicked && (
  <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-48 overflow-hidden transition-all duration-300 transform origin-top-left showSmoothy">
    <div className="max-h-60 overflow-y-auto py-1">
      {(() => {
        const data = localStorage.getItem('shortcuts');
        let shortcuts = [];

        try {
          shortcuts = data ? JSON.parse(data) : [];
        } catch (err) {
          console.error('فشل في قراءة الاختصارات من localStorage:', err);
        }

        return shortcuts.length > 0 ? (
          shortcuts.map((e, i) => (
            <div
              key={i}
              className="px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer flex items-center "
              onClick={() => {
                utilities.sound();
                setItem(prev => ({ ...prev, name: e }));
                Setisclicked(false);
              }}
            >
              <span className="truncate">{e}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-2.5 text-gray-400 text-center">
            لا توجد اختصارات
          </div>
        );
      })()}
    </div>
    
    <div className="border-t border-gray-100">
      <div
        className="px-4 py-2.5 flex items-center justify-between text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
        onClick={() => {
          const newShortcut = prompt('أضف اختصار جديد');
          if (!newShortcut?.trim()) return;

          let shortcuts = [];
          try {
            const existing = localStorage.getItem('shortcuts');
            shortcuts = existing ? JSON.parse(existing) : [];
          } catch (err) {
            console.error('خطأ في قراءة الاختصارات من localStorage:', err);
          }

          if (!shortcuts.includes(newShortcut.trim())) {
            shortcuts.push(newShortcut.trim());
            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
            console.log('تمت إضافة الاختصار:', newShortcut);
          }
        }}
      >
        <span>إضافة جديد</span>
        <BsPlus size={20} className="text-blue-500" />
      </div>
    </div>
  </div>
)}
              </div>
            </div>
          </div>

          {/* السعر */}
          <div className="mb-6">
            <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none pr-12"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-500">
                ج.م
              </span>
            </div>
          </div>

          {/* صورة العنصر */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة العنصر (اختياري)
            </label>
            <div
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            >
              {item.photoPreview ? (
                <div className="relative">
                  <img
                    src={item.photoPreview}
                    alt="معاينة الصورة"
                    className="mx-auto max-h-40 object-contain rounded-lg"
                  />
                  <div className="mt-2 text-blue-600 font-medium">
                    <IoMdCamera className="inline-block mr-1" />
                    تغيير الصورة
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-100 rounded-full p-3 mb-3 inline-block">
                    <IoMdCamera className="text-gray-500 text-2xl" />
                  </div>
                  <p className="text-gray-500">اضغط لاختيار صورة</p>
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

          {/* زر الإضافة */}
          <button
            type="submit"
            disabled={!item.name.trim() || !item.price || parseFloat(item.price) <= 0}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all
              ${item.name.trim() && item.price && parseFloat(item.price) > 0
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            <div className="flex items-center justify-center">
              <BsCheck size={24} className="ml-2" />
              إضافة العنصر
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
