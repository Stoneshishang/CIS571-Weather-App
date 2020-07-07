//jshint esversion: 6
const request = require('request');
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const async =require('async');

const app = express();
//create my own Mimic Flight REST API
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/mimicFlightPriceDB",{useUnifiedTopology: true,useNewUrlParser:true});

const mimicFlightPriceDBSchema = ({
  country:String,
  priceAmount: Number,
  currency: String,
  locale: String,
  originPlace: String,
  destinationPlace: String,
  outboundPartialDate: String,
  inboundPartialDate: String,
  apiKey: String
});

const Info=mongoose.model('info', mimicFlightPriceDBSchema);

app.get('/infos',function(req,res){
  Info.find(function(err, retrieveFlightPrices){
    if(!err){
      res.send(retrieveFlightPrices);
    }else{
      res.send(err);
    }
  });
});
//End of API creation


//Try consuming two APIs at once.

// const urls = ["https://api.weatherunlocked.com/api/resortforecast/54887059?app_id=12fae9f3&app_key=7081240d495cb967c69b983548325a71",
//   "http://localhost:3000/infos"];

// function httpGET(url,callback){
//   const options = {  url:url, json:true };
//
//   request(options, function(err, res, body){
//     if(urls[0]){
//       var data = JSON.parse(body);
//       var date = data.forecast[0].date;
//       var snowfall1 = Number(data.forecast[0].precip_mm);
//       var snowfall2 = Number(data.forecast[18].precip_mm);
//       var totalSnowfall = snowfall1 + snowfall2;
//
//       res.send("<h1>The total snow will be " + totalSnowfall + " mm during your trip from 2/20/2020 to 2/27/2020</h1>");
//     }else{
//       var parsedJSON = JSON.parse(body);
//       for(var i=0;i<parsedJSON.length;i++){
//         price = parsedJSON[i].priceAmount;  // pick data out of JSON array of Objects
//       }
//
//       res.send("<h1>The price of your selected flight is " + price +" USD.</h1>");
//     }
//
//
//       if(err){
//         console.log('error:',err);
//       }else{
//         console.log(res.statusCode);
//       }
//
//     callback(err, body);
//   });
// }


// async.map(urls,httpGET, function(err,res){
//   if(err) return console.log(err);
//     console.log(res);
// // });
// });


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// Consume Weather API
app.post("/",function(req, res){

const url = 'https://api.darksky.net/forecast/2dfea25e4335482edf25e6788f505e3a/43.596605, -110.870375,1586730773';

request(url, function(err,response,body){

  var data = JSON.parse(body);
  var name = data.name;
  var country =data.country;
  var continent = data.continent;
  var date = data.forecast[0].date;
  var snowfall1 = Number(currently.precipAccumulation.precip_mm);
  var snowfall2 = Number(data.forecast[18].precip_mm);
  var totalSnowfall = snowfall1 + snowfall2;

  res.send("<h1>The total snow will be " + totalSnowfall + " mm during your trip from 2/20/2020 to 2/27/2020</h1>");

  if(err){
    console.log('error:',err);
  }else{
    console.log(res.statusCode, "Continent:", continent,'   country:',country, '     resort name:', name,  date, snowfall1, snowfall2,totalSnowfall);
  }
});
});

// Consume mimicFlightPrice API
app.post("/", function(req,res){

  // var departureCity = req.body.departureCity;
  // var arrivalCity = req.body.arrivalCity;
  // var departureTime = req.body.departureTime;
  // var arrivalTime = req.body.arrivalTime;

  const url = 'http://localhost:3000/infos';

  request(url,function(err, response,data){

    var parsedJSON = JSON.parse(data);
      for(var i=0;i<parsedJSON.length;i++){
        price = parsedJSON[i].priceAmount;  // pick data out of JSON array of Objects
        }

res.send("<h1>The price of your selected flight is " + price +" USD.</h1>");


    if(err){
      console.log('error:',err);
    }else{
      console.log(res.statusCode, price);
    }

  });

});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
