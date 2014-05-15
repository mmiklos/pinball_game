var canvas = null;
var context = null;
var setup = function() {
	var body = document.getElementById("body");
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	this.context = context;
	this.canvas = canvas;
	
	x=window.innerWidth;
	y=window.innerHeight;
	if(x>y){
	canvas.width = y;
	canvas.height = y;
	$("#container").css({"width":y+"px","height":y+"px"})
	}else{
	canvas.width = x;
	canvas.height = x;
	$("#container").css({"width":x+"px","height":x+"px"})
	}
	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	$('#container').css("margin","auto");
	$('#cnvs1').css({"margin":"auto","position":"relative","float":"left"});
	$('#cnvs0').css({"margin":"auto","position":"relative","float":"left"});

	
	var layers = new Array();
	//=====================================//
	//Place Canvas into Html//
	//=====================================//
	document.getElementById('container').appendChild(canvas);
	
	//=====================================//
	//Set canvas' ID attributes//
	//=====================================//
	for( i=0; i<document.getElementsByTagName("canvas").length; i++ )
	{
		document.getElementsByTagName("canvas")[i].setAttribute("id","cnvs"+i);
	}
	//=====================================================================
	//MARGIN IS NOT SLIPPING IMAGE INTO THE CENTER OF THE SCREEN...works with 1 canvas
	//=====================================================================

	
	var imgList = new Array();
	
	//var img = new Image();
	var img2 = new Image();
	var pngImg = new Image();
	
	//img.onload = onImageLoad();
	img2.onload = onImageLoad();
	pngImg.onload = onImageLoad();
	
	//img.src = "../PinballGame/images/background-image.png";
	img2.src = "../PinballGame/images/playingfield-image.png";
	pngImg.src = "../PinballGame/pinballsheet_fixnumbers.png";
	
//******************************************
//Creating sprite class object
//Parsing in data to atlJSON
//******************************************
	gSpriteSheet.load(pngImg.src)
	
		$.getJSON("../PinballGame/pinballsheet_fixnumbers.json", function(){
			gSpriteSheet.parseAtlasDefinition(arguments[2].responseText);
			drawSprite("rank1redpaddle.png",canvas.width*0.35,canvas.height*0.783, canvas.width*0.09, canvas.height*0.02);
			drawSprite("ramp_icon.png",canvas.width*0.25,canvas.height*0.8, canvas.width*0.1, canvas.height*0.1);
			drawSprite("shield_icon.png",canvas.width*0.45,canvas.height*0.8, canvas.width*0.1, canvas.height*0.1);
			drawSprite("Addrenaline_icon.png",canvas.width*0.65,canvas.height*0.8, canvas.width*0.1, canvas.height*0.1);
			drawSprite("Energy_Icon.png",canvas.width*0.35,canvas.height*0.9, canvas.width*0.1, canvas.height*0.1);
			drawSprite("Fake_Ball_icon.png",canvas.width*0.45,canvas.height*0.9, canvas.width*0.1, canvas.height*0.1);
			drawSprite("Hide_icon.png",canvas.width*0.55,canvas.height*0.9, canvas.width*0.1, canvas.height*0.1);
			});
			
		console.log(gSpriteSheet.sprites);
	
	//img.onload = context.drawImage(img,0,0, canvas.width, canvas.height);
	context.globalCompositeOperation="source-over";
	context.beginPath();
	img2.onload = context.drawImage(img2,0,0, canvas.width, canvas.height);
	//console.log(context.globalCompositeOperation);
	console.log(canvas.width + " " + canvas.height);
	
	gGameEngine.setup();
	var pinball = gGameEngine.spawnEntity('pinball');
	gPhysicsEngine.addBody(pinball.entityDef);
	console.log(pinball.entityDef.id);
	drawSprite(pinball.entityDef.id, canvas.width/2, canvas.height/2, 0,0);
	
};