const audio = document.getElementById('meditationAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackTitleEl = document.getElementById('trackTitle');

const tracks = [
  { title: 'Deep Rest', src: 'music/Deep-rest.mp3' },
  { title: 'Breath & Flow', src: 'music/Breath&Flow.mp3' }
];

let currentTrackIndex = 0;

function loadTrack(index) {
  audio.src = tracks[index].src;
  audio.load();
  trackTitleEl.textContent = tracks[index].title;
}

function playAudio() {
  audio.play();
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseAudio() {
  audio.pause();
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  playAudio();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  playAudio();
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

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

audio.addEventListener('ended', nextTrack);

loadTrack(currentTrackIndex);