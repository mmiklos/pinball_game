
//=====================================================
//BEGINNING OF SpriteSheetClass
//	init()				---nothing
//	load(imgName)		---loads imgName, stores it in sheets and sprites arrays
//	parseAtlasDefinition(atlasJSON) ---parses the JSON sheet
// 	getStats(name)		---called when drawing sprite, returns sprite parameters
//	drawSprite(spriteName, posX, posY) ---not part of class! calls __drawSpriteInternal
//	__drawSpriteInternal(spt, sheet, posX, posY) ---not part of class! gets parameters and calls ctx.drawImage();
//=====================================================
var gSpriteSheets = {};
SpriteSheetClass = Class.extend({
img: null,
url: "",
sprites: new Array(),
init: function (){},
load: function (imgName){
	this.url = imgName;
	this.img = new Image(imgName);//stores img into img parameter
	this.img.src = this.url;
	gSpriteSheets[imgName] = this; //stores spriteSheetClass in global dictionary gSpriteSheets defined earlier
},
	
defSprite: function(name, x, y, w, h, cx, cy){
	var spt = {
		"id": name,
		"x" : x,
		"y" : y,
		"w" : w,
		"h" : h,
		"cx": cx==null?0: cx,//Wut does this do?
		"cy": cy==null?0: cy,
		};		
	this.sprites.push(spt);//Pushes the spt Array into the sprites array, at the end
},
	
parseAtlasDefinition: function (atlasJSON){
	var atj = JSON.parse(atlasJSON);//all JSON data into javascript object! Very Important!
	console.log(atj);
	for (var key in atj.frames){//for all objects in frame...
		var sprite = atj.frames[key];//the sprite name is the 'key' in frames
			if(sprite == undefined || sprite.frame == undefined) continue;
		var cx = sprite.frame.w*-0.5;//Basically, (atj.frames[key].sprite.frame.w)*(-0.5) -> going through the data
		var cy = sprite.frame.h*-0.5;//same here but with height
		
		if(sprite.trimmed){//Now, if trimmed is true, update the cx/cy variables
			cx = sprite.spriteSourceSize.x - (sprite.sourceSize.w *0.5);
			cy = sprite.spriteSourceSize.y - (sprite.sourceSize.h * 0.5);
		}			
		//Now we call the prev function to assign all values of every object in frames(all sprites) to their respective variable
		this.defSprite(atj.frames[key].filename, sprite.frame.x, sprite.frame.y, sprite.frame.w, sprite.frame.h, cx, cy);
	}
	
	
},
	
getStats: function (name) {
	for (var i=0; i <  this.sprites.length; i++){//itterated through all the sprites in the class
		if(this.sprites[i].id === name){//if any of the sprites match given name...
			return this.sprites[i];//return that sprite
		}
	}
	console.log("Did not find Sprite");
	return null;//if no sprites exist with given name in the sheet, return null.
}
});
var gSpriteSheet = new SpriteSheetClass();
//=========================
//These need some tampering
//remove the centering stuff
//change parameters so objects can be placed with more detailed data
//===================================================================
function drawSprite(spritename, posX, posY, width, height){
	if(spritename=="pinball.png"){
		context2.beginPath();
		context2.arc(posX, posY, canvas.width*0.01, 0, 2*Math.PI, false);
		context2.fillStyle = 'gray';
		context2.fill();
		return;
	}
	for(var sheetName in gSpriteSheets){//defines 'sheetName' as an array of all sheetNames in gSpriteSheets
		var sheet = gSpriteSheets[sheetName];//assigns the name of current sheet to a variable, 'sheet'
		var sprite = sheet.getStats(spritename);
		//check if the sprite name exists in the given sheet
		if(sprite==null) continue;//if it does not exist start the loop over
		// else, if it does exist call the drawing function with the current sprite and current sheet values
		__drawSpriteInternal(sprite, sheet, posX, posY, width, height);
		return;
	}
}

function __drawSpriteInternal(spt, sheet, posX, posY, width, height){
	if (spt==null || sheet==null)return;//cancel draw if one of the parameters is null
		var hlf = {
			x: spt.cx,
			y: spt.cy
		};
	context.drawImage(sheet.img, spt.x, spt.y, spt.w, spt.h, posX, posY, width, height);
}
//=========================================================
//END OF SpriteSheetClass
//=========================================================


//=========================================================
//BEGINNING OF TILEDMapClass
//	load(map)
//	parseMapJSON(mapJSON) ---to parse data into the class variables
//	getTilePacket(tileIDX)---find firstgid value that is equal to titleIDX and returns it*does not need to be used*
//	draw(ctx)			  ---draws the Tiled image, invoked previous function to grab correct object
//=========================================================
//download "Tiled" application to create a background with data

function xhrGet(reqUri, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", reqUri, true);
	xhr.onload = callback;
	xhr.send();
}
//New class for loading in the "background" stuff
var TILEDMapClass = Class.extend({
	crrMapData: null,
	tilesets: [],
	numXTiles: 1,
	numYTiles: 1,
	tileSize: {
		"x": 1,
		"y": 1,
	},
	pixelSize: {
		"x": 1,
		"y": 1
	},
	fullyLoaded: false,
	load: function(map){
		xhrGet(map, false, function(data){
			gMap.parseMapJSON(data.responseText);
		});
	},
	parseMapJSON: function (mapJSON){//Parse all data into variables
		gMap.currMapData = JSON.parse(mapJSON)//Parse JSON and store to current map
		var map = this.currentMapData;
		this.numXTiles = map.width;
		this.numYTiles = map.height;
		this.tileSize.x = map.tilewidth;
		this.tileSize.y = map.tileheight;
		this.pixelSize.x = this.numXTiles * this.tileSize.x;
		this.pixelSize.y = this.numYTiles * this.tileSize.y;
		
		var gMap = this;
		for(var i = 0; i<map.tilesets.length; i++){//for each tile in the set
			var img = new Image();//create a new image for each tile set
			img.onload = function(){//when the tile set loads...
				gMap.imgLoadCount++;//itterate a load counter
				if(gMap.imgLoadCount === gMap.tileSets.length){//compare it to the total length of the tilesets in the entire data file
					gMap.fullyLoaded = true;//if they are equal, all tile sets have loaded, and everything is loaded.
				}
			}
		img.src = "../data/" + map.tilesets[i].image.replace(/^.*[\\\/]/, '');//changes the url give through the data to the accurate url, replacing '\' for ' '
		var ts = {
			"firstgid": map.tilesets[i].firstgid,
			"image": img,
			"imageheight": map.tilesets[i].imageheight,
			"imagewidth": map.tilesets[i].imagewidth,
			"name":map.tilesets[i].name,
			"numXTiles": Math.floor(map.tilesets[i].imagewidth / this.tileSize.x),
			"numYTiles": Math.floor(map.tilesets[i].imagewidth / this.tileSize.y)
		};
			this.tileSets.push(ts);
		}
	},
		
	getTilePacket: function (tileIndex){
		var pkt = {
			"img":null,
			"px":0,
			"py":0
		};
		var i = 0;
		for(i = this.tileSets.length - 1; i >= 0; i--){
			if(this.tilesets[i].firstgid <= tileIndex) break;
		}
				pkt.img =  this.tileSets[i].image;
				var localIdx = tileIndex - this.tileSets[i].firstgid;
				var lTileX = Math.floor(localIdx % this.tileSets[i].numXTiles);
				var lTileY = Math.floor(localIdx / this.tileSets[i].numXTiles);
				pkt.px = (lTileX * this.tileSize.x);
				pkt.py = (lTileY * this.tileSize.y);
				
				return pkt;
	},
		
	draw: function (ctx){
		if(!this.fullyLoaded) return;
		for( var layerIdx = 0; layerIdx < this.currMapData.layers.length; layerIdx++){
			if(this.currMapData.layers[layerIdx].type != "tilelayer") continue;
			var data = this.currMapData.layers[layerIdx].data;
			for(var tileIDX = 0; tileIDX < data.length; tileIDX++){
				var tID = data[tileIDX];
				if (tID === 0) continue;
			var tPKT = this.getTilePacket(tID);
			
			//check values to see if tile is in world
			var worldX = Math.floor(tileIDX % this.numXTiles) * this.tileSize.x;
			var worldY = Math.floor(tileIDX / this.numXTiles) * this.tileSize.y;
			
			ctx.drawImage(tPKT.img, tPKT.px, tPKT.py,
						this.tileSize.x, this.tileSize.y,
						worldX, worldY,
						this.tileSize.x, this.tileSize.y);
			}
		}
	}		
});
var gMap = new TILEDMapClass(); //Global instance of Map
//=========================================================
//END OF TILEDMapClass
//=========================================================
