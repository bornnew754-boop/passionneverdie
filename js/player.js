/* ============================================================
   Cinema Reels — Album Player
   Vanilla JS + HTML5 Audio API. No frameworks, no build step.
   ============================================================ */

/* ---------- 1. SONG DATA ---------------------------------- */
/* Edit ALBUM_NAME / ALBUM_ARTIST / ALBUM_DESCRIPTION and the
   songs array below to customize the album. File paths point
   at the real MP3s copied into /songs. */

const ALBUM_NAME = "My Music Collection";       // placeholder — edit me
const ALBUM_ARTIST = "Various Artists";          // placeholder — edit me
const ALBUM_DESCRIPTION = "";                    // optional — edit me

const songs = [
  {
    id: 1,
    title: "Rathamaarey",
    artist: "Anirudh Ravichander (Jailer)",
    file: "songs/01-rathamaarey.mp3"
  },
  {
    id: 2,
    title: "Neno Butterfly",
    artist: "G.V. Prakash (Vishwanath and Sons)",
    file: "songs/02-neno-butterfly.mp3"
  },
  {
    id: 3,
    title: "Eklo Pan Ekdo",
    artist: "Mahesh Vanzara",
    file: "songs/03-eklo-pan-ekdo.mp3"
  },
  {
    id: 4,
    title: "Subha Hone Na De",
    artist: "Mika Singh (Desi Boyz)",
    file: "songs/04-subha-hone-na-de.mp3"
  },
  {
    id: 5,
    title: "Beauty And A Beat",
    artist: "Justin Bieber ft. Nicki Minaj",
    file: "songs/05-beauty-and-a-beat.mp3"
  },
  {
    id: 6,
    title: "Heer Aasmani",
    artist: "B Praak (Fighter)",
    file: "songs/06-heer-aasmani.mp3"
  },
  {
    id: 7,
    title: "Deva Deva (Extended)",
    artist: "Arijit Singh, Jonita Gandhi (Brahmāstra)",
    file: "songs/07-deva-deva.mp3"
  },
  {
    id: 8,
    title: "Lose My Mind × F1 (Extended Cinematic Cut)",
    artist: "F1 The Movie",
    file: "songs/08-lose-my-mind-f1.mp3"
  },
  {
    id: 9,
    title: "Chikiri Chikiri",
    artist: "A.R. Rahman, Mohit Chauhan (Peddi)",
    file: "songs/09-chikiri-chikiri.mp3"
  },
  {
    id: 10,
    title: "Massa Massa",
    artist: "A.R. Rahman, Vishal Mishra (Peddi)",
    file: "songs/10-massa-massa.mp3"
  },
  {
    id: 11,
    title: "Khamma Ramdevpir",
    artist: "none",
    file: "songs/11-Khamma-Ramdevpir.mp3"
  },
  {
    id: 12,
    title: "Koi Mil Gaya",
    artist: "none",
    file: "songs/12-Koi-Mil-Gaya.mp3"
  },
  {
    id: 13,
    title: "Dildara",
    artist: "shahrukh",
    file: "songs/13-Dildara.mp3"
  },
{
    id: 14,
    title: "Dil Diyan Gallan",
    artist: "Atif Aslam",
    file: "songs/14-Dil-Diyan-Gallan.mp3"
  },
  {
    id: 15,
    title: "Sapna Jahan",
    artist: "sonu nigam",
    file: "songs/15-Sapna-Jahan.mp3"
  },
  {
    id: 16,
    title: "Vandemataram",
    artist: "A.R. Rahman",
    file: "songs/16-Vandemataram.mp3"
  },
  {
    id: 17,
    title: "Bande Hain Hum",
    artist: "A.R. Rahman",
    file: "songs/17-Bande-Hain-Hum.mp3"
  },
   {
    id: 18,
    title: "ram",
    artist: "A.R. Rahman",
    file: "songs/18-ram.mp3"
  },
     {
    id: 19,
    title: "Khaleja",
    artist: "A.R. Rahman",
    file: "songs/19-khaleja.mp3"
  },
  {
    id: 20,
    title: "premalu",
    artist: "m.m.keervani",
    file: "songs/20-Premalu.mp3"
  },
   {
    id: 21,
    title: "are are are",
    artist: "A.R. Rahman",
    file: "songs/21-Are.mp3"
  },
    {
    id: 22,
    title: "Mamta se bhari",
    artist: "A.R. Rahman",
    file: "songs/22-Mamta-Se-Bhari.mp3"
  },
     {
    id: 23,
    title: "Son of satyamarty",
    artist: "A.R. Rahman",
    file: "songs/23-Son-Of-Satyamurthy.mp3"
  },
   {
    id: 24,
    title: "yevadu",
    artist: "A.R. Rahman",
    file: "songs/24-Yevadu.mp3"
  },
     {
    id: 25,
    title: "Ram chant",
    artist: "A.R. Rahman",
    file: "songs/25-Rama-chant.mp3"
  },
];

/* ---------- 2. STATE ---------------------------------------- */

const audio = document.getElementById("audio");

let state = {
  queue: songs.map((s) => s.id),   // current playable order (respects shuffle)
  currentIndex: 0,                  // index into `queue`
  isPlaying: false,
  shuffle: false,
  repeat: "off",                    // "off" | "one" | "all"
  volume: 80,
  muted: false,
  searchTerm: ""
};

/* ---------- 3. DOM REFS -------------------------------------- */

const el = {
  songList: document.getElementById("songList"),
  noResults: document.getElementById("noResults"),
  resultCount: document.getElementById("resultCount"),
  search: document.getElementById("search"),
  clearSearch: document.getElementById("clearSearch"),

  albumName: document.getElementById("albumName"),
  albumArtist: document.getElementById("albumArtist"),
  albumMeta: document.getElementById("albumMeta"),
  albumCover: document.getElementById("albumCover"),
  tonearm: document.getElementById("tonearm"),

  miniCover: document.getElementById("miniCover"),
  nowTitle: document.getElementById("nowTitle"),
  nowArtist: document.getElementById("nowArtist"),
  miniEq: document.getElementById("miniEq"),

  playBtn: document.getElementById("playBtn"),
  playIcon: document.getElementById("playIcon"),
  pauseIcon: document.getElementById("pauseIcon"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  shuffleBtnMobile: document.getElementById("shuffleBtnMobile"),
  repeatBtn: document.getElementById("repeatBtn"),
  repeatBtnMobile: document.getElementById("repeatBtnMobile"),
  repeatOneBadge: document.getElementById("repeatOneBadge"),

  progress: document.getElementById("progress"),
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),

  volume: document.getElementById("volume"),
  muteBtn: document.getElementById("muteBtn"),
  volIcon: document.getElementById("volIcon"),
  muteIcon: document.getElementById("muteIcon"),

  errorToast: document.getElementById("errorToast")
};

/* ---------- 4. UTILITIES -------------------------------------- */

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function songById(id) {
  return songs.find((s) => s.id === id);
}

function currentSong() {
  const songId = state.queue[state.currentIndex];
  return songById(songId);
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showError(message) {
  el.errorToast.textContent = message;
  el.errorToast.classList.remove("hidden");
  clearTimeout(showError._t);
  showError._t = setTimeout(() => el.errorToast.classList.add("hidden"), 4000);
}

/* ---------- 5. LOCAL STORAGE ------------------------------------ */

const STORAGE_KEY = "cinemaReelsPlayerState";

function saveSettings() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastSongId: currentSong() ? currentSong().id : null,
        volume: state.volume,
        muted: state.muted,
        shuffle: state.shuffle,
        repeat: state.repeat
      })
    );
  } catch (e) {
    /* localStorage unavailable (e.g. private browsing) — fail silently */
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);

    if (typeof saved.volume === "number") state.volume = saved.volume;
    if (typeof saved.muted === "boolean") state.muted = saved.muted;
    if (saved.shuffle) state.shuffle = true;
    if (saved.repeat) state.repeat = saved.repeat;

    if (state.shuffle) {
      state.queue = shuffleArray(songs.map((s) => s.id));
    }

    if (saved.lastSongId) {
      const idx = state.queue.indexOf(saved.lastSongId);
      if (idx !== -1) state.currentIndex = idx;
    }
  } catch (e) {
    /* ignore corrupt/blocked storage */
  }
}

/* ---------- 6. RENDERING ----------------------------------------- */

function renderAlbumInfo() {
  el.albumName.textContent = ALBUM_NAME;
  el.albumArtist.textContent = ALBUM_ARTIST;
  document.title = `${ALBUM_NAME} — Cinema Reels`;

  const totalSeconds = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
  const parts = [];
  parts.push(`${songs.length} Song${songs.length === 1 ? "" : "s"}`);
  if (totalSeconds > 0) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.round((totalSeconds % 3600) / 60);
    parts.push(h > 0 ? `${h}h ${m}m` : `${m}m`);
  }
  el.albumMeta.textContent = parts.join(" • ");
}

function filteredSongs() {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return songs;
  return songs.filter(
    (s) =>
      s.title.toLowerCase().includes(term) ||
      s.artist.toLowerCase().includes(term)
  );
}

function renderSongs() {
  const list = filteredSongs();
  el.songList.innerHTML = "";

  el.resultCount.textContent = state.searchTerm.trim()
    ? `${list.length} result${list.length === 1 ? "" : "s"}`
    : "";

  if (list.length === 0) {
    el.noResults.classList.remove("hidden");
    return;
  }
  el.noResults.classList.add("hidden");

  const current = currentSong();

  list.forEach((song) => {
    const isActive = current && current.id === song.id;
    const li = document.createElement("li");
    li.className = "song-row" + (isActive ? " active" : "");

    const indexLabel = String(songs.findIndex((s) => s.id === song.id) + 1).padStart(2, "0");

    li.innerHTML = `
      <button type="button"
        class="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-left hover:bg-card/60 transition-colors group"
        data-song-id="${song.id}"
        aria-current="${isActive ? "true" : "false"}"
      >
        <span class="w-6 sm:w-7 shrink-0 font-mono text-xs sm:text-sm text-mute text-center">
          ${
            isActive && state.isPlaying
              ? '<span class="eq" aria-hidden="true"><span></span><span></span><span></span></span>'
              : isActive
              ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="text-gold mx-auto"><path d="M8 5v14l11-7z"/></svg>'
              : indexLabel
          }
        </span>
        <span class="min-w-0 flex-1">
          <span class="track-title block text-sm sm:text-[15px] font-semibold truncate ${isActive ? "text-gold" : "text-bone"}">${escapeHtml(song.title)}</span>
          <span class="block text-xs sm:text-sm text-mute truncate">${escapeHtml(song.artist)}</span>
        </span>
        <span class="font-mono text-xs text-mute shrink-0">${song.duration ? formatTime(song.duration) : "--:--"}</span>
      </button>
    `;
    el.songList.appendChild(li);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function updatePlayerUI() {
  const song = currentSong();
  if (!song) return;

  el.nowTitle.textContent = song.title;
  el.nowArtist.textContent = song.artist;

  el.playIcon.classList.toggle("hidden", state.isPlaying);
  el.pauseIcon.classList.toggle("hidden", !state.isPlaying);
  el.playBtn.setAttribute("aria-label", state.isPlaying ? "Pause" : "Play");

  el.miniEq.classList.toggle("hidden", !state.isPlaying);
  el.albumCover.classList.toggle("playing", state.isPlaying);
  el.tonearm.classList.toggle("playing", state.isPlaying);

  [el.shuffleBtn, el.shuffleBtnMobile].forEach((btn) => {
    btn.setAttribute("aria-pressed", state.shuffle ? "true" : "false");
    btn.classList.toggle("text-gold", state.shuffle);
    btn.classList.toggle("text-mute", !state.shuffle);
  });

  const repeatLabel = { off: "Repeat off", all: "Repeat all", one: "Repeat one" }[state.repeat];
  [el.repeatBtn, el.repeatBtnMobile].forEach((btn) => {
    btn.setAttribute("aria-label", repeatLabel);
    btn.classList.toggle("text-gold", state.repeat !== "off");
    btn.classList.toggle("text-mute", state.repeat === "off");
  });
  el.repeatOneBadge.classList.toggle("hidden", state.repeat !== "one");

  renderSongs();
}

/* ---------- 7. PLAYBACK ------------------------------------------ */

function loadSong(index, { autoplay } = { autoplay: false }) {
  if (index < 0 || index >= state.queue.length) return;
  state.currentIndex = index;

  const song = currentSong();
  if (!song) return;

  audio.src = song.file;
  el.duration.textContent = "0:00";
  el.progress.value = 0;

  updatePlayerUI();
  saveSettings();

  if (autoplay) {
    playSong();
  }
}

function playSong() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        state.isPlaying = true;
        updatePlayerUI();
      })
      .catch(() => {
        // Autoplay blocked or file failed — keep UI in paused state.
        state.isPlaying = false;
        updatePlayerUI();
      });
  }
}

function pauseSong() {
  audio.pause();
  state.isPlaying = false;
  updatePlayerUI();
}

function togglePlay() {
  if (!currentSong()) return;
  if (state.isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function playSongById(id) {
  const idx = state.queue.indexOf(id);
  if (idx === -1) return;
  loadSong(idx, { autoplay: true });
}

function nextSong({ userInitiated } = { userInitiated: true }) {
  if (state.queue.length === 0) return;

  if (state.shuffle && userInitiated) {
    // Pick a random track different from the current one when possible.
    let nextIdx = state.currentIndex;
    if (state.queue.length > 1) {
      while (nextIdx === state.currentIndex) {
        nextIdx = Math.floor(Math.random() * state.queue.length);
      }
    }
    loadSong(nextIdx, { autoplay: true });
    return;
  }

  const isLast = state.currentIndex === state.queue.length - 1;
  if (isLast) {
    if (state.repeat === "all") {
      loadSong(0, { autoplay: true });
    } else if (!userInitiated) {
      // Natural end of album with repeat off — stop.
      pauseSong();
    } else {
      loadSong(0, { autoplay: true });
    }
  } else {
    loadSong(state.currentIndex + 1, { autoplay: true });
  }
}

function previousSong() {
  if (state.queue.length === 0) return;
  // If more than 3s into the song, restart it instead of going back.
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const isFirst = state.currentIndex === 0;
  if (isFirst) {
    loadSong(state.repeat === "all" ? state.queue.length - 1 : 0, { autoplay: true });
  } else {
    loadSong(state.currentIndex - 1, { autoplay: true });
  }
}

function toggleShuffle() {
  state.shuffle = !state.shuffle;
  const currentId = currentSong() ? currentSong().id : null;

  if (state.shuffle) {
    state.queue = shuffleArray(songs.map((s) => s.id));
  } else {
    state.queue = songs.map((s) => s.id);
  }

  if (currentId) {
    const idx = state.queue.indexOf(currentId);
    if (idx !== -1) state.currentIndex = idx;
  }

  updatePlayerUI();
  saveSettings();
}

function toggleRepeat() {
  state.repeat = { off: "all", all: "one", one: "off" }[state.repeat];
  updatePlayerUI();
  saveSettings();
}

/* ---------- 8. PROGRESS / VOLUME --------------------------------- */

function updateProgress() {
  if (!isFinite(audio.duration)) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  el.progress.value = pct || 0;
  el.currentTime.textContent = formatTime(audio.currentTime);
}

function setProgress() {
  if (!isFinite(audio.duration)) return;
  const pct = parseFloat(el.progress.value);
  audio.currentTime = (pct / 100) * audio.duration;
}

function setVolume(value) {
  state.volume = Math.min(100, Math.max(0, value));
  audio.volume = state.volume / 100;
  if (state.volume > 0 && state.muted) state.muted = false;
  audio.muted = state.muted;
  el.volume.value = state.volume;
  updateVolumeIcon();
  saveSettings();
}

function toggleMute() {
  state.muted = !state.muted;
  audio.muted = state.muted;
  updateVolumeIcon();
  saveSettings();
}

function updateVolumeIcon() {
  const showMuted = state.muted || state.volume === 0;
  el.volIcon.classList.toggle("hidden", showMuted);
  el.muteIcon.classList.toggle("hidden", !showMuted);
  el.muteBtn.setAttribute("aria-label", showMuted ? "Unmute" : "Mute");
}

/* ---------- 9. SEARCH ---------------------------------------------- */

function searchSongs(term) {
  state.searchTerm = term;
  renderSongs();
}

/* ---------- 10. EVENT WIRING ---------------------------------------- */

el.songList.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-song-id]");
  if (!btn) return;
  playSongById(Number(btn.dataset.songId));
});

el.playBtn.addEventListener("click", togglePlay);
el.prevBtn.addEventListener("click", previousSong);
el.nextBtn.addEventListener("click", () => nextSong({ userInitiated: true }));
[el.shuffleBtn, el.shuffleBtnMobile].forEach((b) => b.addEventListener("click", toggleShuffle));
[el.repeatBtn, el.repeatBtnMobile].forEach((b) => b.addEventListener("click", toggleRepeat));

el.progress.addEventListener("input", setProgress);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => {
  el.duration.textContent = formatTime(audio.duration);
  const song = currentSong();
  if (song) {
    song.duration = audio.duration;
    renderAlbumInfo();
  }
});

audio.addEventListener("ended", () => {
  if (state.repeat === "one") {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong({ userInitiated: false });
  }
});

audio.addEventListener("error", () => {
  const song = currentSong();
  showError(
    `Unable to load "${song ? song.title : "this song"}". Please check the MP3 file path.`
  );
  state.isPlaying = false;
  updatePlayerUI();
});

el.volume.addEventListener("input", (e) => setVolume(Number(e.target.value)));
el.muteBtn.addEventListener("click", toggleMute);

el.search.addEventListener("input", (e) => {
  el.clearSearch.classList.toggle("hidden", !e.target.value);
  searchSongs(e.target.value);
});
el.clearSearch.addEventListener("click", () => {
  el.search.value = "";
  el.clearSearch.classList.add("hidden");
  searchSongs("");
  el.search.focus();
});

/* ---------- 11. KEYBOARD SHORTCUTS ------------------------------------ */

document.addEventListener("keydown", (e) => {
  const isTyping =
    document.activeElement &&
    (document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "TEXTAREA");
  if (isTyping) return;

  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowLeft":
      e.preventDefault();
      if (e.shiftKey) {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else {
        previousSong();
      }
      break;
    case "ArrowRight":
      e.preventDefault();
      if (e.shiftKey) {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      } else {
        nextSong({ userInitiated: true });
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      setVolume(state.volume + 5);
      break;
    case "ArrowDown":
      e.preventDefault();
      setVolume(state.volume - 5);
      break;
    case "m":
    case "M":
      toggleMute();
      break;
    case "n":
    case "N":
      nextSong({ userInitiated: true });
      break;
    case "p":
    case "P":
      previousSong();
      break;
  }
});

/* ---------- 12. INIT --------------------------------------------------- */

function init() {
  loadSettings();
  renderAlbumInfo();

  audio.volume = state.volume / 100;
  audio.muted = state.muted;
  el.volume.value = state.volume;
  updateVolumeIcon();

  // Load the saved/first song without autoplaying (browsers block
  // unsolicited audio, and the user should choose to press play).
  loadSong(state.currentIndex, { autoplay: false });
}

init();
