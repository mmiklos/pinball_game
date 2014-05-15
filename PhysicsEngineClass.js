//TO MAKE AN OBJECT 3 THINGS ARE NEEDED
//1. Fixture definition (new b2FixtureDef,and modify params-- .density, .friction, .restitution)
//2. Body definition (new b2BodyDef, modify params-- .type either .b2_staticBody or .b2_dynamicBody
//						also .position.x and .position.y to position the center of the object)
//3. Shape (new b2PolygonShape; modify params-- .shape.SetAsBox(width, height) to create a box)
//You can then add the created object like so: (depending on var names)
//				world.CreateBody(bodyDef).CreateFixture(fixDef);

//for(b = world.GetBodyList(); b; b = b.GetNext()){} this will itterate through all bodies
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		b2Shape = Box2D.Collision.Shapes.b2Shape;
		b2Vec2 = Box2D.Common.Math.b2Vec2;
		b2Vec3 = Box2D.Common.Math.b2Vec3;
		b2Body = Box2D.Dynamics.b2Body;
		b2BodyDef = Box2D.Dynamics.b2BodyDef;
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		b2TimeStep = Box2D.Dynamics.b2TimeStep;
		b2World = Box2D.Dynamics.b2World;
		b2Collision = Box2D.Collision.b2Collision;
		b2ContactID = Box2D.Collision.b2ContactID;
		b2ContactPoint = Box2D.Collision.b2ContactPoint;
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		b2MassData = Box2D.Collision.Shapes.b2MassData;
		b2ContactListener = Box2D.Dynamics.b2ContactListener;
		b2WorldManifold = Box2D.Collision.b2WorldManifold;
		b2AABB = Box2D.Collision.b2AABB;
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
	

//Build in a scale that changes depending on the size of the canvas, a global variable which will change based on canvas width
//ie if desired canvas width is 1500pixels and someone is playin on a screen with a canvas width of 300 pixels
//they would be facing a scale of 0.2 or 1/5 of the value, thus everything will start to move slower for them to 
//compensate for having 1/5th the screen size. (1/5 screen size =  1/5 scale value)	
PhysicsEngineClass = Class.extend({
	world: null,//An object created in the Box2d physics engine. Will be using this variable to access the engine
	PHYSICS_LOOP_HZ: 1.0/60.0,
	listener: null,
	rampList: [],//stored pinballs currently in the ramp

	create: function() {
		this.world = new b2World(
			new b2Vec2(0,0),	//Gravity Vector
			true);			//Boolean for allowing Sleep
	},
	listen: function() {
		var w_manifold = new b2WorldManifold();
		var points = new b2Vec2; // Creating a vector to store points
		var num;
		this.listener = new b2ContactListener();
		this.listener.BeginContact = function(contact){
				//num = contact.GetManifold().m_pointCount; // Gets the number of point of contact between two bodies.
				contact.GetWorldManifold(w_manifold);
				points = w_manifold.m_points; // stores all the points
				//for(i=0; i < num; i++)  {
					fA=contact.GetFixtureA();
					fB=contact.GetFixtureB();
					b1=fA.GetBody().GetUserData(); //Gets userdata for body 1
					b2=fB.GetBody().GetUserData(); //Gets userdata for body 2
					sA=fA.IsSensor();
					sB=fB.IsSensor();
					if(b1=='player' || b2=='player'){
						gPhysicsEngine.bumperImpulse(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody());
						if(b1=='pinball' || b2=='pinball'){
							if(gGameEngine.pointSystem>0){
							gGameEngine.multiply = gGameEngine.multiply + 0.01
							}
						}
					}else if (b1=='slow' || b2=='slow'){
						if ((sA && !sB) || (!sA && sB)){
							if(sA){
								gPhysicsEngine.slowDetection(contact.GetFixtureB().GetBody());
							}else if(sB){
								gPhysicsEngine.slowDetection(contact.GetFixtureA().GetBody());
							}
						}
					}else if (b1=='ramp' || b2=='ramp'){
						if((sA && !sB) || (!sA && sB)){
							if(sA){
								gPhysicsEngine.rampList.push(fB.GetBody());
								
							}else{
								gPhysicsEngine.rampList.push(fA.GetBody());
							}
						}
					}else if (b1=='death' || b2=='death'){
						if(b1=='death'){
							var pinball = fB.GetBody();
						}else{
							var pinball = fA.GetBody();
						}
						gPhysicsEngine.removeBody(pinball);
						gGameEngine.pointSystem = gGameEngine.pointSystem - 1;
						if(gGameEngine.pointSystem==0){
							$('#final').html('Game Over<br /><b>Final: '+gGameEngine.coinSystem*gGameEngine.multiply+'</b>');
						}
					}
				//}
			};
		this.listener.EndContact = function(contact){
			fA=contact.GetFixtureA();
			fB=contact.GetFixtureB();
			b1=fA.GetBody().GetUserData(); //Gets userdata for body 1
			b2=fB.GetBody().GetUserData(); //Gets userdata for body 2
			sA=fA.IsSensor();
			sB=fB.IsSensor();
			if(b1=='ramp' || b2=='ramp'){
				if((sA && !sB) || (!sA && sB)){
					if(sA){
						var leave = gPhysicsEngine.rampList.indexOf(fB.GetBody());
					}else{//sB
						var leave = gPhysicsEngine.rampList.indexOf(fA.GetBody());
					}
					gPhysicsEngine.rampList.splice(leave, 1);
				}
			}
		};
	},
	update: function() {
		var start = Date.now();
		this.world.SetContactListener(this.listener);
		this.world.Step(this.PHYSICS_LOOP_HZ, 10, 10);//(updateTime, velocity vector, iterations)
		this.world.DrawDebugData();
		gPhysicsEngine.world.ClearForces();//gets rid of any accelerations through gravity, ie removed gliding
		return(Date.now() - start);
	},
	registerBody: function (bodyDef){
		var body = gPhysicsEngine.world.CreateBody(bodyDef);
		return body;
	},
	
	addBody: function (entityDef) {
		var bodyDef = new b2BodyDef();
		var id = entityDef.id;
		
		if(entityDef.type == 'static'){
			bodyDef.type = b2Body.b2_staticBody;
		}else if(entityDef.type == 'kinematic'){
			bodyDef.type = b2Body.b2_kinematicBody;
		}else{//dynamic
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		
		if(entityDef.position.x < 0){
		bodyDef.position.x = canvas.width/2;
		bodyDef.position.y = canvas.height/2;
		}else{
		bodyDef.position.Set(entityDef.position.x, entityDef.position.y);
		}
		var fixDef = new b2FixtureDef();
		
		if(entityDef.isSensor){
			fixDef.isSensor = true;
		}
		
		if(entityDef.useBouncyFixture){
			fixDef.density = 5.0;
			fixDef.friction = 0.0;
			fixDef.restitution = 1.0;
		}else{
			fixDef.density = 5.0;
			fixDef.friction = 1.0;
			fixDef.restitution = 1.0;
		}
		
		var body = gPhysicsEngine.registerBody(bodyDef);
		
		if(entityDef.shape == 'circle'){
			if(id=='pinball.png'){
				body.SetUserData("pinball");
				entityDef.radius = (canvas.width*0.005);
			}
			var shape = new b2CircleShape(entityDef.radius);
			body.SetAngle(Math.PI*2*Math.random());
			fixDef.shape = shape;
			fixDef.shape.b2CircleShape(entityDef.radius);
		}else if (entityDef.shape == 'box'){
			var shape = new b2PolygonShape();
			fixDef.shape = shape;
			fixDef.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
		}else if(entityDef.shape = 'edge'){
			var shape = new b2PolygonShape();
			fixDef.shape = shape;
			fixDef.shape.SetAsEdge(new b2Vec2(entityDef.vert1.x, entityDef.vert1.y), new b2Vec2(entityDef.vert2.x, entityDef.vert2.y))
		}
		body.CreateFixture(fixDef);
		return body;
	
	},
	getPosX: function(obj){
		var pos = new b2Vec2;
		pos = obj.GetPosition();
		return pos.x;
	},
	getPosY: function(obj){
		var pos = new b2Vec2;
		pos = obj.GetPosition();
		return pos.y;
	},
	initializeVelocity: function(obj){
		var sign1 = Math.round(Math.random());
		var sign2 = Math.round(Math.random());
		if (sign1==0) sign1 = -1;
		if (sign2==0) sign2 = -1;
		var x = sign2*Math.random()*(SCALE*2);
		var y = sign1*Math.sqrt((SCALE*SCALE*4)-(x*x));
		obj.SetLinearVelocity(new b2Vec2(x, y));
	},
	bumperMovementRight: function(obj){
		obj.SetAwake(true);
		obj.SetLinearVelocity(new b2Vec2(SCALE*5,0));
	},	
	bumperMovementLeft: function(obj){
		obj.SetAwake(true);
		obj.SetLinearVelocity(new b2Vec2(SCALE*(-5),0));
	},	
	bumperMovementStop: function(obj){
		obj.SetAwake(false);
	},	
	increaseVelocity: function(obj){
	//store initial x/y values before calling this function for ease of stopping infinite increase
		obj.SetAwake(true);
		var velocity = new b2Vec2;
		velocity = obj.GetLinearVelocity();
		velocity.x = velocity.x+(velocity.x*(SCALE/SCALE)*0.005);
		velocity.y = velocity.y+(velocity.y*(SCALE/SCALE)*0.005);
		obj.SetLinearVelocity(new b2Vec2(velocity.x, velocity.y));
	},
	bumperGrowth: function(bumper, entityDef){
		/*var Ofixtures = obj.GetFixtureList();
		console.log(Ofixtures);
		var Oshape = Ofixtures.GetShape();
		
		var Nfix = new b2FixtureDef();
		Nfix.shape = new b2PolygonShape();
		
		var verts = Oshape.GetVertices();
		var Width = -(verts[0].x - verts[1].x);
		var Height = -(verts[1].y - verts[2].y);
		
		Nfix.shape.SetAsBox((Width/2)*(1.70), (Height/2));
		obj.CreateFixture(Nfix);
		var fixtures = obj.GetFixtureList();
		console.log(fixtures);*/
		//obj.DestroyFixture(Nfix);
		pos = bumper.GetPosition();
		entityDef.position.x = pos.x;
		entityDef.position.y = pos.y;
		entityDef.halfWidth = gGameEngine.entities[0].entityDef.halfWidth*1.8;
		entityDef.halfHeight = gGameEngine.entities[0].entityDef.halfHeight;
		var growth = gPhysicsEngine.addBody(entityDef);
		
		var weldJointDef = new b2WeldJointDef();
		weldJointDef.Initialize(bumper, growth, bumper.GetWorldCenter());
		var WeldJoint = gPhysicsEngine.world.CreateJoint(weldJointDef);
		return growth;
	},
	bumperImpulse: function(body1, body2) {
		var v = new b2Vec2;
		var xNeg = false;
		var yNeg = false;
			if(body1.GetUserData()=='player'){
				v = body2.GetLinearVelocity();
					if(v.x<0) xNeg = true;
					if(v.y<0) yNeg = true;
				console.log(v);
				v.x = Math.abs(v.x);
				v.y = Math.abs(v.y);
				var a=(((v.x)/(v.x+v.y))*v.x)+v.x;
				var b=(((v.y)/(v.x+v.y))*v.y)+v.y;
					if(xNeg) a = -a;
					if(yNeg) b = -b;
				v ={x:a,y:b};
				console.log(v);
				//body2.ApplyImpulse(new b2Vec2(a, b), body2.GetWorldCenter());
				body2.SetLinearVelocity(v);
			}else if(body2.GetUserData()=='player'){
				v = body1.GetLinearVelocity();
					if(v.x<0) xNeg = true;
					if(v.y<0) yNeg = true;
				console.log(v);
				v.x = Math.abs(v.x);
				v.y = Math.abs(v.y);
				var a=(((v.x)/(v.x+v.y))*v.x)+v.x;
				var b=(((v.y)/(v.x+v.y))*v.y)+v.y;
					if(xNeg) a = -a;
					if(yNeg) b = -b;
				v ={x:a,y:b};
				console.log(v);
				//body1.ApplyImpulse(new b2Vec2(a, b), body2.GetWorldCenter());
				body1.SetLinearVelocity(v);
			}	
	},
	slowBeam: function(bumper, entityDef){
		var Height = canvas.height*0.29;
		var Width = canvas.width*0.01;
		var vec = new b2Vec2();
		vec.x = gPhysicsEngine.getPosX(bumper);
		vec.y = gPhysicsEngine.getPosY(bumper);
		entityDef.position.x = vec.x;
		entityDef.position.y = vec.y-Height;
		entityDef.halfWidth = Width;
		entityDef.halfHeight = Height;
		var beam = gPhysicsEngine.addBody(entityDef);
		beam.SetUserData("slow");
		
		var weldJointDef = new b2WeldJointDef();
		weldJointDef.Initialize(bumper, beam, bumper.GetWorldCenter());
		var WeldJoint = gPhysicsEngine.world.CreateJoint(weldJointDef);
		
		return beam;
	},
	slowDetection: function(pinball){
		var vec = new b2Vec2();
		vec = pinball.GetLinearVelocity();
		var Nvec = new b2Vec2();
		Nvec.x = vec.x*0.40;
		Nvec.y = vec.y*0.40;
		pinball.SetLinearVelocity(Nvec);
	},
	ramp: function(entityDef){
		/*var rampDef = new b2BodyDef();
		rampDef.type = b2Body.b2_staticBody;
		rampDef.position.Set(canvas.width/2, canvas.height*0.85);*/
		entityDef.position.x = canvas.width/2;
		entityDef.position.y = canvas.height*0.85;
		entityDef.radius = canvas.width*0.5*0.32;
		var ramp = gPhysicsEngine.addBody(entityDef);
		//var ramp = gPhysicsEngine.world.CreateBody(rampDef);
		/*var rFixDef = new b2FixtureDef();
		rFixDef.isSensor = true;
		rFixDef.shape = new b2CircleShape(canvas.width*0.5*0.32);*/
		ramp.SetUserData("ramp");
		return ramp;
	},
	pushRamp: function(pinballBody, rampBody){
		rampCent = rampBody.GetWorldCenter();
		pinballCent = pinballBody.GetWorldCenter();
		
		x = rampCent.x - pinballCent.x;//Triangle's x-length
		y = rampCent.y - pinballCent.y;//Triangle's y-length
		r = Math.sqrt((x*x)+(y*y));//Ramp's radius, Triangle's Hyp., Magnitude
		
		TopAngle = Math.asin(y/r)+(Math.PI/2);//Angle of circle above horizon
		CircAngle = TopAngle + Math.PI;//Amount of circumpherence angle covered from right horizon point of circle, clockwise
		
		var force = new b2Vec2();
		force.x = -x/r*400;
		force.y = -y/r*400;
		pinballBody.ApplyImpulse(force, pinballBody.GetWorldCenter());
		
		/*var v = new b2Vec2();
		v= pinballBody.GetLinearVelocity();
		v.x = v.x - 0.1*v.x;
		v.y = v.y - 0.1*v.y;
		pinballBody.SetLinearVelocity(v);*/
	},
/*******************************************************************/
/*******************************************************************/
/********ABILITIES************ABILITIES************ABILITIES********/
/*******************************************************************/
/*******************************************************************/
/*
1. *GROWTH ---CURRENTLY NOT DESTROYING IT'S FIXTURE---
2. *ENERGY ---UPON IMPACT WITH A PINBALL, PLACES AN IMPULSE ON SAID
			PINBALL, INCREASING ITS SPEED---REACHING MAXIMUM VELOCITY TOO
			FAST, NEEDS AN ACTIVATION KEY---
3. *SLOW-BEAM ---CONNECTS A BEAM TO THE BUMPER, THE BEAM ACTS AS A 
			SENSOR SO OBJECTS CAN PASS IT, THE BEAM CONNECTS TO THE 
			CENTER OF THE BUMPER AND MMOVES WITH THE BUMPER, ALL BALLS
			PASSING THROUGH THE BEAM WILL HAVE A VELOCITY REDUCED BY
			X% UPON INITIAL IMPACT---COLLISIONS NOT BEING DETECTED, 
			FIXTURE UNABLE TO BE DELETED IN A PRETTY WAY---
4. *ADDRENALINE ---TAKES ALL COOLDOWNS WHICH ARE ACTIVE FROM THE INPUT
			COOLDOWNS GLOBAL, AND SETS ALL GLOBALS BACK TO TRUE SO THEY
			CAN BE USED AGAIN---SEE INPUT PAGE---
5. *RAMP ---PLACES A *RAMP* OBJECT WHICH ACTS AS A SENSOR ON THE PLAYERS 
			QUARTER OF THE FIELD. THIS OBJECT CONTINUOUSLY "PUSHES" OBJECTS
			AWAY WITH A VERY SMALL PUSH FORCE, CALCULATED BY THE DISTANCE 
			THE PINBALL IS FROM THE BUMPER.---ALSO NOT CURRENTLY DISAPEARING---
6. SHIELD ---ALL OBJECTS LOCATED IN THE PLAYERS QUARTER OF THE FILED BECOME
			INVISIBLE. ALL FAKE BALLS THE PLAYER HAS SPAWNED ALSO BECOME 
			INVISIBLE.---
7. FAKE-BALL ---PLAYER SPAWNS A PINBALL WHICH DOES NOT COUNT TOWARDS THE 
			SCORING PARAMETERS, BUT LOOKS THE SAME AS ALL THE OTHER BALLS.
			UPON SCORING ON ANOTHER PLAYER, COOLDOWN TIMERS FOR THE PLAYER 
			ARE ALL REDUCED BY 1 SECOND. 

* = IMPLEMENTED WITH ERROR
- = IMPLEMENTED AND WORKING		
*/

//Make this an entity Later on
	deadzone: function(){
		var death = new b2BodyDef();
		death.type = b2Body.b2_staticBody;
		death.position.Set(canvas.width/2, canvas.height*0.82);
		var deathZone = this.world.CreateBody(death);
		deathZone.SetUserData("death");
		
		var fixDef = new b2FixtureDef();
		fixDef.isSensor = true;
		fixDef.shape = new b2PolygonShape();
		fixDef.shape.SetAsBox(canvas.width*0.18, canvas.height*0.01);
		
		deathZone.CreateFixture(fixDef);
	},
		
		
		

	//TODO: add a velocity vector (set speed, random direction) to the pinball object, have the function update itteratively
	//retrieve the position of its body, and draw the image on the new position
	//clear the previous position's image
	removeBody: function(obj){
		this.world.DestroyBody(obj);
	},
	
	DebugDrawer: function(){
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite ( document.getElementById ("cnvs1").getContext ("2d"));
		debugDraw.SetDrawScale(1);
		debugDraw.SetFillAlpha(0.7); //define transparency
		debugDraw.SetLineThickness(1.0); //defines thickness of lines or boundaries
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);
	},
	
	


});
gPhysicsEngine = new PhysicsEngineClass();