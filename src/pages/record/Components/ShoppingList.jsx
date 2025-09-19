import React, { useState, useEffect, useRef } from 'react';
import { RiCloseLine, RiAddLine, RiCheckLine, RiMicLine, RiMicOffLine, RiPlayCircleLine, RiStopCircleLine } from 'react-icons/ri';

const ShoppingList = ({ onClose = () => {} }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [isDark, setIsDark] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('shoppingList')) || [];
    setItems(savedItems);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
    
    // Load shortcuts
    const savedShortcuts = JSON.parse(localStorage.getItem('shortcuts')) || [];
    setShortcuts(savedShortcuts);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  // Save shortcuts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Play sound effect
  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBSt2r9rJjFsoDCRbh7bQrIJdLBwZNl+Qr8O1lHVCJh8qU3WZt8m+kXpNNicwTm+Qt9DIoIJYOS0wS2iKtNDOqYdcPC8tR2KEs9HTrYlgPjEuRFx8stHWsIxhPzMuQFh4sdDXs41iQDUwPVV1sNDZto9jQTcyPFNzsNDbuI9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcuY9jQTcyO1JysNDcu极简主义风格');
    audio.play();
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      playSound();
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
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
      playSound();
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audioElementRef.current.play();
      setIsPlaying(true);
      playSound();
    }
  };
  
  // Stop playing audio
  const stopAudio = () => {
    if (audioElementRef.current && isPlaying) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      setIsPlaying(false);
      playSound();
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add a new item to the list
  const addItem = () => {
    if (newItem.name.trim() && newItem.price) {
      const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;
      
      setItems([...items, { 
        ...newItem, 
        id: Date.now(),
        date: new Date().toLocaleDateString('en-GB'),
        purchased: false,
        audio: audioUrl
      }]);
      
      setNewItem({ name: '', price: '' });
      setAudioBlob(null);
      playSound();
      
      // Add to shortcuts if not already there
      if (!shortcuts.includes(newItem.name.trim())) {
        setShortcuts([...shortcuts, newItem.name.trim()]);
      }
    }
  };

  // Remove an item from the list
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    playSound();
  };

  // Mark an item as purchased
  const togglePurchased = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
    playSound();
  };

  // Add new shortcut
  const addNewShortcut = () => {
    const newShortcut = prompt('أضف اختصار جديد');
    if (!newShortcut?.trim()) return;
    
    if (!shortcuts.includes(newShortcut.trim())) {
      setShortcuts([...shortcuts, newShortcut.trim()]);
    }
  };

  // Calculate total cost
  const totalCost = items.reduce((total, item) => {
    return total + (item.purchased ? 0 : parseFloat(item.price) || 0);
  }, 0);

  // Themed styles
  const containerClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 min-h-screen' 
    : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900 min-h-screen';
  
  const cardClass = isDark 
    ? 'bg-gray-800 border-gray-700 shadow-xl' 
    : 'bg-white border-gray-200 shadow-lg';
  
  const inputClass = isDark 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  
  const buttonClass = isDark 
    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
    : 'bg-indigo-500 hover:bg-indigo-600 text-white';

  return (
    <div className='h-screen w-screen backdrop-blur-sm bg-transparent fixed top-0 left-0 z-50'>

        <div className={containerClass} onDoubleClick={onClose}>
            
      <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          قائمة المشتريات المُخطط لها
          </h1>
     
        </div>

             {/* Add Item Form */}
        <div className={`p-5 rounded-2xl border ${cardClass}`}>
          <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            إضافة عنصر جديد
          </h2>
          
          <div className="space-y-4">
            {/* Item Name with Shortcuts */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                اسم العنصر
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="اسم العنصر"
                  className={`w-full p-3 rounded-xl border ${inputClass} pr-10`}
                />
                
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowShortcuts(!showShortcuts)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
                
                {showShortcuts && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-10 overflow-hidden ${cardClass}`}>
                    <div className="max-h-40 overflow-y-auto">
                      {shortcuts.length > 0 ? (
                        shortcuts.map((shortcut, i) => (
                          <div
                            key={i}
                            className="px-4 py-3 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
                            onClick={() => {
                              setNewItem({...newItem, name: shortcut});
                              setShowShortcuts(false);
                            }}
                          >
                            {shortcut}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          لا توجد اختصارات
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors flex items-center justify-between"
                      onClick={addNewShortcut}
                    >
                      <span>إضافة جديد</span>
                      <RiAddLine className="text-indigo-500" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                السعر (ج.م)
              </label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                placeholder="0.00"
                className={`w-full p-3 rounded-xl border ${inputClass}`}
              />
            </div>

            {/* Audio Recording */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                تسجيل صوتي (اختياري)
              </label>
              
              <div className={`rounded-xl p-4 transition-colors ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                <div className="flex justify-center items-center mb-4">
                  {isRecording && (
                    <div className="flex items-center mr-3">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                      <span className="text-sm font-medium text-red-500">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                  
                  {audioBlob && !isRecording && (
                    <div className="text-sm text-green-500 mr-3">
                      ✓ تم التسجيل
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center space-x-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className={`px-4 py-2 rounded-lg flex items-center ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                    >
                      <RiMicLine className="ml-2" />
                      تسجيل
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className={`px-4 py-2 rounded-lg flex items-center ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                    >
                      <RiMicOffLine className="ml-2" />
                      إيقاف
                    </button>
                  )}
                  
                  {audioBlob && !isRecording && (
                    <>
                      {!isPlaying ? (
                        <button
                          type="button"
                          onClick={playAudio}
                          className={`px-4 py-2 rounded-lg flex items-center ${isDark ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white transition-colors`}
                        >
                          <RiPlayCircleLine className="ml-2" />
                          تشغيل
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopAudio}
                          className={`px-4 py-2 rounded-lg flex items-center ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white transition-colors`}
                        >
                          <RiStopCircleLine className="ml-2" />
                          إيقاف
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={addItem}
              disabled={!newItem.name.trim() || !newItem.price || isRecording}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                !isRecording && newItem.name.trim() && newItem.price
                  ? `${buttonClass} shadow-md`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <RiAddLine size={20} />
              إضافة إلى القائمة
            </button>
          </div>
        </div>
      
        {/* Items List */}
        <div className={`rounded-2xl border mb-6 overflow-hidden ${cardClass}`}>
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="text-5xl mb-4">🛒</div>
              <p>لا توجد عناصر في قائمة التسوق الخاصة بك</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse flex-1">
                    <button 
                      onClick={() => togglePurchased(item.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        item.purchased 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-400 hover:border-green-500'
                      }`}
                    >
                      {item.purchased && <RiCheckLine size={16} />}
                    </button>
                    <div className={`flex-1 ${item.purchased ? 'line-through text-gray-500' : ''}`}>
                      <div className="font-medium text-lg">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.price} ج.م</div>
                    </div>
                    
                    {/* Audio player for item */}
                    {item.audio && (
                      <div className="flex items-center">
                        {!isPlaying ? (
                          <button
                            onClick={playAudio}
                            className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                          >
                            <RiPlayCircleLine size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={stopAudio}
                            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          >
                            <RiStopCircleLine size={20} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Cost */}
        {items.length > 0 && (
          <div className={`p-4 rounded-2xl border mb-6 ${cardClass}`}>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>المجموع:</span>
              <span className="text-indigo-600">{totalCost.toFixed(2)} ج.م</span>
            </div>
          </div>
        )}

   
      </div>
    </div>
    </div>
  );
};

export default ShoppingList;