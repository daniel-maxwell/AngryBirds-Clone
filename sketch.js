var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var engine;
var propeller;
var boxes = [];
var boxIsOffScreen = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;
var points=0;
var playerWins=false;
var winningPhrase=Math.floor(Math.random() * 3);

////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);
  engine = Engine.create();  // create an engine
  setupGround();
  setupPropeller();
  setupTower();
  setupSlingshot();
  setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
  const ms = millis()
  playerWins=points===18;
  if (ms < 2500) {
    let mills = Math.round(ms/1000);
    if (mills === 0) PreGameCountdown(3);
    if (mills === 1) PreGameCountdown(2);
    if (mills === 2) PreGameCountdown(1);
  }
  else if (playerWins) youWin(winningPhrase);
  else if (!playerWins && ms > 62500) gameOver();
  else {
    background(0);
    Engine.update(engine);
    drawGround();
    drawPropeller();
    drawTower();
    drawBirds();
    drawSlingshot();
    drawTimer(ms);
    drawScore(points);
  }
}
////////////////////////////////////////////////////////////
function PreGameCountdown(count) {
  textFont('fantasy');
  background(236, 74, 247);
  fill(15);
  strokeWeight(2);
  textAlign(CENTER);
  textSize(32);
  text("CLEAR THE 🟩 FROM THE SCREEN BEFORE THE TIME RUNS OUT!", width/2+2, 202);
  text("GAME STARTS IN: ", width/2+2, height/2.25 +2);
  textSize(64);
  text(count, width/2+2, height/1.5+2);

  fill(255);
  textSize(32);
  text("CLEAR THE 🟩 FROM THE SCREEN BEFORE THE TIME RUNS OUT!", width/2, height/3);
  text("GAME STARTS IN: ", width/2, height/2.25);
  textSize(64);
  text(count, width/2, height/1.5);
  fill(255);
  textAlign(LEFT);
}

function drawTimer(milliseconds) {
  const timeRemaining = 63 - (Math.round(milliseconds/1000));
  timeRemaining > 10 ? fill(250) : fill(243, 32, 19);
  textSize(32);
  text(timeRemaining, 5, 30);
  if (timeRemaining % 2 === 0) updateScore();
}

function drawScore(currentScore) {
  stroke(0);
  strokeWeight(0);
  textFont('fantasy');
  textSize(20);
  textAlign(RIGHT);
  fill(0);
  text("score: " + points, width-6, height-2);
  textAlign(LEFT);
}

function updateScore() {
  let count = 0;
  for (const bool of boxIsOffScreen) {
    if (bool === true) count++;
  }
  points = count;
} 

////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == LEFT_ARROW) angleSpeed+=0.1;
  else if (keyCode == RIGHT_ARROW) angleSpeed-=0.1;
}
////////////////////////////////////////////////////////////
function keyTyped(){
  //if 'b' create a new bird to use with propeller
  if (key==='b') setupBird();

  //if 'r' reset the slingshot
  if (key==='r') {
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased() {
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 }; // edited
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) posA = constraint.bodyA.position;
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) posB = constraint.bodyB.position;
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}

function youWin(phraseNum) {
    textStyle(NORMAL);
    const winningPhrases = ["A true tower-toppling talent", "I never doubted you for a second", "Those boxes never stood a chance"];
    const phrase = winningPhrases[phraseNum];

    // Set up text settings and background
    textFont('fantasy');
    background(51, 204, 255);
    textAlign(CENTER);
    textSize(400);
    text("🥳", width/2, height-160);
    strokeWeight(2);
  
    // Draw text shadow
    fill(16);
    textSize(64);
    text("YOU WIN!", width/2+2, height/4+2);
  
    textSize(32);
    text(phrase, width/2+2, height - height/5 + 92);
    textSize(64);
  
    // Draw text
    fill(255);
    text("YOU WIN!", width/2, height/4);
    textSize(32);
    text(phrase, width/2, height - height/5 + 90);
  
    // Draw text
    stroke(0);
    strokeWeight(0);
    textFont('monospace');
    fill(0);
    textSize(18);
    textAlign(RIGHT);
    text("press space to restart ♻️ ", width, height-10);
    textAlign(CENTER);
  
    // Restart game
    if (key===' ') {
      location.reload();
    }
}

function gameOver() {
  // Set up text settings and background
  textFont('fantasy');
  background(128);
  textAlign(CENTER);
  textSize(400);
  text("😥", width/2, height-160);
  strokeWeight(2);

  // Draw text shadow
  fill(16);
  textSize(64);
  text("GAME OVER", width/2+2, height/4+2);

  textSize(32);
  text("better luck next time!", width/2+2, height - height/5 + 92);
  textSize(64);

  // Draw text
  fill(255);
  text("GAME OVER", width/2, height/4);
  textSize(32);
  text("better luck next time!", width/2, height - height/5 + 90);

  // Draw text
  textFont('monospace');
  fill(0);
  textSize(18);
  textAlign(RIGHT);
  text("press space to restart ♻️ ", width, height-10);
  textAlign(CENTER);

  // Restart game
  if (key===' ') {
    location.reload();
  }
}