/* 403266: Fabrizio Andreoli
** exercise1.js
*/

(function (exports) {

var wallT = 0.2; // wallThickness
var y;
var floor3d;
var poolHeight = -0.1;
var tileHeight = 0.1;

// The floor is at height = 0

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

function create_tile(x, y, xx, yy, h)
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
	return T([0,1])([x,y])(SIMPLEX_GRID([[1], [1], [h]]));
}

function create_pool(x, y, xx, yy, h)
{
	return T([0,1,2])([x,y,(poolHeight-h)])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [h]]));
}

function create_wall(x, y, xx, yy, h)
{
	return T([0,1])([x,y])(SIMPLEX_GRID([[(xx-x)], [(yy-y)], [h]]));
}

function create_xstripe(x, y, xx, yy, h)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	var r = create_tile(x, y, xx, yy, h);
	if ((x+1)<xx)
	{
		for (var k =x+1; k<xx; k++){
			r = addStruct( r, create_tile(k, y, k+1, yy, h) );
		}
	}
	return r;
}

function create_grid1x1(x0, y0, xx, yy, h)
{
	if ((x0<xx) && (y0<yy))
	{
		var f2d = create_xstripe(x0, y0, xx, (y0+1), h); //Stripe of big tiles at y=="+y0
		for (var y=y0+1; y<=yy; y++)
		{
			var stripe = create_xstripe(x0, y, xx, (y+1), h); //Stripe of big tiles at y=="+y
			if (stripe)
			{
				f2d = addStruct( f2d , stripe );
			}
		}
		return f2d;
	}
	return null;
}

floor3d = create_pool(1, 1, 21, 10); // Pool 1
floor3d = addStruct( floor3d, create_pool(47, 5, 51, 16) ); // Pool 2
floor3d = addStruct( floor3d, create_xstripe(0, 0, 39) ); //Stripe of big tiles at y==0
floor3d = addStruct( floor3d, create_tile(0, 1) ); //Tile at (0,1)

floor3d = addStruct( floor3d, create_grid1x1(21, 1, 36, 3) ); //Grid1x1 at (21,1)

floor3d = addStruct( floor3d, create_xstripe(21, 4, 52) ); //Stripe of big tiles at y==4

floor3d = addStruct( floor3d, create_tile(51, 5) ); //Tile at (51,5)
floor3d = addStruct( floor3d, create_grid1x1(21, 5, 47, 9) ); //Grid1x1 at (21,5)

floor3d = addStruct( floor3d, create_grid1x1(1, 10, 47, 15) ); //Grid1x1 at (1,10)

floor3d = addStruct( floor3d, create_xstripe(1, 16, 39) ); //Stripe of big tiles at y==16

floor3d = addStruct( floor3d, create_grid1x1(1, 17, 9, 21) ); //Grid1x1 at (1,17)

floor3d = addStruct( floor3d, create_wall((1-wallT), (1-wallT), 7.5, 1) );
floor3d = addStruct( floor3d, create_wall((1-wallT), (1-wallT), 1, (22+wallT)) );

exports.floor3d = floor3d;
 
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
