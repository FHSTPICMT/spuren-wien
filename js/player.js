const musicContainer = document.querySelector('.img-container');
const playBtn= document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
//const title = document.querySelector('#title');
const cover = document.querySelector('#cover');
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

// Song titles
const songs=["00_Welcome", "04_Das_Lager"];

// Keep track of the songs
let songIndex = 0;

initApp();

function initApp()
{
    //title.innerText = "Willkommen bei Spuren lesbar machen. Berühren Sie den Play Button um zu starten.";
    audio.src = `audio/${songs[0]}.mp3`;
    cover.src = `img/${songs[0]}.jpg`;
}

function loadPosition(song)
{
    tempTitle = song.replace(/_/g, " ");
    console.log(tempTitle);
    //title.innerText = tempTitle.slice(3);
    audio.src = `audio/${song}.mp3`;
    cover.src = `img/${song}.jpg`;
    audio.play();
}

function playSong()
{
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

function pauseSong()
{
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}



function updateProgress(e)
{
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function setProgress(e)
{
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}

// Event Listeners
playBtn.addEventListener('click', () =>
{
    /*
    const isPlaying = musicContainer.classList.contains('play');

    if(isPlaying)
    {
        pauseSong();
    }
    else
    {
        playSong();
    } */
    playSong();
    //title.innerText = "Bewegen Sie sich durch das Gelände und entdecken Sie dessen Geschichte.";
    document.getElementById("play").style.display = "none";
    acquireLock();
    openFullscreen();
    audio.onended = function() {
        hasStarted = true;
        SearchTriggerPos();
    };
})

// Change Song Events
//prevBtn.addEventListener('click', prevSong);
//nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);

//Automaticly continue when audio ended
//audio.addEventListener('ended', nextSong);


function loadSong(song)
{
    //title.innerText = song;
    audio.src = `audio/${song}.mp3`;
    cover.src = `img/${song}.jpg`;
}

function prevSong()
{
    songIndex--;

    if(songIndex < 0)
    {
        songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);
    playSong();
}

function nextSong()
{
    songIndex++;

    if(songIndex > songs.length - 1)
    {
        songIndex = 0;
    }

    loadSong(songs[songIndex]);
    playSong();
}

//Fullscreen
/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }
  
  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }