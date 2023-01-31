'use strict';
//
//misc.js その他、共通関数
//

//星クラス
class Star{
    constructor(){
        this.x = rand(0, FIELD_W) <<8;
        this.y = rand(0, FIELD_H) <<8;
        this.vecx = 0;
        this.vecy = rand(30, 200);
        this.size = rand(1,2);
    }

    //描画
    draw(){
        let x = this.x>>8;
        let y = this.y>>8;

        if(( x < camera_x || camera_x+SCREEN_W <= x) ||
         ( y < camera_y || camera_y+SCREEN_H <= y)) return

        vCont.fillStyle = rand(0,2)!=0?"#66f":"#aef";
        vCont.fillRect(this.x>>8, this.y>>8, this.size, this.size);
    }

    //更新
    update(){
        this.x += this.vecx;
        this.y += this.vecy;
        if(this.y > FIELD_H<<8){
            this.y = 0;
            this.x = rand(0, FIELD_W)<<8;
        }
    }
}

//キャラクターのベースクラス
class CharaBase{
    constructor( snum, x, y, vecx, vecy){
        this.snum = snum;
        this.x = x;
        this.y = y;
        this.vecx = vecx;
        this.vecy = vecy;
        this.kill = false;
        this.count = 0;
    }

    update(){
        this.count++;

        this.x += this.vecx;
        this.y += this.vecy;

        if(this.x < 0 || FIELD_W<<8 <= this.x ||
            this.y < 0 || FIELD_H<<8 <= this.y) this.kill = true; 
    }

    draw(){
         drawSprite( this.snum, this.x, this.y )
    }
}

//爆発のクラス
class Explos extends CharaBase{
    constructor( snum, x, y, vecx, vecy ){
        super( snum, x, y, vecx, vecy );
    }

    draw(){
        this.snum = 16 +(this.count>>2);
        if(this.snum == 27){
            this.kill = true;
            return;
        }
        super.draw();
    }
}

//キーが押されたとき
document.addEventListener('keydown', function(e){
    key[ e.code ] = true;
});
//キーが離されたとき
document.addEventListener('keyup', function(e){
    key[ e.code ] = false;
});

//スプライトを描画する
function drawSprite( snum, x, y ){
    let sx = sprite[snum].x;
    let sy = sprite[snum].y;
    let sw = sprite[snum].w;
    let sh = sprite[snum].h;

    let px = (x>>8) - sw/2;
    let py = (y>>8) - sh/2;

    if(( px+sw < camera_x || camera_x+SCREEN_W <= px) ||
         ( py+sh < camera_y || camera_y+SCREEN_H <= py)) return

    vCont.drawImage( spritImag, sx, sy, sw, sh, px, py, sw, sh );
}

//ランダム整数を作る
function rand(min, max){
    return Math.floor( Math.random()*(max-min+1) ) + min;
}

//当たり判定
function checkHit(x1, y1, r1, x2, y2, r2){
    //矩形同士の当たり判定
    /*
    let left1 = x1>>8;
    let right1 = left1+w1;
    let top1 = y1>>8;
    let bottom1 = top1+h1;

    let left2 = x2>>8;
    let right2 = left2+w2;
    let top2 = y2>>8;
    let bottom2 = top2+h2;

    return (left1 <= right2 && left2 <= right1 && 
        top1 <= bottom2 && top2 <= bottom1);
    */

    //円同士の当たり判定
    return (((x1-x2)>>8)**2 + ((y1-y2)>>8)**2 <=  (r1+r2)**2 );

}