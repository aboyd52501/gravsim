class Particle {
	constructor( pos, vel, mass ) {
		this.position = pos;
		this.velocity = vel;
		this.mass = mass;
		this.type = "Particle";
		this.color = new ColorHSL();
	}
	get radius() {
		return Math.cbrt( this.mass );
	}
	Draw( ctx ) {
		// must be translated and scaled appropriately
		ctx.beginPath();
		ctx.arc(
			this.position.x,
			this.position.y,
			this.radius, 0, 2*Math.PI
		);
		ctx.fillStyle = this.color.string;
		ctx.fill();
		//ctx.stroke();
	}
	// actually applyacceleration but that isn't as catchy
	ApplyForce( force ) {
		this.velocity = Vector.Add( this.velocity, force );
	}
	PhysicsStep( timeMul ) {
		this.position = Vector.Add( this.position, Vector.Mul( this.velocity, timeMul ) );
	}
	static GravityAccel( p1, p2 ) {
		var dist = Vector.Dist( p1.position, p2.position );
		//dist = Vector.Mul( dist, 0.1 );
		var dir = Vector.Norm( Vector.Sub( p2.position, p1.position ) );
		var accel = p2.mass / Math.pow( dist, 2 );
		if( isNaN( accel ) ) { throw( "gravityaccel not a number error" ); }
		return Vector.Mul( dir, accel );
	}
	static CheckCollide( p1, p2 ) {
		var dist = Vector.Dist( p1.position, p2.position );
		return dist < ( p1.radius + p2.radius );
	}
}

class ParticlePopulation {
	constructor() {
		this.Population = [];
		this.type = "ParticlePopulation";
	}
	AddParticle( p ) {
		this.Population.push( p );
	}
	RemoveParticle( index ) {
		this.Population.splice( index, 1 );
	}
	NetGravityAccel( p ) {
		var net = new Vector();
		this.Population.forEach( function( otherp ) {
			if( otherp === p ) { return; }
			net = Vector.Add( net, Particle.GravityAccel( p, otherp ) );
		} );
		return net;
	}
	ApplyGravityForces( g ) {
		var pop = this;
		pop.Population.forEach( function( particle )  {
			var force = Vector.Mul( pop.NetGravityAccel( particle ), g );
			particle.ApplyForce( force );
		} );
	}
	RunCollisions() {
		var pop = this;
		for( var i = 0; i < pop.Population.length; i++ ) {
			var p1 = pop.Population[i];
			for( var j = 0; j < pop.Population.length; j++ ) {
				var p2 = pop.Population[j]
				if( !(p1 === p2 ) && Particle.CheckCollide( p1, p2 ) ) {
					var totalMass = p1.mass + p2.mass
					var newVel = Vector.Add( Vector.Mul( p1.velocity, p1.mass/totalMass ), Vector.Mul( p2.velocity, p2.mass/totalMass ) );
					if( p1.mass >= p2.mass ) {
						p1.mass = totalMass;
						p1.velocity = newVel;
						pop.RemoveParticle( j );
					} else {
						p2.mass = totalMass;
						p2.velocity = newVel;
						pop.RemoveParticle( i );
					}
				}
			}
		}
	}
	StepParticles( g, timeMul ) {
		var gmul = g * timeMul;
		this.ApplyGravityForces( gmul );
		this.RunCollisions();
		this.Population.forEach( function( particle ) {
			particle.PhysicsStep( timeMul );
		} );
	}
	DrawParticles( ctx ) {
		this.Population.forEach( function( particle ) {
			particle.Draw( ctx );
		} );
	}
	get totalMass() {
		var totalMass = 0;
		this.Population.forEach( function( particle ) { totalMass += particle.mass; } );
		return totalMass;
	}
	get massCenter() {
		var avg = new Vector();
		var totalMass = this.totalMass;
		this.Population.forEach( function( particle ) {
			avg = Vector.Add( avg, Vector.Mul( particle.position, particle.mass/totalMass ) );
		} );
		return avg;
	}
}
