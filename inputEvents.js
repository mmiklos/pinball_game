// -----------------------------------------------------------------------------
// Syntax functional due to John Resigs Class code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/

InputClass = Class.extend({
	bindings: {},//setup to help bind ASCII key codes to strings...
	actions: {},//...and attaching the codes to actions
	mouse: {x: 0,y: 0},
	availableAction: {},
	activeAbilities: [],
	unavailAction: 0,
	cooldowns: [],
	abilities: {
		move_left: function(){
			gPhysicsEngine.bumperMovementLeft(gGameEngine.entities[0].body);
		},
		move_right: function(){
			gPhysicsEngine.bumperMovementRight(gGameEngine.entities[0].body);
		},
		growth: function(){
			var growth = gGameEngine.spawnEntity('Grow_1');
			growth.body = gPhysicsEngine.bumperGrowth(gGameEngine.entities[0].body, growth.entityDef);
			gInput.activeAbilities.push(growth.body);
		},
		energy: function() {
		},
		slow: function(){
			var slow = gGameEngine.spawnEntity('Slow_1');
			slow.beam = gPhysicsEngine.slowBeam(gGameEngine.entities[0].body, slow.entityDef);
			gInput.activeAbilities.push(slow.beam);
		},
		ramp: function(){
			//if(gInput.actions[gInput.bindings[code]]){
			var ramp = gGameEngine.spawnEntity('Ramp');
			ramp.body = gPhysicsEngine.ramp(ramp.entityDef);
			gInput.activeAbilities.push(ramp.body);
			//}
		},
	},
	resets: {
		growth: function(key){
			setTimeout("var index;" +
			"for(var k in gInput.bindings){"+
				"if (gInput.bindings[k] == 'growth'){"+
					"index = k;"+
				"}"+
			"}"+
			"gInput.availableAction[index] = true; "+
			"console.log(gInput.bindings[index], gInput.availableAction[90], index, gInput.cooldowns[index]);", 15000);
		},
		energy: function(key){
		},
		slow: function(key){
			setTimeout("var index;" +
			"for(var k in gInput.bindings){"+
				"if (gInput.bindings[k] == 'slow'){"+
					"index = k;"+
				"}"+
			"}"+
			"gInput.availableAction[index] = true; "+
			"console.log(gInput.bindings[index], gInput.availableAction[67], index, gInput.cooldowns[index]);", 15000);
		},
		ramp: function(key){
			setTimeout("var index;" +
			"for(var k in gInput.bindings){"+
				"if (gInput.bindings[k] == 'ramp'){"+
					"index = k;"+
				"}"+
			"}"+
			"gInput.availableAction[index] = true; "+
			"console.log(gInput.bindings[index], gInput.availableAction[49], index, gInput.cooldowns[index]);", 30000);
		},
	},
		/*addrenaline: function(){
			for (var key in gInput.availableAction){
				gInput.availableAction[key] = true;
			}
		}*///PROBLEM---PREVIOUS RESETS STILL CONTINUING DOWN COOLDOWN EVEN AFTER ADDRENALIN RESETS THEM
		//CAUSING THEM TO SET TO TRUE AFTER 15 SECONDS FROM THEIR FIRST CALL, REGARDLESS OF WHEN 2ND CALL WAS
	setup: function() {//names here must match function names in 'abilities' object in order to be called
	/*A*/	gInput.bind(65, 'move_left', 0);
	/*<-*/	gInput.bind(37, 'move_left', 0);
	/*->*/	gInput.bind(39, 'move_right', 0);
	/*D*/	gInput.bind(68, 'move_right', 0);
	/*W*/	gInput.bind(87, 'move-up', 0);
	/*^*/	gInput.bind(38, 'move-up', 0);
	/*S*/	gInput.bind(83, 'move-down', 0);
	/*dwn*/	gInput.bind(40, 'move-down', 0);
	/*1*/	gInput.bind(49, 'ramp', 30);
	/*2*/	gInput.bind(50, 'addrenaline', 120);
	/*3*/	gInput.bind(51, 'action3', 0);
	/*4*/	gInput.bind(52, 'action4', 0);
	/*Z*/	gInput.bind(90, 'growth', 25);
	/*z*/	//gInput.bind(122, 'growth', 25);
	/*X*/	gInput.bind(88, 'energy', 20);
	/*x*/	//gInput.bind(120, 'energy', 20);
	/*C*/	gInput.bind(67, 'slow', 15);
	/*c*/	//gInput.bind(99, 'slow', 15);
	
		document.getElementById('cnvs1').addEventListener('mousemove', gInput.onMouseMove);
		document.getElementById('cnvs1').addEventListener('keydown', gInput.onKeyDown);
		document.getElementById('cnvs1').addEventListener('keyup', gInput.onKeyUp);
		
	},
	onMouseMove: function(event) {
		pos = gInput.mouse;
		pos.x = event.clientX;
		pos.y = event.clientY;
		console.log(pos.x, pos.y);
	},
	onKeyDown: function(event){
	//console.log(event.keyCode);
		var action = gInput.bindings[event.keyCode];
		if(action){
			gInput.actions[action] = true;
			//console.log(gInput.actions[action]);
		}
		if(gInput.availableAction[event.keyCode]){
			gInput.abilities[action](event.keyCode);
			if(event.keyCode == 65 || event.keyCode == 68){}
			else{
				gInput.unavil(event.keyCode);
			}
		}
	},
	onKeyUp: function(event){
		var action = gInput.bindings[event.keyCode];
		if (action){
			gInput.actions[action] = false;
			//console.log(gInput.actions[action]);
		}
	},
	bind: function(key, action, cooldown){
		gInput.bindings[key] = action;
		gInput.avail(key);
		gInput.cooldowns[key] = cooldown;
	},
	avail: function(key){
		gInput.availableAction[key] = true;
	},
	unavil: function(key){
		console.log("unavil");
		gInput.availableAction[key] = false;
		gInput.reset(key);
	},//NEED TO MAKE A SEPERATE COOLDOWN FUNCTION FOR EACH ABILITY IT SEEMS
	reset: function(key){//THIS FUNCTION IS RESETING EVERYTHING EACH CALL
	//TODO: TRY AND CREATE A UNIQUE COOLDOWN FUNCTION FOR EACH ABILITY SO AS TO AVOID THIS
	//MAY HAVE TO UTILIZE GLOBAL VARIABLES IF IT COMES DOWN TO IT. 
			if (!gInput.availableAction[key]){
				gInput.resets[gInput.bindings[key]](key)
				//gInput.unavailAction = key;
				//setTimeout("gInput.availableAction[gInput.unavailAction] = true; "+
				//"console.log(gInput.cooldowns[gInput.unavailAction]);", gInput.cooldowns[gInput.unavailAction]*1000);
			}
	},

});

gInput = new InputClass();
