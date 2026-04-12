const audio = document.getElementById('meditationAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const tracksList = document.getElementById('tracks');

// Массив треков (замените на реальные пути к аудио файлам)
const tracks = [
  { title: 'Спокойная медитация 1', src: 'audio/meditation1.mp3' },
  { title: 'Спокойная медитация 2', src: 'audio/meditation2.mp3' },
  { title: 'Спокойная медитация 3', src: 'audio/meditation3.mp3' }
];

let currentTrackIndex = 0;

// Загрузка треков в список
function loadTracks() {
  tracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.title;
    li.addEventListener('click', () => selectTrack(index));
    tracksList.appendChild(li);
  });
}

// Выбор трека
function selectTrack(index) {
  currentTrackIndex = index;
  audio.src = tracks[index].src;
  audio.load();
  updateActiveTrack();
  playAudio();
}

// Обновление активного трека в списке
function updateActiveTrack() {
  document.querySelectorAll('#tracks li').forEach((li, index) => {
    li.classList.toggle('active', index === currentTrackIndex);
  });
}

// Play/Pause
function playAudio() {
  audio.play();
  playPauseBtn.textContent = '⏸️';
}

function pauseAudio() {
  audio.pause();
  playPauseBtn.textContent = '▶️';
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Volume
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
});

// Progress bar
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

function updateProgress() {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

progressContainer.addEventListener('click', (e) => {
  const clickX = e.offsetX;
  const width = progressContainer.clientWidth;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Форматирование времени
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Автопереход к следующему треку
audio.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  selectTrack(currentTrackIndex);
});

// Инициализация
loadTracks();
if (tracks.length > 0) {
  selectTrack(0);
}