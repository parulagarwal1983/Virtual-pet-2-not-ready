//Create variables here
var dog, happyDog, database, foods, foodStock;

var feedTime,lastFed;
var foodObj;

var feed,addFood;

function preload()
{
	//load images here
  dogStand = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
  milkImg = loadImage("images/Milk.png");
}

function setup() {

  database = firebase.database();

	createCanvas(500, 500);

  dog = createSprite(250,400,50,70);
  dog.addImage(dogStand);
  dog.scale = 0.2;

  foodStock = database.ref('pet/Food');
  foodStock.on("value",readStock);
  
  foodObj = new FoodC();

  feed = createButton('Feed the Dog');
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  

  background(46,139,87);

  foodObj.display();

  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastFed = data.val();
  });

  drawSprites();
  //add styles here

  fill("black");
  textSize(30); 
  stroke(3);  
  text("Food Stock Left :- "+ foods,90,300);

  fill("white");
  textSize(15);

  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 350,30);
  }

  else if(lastFed === 0){
    text("Last Feed : 12 AM", 350,30);
  } 
  
  else{
    text("Last Feed : " + lastFed + " AM", 350,30);
  }
}

function readStock(data){
   foods = data.val();
   foodObj.updateFoodStock(foods);
}

function writeStock(x){

  if(x<=0){
    x = 0;
  }
  else{
    x = x - 1;
  }
   database.ref('/').update({Food:x})
}

function feedDog(){
  
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  foods--;
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodObj.updateFoodStock(foodObj.getFoodStock()+1);
  foods++;
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    Food:foods
  })
}