// Audio player JavaScript for meditation page

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

// Array of meditation tracks
const tracks = [
  { title: 'Спокойная медитация 1', src: 'music/meditation1.mp3' },
  { title: 'Спокойная медитация 2', src: 'music/meditation2.mp3' },
  { title: 'Спокойная медитация 3', src: 'music/meditation3.mp3' },
  { title: 'Глубокая релаксация', src: 'music/relaxation.mp3' },
  { title: 'Медитация на природе', src: 'music/nature.mp3' }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Initialize player
function initPlayer() {
  loadTrack(currentTrackIndex);
  updateTrackTitle();
}

// Load track
function loadTrack(index) {
  audio.src = tracks[index].src;
  audio.load();
}

// Update track title display
function updateTrackTitle() {
  trackTitleEl.textContent = tracks[currentTrackIndex].title;
}

// Play audio
function playAudio() {
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause audio
function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Toggle play/pause
function togglePlayPause() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

// Next track
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  updateTrackTitle();
  if (isPlaying) {
    playAudio();
  }
}

// Previous track
function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  updateTrackTitle();
  if (isPlaying) {
    playAudio();
  }
}

// Update progress bar
function updateProgress() {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

// Set progress on click
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Update duration when metadata loads
function updateDuration() {
  durationEl.textContent = formatTime(audio.duration);
}

// Format time (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Set volume
function setVolume() {
  audio.volume = volumeSlider.value;
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateDuration);
audio.addEventListener('ended', nextTrack);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);

// Initialize on load
document.addEventListener('DOMContentLoaded', initPlayer);