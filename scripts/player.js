const audio = document.getElementById("meditationAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const trackTitleEl = document.getElementById("trackTitle");
const speakerToggleBtn = document.getElementById("speakerToggleBtn");
const voiceAudio = document.getElementById("voiceAudio");
const voiceVolumeSlider = document.getElementById("voiceVolumeSlider");
const voiceVolumeGroup = document.getElementById("voiceVolumeGroup");

const tracks = [
  { title: "Breath & Flow", src: "music/Breath&Flow.mp3" },
];

const voiceTracks = ["music/voice/medtation-voice-Jack.mp3"];
let voiceEnabled = false;

let currentTrackIndex = 0;

function loadTrack(index) {
  audio.src = tracks[index].src;
  audio.load();

  if (voiceEnabled) {
    voiceAudio.src = voiceTracks[index] || voiceTracks[0];
    voiceAudio.load();
  }

  trackTitleEl.textContent = tracks[index].title;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  progressBar.style.width = "0%";
}

function playAudio() {
  audio
    .play()
    .then(() => {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    })
    .catch((error) => {
      console.error("Playback error:", error);
    });
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

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

speakerToggleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  voiceEnabled = !voiceEnabled;
  speakerToggleBtn.setAttribute("aria-pressed", String(voiceEnabled));
  speakerToggleBtn.querySelector(".nav-text").textContent = voiceEnabled
    ? "Выключить спикера"
    : "Добавить спикера";
  voiceVolumeGroup.classList.toggle("hidden", !voiceEnabled);

  if (voiceEnabled) {
    voiceAudio.src = voiceTracks[currentTrackIndex] || voiceTracks[0];
    voiceAudio.load();
    voiceAudio.volume = Number(voiceVolumeSlider.value);
    updateVoiceVolumeSlider();
    voiceAudio.currentTime = audio.currentTime;
    if (!audio.paused) {
      voiceAudio
        .play()
        .catch((error) => console.error("Voice playback error:", error));
    }
  } else {
    voiceAudio.pause();
  }
});

prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

// Volume
volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
  updateVolumeSlider();
});

voiceVolumeSlider.addEventListener("input", () => {
  voiceAudio.volume = Number(voiceVolumeSlider.value);
  updateVoiceVolumeSlider();
});

// Progress bar
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("timeupdate", () => {
  if (!voiceEnabled) return;
  if (isNaN(voiceAudio.duration)) return;

  const diff = Math.abs(audio.currentTime - voiceAudio.currentTime);

  if (diff > 0.4) {
    voiceAudio.currentTime = audio.currentTime;
  }
});
audio.addEventListener("play", () => {
  if (!voiceEnabled) return;
  voiceAudio.currentTime = audio.currentTime;
  voiceAudio.volume = Number(voiceVolumeSlider.value);
  voiceAudio
    .play()
    .catch((error) => console.error("Voice playback error:", error));
});
audio.addEventListener("pause", () => {
  if (voiceEnabled) {
    voiceAudio.pause();
  }
});

audio.addEventListener("loadedmetadata", () => {
  if (!isNaN(audio.duration)) {
    durationEl.textContent = formatTime(audio.duration);
  }
});

function updateProgress() {
  if (!audio.duration || isNaN(audio.duration)) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

progressContainer.addEventListener("click", (e) => {
  if (!audio.duration || isNaN(audio.duration)) return;

  const clickX = e.offsetX;
  const width = progressContainer.clientWidth;
  audio.currentTime = (clickX / width) * audio.duration;
  if (voiceEnabled && !isNaN(voiceAudio.duration)) {
    voiceAudio.currentTime = audio.currentTime;
  }
});

// Time formatting
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateVolumeSlider() {
  const value = Number(volumeSlider.value) * 100;
  const isDark = document.body.classList.contains("dark-theme");

  const activeStart = isDark ? "#7b4dff" : "#667eea";
  const activeEnd = isDark ? "#c75cff" : "#8b5cf6";
  const inactive = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(255,255,255,0.45)";

  volumeSlider.style.background = `
    linear-gradient(
      to right,
      ${activeStart} 0%,
      ${activeEnd} ${value}%,
      ${inactive} ${value}%,
      ${inactive} 100%
    )
  `;
}

function updateVoiceVolumeSlider() {
  const value = Number(voiceVolumeSlider.value) * 100;
  const isDark = document.body.classList.contains("dark-theme");

  const activeStart = isDark ? "#7b4dff" : "#667eea";
  const activeEnd = isDark ? "#c75cff" : "#8b5cf6";
  const inactive = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(255,255,255,0.45)";

  voiceVolumeSlider.style.background = `
    linear-gradient(
      to right,
      ${activeStart} 0%,
      ${activeEnd} ${value}%,
      ${inactive} ${value}%,
      ${inactive} 100%
    )
  `;
}

function syncVoicePosition() {
  if (!voiceEnabled || isNaN(audio.currentTime)) return;
  if (!isNaN(voiceAudio.duration)) {
    voiceAudio.currentTime = audio.currentTime;
  }
}

audio.addEventListener("ended", nextTrack);

// Initial setup
audio.volume = Number(volumeSlider.value);
loadTrack(currentTrackIndex);
updateVolumeSlider();
updateVoiceVolumeSlider();

// Update slider colors after theme switch
const observer = new MutationObserver(() => {
  updateVolumeSlider();
  updateVoiceVolumeSlider();
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
});