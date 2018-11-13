var input = document.getElementById('time');
var output = document.getElementById('date');
d3.json("mapdata.json", function(data) {
  output.innerHTML = data[input.value][0];
})

input.oninput = function() {
  d3.json("mapdata.json", function(data) {
    output.innerHTML = data[input.value][0];
  })
}