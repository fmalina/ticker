var Ticker = {
	load: function(url, callback){
		// make a get call, execute Ticker callback on the response data
		var xhr = false;
		var self = this;
		self.xhr=new XMLHttpRequest();
		self.xhr.open('GET', url, true);
		self.xhr.onreadystatechange = function(){
			if(self.xhr.readyState==4){
				Ticker[callback](self.xhr.responseText);
			}
		}
		self.xhr.send();
	},
	tag: function(name, i){
		// shortcut
		var i = typeof i !== 'undefined' ?  i : 0; // set default index param
		return document.getElementsByTagName(name)[i];
	},
	parse_csv: function(row){
		// adequately simple CSV parser
		var entries = [];
		row.split(',').forEach(function (cell){
			entries.push(cell);
		});
		return entries;
	},
	render_table: function(data){
		var thead = Ticker.tag('thead');
		var tbody = Ticker.tag('tbody');
		var heads = '', rows = '', lines = data.split('\n');
		var columns = Ticker.parse_csv(lines[0]);
		var data = lines.slice(1).map(Ticker.parse_csv);
		// render table header
		columns.forEach(function(th){
			heads += '<th>'+th+'</th>';
		});
		// render table body
		data.forEach(function(row){
			var cells = '';
			row.forEach(function(cell){
				cells += '<td>'+cell+'</td>';
			});
			rows += '<tr>'+cells+'</tr>';
		});
		// since the data comes from a trusted source (no XSS), just skip DOM
		thead.innerHTML = heads;
		tbody.innerHTML = rows;
		// done, draw a chart
		Ticker.draw_chart(data, false);
	},
	update_table: function(delta, delay) {
		var tbody = Ticker.tag('tbody');
		var row_index = 0;
		delta.forEach(function(row_delta){
			var update_row = tbody.rows[row_index];
			// One could make it colourful
			// update_row.style.color = Ticker.colors[row_index];
			row_index++;
			var cells = update_row.cells;
			for (var i = 0; i < cells.length; i++) {
				var new_text = row_delta[i];
				if(new_text){ 
					// ignore Mkt Cap
					if (i == 5) { continue; }
					// update new
					var cell = cells[i];
					cell.textContent = new_text;
					// visual cue: repaint element to restart animation
					cell.style.display='none';
					cell.offsetHeight;
					cell.style.display='table-cell';
				}
			}
		});
		//console.log('tick:', delay);
	},
	schedule_deltas: function(data){
		// Deltas would be coming down via polling or websocket.
		// For this demo let's schedule updates here in one go.

		// parse deltas.csv into an array of delays (int) and deltas (array)
		lines = data.split('\n');
		var current_delay = 0,
			delayed_deltas = [],
			delta = [];
		// Spec doesn't clarify order of updates. In a socket scenario,
		// the oldest updates would end up on the bottom of the CSV log file.
		// Also, there's no delay at the top, hence reverse() all lines.
		// Collect and than reverse each delta separately to correct.
		lines.reverse().forEach(function(line){
			var line_data = Ticker.parse_csv(line);
			if(line_data.length > 1){
				delta.push(line_data); // collect
			} else if (line_data[0]) {
				if(delta.length > 1){
					delayed_deltas.push([delay, delta.reverse()]); // correct
					delta = []; // reset
				}
				delay = parseInt(line_data[0], 10);
				// TODO: last delta skipped?
			}
		});
		// console.log(delayed_deltas);
		// schedule deltas to run
		var timer = 0;
		delayed_deltas.forEach(function(delay_delta){
			var delay = delay_delta[0];
			var delta = delay_delta[1];
			timer += delay;
			setTimeout(function(){
				Ticker.update_table(delta, delay);
				Ticker.draw_chart(false, delta);
			}, timer);
		});
		// loop
		setTimeout(function(){
			Ticker.load('deltas.csv', 'schedule_deltas');
		}, timer);
	},
	colors: ['deeppink', 'brown', 'red', 'coral', 'orange',
			'olive', 'green', 'turquoise', 'dodgerblue', 'navy'],
	draw_chart: function(initial, delta){
		var canvas = Ticker.tag('canvas');
		var c = canvas.getContext('2d');
		if (initial){
			var color_index = 0;
			c.fillText('Initial prices', 70, 10);
			
			// draw skip separator
			c.moveTo(20,  100);
			c.lineTo(300, 100);
			c.moveTo(20,  80);
			c.lineTo(300, 80);
			c.fillText('600', 0, 83);
			c.fillText('.', 7,   88);
			c.fillText('.', 7,   91);
			c.fillText('200', 0, 103);
			c.strokeStyle = '#ddd';
			c.stroke();
			c.stroke();
			
			initial.forEach(function(line){
				var company = line[1];
				var price = parseInt(line[2], 10);
				var h = price * -1 + 300;
				c.beginPath();
				c.fillStyle = Ticker.colors[color_index];
				c.textAlign = "right";
				// Google inflation visual fix
				if(line[0] == 'GOOG') { h = h +400; }
				// draw lines
				c.fillText(company, 95, h+3);
				c.fillText('$'+price, 150, h+3);
				c.moveTo(100, h);
				c.lineTo(120, h);
				c.strokeStyle = Ticker.colors[color_index];
				c.stroke();
				color_index++;
			});
			console.log(initial);
		}
	},
	init: function(){
		Ticker.load('snapshot.csv', 'render_table');
		// wait a bit
		setTimeout(function(){
			Ticker.load('deltas.csv', 'schedule_deltas');
		}, 2000);
	}
};