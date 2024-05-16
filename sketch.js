
// Array to store multiple waves
let waves = [];

// Number of waves to create
let numWaves = 15;


//A gradient is created using this tutorial as example: https://youtu.be/EAY7S1tWbzc?feature=shared 
let topColor;
let bottomColor;

// Declare variables for dolphin image and its position
let dolphinImage;
let dolphinX;
let dolphinY;

// Declare variable for Perlin noise offset so that we can use it for both dolphin and waves
// We want the Dolphins to move in two dimensions using this tutorial: 
// https://www.youtube.com/watch?v=ikwNrFvnL3g&list=PLRqwX-V7Uu6bgPNQAdxQZpJuJCjeOr7VD&index=4&ab_channel=TheCodingTrain 
let xoff = 0;
let yoff = 1000; // Initial offset for Perlin noise for y-coordinate

//Adding an image of a dolphin, sound of the sea & a dophin sound
function preload () {
  dolphinImage = loadImage("Media/Dolphin.png")
  sound = loadSound('Media/Sea.wav');
  soundDolphin = loadSound('Media/Dolphin.mp3')
}

function setup() {
  // Create the canvas filling the window
  createCanvas(windowWidth, windowHeight);

  // Create multiple waves with varying properties
  for (let i = 0; i < numWaves; i++) {
    //We are moving down the screen as we set the yBase for each new wave
    //devide height by two since we are using only the lower part of the screen for waves and the upper part for sunrise
    let yBase =  i * (height/2) /numWaves;

    //As we move down the screen i gets bigger and so does the amplitude
    let amplitude = 20 + i * 10; 

    //As we move down the screen the waves get darker by increasing the alpha value of the colour
    let waveColor = color(0, 0, 255, 20 + i * 10); 

    //As we move down the screen the waves get heavier by increasing the stroke weight
    let strokeW = 1 + i; 
    waves.push(new Wave(amplitude, random(0.01, 0.03), yBase, waveColor, strokeW));
  }

   // Set initial position of dolphin relative to window size
   dolphinX = windowWidth / 3;
   dolphinY = windowHeight / 3; // Start dolphin at 1/3 of the screen
   
   //Want the Dolphin not too big, but also not to transform with the window size, so both widht and height adjust to windowheight
   dolphinWidth = windowHeight/8;
   dolphinHeight = windowHeight/8;
}

function draw() {
  // Set the background color to an ocean blue
  background(10, 24, 72); 


  // Use push and pop to give gradient fill and no Stroke to sunset upper half
  push();
  noStroke();
  topColor=color(78,127,162);
  bottomColor=color(250, 95, 85);

  //Make a for loop drawing a lot of thin lines slightly changing the color from top to bottem creating a gradient
  for(let y=0;y<windowHeight/2;y++){
    n=map(y,0,windowHeight/2,0,1);

    //lerpcolor makes the gradient
    let newColor=lerpColor(topColor,bottomColor,n);
    stroke(newColor);
    line(0,y,windowWidth,y);
    
  }

  pop();


  // Update all waves and draw them over backgrounds
  for (let i = 0; i < waves.length; i++) {
    waves[i].display();
  }

  //Update the dolphin
  updateDolphin();
  image(dolphinImage, dolphinX, dolphinY, dolphinWidth, dolphinHeight);
 
}

//this is a wave class, it will draw a single wave line across the screen

class Wave {
  // Constructor with parameters for amplitude, frequency, yBase, color, and strokeWeight
  //The amplitude is the height of the wave
  //The frequency is how often peaks and troughs occur - how far we move across the noise function for each point of the wave
  //The yBase is the y position of the wave
  //The color is the color of the wave.
  //The strokeWeight is the thickness of the wave line.
  constructor(amplitude, frequency, yBase, color, strokeWeight) {
    this.amplitude = amplitude; // Height of the wave
    this.frequency = frequency; // How often peaks and troughs occur

    // Base line of the wave starts halfway the screen to have sunrise abvove it
    this.yBase = yBase+(windowHeight/2); 
    this.offset = 0; // Initial offset for Perlin noise
    this.color = color; // Color of the wave
    this.strokeWeight = strokeWeight; // Thickness of the wave line
  }

  // Method to display the wave
  display() {
    noFill();
    //set the colour
    stroke(this.color);
    //set the stroke weight (different for each class instance)
    strokeWeight(this.strokeWeight);
    // Begin the shape
    beginShape();
    // xoff is the offset for Perlin noise - inside each class instance
    //as we move across the screen we increment xoff by the frequency
    //this will generate different wave patterns for each wave
    //To do this we start our wave noise sampling with the class instances offset
    let xoff = this.offset; 
    //Now we move across the screen, left to right in steps of 10 pixels
    for (let x = 0; x <= windowWidth; x += 10) {
      //Every 10 pixels we sample the noise function
      let waveHeight = map(noise(xoff), 0, 1, -this.amplitude, this.amplitude);
      //We draw a vertex at the x position and the yBase position + the wave height
   

      vertex(x, this.yBase + waveHeight);
      //we are still inside the for loop, so we increment xoff by the frequency
      //Increasing xoff here means the next wave point will be sampled from a different part of the noise function
      xoff += this.frequency;


    }
    //now we reached the edge of the screen we end the shape
    endShape();
    //Now we increment the class instances offset, ready for the next frame
    this.offset += 0.005; // Smaller increment for smoother animation
    
   
  }

}

function updateDolphin() {
  
    // Use Perlin noise to determine x-coordinate of dolphin
    let dolphinNoiseX = noise(xoff);
    // Map the x-coordinate to the width of the canvas
    dolphinX = map(dolphinNoiseX, 0, 1, 0, windowWidth);
  
    // Use Perlin noise to determine y-coordinate of dolphin
    let dolphinNoiseY = noise(yoff);
    // Map the y-coordinate to the height of the canvas
    dolphinY = map(dolphinNoiseY, 0, 1, windowHeight,(windowHeight/2)-(windowHeight/4)); // keep Dolphin at lower half, but can jump a bit into sunset until 1/4 windowheight
  
    // Increment xoff and yoff for next frame
    xoff += 0.005; //same as for waves
    yoff += 0.005; //same as for waves
  }



    //function for the wave sound, using as a source https://p5js.org/examples/sound-load-and-play-sound.html 
//The sound of waves starts playing when you click s (for sound) and stop playing when you click s for silent ;)
function keyPressed() {
  if (key == 's'){
    if (sound.isPlaying()) {
      // .isPlaying() returns a boolean
      sound.stop();
    } else {
      sound.play();
    }

  }
  
}

//Now I want to play dolphin sounds when you click on a dolphin, which for now to keep it simple I just code clicking is Dolphin sound
function mousePressed() {
    if (soundDolphin.isPlaying()) {
      // .isPlaying() returns a boolean
      soundDolphin.stop();
    } else {
      soundDolphin.play();
    }

  }
  





