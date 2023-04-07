window.onload = function () {
	document.getElementById('bst').value = 530;
	document.getElementById('padding').value = 10;
	document.getElementById('bst').focus();
	inputChanged();
}

function isNumeric (value) {
	return /^\d+$/.test(value);
}

function inputChanged (sender) {
	var bst = document.getElementById('bst').value;
	var padding = document.getElementById('padding').value;
	var rounding = parseInt(document.getElementById('rounding').value);
	var tendencies = document.getElementById('tendencies').value;
	
	if (isNumeric(bst) && isNumeric(padding)) {
		bst = parseInt(bst);
		padding = parseInt(padding);
		
		var randomValues = [];
		var totalValue = 0;
		var sortedStats = [];
		var totalStats = 0;
		
		var firstSecond = Math.random() * 2;
		var stats = [];
		var statsCount = 6;
		var texts = ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'];
		
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
		
		// Find max index and assign the total difference
		var diff = bst - totalStats;
		var max = 0;
		for (var i = 1; i < statsCount; i++) if (sortedStats[i] > sortedStats[max]) max = i;		// Remainder will be assigned to the biggest stats
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
				case "atkspe": priorityIndex.push(1); priorityIndex.push(5); break;
				case "spaspe": priorityIndex.push(3); priorityIndex.push(5); break;
				case "defspd": priorityIndex.push(2); priorityIndex.push(4); break;
				default: break;
			}
		}
		else {
			switch (tendencies) {
				case "atkspe": priorityIndex.push(5); priorityIndex.push(1); break;
				case "spaspe": priorityIndex.push(5); priorityIndex.push(3); break;
				case "defspd": priorityIndex.push(4); priorityIndex.push(2); break;
				default: break;
			}
		}
		
		// Assign priority stats
		for (var i = 0; i < priorityIndex.length; i++) {
			stats[priorityIndex[i]] = sortedStats[sortedStats.length - 1];
			sortedStats.pop();
			assignedIndex.push(priorityIndex[i]);
		}
		
		// Assign other stats
		while (assignedIndex.length < statsCount) {
			var index = Math.floor(Math.random() * statsCount);
			if (!assignedIndex.includes(index)) {
				stats[index] = sortedStats[sortedStats.length - 1];
				sortedStats.pop();
				assignedIndex.push(index);
			}
		}
		
		var total = 0;
		for (var i = 0; i < statsCount; i++) total += stats[i];
		
		var output = '<table class="data">';
		for (var i = 0; i < statsCount; i++) {
			output += '<tr><td class="text">' + texts[i] + ':</td><td class="number">' + stats[i] + '</td><td><div class="bar" style="width: ' + stats[i] + 'px; height: 10px;"></div></td></tr>'
		}
		output += '<tr><td class="text">BST:</td><td class="number">' + total + '</td><td></td></tr></table>';
		
		document.getElementById('output').innerHTML = output;
	}
	else document.getElementById('output').innerHTML = "";
}