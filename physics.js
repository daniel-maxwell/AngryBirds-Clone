////////////////////////////////////////////////////////////////
function setupGround(){
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){
  propeller = Bodies.rectangle(150, 480, 200, 15, {isStatic: true, angle: angle });
  World.add(engine.world, [propeller]);

}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle+=angleSpeed;
  drawVertices(propeller.vertices);
  pop();

}
////////////////////////////////////////////////////////////////
function setupBird(){
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds(){
  push();
  for(let i=0; i<birds.length; i++) {
    drawVertices(birds[i].vertices);
    if (isOffScreen(birds[i]))
    {
      removeFromWorld(birds[i]);
      birds.splice(i, 1);
      i--;
    } 
  };
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
  for (let i=0; i<3; i++)
  {
    for (let j=0; j<6; j++)
    {
      const box = Bodies.rectangle(width/2 + (80*i), 540 - (80*j), 80, 80);
      boxes.push(box);
      colors.push(color(0, 50 + Math.random() * 205 , 0));
    }
  }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  for (let i=0; i<boxes.length; i++)
  {
    fill(colors[i]);
    drawVertices(boxes[i].vertices);
  }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
  
  slingshotBird = Bodies.circle(100, 100, 20, {friction: 0,
    restitution: 0.95 })
    Matter.Body.setMass(slingshotBird, slingshotBird.mass*10);

  slingshotConstraint = Constraint.create({

    pointA:{
      x:slingshotBird.x,
      y:slingshotBird.y,
    },
    
    bodyB: slingshotBird.body,
    pointB : {x: 100 , y: 100},
    stiffness : 0.01,
    damping : 0.0001
})


  
 World.add(engine.world, slingshotBird, slingshotConstraint);


}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  drawVertices(slingshotBird);
  drawConstraint(slingshotConstraint);
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
