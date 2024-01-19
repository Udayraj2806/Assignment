const express = require("express");
const app = express();
app.use(express.json());

// Middleware to handle URL-encoded form data
app.use(express.urlencoded({ extended: true }));

const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
let data;
fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
   return response.json()
  })
  .then((responseData) => {
    data = responseData;

    app.get("/getAllTransactions", (req, res) => {
      res.json(responseData);
    });

    app.post("/getStatistics", (req, res) => {
      const month = req.body.month;
      const monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      filterdData = [];
      data.forEach((transaction) => {
        const dateString = transaction.dateOfSale;
        const dateObject = new Date(dateString);
        const currentTransactionMonth = dateObject.getMonth();
        if (monthList[currentTransactionMonth] == month)
          filterdData.push(transaction);
      });
      res.send(filterdData);
    });

    app.post("/getBarChatData", (req, res) => {
      const month = req.body.month;
      let barChartObject = {
        "0-100": 1,
        "101-200": 1,
        "201-300": 1,
        "301-400": 1,
        "401-500": 1,
        "501-600": 1,
        "601-700": 1,
        "701-800": 1,
        "801-900": 1,
        "900Above": 1,
      };
      const monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      data.forEach((transaction) => {
        const dateString = transaction.dateOfSale;
        const dateObject = new Date(dateString);
        const currentTransactionMonth = dateObject.getMonth();
        if (monthList[currentTransactionMonth] == month) {
          if (transaction.price >= 0 && transaction.price <= 100) {
            barChartObject["0-100"] = barChartObject["0-100"] + 1;
          } else if (transaction.price >= 0 && transaction.price <= 100) {
            barChartObject["101-200"] = barChartObject["101-200"] + 1;
          } else if (transaction.price >= 101 && transaction.price <= 200) {
            barChartObject["201-300"] = barChartObject["201-300"] + 1;
          } else if (transaction.price >= 201 && transaction.price <= 300) {
            barChartObject["301-400"] = barChartObject["301-400"] + 1;
          } else if (transaction.price >= 301 && transaction.price <= 400) {
            barChartObject["401-500"] = barChartObject["401-500"] + 1;
          } else if (transaction.price >= 401 && transaction.price <= 500) {
            barChartObject["501-600"] = barChartObject["501-600"] + 1;
          } else if (transaction.price >= 501 && transaction.price <= 600) {
            barChartObject["601-700"] = barChartObject["601-700"] + 1;
          } else if (transaction.price >= 602 && transaction.price <= 700) {
            barChartObject["701-800"] = barChartObject["701-800"] + 1;
          } else if (transaction.price >= 701 && transaction.price <= 800) {
            barChartObject["801-900"] = barChartObject["801-900"] + 1;
          } else {
            barChartObject["900Above"] = barChartObject["900Above"] + 1;
          }
        }
      });
      res.send(barChartObject);
    });
  })
  .catch((error) => {
    // Handle errors during the fetch
    console.error("Error during fetch:", error);
  });



app.listen(5000, () => console.log("Listening on port 5000"));
