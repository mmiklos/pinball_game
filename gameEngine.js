GameEngineClass = Class.extend({

	entities: [],
	factory: {},
	deferredKill: [],
	availableAbilities: [],
	pinballs: [],
	pointSystem: 50,
	coinSystem: 0,
	multiply: 1,

	PHYSICS_UPDATES_PER_SEC: 60,
	
	setup: function () {
		gInput.setup();
		gPhysicsEngine.create();
	},

	spawnEntity: function (typename) {//Basically its the name of the entity, use entities from entity.js
		var ent = new gGameEngine.factory[typename]();//creates a new object variable of the entity specified
		if (typename=='pinball'){
			gGameEngine.pinballs.push(ent);
		}else{
			gGameEngine.entities.push(ent);//puts this entity into the entities list to track existing entities
		}
		return ent;//returns the object
	},

	update: function () {
		gGameEngine.updatePlayer();
		gGameEngine.addCoins();
		for(var i = 0; i< gGameEngine.entities.length; i++){
			var ent = gGameEngine.entities[i];
			if(!ent._killed){
			ent.update();
			}else{
				gGameEngine.deferredKill.push(ent);
			}
		}
		for(var i = 0; i< gGameEngine.pinballs.length; i++){
			var ent = gGameEngine.pinballs[i];
			ent.pos.x = gPhysicsEngine.getPosX(ent.body);
			ent.pos.y = gPhysicsEngine.getPosY(ent.body);
			if(!ent._killed){
				ent.update();
			}else{
				gGameEngine.deferredKill.push(ent);
			}
		}
		
		//Apparently can also do:(instead of below loop)
	  //for(var i=0; i<this.deferredKill.length; i++){
	  //	this.entities.erase(this.deferredKill[i]);
	  //}
		for(var i=0; i<this.deferredKill.length; i++){
			var rEnt = this.deferredKill[i];
			for(var j=0; j<this.entities.length; j++){
				if(this.entities[j]==this.deferredKill[i]){
					this.entities.splice(j,1);
				}
			}
			for(var j=0; j<this.pinballs.length; j++){
				if(this.pinballs[j]==this.deferredKill[i]){
					this.pinballs.splice(j,1);
				}
			}
		}
		this.deferredKill = [];
		
		if(gPhysicsEngine.rampList.length>0){
			var j=0;//needs to change, should be indexOf in active abilities but that wont work since ramp is not defined here;
			for (var index in gInput.activeAbilities){
				if(gInput.activeAbilities[index].GetUserData()=='ramp'){
					j = index;
					break;
				}
			}
			for(var i=0; i<gPhysicsEngine.rampList.length; i++){
				gPhysicsEngine.pushRamp(gPhysicsEngine.rampList[i], gInput.activeAbilities[j]);
			}
		}
		
		gPhysicsEngine.update();
	},
	updatePlayer: function () {
	},
	removeEntity: function () {
	},
	setSpawnPoint: function(Class, posX, posY, vert1, vert2){
		console.log(Class);
		if (vert1 == undefined || vert2 == undefined){
			if (Class.entityDef.radius){//circle
				Class.entityDef.position.x = posX+Class.entityDef.radius;
				Class.entityDef.position.y = posY+Class.entityDef.radius;
			} else {//box
				Class.entityDef.position.x = posX+Class.entityDef.halfWidth;
				Class.entityDef.position.y = posY+Class.entityDef.halfHeight;
			}
		} else {//edge
			Class.entityDef.position.x = posX;
			Class.entityDef.position.y = posY;
			Class.entityDef.vert1 = vert1;
			Class.enttiyDef.very2 = vert2;
		}
	},
	addCoins: function(){
		var amountToAdd = this.pinballs.length;
		var mValue = 0.01
		if(gGameEngine.pointSystem>0){
			this.coinSystem = this.coinSystem + (amountToAdd * mValue);
		}
	},
});

gGameEngine = new GameEngineClass();