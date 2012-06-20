/* 403266: Fabrizio Andreoli
** LeonardoCentralPlanChurch.js
** Model of a Leonardo's central-plan church
**
** http://en.wahooart.com/A55A04/w.nsf/Opra/BRUE-8EWLBQ
** http://www.museoscienza.org/dipartimenti/catalogo_collezioni/scheda_oggetto.asp?idk_in=ST070-00051&arg=Leonardo
** http://www.museoscienza.org/dipartimenti/catalogo_collezioni/scheda_oggetto.asp?idk_in=ST070-00130&arg=Leonardo
*/

(function (exports) {
	var doShow = !false; // developing...can bypass the show...
	var ctrl = null; // Used to control the camera...// ctrl.object.position
	if (p && p.controls)
	{
		ctrl = p.controls.controls; // Undocumented p [exports.Plasm.plasm.Viewer]
	}

	// Global parameters definition: determine the shape and the size of the buildings
	var sf = 1; // Scale factor width and height	
	var nRibs = 8; // Octagonal cupolas
	var radiusMainCupola = 4;
	var radiusMiniCupola = 2;
	var miniCupolaDispose = 6;
	var cww=0.30 // Cupola wall's width
	var baseStepsRadius = miniCupolaDispose + radiusMiniCupola*2;
	var baseStepsWidth = cww/2;
	var baseStepsSlices = 32;
	var zBaseMainCupola = 6*sf; // Z of the base of the main cupolas
	var zBaseMiniCupola = 3*sf; // Z of the base of the mini cupolas
	var typeMainCupola = 1; // Round Arch
	var typeMiniCupola = 1; // Round Arch
	var typeExpCupola = 3; // Very thin Lancet Arch
	var columnRadius = radiusMainCupola + cww*1.5;
	var nDivCol = (1 << 4); // Must be a power of two (to speed up...)

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzTopMiniCupolas = [[50,0], // [0,0] in order to have a closed object (at bottom).
 													[50,0], [100, 0], [100, 0], [110, 10], [ 120,30], [105,50], [50,75], [0,100]]; // Closing the top of the TopMiniCupolas
	rzTopMiniCupolas.sizeXY = 1/100; // rzTopMiniCupolas object sizeXY factor. Makes base into [X=1,Y=1].
	rzTopMiniCupolas.sizeZ  = 1/100; // rzTopMiniCupolas object sizeZ factor. Makes base into [Z=1].
	var sizeTopMiniCupolas = [sf,sf];
	var domainTopMiniCupolas = DOMAIN([[0,1],[0,PI*2]])([rzTopMiniCupolas.length,nRibs]);

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzSteps = [	[0,0], // [0,0] in order to have a closed object (at the top).
 									[baseStepsRadius,0], [baseStepsRadius, 0],
 									[baseStepsRadius,-baseStepsWidth], [baseStepsRadius, -baseStepsWidth],
 									[baseStepsRadius+baseStepsWidth, -baseStepsWidth], [baseStepsRadius+baseStepsWidth, -baseStepsWidth],
 									[baseStepsRadius+baseStepsWidth, -baseStepsWidth*2], [baseStepsRadius+baseStepsWidth, -baseStepsWidth*2],
 									[baseStepsRadius+baseStepsWidth*2, -baseStepsWidth*2], [baseStepsRadius+baseStepsWidth*2, -baseStepsWidth*2],
 									[baseStepsRadius+baseStepsWidth*2, -baseStepsWidth*3], [baseStepsRadius+baseStepsWidth*2, -baseStepsWidth*3],
 									[0, -baseStepsWidth*3], [0, -baseStepsWidth*3]]; // Closing the bottom of the Steps
	rzSteps.sizeXY = 1; // rzSteps object sizeXY factor. Makes base into [X=1,Y=1].
	rzSteps.sizeZ  = 1; // rzSteps object sizeZ factor. Makes base into [Z=1].
	var sizeSteps = [sf,sf];
	var domainSteps = DOMAIN([[0,1],[0,PI*2]])([rzSteps.length,nRibs*4]);

	// Colors definitions
  function ColorRGB(r,g,b,t) { t = t || 1; return new Array(r/0xFF,g/0xFF,b/0xFF, t); }
 	var colorGlass = [0,1,1,0.4];
 	var colorBiancoCarrara = ColorRGB(0xF6,0xFA,0xE1);
 	var colorMintedMarble = ColorRGB(0xF1,0xFC,0xC0);
 	var colorYellowMarble = ColorRGB(0xEB,0xE8,0x2D);
 	var colorYellowMarbleExt = ColorRGB(0xDB,0xD8,0x1D);
 	var colorGold = ColorRGB(0xFF, 0xE5, 0x00);

	// Each/some functions add their structures into the myModel array in order to "make a movie" of the building process 	
 	var myModel = new Array();
 	var myIdx=0;
 	var i;

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
	
	function MYCYLINDER(dims, slices)
	{
		var c = CYL_SURFACE(dims)([slices,1]);
		var d = DISK(dims[0])([slices,1]); // DISK()() HAVE SOME PROBLEM IN 3D!!!
		return STRUCT([ c, d, T([2])([dims[1]])(d) ]);
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

	/* FillPoly() combines a sequence of polygons two by two: 
	** creates an edge between the nth vertex in the first and the nth vertex in the second polygon,
	** and then fills these newly created faces. Furthermore, also fills the first and the last polygon.
	*/
	function FillPoly(fp)
	{ 
		// INPUT fp: Array of poligons. // Points of each poly have to be right-handed respect to its normal
		// OUTPUT plasm model

		var domain = DOMAIN([[0,1],[0,1]])([1,1]);
		fp = fp ||	[ [[1,1,1], [2,1,1], [2,2,1], [1,2,1]],
									[[0,0,2], [3,0,2], [3,3,2], [0,3,2]],
									[[0,0,0], [3,0,0], [3,3,0], [0,3,0]]];

		function FillTwoPoly(r1,r2)
		{
			var n12 = new Array();
			var b12 = new Array();
	
			if (r1.length>=r2.length) // Work with heterogeneous polygons
			{
				r1.forEach( function (e,i) { 
					if (r2.length>i)
					{
						n12[i] = CalcNUBS([e, r2[i]], 1, S0);
					}
					else
					{
						n12[i] = CalcNUBS([e, r2[r2.length-1]], 1, S0);
					}
				} );
			}
			else
			{
				r2.forEach( function (e,i) { 
					if (r2.length>i)
					{
						n12[i] = CalcNUBS([e, r1[i]], 1, S0);
					}
					else
					{
						n12[i] = CalcNUBS([e, r1[r1.length-1]], 1, S0);
					}
				} );
			}

			n12.forEach( function (e,i,arr) { 
				b12[i] = MAP(BEZIER(S1)([e,arr[(i+1) % arr.length]]))(domain);
			} );
			
			return STRUCT(b12);
		}
		
		if (fp && fp.length>1)
		{
			var newPolyFirst = fp[0].slice(0); // Create
			var newPolyLast =  fp[fp.length-1].slice(0); // Create
			var avgFirst = fp[0][0].slice(0);
			var avgLast = fp[fp.length-1][0].slice(0);

			// On first polygon calculate the average of vertex points and then join with FillTwoPoly
			avgFirst.forEach( function (e,i,arr) { arr[i] = 0; } ); // Prepare avg on points of first poly
			newPolyFirst.forEach( function (e,i,arr) {  // For each point of the first poly
				e.forEach( function (el,idx) { avgFirst[idx] += el/arr.length; } ); // Update the relative coordinate for each component of each point.
			} );
			newPolyFirst.forEach( function (e,i,arr) { arr[i] = avgFirst;	} ); // Set all the new First poly a sequence of the same point (avg).

			// Do the same of the first polygon on the last.
			avgLast.forEach( function (e,i,arr) { arr[i] = 0; } );
			newPolyLast.forEach( function (e,i,arr) { 
				e.forEach( function (el,idx) { avgLast[idx] += el/arr.length; } );
			} );
			newPolyLast.forEach( function (e,i,arr) { arr[i] = avgLast;	} );

			var surfArray = new Array;
			var iSurf = 0;

			// Calc each join between adiancent poly in fp[], included the two "added" new polygons for first (newPolyFirst) and for last (newPolyLast)
			surfArray[iSurf++] = FillTwoPoly(newPolyFirst,fp[0]);
			for (; iSurf+1<fp.length; iSurf++)
			{
				surfArray[iSurf] = FillTwoPoly(fp[iSurf],fp[iSurf+1]);
			}
			surfArray[iSurf++] = FillTwoPoly(fp[fp.length-1], newPolyLast);
	
			return STRUCT(surfArray);
		}
		else
		{
			return null;
		}
	}

  function RemapAdd(cp, pos)
  { // Remap a 3 element vector
    return cp.map(function (p) {return [(p[0]+pos[0]), (p[1]+pos[1]), (p[2]+pos[2])]});
  }

	var last_h_cupola=-1; // outside variable to know the high of the last built cupola (the real high)
	var last_r_cupola=-1; // outside variable to know the last (minimal, at the top of the cupola) radius of the last built cupola
	function BuildRibbedCupola(nRibs, cRibs, cupolaType, baseRadium, cww, percentage, argDomain, zBaseCupola)
	{ // Keep in mind that the base occupy a radium larger than baseRadium: baseRadium+5.5*cww/2 (at ribs...)
		// INPUT nRibs: Number of faces for cupola.
		// INPUT cRibs: Number of faces really built.
		// INPUT cupolaType: Heigth factor for cupola: cupolaType==1 for Round Arch, cupolaType==2 for Equilateral Arch.
		// INPUT baseRadium: Radium of the inscribed circle at the base of the cupola.
		// INPUT cww: Cupola wall's width
		// INPUT percentage: percentage of completeness of the base starting from the base (1.0 (100%) means closed on top).
		// INPUT argDomain: domain argument for vertical face
		// INPUT zBaseCupola: Elevation of the base of the cupola
		// OUTPUT a ribbed cupola array of plasm model built by passed parameters, and two outside parameters (last_h_cupola and last_r_cupola)

		// Check inputs, and eventually set a default value.
		nRibs = nRibs || 8; // default is eight faces
		cRibs = cRibs || nRibs; // by default complete cupola
		cupolaType = cupolaType || 1; 
		baseRadium = baseRadium || 1;
		cww = cww || 0.3;
		percentage = percentage || 0.8;
		argDomain = argDomain || 20;

		var alfa = 2*PI/nRibs; // The angle that contains one slice of the cupola
		var halfAlfa = alfa/2; // An half of the angle of a slice of the cupola
		var domainCupola = DOMAIN([[0,1],[0,alfa]])([argDomain,1]); // Domain used to create one slice of an emisphere, the profile used (cpCupola) could be cutted at the top (depending by percentage), the slice goes from 0 to alfa degree
		var angleType = Math.acos(1-1/cupolaType); // PI/2 for Round Arch, PI/3 for Equilateral Arch
		var rCupola = baseRadium*(1 + cupolaType*(Math.cos(angleType*percentage) - 1)); // Simplified equation that calculate the radium at the cut of the top of the cupola surface (without ribs)
		var hCupola = baseRadium*cupolaType*Math.sin(angleType*percentage);
		var cpCupola = [[baseRadium,0,0],
										[baseRadium*(1 + cupolaType*(Math.cos(angleType*percentage/2) - 1)),0,baseRadium*cupolaType*Math.sin(angleType*percentage/2)],
										[rCupola,0,hCupola]]; // Control points to create the (eventually cutted) emisphere.

		last_h_cupola = zBaseCupola+baseRadium/4+cww + hCupola; // Value used outside this function too. Set the maximum Z reached by this building
		last_r_cupola = rCupola + 5.5*cww/2; // Value used outside this function too. Set the radius at Z == last_h_cupola
	
		var profileCupola = CalcNUBS(cpCupola);
		var mappingCupola = ROTATIONAL_SURFACE(profileCupola);

		// Internal viewing part of the curved cupola slice
		var cupola = T([0,1])([cww*Math.cos(halfAlfa),cww*Math.sin(halfAlfa)])(COLOR(colorYellowMarble)(MAP(mappingCupola)(domainCupola)));
		// External viewing part of the curved cupola slice
		var cupolaExt = T([0,1])([cww*Math.cos(halfAlfa),cww*Math.sin(halfAlfa)])(COLOR(colorYellowMarbleExt)(cupola));
		
		// The ribs are created half at the left and half at the right of one cupola slice: in that manner it is possible to create a semi-cupola (PI degree).
		// Calculate the profile of 
		var profileCupolaRib0 = CalcNUBS(RemapAdd(cpCupola, [cww/2*Math.cos(halfAlfa),cww/2*Math.sin(halfAlfa),0]));
		var profileCupolaRib1 = CalcNUBS(RemapAdd(cpCupola, [5*cww/2*Math.cos(halfAlfa),5*cww/2*Math.sin(halfAlfa),0]));
		var profileCupolaRib2 = CalcNUBS(RemapAdd(cpCupola, [5.5*cww/2,0,0]));
		var profileCupolaRib3 = CalcNUBS(RemapAdd(cpCupola, [cww/2,0,0]));

		var domainRib = DOMAIN([[0,1],[0,1]])([argDomain,1]);
		var rib0 = MAP(BEZIER(S1)([profileCupolaRib0, profileCupolaRib1]))(domainRib);
		var rib1 = MAP(BEZIER(S1)([profileCupolaRib1, profileCupolaRib2]))(domainRib);
		var rib2 = MAP(BEZIER(S1)([profileCupolaRib2, profileCupolaRib3]))(domainRib);
		var rib3 = MAP(BEZIER(S1)([profileCupolaRib3, profileCupolaRib0]))(domainRib);
		var ribDx = STRUCT([ rib0, rib1, rib3 ]); // rib2 must be only one...
		var ribSx = R([0,1])([alfa])(S([1])([-1])(ribDx));
		var rib = COLOR(colorBiancoCarrara)(STRUCT([ribDx, rib2, ribSx]));
		//DRAW(rib);

		var cpBaseCupola = [[baseRadium+cww/2,0,0], [baseRadium+7*cww/2,0,0], [baseRadium+7*cww/2,0,0],
										[baseRadium+7*cww/2,0,-baseRadium/10],[baseRadium+6*cww/2,0,-baseRadium/10],
										[baseRadium+6*cww/2,0,-baseRadium/9],[baseRadium+6.5*cww/2,0,-baseRadium/9],
										[baseRadium+6.5*cww/2,0,-baseRadium/10*2],[baseRadium+6*cww/2,0,-baseRadium/10*2],
										[baseRadium+6*cww/2,0,-baseRadium/4],[baseRadium+cww/2,0,-baseRadium/4],
										[baseRadium+cww/2,0,-baseRadium/4],[baseRadium+cww/2,0,0]];
	
		var profileBaseCupola = CalcNUBS(cpBaseCupola);
		var mappingBaseCupola = ROTATIONAL_SURFACE(profileBaseCupola);
		var baseCupola = COLOR(colorBiancoCarrara)(MAP(mappingBaseCupola)(domainCupola));

		var cpTopCupola = [	[rCupola,0,hCupola],
												[last_r_cupola,0,hCupola], [last_r_cupola,0,hCupola],
												[last_r_cupola,0,hCupola + cww],[last_r_cupola,0,hCupola + cww],
												[rCupola,0,hCupola + cww],[rCupola,0,hCupola + cww],
												[rCupola,0,hCupola]];
	
		var profileTopCupola = CalcNUBS(cpTopCupola);
		var mappingTopCupola = ROTATIONAL_SURFACE(profileTopCupola);
		var topCupola = COLOR(colorBiancoCarrara)(MAP(mappingTopCupola)(domainCupola));

		var i=1;
		var arrayCup = new Array();
		arrayCup[0] = T([2])([zBaseCupola+baseRadium/4])(STRUCT([ baseCupola, cupola, cupolaExt, rib , topCupola ]));
	
		if ((cRibs & (cRibs-1)) == 0) // Is a power of two?
		{
			while ((1<<i)<=cRibs)
			{
				arrayCup[i] = STRUCT([ arrayCup[i-1], R([0,1])([alfa*(1<<(i-1))])(arrayCup[i-1]) ]);
				i++;
			}
		}
		else
		{
			for (;i<cRibs; i++)
			{
				arrayCup[i] = R([0,1])([alfa*i])(arrayCup[0]);
			}
		}
		return arrayCup;
	}

	var steps = Build3DSurfaceFrom2DCurve(rzSteps,sizeSteps,domainSteps);
	myModel[myIdx++] = COLOR(colorMintedMarble)(steps);

/* DOES NOT WORK!
	for (i = 3; i>0; i--)
	{
		myModel[myIdx++] = T([2])([-baseStepsWidth*i])(MYCYLINDER([ baseStepsRadius+baseStepsWidth*i, baseStepsWidth ], baseStepsSlices));
	}
	*/

	var columnArray = new Array;

  if ((nDivCol & (nDivCol-1)) == 0)  // Is a power of two?
  { // logaritmic...
		columnArray[0] = R([0,1])([PI/4])(T([0,1])([-cww*1.5/2,-cww*1.5/2])(MYCUBOID([cww*1.5,cww*1.5,zBaseMiniCupola/nDivCol])));
		i = 1;
		while ((1<<i)<=nDivCol)
		{
			columnArray[i] = STRUCT([ columnArray[i-1], T([2])([zBaseMiniCupola/nDivCol*(1<<(i-1))])(R([0,1])([PI/nDivCol/2*(1<<(i-1))])(columnArray[i-1])) ]);
			i++;
		}
  }
  else
  { // linear...
		for (i=0; i<nDivCol; i++)
			columnArray[i] = T([2])([zBaseMiniCupola/nDivCol*i])(R([0,1])([PI/nDivCol/2*i + PI/4])(
					T([0,1])([-cww*1.5/2,-cww*1.5/2])(MYCUBOID([cww*1.5,cww*1.5,zBaseMiniCupola/nDivCol]))));
	}
	
	columnArray.forEach( function (e) { 
			myModel[myIdx++] = T([0])([columnRadius])(e); // Angle is 0...
		} ); // traslate and push all elements of miniCupolaArray[] into myModel[]

	var column = STRUCT(columnArray); // Create a one plasm model for column: the subsequent are inserted whole into myModel
	
	for (i=1;i<nRibs; i++) // First is already inserted into myModel
	{
		myModel[myIdx++] = T([0,1])([columnRadius*Math.cos(PI*2/nRibs*i), columnRadius*Math.sin(PI*2/nRibs*i)])(R([0,1])([PI*2/nRibs*i])(column));
	}

	var mainCupolaArray = BuildRibbedCupola(nRibs, nRibs, typeMainCupola, sf*radiusMainCupola, sf*cww, 0.8, 20, zBaseMainCupola);
	
	mainCupolaArray.forEach( function (e) { myModel[myIdx++] = e } ); // push all elements of mainCupolaArray[] into myModel[]
		
//	var hMainCupola = last_h_cupola;
	
	var expCupolaArray = BuildRibbedCupola(nRibs*2, nRibs*2, typeExpCupola, last_r_cupola - 5.5/2*sf*cww * 0.92, sf*cww/2, 1, 10, last_h_cupola);
	expCupolaArray.forEach( function (e) { myModel[myIdx++] = e } ); // push all elements of expCupolaArray[] into myModel[]

	var crossBase = COLOR(colorGlass)(T([0,1,2])([-0.5, -0.5, 1])(MYCUBOID([1,1,4])));
	var crossCube = COLOR(colorGlass)(T([0,1,2])([-0.5, -0.5, 5])(MYCUBOID([1,1,1])));
	var cross = STRUCT([ crossBase, crossCube, T([0])([1])(crossCube), T([0])([-1])(crossCube), T([2])([1])(crossCube) ]);
	var crossBase = COLOR(colorGold)(STRUCT([	T([0,1])([-1.5, -1.5])(CUBOID([3,3,1])), T([0,1,2])([-1.5, -1.5, 1])(CUBOID([3,1,2])),
				T([0,1,2])([-1.5, 0.5, 1])(CUBOID([3,1,2])),	T([0,1,2])([-1.5, -0.5, 1])(CUBOID([1,1,2])),	T([0,1,2])([0.5, -0.5, 1])(CUBOID([1,1,2])) ]) );

	myModel[myIdx++] = T([2])([last_h_cupola])(S([0,1,2])([sf*0.1, sf*0.1, sf*0.1])(STRUCT([ crossBase, cross ])));



	var miniTopCupolas = Build3DSurfaceFrom2DCurve(rzTopMiniCupolas,sizeTopMiniCupolas,domainTopMiniCupolas);
	
	var miniCupolaArray = BuildRibbedCupola(nRibs, nRibs, typeMiniCupola, sf*radiusMiniCupola, sf*cww, 0.8, 20, zBaseMiniCupola);
	

//	var faceWallMiniCupola	

	miniCupolaArray.push(COLOR(colorGold)(T([2])([last_h_cupola])(miniTopCupolas))); // Top for mini cupolas
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
	
	if (doShow)
	{
		for (i = 0; i<myIdx; i++)
		{
			drawModel[i] = DRAW( myModel[i] );
			HIDE( drawModel[i] );
		}
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
