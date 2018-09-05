function initCanvas( self, frameRate=24, w=1000, h=900 ) {
	
	var canvas = document.getElementById("gravity-sim");
	var context = canvas.getContext("2d");
	context.width = w; context.height = h;
	canvas.width = w; canvas.height = h;
	
	var viewOffset = new Vector();
	var viewZoom = 1;
	
	var particles = new ParticlePopulation();
	
	var gravityConstant = 1;
	var timeStep = 10/frameRate;
	var viewOffset = particles.massCenter;
	var mass = 1;
	
	var pPos = new Vector();
	var mouseDown = false;
	
	var mouseX; var mouseY;
	
	function disk( position, radius, amount ) {
		for( var i = 0; i < amount; i++ ) {
			var polarOffset = new VectorPolar(Math.PI*2*(i/amount), Math.random()*(radius*3/4) + radius/4 );
			var newPos = Vector.Add( position, VectorPolar.ToRectangular( polarOffset ) );
			var velDir = VectorPolar.ToRectangular( new VectorPolar( polarOffset.theta + Math.PI/2, 1 ) );
			particles.AddParticle( new Particle(
				newPos,
				Vector.Mul( velDir, gravityConstant * Math.cbrt( polarOffset.distance ) ),
				mass
			) );
		}
	}
	
	function fillScreen( amount, velfxn, massfxn ) {
		for( var i = 0; i < amount; i++ ) {
			particles.AddParticle( new Particle(
				new Vector( Math.random()*w, Math.random() * h ),
				velfxn( i ),
				massfxn( i )
			) );
		}
	}
	
	function ScreenToWorld( vec ) {
		var mid = new Vector( w/2, h/2 );
		var rel = Vector.Sub( mid, vec );
		var world = Vector.Add( Vector.Div( rel, viewZoom ), viewOffset );
		return world;
	}
	
	function Draw() {
		viewOffset = particles.massCenter;
		context.clearRect( 0, 0, w, h );
		context.fillStyle="black"; context.fillRect( 0, 0, w, h );
		particles.StepParticles( gravityConstant, timeStep );
		particles.DrawParticles( context, viewOffset, viewZoom );
		if( mouseDown ) {
			context.beginPath();
			context.moveTo( pPos.x, pPos.y );
			context.lineTo( mouseX, mouseY );
			context.strokeStyle = "#FFFFFF";
			context.stroke();
		};
		$("#mass-display")[0].innerHTML = "Mass: " + Math.round(mass*10)/10;
	}
	
	$(document).keypress( function( key ) {
		key = key.keyCode || key.which;
		//console.log( key );
		if( key === 43 ) { viewZoom *= 1.1; }
		if( key === 45 ) { viewZoom /= 1.1; }
		if( key === 57 ) { mass *= Math.sqrt(2); }
		if( key === 54 ) { mass /= Math.sqrt(2); }
		if( key === 32 ) {
			disk(
				ScreenToWorld( new Vector( mouseX, mouseY ) ),
				128*Math.cbrt(mass), 64
			); }
	} );
	
	$("#gravity-sim").click( function( click ) {
		var newPos = ScreenToWorld( new Vector( click.offsetX, click.offsetY ) );
		var oldPos = ScreenToWorld( pPos );
		var pVel = Vector.Sub( newPos, oldPos );
		particles.AddParticle( new Particle(
			oldPos,
			Vector.Div( pVel, 5 ),
			mass
		) );
		mouseDown = false;
	} );
	
	$("#gravity-sim").mousedown( function( mouse ) {
		mouseDown = true;
		pPos = new Vector( mouse.offsetX, mouse.offsetY );
	} );
	
	$("#gravity-sim").mousemove( function( mouse ) {
		mouseX = mouse.offsetX; mouseY = mouse.offsetY;
	} );
	
	fillScreen( 128,
		function( x ) { return new Vector( Math.random()*30-15, Math.random()*30-15 ); },
		function( x ) { return Math.random()*1000; }
	);
	
	setInterval( Draw, 1000/frameRate );
	
}

document.addEventListener( "DOMContentLoaded", initCanvas );
