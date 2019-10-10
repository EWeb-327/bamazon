var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Ejest_327",
    database: "bamazon_db"
});

connection.connect(function(err){
    if (err) throw err;
   startInquirer()
})

function viewAll(){
    connection.query("SELECT * FROM products", function(err,data){
        if (err) throw err;
        for(var i=0; i < data.length; i++){
        console.log(`Product Id: ${data[i].item_id} | ${data[i].product_name} | Price: $${data[i].price}`)
        }
    })
}

function startInquirer(){
    inquirer.prompt([
        {
        type: "list",
        message: "Pick an option:",
        choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product"],
        name: "menu"
        }
    ]).then(function(choice){
        
    })
}