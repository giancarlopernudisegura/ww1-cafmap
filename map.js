google.charts.load('current', {
  'packages': ['geochart'],
  // Note: you will need to get a mapsApiKey for your project.
  // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
  'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});
google.charts.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap(json_data) {
  console.log('llllllllllllll');
  console.log(json_data)
  console.log(json_data[0])
  var d_array = [
    ['Country', 'scalar', 'Deaths']
  ];
  // var datum;
  d_array.push([json_data[0]["country"], json_data[0]["scalar"], json_data[0]["death_count"]]);
  // for (let datum in json_data[0]) {
  //   // console.log(json_data)
  //   console.log('hhhhhhhhhhhhhhhhhh');
  //   console.log(datum)
  //   // console.log(datum.country);

  // }

  console.log('xxxxxxxxxxxx');
  console.log(d_array);
  var data = google.visualization.arrayToDataTable(d_array);

  var options = {
    tooltip: {
      isHtml: true
    },
    region: '150', // Africa
    colorAxis: {
      colors: ['#f8bbd0', '#ff7a7a', '#e31b23']
    },
    backgroundColor: '#81d4fa',
    datalessRegionColor: 'white',
    defaultColor: '#f5f5f5',
    legend: 'scalar'
  };

  var chart = new google.visualization.GeoChart(document.getElementById('geochart-colors'));
  chart.draw(data, options);
};