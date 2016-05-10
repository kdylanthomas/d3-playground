// it works! next goals:
// > re-work horizontal labels to be fixed for each
// > some kind of overflow-y on boxes to accommodate long artist names

// ***************
// PLACEHOLDER DATA
// ***************

var fridayArtists = [
{
    task: "St. Lucia",
    type: "This",
    startTime: "14:30:00",
    endTime: "15:30:00"
},

{
    task: "GRiZ",
    type: "Which",
    startTime: "18:00:00",
    endTime: "19:00:00"
},

{
    task: "J.Cole",
    type: "What",
    startTime: "20:00:00",
    endTime: "21:00:00"
},

{
    task: "LCD Soundsystem",
    type: "What",
    startTime: "22:00:00",
    endTime: "23:30:00"
}

];

var saturdayArtists = [
{
    task: "Chris Stapleton",
    type: "What",
    startTime: "14:30:00",
    endTime: "15:30:00"
},

{
    task: "Ellie Goulding",
    type: "Which",
    startTime: "19:45:00",
    endTime: "21:00:00"
},

];

// ***************
// GLOBAL VARIABLES
// ***************

var categories;
var catsUnfiltered;

// this sets width/height for any gantt chart
var w = 800;
var h = 250;

// this tells d3 to use hh:mm:ss time to match firebase data
var dateFormat = d3.time.format("%X");
var timeScale = d3.time.scale()
        .domain([d3.min(fridayArtists, function(d) {return dateFormat.parse(d.startTime);}),
                 d3.max(fridayArtists, function(d) {return dateFormat.parse(d.endTime);})])
        .range([0,w-150]);

// create four d3 selections, one for each day
var friday = d3.select(".friday")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "friday");

var saturday = d3.select(".saturday")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr("class", "saturday");



// ***************
// GANTT CONSTRUCTORS
// ***************

// this determines the dimensions and colors of the gantt,
// and then makes the grid, rectangles, and vertical labels
function makeGant(chart, tasks, pageWidth, pageHeight){
    categories = new Array();

    // per chart
    for (var i = 0; i < tasks.length; i++){
        categories.push(tasks[i].type);
    }

    // per chart
    categories = checkUnique(categories);

    var barHeight = 20;
    var gap = barHeight + 4;
    var topPadding = 75;
    var sidePadding = 75;

    var colorScale = d3.scale.linear()
        .domain([0, categories.length])
        .range(["#00B9FA", "#F95002"])
        .interpolate(d3.interpolateHcl);

    makeGrid(chart, sidePadding, topPadding, pageWidth, pageHeight);
    drawRects(chart, tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
    vertLabels(chart, gap, topPadding, sidePadding, barHeight, colorScale);

}

// this constructs the rectangles for each artist a user likes
function drawRects(chart, theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h){

    var bigRects = chart.append("g")
       .selectAll("rect")
       .data(theArray)
       .enter()
       .append("rect")
       .attr("x", 0)
       .attr("y", function(d, i){
          return i*theGap + theTopPad - 2;
      })
       .attr("width", function(d){
          return w-theSidePad/2;
       })
       .attr("height", theGap)
       .attr("stroke", "none")
       .attr("fill", function(d){
        for (var i = 0; i < categories.length; i++){
            if (d.type == categories[i]){
              return d3.rgb(theColorScale(i));
            }
        }
       })
       .attr("opacity", 0.2);


    var rectangles = chart.append('g')
     .selectAll("rect")
     .data(theArray)
     .enter();


    var innerRects = rectangles.append("rect")
     .attr("rx", 3)
     .attr("ry", 3)
     .attr("x", function(d){
      return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
      })
     .attr("y", function(d, i){
        return i*theGap + theTopPad;
    })
     .attr("width", function(d){
        return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)));
     })
     .attr("height", theBarHeight)
     .attr("stroke", "none")
     .attr("fill", function(d){
      for (var i = 0; i < categories.length; i++){
          if (d.type == categories[i]){
            return d3.rgb(theColorScale(i));
          }
      }
     })

     var rectText = rectangles.append("text")
       .text(function(d){
        return d.task;
       })
       .attr("x", function(d){
        return (timeScale(dateFormat.parse(d.endTime))-timeScale(dateFormat.parse(d.startTime)))/2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
        })
       .attr("y", function(d, i){
          return i*theGap + 14+ theTopPad;
      })
       .attr("font-size", 11)
       .attr("text-anchor", "middle")
       .attr("text-height", theBarHeight)
       .attr("fill", "#fff");
}


function makeGrid(chart, theSidePad, theTopPad, w, h){

    var xAxis = d3.svg.axis()
        .scale(timeScale)
        .orient('bottom')
        .ticks(d3.time.hours, 1)
        .tickSize(-h+theTopPad+20, 0, 0)
        .tickFormat(d3.time.format('%H:%M'));

    var grid = chart.append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(' +theSidePad + ', ' + (h - 50) + ')')
        .call(xAxis)
        .selectAll("text")
                .style("text-anchor", "middle")
                .attr("fill", "#000")
                .attr("stroke", "none")
                .attr("font-size", 10)
                .attr("dy", "1em");
}


function vertLabels(chart, theGap, theTopPad, theSidePad, theBarHeight, theColorScale){
  var numOccurances = new Array();
  var prevGap = 0;

  for (var i = 0; i < categories.length; i++){
    numOccurances[i] = [categories[i], getCount(categories[i], categories)];
  }

  var axisText = chart.append("g") //without doing this, impossible to put grid lines behind text
   .selectAll("text")
   .data(numOccurances)
   .enter()
   .append("text")
   .text(function(d){
    return d[0];
   })
   .attr("x", 10)
   .attr("y", function(d, i){
    if (i > 0){
        for (var j = 0; j < i; j++){
          prevGap += numOccurances[i-1][1];
          return d[1]*theGap/2 + prevGap*theGap + theTopPad;
        }
    } else{
    return d[1]*theGap/2 + theTopPad;
    }
   })
   .attr("font-size", 11)
   .attr("text-anchor", "start")
   .attr("text-height", 14)
   .attr("fill", function(d){
    for (var i = 0; i < categories.length; i++){
        if (d[0] == categories[i]){
        //  console.log("true!");
          return d3.rgb(theColorScale(i)).darker();
        }
    }
   });

}


// ***************
// HELPERS FOR CATEGORIES
// ***************

function checkUnique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function getCounts(arr) {
    var i = arr.length, // var to loop over
        obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
}

function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
}


// ***************
// CALL GANTT CONSTRUCTORS
// ***************
makeGant(friday, fridayArtists, w, h);
makeGant(saturday, saturdayArtists, w, h);