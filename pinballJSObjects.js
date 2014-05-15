
//=============================================================
//CREATE A CLASS CALLED "Game" WHICH DRAWS THE GAME BOARD FOR THE PLAYER
//BASED OFF HOW MANY PLAYERS THERE ARE. THE "Game" CLASS DOES NOT HAVE TO
//RECOGNIZE THE AMOUNT OF PLAYERS IT SIMPLY NEEDS TO HAVE PREDEFINED FUNCTIONS
//FOR DRAWING THE FIELD, AND THE REST OF THE CODE CAN CALL THE DRAW CLASS 
//FUNCTIONS LATER
//NECESSARY PROPERTIES
//.drawBackgroundImage()
//.drawGameBoard()
//.getLayers()
//.moveLayerDown()
//.moveLayerUp()
//.addLayer()
//.getCanvas()
//.redrawBoard()
//.removeLayer()
//.mouseOutEvent()
//.mouseMoveEvent()
//===============================================================
function Game(canvasID){
	var backgroundImage = null;
	var imageOffsetX = 0;
	var imageOffsetY = 0;
	
	var canvas = $(canvasID)[0];
	var context = canvas.getContext('2d');
	
	imageOffsetX = $(canvasID).offset().left;
	imageOffsetY = $(canvasID).offset().top;
	
	//Define these events//
	canvas.addEventListener('movemove', mouseMovementEvent, false);
	canvas.addEventListener('keydown',keyDownEvent, false);
	canvas.addEventListener('mouseout',mouseOutEvent, false);
	
	var layers = new Array();
	
	this.mouseMovementEvent = function(){
	//follow the mouse, move the paddle which is assigned to the player
	}
	this.keyDownEvent = function(){//detect if a certain key has been pressed
	//if it has, replace the image with the new image and redraw the canvas
	//or part of the canvas
	}
	this.mouseOutEvent = function(){//detect if the mouse has moved off the canvas
	}
	this.drawBackgroundImage = function(){//draw in the background image(my be unecessary)
	}
	this.drawGameboard = function(){//draw the entire board, with playing board, paddles
	//action buttons and anything else
	}
	this.getLayers = function(){//returns the array of all layers (must define new Layer class)
		return layers;
	}
	this.getLayer = function(i){//returns a single layer
		return layers[i] ////////////uncomment once layers is defined///////////////
	}
	this.addLayer = function(layer){
		layers.push(layer)
		return layers
	}
	this.removeLayer = function(){//delete a layer (potentially unnecessary)
	}
	this.getCanvas = function(){//return the canvas
	}
	this.redrawCanvas = function(){//redraw the canvas
	}
	this.redrawBoard() = function(){//redraw only the board
	}
	
	
}
//===============================================================
//CREATE A LAYER CLASS WHICH CONTROLS THE ORDER ONE IMAGE IS PLACED
//ONTO ANOTHER IMAGE, IN ESSENCE, IT SHOULD BE THE STACKING ORDER OF
//ALL THE PRELOADED IMAGES ON THE PAGE
//Properties:
//visibility
//visual effects:
//	opacity
//	shadow
//	border?
//get and set all these
//scale images to the users needs
//aka a scaling function
//redraw, again
//The following functions deal with sorting arrays:
//bringToFront()
//sendToBack()
//moveUpOne()
//moveBackOne()
//removeImage() //?
//addImage() //?
//
//===============================================================

function Layer(img){
//copy image properties to object
	this.img = img;
	this.offsetY = 0;
	this.offsetX = 0;
	this.width = naturalWidth;
	this.height = naturalHeight;
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas,height = this.height;
	
	this.context = this.canvas.getContext('2d');
	this.context.save();
	//this.context.translate(this.width/2, this.height/2); //wut is this?
	
	this.opacity=1
	this.visible=true;
	this.shadow=false;
	//this.compositOperation??? //wut is this?
	
	this.angle = 0;
	
	this.isVisible = function(){
		return this.visible;
	}
	this.toggleVisible = function(){
		this.visible = !this.visible;
	}
	this.hasShadow = function(){
		return this.shadow;
	}
	this.toggleShadow = function(){
		this.shadow = !this.shadow;
	}
	this.setShadow = function(shadow){
		this.shadow=shadow;
	}
	this.getOpacity = function(){
		return this.opacity;
	}
	this.setOpacity = function(opacity){
		this.opacity = opacity;
	}
	this.getImage = function(){
		return this.img;
	}
	//this.setCompositeOperation?
	this.redraw = function(){
		var startX = $(this).offset().left;
		var startY = $(this).offset().top;
		
		this.context.clearRect(startX, startY, this.width, this.height);
		this.context.drawImage(this.img, startX, startY, this.width, this.height);
	}
	this.getCanvas = function(){
		this.redraw();
		return this.canvas;
	}
}
