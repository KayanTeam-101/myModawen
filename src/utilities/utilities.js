"use strict";

export function Utilities(sound, vibrate, storeItem) {
  this.sound = function sound() {
    const audio = new Audio();
    const src = 'src/assets/bubbles.mp3';
    audio.src = src;
    audio.playbackRate=1;
    audio.volume=.2;
    audio.play()
      .then(() => console.log('done'))
      .catch((err) => console.error('Error playing sound:', err));
  };
this.storeItem = function storeItem(nameofproduct, price, photo, voice) {
  let data = JSON.parse(localStorage.getItem('data')) || {};

  // If caller passed only 3 args and the 3rd is an audio data URL,
  // treat it as voice.
  if (!voice && typeof photo === 'string' && photo.startsWith('data:audio')) {
    voice = photo;
    photo = null;
  }

  const date = new Date();
  const dateKey = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timeString = `${hours}:${date.getMinutes()}:${date.getSeconds()} ${ampm}`;

  const newItem = {
    name: nameofproduct,
    price: price,
    time: timeString,
    timestamp: date.getTime(),
    photo: photo || null,
    record: voice || null
  };

  if (!data[dateKey]) data[dateKey] = [];
  data[dateKey].push(newItem);
  localStorage.setItem('data', JSON.stringify(data));

  return { date: dateKey, item: newItem };
};}

