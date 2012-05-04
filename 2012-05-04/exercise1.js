/* 403266: Fabrizio Andreoli
** exercise1.js
** Produce the model of a single wing in a local coordinate system.
*/

var domainWing = DOMAIN([[0,1],[0,1]])([15,30]);	// Divide x axis into 15 intervals and y's into 30

/* Create control point for BEZIER(S0) */
var cpWing0 = [[10,0,0],[0,5,0],[0,-3,0],[5,2,0],[10,0,0]];
var cpWing1 = cpWing0.map(function (p) {return [p[0], p[1], p[2]+10]});
var cpWing2 = cpWing0.map(function (p) {return [p[0], p[1], p[2]+20]});
var cpWing3 = cpWing0.map(function (p) {return [p[0], p[1], p[2]+30]});
var cpWing4 = cpWing0.map(function (p) {return [p[0], p[1], p[2]+40]});
var cpWingEnd = cpWing4.map(function (p) {return [5, 0.8, p[2]]});

var bCpW0 = BEZIER(S0)(cpWing0);
var bCpW1 = BEZIER(S0)(cpWing1);
var bCpW2 = BEZIER(S0)(cpWing2);
var bCpW3 = BEZIER(S0)(cpWing3);
var bCpW4 = BEZIER(S0)(cpWing4);

var bCpWEnd = BEZIER(S0)(cpWingEnd);

var controlsWing = [bCpW0,bCpW1,bCpW2,bCpW3,bCpW4]
// I
//var controlsWing = AA(BEZIER(S0))([cpWing0,cpWing1,cpWing2,cpWing3,cpWing4]);

var wing = BEZIER(S1)(controlsWing);
var surf = MAP(wing)(domainWing);

//Curves bCpW4 and bCpWEnd are used as parameters for BEZIER function.
//BEZIER is used in transfinite manner: first argument is S1 (not S0),
//									 	and like second argument the two curves bCpW4 and bCpWEnd.).
//Note: two curves can generate a surface.
var controlsWingEnd = BEZIER(S1)([bCpW4, bCpWEnd]);
var surfaceWingEnd = MAP(controlsWingEnd)(domainWing);
DRAW(surfaceWingEnd);

DRAW(surf);
