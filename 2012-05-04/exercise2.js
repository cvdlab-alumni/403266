/* 403266: Fabrizio Andreoli
** exercise2.js
** Produce the model of the fuselage (local coordinate system).
*/

var domainFuselage = DOMAIN([[0,1],[0,1]])([30,30]);	// Divide x axis into 15 intervals and y's into 30

var r2 = Math.sqrt(2) / 2;
var fs = 0.5; // Constant use for size of fuselage
var lp = 1;

/*
// Half fuselage: a double BEIZER surface will build the fuselage. Note "_nr" stands for (still) not rotated.
var mapHalfFuselage_nr = [[0,fs,0],[0,fs,fs],[0,-fs,fs],[0,-fs,-fs],[0,0,-fs]];

// It have to remap to rotate it by PI/4 rad
var mapHalfFuselage = mapHalfFuselage_nr.map(function (p) {return [p[0], (p[1]-p[2]) * r2, (p[1]+p[2]) * r2]});
*/
// Half fuselage: a double BEIZER surface will build the fuselage.
var mapHalfFuselage = [[0,fs*r2,fs*r2],[0,0,2*r2*fs],[0,-2*r2*fs,0],[0,0,-2*r2*fs],[0,fs*r2,-fs*r2]];

// mapHalfFuselage "have" the lower part of Fuselage for the y axis: so have to swith y (p[1]) with z axis (p[2]).
var mapLowerFuselage0 = mapHalfFuselage.map(function (p) {return [p[0]     ,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage1 = mapHalfFuselage.map(function (p) {return [p[0]-lp  ,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage2 = mapHalfFuselage.map(function (p) {return [p[0]-lp*2,  p[2]     ,  p[1]-fs*0.40     ]});
var mapLowerFuselage3 = mapHalfFuselage.map(function (p) {return [p[0]-lp*3, (p[2])*0.7, (p[1]-fs*0.40)*0.9]});
var mapLowerFuselage4 = mapHalfFuselage.map(function (p) {return [p[0]-lp*4, (p[2])*0.5, (p[1]-fs*0.40)*0.8]});
var mapLowerFuselage5 = mapHalfFuselage.map(function (p) {return [p[0]-lp*5, (p[2])*0.3, (p[1]-fs*0.40)*0.7]});

var controlsLowerFuselage = AA(BEZIER(S0))([mapLowerFuselage0,mapLowerFuselage1,mapLowerFuselage2,mapLowerFuselage3,mapLowerFuselage4,mapLowerFuselage5]);
var lowerFuselage = BEZIER(S1)(controlsLowerFuselage);
var surfLowerFuselage = MAP(lowerFuselage)(domainFuselage);

var surfTopFuselage = S([0,1,2])([1,1,-1])(surfLowerFuselage);

surfFuselage = STRUCT([surfLowerFuselage, surfTopFuselage]);

DRAW(surfFuselage);
                   
