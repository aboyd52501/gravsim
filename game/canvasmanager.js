function initCanvas( self, frameRate=60 ) {
	
	var w; var h;
	
	var canvas = document.getElementById("gravity-sim");
	var context = canvas.getContext("2d");
	
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
			var pos = new VectorPolar( Math.PI*2*Math.random(), ( Math.random()**1 )*1000 );
			particles.AddParticle( new Particle(
				pos,
				Vector.Rotate( Vector.Mul(pos, 1/100), Math.PI/4 ),
				Math.random()*400
			) );
		}
	}
	
	function Tick() {
		
		viewOffset = particles.massCenter;
		context.clearRect( 0, 0, w, h );
		//context.fillStyle="black"; context.fillRect( 0, 0, w, h );
		
		context.save();
		context.translate(w/2, h/2);
		context.scale(viewZoom, viewZoom);
		context.translate(-viewOffset.x, -viewOffset.y);
		
		particles.StepParticles( gravityConstant, timeStep );
		particles.DrawParticles( context );
		
		// new body indicator
		context.restore()
		if( mouseDown ) {
			context.beginPath();
			context.moveTo( pPos.x, pPos.y );
			context.lineTo( mouseX, mouseY );
			context.strokeStyle = "#FFFFFF";
			context.stroke();
		};
		
		// canvas outline
		context.rect(0,0,w,h);
		context.stroke();
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
				new Vector( mouseX, mouseY ),
				128*Math.cbrt(mass), 64
			); }
	} );
	
	// fit the canvas to the window
	$( window ).resize( function() {
		// Resize canvas
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = w;
		canvas.height = h;
	});
	// we need to actually set the canvas size though at first 
	$(window).resize();
	
	// TODO: implement functions for tracking canvas transformations and doing them forward and backward on other vectors.
	/* $("#gravity-sim").click( function( click ) {
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
	} ); */
	
	$("#gravity-sim").mousemove( function( mouse ) {
		mouseX = mouse.offsetX; mouseY = mouse.offsetY;
	} );
	
	fillScreen( 512 );
	
	setInterval( Tick, 1000/frameRate );
	
}

document.addEventListener( "DOMContentLoaded", initCanvas );
