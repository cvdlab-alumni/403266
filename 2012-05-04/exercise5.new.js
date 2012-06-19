/* 403266: Fabrizio Andreoli
** exercise5.js
** Model a reasonably simplified airstrip, and put there your aircraft model.
*/


(function (exports) {

	var ws = 0.2; // Constant use for scaling wing on x and z axis
	var lp = 1; // Proportional to the (major) length of wing.
	
	// Declaration of vertices for BEZIER on xz plane
	var pWingSize0 = [[-5,0,-1],[5,0,4],[5,0,-4],[0,0,1],[-5,0,-1]];

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

function BuildWing(pWing, lp)
{
	// INPUT pWing: contains control points for CUBIC_HERMITE(S0)
	// INPUT mirrorAxis: ignored if < 0
	// OUTPUT surface built by passed parameters

	var domainWing = DOMAIN([[0,1],[0,1]])([15,30]);	// Divide 2D domain: x axis into 15 intervals and y's into 30
	
	/* Create control points for BEZIER(S0) */
	var pWing0 =    pWing.map(function (p) {return [p[0], p[1]-lp*2, p[2]]});
/*	var pWing1 =    pWing.map(function (p) {return [p[0], p[1]-lp, p[2]]});
	var pWing2 =    pWing.map(function (p) {return [p[0], p[1]   , p[2]]});
	var pWing3 =    pWing.map(function (p) {return [p[0], p[1]+lp, p[2]]});
*/	var pWing4 =    pWing.map(function (p) {return [p[0], p[1]+lp*2, p[2]]});
	var pWingEnd0 = pWing.map(function (p) {return [0, p[1]-lp*2, 0]});
	var pWingEnd4 = pWing.map(function (p) {return [0, p[1]+lp*2, 0]});
	
	/* Create control points for BEZIER(S1) */
	var controlWing0 = BEZIER(S0)(pWing0);
/*	var controlWing1 = BEZIER(S0)(pWing1);
	var controlWing2 = BEZIER(S0)(pWing2);
	var controlWing3 = BEZIER(S0)(pWing3);
*/	var controlWing4 = BEZIER(S0)(pWing4);
	var controlWingEnd0 = BEZIER(S0)(pWingEnd0);
	var controlWingEnd4 = BEZIER(S0)(pWingEnd4);
	
	var controlsWing = [controlWing0, /*controlWing1,controlWing2,controlWing3, */ controlWing4]
	// Compact form not used, in order to reuse object controlWing0/4 when calculating controlsWingEnd0/4
	//var controlsWing = AA(BEZIER(S0))([pWing0,pWing1,pWing2,pWing3,pWing4]);
	
	var centerWing = BEZIER(S1)(controlsWing);
	var surfCenterWing = MAP(centerWing)(domainWing);
	
	//Curves controlWing0/4 and controlWingEnd0/4 are used as parameters for BEZIER function.
	//BEZIER is used in transfinite manner: first argument is S1 (not S0),
	//                                      and second argument are the two curves controlWing0/4 and controlWingEnd0/4.
	//Note: two curves can generate a surface.
	
	var controlsWingEnd0 = BEZIER(S1)([controlWing0, controlWingEnd0]);
	var surfWingEnd0 = MAP(controlsWingEnd0)(domainWing);
	//DRAW(surfWingEnd0);
	
	var controlsWingEnd4 = BEZIER(S1)([controlWing4, controlWingEnd4]);
	var surfWingEnd4 = MAP(controlsWingEnd4)(domainWing);
	//DRAW(surfWingEnd4);

	// Build wing
	return STRUCT([surfWingEnd0, surfCenterWing , surfWingEnd4]);
}

function BuildFuselage(mirrorAxis)
{
	var front = BuildSurface(csFuseFront, mirrorAxis);
	
	return STRUCT([ front, fuseMapped]);
}

function BuildStabilizers()
{
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
//			DRAW(stabilizers);
			return stabilizers;
		}
		else
		{
			console.log("Error no surface verticalStabilizers!!!");
			return null;
		}			
	}
	else
	{
		console.log("Error no surface horizontalStabilizerDx!!!");
		return null;
	}
}

// http://www.sean.co.uk/a/webdesign/javascriptdelay.shtm
function pausecomp(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
} 

function BuildAirStrip()
{
	
	var airstrip0 = STRUCT([ COLOR([0,0,0])(T([0,1,2])([-25,10,-2])(CUBOID([50,50,1]))),
                             COLOR([0,0,0])(T([0,1,2])([-25,-50-10,-2])(CUBOID([50,50,1]))),
                             COLOR([1,1,1])(T([0,1,2])([-25,8,-2])(CUBOID([50,2,1]))),
                             COLOR([1,1,1])(T([0,1,2])([-25,-10,-2])(CUBOID([50,2,1]))),
                             COLOR([0,0,0])(T([0,1,2])([-25,-8,-2])(CUBOID([50,16,1])))]);

	var a = POLYLINE([[0],[4]]);
	var b = POLYLINE([[0],[1]]);
	var axb = COLOR([1,1,1])(PROD1x1([a,b]));
	
	var whitestrip = T([1,2])([-0.5, -0.99])(axb);

	var airstrip = STRUCT([ airstrip0, T([0])([-6*4])(whitestrip), T([0])([-6*3])(whitestrip),
							T([0])([-6*2])(whitestrip), T([0])([-6*1])(whitestrip), whitestrip,
							T([0])([6*1])(whitestrip), T([0])([6*2])(whitestrip), T([0])([6*3])(whitestrip)]);
	
	return airstrip;
}

	var pWing = AA(AA(function(x) { return x*ws }))(pWingSize0);
	
	var surfWing = 	BuildWing(pWing, lp);

	exports.surfWing = surfWing;

	if (surfWing)
	{	
		var surfFuselage = BuildFuselage(2);
		// DRAW wing
//		DRAW(surfWing);
		if (surfFuselage)
		{	
			var surfStabilizers = BuildStabilizers();
			
			if (surfStabilizers)
			{	
				var aircraft = STRUCT([ T([2])([0.88])(surfWing), surfFuselage, T([0,2])([-5,0.25])(surfStabilizers)] );
// Better but after TIME'S UP //				var aircraft = STRUCT([ T([0,2])([-0.5,0.78])(surfWing), surfFuselage, T([0,2])([-5,0.25])(surfStabilizers)] );
				// DRAW fuselage
//				DRAW(surfFuselage);
		
				exports.aircraft = aircraft;
				
				var coloredAircraft = COLOR([1,0,0])(aircraft);
				
				var airstrip = BuildAirStrip();
				
				exports.airstrip = airstrip;


				DRAW(airstrip);
				
				for (k=-4; k<=3; k++)
				{
					var c = T([0])([6*k])(coloredAircraft);
					
					DRAW(c);
					if (k<3)
					{
						pausecomp(500);
						CANCEL(c);
					}
				}
				CANCEL(airstrip);
					
				
				var scene = STRUCT([ coloredAircraft, airstrip ]);
				
				exports.scene = scene;
				
				DRAW(scene);
			}
			else
			{
				console.log("Error: no surface surfStabilizers!");
			}
		}
		else
		{
			console.log("Error: no surface surfFuselage!");
		}
	}
	else
	{
		console.log("Error: no surface surfWing!");
	}

}(this)) // "this" often is window (global variable)

