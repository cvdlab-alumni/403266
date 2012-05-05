/* 403266: Fabrizio Andreoli
** exercise1.js
** Produce the model of a single wing in a local coordinate system.
*/

var domainWing = DOMAIN([[0,1],[0,1]])([15,30]);	// Divide 2D domain: x axis into 15 intervals and y's into 30

// Declaration of vertices for BEZIER on xz plane
var pWing = [[-5,0,-1],[5,0,4],[5,0,-4],[0,0,1],[-5,0,-1]];

/* Create points for BEZIER(S0) */
var pWing0 =    pWing.map(function (p) {return [p[0], p[1]-20, p[2]]});
var pWing1 =    pWing.map(function (p) {return [p[0], p[1]-10, p[2]]});
var pWing2 =    pWing.map(function (p) {return [p[0], p[1]   , p[2]]});
var pWing3 =    pWing.map(function (p) {return [p[0], p[1]+10, p[2]]});
var pWing4 =    pWing.map(function (p) {return [p[0], p[1]+20, p[2]]});
var pWingEnd0 = pWing.map(function (p) {return [0, p[1]-20, 0]});
var pWingEnd4 = pWing.map(function (p) {return [0, p[1]+20, 0]});

/* Create control points for BEZIER(S1) */
var controlWing0 = BEZIER(S0)(pWing0);
var controlWing1 = BEZIER(S0)(pWing1);
var controlWing2 = BEZIER(S0)(pWing2);
var controlWing3 = BEZIER(S0)(pWing3);
var controlWing4 = BEZIER(S0)(pWing4);
var controlWingEnd0 = BEZIER(S0)(pWingEnd0);
var controlWingEnd4 = BEZIER(S0)(pWingEnd4);

var controlsWing = [controlWing0,controlWing1,controlWing2,controlWing3,controlWing4]
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
surfWing = STRUCT([surfWingEnd0, surfCenterWing , surfWingEnd4]);

// DRAW wing
DRAW(surfWing);
