/* 403266: Fabrizio Andreoli
** exercise3.js
*/

(function (exports) {

var poolHeight = -0.1;
var poolDeep = 0.5;
var tileHeight = 0.1;
var tileDrain = 0.02;
var floorHeight = 1;
var wallHeight = 3;
var wallThickness = 0.2;
var benchThickness = 0.1;
var benchDrain = 0.02;
var underBenchWidth = 0.3;
var pillarSizeAThird = 0.1;
var x;
var floor3d;

function addStruct( s, adding )
{
	if (!s)
	{
		if (adding)
		{
			return adding;
		}
		else
		{
			return null;
		}
	}
	else
	{
		if (adding)
		{
			return STRUCT([ s, adding ]);
		}
		else
		{
			return s;
		}
	}
}

function createTile(x, y, xx, yy, h)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if ((!xx) || ("undefined" == typeof xx))
	{
		xx = x+1;
	}
	if ((!h) || ("undefined" == typeof h))
	{
		h = tileHeight;
	}
	return T([0,1,2])([x,y,floorHeight])(SIMPLEX_GRID([[1-tileDrain,-tileDrain], [1-tileDrain,-tileDrain], [h]]));
}

function createPool(x, y, xx, yy, h)
{
	if ((!h) || ("undefined" == typeof h))
	{
		h = poolDeep;
	}
	return T([0,1,2])([x,y,(floorHeight+poolHeight-h)])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [h]]));
}

function createWall(x, y, xx, yy, h)
{
	if ((!h) || ("undefined" == typeof h))
	{
		h = wallHeight;
	}
	return T([0,1,2])([x,y,floorHeight])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [h]]));
}

function createCeiling(x, y, xx, yy, h, t)
{
	if ((!h) || ("undefined" == typeof h))
	{
		h = wallHeight;
	}
	if ((!t) || ("undefined" == typeof t))
	{
		t = wallThickness;
	}
	return T([0,1,2])([x,y,(floorHeight+h)])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [t]]));
}

function createXStripe(x, y, xx, yy, h)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if ((!h) || ("undefined" == typeof h))
	{
		h = tileHeight;
	}
	var r = createTile(x, y, xx, yy, h);
	if ((x+1)<xx)
	{
		for (var k =x+1; k<xx; k++){
			r = addStruct( r, createTile(k, y, k+1, yy, h) );
		}
	}
	return r;
}

function createGrid1x1(x0, y0, xx, yy, h)
{
	if ((x0<xx) && (y0<yy))
	{
		if ((!h) || ("undefined" == typeof h))
		{
			h = tileHeight;
		}
		var f2d = createXStripe(x0, y0, xx, (y0+1), h); //Stripe of big tiles at y=="+y0
		for (var y=y0+1; y<=yy; y++)
		{
			var stripe = createXStripe(x0, y, xx, (y+1), h); //Stripe of big tiles at y=="+y
			if (stripe)
			{
				f2d = addStruct( f2d , stripe );
			}
		}
		return f2d;
	}
	return null;
}

function createBench(x, y, xx, yy, h)
{
	if ((!h) || ("undefined" == typeof h))
	{
		h = benchThickness;
	}
//	console.log("createBench: x="+x+" y="+y+" xx="+xx+" yy="+yy+" h="+h);
	return T([0,1,2])([x,y,(floorHeight+underBenchWidth)])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [h]]));
}
function createBenchStripeAndUnderBench(addX, x, y, xx, yy, h)
{	
	var r = null;
	var xUnder;

	if ((!h) || ("undefined" == typeof h))
	{
		h = benchThickness;
	}
	if (addX == addX) // Correct values passed?
	{
		xUnder = x - addX;
		// Create stripe of bench
		for (var k=x; k<xx; k+=addX){
			r = addStruct( r, createBench(k+(benchDrain/2), y, (k+addX-(benchDrain/2)), yy, h) );
		}
		// Create stripe of under-bench
		while (xUnder<=(xx+addX)){
//			console.log("AddUnderBench: x="+xUnder+" y="+y+" xx="+(xUnder+addX)+" yy="+yy+" h="+h);
			r = addStruct( r, T([0,1,2])([xUnder,y,floorHeight])(SIMPLEX_GRID([[underBenchWidth], [(yy-y)], [underBenchWidth]])) );
			xUnder += addX;
		}
		return r;
	}
	else
		return null;
}

function createPillar(x,y,h)
{
	if ((!h) || ("undefined" == typeof h))
	{
		h = wallHeight;
	}
	return T([0,1,2])([x-(pillarSizeAThird*3/2),y-(pillarSizeAThird*3/2),floorHeight])(
		STRUCT([SIMPLEX_GRID([[pillarSizeAThird,-pillarSizeAThird,pillarSizeAThird], [-pillarSizeAThird,pillarSizeAThird], [h]]),
			SIMPLEX_GRID([[-pillarSizeAThird,pillarSizeAThird], [pillarSizeAThird,-pillarSizeAThird,pillarSizeAThird], [h]]),
			SIMPLEX_GRID([[-pillarSizeAThird,pillarSizeAThird], [-pillarSizeAThird,pillarSizeAThird], [h]])]) );
}


// Create pools
var pools = createPool(1, 1, 21, 10); // Pool 1
pools = addStruct( pools, createPool(47, 5, 51, 16) ); // Pool 2

pools = COLOR([0,0,0.8])(pools); // Water is blue

// Create big tiles
var tiles = addStruct( null, createXStripe(0, 0, 39) ); //Stripe of big tiles at y==0
tiles = addStruct( tiles, createTile(0, 1) ); //Tile at (0,1)

tiles = addStruct( tiles, createGrid1x1(21, 1, 36, 3) ); //Grid1x1 at (21,1)

tiles = addStruct( tiles, createXStripe(21, 4, 52) ); //Stripe of big tiles at y==4

tiles = addStruct( tiles, createTile(51, 5) ); //Tile at (51,5)
tiles = addStruct( tiles, createGrid1x1(21, 5, 47, 9) ); //Grid1x1 at (21,5)

tiles = addStruct( tiles, createGrid1x1(1, 10, 47, 15) ); //Grid1x1 at (1,10)

tiles = addStruct( tiles, createXStripe(1, 16, 39) ); //Stripe of big tiles at y==16

tiles = addStruct( tiles, createGrid1x1(1, 17, 9, 21) ); //Grid1x1 at (1,17)

tiles = COLOR([0.26,0.26,0.4])(tiles); // Tiles are brown

// Create bench
var bench = addStruct( null, createBench(6.9, 14, 9.2, 14.6) );
bench = addStruct( bench, createBenchStripeAndUnderBench(2, 9.2, 14, 19.7, 14.6) );
bench = addStruct( bench, createBench(19.7, 14, 22, 14.6) );
bench = COLOR([0.26,0.26,0.4])(bench); // Same as tiles

// Create walls
var walls = addStruct( null, createWall((1-wallThickness), (1-wallThickness), 7.5, 1) );
walls = addStruct( walls, createWall((1-wallThickness), (1-wallThickness), 1, (22+wallThickness)) );
walls = addStruct( walls, createWall(1, 22, (9+wallThickness), (22+wallThickness)) );
walls = addStruct( walls, createWall(9, (17+wallThickness), (9+wallThickness), 22) );

walls = addStruct( walls, createWall(6.5, 15, 26.5, (15+wallThickness)) );
walls = COLOR([0.9,0.81,0.7])(walls);

var ceiling = createCeiling(24, 4, 47, 17, wallHeight, wallThickness);
ceiling = COLOR([1,1,1])(ceiling);

// Create pillars
var pillars = addStruct( null, createPillar(26, 7) );
pillars = addStruct( pillars, createPillar(26, 14) );
pillars = addStruct( pillars, createPillar((26+19/3), 7) );
pillars = addStruct( pillars, createPillar((26+19/3), 14) );
pillars = addStruct( pillars, createPillar((26+38/3), 7) );
pillars = addStruct( pillars, createPillar((26+38/3), 14) );
pillars = addStruct( pillars, createPillar((26+19), 7) );
pillars = addStruct( pillars, createPillar((26+19), 14) );

pillars = COLOR([0.5,0.5,0.5])(pillars); // Steel color for pillars

exports.floor3d = floor3d = STRUCT([pools, tiles, bench, walls, ceiling, pillars]);
 
if (floor3d)
{
	// Draw the 2D floor
	DRAW(floor3d);
}
else
{
	console.log("Error no floor3d!!!");
}

}(this)) // this vale window (variabile globale)
