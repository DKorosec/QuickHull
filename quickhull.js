/*
  var output = QuickHull(input);
  input  = is an array of objects that must have .x and .y property!
  Output = array of points that are on the convex hull (input array with removed non convex points)
*/

(function(){ 
function getVectorAB(A,B)
{
  return {x:B.x-A.x, y:B.y-A.y};
}
function Vector2(x,y)
{
  return {x,y};
}
function PT(x,y)
{
  return Vector2(x,y);
}

function CrossProductVec(V1,V2)
{
  return V1.x*V2.y - V2.x*V1.y;
}

function ScalarVec(V1,V2)
{
  return V1.x*V2.x+V1.y*V2.y;
}
function VectorAngle(V1,V2)
{
  return Math.acos(ScalarVec(V1,V2)/(Math.sqrt(ScalarVec(V1,V1))*Math.sqrt(ScalarVec(V2,V2))));
}

function VectorAngleToDeg(angle)
{
  return angle*(180.0/Math.PI);
}
function getDistance(P1,P2)
{
  return ((P1.x-P2.x)*(P1.x-P2.x))+((P1.y-P2.y)*(P1.y-P2.y));
}



function getCentroid(A,B,C) //tezisce trikotnika s 3 krajevnimi vektorji
{
	return {x: (A.x+B.x+C.x)/3.0, y:(A.y+B.y+C.y)/3.0};
}

function getDegAngle(P1,P2)
{
	var angle = Math.atan2(P2.y - P1.y, P2.x - P1.x) * (180.0 / Math.PI);
	if(angle<0)
	  return angle+360;
	return angle;
}
function getABCArea(A,B,C) //vrne poloscino
{
	return 0.5*Math.abs(A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y));
}


QuickHull = function(points)
{
	var acceptedPoints = [];
	if(points.length==3)
	{
		for(var i=0;i<points.length;i++)
			acceptedPoints.push(points[i]);
		acceptedPoints.push(points[0]);
		return (acceptedPoints);
		
	}
	else if(points.length<3)
	{
		return [];
	}
	

	var POINTS = points;
  
    var minX=0,maxX=0;
	for(var i=1;i<POINTS.length;i++)
	{
		if(POINTS[i].x<POINTS[minX].x)
			minX = i;
		if(POINTS[i].x>POINTS[maxX].x)
			maxX = i;
	}
	var leftPoints = [];
	var rightPoints = [];
	var splitLineVector = getVectorAB(POINTS[minX],POINTS[maxX]);
	
	var leftPointsMaxABC = null;
	var leftArea = 0;
	var rightPointsMaxABC = null;
	var rightArea = 0;
	for(var i=0;i<POINTS.length;i++)
	{
		if(POINTS[i] != POINTS[minX] && POINTS[i] != POINTS[maxX])
		{
			var value = CrossProductVec(splitLineVector,getVectorAB(POINTS[maxX],POINTS[i]));
			if(value<=0)
			{
				leftPoints.push(POINTS[i]);
			}
			else
			{
				rightPoints.push(POINTS[i]);
			}
		}
	}
  
   var _STACK = [];
   _STACK.push(POINTS[minX]);
   var STACKL = DoQuickHull(leftPoints,POINTS[minX],POINTS[maxX]);
   _STACK = _STACK.concat(STACKL);
   _STACK.push(POINTS[maxX]);
   var STACKR = DoQuickHull(rightPoints,POINTS[maxX],POINTS[minX]); 
   _STACK = _STACK.concat(STACKR);
   
   return _STACK; 
   
}

function DoQuickHull(POINTS,minPoint,maxPoint)
{
	if(POINTS.length<2)
	{
		return POINTS;
	}
	var validLeftPoints = [];
	var validRightPoints = [];
	
	var maxAreaPoint = null;
	var maxArea = -1;
	
	for(var i=0;i<POINTS.length;i++)
	{
		if(POINTS[i] != minPoint && POINTS[i] != maxPoint)
		{
		    var area = getABCArea(minPoint,POINTS[i],maxPoint); 
			if(area>maxArea) 
			{
				maxArea = area;
				maxAreaPoint = POINTS[i];
			}
			else if(area == maxArea) 
			{
				var oldAngle = VectorAngle(getVectorAB(maxAreaPoint,minPoint),getVectorAB(maxAreaPoint,maxPoint));
				var newAngle = VectorAngle(getVectorAB(POINTS[i],minPoint),getVectorAB(POINTS[i],maxPoint));
				if(oldAngle<newAngle)
				{
					maxArea = area;
					maxAreaPoint = POINTS[i];
				}
			}
		}
	}
	
	var _MergedStack = [];
	
	for(var i=0; i< POINTS.length;i++)
	{
		if(POINTS[i] != minPoint && POINTS[i] != maxPoint && POINTS[i] != maxAreaPoint)
		{
			
			var leftCrossP = CrossProductVec(getVectorAB(minPoint,maxAreaPoint),getVectorAB(maxAreaPoint,POINTS[i]));
			var rightCrossP = CrossProductVec(getVectorAB(maxAreaPoint,maxPoint),getVectorAB(maxPoint,POINTS[i]));
			if(leftCrossP<0 && rightCrossP>0)
			{
				validLeftPoints.push(POINTS[i]);
			}
			else if(leftCrossP > 0 && rightCrossP < 0)
			{
				validRightPoints.push(POINTS[i]);
			}
		}
	}
	
	var _LStack = DoQuickHull(validLeftPoints,minPoint,maxAreaPoint); 
	var _RStack = DoQuickHull(validRightPoints,maxAreaPoint,maxPoint); 
	for(var i=0;i<_LStack.length;i++) 
	{
		_MergedStack.push(_LStack[i]);
	}
	_MergedStack.push(maxAreaPoint);
	for(var i=0;i<_RStack.length;i++)
	{
		_MergedStack.push(_RStack[i]);
	}
	return _MergedStack;
}

})();


