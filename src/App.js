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

//sets canvas element size and the size of the drawing surface.
function fitToContainer(canvas) {

  canvas.style.width = '100%' ;
  canvas.style.height = '100%';
  canvas.width = canvas.offsetWidth * 2;
  canvas.height = canvas.offsetHeight * 2;

}

function Circle(canvas, ctx, position, velocities, radius, color) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.x = position.x;
  this.y = position.y;
  this.dx = velocities.dx;
  this.dy = velocities.dy;
  this.radius = radius;
  this.color = color;

  this.draw = function() {

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.25)`;
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

    this.draw()

  }
}

function createCircle(canvas, ctx) {

  let circleArray = [];

  for(let i = 0; i < 25; i++) {

    //get random radius for size of circle
    let radius = Math.ceil(Math.random() * 1000) % 100;

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

  let dx = (Math.random() + 4) + 1;
  dx *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

  let dy = (Math.random() * 4) + 1;
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