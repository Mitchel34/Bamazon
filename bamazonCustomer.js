var mysql = require("mysql");
var inquirer = require('inquirer');
const cTable = require('console.table');
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mitchel34",
  database: "bamazon_db"
});
var amount = [0];
var price = [0];
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  readItems();
});

function readItems() {
  amount = [0];

  connection.query("SELECT * FROM Items", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (i = 0; i < res.length; i++) {
      amount.push(res[i].stock_quantity)
      price.push(res[i].price)
    }
    console.table(res);
    start()
  });
}

function start() {
  inquirer
    .prompt({
      name: "itemNum",
      type: "input",
      message: "What is the ID of the product you would like to buy?"
    })
    .then(function (answer) {
      connection.query("SELECT * FROM Items WHERE id = ?", answer.itemNum, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res)
        makePurchase(answer.itemNum);
      });
    })
}

function makePurchase(itemNum) {
  inquirer
    .prompt({
      name: "makePurchase",
      type: "input",
      message: "How many of these items would you like to purchase?"
    })
    .then(function (answer) {
      if (amount[itemNum] < answer.makePurchase) {
        console.log("Insufficient Quantity")
        readItems()
      } else {
        connection.query("UPDATE Items SET stock_quantity = stock_quantity - ? WHERE id = ?", [answer.makePurchase, itemNum], function (err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log("You spent "+ answer.makePurchase*price[itemNum]+".")
          connection.end();
        });
      }
    })
}
