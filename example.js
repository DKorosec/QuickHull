function PT(x,y)
{
	return {x,y}
}
var convexPts = QuickHull([PT(0,0),PT(1,0),PT(0.5,0.5),PT(1,1),PT(0,1)]);
console.log(convexPts); //0,0 | 1,0 | 1,1 | 0,1