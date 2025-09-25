import React, { useState, useRef, useEffect } from 'react';
import { 
  RiCloseLine, 
  RiAddLine, 
  RiCheckLine, 
  RiSubtractLine, 
  RiMicLine, 
  RiMicOffLine,
  RiPlayCircleLine,
  RiStopCircleLine
} from 'react-icons/ri';
import { Utilities } from '../../../utilities/utilities';
import { FaCheckCircle } from 'react-icons/fa';

const AddItem = ({ onClose }) => {
  const utilities = new Utilities();
  const [isclicked, Setisclicked] = useState(false);
  const [item, setItem] = useState({
    name: '',
    price: '',
    audio: null,        // Will store the base64 string
    audioBlob: null     // For playback
  });
  const [hoveredShortcut, setHoveredShortcut] = useState(null);
  const [Storeshortcuts, setStoreShortcuts] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem('shortcuts') : null;
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error parsing localStorage item "shortcuts":', error);
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioElementRef = useRef(null);
  
  const priceInput = useRef(null);
  const itemNameInput = useRef(null);
  const longPressTimer = useRef(null);

  // theme
  const THEME = typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'light') : 'light';
  const isDark = THEME === 'dark';

  useEffect(() => {
    setShowModal(true);
    
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
    
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
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
    const currentValue = parseFloat(item.price) || 0;
    const newValue = Math.max(0, currentValue + amount);
    setItem(prev => ({
      ...prev,
      price: newValue.toString() // Keep as string without formatting
    }));
  };
  
  // Start audio recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio visualization
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          setItem(prev => ({
            ...prev,
            audio: base64String,
            audioBlob: audioBlob
          }));
        };
        reader.readAsDataURL(audioBlob);
        
        // Disconnect and stop tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start recording timer
      let seconds = 0;
      setRecordingTime(0);
      const timer = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
      setRecordingTimer(timer);
      
      // Start visualization
      drawAudioVisualization();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('تعذر الوصول إلى الميكروفون. يرجى التحقق من الإذن.');
    }
  };
  
  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimer);
      setRecordingTimer(null);
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (item.audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(item.audioBlob);
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Stop playing audio
  const stopAudio = () => {
    if (audioElementRef.current && isPlaying) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  // Draw audio frequency visualization
  const drawAudioVisualization = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      ctx.fillStyle = isDark ? '#1f2937' : '#f9fafb';
      ctx.fillRect(0, 0, width, height);
      
      const barWidth = (width / dataArrayRef.current.length) * 2.5;
      let x = 0;
      
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * height;
        
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#6006f1');
        gradient.addColorStop(1, '#8c3cf6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    utilities.sound();

    e.preventDefault();

 

    if (!item.price || parseFloat(item.price) <= 0) {
      alert('الرجاء إدخال سعر صحيح');
      return;
    }

    // Save the base64 audio string (item.audio) instead of image
    utilities.storeItem(item.name, item.price, null ,item.audio);
    utilities.sound();

    closeModal();
  };

  const closeModal = () => {
    utilities.sound();

    setShowModal(false);
    setTimeout(() => {
      onClose?.();
      window.location.reload();
    }, 300);
  };

  // Shortcuts management
  const getShortcuts = () => {
    try {
      const data = typeof window !== 'undefined' ? localStorage.getItem('shortcuts') : null;
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
      setStoreShortcuts(updatedShortcuts)
      if (typeof window !== 'undefined') localStorage.setItem('shortcuts', JSON.stringify(updatedShortcuts));
      Setisclicked(true);
    }
  };

  const shortcuts = getShortcuts();

  // themed classes
  const overlayBg = isDark ? 'bg-gray-900/70' : 'bg-indigo-100/70';
  const cardBg = isDark ? 'bg-gray-950 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900';
  const inputBg = isDark ? 'bg-gray-900 border-gray-600 placeholder-gray-400' : 'bg-gray-50 border-gray-200 placeholder-gray-400';
  const subtleBg = isDark ? 'bg-gray-800/30' : 'bg-indigo-50';
  const shortcutHoverBg = isDark ? 'bg-indigo-900/5' : 'bg-indigo-50';
  const accent = 'text-indigo-600';
  const buttonGradient = 'bg-gradient-to-r from-indigo-600 via-sky-400 to-purple-300';
  const isValid =
(Boolean(item.name?.trim()) &&          // has non-empty name
  item.price !== undefined &&            // price present (change if 0 should be allowed/disallowed)
  item.price !== null &&
  item.price !== '' &&
  !isRecording)  ||                      // not recording
  Boolean(item.audio);                   // has audio

  return (
    <div 
      onDoubleClick={e => Setisclicked(false)}
      className={`fixed inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`${cardBg} rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-all duration-300 transform ${
        showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-5 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          <h2 className="text-xl font-bold">إضافة عنصر جديد</h2>
          <button 
            onClick={closeModal}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-gray-700/40' : 'bg-gray-50'}`}
          >
            <RiCloseLine className={`${isDark ? 'text-gray-200' : 'text-gray-500'} text-xl`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Item Name */}
          <div className="mb-6 relative">
            <label htmlFor="itemName" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                className={`w-full px-4 py-3 text-lg rounded-xl focus:ring-2 focus:border-indigo-500 outline-none transition-colors ${inputBg}`}
                placeholder="أدخل اسم العنصر"
                onMouseDown={startLongPress}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={endLongPress}
              />
              
              <button
                type="button"
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-10 w-10 focus bg-gray-100 flex items-center justify-center rounded-xl hover:bg-gray-200 transition-colors ${isDark ? 'bg-gray-700/40 hover:bg-gray-600/40' : ''}`}
                onClick={() => {utilities.sound();Setisclicked(!isclicked)}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              
              {isclicked && (
                <div 
                  className={`absolute top-full left-0 mt-2 w-full ${cardBg.replace('text-gray-100','')} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-xl shadow-lg z-30 overflow-hidden transition-all duration-300 showSmoothy`}
                >
                  <div className="max-h-60 overflow-y-auto">
                    {Storeshortcuts.length > 0 ? (
                      Storeshortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          className={`px-4 py-3 transition-all duration-200 cursor-pointer flex items-center ${
                            hoveredShortcut === shortcut 
                              ? `${shortcutHoverBg} border-l-4 border-indigo-500 pl-3` 
                              : `${isDark ? 'text-gray-200' : 'text-gray-700'}`
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
                    className={`px-4 py-3 flex items-center justify-between ${accent} hover:${isDark ? 'bg-indigo-900/20' : 'bg-indigo-50'} cursor-pointer transition-colors border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
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
            <label htmlFor="itemPrice" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              السعر
            </label>
            <div className="relative">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => adjustPrice(-1)}
                  className={`${isDark ? 'bg-gray-900 border-gray-600/15' : 'bg-gray-100'} flex items-center justify-center w-12 rounded-r-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'} hover:brightness-105 transition-colors`}
                >
                  <RiSubtractLine className={`${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
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
                    className={`w-full px-4 py-3 text-lg rounded-none focus:ring-2 focus:border-indigo-500 outline-none transition-colors ${inputBg}`}
                    placeholder="0"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => adjustPrice(1)}
                  className={`${isDark ? 'bg-gray-900 border-gray-600/15' : 'bg-gray-100'} flex items-center justify-center w-12 rounded-l-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'} hover:brightness-105 transition-colors`}
                >
                  <RiAddLine className={`${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Audio Recording */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              تسجيل صوتي (بديل سريع للكتابة )
            </label>
            
            <div className={`border-2 ${isRecording ? 'border-indigo-400' : ''} rounded-xl p-4 transition-colors ${isDark ? 'border-gray-600 bg-gray-800/30' : 'border-indigo-300 bg-indigo-50'}`}>
              {/* Audio visualization canvas */}
              <div className="mb-4 relative">
                <canvas 
                  ref={canvasRef} 
                  width="300" 
                  height="80"
                  className={`w-full h-20 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
                />
                
                {isRecording && (
                  <div className="absolute top-2 right-2 flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                    <span className="text-sm font-medium text-red-500">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Recording controls */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className={`flex items-center justify-center p-3 rounded-full ${isDark ? 'bg-rose-600 hover:bg-rose-700' : 'bg-rose-500 hover:bg-rose-600'} text-white transition-colors`}
                  >
                    <RiMicLine className="" size={22} />
                   
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className={`flex items-center justify-center px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                  >
                    <RiMicOffLine className="mr-2" />
                    إيقاف التسجيل
                  </button>
                )}
                
                {item.audioBlob && !isRecording && (
                  <>
                    {!isPlaying ? (
                      <button
                        type="button"
                        onClick={playAudio}
                        className={`flex items-center justify-center px-4 py-2 rounded-xl ${isDark ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-colors`}
                      >
                        <RiPlayCircleLine className="mr-2" />
                        تشغيل
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopAudio}
                        className={`flex items-center justify-center px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                      >
                        <RiStopCircleLine className="mr-2" />
                        إيقاف
                      </button>
                    )}
                  </>
                )}
              </div>
              
              {item.audioBlob && !isRecording && (
                <p className={`text-center mt-3 text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                 تم حفظ التسجيل الصوتي <FaCheckCircle className='text-green-500' size={20} />
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => utilities.sound()}
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors active:opacity-40 ${
              isValid
                ? `${buttonGradient} shadow-md`
                : 'bg-indigo-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isRecording ? (
              <>
                <div className="animate-pulse h-5 w-5 rounded-full bg-white mr-2"></div>
                جاري التسجيل... ({formatTime(recordingTime)})
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