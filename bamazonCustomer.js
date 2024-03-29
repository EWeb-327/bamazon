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
    viewAll()
    connection.query("SELECT * FROM products", function(err,results){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Welcome! Would you like to purchase any of the products listed?",
            name: "confirm"
        }
    ]).then(function(response){
        if (response.confirm){
            inquirer.prompt([
                {
                    type: "input",
                    message: "Which product would you like to buy (please indicate by ID)?",
                    name: "product"
                },
                {
                    type: "input",
                    message: "How many would you like to purchase?",
                    name: "amount"
                }
            ]).then(function(response){
                var productSelected;
                for (var i = 0; i < results.length; i++){
                    if (results[i].item_id == response.product){
                        productSelected = results[i];
                        
                    }
                   
                }
        
                if (productSelected.stock_quanity >= parseInt(response.amount)){
                    connection.query("UPDATE products SET product_sales=?, stock_quanity=? WHERE item_id=?",
                    [
                    productSelected.price *= parseInt(response.amount),
                    productSelected.stock_quanity -= parseInt(response.amount),
                    productSelected.item_id
                    ],
                    function (error) {
                        if (error) throw error;
                        console.log(`Total cost is $${productSelected.price}\n--------------------------------`)
                        startInquirer()
                    }
                    )
                } else {
                    console.log(`Sorry, insufficient quantity of ${productSelected.product_name}\n--------------------------------`)
                    startInquirer()
                }
            })        
        } else {
            console.log(`No worries! Come again soon!`)
            connection.end()
        }
    })
    })
}