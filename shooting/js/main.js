'use strict';
//デバッグのフラグ
const DEBUG=true;

let drawCount = 0;
let fps = 0;
let lastTime = Date.now();

//スムージング
const SMOOTHING = false;

//画面サイズ
const SCREEN_W = 320;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W*2;
const CANVAS_H = SCREEN_H*2;

//フィールドサイズ
const FIELD_W = SCREEN_W+120;
const FIELD_H = SCREEN_H+40;

//キャンバス
let canvas = document.getElementById("can");
let cont = canvas.getContext("2d");
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

cont.mozimageSmoothingEnabled =  SMOOTHING;
cont.webkitimageSmoothingEnabled = SMOOTHING;
cont.msimageSmoothingEnabled = SMOOTHING;
cont.imageSmoothingEnabled = SMOOTHING;

//カメラ座標
let camera_x = 0;
let camera_y = 0;

//フィールド(仮想画面)
let vCanvas = document.createElement("canvas");
let vCont = vCanvas.getContext("2d");
vCanvas.width = FIELD_W;
vCanvas.height = FIELD_H;

//星の数
const STAR_MAX = 300;

//星の実体
let star = [];

//ゲームスピード(ms)
const GAME_SPEED = 1000/60;

//キーボードの状態
let key = [];

//オブジェクトたち
let own = new Own();
let enemy = [];
let bullet = [];
let enebul = [];
let explos = [];

//自機画像
let spritImag = new Image();
spritImag.src = "sprite.png";

//ゲーム初期化
function gameInit(){
    for(let i=0;i<STAR_MAX;i++)star[i] = new Star();
}

//ゲームのフレーム呼び出し
setInterval( gameLoop, GAME_SPEED );

//オブジェクトのアップデート
function updateObj( obj ){
    for(let i=obj.length-1;i>=0;i--){
        obj[i].update();
        if(obj[i].kill) obj.splice( i, 1 );
    }
}

//オブジェクトの描画
function drawObj( obj ){
    for(let i=0;i<obj.length;i++) obj[i].draw();
}

//移動の処理
function updateAll(){
    for(let i=0;i<STAR_MAX;i++)star[i].update();
    updateObj(bullet);
    updateObj(enebul);
    updateObj(enemy);
    own.update();
    updateObj(explos);
}

//描画の処理
function drawAll(){
    vCont.fillStyle=(own.damage)?"red": "black";
    vCont.fillRect(camera_x, camera_y, SCREEN_W, SCREEN_H);

    drawObj(star);
    drawObj(bullet);
    own.draw();
    drawObj(enebul)
    drawObj(enemy);
    drawObj(explos);

    //自機の範囲(0 ~ FIELD_W)
    //カメラの範囲(0 ~ FIELD_W - SCREEN_W)
    camera_x = (own.x>>8)/FIELD_W * (FIELD_W - SCREEN_W);
    camera_y = (own.y>>8)/FIELD_H * (FIELD_H - SCREEN_H);

    //仮想画面からキャンバスに描画
    cont.drawImage( vCanvas, camera_x, camera_y, SCREEN_W, SCREEN_H,  
        0, 0, CANVAS_W, CANVAS_H);
}

//デバッグ情報の表示
function putInfo(){
    if(DEBUG){
        drawCount++;
        if(lastTime + 1000 <= Date.now()){
            fps = drawCount;
            drawCount = 0;
            lastTime = Date.now();
        }

        cont.font="20px 'Impact'";
        cont.fillStyle="white";
        cont.fillText("fps:" + fps, 20, 20);
        cont.fillText("bullet:" + bullet.length, 20, 40);//Tama:100みたいな
        cont.fillText("enemy:" + enemy.length, 20, 60);
        cont.fillText("enemy bullet:" + enebul.length, 20, 80);
    }
}

//各フレームの処理
function gameLoop(){
    
    if(rand(1,30) == 1){
        enemy.push( new Enemy( 39, rand(0, FIELD_W)<<8, 0, 0, rand(300, 1200)))
    }

    updateAll();
    drawAll();
    putInfo();
}

//オンロード時に初期化
window.onload = function(){
    gameInit();
}
console.log('Hello World' + 'from main.js!');