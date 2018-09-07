// Math

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
	static Between( vtarget, v1, v2 ) {
		var minx, maxx, miny, maxy;
		if( v1.x < v2.x ) {
			minx = v1.x;
			maxx = v2.x;
		} else if ( v2.x == v1.x ) {
			return false;
		} else {
			minx = v2.x;
			maxx = v1.x;
		}
		if( v1.y < v2.y ) {
			miny = v1.y;
			maxy = v2.y;
		} else if ( v1.y == v2.y ) {
			return false;
		} else {
			miny = v2.y;
			maxy = v1.y;
		}
		return ( vtarget.x > minx && vtarget.x < maxx ) && ( vtarget.y > miny && vtarget.y < maxy );
	}
	between( v1, v2 ) { return Vector.Between( this, v1, v2 ); }
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

// UI

class ColorRGB {
	constructor( r=255, g=255, b=255 ) {
		this.r=r;
		this.g=g;
		this.b=b;
	}
	static toString( col ) {
		return "rgb("+col.r+","+col.g+","+col.b+")";
	}
}

class ColorHSL {
	constructor( h=Math.random()*360, s=100, l=50 ) {
		this.h = h;
		this.s = s;
		this.l = l;	
	}
	static toString( col ) {
		return "hsl(" + col.h + "," + col.s + "%," + col.l + "%)";
	}
}

class Button {
	constructor( x=0, y=0, width=16, height=16, color=new ColorHSL(), callback=null ) {
		this.xpos = x;
		this.ypos = y;
		this.xsize = width;
		this.ysize = height;
		this.color = color;
		this.onClick = callback;
	}
	
	draw(ctx) {
		
	}
	
	get clickedColor() {
		var col = color;
		col.l = 40;
		return col;
	}
}

class ButtonSet {
	constructor() {
		this.Buttons = [];
	}
	addButton( button ) {
		this.Buttons.push(button);
	}
	removeButton( index ) {
		this.Buttons.splice(index,1);
	}
	render() {
		this.Buttons.forEach( function( button ) {
			button.draw();
		} );
	}
}