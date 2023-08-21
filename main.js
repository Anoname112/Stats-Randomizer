var texts = ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'];
var statsCount = texts.length;
var maxBst = 255 * texts.length;
var stats;

window.onload = function () {
	document.getElementById('bst').value = 530;
	document.getElementById('padding').value = 10;
	document.getElementById('bst').focus();
	inputChanged();
}

function isNumeric (value) {
	return /^\d+$/.test(value);
}

function getTotal () {
    var total = 0;
    for (var i = 0; i < stats.length; i++) total += stats[i];
    return total;
}

function statChanged (sender) {
	document.getElementById('total').innerHTML = "";
	
	var total = 0;
	for (var i = 0; i < statsCount; i++) {
		var stat = parseInt(document.getElementById('stat' + i).value);
		document.getElementById('label' + i).innerHTML = stat;
		total += stat;
	}
	
	document.getElementById('total').innerHTML = total;
}

function inputChanged (sender) {
	var bst = document.getElementById('bst').value;
	var padding = document.getElementById('padding').value;
	var rounding = parseInt(document.getElementById('rounding').value);
	var tendencies = document.getElementById('tendencies').value;
	
	if ((isNumeric(bst) || bst.length == 0) && (isNumeric(padding) || padding.length == 0)) {
		bst = bst.length > 0 ? parseInt(bst) : 0;
		padding = padding.length > 0 ? parseInt(padding) : 0;
		
		if (bst > maxBst) {
			document.getElementById('bst').value = maxBst;
			inputChanged();
			return;
		}
		
		var randomValues = [];
		var totalValue = 0;
		var sortedStats = [];
		var totalStats = 0;
		
		var firstSecond = Math.random() * 2;
		stats = [];
		
		// Generate random values
		for (var i = 0; i < statsCount; i++) {
			var random = Math.floor(Math.random() * 100) + 1 + padding;
			totalValue += random;
			randomValues.push(random);
		}
		
		// Generate stats and apply rounding
		for (var i = 0; i < statsCount; i++) {
			var stat = Math.floor((randomValues[i] / totalValue * bst) / rounding) * rounding;
			totalStats += stat;
			sortedStats.push(stat);
		}
		
		// Find biggest stat index (max) and assign the total difference to the biggest stat
		var diff = bst - totalStats;
		var max = 0;
		for (var i = 1; i < statsCount; i++) if (sortedStats[i] > sortedStats[max]) max = i;
		sortedStats[max] += diff;
		
		// Sort stats
		for (var i = 0; i < sortedStats.length - 1; i++) {
			for (var j = i + 1; j < sortedStats.length; j++) {
				if (sortedStats[i] > sortedStats[j]) {
					var temp = sortedStats[i];
					sortedStats[i] = sortedStats[j];
					sortedStats[j] = temp;
				}
			}
		}
		
		// Get priority stats
		var assignedIndex = [];
		var priorityIndex = [];
		if (firstSecond < 1) {
			switch (tendencies) {
				case 'atkspe': priorityIndex.push(1); priorityIndex.push(5); break;
				case 'spaspe': priorityIndex.push(3); priorityIndex.push(5); break;
				case 'defspd': priorityIndex.push(2); priorityIndex.push(4); break;
				default: break;
			}
		}
		else {
			switch (tendencies) {
				case 'atkspe': priorityIndex.push(5); priorityIndex.push(1); break;
				case 'spaspe': priorityIndex.push(5); priorityIndex.push(3); break;
				case 'defspd': priorityIndex.push(4); priorityIndex.push(2); break;
				default: break;
			}
		}
		
		// Assign priority stats
		for (var i = 0; i < priorityIndex.length; i++) {
			stats[priorityIndex[i]] = sortedStats.pop();
			assignedIndex.push(priorityIndex[i]);
		}
		
		// Assign other stats
		while (assignedIndex.length < statsCount) {
			var index = Math.floor(Math.random() * statsCount);
			if (!assignedIndex.includes(index)) {
				stats[index] = sortedStats.pop();
				assignedIndex.push(index);
			}
		}
		
		updateResult();
	}
	else document.getElementById('output').innerHTML = '';
}

function updateResult () {
	var outputStr = `<table class="data">`;
	var rangeStr = `<table class="data">`;
	
	for (var i = 0; i < statsCount; i++) {
		outputStr += `<tr>
				<td class="text">` + texts[i] + `</td>
				<td class="number">` + stats[i] + `</td>
				<td><div class="bar" style="width: ` + (stats[i] * 0.55) + `px;"></div></td>
			</tr>`;
		rangeStr += `<tr>
				<td class="text">` + texts[i] + `</td>
				<td><input type="range" id="stat` + i + `" class="bar range" oninput="statChanged();" onchange="statChanged();" min="0" max="` + maxBst + `" value="` + stats[i] + `"></td>
				<td class="number"><span id="label` + i + `"></span></td>
			</tr>`;
	}
	
	outputStr += `<tr>
				<td class="text">BST</td>
				<td class="number">` + getTotal() + `</td>
				<td></td>
			</tr>
		</table>`;
	rangeStr += `<tr>
				<td class="text">BST</td>
				<td><span id="total"></span></td>
			</tr>
		</table>`;
	
	document.getElementById('output').innerHTML = outputStr;
	document.getElementById('adjuster').innerHTML = rangeStr;
	statChanged();
}