/* 403266: Fabrizio Andreoli
** Parallel Path
** rev 0
*/

(function (exports) {
/* The data is a two-component vector generated from an image of a king of chess.
** The first component is the number of pixels from the center of the piece to
** its edge in the row (of the image) indicated by the second component.
** In this way the array created is just too big. So I chose a few items:
** I left the items in which the curve "change form"...
*/

var domainScale=1;
	var whiteColor = [0.99,0.99,0.99];
	var brownColor = [0.5,0.5,0.0];

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzMagnetRots = [[0,0], // [0,0] in order to have a closed object (at bottom).
 [95,0], [100,5], [100, 10], [100, 390], [100, 395], [95,400],
 [0, 400] ]; // Closing the top of the king
	var scaleMagnet = 1/200; // Magnet object scale factor. Makes base into [1,1].

	function myCircle(radius, domain)
	{
		var r = radius || 1;
		var d = domain || DOMAIN([[0,2*PI]])([32]);
		var mapping = function (v) { return [r*SIN(v[0]), r*COS(v[0]), 0]; };
		return MAP(mapping)(d);
	}
	
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
/*
	var magnet = T([0,1,2])([0.5,1.5,0.5])(Build3DSurfaceFrom2DCurve(rzMagnetRots, scaleMagnet));
	var whiteMagnet = COLOR(whiteColor)( magnet );
	var blackMagnet = COLOR(blackColor)( T([1])([2])(magnet) );

	var bar = T([2])([2.5])(CUBOID([1,5,0.5]));

	var bar2 = T([2])([-2.5])(bar);
	var helix  = T([0,1,2])([0.5,3,0.25])(S([2])([0.5])(R([0,2])(PI/2)(R([1,2])(PI/2)(HELIX(0.75,0.1,32,10)))));
	var helix2 = T([0,1,2])([0.5,2,2.75])(S([2])([0.5])(R([0,2])(PI/2)(R([1,2])(PI/2)(HELIX(0.75,-0.1,32,10)))));
*/
	var moveBarGap = 0.05;
	var magnet1Y = 1;
	var magnet2Y = 3;
	var helixY = 2;
	var barX = 1;
	var barY = 5;
	var barZ = 0.5;
	var helixTurns = 10;
	var helixWidth = 1;
	var wireGap = 1.5;
	var ampereGenR = 0.5;
	var ampereGenZ = 5;

	var magnetH = rzMagnetRots[rzMagnetRots.length-1][1] * scaleMagnet;
	var magnet = T([0,1,2])([barX/2,0.5 + magnet1Y,barZ])(Build3DSurfaceFrom2DCurve(rzMagnetRots, scaleMagnet));
	var magnet1 = COLOR(brownColor)( magnet );
	var magnet2 = T([1])([magnet2Y-magnet1Y])(magnet1);
	var bar2 = COLOR(whiteColor)( CUBOID([barX,barY,barZ]) );
	var bar = T([2])([magnetH+barZ])(bar2);
/*	var helix  = T([0,1,2])([barX/2,helixY+helixWidth,barZ/2])(S([2])([barZ/barX])(R([0,2])(PI/2)(R([1,2])(PI/2)(HELIX((barX+barZ)/2,helixWidth/helixTurns,32,helixTurns)))));
	var helix2 = T([0,1,2]) ([barX/2,helixY,magnetH + barZ*1.5]) (S([2]) ([barZ/barX]) (R([0,2]) (PI/2) (R([1,2]) (PI/2) (HELIX((barX+barZ)/2,-helixWidth/helixTurns,32,helixTurns)) ) ) );
*/
	var helix  = T([0,1,2])([barX/2,helixY+helixWidth,magnetH + barZ*1.5])(S([2])([barZ/barX])(R([0,2])(PI/2)(R([1,2])(PI/2)(HELIX((barX+barZ)/2,helixWidth/helixTurns,32,helixTurns)))));
	var helix2 = T([0,1,2]) ([barX/2,helixY,barZ/2]) (S([2]) ([barZ/barX]) (R([0,2]) (PI/2) (R([1,2]) (PI/2) (HELIX((barX+barZ)/2,-helixWidth/helixTurns,32,helixTurns)) ) ) );

	var wire1 = POLYLINE([[barX+barZ/2,helixY,barZ/2],[barX+barZ/2,helixY,barZ/2 + magnetH + barZ]]);
	var wire2 = POLYLINE([[barX+barZ/2,helixY + helixWidth,barZ/2 + magnetH + barZ],
	                  [barX+barZ/2,helixY + helixWidth,ampereGenZ]]);
	var wire3 = POLYLINE([[barX+barZ/2,helixY + helixWidth,barZ/2],
	                  [barX+barZ/2,helixY + helixWidth + wireGap,barZ/2],
	                  [barX+barZ/2,helixY + helixWidth + wireGap,ampereGenZ],
	                  [barX+barZ/2,helixY + helixWidth,ampereGenZ]]);
	var moveBar1 = T([1])([-barZ-moveBarGap])(CUBOID([barX, barZ, barZ*2 + magnetH]));
	var moveBar2 = T([1])([barY+moveBarGap])(CUBOID([barX, barZ, barZ*2 + magnetH]));

	// Want to model a current generator
	var circle = T([0,1,2])([barX+barZ/2,helixY+helixWidth+wireGap/2,ampereGenZ])(R([0,2])(PI/2)(myCircle(ampereGenR)))

	var model = STRUCT([magnet1, magnet2, bar, bar2, helix, helix2, wire1, wire2, wire3, moveBar1, moveBar2, circle]);

	exports.m =  model;

	DRAW(model);
			
}(this)) // "this" often is window (global variable)
/* issue!

var domain = DOMAIN([[0,1], [0,1]],[0,2*PI]);
var mapping = function (v) { return [SIN(v[0]), COS(v[1]), 0]; };
//var model = MAP(mapping)(domain);
//DRAW(model);
var c = MAP(mapping)(domain);
//c = CIRCLE()();
ct = T([0,1,2])([1,2,3])(c)
cr = R([0,2])([PI/2])(c)
cc = T([0,1,2])([1,2,3])(cr)
c0 = T([0,1,2])([0,0,0])(cr) // Bug
cs = S([0,1,2])([1,1,1])(cr) // Bug
DRAW(cr)
DRAW(c0)


function myCircle(radius, domain)
{
	var r = radius || 1;
	var d = domain || DOMAIN([[0,2*PI]])([32]);
	var mapping = function (v) { return [r*SIN(v[0]), r*COS(v[0]), 0]; };
	return MAP(mapping)(d);
}
c = myCircle();
ct = T([0,1,2])([1,2,3])(c)
cr = R([0,2])([PI/2])(c)
cc = T([0,1,2])([1,2,3])(cr)
c0 = T([0,1,2])([0,0,0])(cr)
cs = S([0,1,2])([1,1,1])(cr)
DRAW(cr)
DRAW(c0)

*/
