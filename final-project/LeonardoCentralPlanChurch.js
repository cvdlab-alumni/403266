/* 403266: Fabrizio Andreoli
** LeonardoCentralPlanChurch.js
** Model of a Leonardo's central-plan church
**
** http://en.wahooart.com/A55A04/w.nsf/Opra/BRUE-8EWLBQ
** http://www.museoscienza.org/dipartimenti/catalogo_collezioni/scheda_oggetto.asp?idk_in=ST070-00051&arg=Leonardo
** http://www.museoscienza.org/dipartimenti/catalogo_collezioni/scheda_oggetto.asp?idk_in=ST070-00130&arg=Leonardo
*/

(function (exports) {
	var doShow = false; // developing...can bypass the show...
	ctrl = p.controls.controls; // Undocumented p: used to control the camera...// ctrl.object.position.z

  function ColorRGB(r,g,b,t) { t = t || 1; return new Array(r/0xFF,g/0xFF,b/0xFF, t); }

	var sf = 1; // Scale factor width and height
	
	var zBaseCupola = 0*sf; // Z of the base of the cupolas

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzBrickHalfColRots = [[0,0], // [0,0] in order to have a closed object (at bottom).
 [200, 0], [200, 1], [160,30], [175,20], [175,400], [160,420], [200, 450], [160,480], [175,500], [175,860], [160,880], [200, 899], [200, 900], // Vertical part of cross of the cross of the BrickHalfCol.
 [0, 900] ]; // Closing the top of the BrickHalfCol
	rzBrickHalfColRots.sizeXY = 1/200; // BrickHalfCol object sizeXY factor. Makes base into [X=1,Y=1].
	rzBrickHalfColRots.sizeZ  = 1/900; // BrickHalfCol object sizeZ factor. Makes base into [Z=1].
	var domainBrickHalfCol = DOMAIN([[0,1],[0,PI]])([rzBrickHalfColRots.length*2,35]);

 	var colorGlass = [0,1,1,0.4];
 	var colorBiancoCarrara = ColorRGB(0xF6,0xFA,0xE1);
 	var colorMintedMarble = ColorRGB(0xF1,0xFC,0xC0);
 	var colorYellowMarble = ColorRGB(0xEB,0xE8,0x2D);
 	var colorYellowMarbleExt = ColorRGB(0xDB,0xD8,0x1D);

	// Each/some functions add their structures into the myModel array in order to "make a movie" of the building process 	
 	var myModel = new Array();
 	var myIdx=0;

  function BuildKnots(len, degree)
  {
    // INPUT len:length
		// INPUT degree: spline degree.
    // OUTPUT knots: Array of integer describing spline's knots
    
    // knots = [0,0,0,1,...,n-1,n,n,n]
    degree = degree || 2; // Degree of NUBS
    var i;
    var d=len-degree;
    knots = new Array();
    
    for (i = 0; i<=degree; i++)
    {
      knots[i] = 0;
      knots[len+i] = d;
    }
    i = len - 1;
    for (i; i>degree; i--) knots[i] = i-degree;
    
    return knots;		
  }

  function CalcNUBS(ctrls, degree, sel, knots)
  { // Generate a NUBS from a smaller number of argument
		// INPUT ctrls: Array of integer describing spline's control points.
		// INPUT degree: spline degree.
		// INPUT sel: domain coordinate selector function.
		// INPUT knots: Array of integer describing spline's knots
		// OUTPUT plasm model of the CUBOID built by passed parameters
  	sel = sel || S0;
  	degree = degree || ((knots)?((knots.length-ctrls.length+1)/2):2);
//  	console.log(degree);
		knots = knots || BuildKnots(ctrls.length, degree);

  	return NUBS(sel)(degree)(knots)(ctrls);
  }

	// Create a better looks for a trasparent CUBOID
	function MYCUBOID(dims)
	{ // Implemented only for 2 and 3 dimensions, for others then calls CUBOID()
		// INPUT dims: dimensions like CUBOID(dims)
		// OUTPUT plasm model of the CUBOID built by passed parameters
		var cuboid;
		var domain = DOMAIN([[0,1],[0,1]])([1,1]);
		var ndegree = 1;
		var nsel = S0;
		var bsel = S1;
		var b0,b1,b2,b3,b4,b5;

		switch(dims.length) {
			case 2: // Two dimension
				b0 = BEZIER(bsel)([ CalcNUBS([[0,0,0], [dims[0],0,0]], ndegree, nsel),
													CalcNUBS([[0,dims[1],0],[dims[0],dims[1],0]], ndegree, nsel) ]);
				cuboid = MAP(b0)(domain);
			break;
			case 3: // Three dimension
				b0 = BEZIER(bsel)([ CalcNUBS([[0,0,0], [dims[0],0,0]], ndegree, nsel),
														CalcNUBS([[0,dims[1],0],[dims[0],dims[1],0]], ndegree, nsel) ]);
				b1 = BEZIER(bsel)([ CalcNUBS([[0,0,0], [dims[0],0,0]], ndegree, nsel),
														CalcNUBS([[0,0,dims[2]],[dims[0],0,dims[2]]], ndegree, nsel) ]);
				b2 = BEZIER(bsel)([ CalcNUBS([[0,0,0], [0,dims[1],0]], ndegree, nsel),
														CalcNUBS([[0,0,dims[2]],[0,dims[1],dims[2]]], ndegree, nsel) ]);
				b3 = BEZIER(bsel)([ CalcNUBS([[0,dims[1],0], [dims[0],dims[1],0]], ndegree, nsel),
														CalcNUBS([[0,dims[1],dims[2]], [dims[0],dims[1],dims[2]]], ndegree, nsel) ]);
				b4 = BEZIER(bsel)([ CalcNUBS([[dims[0],0,0], [dims[0],dims[1],0]], ndegree, nsel),
														CalcNUBS([[dims[0],0,dims[2]], [dims[0],dims[1],dims[2]]], ndegree, nsel) ]);
				b5 = BEZIER(bsel)([ CalcNUBS([[0,0,dims[2]], [dims[0],0,dims[2]]], ndegree, nsel),
														CalcNUBS([[0,dims[1],dims[2]],[dims[0],dims[1],dims[2]]], ndegree, nsel) ]);

				cuboid = STRUCT([ MAP(b0)(domain), MAP(b1)(domain), MAP(b2)(domain),
												 MAP(b3)(domain), MAP(b4)(domain), MAP(b5)(domain)]);

			break;
			default:
				cuboid = CUBOID(dims);
			break;
		}
		return cuboid;
	}

	/* Build3DSurfaceFrom2DCurve() use rz to create one NUBS along Z axis that is
	** mapped over domain2.
	*/
	function Build3DSurfaceFrom2DCurve(rz, scale, domain2, degree, knots)
	{
		// INPUT rz: Array of [Radius,Z]. Is also an object containing sizeXY and sizeZ properties. Contains control points for NUBS, remember that first coordinate is radius and then Z...other coordinates are ignored ([[,]] not [[,,]]). First and last must have Radius=0 in order to have a closed object.
		// INPUT scale: Array of scale factor: is composed by scaleXY and scaleZ
		// INPUT domain2: Domain for BEZIER curve
		// INPUT knots: knots for NUBS
		// OUTPUT plasm model of the surface built by passed parameters

		// Check for INPUT, eventually fill with default values
		scale = scale || [1,1];
		domain2 = domain2 || DOMAIN([[0,1],[0,PI*2]])([rz.length*3,rz.length]); 

		var ctrls = AA(function(p) { return [p[0] * scale[0] * rz.sizeXY, 0, p[1] * scale[1] * rz.sizeZ] })(rz);
		var cc = CalcNUBS(ctrls,degree,S0,knots); // NUBS(S0)(((knots.length-ctrls.length+1)/2))(knots)(ctrls);
		var rs = ROTATIONAL_SURFACE(cc);
		var mrsd = MAP(rs)(domain2);
// console.log(ctrls);
		return mrsd;
	}

  function RemapAdd(cp, pos)
  { // Remap a 3 element vector
    return cp.map(function (p) {return [(p[0]+pos[0]), (p[1]+pos[1]), (p[2]+pos[2])]});
  }

	var last_h_cupola=-1; // outside variable to know the high of the last built cupola (the real high)
	var last_r_cupola=-1; // outside variable to know the last (minimal, at the top of the cupola) radius of the last built cupola
	function BuildRibbedCupola(nRib, cRib, cupolaType, baseRadium, cww, percentage, argDomain, zBaseCupola)
	{ // Keep in mind that the base occupy a radium larger than baseRadium: baseRadium+5.5*cww/2 (at ribs...)
		// INPUT nRib: Number of faces for cupola.
		// INPUT cRib: Number of faces really built.
		// INPUT cupolaType: Heigth factor for cupola: cupolaType==1 for Round Arch, cupolaType==2 for Equilateral Arch.
		// INPUT baseRadium: Radium of the inscribed circle at the base of the cupola.
		// INPUT cww: Cupola wall's width
		// INPUT percentage: percentage of completeness of the base starting from the base (1.0 (100%) means closed on top).
		// INPUT argDomain: domain argument for vertical face
		// INPUT zBaseCupola: Elevation of the base of the cupola
		// OUTPUT a ribbed cupola array of plasm model built by passed parameters, and two outside parameters (last_h_cupola and last_r_cupola)

		nRib = nRib || 8; // default is eight faces
		cRib = cRib || nRib; // by default complete cupola
		cupolaType = cupolaType || 2; 
		baseRadium = baseRadium || 1;
		cww = cww || 0.05;
		percentage = percentage || 0.9;
		argDomain = argDomain || 20;
		var alfa = 2*PI/nRib;
		var halfAlfa = alfa/2;
		var domainCupola = DOMAIN([[0,1],[0,alfa]])([argDomain,1]); // In that way create one slice of an emisphere but cutted at the top (percentage), that goes from 0 to alfa degree
		var hCupola = cupolaType*baseRadium;
		var angleType = Math.acos(1-1/cupolaType); // PI/2 for Round Arch, PI/3 for Equilateral Arch
		var cpCupola = [[baseRadium,0,0],
										[baseRadium*(1 + cupolaType*(Math.cos(angleType*percentage/2) - 1)),0,baseRadium*cupolaType*Math.sin(angleType*percentage/2)],
										[baseRadium*(1 + cupolaType*(Math.cos(angleType*percentage) - 1)),0,baseRadium*cupolaType*Math.sin(angleType*percentage)]]; // Control points to create the (eventually cutted) emisphere.
	
		var profileCupola = CalcNUBS(cpCupola);
		var mappingCupola = ROTATIONAL_SURFACE(profileCupola);

		var cupola = T([0,1])([cww*Math.cos(halfAlfa),cww*Math.sin(halfAlfa)])(COLOR(colorYellowMarble)(MAP(mappingCupola)(domainCupola)));
		//DRAW(cupola)
		var cupolaExt = T([0,1])([cww*Math.cos(halfAlfa),cww*Math.sin(halfAlfa)])(COLOR(colorYellowMarbleExt)(cupola));
		//DRAW(cupolaExt)
		
		var profileCupolaRib0 = CalcNUBS(RemapAdd(cpCupola, [cww/2*Math.cos(halfAlfa),cww/2*Math.sin(halfAlfa),0]));
		var profileCupolaRib1 = CalcNUBS(RemapAdd(cpCupola, [5*cww/2*Math.cos(halfAlfa),5*cww/2*Math.sin(halfAlfa),0]));
//		var profileCupolaRib2 = CalcNUBS(RemapAdd(cpCupola, [5*cww/2*Math.cos(-halfAlfa),5*cww/2*Math.sin(-halfAlfa),0]));
//		var profileCupolaRib3 = CalcNUBS(RemapAdd(cpCupola, [cww/2*Math.cos(-halfAlfa),cww/2*Math.sin(-halfAlfa),0]));
		var profileCupolaRib2 = CalcNUBS(RemapAdd(cpCupola, [5.5*cww/2,0,0]));
		var profileCupolaRib3 = CalcNUBS(RemapAdd(cpCupola, [cww/2,0,0]));
		
		var surfCupolaRib0 = [profileCupolaRib0, profileCupolaRib1];
		var surfCupolaRib1 = [profileCupolaRib1, profileCupolaRib2];
		var surfCupolaRib2 = [profileCupolaRib2, profileCupolaRib3];
		var surfCupolaRib3 = [profileCupolaRib3, profileCupolaRib0];
		
		var domainRib = DOMAIN([[0,1],[0,1]])([20,1]);
		var rib0 = MAP(BEZIER(S1)(surfCupolaRib0))(domainRib);
		var rib1 = MAP(BEZIER(S1)(surfCupolaRib1))(domainRib);
		var rib2 = MAP(BEZIER(S1)(surfCupolaRib2))(domainRib);
		var rib3 = MAP(BEZIER(S1)(surfCupolaRib3))(domainRib);
		var ribDx = STRUCT([ rib0, rib1, rib2, rib3 ]);
		var ribSx = R([0,1])([alfa])(S([1])([-1])(ribDx));
		var rib = COLOR(colorBiancoCarrara)(STRUCT([ribDx, ribSx]));
		//DRAW(rib);

		var cpBaseCupola = [[baseRadium+cww/2,0,0], [baseRadium+7*cww/2,0,0], [baseRadium+7*cww/2,0,0],
										[baseRadium+7*cww/2,0,-baseRadium/10],[baseRadium+5*cww/2,0,-baseRadium/10],
										[baseRadium+5*cww/2,0,-baseRadium/9],[baseRadium+6*cww/2,0,-baseRadium/9],
										[baseRadium+6*cww/2,0,-baseRadium/10*2],[baseRadium+5*cww/2,0,-baseRadium/10*2],
										[baseRadium+5*cww/2,0,-baseRadium/4],[baseRadium,0,-baseRadium/4],
										[baseRadium,0,-baseRadium/4],[baseRadium+cww/2,0,0]];
	
		var profileBaseCupola = CalcNUBS(cpBaseCupola);
		var mappingBaseCupola = ROTATIONAL_SURFACE(profileBaseCupola);
		var baseCupola = COLOR(colorBiancoCarrara)(MAP(mappingBaseCupola)(domainCupola));

		var i=1;
		var arrayCup = new Array();
		arrayCup[0] = T([2])([zBaseCupola])(STRUCT([ baseCupola, cupola, cupolaExt, rib ]));
	
		if ((cRib & (cRib-1)) == 0) // Is power of two?
		{
			while ((1<<i)<=cRib)
			{
				arrayCup[i] = STRUCT([ arrayCup[i-1], R([0,1])([alfa*(1<<(i-1))])(arrayCup[i-1]) ]);
				i++;
			}
		}
		else
		{
			for (;i<cRib; i++)
			{
				arrayCup[i] = R([0,1])([alfa*i])(arrayCup[0]);
			}
		}
		last_h_cupola = zBaseCupola + cpCupola[cpCupola.length-1][2];
		last_r_cupola = cpCupola[cpCupola.length-1][0];
		return arrayCup;
	}

/*	
	var cca = Math.cos(Math.asin(percentage));
	var ccc = T([0,1,2])([sf*4, sf*4, brickHeight+cca*2])(S([0,1,2])([sf*4*Math.sqrt(2), sf*4*Math.sqrt(2), sf*4*Math.sqrt(2)])(MYCUBOID([cca,cca,cca])));
	*/


// for (i=0; i<63; i++) DRAW(T([2])([2*i])(R([0,1])([i*PI/32])(T([0,1])([-5,-5])(MYCUBOID([10,10,2])))));


	var mainCupolaArray = BuildRibbedCupola(8, 8, 1, sf*4, 0.05, 0.8, 20, zBaseCupola);
	
	mainCupolaArray.forEach( function (e) { myModel[myIdx++] = e } ); // push all elements of mainCupolaArray[] into myModel[]
	
	
	var hMainCupola = last_h_cupola;
	
//	myModel[myIdx++] = T([2])([hMainCupola])(COLOR(colorGlass)(MYCUBOID([3,3,3])))
//	myModel[myIdx++] = T([0,1,2])([ -sf*2,-sf*2,sf*4 /*Math.sin(PI/3)*2*/])(COLOR([1,0,0,0.3])(MYCUBOID([3,3,3])))
	
	var miniCupolaArray = BuildRibbedCupola(8, 8, 1, sf*2, 0.05, 0.8, 20, zBaseCupola);
	var miniCupolaDispose = 5;

	miniCupolaArray.forEach( function (e) { 
			myModel[myIdx++] = T([0,1])([-sf*miniCupolaDispose,-sf*miniCupolaDispose])(R([0,1])([PI])(e));
		} ); // roto-traslate and push all elements of miniCupolaArray[] into myModel[]

	var miniCupola = STRUCT(miniCupolaArray); // Create a one plasm model for miniCupola: the subsequent are inserted whole into myModel
//	myModel[myIdx++] = T([0,1])([ sf*miniCupolaDispose, sf*miniCupolaDispose])(miniCupola);
	myModel[myIdx++] = T([0,1])([-sf*miniCupolaDispose, sf*miniCupolaDispose])(R([0,1])([PI/2])(miniCupola));
	myModel[myIdx++] = T([0,1])([sf*miniCupolaDispose,sf*miniCupolaDispose])(R([0,1])([PI/4])(miniCupola));
	myModel[myIdx++] = T([0,1])([ sf*miniCupolaDispose,-sf*miniCupolaDispose])(R([0,1])([3*PI/2])(miniCupola));
//	myModel[myIdx++] = T([0,1,2])([ sf*miniCupolaDispose, sf*miniCupolaDispose,last_h_cupola])(COLOR(colorGlass)(MYCUBOID([2,2,2])))
//	myModel[myIdx++] = T([0,1,2])([ sf*(miniCupolaDispose-1), sf*(miniCupolaDispose-1),sf*2])(COLOR([1,0,0,0.3])(MYCUBOID([2,2,2])))


	var showIdx = -1;
	var drawModel = new Array();
	
	for (i = 0; i<myIdx; i++)
	{
		drawModel[i] = DRAW( myModel[i] );
		HIDE( drawModel[i] );
	}

function doDeClock(time)
{  // Run after that the function including this will exit
	if (showIdx > 0)
	{
		CANCEL( drawModel[--showIdx] );
		if (showIdx>0)
		{
			if (ctrl)
			{
				ctrl.object.position.x-=1;
				ctrl.object.position.z+=0.5;
			}
	  	setTimeout("doDeClock(time)",time);
	  }
	  else
		{
			SHOW(m);
			if (ctrl) ctrl.viewAll();
	  }
	}
}

function doClock(time)
{  // After first time this function will run after that the function including this will exit
	if (showIdx == -1)
	{
		showIdx++;
	}
	else
	{
		if (showIdx == 0)
		{
			HIDE(m);
		}
		if (showIdx < myIdx)
		{
			SHOW( drawModel[showIdx++] );
			if (ctrl)
			{
				ctrl.object.position.x+=1;
				ctrl.object.position.z-=0.5;
			}
		}
	}
	if (showIdx < myIdx)
	{
	  setTimeout("doClock(time)",time);
	}
	else
	  setTimeout("doDeClock(time)",time);
}

	var time = 500; // Used by the second time...

	var model = STRUCT(myModel);
	DRAW(model);
	SHOW(model);
	if (ctrl) ctrl.viewAll();

	exports.m =  model;
	exports.doClock =  doClock; // Run after that this function will exit
	exports.doDeClock =  doDeClock; // Run after that this function will exit
	exports.time =  time; // Used after that this function will exit
	exports.ctrl =  ctrl; // Used after that this function will exit
	exports.showIdx =  showIdx; // DEBUG

	if (doShow)
	{
		if (ctrl)
		{
			ctrl.object.position.x = -ctrl.object.position.x - 10;
			ctrl.object.position.y = -ctrl.object.position.y - 10;
		}
		console.log('Start...');
		doClock(3000); // engage the sequence after ms
	}
	
}(this)) // "this" often is window (global variable)
