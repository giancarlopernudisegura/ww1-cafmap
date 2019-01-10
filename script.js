window.run = false;
window.alarm;
window.event = new Event('input', {
  'bubbles': true,
  'cancelable': true
});
window.element = document.getElementById('slider');

function play() {
  if (run) {
    run = false;
    document.getElementById('play').innerHTML = 'Play &#9658;';
  } else {
    run = true;
    document.getElementById('play').innerHTML = 'Pause &#10074;&#10074;';
  }

  // console.log(run);
  if (run) {
    alarm = setInterval(function() {
      runTime();
    }, 2000);
  } else {
    clearInterval(alarm);
    // console.log("stoped");
  }
}

function runTime() {
  var timer = document.getElementById('slider').value;
  timer++;
  timer %= 85
  
  document.getElementById('slider').value = timer;
  element.dispatchEvent(event);
}

function addListElement(string) {
  var ul = document.getElementById("battles");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(string));
  ul.appendChild(li);
}

function addEmpty() {
  var div = document.getElementById("battle-div");
  var p = document.createElement("p");
  p.appendChild(document.createTextNode('No notables battles for this month'));
  div.appendChild(p);
}

d3.json('battle_data.json', function(err, data) {
  if (err) throw err;

  function getList(num) {
    return data[String(num)];
  }

  function addList(array) {
    document.getElementById("battles").innerHTML = "";
    document.getElementById("battle-div").innerHTML = "<h1>Battles</h1><hr class='title-bar'><ul id='battles'></ul>";
    for (a in array) {
      addListElement(array[a]['sidebar_text']);
    }
    if (array.length == 0) {
      addEmpty();
    }
  }

  var slider = document.getElementById('slider');
  addList(getList(slider.value));
  slider.addEventListener('input', function(e) {
    addList(getList(slider.value));
  });
});

mapboxgl.accessToken = 'pk.eyJ1IjoicGVybnVkaSIsImEiOiJjam9maDV6bDcwNGJmM3BuMGtzeWV2OGI0In0.tW-oIvuC67hGjxp1WDnY0g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-20, 50],
  zoom: 2.3,
  minZoom: 2
});

var dates = [
  "August 1914", "September 1914", "October 1914", "November 1914", "December 1914", "January 1915", "February 1915", "March 1915", "April 1915", "May 1915", "June 1915", "July 1915", "August 1915", "September 1915", "October 1915", "November 1915", "December 1915",
  "January 1916", "February 1916", "March 1916", "April 1916", "May 1916", "June 1916", "July 1916", "August 1916", "September 1916", "October 1916", "November 1916", "December 1916", "January 1917", "February 1917", "March 1917", "April 1917",
  "May 1917", "June 1917", "July 1917", "August 1917", "September 1917", "October 1917", "November 1917", "December 1917", "January 1918", "February 1918", "March 1918", "April 1918", "May 1918", "June 1918", "July 1918", "August 1918",
  "September 1918", "October 1918", "November 1918", "December 1918", "January 1919", "February 1919", "March 1919", "April 1919", "May 1919", "June 1919", "July 1919", "August 1919", "September 1919", "October 1919", "November 1919",
  "December 1919", "January 1920", "February 1920", "March 1920", "April 1920", "May 1920", "June 1920", "July 1920", "August 1920", "September 1920", "October 1920", "November 1920", "December 1920", "January 1921", "February 1921",
  "March 1921", "April 1921", "May 1921", "June 1921", "July 1921", "August 1921"
];

var country_dict = {
  "Belgium": [12],
  "Bermuda": [21],
  "Canada": [28],
  "Cuba": [38],
  "Denmark": [44],
  "Egypt": [48],
  "France": [56],
  "Germany": [42],
  "Greece": [65],
  "India": [75],
  "Iraq": [78],
  "Ireland": [76],
  "Isreal and Palestine": [80],
  "Italy": [81],
  "Lebanese Republic": [93],
  "Malta": [107],
  "Netherlands": [120],
  "Poland": [130],
  "Russia": [137],
  "South Africa": [177],
  "St. Lucia": [180],
  "Switzerland": [29],
  "Tanzania": [166],
  "Turkey": [164],
  "United Kingdom": [58],
  "United States of America": [170],
};

var coords = {};

var country_type = {};

var c2d = {
  "Belgium": [4.469936, 50.503887],
  "Bermuda": [-64.75737, 32.321384],
  "Canada": [-95.346771, 56.130366],
  "Cuba": [-77.781167, 21.521757],
  "Denmark": [9.501785, 56.26392],
  "Egypt": [30.802498, 26.820553],
  "France": [2.213749, 46.227638],
  "Germany": [10.451526, 51.165691],
  "Greece": [21.824312, 39.074208],
  "India": [78.96288, 20.593684],
  "Iraq": [43.679291, 33.223191],
  "Ireland": [-8.24389, 53.41291],
  "Isreal and Palestine": [34.851612, 31.046051],
  "Italy": [12.56738, 41.87194],
  "Lebanese Republic": [35.862285, 33.854721],
  "Malta": [14.375416, 35.937496],
  "Netherlands": [5.291266, 52.132633],
  "Poland": [19.145136, 51.919438],
  "Russia": [105.318756, 61.52401],
  "South Africa": [22.937506, -30.559482],
  "St. Lucia": [-60.978893, 13.909444],
  "Switzerland": [8.227512, 46.818188],
  "Tanzania": [34.888822, -6.369028],
  "Turkey": [35.243322, 38.963745],
  "United Kingdom": [-3.435973, 55.378051],
  "United States of America": [-95.712891, 37.09024]
};

var centoids = {};
d3.json('data.geojson', function(err, data) {
  if (err) throw err;

  data.features = data.features.map(function(d) {
    d.geometry.coordinates = c2d[d.geometry.country];
    // console.log(d);
    return d;
  });

  centoids = data;
});


d3.json('countries.geojson', function(err, countries) {
  if (err) throw err;
  for (country in country_dict) {
    coords[country] = countries.features[country_dict[country]].geometry.coordinates;
    country_type[country] = countries.features[country_dict[country]].geometry.type;
  }
});

function filterBy(d) {
  var filters = ['==', 'time', d];
  map.setFilter('casualty-fill', filters);
  map.setFilter('casualty-labels', filters);

  // Set the label to the month
  document.getElementById('date').textContent = dates[d];
  // console.log(dates[d])
}

map.on('load', function() {
  d3.json('data.geojson', function(err, data) {
    if (err) throw err;

    // Create a month property value based on time
    // used to filter against.
    data.features = data.features.map(function(d) {
      d.geometry.type = country_type[d.geometry.country];
      d.geometry.coordinates = coords[d.geometry.country];
      // console.log(d);
      return d;
    });

    map.addSource('casualties', {
      'type': 'geojson',
      data: data
    });

    map.addSource('centoid', {
      'type': 'geojson',
      data: centoids
    });

    map.addLayer({
      'id': 'casualty-fill',
      'type': 'fill',
      'source': 'casualties',
      'paint': {
        'fill-color': [ //REMAPING VALUES
          'interpolate',
          ['linear'],
          ['get', 'death_count'],
          1, '#fcc2c2',
          1500, '#b70303'
        ],
        'fill-opacity': 0.8
      }
    });

    map.addLayer({
      'id': 'casualty-labels',
      'type': 'symbol',
      'source': 'centoid',
      'layout': {
        'text-field': ['to-string', ['get', 'death_count']],
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
        'text-size': 14
      },
      'paint': {
        'text-color': 'rgba(0,0,0,0.8)'
      }
    });

    // Set filter to first month of the year
    // 0 = January
    filterBy(0);
    document.getElementById('slider').addEventListener('input', function(e) {
      var date = parseInt(e.target.value, 10);
      filterBy(date);
    });
  });
});