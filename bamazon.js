var mysql = require('mysql');
var inquirer = require('inquirer');

// console.log("This is mysql stuff ");
// console.log(mysql);
// console.log("This is inquirer stuff ")
// console.log(inquirer);
function start() {

    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "Dob120963",
        database: "bamazon"
    });

    connection.connect(function (err) {
        if (err) throw err;
        connection.query("SELECT * FROM products", 
                        function (err, results, fields) {
            if (err) throw err;
            // console.log(result);
            // console.log("Product ID   Product Name\n" + result[0].id + "           " + result[0].product_name);
            for (var i = 0; i < results.length; i++) {
                console.log(results[i]);

                console.log("#" + (i+1) + ": " 
                    + results[i].product_name 
                    + " (" + results[i].department_name + ")" 
                    + " - $" + results[i].price 
                    + " (qty:" + results[i].stock_quantity + ")"
                );
            }
                console.log(results[i]);
            inquirer.prompt([
            {
                name: "choice",
                type: "input",
                message: "What do you want to buy?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many of them?"
            }])
            .then(function(answer) {
                console.log(results[answer.choice-1]);
                console.log(results[answer.choice-1].price*answer.quantity);
                if( results[answer.choice-1].quantity < answer.quantity ) {
                    console.log("Sorry there's not enough");

                }
                else {
                    console.log("Doing mysql to reduce number of items");
                    connection.query(
                        "UPDATE products SET stock_quantity WHERE ?",
                        [
                            {
                                stock_quantity: stock_quantity - answer.quantity
                            },
                            {
                                id: results[answer.choice-1].id
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("Bought!");
                        }
                    );
                }

                start();
        
            });

        });
    });
}


start();


