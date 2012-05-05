/* 403266: Fabrizio Andreoli
** exercise3.js
** Produce the model of horizontal and vertical stabilizers (local coordinate system).
*/


(function (exports) {

	csHorizontal = new Array();
	
	csHorizontal[0] = [[ 0.50, 0.15, 0.00], [ 0.00, 0.10, 0.00], [ 0.00, 0.00, 0.00], [ 0.00, 0.00, 0.00]];
	csHorizontal[1] = [[ 0.49, 0.20, 0.00], [ 0.00, 0.20, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[2] = [[ 0.48, 0.30, 0.00], [ 0.00, 0.30, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[3] = [[ 0.47, 0.40, 0.00], [ 0.00, 0.40, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[4] = [[ 0.45, 0.50, 0.00], [ 0.00, 0.50, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[5] = [[ 0.40, 0.60, 0.00], [ 0.00, 0.60, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[6] = [[ 0.32, 0.70, 0.00], [ 0.00, 0.70, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[7] = [[ 0.21, 0.80, 0.00], [ 0.00, 0.80, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[8] = [[ 0.10, 0.90, 0.00], [ 0.00, 0.90, 0.00], [ 0.00, 0.00, 0.10], [ 0.00, 0.00,-0.10]];
	csHorizontal[9] = [[ 0.00, 0.91, 0.00], [ 0.00, 0.91, 0.00], [ 0.00, 0.00, 0.00], [ 0.00, 0.00,-0.00]];

	csVertical = new Array();
	
	csVertical[0] = [[ 0.00, 0.00, 1.00], [ 0.00, 0.00,-1.00], [ 0.00, 0.00, 0.00], [ 0.00, 0.00, 0.00]];
	csVertical[1] = [[ 0.20, 0.00, 0.99], [ 0.20, 0.00,-0.99], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[2] = [[ 0.30, 0.00, 0.98], [ 0.30, 0.00,-0.98], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[3] = [[ 0.40, 0.00, 0.95], [ 0.40, 0.00,-0.95], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[4] = [[ 0.50, 0.00, 0.90], [ 0.50, 0.00,-0.90], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[5] = [[ 0.60, 0.00, 0.80], [ 0.60, 0.00,-0.80], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[6] = [[ 0.70, 0.00, 0.65], [ 0.70, 0.00,-0.65], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[7] = [[ 0.80, 0.00, 0.45], [ 0.80, 0.00,-0.45], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[8] = [[ 0.90, 0.00, 0.20], [ 0.90, 0.00,-0.20], [ 0.00, 0.10, 0.00], [ 0.00,-0.10, 0.00]];
	csVertical[9] = [[ 0.91, 0.00, 0.00], [ 0.91, 0.00, 0.00], [ 0.00, 0.00, 0.00], [ 0.00,-0.00, 0.00]];

function BuildSurface(cs, mirrorAxis)
{
	// INPUT cs: contains control points for CUBIC_HERMITE(S0)
	// INPUT mirrorAxis: ignored if < 0
	// OUTPUT surface built by passed parameters

	var domain2D = DOMAIN([[0,1],[0,1]])([30,50]); // Could be passed as parameter, but currently leave the same domain for all surfaces
	
	ch = new Array();
//	curves = new Array();
	
//	domain1D = INTERVALS(1)(30);

	for (var i=0; i<cs.length; i++)
	{
		ch[i] = CUBIC_HERMITE(S0)(cs[i]);
//		curves[i]  = MAP(ch[i])(domain1D);
	}

	var bezierS1Ch = BEZIER(S1)(ch);
	var surf1 = MAP(bezierS1Ch)(domain2D);
	if (mirrorAxis>=0)
	{	// Mirroring on mirrorAxis axis
		var surf2 = S([mirrorAxis])([-1])(surf1);
		var surface = STRUCT([surf1,surf2]);
	
		return surface;
	}
	else
	{
		return surf1;
	}
}

	var horizontalStabilizerDx = BuildSurface(csHorizontal, 2); // Mirroring on Z axis

	if (horizontalStabilizerDx)
	{
		var verticalStabilizers = BuildSurface(csVertical, 1); // Mirroring on Y axis
		if (verticalStabilizers)
		{
			var horizontalStabilizers = STRUCT([ horizontalStabilizerDx, S([0])([-1])(horizontalStabilizerDx)]);
			var horizontalStabilizersAndElevators = STRUCT([ horizontalStabilizers, S([1])([-1])(horizontalStabilizers)]);

			var verticalStabilizersAndRubber = STRUCT([ verticalStabilizers, S([0])([-1])(verticalStabilizers)]);
			
			var stabilizers = STRUCT([ horizontalStabilizersAndElevators, verticalStabilizersAndRubber ]);
			
			exports.stabilizers = stabilizers;
	
			// Draw
			DRAW(stabilizers);
			return stabilizers;
		}
		else
		{
			console.log("Error no surface verticalStabilizers!!!");
		}			
	}
	else
	{
		console.log("Error no surface horizontalStabilizerDx!!!");
	}

}(this)) // "this" often is window (global variable)

