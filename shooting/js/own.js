'use strict';

//
//own.js 自機関連
//

//自機クラス
class Own{
    constructor(){
        this.x = (FIELD_W/2)<<8;
        this.y = (FIELD_H/2)<<8; 
        this.anime = 0;
        this.speed = 1024;
        this.reload = 0;
        this.relo2 = 0;
        this.r = 10;
        this.damage = 0;
    }

    //移動
    update(){
        if(this.damage) this.damage--;

        if(key["Space"] && this.reload == 0){
            bullet.push( new Bullet(this.x, this.y, 0, -2000) )
            bullet.push( new Bullet(this.x+(8<<8), this.y-(4<<8), 60, -2000) )
            bullet.push( new Bullet(this.x-(8<<8), this.y-(4<<8), -60, -2000) )
            bullet.push( new Bullet(this.x+(12<<8), this.y-(4<<8), 150, -2000) )
            bullet.push( new Bullet(this.x-(12<<8), this.y-(4<<8), -150, -2000) )

            this.reload = 5;
            if(++this.relo2 == 5){
                this.reload = 20;
                this.relo2 = 0;
            }
        }
        if(!key["Space"]) this.reload = this.relo2 = 0;

        if( 0 < this.reload ) this.reload--;

        if(key["ArrowLeft"] && this.speed < this.x){
            this.x -= this.speed;
            if(-8 < this.anime) this.anime--;
        }
        if(key["ArrowRight"] && this.x <= (FIELD_W<<8)-this.speed){
            this.x += this.speed;
            if(this.anime < 8) this.anime++;
        }
        if(!key["ArrowLeft"] && !key["ArrowRight"]){
            if(this.anime < 0) this.anime++;
            if(0 < this.anime) this.anime--; 
        }

        if(key["ArrowUp"] && this.speed < this.y) this.y -= this.speed;
        if(key["ArrowDown"] && this.y <= (FIELD_H<<8)-this.speed) this.y += this.speed;

    }

    //描画
    draw(){
        drawSprite( 2 + (this.anime>>2), this.x, this.y )
    }
}

//弾のクラス
class Bullet extends CharaBase{
    constructor( x, y, vecx, vecy ){
        super( 5, x, y, vecx, vecy );
        // this.w = 4;
        // this.h = 6;
        this.r = 4;
    }

    update(){
        super.update();

        for(let i=0;i<enemy.length;i++){
            if( !enemy[i].kill ){
                if (checkHit( 
                    this.x, this.y, this.r,
                    enemy[i].x, enemy[i].y, enemy[i].r  
                )){
                    enemy[i].kill = true;
                    this.kill = true;
                    
                    explos.push(new Explos( 20, enemy[i].x, enemy[i].y, enemy[i].vecx>>3, enemy[i].vecy>>3 ));

                    break;
                }
            }
        }
    }

    draw(){
        super.draw();
    }
}