$("#win").hide();
$("#lose").hide();

if(localStorage["theme"] != undefined){
	$("html").attr("class", localStorage["theme"]);
} else {
	localStorage["theme"] = "";
	$("html").attr("class", "");
}

$("#light").click(()=>{
	localStorage["theme"] = "";
	$("html").attr("class", localStorage["theme"]);
});

$("#dark").click(()=>{
	localStorage["theme"] = "dark";
	$("html").attr("class", localStorage["theme"]);
});

var gameBlock = document.querySelector("#game");
var lines = [];
for (var i = 0; i < 9; i++) {
	var div = document.createElement("div");
	div.className = "styleStrokeGameTable";
	lines[i] = [];
	for (var j = 0; j < 9; j++) {
		var span = document.createElement("span");
		$(span).text("");
		if((i == 2 && j == 2) || (i == 2 && j == 5) || (i == 5 && j == 2) || (i == 5 && j == 5)) $(span).addClass("styleCellBR");
		else if(j == 2 || j == 5) $(span).addClass("styleCellR");
		else if(i == 2 || i == 5) $(span).addClass("styleCellB");
		else $(span).addClass("styleCellGameTable");
		$(span).attr("id", i + "_" + j);
		div.appendChild(span);
	}
	gameBlock.appendChild(div);
}

reset();

function fillBoard() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (lines[i][j] === "") {
				let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				while (nums.length > 0) {
					let index = Math.floor(Math.random() * nums.length);
					let num = nums[index];
					nums.splice(index, 1);
					if (isValid(i, j, num)) {
						lines[i][j] = num;
						$("#" + i + "_" + j).text(num);
						if (fillBoard()) return true;
						else lines[i][j] = "";
					}
				}
				return false;
			}
		}
	}
	return true;
}

function isValid(row, col, num) {
	for (let i = 0; i < 9; i++) {
		if (lines[row][i] === num || lines[i][col] === num) return false;
	}

	let startRow = Math.floor(row / 3) * 3;
	let startCol = Math.floor(col / 3) * 3;

	for (let i = startRow; i < startRow + 3; i++) {
		for (let j = startCol; j < startCol + 3; j++) {
			if (lines[i][j] === num) return false;
		}
	}

	return true;
}

function reset() {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			lines[i][j] = "";
			$("#" + i + "_" + j).text("").css({ "color": "" }).css({ "background-color": "transparent" }).removeClass("tic").off("click");
		}
	}
	fillBoard();
	delElemRand();
}

function delElemRand() {
	var row, col;
	var deleted = 0;
	while (deleted < 25) {
		row = Math.floor(Math.random() * 9);
		col = Math.floor(Math.random() * 9);
		if (lines[row][col] != "") {
			lines[row][col] = "";
			$("#" + row + "_" + col).text("").addClass("tic").on("click", clickTic);
			deleted++;
		}
	}
}

var num = 1;
$("#number span").click(function () {
	$("#win").hide();
	$("#lose").hide();
	$("#number span").addClass("styleNumBlockNotActive");
	$(this).removeClass();
	$(this).addClass("styleNumBlockActive");
	num = +$(this).text();
});

document.addEventListener("keydown", function(event) {
  if (event.keyCode >= 96 && event.keyCode <= 105) {
    // клавиши на NumPad
    num = +(event.keyCode - 96);
  } else if (event.keyCode >= 49 && event.keyCode <= 57) {
    // клавиши на основной клавиатуре
    num = +(event.keyCode - 48);
  }
	$("#number span").addClass("styleNumBlockNotActive");
	$("#number span:nth-child("+num+")").removeClass();
	$("#number span:nth-child("+num+")").addClass("styleNumBlockActive");
});

function clickTic () {
	$("#win").hide();
	$("#lose").hide();
	$(this).text(+num);
	var id = $(this).attr("id");
	var i = id.slice(0, id.indexOf("_"));
	var j = id.slice(id.indexOf("_") + 1);
	lines[i][j] = +num;
	checkAllCells();
	// checkLines(+i, +j);
	// checkBlock(+i, +j);
}

function checkBlock(rowPos, colPos) {
	let blockHasDuplicates = false;
  const value = lines[rowPos][colPos];

	let startRow = Math.floor(rowPos / 3) * 3;
	let startCol = Math.floor(colPos / 3) * 3;

	for (let i = startRow; i < startRow + 3; i++) {
		for (let j = startCol; j < startCol + 3; j++) {
			if (lines[i][j] === value && !(i === rowPos && j === colPos)) {
				blockHasDuplicates = true;
				const cell = $("#" + i + "_" + j);
				if (cell.hasClass("tic")) cell.css("color", "red").css("background-color", "transparent");
				else cell.css("color", "white").css("background-color", "red");
			}
		}
	}
	
	const cell = $("#" + rowPos + "_" + colPos);
  if (cell.hasClass("tic")) {
    if (!blockHasDuplicates) cell.addClass("valid").css("background-color", "transparent");
    else cell.css("color", "red").css("background-color", "transparent");
  }

	return blockHasDuplicates;
}

function checkLines(rowPos, colPos) {
  let rowLines = false;
  let colLines = false;
  const value = lines[rowPos][colPos];
  
  for (let i = 0; i < 9; ++i) {
		if (i !== colPos && lines[rowPos][i] === value) {
			const cell = $("#" + rowPos + "_" + i);
      if(!cell.hasClass("tic")) cell.css("color", "white").css("background-color", "red");
      rowLines = true;
    }
		if (i !== rowPos && lines[i][colPos] === value) {
			const cell = $("#" + i + "_" + colPos);
      if(!cell.hasClass("tic")) cell.css("color", "white").css("background-color", "red");
      colLines = true;
    }
  }
	
	const cell = $("#" + rowPos + "_" + colPos);
  if (!cell.hasClass("tic")) {
    if (rowLines || colLines || checkBlock(rowPos, colPos)) cell.css("color", "white").css("background-color", "red");
    else cell.css("color", "").css("background-color", "transparent").removeClass("valid");
  } else {
    if (rowLines || colLines || checkBlock(rowPos, colPos)) cell.css("color", "red").css("background-color", "transparent");
    else cell.addClass("valid").css("background-color", "transparent");
  }
	
	return (rowLines && colLines);
}

function checkAllCells() {
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			$("#" + i + "_" + j).css("color", "").css("background-color", "transparent").removeClass("valid");
		}
	}
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			checkLines(i, j);
		}
	}
}

function checkLines1() {
	$("#win").hide();
	$("#lose").hide();
	for (var i = 0; i < 9; i++) {
		var row = [];
		var col = [];
		for (var j = 0; j < 9; j++) {
			row.push(lines[i][j]);
			col.push(lines[j][i]);
		}
		if (hasDuplicates1(row) || hasDuplicates1(col)) {
			$("#lose").show();
			return;
		}
	}
	$("#win").show();
	return;
}

function hasDuplicates1(array) {
	var valuesSoFar = [];
	for (var i = 0; i < 9; ++i) {
		var value = array[i];
		if (valuesSoFar.indexOf(value) !== -1) {
			return true;
		}
		valuesSoFar.push(value);
	}
	return false;
}