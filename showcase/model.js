/* 403266: Fabrizio Andreoli
** model.js
** Model a chess king piece.
*/

(function (exports) {
	var scale = 1/187; // King object scale factor. Makes base into [1,1].
	var cnubsKingRots = [[0,0], // [0,0] in order to have a closed object (at bottom).
 [161,0], [161,1], [162,5], [175,11], [187,23], [186,30], [169,53], [176,75], [169,103],
 [140,149], [141,164], [142,170], [144,178], [125,192], [77,448], [88,532], [105,533],
 [120,538], [125,551], [120,568], [110,577], [115,588], [110,601], [109,602], [107,603],
 [105,604], [95,611], [96,622], [105,633], [104,648], [97,656], [104,703], [115,726],
 [125,750], [124,763], [120,769], [91,784],
 [30,793], [25, 810], [15, 890], [15, 900], // Vertical part of cross of the cross of the king.
 [0, 900] ]; // Closing the top of the king

	// cnubsCross is used to create a cyl-like  object centered on Z axis, that makes the
	// horizontal part of the cross of the king. Use the same scale factor of cnubsKingRots.
	var cnubsCross = [[0,-40], [15,-40],  [15, 40], [0, 40] ];

/*	var cnubsPawn = [[0,0], // [Radius = 0,] in order to have a closed object (at bottom).
	             [44,0], // To build base, 0 on Z axis.
	             [44,23],[32,24],[36,25],[39,28],[28,40],[20,58],[17,73],[21,90],[14,95],
	             [19,101],[24,113],[20,130],[13,138],[8,141], [3,143],
	             [0,143]]; // 0 on Radius to make a closed (on top) object.
	var scale = 1/44; // Pawn object scale factor. Makes base into [1,1]. */

	function BuildObjectRotatingXyNUBS(cnubs, scale, powdivs, nNUBS, knots, domain2)
	{
		// Create an object by a rotating NUBS. Only cnubs parameter is mandatory
		// Model a NUBS curve that is rotated on X,Y planes to obtain a 3D object.

		// INPUT cnubs: Array of [Radius,Z]. Contains control points for NUBS, remember that first coordinate is radius and then Z...other coordinates are ignored ([[,]] not [[,,]]). First and last must have Radius=0 in order to have a closed object.
		// INPUT scale: Object scale factor
		// INPUT powdivs: 2*PI is divided by (2^powdivs); only one BEZIER curve is calculated (by 0 to (2*PI/(2^powdivs)) degree). Then is replicated with affine transformations.
		// INPUT nNUBS: BEZIER curve is calcultated on nNUBS NUBS curves (equally) rotated by planes(X,Y) from 0 to (2*PI/(2^powdivs)) degree.
		// INPUT knots: knots for NUBS, if is it null then is calculated with standard formula...
		// INPUT domain2: Domain for BEZIER curve
		// OUTPUT surface built by passed parameters

//		var domain1 = INTERVALS(1)(cnubs.length*2); // Only used for DEBUG printout
		if (scale == null) scale = 1.0;
		if (powdivs == null) powdivs = 5;
		if (nNUBS == null) nNUBS = 4;
		if (knots == null)
		{
			knots = new Array();

			knots[0] = knots[1] = knots[2] = 0;
			var i=cnubs.length-3;
			knots[i+3] = knots[i+4] = knots[i+5] = i+1;
			for (; i>0; i--) knots[i+2] = i;
		}
		if (domain2 == null) domain2 = DOMAIN([[0,1],[0,1]])([cnubs.length*3,nNUBS]); 

		var cc = new Array();
	
		var ndivangle = Math.pow(2, powdivs);
	
		var alfaK = 2*Math.PI/ndivangle;

		for (r=0; r<=nNUBS; r++)
		{
			var alfa = alfaK * r / nNUBS;
			// cnubs array doesn't have X coordinate: create ctrlAlfa for NUBS()()()() function
			var ctrlAlfa = AA(function(p) { return [p[0]*COS(alfa) * scale, p[0]*SIN(alfa) *scale, p[1] *scale] })(cnubs);
			cc[r] = NUBS(S0)(2)(knots)(ctrlAlfa);
		}
/* // DEBUG
var curve0 = COLOR([1,0,0])(MAP(cc[0])(domain1));
DRAW(curve0);
var curve1 = COLOR([0,1,0])(MAP(cc[1])(domain1));
DRAW(curve1);
*/
		var sb = BEZIER(S1)(cc);
		var surfp = MAP(sb)(domain2);
		//DRAW(surfp);
	
		slices = new Array();
		slices[0] = surfp;
		for (c=1; c<=powdivs; c++)
		{
			slices[c] = STRUCT([slices[c-1], ROTATE([0,1])(alfaK*Math.pow(2, c-1))(slices[c-1])]);
		}
		return STRUCT(slices);
	}

	var c = R([0,2])(PI/2)( BuildObjectRotatingXyNUBS(cnubsCross, scale) );
	var zOffset = (cnubsKingRots[cnubsKingRots.length-1][1]-cnubsCross[1][0]*2)*scale;
	cylcross =  T([2])([zOffset])( c );

	var model = STRUCT([BuildObjectRotatingXyNUBS(cnubsKingRots, scale), cylcross]);
	var colorModel = COLOR([1,1,1])( model );

	exports.m =  colorModel;

	DRAW(model);
			
}(this)) // "this" often is window (global variable)
