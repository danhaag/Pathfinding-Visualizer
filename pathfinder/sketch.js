let cols = 50;
let rows = 50;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];

let start;
let end;

let w;
let h;

let path = [];

let noSolution = false;

function removeFromArray(arr, e){
  for(let i = arr.length - 1; i >=0; i--){
    if(arr[i] == e){
      arr.splice(i,1);
    }
  }
}


function Spot(i,j){

  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if(random(1) < .4){
    this.wall = true;
  }

  this.show = function(color){
    //fill(color);
    noStroke();
    if(this.wall){
      rect(this.i * w, this.j * h, w - 1, h - 1);
      fill(52, 73, 94)
    }
    else{
      //noStroke();
      //ellipse(this.i * w + w / 2, this.j *h + h/2, w/2, h/2)
    }
  }

  this.highlight = function(color){
    if(!this.wall){
      ellipse(this.i * w + w / 2, this.j *h + h/2, w/1.5, h/1.5)
      fill(color)
    }
  }

  this.addNeighbors = function(grid){

    let i = this.i;
    let j = this.j;

    if(this.i < cols - 1){
      this.neighbors.push(grid[i + 1][j])
    }
    if(this.i > 0){
      this.neighbors.push(grid[i - 1][j])
    }
    if(this.j < rows - 1){
      this.neighbors.push(grid[i][j + 1])
    }
    if(this.j > 0){
      this.neighbors.push(grid[i][j - 1])
    }
    if(j > 0 && i > 0){
      this.neighbors.push(grid[i - 1][j - 1])
    }
    if(j > 0 && i < cols - 1){
      this.neighbors.push(grid[i + 1][j - 1])
    }
    if(j < rows - 1 && i > 0){
      this.neighbors.push(grid[i - 1][j + 1])
    }
    if(j < rows - 1 && i < cols - 1){
      this.neighbors.push(grid[i + 1][j + 1])
    }
  }

}

function heuristic(a,b){

  //console.log(a.i)

  let i1 = a.i;
  let j1 = a.j;

  let i2 = b.i;
  let j2 = b.j

  //Calculate Euclidean distance!
  //let d = dist(i1, j1, i2, j2);

  //Manhattan Distance!
  let d = abs(i1 - i2) + abs(j1 - j2);

  return d;

}

function setup() {

  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');

  console.log('A*')

  w = width/cols;
  h = height/rows;
  //making 2d array
  for(let i =0; i < cols; i++){

    grid[i] = new Array(rows);

  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];

  start.wall = false;
  end.wall = false;

  openSet.push(start);

  console.log(grid)

}

function windowResized() {
  console.log("resize");
  resizeCanvas(windowWidth, windowHeight);

  w = width/cols;
  h = height/rows;

  // for(let i = 0; i < cols; i++){
  //   for(let j = 0; j < rows; j++){
  //     grid[i][j].show(color(25));
  //   }
  // }
  //
  // for(let i = 0; i < closedSet.length; i++){
  //   closedSet[i].highlight(color(241,148,138));
  // }
  //
  // for(let i = 0; i < openSet.length; i++){
  //   openSet[i].highlight(color(86,214,141));
  // }


}

let complete = false;

function draw() {

  let current;

  if(openSet.length > 0){
    //we can keep going

    let lowestIndex = 0;

    for(let i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
    }

    current = openSet[lowestIndex];

    if(current === end){

      complete = true;

      noLoop();
      console.log('DONE!');


    }

    //NEEDS OPTIMIZATION FOR REMOVING FROM ARRAY
    removeFromArray(openSet,current)

    closedSet.push(current);

    let neighbors = current.neighbors;

    for(let i = 0; i < neighbors.length; i++){

      let neighbor = neighbors[i];
      //make sure not in the closed set?
      //MASSIVE INEFICIENCY!!! MAKE BETTER SEARCH!
      if(!closedSet.includes(neighbor) && !neighbor.wall){
        let tempG = neighbor.g = current.g + 1;

        let newPath = false;

        if(openSet.includes(neighbor)){
            if(tempG < neighbor.g){
              neighbor.g = tempG;
              newPath = true;
            }
        }
        else{
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        //Calculate the heuristic
        //Euclidean distance?
        if(newPath){
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }


  }
  else{
    //no solution
    noSolution = true;

    console.log("There is no viable path!")

  }
  background(color(252, 243, 207));

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].show(color(25));
    }
  }

  for(let i = 0; i < closedSet.length; i++){
    closedSet[i].highlight(color(241,148,138));
  }

  for(let i = 0; i < openSet.length; i++){
    openSet[i].highlight(color(133, 193, 233));
  }

  //FIND THE PATH
  if(!noSolution){

    path = [];
    let temp = current;
    path.push(temp);
    while(temp.previous){
      path.push(temp.previous);
      temp = temp.previous;
    }

  }else{
    noLoop();
  }

  for(let i = 0; i < path.length; i++){
    path[i].highlight((color(255)));
  }

  noFill()
  if(complete){
    stroke(88, 214, 141);
  }
  else{
    stroke(255);
  }
  strokeWeight(w/2);
  beginShape();
  for(let i = 0; i < path.length; i++){
    vertex(path[i].i*w + w/2, path[i].j*h + h/2);
  }
  endShape();

}
