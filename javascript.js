var input = document.getElementById('time');
var output = document.getElementById('date');
output.innerHTML = input.value;

d3.json("mapdata.json", function(data) {
  // var json = data[String(input.value)];
  var json = data[String(4)];
  console.log(json[1]);
  drawRegionsMap(json[1])
})

input.oninput = function() {
  output.innerHTML = this.value;
}