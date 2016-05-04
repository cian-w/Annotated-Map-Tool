/*
Student Number: R00112634
Name: Cian Woods
*/


//Declare variables and array
var canvas , ctx ;
var xyarray = [];
var indexCount = 0;
var timing;



//Load buttons when script is ready
window.onload = playRecordButtons;




/* Allow user to interact with canvas only after they click start recording */
function startCanvas() {
	canvas = document.getElementById("mapCanvas");
	ctx = canvas.getContext("2d");
	canvas.onmousemove = draw;
	canvas.onmouseout = editedMap;
	canvas.onclick = storeMarker;
}








/* Redraw canvas on every mouse move */
function draw (moveObj) {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	ctx.beginPath();
	if (xyarray[1] != null) {
		ctx.moveTo(xyarray[0].x, xyarray[0].y);
	}

	for(var i=1; i<xyarray.length; i++){
		ctx.moveTo(xyarray[i-1].x, xyarray[i-1].y);
		ctx.lineTo(xyarray[i].x,xyarray[i].y);
		ctx.closePath();
		ctx.stroke();
	}

	for (var i = 0; i < xyarray.length; i++)
	{
		cursorCircle(xyarray[i].x,xyarray[i].y);
	}

	var coords = getMouseCoords(moveObj);
	var xPos = coords[0];
	var yPos = coords[1];

	cursorCircle(xPos,yPos);
}


function cursorCircle (coX, coY) {
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.arc(coX, coY, 12,0,2*Math.PI);
	ctx.fill();
}




/* Update map when user moves or deletes a row on marker list */
function editedMap() {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	ctx.beginPath();
	if (xyarray[1] != null) {
		ctx.moveTo(xyarray[0].x, xyarray[0].y);
	}

	for(var i=1; i<xyarray.length; i++){
		ctx.moveTo(xyarray[i-1].x, xyarray[i-1].y);
		ctx.lineTo(xyarray[i].x,xyarray[i].y);
		ctx.closePath();
		ctx.stroke();
	}

	for (var i = 0; i < xyarray.length; i++)
	{
		cursorCircle(xyarray[i].x,xyarray[i].y);
	}

}










/* Create record and play buttons */
function playRecordButtons () {
	var btndiv = document.getElementById('buttons');
	var recordbtn = document.createElement('button');
	var playbtn = document.createElement('button');
	var recordText = document.createTextNode("Start Recording");
	var playText = document.createTextNode("Play");

	recordbtn.setAttribute('id', 'startrecord');

	recordbtn.innerHTML = "Start Recording";
	playbtn.innerHTML = "Play";

	btndiv.appendChild(recordbtn);
	btndiv.appendChild(playbtn);

	playbtn.style.margin = "5px";
	playbtn.style.backgroundColor = "#808080";
	playbtn.style.borderRadius = "9px";
	playbtn.style.fontWeight = "bold";

	recordbtn.style.backgroundColor = "#808080";
	recordbtn.style.borderRadius = "9px";
	recordbtn.style.fontWeight = "bold";

	recordbtn.onclick = empty;
	playbtn.onclick = disableBtns;
}








/* When user clicks start recording clear the canvas and empty co-ordinates array */
function empty() {
	if (xyarray.length >0) {
		var table = document.getElementById("list");
		while (table.rows.length > 1) {
			table.deleteRow(table.rows.length-1);
		}
		xyarray.length = 0;
		editedMap();
	}
	startCanvas();
}







function storeMarker(e) {
	var coords = getMouseCoords(e);
	var xPos = coords[0];
	var yPos = coords[1];

	document.getElementById("form").style.display = "block";
	document.getElementById("label").focus();

	xyarray.push(  {x: xPos, y: yPos} );

	document.getElementById("save").onclick= storeLabel;
}


/* Allow user to save label by pressing enter key */
function checkKey(pressed) {
	var key = pressed.keyCode;
	if (key == 13) {
		storeLabel();
	}
}


/* Save new label in array */
function storeLabel() {
	var labelText = document.getElementById("label").value;
	xyarray[xyarray.length-1].label = labelText;

	var x = xyarray[xyarray.length-1].x;
	var y = xyarray[xyarray.length-1].y;

	document.getElementById("form").style.display = "none";

	document.getElementById("label").value = "";

	insertRow(labelText, x, y);
}


/* Create a row in marker table */
function insertRow (label, x, y) {
	var list = document.getElementById('list');

	var row  = list.insertRow();
	row.setAttribute("name","tablerow");

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);

	var text  = document.createTextNode('Label:');
	var xtext = document.createTextNode(' x: ' + x);
	var ytext = document.createTextNode(' y: ' + y);
	var upButton = document.createElement('button');
	var  downButton= document.createElement('button');
	var deleteButton = document.createElement('button');

	upButton.innerHTML = "Up";
	downButton.innerHTML = "Down";
	deleteButton.innerHTML="Delete";

	deleteButton.setAttribute("onclick", "removeRow(this)");
	upButton.setAttribute("onclick", "moveUp(this)");
	downButton.setAttribute("onclick", "moveDown(this)");

	deleteButton.setAttribute("id", "delete");
	upButton.setAttribute("name", "up");
	downButton.setAttribute("id", "down");

	deleteButton.style.backgroundColor = "#808080";
	deleteButton.style.borderRadius = "9px";
	deleteButton.style.color = "white";
	upButton.style.backgroundColor = "#808080";
	upButton.style.borderRadius = "9px";
	upButton.style.color = "white";
	downButton.style.backgroundColor = "#808080";
	downButton.style.borderRadius = "9px";
	downButton.style.color = "white";

	var input = document.createElement("input");
	input.type = "text";
	input.value = label;

	//Update label every time key is released in input field
	input.setAttribute("onkeyup", "updateLabel(this)");

	cell1.style.borderBottom = "2px solid black";
	cell2.style.borderBottom = "2px solid black";
	cell3.style.borderBottom = "2px solid black";
	cell1.style.borderLeft = "2px solid black";
	cell2.style.borderLeft = "2px solid black";
	cell3.style.borderLeft = "2px solid black";

	cell1.appendChild(upButton);
	cell1.appendChild(downButton);
	cell2.appendChild(text);
	cell2.appendChild(input);
	cell2.appendChild(xtext);
	cell2.appendChild(ytext);
	cell3.appendChild(deleteButton);
}













/* Table Functionality - Edit label, delete and move rows up/down while also changing position in co-ordinates array */
function removeRow(row) {
	var rowToDelete = row.parentNode.parentNode.rowIndex;
	document.getElementById('list').deleteRow(rowToDelete);

	var index = rowToDelete -1;
	if (index > -1) {
		xyarray.splice(index,1);
	}

	editedMap();
	indexCount = 0;
}


function moveUp(row) {
	var table = document.getElementById('list');
	var rowToMoveUp = row.parentNode.parentNode;

	if (rowToMoveUp.rowIndex != 1) {
		var markerlist = rowToMoveUp.parentNode;
		var rowAbove = rowToMoveUp.previousSibling;
		var index = rowToMoveUp.rowIndex - 1;
		var newIndex = index-1;
		var previousX = xyarray[newIndex]['x'];
		var previousY = xyarray[newIndex]['y'];
		var previousLabel = xyarray[newIndex]['label'];
		var newX = xyarray[index]['x'];
		var newY = xyarray[index]['y'];
		var newLabel = xyarray[index]['label'];

		markerlist.insertBefore(rowToMoveUp,rowAbove);

		xyarray[newIndex]['x'] = newX;
		xyarray[newIndex]['y'] = newY;
		xyarray[newIndex]['label'] = newLabel;

		xyarray[index]['x'] = previousX;
		xyarray[index]['y'] = previousY;
		xyarray[index]['label'] = previousLabel;

		editedMap();
	} else {}
	indexCount = 0;
}

function moveDown(row) {
	var table = document.getElementById('list');
	var rowToMoveDown = row.parentNode.parentNode;

	if (rowToMoveDown.rowIndex != xyarray.length) {
		var markerlist = rowToMoveDown.parentNode;
		var rowBelow = rowToMoveDown.nextSibling;
		var index = rowToMoveDown.rowIndex - 1;
		var newIndex = index+1;
		var nextX = xyarray[newIndex]['x'];
		var nextY = xyarray[newIndex]['y'];
		var nextLabel = xyarray[newIndex]['label'];
		var newX = xyarray[index]['x'];
		var newY = xyarray[index]['y'];
		var newLabel = xyarray[index]['label'];

		markerlist.insertBefore(rowToMoveDown, rowBelow.nextSibling);

		xyarray[newIndex]['x'] = newX;
		xyarray[newIndex]['y'] = newY;
		xyarray[newIndex]['label'] = newLabel;

		xyarray[index]['x'] = nextX;
		xyarray[index]['y'] = nextY;
		xyarray[index]['label'] = nextLabel;

		editedMap();
	} else {}
	indexCount = 0;
}



function updateLabel (e) {
	var labelRow = e.parentNode.parentNode.rowIndex;
	var fieldPosition = labelRow + 1;
	var index = labelRow -1;
	var newLabel = document.getElementsByTagName('input')[fieldPosition].value;

	xyarray[index]['label'] = newLabel;
	indexCount = 0;
}






/* Disable buttons and play markers with labels on canvas */
function disableBtns() {
	canvas.onmousemove = null;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	var buttons = document.getElementsByTagName("button");

	for (var i=0; i<buttons.length; i++){
		buttons[i].disabled = true;
		buttons[i].style.backgroundColor = "#DADAD9";
	}

	timer();
}


function timer() {
	timing = setInterval(playMarkers, 3000);
}


function playMarkers() {
	if (indexCount !== xyarray.length){
		var xPos = xyarray[indexCount].x;
		var yPos = xyarray[indexCount].y;
		var xMidPoint = canvas.width/2;
		var yMidPoint = canvas.height/2;
		var labelTxt = xyarray[indexCount].label;
		var width = ctx.measureText(labelTxt).width;

		ctx.beginPath();
		ctx.moveTo(xPos, yPos);
		var font = ctx.font="20px Arial";

		if(indexCount !== 0) {
			ctx.lineTo(xyarray[indexCount-1].x,xyarray[indexCount-1].y);
		}


		ctx.fillStyle = "white";
		ctx.stroke();
		ctx.lineWidth="3";

		//Position label depending on co-ordinates of marker
		if(xPos < xMidPoint && yPos < yMidPoint)
		{
			setTimeout(function() {clearLabel(xPos+7, yPos+20, width+20,parseInt(font, 15), indexCount)}, 2000);

			ctx.fillRect(xPos+7, yPos+20, width+20, parseInt(font, 15));
			ctx.strokeRect(xPos+7, yPos+20, width+20, parseInt(font, 15));
			ctx.fillStyle = "black";
			ctx.fillText(labelTxt,xPos +10, yPos+40);


		} else if (xPos < xMidPoint && yPos > yMidPoint)
		{
			setTimeout(function() {clearLabel(xPos+15, yPos-40, width+25, parseInt(font, 15), indexCount )}, 2000);
			ctx.fillRect(xPos+15, yPos-40, width+25, parseInt(font, 15));
			ctx.strokeRect(xPos+15, yPos-40, width+25, parseInt(font, 15));
			ctx.fillStyle = "black";
			ctx.fillText(labelTxt,xPos +20, yPos-20);



		} else if (xPos > xMidPoint && yPos < yMidPoint)
		{
			setTimeout(function() {clearLabel(xPos-60, yPos+20, width+20, parseInt(font, 15), indexCount)}, 2000);
			ctx.fillRect(xPos-60, yPos+20, width+20, parseInt(font, 15));
			ctx.strokeRect(xPos-60, yPos+20, width+20, parseInt(font, 15));
			ctx.fillStyle = "black";
			ctx.fillText(labelTxt,xPos -60, yPos+40);



		} else if (xPos > xMidPoint && yPos > yMidPoint)
		{
			setTimeout(function() {clearLabel(xPos-60, yPos-45, width+20, parseInt(font, 15), indexCount )}, 2000);
			ctx.fillRect(xPos-60, yPos-45, width+20, parseInt(font, 15));
			ctx.strokeRect(xPos-60, yPos-45, width+20, parseInt(font, 15));
			ctx.fillStyle = "black";
			ctx.fillText(labelTxt,xPos -60, yPos-20);

		}

		ctx.lineWidth ="1";

		if(indexCount !== 0) {
			cursorCircle(xyarray[indexCount-1].x,xyarray[indexCount-1].y);
		}

		if(indexCount == 0) {
			cursorCircle(xyarray[0].x,xyarray[0].y);
		}

		cursorCircle(xPos,yPos);

	} else {
		clearInterval(timing);
		timing = null;
		indexCount = 0;
		var buttons = document.getElementsByTagName("button");
		for (var i=0; i<buttons.length; i++){
			buttons[i].disabled = false;
			buttons[i].style.backgroundColor = "#808080";
		}
	}

	indexCount++;
}


function clearLabel(x,y,h,w,num) {
	ctx.clearRect(x-2,y-2,h+4,w+4);
	redraw(num);
}

function redraw(num) {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	ctx.beginPath();
	if (xyarray[1] != null) {
		ctx.moveTo(xyarray[0].x, xyarray[0].y);
	}

	for(var i=1; i<num; i++){
		ctx.lineWidth = "0.8";
		ctx.moveTo(xyarray[i-1].x, xyarray[i-1].y);
		ctx.lineTo(xyarray[i].x,xyarray[i].y);
		ctx.closePath();
		ctx.stroke();
	}

	for (var i = 0; i < num; i++)
	{
		cursorCircle(xyarray[i].x,xyarray[i].y);
	}

}
