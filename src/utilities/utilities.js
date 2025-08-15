"use strict";

export function Utilities(sound, vibrate, storeItem) {
  this.sound = function sound() {
    const audio = new Audio();
    const src = 'src/assets/bubbles.mp3';
    audio.src = src;
    audio.playbackRate=1.25;
    audio.play()
      .then(() => console.log('done'))
      .catch((err) => console.error('Error playing sound:', err));
  };
this.storeItem = function storeItem(nameofproduct, price, photo) {
  // Get or initialize data
  let data = JSON.parse(localStorage.getItem('data')) || {};
  
  // Get current date in "d-M-yyyy" format (e.g., "3-12-2023")
  const date = new Date();
  const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  
  
  // Get formatted time (HH:MM:SS AM/PM)
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12;
  const timeString = `${hours}:${(date.getMinutes())}:${(date.getSeconds())} ${ampm}`;
  // Create the new item object
  const newItem = {
    name: nameofproduct,
    price: price,
    time: timeString,
    timestamp: date.getTime(), // For sorting
    photo : photo
  };
  
  // If date doesn't exist in data, create empty array
  if (!data[dateKey]) {
    data[dateKey] = [];
  }
  
  // Add new item to the date's array
  data[dateKey].push(newItem);
  
  // Save to localStorage
  localStorage.setItem('data', JSON.stringify(data));
  
  return {
    date: dateKey,
    item: newItem
  };
};}

