import React, {useEffect, useRef} from "react";
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    fitToContainer(canvas);

    const ctx = canvas.getContext(`2d`);

    createCircle(canvas, ctx);

  })
  return (
      <canvas ref={canvasRef} />
  );
}

export default App;

const maxRadius = 100;

//sets canvas element size and the size of the drawing surface.
function fitToContainer(canvas) {

  canvas.style.width = '100%' ;
  canvas.style.height = '100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

}

function mouseTracker(canvas) {
  const mouse = {x: 0, y: 0};
  canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  return mouse;
}

function Circle(canvas, ctx, position, velocities, radius, color) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.x = position.x;
  this.y = position.y;
  this.dx = velocities.dx;
  this.dy = velocities.dy;
  this.radius = radius;
  this.oRadius = radius;
  this.color = color;

  this.mouse = mouseTracker(canvas);
  console.log(this.mouse)

  this.draw = function() {

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;
    this.ctx.fill();

  }

  this.update = function() {
    if(this.x + this.radius > this.canvas.width || this.x - this.radius < 0 ) {

      this.dx = -this.dx;

    }

    if(this.y + this.radius > this.canvas.height || this.y - this.radius < 0 ) {

      this.dy = -this.dy;

    }

    this.x += this.dx;
    this.y += this.dy;

    if(Math.abs(this.x - this.mouse.x) < 50 && Math.abs(this.y - this.mouse.y) < 50)
    {
      if(this.radius < maxRadius){
        this.radius += 2;

      }
    } else if(this.radius > this.oRadius) {
      this.radius -= 2;
    }

    this.draw()

  }
}

function createCircle(canvas, ctx) {

  let circleArray = [];

  for(let i = 0; i < 1000; i++) {

    //get random radius for size of circle
    let radius = Math.ceil(Math.random() * 1000) % 10;

    //get random x & y position;
    let circlePosition = getPosition(canvas, radius);

    //get random velocities
    let velocity = getVelocity();

    //get random green color
    let color = randomOffsetColor();

    circleArray.push(new Circle(canvas, ctx, circlePosition, velocity, radius, color))

  }

  //function that creates and animates circle
  animate(canvas, ctx, circleArray);

}

// sets center position in such a way that no part of any circle falls outside the canvas range;
function getPosition(canvas, radius) {

  const position = {x: 0, y: 0};

  let xAccepted = false
  while (!xAccepted) {
    position.x = Math.ceil(Math.random() * 10000) % canvas.width;
    if((position.x > radius) && (position.x < canvas.width - radius)) {
      xAccepted = true;
    }
  }

  let yAccepted = false;
  while (!yAccepted) {
    position.y = Math.ceil(Math.random() * 10000) % canvas.height;
    if((position.y > radius) && (position.y < canvas.height - radius)) {
      yAccepted = true;
    }
  }

  return position;

}

function getVelocity() {

  let dx = Math.random() * 100 / 10 % 2;
  dx *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

  let dy = Math.random() * 100 / 10 % 2;
  dy *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

  return{dx, dy};

}

function animate(canvas, ctx, circleArray) {

  requestAnimationFrame(function(){animate(canvas, ctx, circleArray)});

  ctx.clearRect(0,0, canvas.width, canvas.height);

  for(let i = 0; i < circleArray.length; i++) {

    circleArray[i].update();

  }

}

//picks a random shade of green
function randomOffsetColor() {

  let rgbPick = [];

  rgbPick.push(Math.ceil(Math.random() * 1000) % 255);
  rgbPick.push(Math.ceil(Math.random() * 1000) % 255);
  rgbPick.push(Math.ceil(Math.random() * 1000) % 255);

  return rgbPick;

}