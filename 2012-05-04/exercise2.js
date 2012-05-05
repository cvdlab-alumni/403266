/* 403266: Fabrizio Andreoli
** exercise2.js
** Produce the model of the fuselage (local coordinate system).
*/

var domainFuselage = DOMAIN([[0,1],[0,1]])([15,30]);	// Divide x axis into 15 intervals and y's into 30

var r2 = Math.sqrt(2) / 2;
var fs = 5; // Constant use for size of fuselage

/*
// Half fuselage: a double BEIZER surface will build the fuselage. Note "_nr" stands for (still) not rotated.
var mapHalfFuselage_nr = [[0,fs,0],[0,fs,fs],[0,-fs,fs],[0,-fs,-fs],[0,0,-fs]];

// It have to remap to rotate it by PI/4 rad
var mapHalfFuselage = mapHalfFuselage_nr.map(function (p) {return [p[0], (p[1]-p[2]) * r2, (p[1]+p[2]) * r2]});
*/
// Half fuselage: a double BEIZER surface will build the fuselage.
var mapHalfFuselage = [[0,fs*r2,fs*r2],[0,0,2*r2*fs],[0,-2*r2*fs,0],[0,0,-2*r2*fs],[0,fs*r2,-fs*r2]];

// mapHalfFuselage "have" the lower part of Fuselage for the y axis: so have to swith y (p[1]) with z axis (p[2]).
var mapLowerFuselage0 = mapHalfFuselage.map(function (p) {return [p[0]   ,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage1 = mapHalfFuselage.map(function (p) {return [p[0]-10,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage2 = mapHalfFuselage.map(function (p) {return [p[0]-20,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage3 = mapHalfFuselage.map(function (p) {return [p[0]-30, (p[2])*0.7, (p[1]-fs*0.40)*0.9]});
var mapLowerFuselage4 = mapHalfFuselage.map(function (p) {return [p[0]-40, (p[2])*0.5, (p[1]-fs*0.40)*0.8]});
var mapLowerFuselage5 = mapHalfFuselage.map(function (p) {return [p[0]-50, (p[2])*0.3, (p[1]-fs*0.40)*0.7]});

// build TopFuselage mirroring LowerFuselage
var mapTopFuselage0 = mapLowerFuselage0.map(function (p) {return [p[0], -p[1], -p[2]]});
var mapTopFuselage1 = mapLowerFuselage1.map(function (p) {return [p[0], -p[1], -p[2]]});
var mapTopFuselage2 = mapLowerFuselage2.map(function (p) {return [p[0], -p[1], -p[2]]});
var mapTopFuselage3 = mapLowerFuselage3.map(function (p) {return [p[0], -p[1], -p[2]]});
var mapTopFuselage4 = mapLowerFuselage4.map(function (p) {return [p[0], -p[1], -p[2]]});
var mapTopFuselage5 = mapLowerFuselage5.map(function (p) {return [p[0], -p[1], -p[2]]});

var controlsLowerFuselage = AA(BEZIER(S0))([mapLowerFuselage0,mapLowerFuselage1,mapLowerFuselage2,mapLowerFuselage3,mapLowerFuselage4,mapLowerFuselage5]);
var lowerFuselage = BEZIER(S1)(controlsLowerFuselage);
var surfLowerFuselage = MAP(lowerFuselage)(domainFuselage);

var controlsTopFuselage = AA(BEZIER(S0))([mapTopFuselage0,mapTopFuselage1,mapTopFuselage2,mapTopFuselage3,mapTopFuselage4,mapTopFuselage5]);
var topFuselage = BEZIER(S1)(controlsTopFuselage);
var surfTopFuselage = MAP(topFuselage)(domainFuselage);

surfFuselage = STRUCT([surfLowerFuselage, surfTopFuselage]);

DRAW(surfFuselage);
                   
