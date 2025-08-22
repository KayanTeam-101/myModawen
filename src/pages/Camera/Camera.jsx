import React, { useState, useRef, useEffect } from 'react';
import { RiCloseLine, RiCameraLine, RiCameraOffLine, RiCheckLine, RiRefreshLine } from 'react-icons/ri';
import { Utilities } from '../../utilities/utilities';
const CameraPage = ({ onClose, onAddItem }) => {
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
  const utilities = new Utilities();
  useEffect(() => {
    setShowModal(true);
    initializeCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Restart camera when facing mode changes
    if (showModal) {
      stopCamera();
      setTimeout(initializeCamera, 300);
    }
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      const constraints = {
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            setIsCameraActive(true);
            setIsLoading(false);
          }).catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Failed to start camera');
            setIsLoading(false);
          });
        };
        
        videoRef.current.onerror = () => {
          setCameraError('Failed to load camera');
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(`Camera error: ${error.message}`);
      setIsLoading(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 for storage
      const imageData = canvas.toDataURL('image/jpeg', 1);
      setCapturedImage(imageData);
      
      // Stop camera after capture
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    initializeCamera();
  };

  const handleSubmit = (e) => {
    utilities.sound();
    e.preventDefault();
    
    if (!itemPrice || parseFloat(itemPrice) <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return;
    }

    if (!capturedImage) {
      alert('الرجاء التقاط صورة أولاً');
      return;
    }

    // Pass the captured item data to the parent component
utilities.storeItem(itemName,itemPrice,capturedImage);
window.location.href ='/'
    closeModal();
  };

  const closeModal = () => {
    stopCamera();
    setShowModal(false);
    setTimeout(() => {
      onClose?.();
window.location.href ='/'

    }, 300);
  };

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
          <h2 className="text-xl font-bold text-gray-800">إضافة عنصر بالكاميرا</h2>
          <button 
            onClick={closeModal}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine className="text-gray-500 text-xl" />
          </button>
        </div>

        <div className="p-5">
          {/* Camera Preview */}
          <div className="mb-6 relative">
            {cameraError ? (
              <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg text-center">
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
                  className={`bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center h-64 ${
                    isCameraActive ? '' : 'border-2 border-dashed border-gray-400'
                  }`}
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
                  
                  {!isLoading && !isCameraActive && (
                    <div className="text-center text-white p-6">
                      <RiCameraOffLine className="text-2xl mx-auto mb-2" />
                      <p>تعذر تشغيل الكاميرا</p>
                    </div>
                  )}
                </div>
                
                {/* Camera controls */}
                {isCameraActive && (
                  <div className="flex justify-center mt-4 space-x-4">
                    <button
                      onClick={toggleCamera}
                      className="p-3 bg-indigo-100 rounded-full text-indigo-700 hover:bg-indigo-200 transition-colors"
                      title="تبديل الكاميرا"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h4m-4 4h4m-4 4h4m4-8v8m0 0v8m0-8h4m-4 4h4m-4 4h4" />
                      </svg>
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
                <div className="bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center h-64">
                  <img 
                    src={capturedImage} 
                    alt="الصورة الملتقطة" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-center mt-4 space-x-3">
                  <button
                    onClick={retakePhoto}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إعادة الالتقاط
                  </button>
                </div>
              </div>
            )}
            
            {/* Hidden canvas for capturing images */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Item details form */}
          <form onSubmit={handleSubmit}>
            {/* Item Name (Optional) */}
            <div className="mb-4">
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
                اسم العنصر (اختياري)
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                placeholder="أدخل اسم العنصر (اختياري)"
              />
            </div>

            {/* Price */}
            <div className="mb-6">
              <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-2">
                السعر *
              </label>
              <input
                id="itemPrice"
                type="number"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-colors"
                placeholder="0.00"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!itemPrice || parseFloat(itemPrice) <= 0 || !capturedImage}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors ${
                itemPrice && parseFloat(itemPrice) > 0 && capturedImage
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md'
                  : 'bg-indigo-300 text-gray-500 cursor-not-allowed'
              }`}
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