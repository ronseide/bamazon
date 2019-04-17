var mysql = require('mysql');
var inquirer = require('inquirer');

function start() {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "Dob120963",
        database: "bamazon"
    });
    var boatBought = "";
    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM products",
            function (err, results, fields) {
                if (err) throw err;
                for (var i = 0; i < results.length; i++) {
                    console.log("---------------------------------------------------")
                    console.log("#" + (i + 1) + ": "
                        + results[i].product_name
                        + " (" + results[i].department_name + ")"
                        + " - $" + results[i].price
                        + " (qty:" + results[i].stock_quantity + ")"
                    );
                    boatBought = results[i].product_name;
                }
                inquirer.prompt([
                    {
                        name: "choice",
                        type: "input",
                        message: "Select the ID number of the boat you want to buy"
                    },
                    {
                        name: "quantity",
                        type: "input",
                        message: "How many boats do you want?"
                    }])
                    .then(function (answer) {
                        console.log("You purchased a " + boatBought);
                        console.log("Your total purchase price is $" + results[answer.choice - 1].price * answer.quantity);
                        if (results[answer.choice - 1].quantity < answer.quantity) {
                            console.log("Insufficient Quantity!");
                        }
                        else {
                            connection.query(
                                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
                                [
                                    answer.quantity,
                                    answer.choice
                                ],
                                function (error) {
                                    if (error) throw err;
                                }
                            );
                        }
                        // start();
                        reStart();
                    });
            });
    });
    function reStart() {
        inquirer
        .prompt({
          name: "reStart",
          type: "list",
          message: "Would you like to [Shop Again] or [Exit]?",
          choices: ["Shop Again", "Exit"]
        })
        .then(function(answer) {
          if (answer.reStart === "Shop Again") {
            start();
          }
          else{
            connection.end();
          }
        });
      }
      
}
start();



