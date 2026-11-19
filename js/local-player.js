/* ============================================================
   Cinema Reels — Local Songs Player
   Plays only the files you put in /songs.
   ============================================================ */

const ALBUM_NAME   = 'My Music Collection';
const ALBUM_ARTIST = 'Various Artists';
const ALBUM_COVER  = 'images/album-cover.svg';
const SONGS_FOLDER = 'songs/';

const LOCAL_SONGS = [
  // { title: 'Song One', artist: 'Artist A', file: 'song-one.mp3' },
  // { title: 'Song Two', artist: 'Artist B', file: 'song-two.mp3' },
];

const localTracks = LOCAL_SONGS.map((s, i) => ({
  id: 'local-' + i,
  title: s.title,
  artist: s.artist,
  album: '',
  cover: s.cover || ALBUM_COVER,
  src: SONGS_FOLDER + s.file,
  source: 'local',
  durationLabel: '',
}));

const $ = (id) => document.getElementById(id);
const els = {
  albumCover: $('albumCover'), albumName: $('albumName'), albumArtist: $('albumArtist'), albumMeta: $('albumMeta'),
  songList: $('songList'), noResults: $('noResults'), resultCount: $('resultCount'),
  currentTime: $('currentTime'), duration: $('duration'), progress: $('progress'),
  miniCover: $('miniCover'), nowTitle: $('nowTitle'), nowArtist: $('nowArtist'), miniEq: $('miniEq'),
  playBtn: $('playBtn'), playIcon: $('playIcon'), pauseIcon: $('pauseIcon'),
  prevBtn: $('prevBtn'), nextBtn: $('nextBtn'),
  shuffleBtn: $('shuffleBtn'), shuffleBtnMobile: $('shuffleBtnMobile'),
  repeatBtn: $('repeatBtn'), repeatBtnMobile: $('repeatBtnMobile'), repeatOneBadge: $('repeatOneBadge'),
  muteBtn: $('muteBtn'), volIcon: $('volIcon'), muteIcon: $('muteIcon'), volume: $('volume'),
  errorToast: $('errorToast'),
};

const audio = $('audio');
const state = {
  queue: [], current: null, shuffle: false, repeat: 'off', lastVolume: 0.8,
};

let seeking = false;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
function fmtTime(s) { if (!isFinite(s) || s < 0) return '0:00'; const m = Math.floor(s/60); return m + ':' + String(Math.floor(s%60)).padStart(2,'0'); }
function showError(msg) { els.errorToast.textContent = msg; els.errorToast.classList.remove('hidden'); clearTimeout(showError._t); showError._t = setTimeout(() => els.errorToast.classList.add('hidden'), 4500); }

function rowEl(track, n) {
  const li = document.createElement('li');
  li.className = 'song-row';
  li.dataset.id = track.id;
  li.innerHTML = `
    <button type="button" class="w-full flex items-center gap-3 px-3 sm:px-4 py-3 text-left hover:bg-card/60 transition-colors">
      <span class="w-5 text-center font-mono text-[11px] text-mute shrink-0">${n}</span>
      <img src="${esc(track.cover)}" alt="" loading="lazy" class="w-10 h-10 rounded-md object-cover border border-line shrink-0"
           onerror="this.onerror=null;this.src='${ALBUM_COVER}'">
      <span class="min-w-0 flex-1">
        <span class="track-title block text-sm font-semibold truncate">${esc(track.title)}</span>
        <span class="block text-[11px] text-mute truncate">${esc(track.artist)}</span>
      </span>
      <span class="eq hidden shrink-0"><span></span><span></span><span></span></span>
    </button>`;
  li.querySelector('button').addEventListener('click', () => selectTrack(track));
  return li;
}

function render() {
  state.queue = localTracks;
  els.resultCount.textContent = localTracks.length ? `${localTracks.length} track${localTracks.length === 1 ? '' : 's'}` : '';
  els.songList.innerHTML = '';
  localTracks.forEach((t, i) => els.songList.appendChild(rowEl(t, i + 1)));
  els.noResults.classList.toggle('hidden', localTracks.length > 0);
  updateActiveUI();
}

function updateActiveUI() {
  const playing = !audio.paused && !!state.current;
  els.songList.querySelectorAll('.song-row').forEach((li) => {
    const isCurrent = !!state.current && li.dataset.id === state.current.id;
    li.classList.toggle('active', isCurrent);
    const eq = li.querySelector('.eq');
    if (eq) eq.classList.toggle('hidden', !(isCurrent && playing));
  });
  els.miniEq.classList.toggle('hidden', !(state.current && playing));
  els.playIcon.classList.toggle('hidden', playing);
  els.pauseIcon.classList.toggle('hidden', !playing);
  els.playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}

function selectTrack(track, autoplay = true) {
  state.current = track;
  audio.src = track.src;
  els.progress.max = 100; els.progress.value = 0;
  els.currentTime.textContent = '0:00'; els.duration.textContent = '0:00';
  paintProgress();
  els.nowTitle.textContent = track.title; els.nowArtist.textContent = track.artist;
  els.miniCover.src = track.cover || ALBUM_COVER;
  els.miniCover.onerror = () => { els.miniCover.src = ALBUM_COVER; };
  if (autoplay) audio.play().catch(() => showError('Could not start playback — tap play.'));
  updateActiveUI();
}

function step(dir, auto = false) {
  const q = state.queue.length ? state.queue : localTracks;
  if (!q.length) return;
  if (dir > 0 && state.shuffle && q.length > 1) {
    const curIdx = state.current ? q.findIndex((t) => t.id === state.current.id) : -1;
    let next = curIdx;
    while (next === curIdx) next = Math.floor(Math.random() * q.length);
    return selectTrack(q[next]);
  }
  const idx = state.current ? q.findIndex((t) => t.id === state.current.id) : -1;
  let next = idx + dir;
  if (next < 0) next = q.length - 1;
  if (next >= q.length) {
    if (auto && state.repeat === 'off') { audio.pause(); audio.currentTime = 0; updateActiveUI(); return; }
    next = 0;
  }
  selectTrack(q[next]);
}

function togglePlay() {
  if (!state.current) { const first = state.queue[0] || localTracks[0]; if (first) selectTrack(first); else showError('No song to play'); return; }
  if (audio.paused) audio.play().catch(() => showError('Playback failed.')); else audio.pause();
}

els.playBtn.addEventListener('click', togglePlay);
els.prevBtn.addEventListener('click', () => { if (audio.currentTime > 3) { audio.currentTime = 0; return; } step(-1); });
els.nextBtn.addEventListener('click', () => step(1));

function setShuffle(on) {
  state.shuffle = on;
  [els.shuffleBtn, els.shuffleBtnMobile].forEach((b) => { if (b) { b.setAttribute('aria-pressed', String(on)); b.classList.toggle('text-gold', on); b.classList.toggle('text-mute', !on); } });
}
els.shuffleBtn.addEventListener('click', () => setShuffle(!state.shuffle));
els.shuffleBtnMobile.addEventListener('click', () => setShuffle(!state.shuffle));

function cycleRepeat() {
  state.repeat = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
  const label = state.repeat === 'off' ? 'Repeat off' : state.repeat === 'all' ? 'Repeat all' : 'Repeat one';
  [els.repeatBtn, els.repeatBtnMobile].forEach((b) => { if (b) { b.setAttribute('aria-label', label); b.classList.toggle('text-gold', state.repeat !== 'off'); b.classList.toggle('text-mute', state.repeat === 'off'); } });
  els.repeatOneBadge.classList.toggle('hidden', state.repeat !== 'one');
}
els.repeatBtn.addEventListener('click', cycleRepeat);
els.repeatBtnMobile.addEventListener('click', cycleRepeat);

audio.addEventListener('play', updateActiveUI);
audio.addEventListener('pause', updateActiveUI);
audio.addEventListener('loadedmetadata', () => { els.progress.max = isFinite(audio.duration) ? audio.duration : 100; els.duration.textContent = fmtTime(audio.duration); });
audio.addEventListener('timeupdate', () => { if (seeking) return; els.progress.value = audio.currentTime; els.currentTime.textContent = fmtTime(audio.currentTime); paintProgress(); });
audio.addEventListener('ended', () => { if (state.repeat === 'one') { audio.currentTime = 0; audio.play().catch(() => {}); return; } step(1, true); });
audio.addEventListener('error', () => { if (!state.current) return; showError(`Can't play "${state.current.title}" — check that ${state.current.src} exists.`); });

function paintProgress() {
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  els.progress.style.background = `linear-gradient(90deg, #e3a855 ${pct}%, #2c2333 ${pct}%)`;
}
els.progress.addEventListener('input', () => { seeking = true; els.currentTime.textContent = fmtTime(Number(els.progress.value)); paintProgress(); });
els.progress.addEventListener('change', () => { if (isFinite(audio.duration)) audio.currentTime = Number(els.progress.value); seeking = false; });

function applyVolume(v) { audio.volume = Math.max(0, Math.min(1, v)); els.volume.value = Math.round(audio.volume * 100); const muted = audio.volume === 0; els.volIcon.classList.toggle('hidden', muted); els.muteIcon.classList.toggle('hidden', !muted); }
els.volume.addEventListener('input', () => { state.lastVolume = Number(els.volume.value) / 100; applyVolume(state.lastVolume); });
els.muteBtn.addEventListener('click', () => { if (audio.volume > 0) { state.lastVolume = audio.volume; applyVolume(0); } else { applyVolume(state.lastVolume || 0.8); } });

document.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea') return;
  if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); audio.currentTime += 5; }
  if (e.key === 'ArrowLeft') { e.preventDefault(); audio.currentTime -= 5; }
});

(function init() {
  els.albumName.textContent = ALBUM_NAME;
  els.albumArtist.textContent = ALBUM_ARTIST;
  els.albumCover.src = ALBUM_COVER;
  els.albumMeta.textContent = `${localTracks.length} track${localTracks.length === 1 ? '' : 's'} in library`;
  applyVolume(state.lastVolume);
  setShuffle(false);
  cycleRepeat();
  render();
})();
