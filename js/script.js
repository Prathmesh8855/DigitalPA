

let currentsong = new Audio();
var songs;

let currfolder;

function secondtominute(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }

  const minutes = Math.floor(seconds / 60);
  const remainingseconds = Math.floor(seconds % 60);

  const fromattachminute = String(minutes).padStart(2, '0');
  const fromattachseconds = String(remainingseconds).padStart(2, '0');

  return `${fromattachminute}:${fromattachseconds}`

}

async function getsong(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let responce = await a.text();
  let div = document.createElement("div");
  div.innerHTML = responce;
  let ul = div.getElementsByTagName("a");
  songs = []
  for (let index = 0; index < ul.length; index++) {
    const element = ul[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])

    }
  }

  let songul = document.querySelector(".song-card").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const music of songs) {
    let songli = `
                       <li>
                          <div class="s-card">
                              <img src="images/music.svg" alt="">
                              <div class="song-name">${music.replaceAll("%20", " ")}</div>
                              <div class="play-now"><div>Play Now</div><img src="images/play.svg" alt="">
                              </div>
                          </div>
                      </li>
      `
    songul.innerHTML = songul.innerHTML + songli
  }
  Array.from(document.querySelector(".song-card").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", () => {
      playsong(e.getElementsByTagName('div')[1].innerHTML);
    })
  })

  return songs;

}

const playsong = (Music, pause = false) => {
  currentsong.src = `/${currfolder}/` + Music;

  if (!pause) {
    currentsong.play();
    play.src = "images/pause.svg"
  }

  document.querySelector(".music-name>p").innerText = decodeURI(Music);



}

async function displayalbum() {
  let b = await fetch("/Song/");
  let responce = await b.text();

  let div = document.createElement("div");
  div.innerHTML = responce;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
   for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/Song/") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/Song")[1];
      let cardcontainer = document.querySelector(".song-cards")
      let a = await fetch(`/Song/${folder}/info.json`);
      let responce = await a.json();
    
      cardcontainer.innerHTML = cardcontainer.innerHTML + `
                 <div data-folder="${folder}" class="card">
                   <img src="/Song/${folder}/cover.jpg" alt="">
                    <h3>${responce.tittle}</h3>
                    <p>${responce.disc}</p>
                </div>
      `
    }
   }


 
   

      document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async element => {
          let atrr = element.currentTarget.getAttribute("data-folder");
          songs = await getsong(`Song/${atrr}`);
          playsong(songs[0])

        })
      })
    }
  

  



async function main() {

  await getsong("Song/love");
  playsong(songs[0], true)

  displayalbum()

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "images/pause.svg"
    }
    else {
      currentsong.pause();
      play.src = "images/play.svg"
    }
  })

  previes.addEventListener("click", () => {

    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    if ((index - 1) >= 0) {
      playsong(songs[index - 1])

    }
  })

  next.addEventListener("click", () => {

    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playsong(songs[index + 1])
    }
  })


  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${secondtominute(currentsong.currentTime)}/${secondtominute(currentsong.duration)}`;
    document.querySelector(".dot").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    
  })

  document.querySelector(".seakhbar").addEventListener("click", (e) => {
    let persentposition = (e.offsetX / e.target.getBoundingClientRect().width) * 100;


    document.querySelector(".dot").style.left = persentposition + "%";
    currentsong.currentTime = ((currentsong.duration) * persentposition) / 100;

  })

  document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  })

 let volumesvg = document.querySelector(".volume>img")
  volumesvg.addEventListener("click", ()=>{
    
    if(volumesvg.src.includes("volume.svg")){
      volumesvg.src = volumesvg.src.replace("volume.svg", "mute.svg")
      
      currentsong.volume = 0;
      document.querySelector(".volume").getElementsByTagName("input")[0].value = 0;

    }
    else{
      volumesvg.src = volumesvg.src.replace("mute.svg", "volume.svg");
      currentsong.volume = 0.5;
      document.querySelector(".volume").getElementsByTagName("input")[0].value = 50;
    }

  })

  document.querySelector(".upper-right>.ham>img").addEventListener("click", () => {
    
    document.querySelector(".main>.left").style.display = "block"
  })

  document.querySelector(".upper>.ham-close-img").addEventListener("click", () => {
   
    document.querySelector(".main>.left").style.display = "none"
  })

}
main();