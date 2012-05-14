/* 403266: Fabrizio Andreoli
** model.js
** Model a chess pawn piece.
*/

(function (exports) {

	var scale = 0.05; // Object scale factor

	 // Sequence of [Y,Z]. Alfa = 0, first and last must start have Y=0 in order to have a closed object.
	var cnubs = [[0,0], // [0,0] 
	             [44,0], // To build base, 0 on Z axis.
	             [44,23],[32,24],[36,25],[39,28],[28,40],[20,58],[17,73],[21,90],[14,95],
	             [19,101],[24,113],[20,130],[13,138],[8,141], [3,143],
	             [0,143]]; // 0 on X to make a close (on top) object
	             // This data was manually taken by sk-scheda-10_html_60264dc2.gif in http://www.guzman.it/schedesketchup/scheda%2010/sk-scheda-10.html

	var powdivs = 3; // Object is calculated by 0 to (PI/2/(2^powdivs)) degree. Then is replicated with affine transformations.
	var ndivs = 4; // Calculate ndivs NUBS curves into (PI/2/(2^powdivs)) degree.

	function BuildObjectRotatingXyNUBS(cnubs, knots, powdivs, ndivs, scale)
	{
		// Create an object by a rotating NUBS
		// INPUT cnubs: contains control points for NUBS, remember that X coordinate is not present...([[,]] not [[,,]])
		// INPUT knots: knots for NUBS, if is it null then is calculated with standard formula...
		// INPUT powdivs: PI/2 is divided by (2^powdivs): object is calculated by 0 to alfaK degree. Then is replicated with affine transformations.
		// INPUT ndivs: Divide really calcultated curve into ndivs NUBS curves rotated by planes(X,Y)
		// INPUT scale: Object scale factor
		// OUTPUT surface built by passed parameters

		// Domain should be passed as parameters?!?!?
		var domain1 = INTERVALS(1)(cnubs.length*2);
		var domain2 = DOMAIN([[0,1],[0,1]])([cnubs.length*3,ndivs]); 

		if (knots == null)
		{
			knots = new Array();

			knots[0] = knots[1] = knots[2] = 0;
			var i=cnubs.length-3;
			knots[i+3] = knots[i+4] = knots[i+5] = i+1;
			for (; i>0; i--) knots[i+2] = i;
		}

		var cc = new Array();
	
		var ndivangle = Math.pow(2, powdivs);
	
		var alfaK = Math.PI/2/ndivangle;

		for (r=0; r<=ndivs; r++)
		{
			var alfa = alfaK * r / ndivs;
			var ctrlAlfa = AA(function(p) { return [p[0]*COS(alfa) * scale, p[0]*SIN(alfa) *scale, p[1] *scale] })(cnubs);
			cc[r] = NUBS(S0)(2)(knots)(ctrlAlfa);
		}
/*
// DEBUG
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
		for (c=1; c<ndivangle; c++)
		{
			slices[c] = ROTATE([0,1])(alfaK*c)(surfp);
		}
	
		objectPIhalf = STRUCT(slices);
		// Replicate [0..PI/2] on [PI/2..PI]
		qII = S([0])([-1])(objectPIhalf)
		qUP = STRUCT([objectPIhalf, qII])
		// Replicate [0..PI] on [PI..2*PI]
		qDW = S([1])([-1])(qUP)
		return STRUCT([qUP,qDW]);
	}

	var model = COLOR([1,1,1])( BuildObjectRotatingXyNUBS(cnubs, null, powdivs, ndivs, scale) );

	exports.m =  model;

	DRAW(model);
			
}(this)) // "this" often is window (global variable)

