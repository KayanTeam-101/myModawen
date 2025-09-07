
import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiCameraLine, RiCameraOffLine, RiCheckLine, RiRefreshLine } from 'react-icons/ri';
import { Utilities } from '../../utilities/utilities';

const CameraPage = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const THEME = localStorage.getItem('theme'); // "dark" or "light"
  const utilities = new Utilities();

  useEffect(() => {
    setShowModal(true);
    initializeCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (showModal) {
      stopCamera();
      setTimeout(initializeCamera, 300);
    }
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setIsCameraActive(true);
            setIsLoading(false);
          }).catch(() => {
            setCameraError('Failed to start camera');
            setIsLoading(false);
          });
        };
      }
    } catch (error) {
      setCameraError(`Camera error: ${error.message}`);
      setIsLoading(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg', 1));
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    initializeCamera();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    utilities.sound();
    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return;
    }
    if (!capturedImage) {
      alert('الرجاء التقاط صورة أولاً');
      return;
    }
    utilities.storeItem(itemName, itemPrice, capturedImage);
    window.location.href = '/';
    closeModal();
  };

  const closeModal = () => {
    stopCamera();
    setShowModal(false);
    setTimeout(() => {
      onClose?.();
      window.location.href = '/';
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 ${THEME === "dark" ? 'bg-gray-900/70' : 'bg-indigo-100/70'} 
        backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 
        ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`rounded-2xl ${THEME === "dark" ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
          shadow-xl w-full max-w-md overflow-hidden border transition-all duration-300 transform 
          ${showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b 
          ${THEME === "dark" ? 'border-gray-700 text-gray-100' : 'border-gray-200 text-gray-800'}`}>
          <h2 className="text-xl font-bold">إضافة عنصر بالكاميرا</h2>
          <button 
            onClick={closeModal}
            className={`p-2 rounded-full ${THEME === "dark" ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-500'} transition-colors`}
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <div className="p-5">
          {/* Camera Preview */}
          <div className="mb-6 relative">
            {cameraError ? (
              <div className={`${THEME === "dark" ? 'bg-red-900 text-red-300 border-red-800' : 'bg-red-100 text-red-700 border-red-200'} 
                border p-4 rounded-lg text-center`}>
                <RiCameraOffLine className="text-2xl mx-auto mb-2" />
                <p>{cameraError}</p>
                <button 
                  onClick={initializeCamera}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto"
                >
                  <RiRefreshLine className="ml-1" />
                  حاول مرة أخرى
                </button>
              </div>
            ) : !capturedImage ? (
              <div className="relative">
                <div 
                  className={`${THEME === "dark" ? 'bg-gray-900' : 'bg-gray-100'} 
                    rounded-xl overflow-hidden flex items-center justify-center h-64 
                    ${isCameraActive ? '' : 'border-2 border-dashed border-gray-400'}`}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: isCameraActive ? 'block' : 'none' }}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-6">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                        <p>جارٍ تشغيل الكاميرا...</p>
                      </div>
                    </div>
                  )}
                </div>
                {isCameraActive && (
                  <div className="flex justify-center mt-4 space-x-4">
                    <button
                      onClick={toggleCamera}
                      className={`p-3 rounded-full transition-colors 
                        ${THEME === "dark" ? 'bg-gray-700 hover:bg-gray-600 text-indigo-300' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                      title="تبديل الكاميرا"
                    >
                      <RiRefreshLine className="h-6 w-6" />
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="p-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      <RiCameraLine className="text-2xl" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className={`${THEME === "dark" ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl overflow-hidden flex items-center justify-center h-64`}>
                  <img 
                    src={capturedImage} 
                    alt="الصورة الملتقطة" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={retakePhoto}
                    className={`${THEME === "dark" ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-4 py-2 rounded-lg transition-colors`}
                  >
                    إعادة الالتقاط
                  </button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="itemName" className={`block text-sm font-medium mb-2 ${THEME === "dark" ? 'text-gray-200' : 'text-gray-700'}`}>
                اسم العنصر (اختياري)
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors 
                  ${THEME === "dark" 
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-indigo-100 focus:border-indigo-500'}`}
                placeholder="أدخل اسم العنصر (اختياري)"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="itemPrice" className={`block text-sm font-medium mb-2 ${THEME === "dark" ? 'text-gray-200' : 'text-gray-700'}`}>
                السعر *
              </label>
              <input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                min="0"
                step="0.01"
                required
                className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors 
                  ${THEME === "dark" 
                    ? 'bg-gray-900 border-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-indigo-100 focus:border-indigo-500'}`}
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              disabled={!itemPrice || parseFloat(itemPrice) <= 0 || !capturedImage}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors 
                ${itemPrice && parseFloat(itemPrice) > 0 && capturedImage
                  ? 'bg-gradient-to-r from-indigo-600 via-sky-400 to-purple-300 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md'
                  : 'bg-indigo-300 text-gray-500 cursor-not-allowed'}`}
            >
              <RiCheckLine size={24} />
              إضافة العنصر
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
