class Vector {
	constructor( x=0, y=0 ) {
		this.x = x;
		this.y = y;
		this.type = "Vector";
	}
	static Add( v1, v2 ) {
		return new Vector( v1.x + v2.x, v1.y + v2.y );
	}
	static Neg( v ) {
		return new Vector( -v.x, -v.y );
	}
	static Sub( v1, v2 ) {
		return Vector.Add( v1, Vector.Neg( v2 ) );
	}
	static Mul( v1, v2 ) {
		if( v2.type === "Vector" ) {
			return new Vector( v1.x * v2.x, v1.y * v2.y );
		} else {
			return new Vector( v1.x * v2, v1.y * v2 );
		}
	}
	static Div( v1, v2 ) {
		if( v2.type === "Vector" ) {
			return new Vector( v1.x / v2.x, v1.y / v2.y );
		} else {
			return new Vector( v1.x / v2, v1.y / v2 );
		}
	}
	static Len( v ) {
		return Math.sqrt( Math.pow( v.x, 2 ) + Math.pow( v.y, 2 ) );
	}
	static Norm( v ) {
		var len = Vector.Len( v );
		return Vector.Div( v, len );
	}
	static Dist( v1, v2 ) {
		return Vector.Len( Vector.Sub( v1, v2 ) );
	}
	get length() { return Vector.Len( this ); }
}

class VectorPolar extends Vector {
	constructor( theta, d ) {
		super();
		this.theta = theta;
		this.distance = d;
		this.type = "Vector";
	}
	static ToRectangular( v ) {
		return Vector.Mul( new Vector( Math.cos( v.theta ), Math.sin( v.theta ) ), v.distance );
	}
}

class ColorHSL {
	constructor( h=Math.random()*360, s = 100, l = 30+Math.random()*40 ) {
		this.h = h;
		this.s = s;
		this.l = l;	
	}
	static toString( col ) {
		return "hsl(" + col.h + "," + col.s + "%," + col.l + "%)";
	}
}
