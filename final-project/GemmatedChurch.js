/* 403266: Fabrizio Andreoli
** GemmatedChurch.js
** Model of a gemmated church...
*/

(function (exports) {
	var sf = 0.8; // Scale factor width and height

	// rz's arrays instead of [X,Y,Z] have [Radius,Z] elements
	var rzBrickHalfColRots = [[0,0], // [0,0] in order to have a closed object (at bottom).
 [200, 0], [200, 1], [160,30], [175,20], [175,400], [160,420], [200, 450], [160,480], [175,500], [175,860], [160,880], [200, 899], [200, 900], // Vertical part of cross of the cross of the BrickHalfCol.
 [0, 900] ]; // Closing the top of the BrickHalfCol
	rzBrickHalfColRots.sizeXY = 1/200; // BrickHalfCol object sizeXY factor. Makes base into [X=1,Y=1].
	rzBrickHalfColRots.sizeZ  = 1/900; // BrickHalfCol object sizeZ factor. Makes base into [Z=1].
	var domainBrickHalfCol = DOMAIN([[0,1],[0,PI]])([rzBrickHalfColRots.length*2,35]);

	/* Build3DSurfaceFrom2DCurve() use rz to create one NUBS along Z axis that is
	** mapped over domain2.
	*/
	function Build3DSurfaceFrom2DCurve(rz, scale, domain2, knots)
	{
		// INPUT rz: Array of [Radius,Z]. Is also an object containing sizeXY and sizeZ properties. Contains control points for NUBS, remember that first coordinate is radius and then Z...other coordinates are ignored ([[,]] not [[,,]]). First and last must have Radius=0 in order to have a closed object.
		// INPUT scale: Array of scale factor: is composed by scaleXY and scaleZ
		// INPUT domain2: Domain for BEZIER curve
		// INPUT knots: knots for NUBS, if is it null then is calculated with standard cubic...
		// OUTPUT surface built by passed parameters

		// Check for INPUT, eventually fill with default values
		scale = scale || [1,1];
		domain2 = domain2 || DOMAIN([[0,1],[0,PI*2]])([rz.length*3,rz.length]); 
		if (knots == null)
		{	// knots = [0,0,0,1,...,n-1,n,n,n] for cubic (degree=3) knots
			var i;
		  var degree = 3; // Degree of NUBS
		  var d=rz.length-degree+1;
			knots = new Array();

			for (i = 0; i<degree; i++)
			{
				knots[i] = 0;
				knots[rz.length+i] = d;
			}
			i = rz.length - 1;
			for (i; i>=degree; i--) knots[i] = i-degree+1;
			i=rz.length-degree;
		}

		var ctrls = AA(function(p) { return [p[0] * scale[0] * rz.sizeXY, 0, p[1] * scale[1] * rz.sizeZ] })(rz);
		var cc = NUBS(S0)(((knots.length-ctrls.length+1)/2))(knots)(ctrls);
		var rs = ROTATIONAL_SURFACE(cc);
		var mrsd = MAP(rs)(domain2);

console.log(ctrls);
		
		return mrsd;
	}


	var brickHeight = 7*sf;
	var brickWidth = 0.5*sf;
	var brickHalfCol = COLOR([0.8,0.8,0.8])( Build3DSurfaceFrom2DCurve(rzBrickHalfColRots, [brickWidth,brickHeight], domainBrickHalfCol) );

	var mymdl = new Array();
	var idx = 0;
	
	var bh1 = T([1])([brickWidth])(S([1])([0.5])(brickHalfCol));
	var bh2 = STRUCT([ bh1, S([1])([-1])(bh1) ]);
	var bh4 = STRUCT([ bh2, R([0,1])([PI/2])(bh2) ]);
	
	var c = STRUCT([bh4, T([0,1])([-brickWidth,-brickWidth])(COLOR([0.3,0.3,0.3])(CUBOID([brickWidth*2,brickWidth*2,brickHeight]))) ]);
	var base4 = T([0,1])([-sf*4, -sf*4])(STRUCT([ c, T([0])([sf*8])(c), T([1])([sf*8])(c), T([0,1])([sf*8,sf*8])(c) ]));
	var base8 = STRUCT([ base4, R([0,1])([PI/4])(base4) ]);
	var base16 = STRUCT([ base8, R([0,1])([PI/8])(base8) ]);

	mymdl[idx++] = T([0,1])([sf*4, sf*4])(base16);
												
	var cube0 = T([2])([-0.5])(CUBOID([sf,sf,0.5])); // Create and set below Z=0
	var cidx = idx;
	mymdl[idx++] = STRUCT([COLOR([0.8,0.8,0.8])( cube0 ),
								COLOR([0.2,0.2,0.2])( T([0])([sf])(cube0) ),
								COLOR([0.8,0.8,0.8])( T([0,1])([sf,sf])(cube0) ),
								COLOR([0.2,0.2,0.2])( T([1])([sf])(cube0) ) ]);

	for (l=0; l<2; l++)
	{ // Copy on X
		mymdl[idx] =  STRUCT([ mymdl[idx-1], T([0])([sf*Math.pow(2, idx-cidx)])( mymdl[idx-1] ) ]);
		idx++;
	}
	for (l=0; l<2; l++)
	{ // Copy on Y
		mymdl[idx] =  STRUCT([ mymdl[idx-1], T([1])([sf*2*Math.pow(2, idx-3-cidx)])( mymdl[idx-1] ) ]);
		idx++;
	}

/*	mymdl[idx++] = T([0,1])([sf*(5),sf*(0)])(whiteKing);
	mymdl[idx++] = T([0,1])([sf*(3),sf*(7)])(blackKing);
	mymdl[idx++] = T([0,1])([sf*(3),sf*(1)])(whitePawn);
	mymdl[idx++] = T([0,1])([sf*(4),sf*(1)])(whitePawn);
	mymdl[idx++] = T([0,1])([sf*(5),sf*(2)])(whitePawn);
	mymdl[idx++] = T([0,1])([sf*(2),sf*(5)])(blackPawn);
	mymdl[idx++] = T([0,1])([sf*(4),sf*(6)])(blackPawn);
	mymdl[idx++] = T([0,1])([sf*(3),sf*(7)])(blackPawn);
*/
	var model = STRUCT(mymdl);

	exports.m =  model;

	DRAW(model);
			
}(this)) // "this" often is window (global variable)
