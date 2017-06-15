var beginDate = new Date(2017, 5, 2);
var endDate = new Date(2017, 5, 20);
var committedHours = 254.5;
var devCapacity = [5, 0, 5, 2.5, 5, 5, 5, 5, 0, 0, 0, 0, 0];
var devException = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
var qaCapacity = [0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 5, 0, 0];
var qaException = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
var numOfDev = 6;
var numOfQa = 2;

var ctx = document.getElementById("myChart").getContext('2d');
var type = "line";
var labels = getLabels(beginDate, endDate);
var baseLine = getBaseLine(beginDate, endDate, devCapacity, devException, qaCapacity, qaException, committedHours, numOfDev, numOfQa);
var burnDown = getBurndown();

var data = {
  labels: labels,
  datasets: [{
    label: "Burndown",
    xAxixID: 'Days',
//yAxisID: 'Hours',
data: burnDown,
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

function getLabels(beginDate, endDate) {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["S", "M", "T", "W", "R", "F"];
  var labels = [];
  var pivotDate = new Date(beginDate.getTime());

  while(pivotDate <= endDate) {
    var date = pivotDate.getDate();
    var month = monthNames[pivotDate.getMonth()];
    dayNumber = pivotDate.getDay();
    if (dayNumber == 0 || dayNumber > 5){
      pivotDate.setDate(pivotDate.getDate() + 1);
      continue;
    }
    var day = dayNames[dayNumber];
    label = day + " " + month + " " + date;
    labels.push(label);
    pivotDate.setDate(pivotDate.getDate() + 1);
  }
  return labels;
}

function getBaseLine(beginDate, endDate, devCapacity, devException, qaCapacity, qaException, committedHours, numOfDev, numOfQa) {
  var numOfSprintDays = 0;
  var pivotDate = beginDate;
  var hoursRemaining = committedHours;

// calculate the total number of working sprint days
while (pivotDate <= endDate) {
  if (pivotDate.getDay() != 0 && pivotDate.getDay() != 6) {
    numOfSprintDays++;
  }
  pivotDate.setDate(pivotDate.getDate() + 1);
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

function getBurndown() {
  return [254.5, 210, 210, 184.25, 156.5, 129, 108.83, 78.79, 45.58, 36.5];
}