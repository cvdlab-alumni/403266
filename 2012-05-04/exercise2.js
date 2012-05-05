/* 403266: Fabrizio Andreoli
** exercise2.js
** Produce the model of the fuselage (local coordinate system).
*/

(function (exports) {

	csFuseFront = new Array();

	csFuseFront[0] = [[ 0.00, 0.30*3/4, 0.00], [ 0.00,-0.30*3/4, 0.00], [ 0.00, 0.00,-3.50/4], [ 0.00, 0.00, 3.50/4]];
	csFuseFront[1] = [[ 0.00, 0.40*3/4, 0.00], [ 0.00,-0.40*3/4, 0.00], [ 0.00, 0.00,-4.00/4], [ 0.00, 0.00, 4.00/4]];
	csFuseFront[2] = [[ 0.20, 0.50*3/4, 0.00], [ 0.20,-0.50*3/4, 0.00], [ 0.00, 0.00,-3.50/4], [ 0.00, 0.00, 3.50/4]];
	csFuseFront[3] = [[ 0.30, 0.45*3/4, 0.00], [ 0.30,-0.45*3/4, 0.00], [ 0.00, 0.00,-3.00/4], [ 0.00, 0.00, 3.00/4]];
	csFuseFront[4] = [[ 0.40, 0.25*3/4, 0.00], [ 0.40,-0.25*3/4, 0.00], [ 0.00, 0.00,-2.00/4], [ 0.00, 0.00, 2.00/4]];
	csFuseFront[5] = [[ 0.50, 0.10*3/4, 0.00], [ 0.50,-0.10*3/4, 0.00], [ 0.00, 0.00,-1.00/4], [ 0.00, 0.00, 1.00/4]];
	csFuseFront[6] = [[ 0.60, 0.00*3/4, 0.00], [ 0.60, 0.00*3/4, 0.00], [ 0.00, 0.00, 0.00/4], [ 0.00, 0.00, 0.00/4]];


	var fuseBaseMapping = function (v) { return [-v[0], (v[1]-0.5)/ Math.sqrt(v[0]+1)/2, (v[2]-0.25) / Math.sqrt(v[0]+1)]};
	var fuseBaseModel = CUBOID([5,1,1]);
	var fuseMapped = MAP(fuseBaseMapping)(fuseBaseModel);
//	DRAW(fuseMapped);


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


function BuildFuselage(mirrorAxis)
{

	var front = BuildSurface(csFuseFront, mirrorAxis);
	
	return STRUCT([ front, fuseMapped]);
}

	var surfFuselage = BuildFuselage(2);
	
	exports.surfFuselage = surfFuselage;

	if (surfFuselage)
	{	
		// DRAW fuselage
		DRAW(surfFuselage);
	}
	else
	{
		console.log("Error: no surface surfFuselage!");
	}


}(this)) // "this" often is window (global variable)
