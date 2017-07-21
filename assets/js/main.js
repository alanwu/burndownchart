var sprintName = '2017-08-02';

var query = '/sprint?where={"name":"' + sprintName + '"}';
var sprint;

$.get(query, function (result) {
  if (result.length == 0) {
    console.error('Cannot find the sprint specified');
  } else if (result.length > 1) {
    console.error('Found more than one sprints based on the name');
  } else {
    sprint = result[0];
    drawBurndown(sprint);
  }
});

function drawBurndown(sprint) {
  var ctx = document.getElementById("myChart").getContext('2d');
  var type = "line";
  var beginDate = moment(sprint.beginDate, 'YYYY-MM-DD');
  var endDate = moment(sprint.endDate, 'YYYY-MM-DD');
  var labels = getLabels(beginDate, endDate);
  var baseLine = getBaseLine(beginDate, endDate, sprint.devCapacity, sprint.devException, sprint.qaCapacity, sprint.qaException, sprint.committedHours, sprint.numOfDev, sprint.numOfQa);

  var data = {
    labels: labels,
    datasets: [{
      label: "Burndown",
      xAxixID: 'Days',
    //yAxisID: 'Hours',
    data: sprint.burnDown,
    borderColor: 'rgba(255,99,132,1)',
    borderWidth: 2,
    lineTension: 0,
    fill: false
    }, {
      label: "Base line",
      xAxixID: "Days",
    //yAxisID: 'Hours',
    data: baseLine,
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 2,
    lineTension: 0,
    fill: false
    }]
  };

  var options = {
    title:{
      display:true,
      text:'Burndown'
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Hours'
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  var myChart = new Chart(ctx, {
    type: type,
    data: data,
    options: options
  });
}

function getLabels(beginDate, endDate) {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["S", "M", "T", "W", "R", "F"];
  var labels = [];
  var pivotDate = moment(beginDate);

  while(pivotDate.valueOf() <= endDate.valueOf()) {
    var date = pivotDate.date();
    var month = monthNames[pivotDate.month()];
    dayNumber = pivotDate.day();

    if (dayNumber == 0 || dayNumber > 5){
      pivotDate.add(1, 'days');
      continue;
    }
    var day = dayNames[dayNumber];
    label = day + " " + month + " " + date;
    labels.push(label);
    pivotDate.add(1, 'days');
  }
  return labels;
}

function getBaseLine(beginDate, endDate, devCapacity, devException, qaCapacity, qaException, committedHours, numOfDev, numOfQa) {
  var numOfSprintDays = 0;
  var pivotDate = moment(beginDate);
  var hoursRemaining = committedHours;

  // calculate the total number of working sprint days
  while (pivotDate.valueOf() <= endDate.valueOf()) {
    if (pivotDate.day() != 0 && pivotDate.day() != 6) {
      numOfSprintDays++;
    }
    pivotDate.add(1, 'days');
  }

  // validate the number of sprint days against the capacity days
  if (numOfSprintDays != devCapacity.length) {
    alert("The number of sprint days " + numOfSprintDays + " doesn't match dev days " + devCapacity.length);
    return null;
  }
  if (numOfSprintDays != devException.length) {
    alert("The number of sprint days " + numOfSprintDays + " doesn't match dev exception days " + devException.length);
    return null;
  }
  if (numOfSprintDays != qaCapacity.length) {
    alert("The number of sprint days " + numOfSprintDays + " doesn't match qa days " + qaCapacity.length);
    return null;
  }
  if (numOfSprintDays != qaException.length) {
    alert("The number of sprint days " + numOfSprintDays + " doesn't match qa exception days " + qaException.length);
    return null;
  }

  // generate the baseline
  var baseLine = [];
  baseLine.push(hoursRemaining);

  while (hoursRemaining > 0) {
  // substract the capacity from the committed hours on each day
  var sprintDay = devCapacity.length - numOfSprintDays;
  var devHours = devCapacity[sprintDay] * numOfDev;
  var devExceptionHours = devException[devCapacity.length - numOfSprintDays];
  if (devHours == 0 && devExceptionHours != 0) {
    alert("There is no dev capacity on sprint day " + sprintDay + " but with dev exceptions");
  }
  var qaHours = qaCapacity[qaCapacity.length - numOfSprintDays] * numOfQa;
  var qaExceptionHours = qaException[devCapacity.length - numOfSprintDays];
  if (qaHours == 0 && qaExceptionHours != 0) {
    alert("There is no qa capacity on sprint day " + sprintDay + " but with qa exceptions");
  }

  hoursRemaining = hoursRemaining - devHours + devExceptionHours - qaHours + qaExceptionHours;
  if (hoursRemaining < 0) {
    hoursRemaining = 0;
  }
  baseLine.push(hoursRemaining);
  numOfSprintDays--;
  }

  return baseLine;
}

function getSprint(sprintName) {
  var sprintSample = {
    name: '',
    beginDate: new Date(2017, 5, 2),
    endDate: new Date(2017, 5, 20),
    committedHours: 254.5,
    devCapacity: [5, 0, 5, 2.5, 5, 5, 5, 5, 0, 0, 0, 0, 0],
    devException: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    qaCapacity: [0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 5, 0, 0],
    qaException: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    burnDown: [254.5, 210, 210, 184.25, 156.5, 129, 108.83, 78.79, 45.58, 36.5],
    numOfDev: 6,
    numOfQa: 2
  };
  
  return sprint;
}
