/* 403266: Fabrizio Andreoli
** exercise1.js
*/
/*
** To automate grids creation, using only POLYLINE() and STRUCT() I used
** the JS code placed on next comment-block.
** It's hard to write a file from JS, and so I used a lot of console.log()
** and then copy&paste the console output into exercise1.js
*/ 
/* */
function log_tile(logstr, nitem, x, xx, y, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if (logstr && (logstr != ""))
	{
		console.log(logstr);
	}
	console.log("var structid"+nitem+" = POLYLINE([["+x+","+y+"], ["+xx+","+y+"], ["+xx+","+yy+"], ["+x+","+yy+"], ["+x+","+y+"]]);");
	return nitem+1;
}

function log_pool(logstr, nitem, x, xx, y, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if (logstr && (logstr != ""))
	{
		console.log(logstr);
	}
	console.log("var structid"+nitem+" = POLYLINE([["+x+","+y+"], ["+xx+","+y+"], ["+xx+","+yy+"], ["+x+","+yy+"], ["+x+","+y+"]]);");
	return nitem+1;
}

function log_xstripe(logstr, nitem, x, xx, y, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+1;
	}
	if (logstr && (logstr != ""))
	{
		console.log(logstr);
	}
	log_tile("", nitem++, x, xx, y, yy);
	if ((x+1)<xx)
	{
		console.log("var structid"+nitem+" = STRUCT([ POLYLINE([["+(x+1)+","+y+"], ["+(x+1)+","+yy+"]])");
		if ((x+2) < xx)
		{
			for (var k =x+2; k<xx; k++){
				console.log("		, POLYLINE([["+k+","+y+"], ["+k+","+yy+"]])");
			}
		}
		console.log("		]);");
	}
	return nitem+1;
}

var wallT = 0.2; // wallThickness

function log_wall(logstr, nitem, x, xx, y, yy)
{
	if ((!yy) || ("undefined" == typeof yy))
	{
		yy = y+wallT;
	}
	if (logstr && (logstr != ""))
	{
		if (logstr == "//*")
		{
			console.log("// Wall from ("+x+","+y+") to ("+xx+","+yy+")");
		}
		else
		{
			console.log(logstr);
		}
	}
	console.log("var structid"+nitem+" = POLYLINE([["+x+","+y+"], ["+xx+","+y+"], ["+xx+","+yy+"], ["+x+","+yy+"], ["+x+","+y+"]]);");
	return nitem+1;
}


var structitem = 0;
var y;

structitem = log_pool("//Large pool", structitem, 1, 21, 1, 10); // Pool 1
structitem = log_pool("//Small pool", structitem, 47, 51, 5, 16); // Pool 2

structitem = log_xstripe("//Stripe of big tiles at y==0", structitem, 0, 39, 0);
structitem = log_tile("//Grid at (0,1)", structitem, 0, 1, 1);
for (y=1; y<=3; y++)
{
	structitem = log_xstripe("//Stripe of big tiles at y=="+y, structitem, 21, 36, y);
}

structitem = log_xstripe("//Stripe of big tiles at y==4", structitem, 21, 52, 4);

for (y=5; y<=9; y++)
{
	structitem = log_xstripe("//Stripe of big tiles at y=="+y, structitem, 21, 47, y);
}

for (y=10; y<=15; y++)
{
	structitem = log_xstripe("//Stripe of big tiles at y=="+y, structitem, 1, 47, y);
}

structitem = log_xstripe("//Stripe of big tiles at y==16", structitem, 1, 39, 16);

for (y=17; y<=21; y++)
{
	structitem = log_xstripe("//Stripe of big tiles at y=="+y, structitem, 1, 9, y);
}

structitem = log_wall("//*", structitem, (1-wallT), 7.5, (1-wallT), 1);
structitem = log_wall("//*", structitem, (1-wallT), 1, (1-wallT), (22+wallT));


if (structitem>0)
{
	structitem--;
	console.log("// Create floor2d structure");
	console.log("var floor2d = STRUCT([ structid"+structitem);
	while (structitem-->0)
	{
		console.log("		, structid"+structitem);
	}
	console.log("		]);");	
	console.log("// Draw the 2D floor");
	console.log("DRAW(floor2d);");	
}
else
{
	console.log("Error no floor2D!!!");
}

*/

/* exercise1.js */
//Large pool
var structid0 = POLYLINE([[1,1], [21,1], [21,10], [1,10], [1,1]]);
//Small pool
var structid1 = POLYLINE([[47,5], [51,5], [51,16], [47,16], [47,5]]);
//Stripe of big tiles at y==0
var structid2 = POLYLINE([[0,0], [39,0], [39,1], [0,1], [0,0]]);
var structid3 = STRUCT([ POLYLINE([[1,0], [1,1]])
		, POLYLINE([[2,0], [2,1]])
		, POLYLINE([[3,0], [3,1]])
		, POLYLINE([[4,0], [4,1]])
		, POLYLINE([[5,0], [5,1]])
		, POLYLINE([[6,0], [6,1]])
		, POLYLINE([[7,0], [7,1]])
		, POLYLINE([[8,0], [8,1]])
		, POLYLINE([[9,0], [9,1]])
		, POLYLINE([[10,0], [10,1]])
		, POLYLINE([[11,0], [11,1]])
		, POLYLINE([[12,0], [12,1]])
		, POLYLINE([[13,0], [13,1]])
		, POLYLINE([[14,0], [14,1]])
		, POLYLINE([[15,0], [15,1]])
		, POLYLINE([[16,0], [16,1]])
		, POLYLINE([[17,0], [17,1]])
		, POLYLINE([[18,0], [18,1]])
		, POLYLINE([[19,0], [19,1]])
		, POLYLINE([[20,0], [20,1]])
		, POLYLINE([[21,0], [21,1]])
		, POLYLINE([[22,0], [22,1]])
		, POLYLINE([[23,0], [23,1]])
		, POLYLINE([[24,0], [24,1]])
		, POLYLINE([[25,0], [25,1]])
		, POLYLINE([[26,0], [26,1]])
		, POLYLINE([[27,0], [27,1]])
		, POLYLINE([[28,0], [28,1]])
		, POLYLINE([[29,0], [29,1]])
		, POLYLINE([[30,0], [30,1]])
		, POLYLINE([[31,0], [31,1]])
		, POLYLINE([[32,0], [32,1]])
		, POLYLINE([[33,0], [33,1]])
		, POLYLINE([[34,0], [34,1]])
		, POLYLINE([[35,0], [35,1]])
		, POLYLINE([[36,0], [36,1]])
		, POLYLINE([[37,0], [37,1]])
		, POLYLINE([[38,0], [38,1]])
		]);
//Grid at (0,1)
var structid4 = POLYLINE([[0,1], [1,1], [1,2], [0,2], [0,1]]);
//Stripe of big tiles at y==1
var structid5 = POLYLINE([[21,1], [36,1], [36,2], [21,2], [21,1]]);
var structid6 = STRUCT([ POLYLINE([[22,1], [22,2]])
		, POLYLINE([[23,1], [23,2]])
		, POLYLINE([[24,1], [24,2]])
		, POLYLINE([[25,1], [25,2]])
		, POLYLINE([[26,1], [26,2]])
		, POLYLINE([[27,1], [27,2]])
		, POLYLINE([[28,1], [28,2]])
		, POLYLINE([[29,1], [29,2]])
		, POLYLINE([[30,1], [30,2]])
		, POLYLINE([[31,1], [31,2]])
		, POLYLINE([[32,1], [32,2]])
		, POLYLINE([[33,1], [33,2]])
		, POLYLINE([[34,1], [34,2]])
		, POLYLINE([[35,1], [35,2]])
		]);
//Stripe of big tiles at y==2
var structid7 = POLYLINE([[21,2], [36,2], [36,3], [21,3], [21,2]]);
var structid8 = STRUCT([ POLYLINE([[22,2], [22,3]])
		, POLYLINE([[23,2], [23,3]])
		, POLYLINE([[24,2], [24,3]])
		, POLYLINE([[25,2], [25,3]])
		, POLYLINE([[26,2], [26,3]])
		, POLYLINE([[27,2], [27,3]])
		, POLYLINE([[28,2], [28,3]])
		, POLYLINE([[29,2], [29,3]])
		, POLYLINE([[30,2], [30,3]])
		, POLYLINE([[31,2], [31,3]])
		, POLYLINE([[32,2], [32,3]])
		, POLYLINE([[33,2], [33,3]])
		, POLYLINE([[34,2], [34,3]])
		, POLYLINE([[35,2], [35,3]])
		]);
//Stripe of big tiles at y==3
var structid9 = POLYLINE([[21,3], [36,3], [36,4], [21,4], [21,3]]);
var structid10 = STRUCT([ POLYLINE([[22,3], [22,4]])
		, POLYLINE([[23,3], [23,4]])
		, POLYLINE([[24,3], [24,4]])
		, POLYLINE([[25,3], [25,4]])
		, POLYLINE([[26,3], [26,4]])
		, POLYLINE([[27,3], [27,4]])
		, POLYLINE([[28,3], [28,4]])
		, POLYLINE([[29,3], [29,4]])
		, POLYLINE([[30,3], [30,4]])
		, POLYLINE([[31,3], [31,4]])
		, POLYLINE([[32,3], [32,4]])
		, POLYLINE([[33,3], [33,4]])
		, POLYLINE([[34,3], [34,4]])
		, POLYLINE([[35,3], [35,4]])
		]);
//Stripe of big tiles at y==4
var structid11 = POLYLINE([[21,4], [52,4], [52,5], [21,5], [21,4]]);
var structid12 = STRUCT([ POLYLINE([[22,4], [22,5]])
		, POLYLINE([[23,4], [23,5]])
		, POLYLINE([[24,4], [24,5]])
		, POLYLINE([[25,4], [25,5]])
		, POLYLINE([[26,4], [26,5]])
		, POLYLINE([[27,4], [27,5]])
		, POLYLINE([[28,4], [28,5]])
		, POLYLINE([[29,4], [29,5]])
		, POLYLINE([[30,4], [30,5]])
		, POLYLINE([[31,4], [31,5]])
		, POLYLINE([[32,4], [32,5]])
		, POLYLINE([[33,4], [33,5]])
		, POLYLINE([[34,4], [34,5]])
		, POLYLINE([[35,4], [35,5]])
		, POLYLINE([[36,4], [36,5]])
		, POLYLINE([[37,4], [37,5]])
		, POLYLINE([[38,4], [38,5]])
		, POLYLINE([[39,4], [39,5]])
		, POLYLINE([[40,4], [40,5]])
		, POLYLINE([[41,4], [41,5]])
		, POLYLINE([[42,4], [42,5]])
		, POLYLINE([[43,4], [43,5]])
		, POLYLINE([[44,4], [44,5]])
		, POLYLINE([[45,4], [45,5]])
		, POLYLINE([[46,4], [46,5]])
		, POLYLINE([[47,4], [47,5]])
		, POLYLINE([[48,4], [48,5]])
		, POLYLINE([[49,4], [49,5]])
		, POLYLINE([[50,4], [50,5]])
		, POLYLINE([[51,4], [51,5]])
		]);
//Stripe of big tiles at y==5
var structid13 = POLYLINE([[21,5], [47,5], [47,6], [21,6], [21,5]]);
var structid14 = STRUCT([ POLYLINE([[22,5], [22,6]])
		, POLYLINE([[23,5], [23,6]])
		, POLYLINE([[24,5], [24,6]])
		, POLYLINE([[25,5], [25,6]])
		, POLYLINE([[26,5], [26,6]])
		, POLYLINE([[27,5], [27,6]])
		, POLYLINE([[28,5], [28,6]])
		, POLYLINE([[29,5], [29,6]])
		, POLYLINE([[30,5], [30,6]])
		, POLYLINE([[31,5], [31,6]])
		, POLYLINE([[32,5], [32,6]])
		, POLYLINE([[33,5], [33,6]])
		, POLYLINE([[34,5], [34,6]])
		, POLYLINE([[35,5], [35,6]])
		, POLYLINE([[36,5], [36,6]])
		, POLYLINE([[37,5], [37,6]])
		, POLYLINE([[38,5], [38,6]])
		, POLYLINE([[39,5], [39,6]])
		, POLYLINE([[40,5], [40,6]])
		, POLYLINE([[41,5], [41,6]])
		, POLYLINE([[42,5], [42,6]])
		, POLYLINE([[43,5], [43,6]])
		, POLYLINE([[44,5], [44,6]])
		, POLYLINE([[45,5], [45,6]])
		, POLYLINE([[46,5], [46,6]])
		]);
//Stripe of big tiles at y==6
var structid15 = POLYLINE([[21,6], [47,6], [47,7], [21,7], [21,6]]);
var structid16 = STRUCT([ POLYLINE([[22,6], [22,7]])
		, POLYLINE([[23,6], [23,7]])
		, POLYLINE([[24,6], [24,7]])
		, POLYLINE([[25,6], [25,7]])
		, POLYLINE([[26,6], [26,7]])
		, POLYLINE([[27,6], [27,7]])
		, POLYLINE([[28,6], [28,7]])
		, POLYLINE([[29,6], [29,7]])
		, POLYLINE([[30,6], [30,7]])
		, POLYLINE([[31,6], [31,7]])
		, POLYLINE([[32,6], [32,7]])
		, POLYLINE([[33,6], [33,7]])
		, POLYLINE([[34,6], [34,7]])
		, POLYLINE([[35,6], [35,7]])
		, POLYLINE([[36,6], [36,7]])
		, POLYLINE([[37,6], [37,7]])
		, POLYLINE([[38,6], [38,7]])
		, POLYLINE([[39,6], [39,7]])
		, POLYLINE([[40,6], [40,7]])
		, POLYLINE([[41,6], [41,7]])
		, POLYLINE([[42,6], [42,7]])
		, POLYLINE([[43,6], [43,7]])
		, POLYLINE([[44,6], [44,7]])
		, POLYLINE([[45,6], [45,7]])
		, POLYLINE([[46,6], [46,7]])
		]);
//Stripe of big tiles at y==7
var structid17 = POLYLINE([[21,7], [47,7], [47,8], [21,8], [21,7]]);
var structid18 = STRUCT([ POLYLINE([[22,7], [22,8]])
		, POLYLINE([[23,7], [23,8]])
		, POLYLINE([[24,7], [24,8]])
		, POLYLINE([[25,7], [25,8]])
		, POLYLINE([[26,7], [26,8]])
		, POLYLINE([[27,7], [27,8]])
		, POLYLINE([[28,7], [28,8]])
		, POLYLINE([[29,7], [29,8]])
		, POLYLINE([[30,7], [30,8]])
		, POLYLINE([[31,7], [31,8]])
		, POLYLINE([[32,7], [32,8]])
		, POLYLINE([[33,7], [33,8]])
		, POLYLINE([[34,7], [34,8]])
		, POLYLINE([[35,7], [35,8]])
		, POLYLINE([[36,7], [36,8]])
		, POLYLINE([[37,7], [37,8]])
		, POLYLINE([[38,7], [38,8]])
		, POLYLINE([[39,7], [39,8]])
		, POLYLINE([[40,7], [40,8]])
		, POLYLINE([[41,7], [41,8]])
		, POLYLINE([[42,7], [42,8]])
		, POLYLINE([[43,7], [43,8]])
		, POLYLINE([[44,7], [44,8]])
		, POLYLINE([[45,7], [45,8]])
		, POLYLINE([[46,7], [46,8]])
		]);
//Stripe of big tiles at y==8
var structid19 = POLYLINE([[21,8], [47,8], [47,9], [21,9], [21,8]]);
var structid20 = STRUCT([ POLYLINE([[22,8], [22,9]])
		, POLYLINE([[23,8], [23,9]])
		, POLYLINE([[24,8], [24,9]])
		, POLYLINE([[25,8], [25,9]])
		, POLYLINE([[26,8], [26,9]])
		, POLYLINE([[27,8], [27,9]])
		, POLYLINE([[28,8], [28,9]])
		, POLYLINE([[29,8], [29,9]])
		, POLYLINE([[30,8], [30,9]])
		, POLYLINE([[31,8], [31,9]])
		, POLYLINE([[32,8], [32,9]])
		, POLYLINE([[33,8], [33,9]])
		, POLYLINE([[34,8], [34,9]])
		, POLYLINE([[35,8], [35,9]])
		, POLYLINE([[36,8], [36,9]])
		, POLYLINE([[37,8], [37,9]])
		, POLYLINE([[38,8], [38,9]])
		, POLYLINE([[39,8], [39,9]])
		, POLYLINE([[40,8], [40,9]])
		, POLYLINE([[41,8], [41,9]])
		, POLYLINE([[42,8], [42,9]])
		, POLYLINE([[43,8], [43,9]])
		, POLYLINE([[44,8], [44,9]])
		, POLYLINE([[45,8], [45,9]])
		, POLYLINE([[46,8], [46,9]])
		]);
//Stripe of big tiles at y==9
var structid21 = POLYLINE([[21,9], [47,9], [47,10], [21,10], [21,9]]);
var structid22 = STRUCT([ POLYLINE([[22,9], [22,10]])
		, POLYLINE([[23,9], [23,10]])
		, POLYLINE([[24,9], [24,10]])
		, POLYLINE([[25,9], [25,10]])
		, POLYLINE([[26,9], [26,10]])
		, POLYLINE([[27,9], [27,10]])
		, POLYLINE([[28,9], [28,10]])
		, POLYLINE([[29,9], [29,10]])
		, POLYLINE([[30,9], [30,10]])
		, POLYLINE([[31,9], [31,10]])
		, POLYLINE([[32,9], [32,10]])
		, POLYLINE([[33,9], [33,10]])
		, POLYLINE([[34,9], [34,10]])
		, POLYLINE([[35,9], [35,10]])
		, POLYLINE([[36,9], [36,10]])
		, POLYLINE([[37,9], [37,10]])
		, POLYLINE([[38,9], [38,10]])
		, POLYLINE([[39,9], [39,10]])
		, POLYLINE([[40,9], [40,10]])
		, POLYLINE([[41,9], [41,10]])
		, POLYLINE([[42,9], [42,10]])
		, POLYLINE([[43,9], [43,10]])
		, POLYLINE([[44,9], [44,10]])
		, POLYLINE([[45,9], [45,10]])
		, POLYLINE([[46,9], [46,10]])
		]);
//Stripe of big tiles at y==10
var structid23 = POLYLINE([[1,10], [47,10], [47,11], [1,11], [1,10]]);
var structid24 = STRUCT([ POLYLINE([[2,10], [2,11]])
		, POLYLINE([[3,10], [3,11]])
		, POLYLINE([[4,10], [4,11]])
		, POLYLINE([[5,10], [5,11]])
		, POLYLINE([[6,10], [6,11]])
		, POLYLINE([[7,10], [7,11]])
		, POLYLINE([[8,10], [8,11]])
		, POLYLINE([[9,10], [9,11]])
		, POLYLINE([[10,10], [10,11]])
		, POLYLINE([[11,10], [11,11]])
		, POLYLINE([[12,10], [12,11]])
		, POLYLINE([[13,10], [13,11]])
		, POLYLINE([[14,10], [14,11]])
		, POLYLINE([[15,10], [15,11]])
		, POLYLINE([[16,10], [16,11]])
		, POLYLINE([[17,10], [17,11]])
		, POLYLINE([[18,10], [18,11]])
		, POLYLINE([[19,10], [19,11]])
		, POLYLINE([[20,10], [20,11]])
		, POLYLINE([[21,10], [21,11]])
		, POLYLINE([[22,10], [22,11]])
		, POLYLINE([[23,10], [23,11]])
		, POLYLINE([[24,10], [24,11]])
		, POLYLINE([[25,10], [25,11]])
		, POLYLINE([[26,10], [26,11]])
		, POLYLINE([[27,10], [27,11]])
		, POLYLINE([[28,10], [28,11]])
		, POLYLINE([[29,10], [29,11]])
		, POLYLINE([[30,10], [30,11]])
		, POLYLINE([[31,10], [31,11]])
		, POLYLINE([[32,10], [32,11]])
		, POLYLINE([[33,10], [33,11]])
		, POLYLINE([[34,10], [34,11]])
		, POLYLINE([[35,10], [35,11]])
		, POLYLINE([[36,10], [36,11]])
		, POLYLINE([[37,10], [37,11]])
		, POLYLINE([[38,10], [38,11]])
		, POLYLINE([[39,10], [39,11]])
		, POLYLINE([[40,10], [40,11]])
		, POLYLINE([[41,10], [41,11]])
		, POLYLINE([[42,10], [42,11]])
		, POLYLINE([[43,10], [43,11]])
		, POLYLINE([[44,10], [44,11]])
		, POLYLINE([[45,10], [45,11]])
		, POLYLINE([[46,10], [46,11]])
		]);
//Stripe of big tiles at y==11
var structid25 = POLYLINE([[1,11], [47,11], [47,12], [1,12], [1,11]]);
var structid26 = STRUCT([ POLYLINE([[2,11], [2,12]])
		, POLYLINE([[3,11], [3,12]])
		, POLYLINE([[4,11], [4,12]])
		, POLYLINE([[5,11], [5,12]])
		, POLYLINE([[6,11], [6,12]])
		, POLYLINE([[7,11], [7,12]])
		, POLYLINE([[8,11], [8,12]])
		, POLYLINE([[9,11], [9,12]])
		, POLYLINE([[10,11], [10,12]])
		, POLYLINE([[11,11], [11,12]])
		, POLYLINE([[12,11], [12,12]])
		, POLYLINE([[13,11], [13,12]])
		, POLYLINE([[14,11], [14,12]])
		, POLYLINE([[15,11], [15,12]])
		, POLYLINE([[16,11], [16,12]])
		, POLYLINE([[17,11], [17,12]])
		, POLYLINE([[18,11], [18,12]])
		, POLYLINE([[19,11], [19,12]])
		, POLYLINE([[20,11], [20,12]])
		, POLYLINE([[21,11], [21,12]])
		, POLYLINE([[22,11], [22,12]])
		, POLYLINE([[23,11], [23,12]])
		, POLYLINE([[24,11], [24,12]])
		, POLYLINE([[25,11], [25,12]])
		, POLYLINE([[26,11], [26,12]])
		, POLYLINE([[27,11], [27,12]])
		, POLYLINE([[28,11], [28,12]])
		, POLYLINE([[29,11], [29,12]])
		, POLYLINE([[30,11], [30,12]])
		, POLYLINE([[31,11], [31,12]])
		, POLYLINE([[32,11], [32,12]])
		, POLYLINE([[33,11], [33,12]])
		, POLYLINE([[34,11], [34,12]])
		, POLYLINE([[35,11], [35,12]])
		, POLYLINE([[36,11], [36,12]])
		, POLYLINE([[37,11], [37,12]])
		, POLYLINE([[38,11], [38,12]])
		, POLYLINE([[39,11], [39,12]])
		, POLYLINE([[40,11], [40,12]])
		, POLYLINE([[41,11], [41,12]])
		, POLYLINE([[42,11], [42,12]])
		, POLYLINE([[43,11], [43,12]])
		, POLYLINE([[44,11], [44,12]])
		, POLYLINE([[45,11], [45,12]])
		, POLYLINE([[46,11], [46,12]])
		]);
//Stripe of big tiles at y==12
var structid27 = POLYLINE([[1,12], [47,12], [47,13], [1,13], [1,12]]);
var structid28 = STRUCT([ POLYLINE([[2,12], [2,13]])
		, POLYLINE([[3,12], [3,13]])
		, POLYLINE([[4,12], [4,13]])
		, POLYLINE([[5,12], [5,13]])
		, POLYLINE([[6,12], [6,13]])
		, POLYLINE([[7,12], [7,13]])
		, POLYLINE([[8,12], [8,13]])
		, POLYLINE([[9,12], [9,13]])
		, POLYLINE([[10,12], [10,13]])
		, POLYLINE([[11,12], [11,13]])
		, POLYLINE([[12,12], [12,13]])
		, POLYLINE([[13,12], [13,13]])
		, POLYLINE([[14,12], [14,13]])
		, POLYLINE([[15,12], [15,13]])
		, POLYLINE([[16,12], [16,13]])
		, POLYLINE([[17,12], [17,13]])
		, POLYLINE([[18,12], [18,13]])
		, POLYLINE([[19,12], [19,13]])
		, POLYLINE([[20,12], [20,13]])
		, POLYLINE([[21,12], [21,13]])
		, POLYLINE([[22,12], [22,13]])
		, POLYLINE([[23,12], [23,13]])
		, POLYLINE([[24,12], [24,13]])
		, POLYLINE([[25,12], [25,13]])
		, POLYLINE([[26,12], [26,13]])
		, POLYLINE([[27,12], [27,13]])
		, POLYLINE([[28,12], [28,13]])
		, POLYLINE([[29,12], [29,13]])
		, POLYLINE([[30,12], [30,13]])
		, POLYLINE([[31,12], [31,13]])
		, POLYLINE([[32,12], [32,13]])
		, POLYLINE([[33,12], [33,13]])
		, POLYLINE([[34,12], [34,13]])
		, POLYLINE([[35,12], [35,13]])
		, POLYLINE([[36,12], [36,13]])
		, POLYLINE([[37,12], [37,13]])
		, POLYLINE([[38,12], [38,13]])
		, POLYLINE([[39,12], [39,13]])
		, POLYLINE([[40,12], [40,13]])
		, POLYLINE([[41,12], [41,13]])
		, POLYLINE([[42,12], [42,13]])
		, POLYLINE([[43,12], [43,13]])
		, POLYLINE([[44,12], [44,13]])
		, POLYLINE([[45,12], [45,13]])
		, POLYLINE([[46,12], [46,13]])
		]);
//Stripe of big tiles at y==13
var structid29 = POLYLINE([[1,13], [47,13], [47,14], [1,14], [1,13]]);
var structid30 = STRUCT([ POLYLINE([[2,13], [2,14]])
		, POLYLINE([[3,13], [3,14]])
		, POLYLINE([[4,13], [4,14]])
		, POLYLINE([[5,13], [5,14]])
		, POLYLINE([[6,13], [6,14]])
		, POLYLINE([[7,13], [7,14]])
		, POLYLINE([[8,13], [8,14]])
		, POLYLINE([[9,13], [9,14]])
		, POLYLINE([[10,13], [10,14]])
		, POLYLINE([[11,13], [11,14]])
		, POLYLINE([[12,13], [12,14]])
		, POLYLINE([[13,13], [13,14]])
		, POLYLINE([[14,13], [14,14]])
		, POLYLINE([[15,13], [15,14]])
		, POLYLINE([[16,13], [16,14]])
		, POLYLINE([[17,13], [17,14]])
		, POLYLINE([[18,13], [18,14]])
		, POLYLINE([[19,13], [19,14]])
		, POLYLINE([[20,13], [20,14]])
		, POLYLINE([[21,13], [21,14]])
		, POLYLINE([[22,13], [22,14]])
		, POLYLINE([[23,13], [23,14]])
		, POLYLINE([[24,13], [24,14]])
		, POLYLINE([[25,13], [25,14]])
		, POLYLINE([[26,13], [26,14]])
		, POLYLINE([[27,13], [27,14]])
		, POLYLINE([[28,13], [28,14]])
		, POLYLINE([[29,13], [29,14]])
		, POLYLINE([[30,13], [30,14]])
		, POLYLINE([[31,13], [31,14]])
		, POLYLINE([[32,13], [32,14]])
		, POLYLINE([[33,13], [33,14]])
		, POLYLINE([[34,13], [34,14]])
		, POLYLINE([[35,13], [35,14]])
		, POLYLINE([[36,13], [36,14]])
		, POLYLINE([[37,13], [37,14]])
		, POLYLINE([[38,13], [38,14]])
		, POLYLINE([[39,13], [39,14]])
		, POLYLINE([[40,13], [40,14]])
		, POLYLINE([[41,13], [41,14]])
		, POLYLINE([[42,13], [42,14]])
		, POLYLINE([[43,13], [43,14]])
		, POLYLINE([[44,13], [44,14]])
		, POLYLINE([[45,13], [45,14]])
		, POLYLINE([[46,13], [46,14]])
		]);
//Stripe of big tiles at y==14
var structid31 = POLYLINE([[1,14], [47,14], [47,15], [1,15], [1,14]]);
var structid32 = STRUCT([ POLYLINE([[2,14], [2,15]])
		, POLYLINE([[3,14], [3,15]])
		, POLYLINE([[4,14], [4,15]])
		, POLYLINE([[5,14], [5,15]])
		, POLYLINE([[6,14], [6,15]])
		, POLYLINE([[7,14], [7,15]])
		, POLYLINE([[8,14], [8,15]])
		, POLYLINE([[9,14], [9,15]])
		, POLYLINE([[10,14], [10,15]])
		, POLYLINE([[11,14], [11,15]])
		, POLYLINE([[12,14], [12,15]])
		, POLYLINE([[13,14], [13,15]])
		, POLYLINE([[14,14], [14,15]])
		, POLYLINE([[15,14], [15,15]])
		, POLYLINE([[16,14], [16,15]])
		, POLYLINE([[17,14], [17,15]])
		, POLYLINE([[18,14], [18,15]])
		, POLYLINE([[19,14], [19,15]])
		, POLYLINE([[20,14], [20,15]])
		, POLYLINE([[21,14], [21,15]])
		, POLYLINE([[22,14], [22,15]])
		, POLYLINE([[23,14], [23,15]])
		, POLYLINE([[24,14], [24,15]])
		, POLYLINE([[25,14], [25,15]])
		, POLYLINE([[26,14], [26,15]])
		, POLYLINE([[27,14], [27,15]])
		, POLYLINE([[28,14], [28,15]])
		, POLYLINE([[29,14], [29,15]])
		, POLYLINE([[30,14], [30,15]])
		, POLYLINE([[31,14], [31,15]])
		, POLYLINE([[32,14], [32,15]])
		, POLYLINE([[33,14], [33,15]])
		, POLYLINE([[34,14], [34,15]])
		, POLYLINE([[35,14], [35,15]])
		, POLYLINE([[36,14], [36,15]])
		, POLYLINE([[37,14], [37,15]])
		, POLYLINE([[38,14], [38,15]])
		, POLYLINE([[39,14], [39,15]])
		, POLYLINE([[40,14], [40,15]])
		, POLYLINE([[41,14], [41,15]])
		, POLYLINE([[42,14], [42,15]])
		, POLYLINE([[43,14], [43,15]])
		, POLYLINE([[44,14], [44,15]])
		, POLYLINE([[45,14], [45,15]])
		, POLYLINE([[46,14], [46,15]])
		]);
//Stripe of big tiles at y==15
var structid33 = POLYLINE([[1,15], [47,15], [47,16], [1,16], [1,15]]);
var structid34 = STRUCT([ POLYLINE([[2,15], [2,16]])
		, POLYLINE([[3,15], [3,16]])
		, POLYLINE([[4,15], [4,16]])
		, POLYLINE([[5,15], [5,16]])
		, POLYLINE([[6,15], [6,16]])
		, POLYLINE([[7,15], [7,16]])
		, POLYLINE([[8,15], [8,16]])
		, POLYLINE([[9,15], [9,16]])
		, POLYLINE([[10,15], [10,16]])
		, POLYLINE([[11,15], [11,16]])
		, POLYLINE([[12,15], [12,16]])
		, POLYLINE([[13,15], [13,16]])
		, POLYLINE([[14,15], [14,16]])
		, POLYLINE([[15,15], [15,16]])
		, POLYLINE([[16,15], [16,16]])
		, POLYLINE([[17,15], [17,16]])
		, POLYLINE([[18,15], [18,16]])
		, POLYLINE([[19,15], [19,16]])
		, POLYLINE([[20,15], [20,16]])
		, POLYLINE([[21,15], [21,16]])
		, POLYLINE([[22,15], [22,16]])
		, POLYLINE([[23,15], [23,16]])
		, POLYLINE([[24,15], [24,16]])
		, POLYLINE([[25,15], [25,16]])
		, POLYLINE([[26,15], [26,16]])
		, POLYLINE([[27,15], [27,16]])
		, POLYLINE([[28,15], [28,16]])
		, POLYLINE([[29,15], [29,16]])
		, POLYLINE([[30,15], [30,16]])
		, POLYLINE([[31,15], [31,16]])
		, POLYLINE([[32,15], [32,16]])
		, POLYLINE([[33,15], [33,16]])
		, POLYLINE([[34,15], [34,16]])
		, POLYLINE([[35,15], [35,16]])
		, POLYLINE([[36,15], [36,16]])
		, POLYLINE([[37,15], [37,16]])
		, POLYLINE([[38,15], [38,16]])
		, POLYLINE([[39,15], [39,16]])
		, POLYLINE([[40,15], [40,16]])
		, POLYLINE([[41,15], [41,16]])
		, POLYLINE([[42,15], [42,16]])
		, POLYLINE([[43,15], [43,16]])
		, POLYLINE([[44,15], [44,16]])
		, POLYLINE([[45,15], [45,16]])
		, POLYLINE([[46,15], [46,16]])
		]);
//Stripe of big tiles at y==16
var structid35 = POLYLINE([[1,16], [39,16], [39,17], [1,17], [1,16]]);
var structid36 = STRUCT([ POLYLINE([[2,16], [2,17]])
		, POLYLINE([[3,16], [3,17]])
		, POLYLINE([[4,16], [4,17]])
		, POLYLINE([[5,16], [5,17]])
		, POLYLINE([[6,16], [6,17]])
		, POLYLINE([[7,16], [7,17]])
		, POLYLINE([[8,16], [8,17]])
		, POLYLINE([[9,16], [9,17]])
		, POLYLINE([[10,16], [10,17]])
		, POLYLINE([[11,16], [11,17]])
		, POLYLINE([[12,16], [12,17]])
		, POLYLINE([[13,16], [13,17]])
		, POLYLINE([[14,16], [14,17]])
		, POLYLINE([[15,16], [15,17]])
		, POLYLINE([[16,16], [16,17]])
		, POLYLINE([[17,16], [17,17]])
		, POLYLINE([[18,16], [18,17]])
		, POLYLINE([[19,16], [19,17]])
		, POLYLINE([[20,16], [20,17]])
		, POLYLINE([[21,16], [21,17]])
		, POLYLINE([[22,16], [22,17]])
		, POLYLINE([[23,16], [23,17]])
		, POLYLINE([[24,16], [24,17]])
		, POLYLINE([[25,16], [25,17]])
		, POLYLINE([[26,16], [26,17]])
		, POLYLINE([[27,16], [27,17]])
		, POLYLINE([[28,16], [28,17]])
		, POLYLINE([[29,16], [29,17]])
		, POLYLINE([[30,16], [30,17]])
		, POLYLINE([[31,16], [31,17]])
		, POLYLINE([[32,16], [32,17]])
		, POLYLINE([[33,16], [33,17]])
		, POLYLINE([[34,16], [34,17]])
		, POLYLINE([[35,16], [35,17]])
		, POLYLINE([[36,16], [36,17]])
		, POLYLINE([[37,16], [37,17]])
		, POLYLINE([[38,16], [38,17]])
		]);
// Wall from (0.8,0.8) to (7.5,1)
var structid37 = POLYLINE([[0.8,0.8], [7.5,0.8], [7.5,1], [0.8,1], [0.8,0.8]]);
// Wall from (0.8,0.8) to (1,22.2)
var structid38 = POLYLINE([[0.8,0.8], [1,0.8], [1,22.2], [0.8,22.2], [0.8,0.8]]);
// Create floor2d structure
var floor2d = STRUCT([ structid38
		, structid37
		, structid36
		, structid35
		, structid34
		, structid33
		, structid32
		, structid31
		, structid30
		, structid29
		, structid28
		, structid27
		, structid26
		, structid25
		, structid24
		, structid23
		, structid22
		, structid21
		, structid20
		, structid19
		, structid18
		, structid17
		, structid16
		, structid15
		, structid14
		, structid13
		, structid12
		, structid11
		, structid10
		, structid9
		, structid8
		, structid7
		, structid6
		, structid5
		, structid4
		, structid3
		, structid2
		, structid1
		, structid0
		]);
// Draw the 2D floor
DRAW(floor2d);
