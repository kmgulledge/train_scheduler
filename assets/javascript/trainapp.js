// Initialize Firebase
var config = {
    apiKey: "AIzaSyDAQQa3S14pyinTKPtU4708i1f1mKtzHko",
    authDomain: "train-scheduler-d3437.firebaseapp.com",
    databaseURL: "https://train-scheduler-d3437.firebaseio.com",
    projectId: "train-scheduler-d3437",
    storageBucket: "train-scheduler-d3437.appspot.com",
    messagingSenderId: "913730278776"
};

// Let's Initialize this bad boy
firebase.initializeApp(config);

// Variable To Reference The DB (database that is)
// and HTML On Click Function
var database = firebase.database();
$('#addTrainBtn').on("click", function() {
  
// Take Input From The User
var trainName = $("#trainNameInput").val().trim();
var destination = $("#destinationInput").val().trim();
var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
var frequency = $("#frequencyInput").val().trim();
  
// Temporary Object to Hold The Information
var newTrain = {
    name: trainName,
    place: destination,
    ftrain: firstTrain,
    freq: frequency
  }
  
// Uploads Train Information To The Database
// and Console Log Train Name
  database.ref().push(newTrain);
  console.log(newTrain.name);

// Clears Input Area
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#timeInput").val("");
  $("#frequencyInput").val("");

// Prevents Moving To A New Page
  return false;
});


database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

// storing the snapshot.val() in a variable for convenience
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().place;
  var firstTrain = childSnapshot.val().ftrain;
  var frequency = childSnapshot.val().freq;

// current time
  var postedTime = moment().format("dddd, MMMM Do YYYY, h:mm a");
  $("#postedTime").text(postedTime)

// First Train Pushed 
  var firstTimeConverted = moment(firstTrain, "h:mm");
  console.log(firstTimeConverted);
  var currentTime = moment().format("h:mm");
  console.log("CURRENT TIME: " + currentTime);

  // Store The Difference Between currentTime and First Train 
  var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
  console.log(firstTrain);
  console.log("Difference in Time: " + timeDiff);

 // Find Remainder Of The Time Left and Store
  var timeRemainder = timeDiff % frequency;
  console.log(timeRemainder);

// Calculate Minutes Till The Train Comes And Store It
  var minToTrain = frequency - timeRemainder;
  
  // Next Train..Choo Choo
  // and Stringify
  var nexTrain = moment().add(minToTrain, "minutes").format("h:mm");
  $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nexTrain + "</td><td>" + minToTrain + "</td></tr>");
});