/* 403266: Fabrizio Andreoli
** exercise1.js
** I'am sorry for poor commenting
*/

(function (exports) {

var wallThickness = 0.2;
var y;
var floor2d;

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

function create_tile(x, y, xx, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if ((!xx) || ("undefined" == typeof xx))
	{
		xx = x+1;
	}
	return POLYLINE([[x,y], [xx,y], [xx,yy], [x,yy], [x,y]]);
}

function create_pool(x, y, xx, yy)
{
	return POLYLINE([[x,y], [xx,y], [xx,yy], [x,yy], [x,y]]);
}


function create_wall(x, y, xx, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+wallThickness;
	}
	return POLYLINE([[x,y], [xx,y], [xx,yy], [x,yy], [x,y]]);
}

function create_xstripe(x, y, xx, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	var r = create_tile(x, y, xx, yy);
	if ((x+1)<xx)
	{
		r = addStruct( r, POLYLINE([[(x+1),y], [(x+1),yy]]) );
		if ((x+2) < xx)
		{
			for (var k =x+2; k<xx; k++){
				r = addStruct( r, POLYLINE([[k,y], [k,yy]]) );
			}
		}
	}
	return r;
}

function create_grid1x1(x0, y0, xx, yy)
{
	if ((x0<xx) && (y0<yy))
	{
		var f2d = create_xstripe(x0, y0, xx); //Stripe of big tiles at y=="+y0
		for (var y=y0+1; y<=yy; y++)
		{
			var stripe = create_xstripe(x0, y, xx); //Stripe of big tiles at y=="+y
			if (stripe)
			{
				f2d = addStruct( f2d , stripe);
			}
		}
		return f2d;
	}
	return null;
}

floor2d = create_pool(1, 1, 21, 10); // Pool 1
floor2d = addStruct( floor2d, create_pool(47, 5, 51, 16) ); // Pool 2
floor2d = addStruct( floor2d, create_xstripe(0, 0, 39) ); //Stripe of big tiles at y==0
floor2d = addStruct( floor2d, create_tile(0, 1) ); //Tile at (0,1)

floor2d = addStruct( floor2d, create_grid1x1(21, 1, 36, 3) ); //Grid1x1 at (21,1)

floor2d = addStruct( floor2d, create_xstripe(21, 4, 52) ); //Stripe of big tiles at y==4

floor2d = addStruct( floor2d, create_tile(51, 5) ); //Tile at (51,5)
floor2d = addStruct( floor2d, create_grid1x1(21, 5, 47, 9) ); //Grid1x1 at (21,5)

floor2d = addStruct( floor2d, create_grid1x1(1, 10, 47, 15) ); //Grid1x1 at (1,10)

floor2d = addStruct( floor2d, create_xstripe(1, 16, 39) ); //Stripe of big tiles at y==16

floor2d = addStruct( floor2d, create_grid1x1(1, 17, 9, 21) ); //Grid1x1 at (1,17)

floor2d = addStruct( floor2d, create_wall((1-wallThickness), (1-wallThickness), 7.5, 1) );
floor2d = addStruct( floor2d, create_wall((1-wallThickness), (1-wallThickness), 1, (22+wallThickness)) );

exports.floor2d = floor2d;
 
if (floor2d)
{
	// Draw the 2D floor
	DRAW(floor2d);
}
else
{
	console.log("Error no floor2d!!!");
}

}(this)) // "this" often is window (global variable)
