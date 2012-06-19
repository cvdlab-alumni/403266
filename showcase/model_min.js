/* 403266: Fabrizio Andreoli
** model.js
** Model a chess board with some king and pawn pieces.
*/

(function (exports) {
/* The data is a two-component vector generated from an image of a king of chess.
** The first component is the number of pixels from the center of the piece to
** its edge in the row (of the image) indicated by the second component.
** In this way the array created is just too big. So I chose a few items:
** I left the items in which the curve "change form"...
*/

var onlyboard = false;
var domainScale=1;
	var bes = 2; // Board element width and height
	var whiteColor = [0.99,0.99,0.99];
	var blackColor = [0.5,0.5,0.0];

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzKingRots = [[0,0], // [0,0] in order to have a closed object (at bottom).
 [161,0], [161,1], [162,5], [175,11], [187,23], [186,30], [169,53], [176,75], [169,103],
 [140,149], [141,164], [142,170], [144,178], [125,192], [77,448], [88,532], [105,533],
 [120,538], [125,551], [120,568], [110,577], [115,588], [110,601], [109,602], [107,603],
 [105,604], [95,611], [96,622], [105,633], [104,648], [97,656], [104,703], [115,726],
 [125,750], [124,763], [120,769], [91,784],
 [30,793], [15, 810], [20, 890], [20, 900], // Vertical part of cross of the cross of the king.
 [0, 900] ]; // Closing the top of the king
	var scaleKing = 1/187; // King object scale factor. Makes base into [1,1].

	// rzCross is used to create a cyl-like  object centered on Z axis, that makes the
	// horizontal part of the cross of the king. Use the same scale factor of rzKingRots.
	var rzCross = [[0,-40], [20,-40], [19,-35],  [10, 0], [19,35],  [15, 40], [0, 40] ];

	var rzPawn = [[0,0], // [Radius = 0,] in order to have a closed object (at bottom).
	             [44,0], // To build base, 0 on Z axis.
	             [44,23],[32,24],[36,25],[39,28],[28,40],[20,58],[17,73],[21,90],[14,95],
	             [19,101],[24,113],[20,130],[13,138],[8,141], [3,143],
	             [0,143]]; // 0 on Radius to make a closed (on top) object.
	var scalePawn = 1/44; // Pawn object scale factor. Makes base into [1,1].

	/* Build3DSurfaceFrom2DCurve() use rz to create one NUBS along Z axis that is
	** replicated nnubs times over 2*PI/(2^powdivs) degrees (along XY plane) then
	** generate a BEZIER surface with that nnubs NUBS. Then replicate the BEZIER
	** surface with affine transformations to reach the 2*PI degrees.
	*/
	function Build3DSurfaceFrom2DCurve(rz, scale, powdivs, nnubs, knots, domain2)
	{
		// INPUT rz: Array of [Radius,Z]. Contains control points for NUBS, remember that first coordinate is radius and then Z...other coordinates are ignored ([[,]] not [[,,]]). First and last must have Radius=0 in order to have a closed object.
		// INPUT scale: Isotropic scale factor
		// INPUT powdivs: Replicate (with affine transformations) 2^powdivs times the BEZIER surface to reach the 2*PI degrees.
		// INPUT nnubs: BEZIER curve is calcultated on nnubs NUBS curves (equally) rotated by planes(X,Y) from 0 to (2*PI/(2^powdivs)) degree.
		// INPUT knots: knots for NUBS, if is it null then is calculated with standard quadratic...
		// INPUT domain2: Domain for BEZIER curve
		// OUTPUT surface built by passed parameters

		var degree = 3; // Degree of NUBS
		// Check for INPUT, eventually fill with default values
		if (scale == null) scale = 1;
		if (powdivs == null) powdivs = 4;
		if (nnubs == null) nnubs = 3;
		if (knots == null)
		{	// knots = [0,0,1,...,n-1,n,n] for quadratic (degree=2) knots
			var i,d;
			knots = new Array();

			d=rz.length-degree+1;
			for (i = 0; i<degree; i++)
			{
				knots[i] = 0;
				knots[rz.length+i] = d;
			}
			i = rz.length - 1;
			for (i; i>=degree; i--) knots[i] = i-degree+1;
			i=rz.length-degree;
		}
		if (domain2 == null) domain2 = DOMAIN([[0,1],[0,1]])([rz.length*domainScale,nnubs]); 

		var cc = new Array();
	
		var ndivangle = Math.pow(2, powdivs);
	
		var alfaK = 2*Math.PI/ndivangle;

		for (r=0; r<=nnubs; r++)
		{
			var alfa = alfaK * r / nnubs;
			// rz array instead of [X,Y,Z] have [Radius,Z]: create ctrlAlfa for NUBS()()()()
			var ctrlAlfa = AA(function(p) { return [p[0]*COS(alfa) * scale, p[0]*SIN(alfa) *scale, p[1] *scale] })(rz);
			cc[r] = NUBS(S0)(2)(knots)(ctrlAlfa);
		}

		var sb = BEZIER(S1)(cc);
		var surfp = MAP(sb)(domain2);
	
		slices = new Array();
		slices[0] = surfp;
		for (c=1; c<=powdivs; c++)
		{
			slices[c] = STRUCT([slices[c-1], ROTATE([0,1])(alfaK*Math.pow(2, c-1))(slices[c-1])]);
		}
		return STRUCT(slices);
	}


if (onlyboard == false)
{
	var c = R([0,2])(PI/2)( Build3DSurfaceFrom2DCurve(rzCross, scaleKing) );
	var zOffset = (rzKingRots[rzKingRots.length-1][1]-rzCross[1][0]*2)*scaleKing;
	cylcross =  T([2])([zOffset])( c );

	var king = T([0,1])([bes/2,bes/2])(STRUCT([Build3DSurfaceFrom2DCurve(rzKingRots, scaleKing), cylcross]));
	var whiteKing = COLOR(whiteColor)( king );
	var blackKing = COLOR(blackColor)( king );

	var pawn = T([0,1])([bes/2,bes/2])(Build3DSurfaceFrom2DCurve(rzPawn, scalePawn));
	var whitePawn = COLOR(whiteColor)( pawn );
	var blackPawn = COLOR(blackColor)( pawn );
}

	var board = new Array();
	var idxBoard = 0;
	var cube0 = T([2])([-0.5])(CUBOID([bes,bes,0.5])); // Create and set below Z=0
	board[idxBoard++] = STRUCT([COLOR([0.8,0.8,0.8])( cube0 ),
								COLOR([0.2,0.2,0.2])( T([0])([bes])(cube0) ),
								COLOR([0.8,0.8,0.8])( T([0,1])([bes,bes])(cube0) ),
								COLOR([0.2,0.2,0.2])( T([1])([bes])(cube0) ) ]);

	for (l=0; l<2; l++)
	{ // Copy on X
		board[idxBoard] =  STRUCT([ board[idxBoard-1], T([0])([bes*Math.pow(2, idxBoard)])( board[idxBoard-1] ) ]);
		idxBoard++;
	}
	for (l=0; l<2; l++)
	{ // Copy on Y
		board[idxBoard] =  STRUCT([ board[idxBoard-1], T([1])([bes*2*Math.pow(2, idxBoard-3)])( board[idxBoard-1] ) ]);
		idxBoard++;
	}
if (onlyboard == false)
{
	board[idxBoard++] = T([0,1])([bes*(5),bes*(0)])(whiteKing);
	board[idxBoard++] = T([0,1])([bes*(3),bes*(7)])(blackKing);
	board[idxBoard++] = T([0,1])([bes*(3),bes*(1)])(whitePawn);
	board[idxBoard++] = T([0,1])([bes*(4),bes*(1)])(whitePawn);
	board[idxBoard++] = T([0,1])([bes*(5),bes*(2)])(whitePawn);
	board[idxBoard++] = T([0,1])([bes*(2),bes*(5)])(blackPawn);
	board[idxBoard++] = T([0,1])([bes*(4),bes*(6)])(blackPawn);
	board[idxBoard++] = T([0,1])([bes*(3),bes*(7)])(blackPawn);
}
	var model = STRUCT(board);

	exports.m =  model;

	DRAW(model);
			
}(this)) // "this" often is window (global variable)
