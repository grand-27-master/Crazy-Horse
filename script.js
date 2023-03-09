window.addEventListener('load',()=>{
    const canvas=document.getElementById('canvas')
    // returns a drawing context on the canvas
    const ctx=canvas.getContext('2d');
    canvas.width=1500;
    canvas.height=500;

    // move player using keyboard
    class Inputhandler{
        constructor(game)
        {
            this.game=game;
            window.addEventListener('keydown',(e)=>{
                if((e.key=='ArrowUp' || e.key=='ArrowDown') && this.game.keys.indexOf(e.key)==-1)
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
        }
        update()
        {
            this.x+=this.speed;
            if(this.x>(this.game.width*0.9))
            this.deleteProjectile=true;
        }
        draw(context)
        {
            context.fillStyle='yellow';
            context.fillRect(this.x,this.y,this.width,this.height);   
        }
    }

    class Particle{

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
            // this.speedX=0;
            this.maxSpeed=5;
            this.projectiles=[];
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
            // else if(this.game.keys.includes('ArrowLeft'))
            // {
            //     this.speedX=-this.maxSpeed;
            // }
            // else if(this.game.keys.includes('ArrowRight'))
            // {
            //     this.speedX=this.maxSpeed;
            // }
            else
            {
                this.speedY=0;
                // this.speedX=0;
            }
            this.y+=this.speedY;
            // this.x+=this.speedX;

            // handle projectiles
            this.projectiles.forEach(p=>{
                p.update();
            })

            // filter creates new array with elements that pass test implemented by function 
            this.projectiles=this.projectiles.filter(p=>!p.deleteProjectile);
        }

        draw(context)
        {
            context.fillStyle='black';
            context.fillRect(this.x,this.y,this.width,this.height)
            this.projectiles.forEach(p=>{
                p.draw(context);
            })
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
           this.lives=10;
           this.score=this.lives;
        }

        update()
        {
            this.x+=this.speedX;
            if(this.x+this.width<0)
            this.deleteEnemy=true;
        }

        draw(context)
        {
            context.fillStyle='red';
            context.fillRect(this.x,this.y,this.width,this.height);
            context.fillStyle='black';
            context.font='20px Arial';
            context.fillText(this.lives,this.x+this.width/2,this.y+this.height/2);
        }
    }

    class Enemy1 extends Enemy{
        constructor(game)
        {
            // calls parent constructor
            super(game);
            this.width=228*0.2;
            this.height=169*0.2;
            this.y=Math.random()*((this.game.height*0.9)-(this.height));
        }
    }

    class Layer{

    }

    class Background{

    }

    class UI{
        constructor(game)
        {
            this.game=game;

        }
        draw(context)
        {
            context.fillStyle='white';
            for(var i=0;i<this.game.ammo;i++)
            {
                context.fillRect(20+5*i,50,3,20);
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
            this.enemies=[];
            this.enemyinterval=1000;
            this.enemytimer=0;
            // this.gameOver=false;
            // this.enemy1=new Enemy1(this);
            this.score=0;
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
                    this.ammo++;
                }
                this.ammotimer=0;
            }

            this.enemies.forEach(enemy=>{
                enemy.update();

                if(this.detectCollision(this.player,enemy))
                {
                    // console.log('collision detected');
                    enemy.deleteEnemy=true;
                    // this.player.deleteEnemy=true;
                }

                this.player.projectiles.forEach(p=>{
                    // p.update();
                    if(this.detectCollision(p,enemy))
                    {
                        enemy.deleteEnemy=true;
                        // console.log('collision detected');
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
            this.enemies.forEach(enemy=>{
                enemy.draw(context);
                // console.log(enemy);
            })
        }

        addEnemy()
        {
            this.enemies.push(new Enemy1(this));
            // console.log(this.enemies);
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