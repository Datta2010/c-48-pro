var bg, bgImg;
var backgroundImg,bgImg2;
var bottomGround
var topGround
var spaceShip,spaceShipImg;
var obstacleTop, obsTop1, obsTop2
var obstacleBottom, obsBottom1, obsBottom2, obsBottom3

var score=0;

var PLAY=1;
var END=0;
var gameState=PLAY;

function preload(){
bgImg = loadImage("bg.png")
bgImg2 = loadImage('bgImg2.jpg');

spaceShipImg = loadAnimation("spaceship.png")

obsTop1 = loadImage("ufo.png")
obsTop2 = loadImage("ufo.png")

obsBottom1 = loadImage("alienSpaceShip.png")
obsBottom2 = loadImage("alienSpaceShip.png")
obsBottom3 = loadImage("alienSpaceShip.png")

gameOverImg = loadImage('gameOver.png');
restartImg=loadImage('restart.png');

jumpSound=loadSound('jump.mp3');
    dieSound=loadSound('die.mp3');

}

function setup(){

  createCanvas(500,500)
//background image
bg = createSprite(700,400);
bg.addImage(bgImg);
bg.scale = 0.5


//creating top and bottom grounds
bottomGround = createSprite(200,390,800,20);
bottomGround.visible = false;

topGround = createSprite(200,10,800,20);
topGround.visible = false;
      
//creating balloon     
spaceShip = createSprite(100,200,20,50);
spaceShip.addAnimation("spaceShip",spaceShipImg);
spaceShip.scale = 0.1;
spaceShip.rotation=90;



topObstaclesGroup= new Group();
bottomObstaclesGroup= new Group();
barGroup= new Group();

gameOver = createSprite(220,200);
        restart = createSprite(220,240);
        gameOver.addImage(gameOverImg);
        gameOver.scale=0.5;
        restart.addImage(restartImg);
        restart.scale=0.5;
        gameOver.visible=false;
        restart.visible=false;
}

function draw() {
  
  background("black");

  

  if(gameState === PLAY){

    //making the hot air balloon jump
    if(keyDown("w")) {
      spaceShip.velocityY = -6 ;
      jumpSound.play();
    }

    if(keyDown("s")) {
      spaceShip.velocityY = 6 ;
      jumpSound.play();
    }

    
    Bar();

    //spawning top and bottom obstacles
    spawnObstaclesTop();
    spawnObstaclesBottom();

//condition for END state
if(topObstaclesGroup.isTouching(spaceShip)  || bottomObstaclesGroup.isTouching(spaceShip)){

gameState = END;
dieSound.play();
}
  }

  if(gameState === END) 
    {
          gameOver.visible = true;
          gameOver.depth = gameOver.depth+1
          restart.visible = true;
          restart.depth = restart.depth+1
          
          //all sprites should stop moving in the END state
          
          topObstaclesGroup.setVelocityXEach(0);
          bottomObstaclesGroup.setVelocityXEach(0);
          barGroup.setVelocityXEach(0);
  
          //setting -1 lifetime so that obstacles don't disappear in the END state
          topObstaclesGroup.setLifetimeEach(-1);
          bottomObstaclesGroup.setLifetimeEach(-1);
         
          spaceShip.y = 200;
          
          //resetting the game
          if(mousePressedOver(restart)) 
          {
                reset();
          }

    } 

    drawSprites();
    Score();     
}

function reset(){
gameState=PLAY;
gameOver.visible=false;
restart.visible=false;
topObstaclesGroup.destroyEach();
bottomObstaclesGroup.destroyEach();
score=0;
}


function spawnObstaclesTop() 
{
      if(World.frameCount % 60 === 0) {
        obstacleTop = createSprite(600,300,40,50);
    
    //obstacleTop.addImage(obsTop1);
    
    obstacleTop.scale = 0.1;
    obstacleTop.velocityX = -4;

    //random y positions for top obstacles
    obstacleTop.y = Math.round(random(100,1));

    //generate random top obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacleTop.addImage(obsTop1);
              break;
      case 2: obstacleTop.addImage(obsTop2);
              break;
      default: break;
    }

     //assign lifetime to the variable
   obstacleTop.lifetime = 100;
    
   spaceShip.depth = spaceShip.depth + 1;
   
   topObstaclesGroup.add(obstacleTop);
      }
}

function spawnObstaclesBottom() 
{
      if(World.frameCount % 60 === 0) {
        obstacleBottom = createSprite(200,400,40,50);
    
    obstacleBottom.addImage(obsBottom1);
    obstacleBottom.debug=true

    
    obstacleBottom.scale = 0.2;
    obstacleBottom.velocityX = -4;
    
    

   //generate random bottom obstacles
    var rand = Math.round(random(1,100));
    switch(rand) {
      case 1: obstacleBottom.addImage(obsBottom1);
              break;
      case 2: obstacleBottom.addImage(obsBottom2);
              break;
      case 3: obstacleBottom.addImage(obsBottom3);
              break;
      default: break;
    }

     //assign lifetime to the variable
   obstacleBottom.lifetime = 100;
    
   spaceShip.depth = spaceShip.depth + 1;

   bottomObstaclesGroup.add(obstacleBottom);

   bottomObstaclesGroup.add(obstacleBottom);
   
      }
}

 function Bar() 
 {
         if(World.frameCount % 60 === 0)
         {
           var bar = createSprite(400,200,10,800);
          bar.velocityX = -6
          bar.depth = spaceShip.depth;
          bar.lifetime = 70;
          bar.visible = false;
          barGroup.add(bar);
         }
}

function Score(){
  if(spaceShip.isTouching(barGroup)){
    score=score+1;

  }
textFont('algerian');
textSize(30);
fill('yellow');
text('score: '+ score,250,50);
  
}

async function getBackgroundImg(){
  var response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);

  if(hour>=06 && hour<=19){
     bg.addImage(bgImg);
      bg.scale = 1.3 }
       else{
          bg.addImage(bgImg2);
           bg.scale = 1.5
             bg.x=200  
              bg.y=200 }
}