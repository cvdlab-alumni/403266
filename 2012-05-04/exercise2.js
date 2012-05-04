/* 403266: Fabrizio Andreoli
** exercise2.js
** Produce the model of the fuselage (local coordinate system).
*/

var domainFuselage = DOMAIN([[0,1],[0,1]])([15,30]);	// Divide x axis into 15 intervals and y's into 30

/* Create control point for BEZIER(S0) */
var cpFuselage0 = [[0,10,0],[0,10,10],[0,0,10],[0,0,0],[0,10,0]];
var cpFuselage1 = cpFuselage0.map(function (p) {return [p[0]-10, p[1], p[2]]});
var cpFuselage2 = cpFuselage0.map(function (p) {return [p[0]-20, p[1], p[2]]});
var cpFuselage3 = cpFuselage0.map(function (p) {return [p[0]-30, p[1], p[2]]});
var cpFuselage4 = cpFuselage0.map(function (p) {return [p[0]-40, p[1], p[2]]});
var cpFuselage5 = cpFuselage0.map(function (p) {return [p[0]-50, p[1], p[2]]});

var controlsFuselage = AA(BEZIER(S0))([cpFuselage0,cpFuselage1,cpFuselage2,cpFuselage3,cpFuselage4,cpFuselage5]);

var wing = BEZIER(S1)(controlsFuselage);
var surf = MAP(wing)(domainFuselage);

DRAW(surf);
