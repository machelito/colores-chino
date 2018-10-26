var padding = {top:20, right:40, bottom:0, left:0},
	w = 500 - padding.left - padding.right,
	h = 500 - padding.top  - padding.bottom,
	r = Math.min(w, h)/2,
	rotation = 0,
	oldrotation = 0,
	picked = 100000,
	oldpick = [],
	colors = [
			"#f32a0e", 	//rojo
			"purple", 	//violeta
			"#1789cf", 	//azul
			"#50be4d",	//verde 
			"#f9ed01", 	//amarillo
			"#ffd700", 	//dorado	
			"orange", 	//naranja
			"brown", 	//marron
			"black", 	//negro
			"#c0c0c0", 	//plateado
			"white", 	//blanco
			"pink",		//rosa
			];	

var data = [
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
	{"label":"", "value":1, "question":"¿Qué color es?"},
];


var svg = d3.select('#chart')
	.append("svg")
	.data([data])
	.attr("width",  w + padding.left + padding.right)
	.attr("height", h + padding.top + padding.bottom);

var container = svg.append("g")
	.attr("class", "chartholder")
	.attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

var vis = container
	.append("g");
	
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
	.data(pie)
	.enter()
	.append("g")
	.attr("class", "slice");
	

arcs.append("path")
	.attr("fill", function(d, i){ return colors[i]; })
	.attr("d", function (d) { return arc(d); });

container.on("click", spin);


function spin(d){
	
	container.on("click", null);

	var  ps       = 360/data.length,
		 pieslice = Math.round(1440/data.length),
		 rng      = Math.floor((Math.random() * 1440) + 360);
		
	rotation = (Math.round(rng / ps) * ps);
	
	picked = Math.round(data.length - (rotation % 360)/ps);
	picked = picked >= data.length ? (picked % data.length) : picked;


	if(oldpick.indexOf(picked) !== -1){
		d3.select(this).call(spin);
		return;
	} else {
		oldpick.push(picked);
	}

	rotation += 90 - Math.round(ps/2);

	vis.transition()
		.duration(3000)
		.attrTween("transform", rotTween)
		.each("end", function(){

			//populate question
			d3.select("#question h1")
				.text(data[picked].question);

			oldrotation = rotation;
		
			container.on("click", spin);
		});
}

//make arrow
svg.append("g")
	.attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
	.append("path")
	.attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
	.style({"fill":"black"});

//draw spin circle
container.append("circle")
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", 60)
	.style({"fill":"white","cursor":"pointer", "stroke":"gray"});

//spin text
container.append("text")
	.attr("x", 0)
	.attr("y", 15)
	.attr("text-anchor", "middle")
	.text("GIRAR")
	.style({"font-weight":"bold", "font-size":"30px"});


function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function(t) {
	return "rotate(" + i(t) + ")";
  };
}


function getRandomNumbers(){
	var array = new Uint16Array(1000);
	var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

	if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
		window.crypto.getRandomValues(array);
	} else {
		//no support for crypto, get crappy random numbers
		for(var i=0; i < 1000; i++){
			array[i] = Math.floor(Math.random() * 100000) + 1;
		}
	}

	return array;
}