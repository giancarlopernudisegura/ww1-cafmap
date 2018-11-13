google.charts.load('current', {
  'packages': ['geochart'],
  'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap(map_data) {
  d3.json("mapdata.json", function(data) {
    var choice = "14"
    var length = data[choice][1].length
    var json_data = data[choice][1];

    var map_data = [
      ['country', 'scalar', 'deaths']
    ];

    for (var index in [...Array(length).keys()]) {
      map_data.push([json_data[index]['country'], json_data[index]['scalar'], json_data[index]['death_count']]);
    }

    var data = google.visualization.arrayToDataTable(map_data);

    var options = {
      tooltip: {
        isHtml: true
      },
      region: '150', // Europe
      colorAxis: {
        colors: ['#f8bbd0', '#ff7a7a', '#e31b23']
      },
      backgroundColor: '#81d4fa',
      datalessRegionColor: 'white',
      defaultColor: '#f5f5f5',
      legend: 'scalar'
    };

    var chart = new google.visualization.GeoChart(document.getElementById('geocharts-colors'));
    chart.draw(data, options);
  })
}