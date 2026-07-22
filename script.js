const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let proc = 0;

let time = 30;

let score = 0;

//手の座標など
let hx = 0;
let hy = 0;
let handOpen = true;

//画像の上にマウスが乗っているか否か
let hoverHand = -1;
let xList = [];
let handY = 0;
let size = 150;

//どの手が選択されているか
let selectedHand = 0;

//
const icon1 = new Image();
icon1.src = "image/hatena.png";

//選択画面アイコンの画像
const menuHandopen = new Image();
menuHandopen.src = "image/btn_openmenu.png";

const menuHandclose = new Image();
menuHandclose.src = "image/btn_closemenu.png";

//デフォルトの手の画像
const openHandR = new Image();
openHandR.src = "image/hand/open_handR.png";

const openHandL = new Image();
openHandL.src = "image/hand/open_handL.png";

const closeHandR = new Image();
closeHandR.src = "image/hand/close_handR.png";

const closeHandL = new Image();
closeHandL.src = "image/hand/close_handL.png";

//キツネの手の画像
const openFoxhandR = new Image();
openFoxhandR.src = "image/fox/open_foxR.png";

const openFoxhandL = new Image();
openFoxhandL.src = "image/fox/open_foxL.png";

const closeFoxhandR = new Image();
closeFoxhandR.src = "image/fox/close_foxR.png";

const closeFoxhandL = new Image();
closeFoxhandL.src = "image/fox/close_foxL.png";

//デコピンの手の画像
const openDekopinR = new Image();
openDekopinR.src = "image/dekopin/open_dekopinR.png";

const openDekopinL = new Image();
openDekopinL.src = "image/dekopin/open_dekopinL.png";

const closeDekopinR = new Image();
closeDekopinR.src = "image/dekopin/close_dekopinR.png";

const closeDekopinL = new Image();
closeDekopinL.src = "image/dekopin/close_dekopinL.png";

//手
const hands = [
  {
    name: "デフォルト",
    openR: openHandR,
    openL: openHandL,
    closeR: closeHandR,
    closeL: closeHandL
  },
  {
    name: "キツネ",
    openR: openFoxhandR,
    openL: openFoxhandL,
    closeR: closeFoxhandR,
    closeL: closeFoxhandL
  },
  {
    name: "デコピン",
    openR: openDekopinR,
    openL: openDekopinL,
    closeR: closeDekopinR,
    closeL: closeDekopinL
  }
];

//BGM
const BGM = new Audio("audio/know_own_mind.mp3");
BGM.volume = 0.5;

//画面サイズ
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

resize();
window.addEventListener("resize", resize);


//操作方法画面ボタンを押したら
let howPlayOpen = false;

const hatenaIcon = document.querySelector(".hatena");
hatenaIcon.src = icon1.src;

const hatenaBtn = document.querySelector(".btn1");
hatenaBtn.addEventListener("click", ()=>{

  if(menuOpen) return;

  howPlayOpen = !howPlayOpen;

  if(howPlayOpen){
    startBtn.style.display="none";
    hatenaBtn.classList.add("active");
    hatenaBtn.classList.add("noHover");
    menuBtn.classList.add("noHover");
  }else{
    startBtn.style.display="block";
    hatenaBtn.classList.remove("active");
    hatenaBtn.classList.remove("noHover");
    menuBtn.classList.remove("noHover");
  }
});


//手の選択画面ボタンを押したら
let menuOpen = false;

const menuIcon = document.querySelector(".menuicon");
menuIcon.src = menuHandopen.src;

const menuBtn = document.querySelector(".btn2");
menuBtn.addEventListener("click", ()=>{

  if(howPlayOpen) return;

  menuOpen = !menuOpen;

  if(menuOpen){
    startBtn.style.display="none";
    menuIcon.src = menuHandclose.src;
    menuBtn.classList.add("active");
    menuBtn.classList.add("noHover");
    hatenaBtn.classList.add("noHover");
  }else{
    startBtn.style.display="block";
    menuIcon.src = menuHandopen.src;
    menuBtn.classList.remove("active");
    menuBtn.classList.remove("noHover");
    hatenaBtn.classList.remove("noHover");
  }
});

canvas.addEventListener("click", ()=>{
  if(!menuOpen)return;

  if(hoverHand !== -1){
    selectedHand = hoverHand;
  }
});


// スタートボタン
const startBtn = document.querySelector(".start");
startBtn.addEventListener("click", ()=>{
  proc = 1;

  hx = -100;
  hy = -100;
  score = 0;
  items = [];
  time = 30;

  BGM.play();
  addItem();
  countdown();

  startBtn.style.display = "none";
});


//タイトルへ戻るボタン
const returnBtn = document.querySelector(".return");
returnBtn.addEventListener("click", ()=>{
  proc = 0;

  returnBtn.style.display = "none";
  startBtn.style.display = "block";

  BGM.currentTime = 0;
});


//マウス移動
let mx = 0;
let my = 0;

canvas.addEventListener("pointermove", e =>{
  mx = e.offsetX;
  my = e.offsetY;

  hoverHand = -1;

  if(!menuOpen) return;

  for(let i=0; i<xList.length; i++){

    const dx = mx - xList[i];
    const dy = my - (handY + size/2);

    if(
      mx > xList[i]-size/2 &&
      mx < xList[i]+size/2 &&
      my > handY &&
      my < handY+size
    ){
      hoverHand = i;
    }
  }
});


//アイテム
let items = [];
const ITEM_R = 15;

function drawItems() {
  ctx.fillStyle = "white";

    for (let item of items) {
      ctx.beginPath();
      ctx.arc(item.x, item.y, ITEM_R, 0, Math.PI * 2);
      ctx.fill();
    }
}


//アイテムを追加
function addItem() {
  if (proc !== 1) return;

    const x = Math.random() * (canvas.width - ITEM_R * 2) + ITEM_R;
    const y = Math.random() * (canvas.height -100 - ITEM_R * 2) + 100 + ITEM_R;

    items.push({ x, y });

    setTimeout(addItem, 1000);
}


//クリックでアイテムを取得
canvas.addEventListener("click", e =>{
  if (proc !== 1) return;

    const x = e.offsetX;
    const y = e.offsetY;

    for (let i = 0; i < items.length; i++) {
      const dx = items[i].x - x;
      const dy = items[i].y - y;

      if (dx * dx + dy * dy < ITEM_R * ITEM_R) {
        items.splice(i, 1);
        score++;
        break;
      }
    }
});


//スコア
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Quantico";
  ctx.textAlign = "center";

  ctx.fillText(`Score: ${score}`, canvas.width / 2, 80);
}


//カウントダウン
function countdown() {
  if (proc !== 1) return;

  time--;

  if (time <= 0) {
    proc = 3; // クリア
    BGM.pause()
  }

 setTimeout(countdown, 1000);
}

//手
function drawHand() {

const currentHand = hands[selectedHand];

  let img;

  if (mx < hx) {
    img = handOpen ? currentHand.openL : currentHand.closeL;
  } else {
    img = handOpen ? currentHand.openR : currentHand.closeR;
  }
  const scale = 2; //手の大きさ変えられる

  const w = img.width * scale;
  const h = img.height * scale;

  ctx.drawImage(img, hx - w / 2, hy - h / 2, w, h);
}

//残り時間
function drawTimeBar() {
  const padding = 20;
  const barWidth = canvas.width - padding * 2;
  const barHeight = 20;

  const x = padding;
  const y = 20;

  const ratio = Math.max(0, time / 30);

  // 枠
  ctx.strokeStyle = "white";
  ctx.strokeRect(x, y, barWidth, barHeight);

  // 中身
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, barWidth * ratio, barHeight);
}

// ゲームオーバー
function checkHit() {
  const dx = hx - mx;
  const dy = hy - my;

  if (dx * dx + dy * dy < 110 * 110) {
    proc = 2;
    BGM.pause();
  }
}

//タイトル
function drawTitle() {
  if(!menuOpen && !howPlayOpen){

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "75px Quantico";
    ctx.fillText("Escape from hand", canvas.width / 2, canvas.height / 2);

    ctx.font="30px Quantico";
    ctx.fillText("Don't get caught, collect it", canvas.width / 2, canvas.height / 2 + 75);

    ctx.font = "23px DotGothic16";
    ctx.fillText("捕まらないで、それを集めて", canvas.width / 2, canvas.height / 2 + 115);
  };

  returnBtn.style.display = "none";
};

  let boxW = 900;
  let boxH = 500;

  let boxX = (canvas.width - boxW) / 2;
  let boxY = (canvas.height - boxH) / 2;


//操作方法を確認する
function rule() {
  if(!howPlayOpen)return;

  //背景と枠
  ctx.fillStyle="#000";
  ctx.fillRect(boxX, boxY, boxW, boxH);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  //テキスト
  ctx.fillStyle = "#fff";
  ctx.font = "35px Quantico"
  ctx.fillText("About this game", canvas.width/2, boxY+80);
  ctx.font="20px DotGothic16";
  ctx.fillText("このゲームについて", canvas.width/2, boxY+115);
  
  ctx.font = "35px DotGothic16"
  ctx.fillText("準備中…", canvas.width/2, canvas.height/2);
};


//手の形を選ぶ
function handShape() {
  if(!menuOpen)return;

    //背景と枠
    ctx.fillStyle="#000";
    ctx.fillRect(boxX, boxY, boxW, boxH);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    //メニュータイトルテキスト
    ctx.textAlign = "center";
    ctx.fillStyle="#fff";
    ctx.font="35px Quantico";
    ctx.fillText("Change Hand ?", canvas.width/2, boxY+80);

    ctx.font="20px DotGothic16";
    ctx.fillText("手の形を変更できます", canvas.width/2, boxY+115);


    handY = boxY+180;

    xList = [
      canvas.width/2-250,
      canvas.width/2,
      canvas.width/2+250
    ];

    for(let i=0;i<hands.length;i++){
      let img;
      
      if(handOpen){
        img = hands[i].openR;
      }else{
        img = hands[i].closeR;
      }

      ctx.drawImage(img, xList[i]-size/2, handY, size, size);

      if(i === selectedHand){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        // 外側
        ctx.strokeRect(xList[i]-size/2-15, handY-15, size+30, size+30);
        // 内側
        ctx.strokeRect(xList[i]-size/2-8, handY-8, size+16, size+16);
      }else if(i === hoverHand){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(xList[i]-size/2-10, handY-10, size+20, size+20);};
        
        ctx.font="25px DotGothic16";
        ctx.fillText(hands[i].name, xList[i], handY+size+50);
    };
  };

//ゲームプレイ
function drawGame() {
  returnBtn.style.display = "none";

  // 手を動かす
  if (hx < mx) hx += 3;
  if (mx < hx) hx -= 3;
  if (hy < my) hy += 3;
  if (my < hy) hy -= 3;

  //アイテムを描く
  drawItems();

  //手を描く
  drawHand();

  //当たり判定
  checkHit();

  drawScore();
  drawTimeBar();
};

//ゲームオーバー
function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.font = "60px Quantico";
  ctx.fillText("Caught!", canvas.width / 2, canvas.height / 2);

  returnBtn.style.display = "block";
}

//ゲームクリア
function drawClear() {
  ctx.fillStyle = "gold";
  ctx.textAlign = "center";
  ctx.font = "60px Quantico";
  ctx.fillText("Great!", canvas.width / 2, canvas.height / 2 - 40);

  ctx.fillStyle = "white";
  ctx.font = "25px Quantico";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);

  returnBtn.style.display = "block";
}

//メイン
function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (proc === 0) {
    rule();
    handShape();
    drawTitle();
  } else if (proc === 1) {
    drawGame();
  } else if (proc === 2) {
    drawGameOver();
  }
  else if (proc === 3) {
    drawClear();
  }

  if(proc === 0){
    menuBtn.style.display = "block";
    hatenaBtn.style.display = "block";
  }else{
    menuBtn.style.display = "none";
    hatenaBtn.style.display = "none";
  }

  requestAnimationFrame(main);//一秒間に(ディスプレイのフレームレートによって変わる)回実行される
};

function switchHand() {
  handOpen = !handOpen;
  setTimeout(switchHand, 500);
}

switchHand();

main();
