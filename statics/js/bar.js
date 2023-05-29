// tryin to create a bar chart showing the number of national parks per state.
// The x-axis will show the number of parks, and the y-axis will show the state names

// Load the data
d3.csv('merged_df.csv').then(function(data){
    console.log(data);

    // Create a dictionary to store the count of parks per state
    var stateCount = {};

    // Loop through the data and count the number of parks per state
    //get only one of each park in dropdown
    let parkStates = [];
    let parkNames = [];
    for (let i = 0; i < data.length; i++) {
        let currentPark = data[i];
        let currentParkName = currentPark['fullName'];
        let currentParkState = currentPark['states'];
        const elementExists = parkNames.includes(currentParkName);
        if (!elementExists) {

            parkStates.push(currentParkState);
            parkNames.push(currentParkName);
            
            }
    }
    for (var i = 0; i < parkStates.length; i++) {
        var state = parkStates[i];
        if (stateCount[state]) {
            stateCount[state] += 1;
        } else {
            stateCount[state] = 1;
        }
    }

    console.log(stateCount);

    // Convert the dictionary to an array of objects for Plotly bar chart
    var stateArr = Object.keys(stateCount).map(function(key) {
        return {
            'state': key,
            'count': stateCount[key]
        };
    });

    console.log(stateArr);

    // Sort the array in descending order of count
    stateArr.sort(function(a, b) {
        return b.count - a.count;
    });

    console.log(stateArr);

    // Extract the state names and count values into separate arrays
    var stateNames = stateArr.map(function(obj) {
        return obj.state;
    });

    var parkCounts = stateArr.map(function(obj) {
        return obj.count;
    });

    console.log(stateNames);
    console.log(parkCounts);

    // Create a Plotly bar chart
    var trace = {
        x: parkCounts,
        y: stateNames,
        type: 'bar',
        orientation: 'h'
    };

    var data = [trace];

    var layout = {
        title: 'Number of National Parks per State',
        xaxis: {
            title: 'Number of Parks'
        },
        yaxis: {
            title: 'State'
        }
    };

    Plotly.newPlot('bar', data, layout);

}) 

