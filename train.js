$(document).ready(function () {
    console.log("ready!");

    var firebaseConfig = {
        apiKey: "AIzaSyCL_OGlx7TJ3VZAWu9CPKxtJN4SbO8-FVE",
        authDomain: "trainactivity-f5ce1.firebaseapp.com",
        databaseURL: "https://trainactivity-f5ce1.firebaseio.com",
        projectId: "trainactivity-f5ce1",
        storageBucket: "",
        messagingSenderId: "790957486735",
        appId: "1:790957486735:web:d80b471655e9d187"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //  Button for adding Trains
    $("#submit").on("click", function (event) {
        event.preventDefault();

        // A variable to reference the database.
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#submit").on("click", function() {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrain = $("#first-input").val().trim();
        frequency = $("#minutes-input").val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
        // Chang year so first train comes before now
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
        var minAway = childSnapshot.val().frequency - remainder;
        // Next train time
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $(".table").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        // Change the HTML to reflect
        $("#name-display").html(snapshot.val().name);
        $("#destination-display").html(snapshot.val().destination);
        $("#first-display").html(snapshot.val().firstTrain);
        $("#minutes-display").html(snapshot.val().frequency);
    console.log(snapshot);
    
    });

});

});