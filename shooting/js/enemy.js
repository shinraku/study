'use strict';
//
//enemy.js 敵関連
//

//敵弾クラス
class EneBullet extends CharaBase{
    constructor( snum, x, y, vecx, vecy ){
        super( snum, x, y, vecx, vecy );
        this.r = 4
        
    }

    update(){
        super.update();

        if (!own.damage && checkHit( 
            this.x, this.y, this.r,
            own.x, own.y, own.r  
        )){
            this.kill = true;
            own.damage = 10;
        }
    }
}

//敵のクラス
class Enemy extends CharaBase{
    constructor( snum, x, y, vecx, vecy ){
        super( snum, x, y, vecx, vecy );
        this.flag = false;
        // this.w = 20;
        // this.h = 20;
        this.r = 10;
    }

    update(){
        super.update();
        if(!this.flag){
            if(own.x < this.x && -280 < this.vecx) this.vecx -= 8;
            else if(this.x < own.x && this.vecx < 280) this.vecx += 8;
        }
        else{
            if(own.x < this.x && this.vecx < 280) this.vecx += 8;
            else if(this.x < own.x && -280 < this.vecx) this.vecx -= 8;
        }
        

        if(Math.abs(own.y - this.y) < 100<<8 && !this.flag){
            this.flag = true;
            let angle, dx, dy;
            angle = Math.atan2(own.y - this.y, own.x - this.x);
            dx = Math.cos(angle)*1000
            dy = Math.sin(angle)*1000

            enebul.push(new EneBullet(15, this.x, this.y, dx, dy))
        }

        if(this.flag && this.vecy > -800) this.vecy -= 30;

        if (!own.damage && checkHit( 
            this.x, this.y, this.r,
            own.x, own.y, own.r  
        )){
            this.kill = true;
            own.damage = 10;
        }
    }

    draw(){
        super.draw();
    }
}