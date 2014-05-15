EntityClass = Class.extend({
	//ALL ENTITIY CLASSES MUST BE AN EXTENTION OF THIS 'EntityClass'
	pos : {x:0,y:0},//for collisions
	size: {x:0,y:0},//for physics calculations
	_killed: false,
	currSpriteName: null,
	zindex: 0,
	update : function(){},//will need to change this to specify every entitiy so it can update all entities
	canvas : this.canvas,
	draw: function(){
		if (this.currSpriteName){
			drawSprite(this.currSpriteName,//from the classDrawers file
						this.pos.x,//where exactly does hsize come from?
						this.pos.y);// - this.hsize.y);
		}
	}
});
gEntity = new EntityClass();
	

PinballClass = EntityClass.extend({
	entityDef:{
		id: 'pinball.png',
		type: "dynamic",
		position: {x: -1, y:-1},//spawn point
		radius: 5,
		usebouncyfixture: true,
		shape: 'circle'
	},
	setSpawnPoint: function(){
		this.entityDef.position.x = canvas.width/2;
		this.entityDef.position.y = canvas.height/2;
	},
	kill: function(){
		gGameEngine.deferredKill.push(this);
		gEntity._killed = true;
	},
	update: function(){
		this.currSpriteName = this.entityDef.id;
		if (this.entityDef.position.x == -1){
			this.setSpawnPoint();
			this.pos.x = this.entityDef.position.x;
			this.pos.y = this.entityDef.position.y;
		}
		else if (this.entityDef.position.x < 0 || this.entityDef.position.x > canvas.width || this.entityDef.position.y > canvas.height*0.81 || this.entityDef.position.y < 0){
			this.kill();
			console.log("Kill");
		} else{
			this.entityDef.position.x = this.pos.x;
			this.entityDef.position.y = this.pos.y;
		}
		

		//this.draw();
	},
	onTouch: function (otherBody, point, impulse){
		if(!this.physBody){
			return false;
		};
	},
	//this.parent();//calls the entities update function after preforming this local update
});
gGameEngine.factory['pinball']=PinballClass;

BumperClass = EntityClass.extend({
	entityDef:{
		id: "rank1redpaddle.png",
		type: 'kinematic',
		position: {x:-1, y:-1},//spawn point vert
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	update: function(){
		this.currSpriteName = this.entityDef.id;
		if (this.entityDef.position.x == -1){
			this.entityDef.position.x = canvas.width*0.35;
			this.entityDef.position.y = canvas.height*0.783;
		//gGameEngine.entities[0].body.m_xf.position.x = this.entityDef.x;
		//gGameEngine.entities[0].body.m_xf.position.y = this.entityDef.y;
			this.pos.x = this.entityDef.position.x;
			this.pos.y = this.entityDef.position.y;
			console.log(this.pos.x, this.pos.y);
		}
	}
});
gGameEngine.factory['Bumper']=BumperClass;

Power_One_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: "ramp_icon.png",
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power One']=Power_One_Class;

Power_Two_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'shield_icon.png',
		type: "static",
		position: {x:0, y:0},
		usebouncyfixture: false,
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Two']=Power_Two_Class;

Power_Three_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'Addrenaline_icon.png',
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Three']=Power_Three_Class;

Power_Four_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'Energy_Icon.png',
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Four']=Power_Four_Class;

Power_Five_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'Fake_Ball_icon.png',
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Five']=Power_Five_Class;

Power_Six_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'Hide_icon.png',
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Six']=Power_Six_Class;

Power_Seven_Class = EntityClass.extend({//NEEDS NAME CHANGE
	entityDef:{
		id: 'Growth_icon.png',
		type: "static",
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
	},
	update: function(){}
});
gGameEngine.factory['Power Seven']=Power_Seven_Class;

Slow_1_Class = EntityClass.extend({
	expire: 0,
	entityDef:{
		id: '',
		type: 'dynamic',
		position: {x:0, y:0},
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box',
		isSensor: true,
	},
	kill: function(){
		gGameEngine.removeEntity(this);
		gGameEngine.deferredKill.push(this);
		var index = gInput.activeAbilities.indexOf(this.beam);
		gPhysicsEngine.removeBody(gInput.activeAbilities[index]);
	},
	update: function(){
		this.expire = this.expire + 1;
		if(this.expire==(60*5)/*15 seconds*/){
			this.kill();
			this.expire = 0;
		}
	},
});
gGameEngine.factory['Slow_1']=Slow_1_Class;

Slow_2_Class = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['Slow_2']=Slow_2_Class;

Slow_3_Class = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['Slow_3']=Slow_3_Class;

Grow_1_Class = EntityClass.extend({
	expire: 0,
	entityDef:{
		id: "rank1redpaddle.png",
		type: 'dynamic',
		position: {x:0, y:0},//spawn point vert
		halfWidth: 1,
		halfHeight: 1,
		shape: 'box'
	},
	kill: function(){
		gGameEngine.removeEntity(this);
		gGameEngine.deferredKill.push(this);
		var index = gInput.activeAbilities.indexOf(this.body);
		gPhysicsEngine.removeBody(gInput.activeAbilities[index]);
	},
	update: function(){
		this.expire = this.expire + 1;
		if(this.expire==(60*10)/*10 seconds*/){
			this.kill();
			this.expire = 0;
		}
	}
});
gGameEngine.factory['Grow_1']=Grow_1_Class;

Ramp_Class = EntityClass.extend({
	expire:0,
	entityDef:{
		id: '',
		type: 'static',
		position: {x:0, y:0},
		radius: 0,
		shape: 'circle',
		isSensor: true,
	},
	kill: function(){
		gGameEngine.removeEntity(this);
		gGameEngine.deferredKill.push(this);
		var index = gInput.activeAbilities.indexOf(this.body);
		gPhysicsEngine.removeBody(gInput.activeAbilities[index]);
	},
	update: function(){
		this.expire = this.expire + 1;
		if(this.expire==(60*20)/*20seconds*/){
			this.kill();
			this.expire = 0;
		}
	},
});
gGameEngine.factory['Ramp']=Ramp_Class;

GrowSpeedClass = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['GrowSpeed']=GrowSpeedClass;

DoubleGrowClass = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['DoubleGrow']=DoubleGrowClass;

SuperSpeedClass = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['SuperSpeed']=SuperSpeedClass;

GrowSlowClass = EntityClass.extend({
	entityDef:{},
	kill: function(){},
	update: function(){}
});
gGameEngine.factory['GrowSlow']=GrowSlowClass;

EdgeClass = EntityClass.extend({
	entityDef:{
	id: "",
	shape: 'edge',
	type: 'static',
	position: {x:0, y:0},
	vert1:{x:0, y:0},
	vert2:{x:0, y:0}
	}
});
gGameEngine.factory['Edge']=EdgeClass;

DeathClass = EntityClass.extend({
	entityDef:{
		id:"death",
		shape:'box',
		type: 'static',
		position: {x:0, y:0},
		width: 0,
		height: 0,
	}
});
gGameEngine.factory['Death']=DeathClass;
	




