/* 403266: Fabrizio Andreoli
** exercise1.js
** Produce the model of a single wing in a local coordinate system.
*/

var domain2 = DOMAIN([[0,1],[0,1]])([15,30]);

/* Create control point for BEZIER(S0) */
var cpwing0 = [[10,0,0],[0,5,0],[0,-3,0],[5,2,0],[10,0,0]];
var cpwing1 = [[10,0,10],[0,5,10],[0,-3,10],[5,2,10],[10,0,10]];
var cpwing2 = [[10,0,20],[0,5,20],[0,-3,20],[5,2,20],[10,0,20]];
var cpwing3 = [[10,0,30],[0,5,30],[0,-3,30],[5,2,30],[10,0,30]];
var cpwing4 = [[5,0,40],[0,2.5,40],[0,-1.5,40],[2.5,1,40],[5,0,40]];
var cpwing5 = [[0,0,50],[0,0,50],[0,0,50],[0,0,50],[0,0,50]];

var controls = AA(BEZIER(S0))([cpwing0,cpwing1,cpwing2,cpwing3,cpwing4,cpwing5]);

var wing = BEZIER(S1)(controls);
var surf = MAP(wing)(domain2);
DRAW(surf);
