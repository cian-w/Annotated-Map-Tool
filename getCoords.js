//from quirksmode.org
//returns added offset of all containing elements

function findPos(obj) {
	
	var curleft = curtop = 0;

	if (obj.offsetParent) {


	do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;


		} while (obj = obj.offsetParent);

	return [curleft,curtop];
	}

}





// Return the coordinates of the mouse relative to the canvas
// we must explicitly pass this function an event object since 
// it isn't an event handler

/*

Assume demoFunction() is the eventHandler

E.g. 

document.getElementById("mycanvas").onmousemove = demoFunction;

Then in the function you pass the event object to the getMouseCoords() function.
The x,y coordinates are passed back in an array.

E.g. 

function demoFunction(eventObject)
{
	 
	
	var coords = getMouseCoords(eventObject);
	
	var xPos = coords[0]
	var yPos = coords[1]
	
	etc.
	
	etc. 
	
}

*/



function getMouseCoords(event)
{
	
	if (!event) var event = window.event;

	var posx = 0;
	var posy = 0;
	if (event.pageX || event.pageY) 	{
		posx = event.pageX;
		posy = event.pageY;
	}
	else if (event.clientX || event.clientY) 	{
		posx = event.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = event.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}


	// get the offsets of the object that triggered the eventhandler
	var totaloffset = findPos(event.target);
	
 	var totalXoffset = totaloffset[0];
 	var totalYoffset = totaloffset[1];

 	var canvasX = posx- totalXoffset;
 	var canvasY = posy- totalYoffset;

 	// return coordinates in an array
	return [canvasX, canvasY];
	
}	