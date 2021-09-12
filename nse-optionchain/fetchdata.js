//const express = require("express");
//const app = express();
const { Curl } = require("node-libcurl");
const fs = require("fs");
// Including zlib module
const zlib = require("zlib");
const { time } = require("console");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function processData(statusCode, data, headers) {
  console.log(typeof data);
  optiondata = JSON.parse(data);
  this.close();
  processOptionData();
}

function processOptionData() {
  console.log(optiondata.filtered.data);
  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time =
    today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date + "_" + time;

  var path = "NSE-BNF-OC_" + dateTime + ".txt";
  // fs.write("NSE-BNF-OC-" + timestamp, optiondata.filtered.data);
  fs.writeFileSync(path, JSON.stringify(optiondata.filtered.data));
}

function fetchData() {
  const curl = new Curl();

  var optiondata;
  var today = new Date();

  curl.setOpt(
    "URL",
    "https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY"
  );
  curl.setOpt(Curl.option.VERBOSE, false);
  curl.setOpt("CAINFO", "cacert.pem");
  curl.setOpt(Curl.option.HTTPHEADER, [
    "Referer: https://www.nseindia.com/option-chain",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    // "Accept-Encoding: gzip, deflate, br",
    "Accept-Encoding: deflate, br",
    "Accept-Language: en-US,en;q=0.5",
    "Host: www.nseindia.com",
  ]);

  curl.on("end", processData);

  curl.on("error", function () {
    console.log(Error.statusCode);
    curl.close.bind(curl);
  });
  curl.perform();
  if ((today.getHours() > 15) & (today.getMinutes() > 35)) {
    return;
  } else {
    //Its not time so we continue to fetch every 5 minutes
    sleep(300000).then(() => {
      fetchData();
    });
  }
}
fetchData();
