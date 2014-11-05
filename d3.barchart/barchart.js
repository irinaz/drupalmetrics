/**
 * @file
 * Adds a function to generate a column chart to the `Drupal` object.
 */

/** 
 * Notes on data formatting:
 * legend: array of text values. Length is number of data types.
 * rows: array of arrays. One array for each point of data
 * arrays have format array(label, data1, data2, data3, ...)
 */

(function($) {

  Drupal.d3.barchart = function (select, settings) {
 	console.log(settings);  // show data that came to d3 from views
 
	var rows = settings.d3rows;   
 	console.log   (rows) ;	  	// show data converted to use for d3 visualzation
						
    var labels = [],
      key = settings.legend || [],
      rows = settings.d3rows,
      p = settings.padding || [100, 100, 100, 100],
      w = (settings.width || 900) - p[1] - p[3],
      h = (settings.height || 400),
 //     chart = settings.chart || {w: w * .60, h: h - p[0] - p[2] }, // with legend
      chart = settings.chart || {w: w * .99, h: h - p[0] - p[2] }; // no legend
 //     legend = {w: w * .25, h:h},
 //     x = d3.scale.linear().domain([0,rows.length - 1]).range([20,chart.w]),
  //    y = d3.scale.linear().domain([0,10000]).range([chart.h, 0]),
 
  
 	  var padding = p[1];
	  var i;
	  var box_width=200; // variable that determines box width and text length
// var parseDate = d3.time.format("%d-%b-%y").parse;
 
	  var svg = d3.select('#' + settings.id).append("svg")  // create svg element in the views area
		   .attr('class', 'd3container')  // class container is already in use by bootstrap css framework
		   .attr ('width', w) // width and height should be set in js not in css for consistency 
		   .attr ('height', h)
		   .attr ('padding', p[1]) // does not work?
		   .append("g");
 		
// Define scales and  axes
					 
	  var xScale = d3.scale.linear()
						   .domain([0, 100])
						   .range([ padding, w]);
							 
	  
	  var yScale = d3.scale.linear()   // set y max to be slightly larger than value that is coming from the view 
						   .domain([0, d3.max(rows, function(d) { return d.total * 1.1  ; })])
						   .range([ h, 0]);
 	   
	  var xAxis = d3.svg.axis()
		  .scale(xScale)
		  .orient("bottom")
		  .ticks(5);

	  var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left")
						.ticks(10);		   			
	  
// add data
     
	   svg.selectAll("g")
		 .data(rows)
		 .enter()
		 .append("rect")  // draw all columns, define width and space between columns in js, colors in css
		 .attr("class", "column")
		 .attr("x", function (d, i) { return  (i*6) + padding   } )
		 .attr("width", 4)
		 .attr("y", function (d) { return  ( yScale(d.total  )   )   } )
		 .attr("height", function(d) {
			 return ( h -  yScale(d.total   )  );
		 })
		 
  			   
	// rollovers set directly, could be moved to tooltip library			   
 		 .on("mouseover", function(d,i) {
			  var bar = d3.select(this);
  //		  debugger;
			  d3.select(this.parentElement)
			  .insert("text")
			  .text( d.title + ' $' +  d.total  )
		 	  .attr("class", "label")
			  .attr("y",  h - 100  )
			  .attr("x",  ( i * 6  + padding + 20))
			   ;
		 })
		 .on("mouseout", function(d,i) {
			  d3.select(this.parentElement).selectAll("text.label") 
						.style("opacity", 0);
 		 })
 		  .on("click", function(d,i) {
		  //   console.log(d, this);
			  d3.select(this.parentElement)
			  window.location ="/node/" + d.nid;	// link bar to the node			 
		 });
  		 
// add axes
 		 
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + h + ")")
		  .call(xAxis);
		  
	  svg.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate(" + padding + ",0)")
		  .call(yAxis);	 
 
  }

})(jQuery);
