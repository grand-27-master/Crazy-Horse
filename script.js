alert('Press spacebar to shoot and arrow keys to move')

window.addEventListener('load',()=>{
    const canvas=document.getElementById('canvas')

    // returns a drawing context on the canvas
    const ctx=canvas.getContext('2d');
    canvas.width=1505;
    canvas.height=500;

    // move player using keyboard
    class Inputhandler{
        constructor(game)
        {
            this.game=game;
            window.addEventListener('keydown',(e)=>{
                if((e.key=='ArrowUp' || e.key=='ArrowDown' || e.key=='ArrowLeft' || e.key=='ArrowRight') && this.game.keys.indexOf(e.key)==-1)
                {
                    this.game.keys.push(e.key);
                }
                else if(e.key==' ')
                {
                    this.game.player.shoot();
                }
                // console.log(this.game.keys);
            })

            window.addEventListener('keyup',(e)=>{
                if(this.game.keys.indexOf(e.key)>-1)
                {
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                }
                // console.log(this.game.keys);
            })
        }
    }

    class Projectile{
        constructor(game,x,y)
        {
            this.game=game;
            this.x=x;
            this.y=y;
            this.width=20;
            this.height=20;
            this.speed=5;
            this.deleteProjectile=false;
            this.projectileImage=document.getElementById('shoot');
        }
        update()
        {
            this.x+=this.speed;
            if(this.x>(this.game.width*0.9))
            this.deleteProjectile=true;
        }
        draw(context)
        {
            // context.fillStyle='yellow';
            // // context.fillRect(this.x,this.y,20,10);
            // context.beginPath();
            // context.arc(this.x,this.y,10,0,Math.PI*2);
            // context.fill();

            context.drawImage(this.projectileImage,this.x,this.y,this.width,this.height);
        }
    }

    class Particle{
        constructor(game,x,y)
        {
            this.game=game;
            this.x=x;
            this.y=y;
            this.gearProp=document.getElementById('gear');
            this.frameX=Math.floor(Math.random()*3);
            this.frameY=Math.floor(Math.random()*3);
            this.size=50;
            this.deleteParticle=false;
            this.speedX=Math.random()*-1.5-0.5;
            this.speedY=Math.random()*-1.5-0.5;
            this.gravity=0.5;
        }

        update()
        {
           this.x-=this.speedX;
           this.y+=this.speedY;
           this.speedY+=this.gravity;
        }

        draw(context)
        {
            context.drawImage(this.gearProp,this.frameX*this.size,this.frameY*this.size,this.size,this.size,this.x,this.y,this.size,this.size);
        }
    }

    class Player{
        constructor(game)
        {
            // player properties
            this.game=game;
            this.width=120;
            this.height=190;
            this.x=20;
            this.y=100;
            this.speedY=0;
            this.speedX=0;
            this.maxSpeed=5;
            this.projectiles=[];
            this.playerImage=document.getElementById('p');
            this.deletePlayer=false;

            // image frames
            this.frameX=0;
            this.frameY=0;
            this.maxFrame=35;
        }

        update()
        {
            // update speed of player
            if(this.game.keys.includes('ArrowUp'))
            {
                this.speedY=-this.maxSpeed;
            }
            else if(this.game.keys.includes('ArrowDown'))
            {
                this.speedY=this.maxSpeed;
            }
            else if(this.game.keys.includes('ArrowLeft'))
            {
                this.speedX=-this.maxSpeed;
            }
            else if(this.game.keys.includes('ArrowRight'))
            {
                this.speedX=this.maxSpeed;
            }
            else
            {
                this.speedY=0;
                this.speedX=0;
            }
            this.y+=this.speedY;
            this.x+=this.speedX;

            // handle projectiles
            this.projectiles.forEach(p=>{
                p.update();
            })

            // filter creates new array with elements that pass test implemented by function 
            this.projectiles=this.projectiles.filter(p=>!p.deleteProjectile);

            this.x+=this.speedX;
            if(this.x+this.width<0){
            this.deletePlayer=true;
            alert('Game Over!');
            }
        }

        draw(context)
        {
            // context.fillStyle='black';
            // context.fillRect(this.x,this.y,this.width,this.height)
            context.drawImage(this.playerImage,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
            this.projectiles.forEach(p=>{
                p.draw(context);
            })

            // player image animation
            if(this.frameX<this.maxFrame)
            this.frameX++;
            else
            this.frameX=0;
        }

        shoot()
        {
           if(this.game.ammo>0)
           {
            this.projectiles.push(new Projectile(this.game,this.x+100,this.y+20));
            // console.log(this.projectiles);
            this.game.ammo--;
           }
        }
    }

    class Enemy{
        constructor(game)
        {
           this.game=game;
           this.x=this.game.width;
           this.speedX=Math.random()*-1.5-0.5;
           this.deleteEnemy=false;
           this.lives=Math.floor(Math.random()*100+1);
           this.score=this.lives;

            // image frames
            this.frameX=0;
            this.frameY=0;
            this.maxFrame=37;
        }

        update()
        {
            this.x+=this.speedX;
            if(this.x+this.width<0)
            this.deleteEnemy=true;

             // enemy image animation
             if(this.frameX<this.maxFrame)
             this.frameX++;
             else
             this.frameX=0;
        }

        draw(context)
        {
            // context.fillStyle='red';
            // context.fillRect(this.x,this.y,this.width,this.height);
            context.drawImage(this.enemyImage,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
            context.fillStyle='white';
            context.font='20px Arial';
            context.fillText(this.lives,this.x+this.width/2,this.y+this.height/2);
        }
    }

    class Enemy1 extends Enemy{
        constructor(game)
        {
            // calls parent constructor
            super(game);
            this.width=228;
            this.height=169;
            this.y=Math.random()*((this.game.height*0.9)-(this.height));
            this.enemyImage=document.getElementById('e');
            this.frameY=Math.floor(Math.random()*3);
        }
    }

    // class Background{

    // }

    class Explosion
    {
        constructor(game,x,y)
        {
            this.game=game;
            this.x=x;
            this.y=y;
            this.frameX=0;
            this.height=200;
            this.deleteExplosion=false;
        }

        update(time)
        {
            this.frameX++;
        }

        draw(context)
        {
            context.drawImage(this.image,this.x,this.y)
        }
    }

    class Explosion1 extends Explosion{
        constructor(game,x,y)
        {
            super(game,x,y);
            this.fireImage=document.getElementById('fire');
            this.width=200;
            this.w=this.width;
            this.h=this.height;
            this.x=x-this.w/2;
            this.y=y-this.h/2;
        }
    }

    class Explosion2 extends Explosion{
        constructor(game,x,y)
        {
            super(game,x,y);
            this.smokeImage=document.getElementById('smoke');
            this.width=200;
            this.w=this.width;
            this.h=this.height;
            this.x=x-this.w/2;
            this.y=y-this.h/2;
        }
    }   

    class UI{
        constructor(game)
        {
            this.game=game;
        }
        draw(context)
        {
            //score
            context.fillStyle='white';
            context.font='25px Bangers';
            context.fillText('Score : '+this.game.score,20,40);
            // ammo
            // context.fillStyle='white';
            for(var i=0;i<this.game.ammo;i++)
            {
                context.fillRect(20+5*i,50,3.5,20);
            }

            // game over messages
            if(this.game.gameOver)
            {
                if(this.game.score>=this.game.winningScore)
                {
                    // context.fillText('You won!',this.game.width/2-100,this.game.height/2);
                    // windows.clearRect(0,0,this.game.width,this.game.height);
                    document.body.innerHTML = "<h1>YOU WON!</h1>";
                    document.body.style.color = "white";
                    document.body.style.fontFamily = "Bangers";
                    document.body.compareDocumentPosition = "center";
                }
            }
        } 
    }

    class Game{
        constructor(width,height)
        {
            this.width=width;
            this.height=height;
            this.player=new Player(this);
            this.input=new Inputhandler(this);
            this.keys=[];
            this.projectile=new Projectile(this);
            this.ammo=0;
            this.Maxammo=30;
            this.ammointerval=200;
            this.ammotimer=0;
            this.ui=new UI(this);       
            this.ui=new UI(this);
            this.enemies=[];
            this.particles=[];
            this.explosions=[];
            this.enemyinterval=1000;
            this.enemytimer=0;
            this.gameOver=false;
            // this.enemy1=new Enemy1(this);
            this.score=0;
            this.winningScore=1000;
            // this.scoreinterval=1000;
            // this.scoretimer=0;
        }

        update(time)
        {
            this.player.update();
            if(this.ammointerval>this.ammotimer)
            {
                this.ammotimer+=time;
            }
            else
            {
                if(this.ammo<this.Maxammo)
                {
                    // load ammo
                    this.ammo++;
                }
                this.ammotimer=0;
            }

            this.particles.forEach(particle=>{
                particle.update();
            })

            this.particles=this.particles.filter(particle=>!particle.deleteParticle);

            this.explosions.forEach(explosion=>{
                explosion.update();
            })

            this.explosions=this.explosions.filter(explosion=>!explosion.deleteExplosion);

            this.enemies.forEach(enemy=>{
                enemy.update();

                if(this.detectCollision(this.player,enemy))
                {
                    // console.log('collision detected');
                    // enemy.deleteEnemy=true;
                    player.deletePlayer=true;
                    this.addExplosion(enemy);
                    for(var i=0;i<10;i++)
                    {
                        this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
                    }
                }

                this.player.projectiles.forEach(p=>{
                    // p.update();
                    if(this.detectCollision(p,enemy))
                    {
                        var enemyAudio=new Audio('./Sounds/dead.mp3');
                        enemyAudio.play();
                        enemy.deleteEnemy=true;
                        this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
                        this.addExplosion(enemy);
                        // console.log('collision detected');
                        // if(enemy.lives<=0)
                        // {
                           // enemy.deleteEnemy=true;
                            this.score+=enemy.score;
                            enemy.lives--;

                            if(this.score>this.winningScore)
                            {
                                this.gameOver=true;
                            }
                    }
                })
            })

            this.enemies=this.enemies.filter(enemy=>!enemy.deleteEnemy);

            if(this.enemyinterval>this.enemytimer)
            {
                this.enemytimer+=time;
            }
            else
            {
                this.addEnemy();
                this.enemytimer=0;
            }
        }

        draw(context)
        {
            this.player.draw(context);
            this.ui.draw(context);
            // this.particles.forEach(particle=>{
            //     particle.draw(context);
            // })
          
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
                // console.log(enemy);
            })
            // this.explosions.forEach(explosion=>{
            //     explosion.draw(context);
            // })
        }

        addEnemy()
        {
            this.enemies.push(new Enemy1(this));
            // console.log(this.enemies);
        }

        addExplosion(enemy)
        {
            const random=Math.random();
            if(random<1){
            this.explosions.push(new Explosion2(this,enemy.x,enemy.y));
            this.explosions.push(new Explosion1(this,enemy.x,enemy.y));
            }
        }

        // p1 is player and p2 is enemy
        detectCollision(p1,p2)
        {
            if(p1.x+p1.width>p2.x && p1.x<p2.x+p2.width && p1.y+p1.height>p2.y && p1.y<p2.y+p2.height)
            {
                return true;
            }
        }
    }

    const game=new Game(canvas.width,canvas.height);

    // creates animation loop
    var prevTime=0;
    function animate(timeStamp)
    {
        const time=(timeStamp-prevTime);
        // previous loop's time will become current loop's time
        prevTime=timeStamp;
        // console.log(time);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(time);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
})