////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
  propeller = Bodies.rectangle(200, 480, 200, 15, {isStatic: true, angle: angle });
  World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
  push();
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle+=angleSpeed;
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
  push();
  fill(51, 204, 255);
  for(let i=0; i<birds.length; i++) 
  {
    drawVertices(birds[i].vertices);
    if (isOffScreen(birds[i])) {
      removeFromWorld(birds[i]);
      birds.splice(i, 1);
      i--;
    } 
  };
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
  for (let i=0; i<3; i++)
  {
    for (let j=0; j<6; j++)
    {
      const box = Bodies.rectangle(width/1.4 + (80*i), 540 - (80*j), 80, 80);
      boxes.push(box);
      colors.push(color(0, 50 + Math.random() * 205 , 0));
    }
  }
  World.add(engine.world, boxes);
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower() {
  push();
  for (let i=0; i<boxes.length; i++)
  {
    fill(colors[i]);
    drawVertices(boxes[i].vertices);
  }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
  slingshotBird = Bodies.circle(200, 250, 20, {friction: 0,
    restitution: 0.95});

  Matter.Body.setMass(slingshotBird, slingshotBird.mass*10);

  var options = {
    pointA: {x: 200, y: 175},
    bodyB: slingshotBird,
    pointB: {x: 0, y: 0},
    length: 50,
    stiffness: 0.008,
    damping: 0.0001
  }

  slingshotConstraint = Constraint.create(options)
  World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
  push();
  stroke(0);
  strokeWeight(0.5);
  fill(250, 45, 240);
  drawVertices(slingshotBird.vertices);
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
