const express = require("express");
const bodyParser = require("body-parser");

// the native way of making HTTP request using NODE.js
// We don't need to install any external packages for this, it comes in-built with node
// HTTPS is the secured version of HTTP
const https = require("https"); // require the https module


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    const query = req.body.cityName; // accessing the entered city name from the html form
    const apiKey = "1c523c16ff1963faa8c82d45b3210c5a";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

    https.get(url, function (response) { // getting response from the weather api server by providing the url. This response contains many details about the execution of the whole process
        // console.log(response); // printing the complete response sent by the server
        console.log(response.statusCode); // printing the value of the statusCode parameter

        response.on("data", function (data) { // using the 'on' method to search for some 'data' when we receive it. This 'data' will correspond to the actual message body sent to us by the weather api
            // console.log(data); // prints the 'data' in hexadecimal
            const weatherData = JSON.parse(data); // parsing the 'data' into readable Js object
            console.log(weatherData);
            const temp = weatherData.main.temp; // accessing the nested object's, temp key's value
            console.log(temp);
            const weatherDescription = weatherData.weather[0].description;
            console.log(weatherDescription);
            const icon = weatherData.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            // // JSON.stringify converts the data into string but it still remains in hexadecimal
            // const stringifyData = JSON.stringify(data);
            // console.log(stringifyData);

            res.write("<p>The weather is currently " + weatherDescription + "</p>"); // we can have multiple .write() methods
            res.write("<img src=" + imgURL + ">");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");

            res.send(); // .send() is equivalent to .write() + .end() so it can only occur once
            // res.send("<h1>The temperature in Lucknow is " + temp + " degrees Celcius.</h1>"); // if we try to send two res.send in a single app method it will generate an error since there can only be one .send() method
        });
    });
    // res.send("Server is up and running."); // can't have two .send() methods

});















app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});