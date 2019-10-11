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
        console.log(`\nProduct Id: ${data[i].item_id} | ${data[i].product_name} | Department: ${data[i].department_name} | Price: $${data[i].price} | Quantity: ${data[i].stock_quanity} | Product Sales: ${data[i].product_sales}\n`)
        }
        startInquirer()
    })
}

function viewLow(){
    connection.query("SELECT * FROM products", function(err,data){
        if (err) throw err;
        console.log(`Items with 10 or less inventory:`)
        for (var i = 0; i<data.length; i++){
            if(parseInt(data[i].stock_quanity) <= 10){
                console.log(`\nProduct Id: ${data[i].item_id} | ${data[i].product_name} | Department: ${data[i].department_name} | Price: $${data[i].price} | Quantity: ${data[i].stock_quanity}\n`)
            }
        }
        startInquirer()
    })
}

function addInventory(id, num){
    console.log("Updating product inventory...\n")
    connection.query("UPDATE products SET ? WHERE ?",
    [{
        stock_quanity: num
    },
    {
        item_id: id
    }],
    function(err,data){
        if (err) throw err;
        console.log(data.affectedRows + " product updated!\n")
        viewAll()
        startInquirer()
    }
    )
}

function newProduct(id, name, dep, price, quan){
    console.log("Adding new product...\n")
    connection.query("INSERT INTO products SET ?",
    [{
        item_id: id,
        product_name: name,
        department_name: dep,
        price: price,
        stock_quanity: quan
    }],
    function(err, data){
        if (err) throw err;
        console.log(data.affectedRows + " product added!\n")
        viewAll()
        startInquirer()
    })
}




function startInquirer(){
    inquirer.prompt([
        {
        type: "list",
        message: "Pick an option:",
        choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product", "Exit"],
        name: "menu"
        }
    ]).then(function(choice){
        if(choice.menu == "View Products for Sale"){
            viewAll()
        }
        if(choice.menu == "View Low Inventory"){
            viewLow()
        }
        if(choice.menu == "Add Inventory"){
            connection.query("SELECT * FROM products", function(err,results){
            inquirer.prompt([
                {
                    type: "input",
                    message: "What item would you like to update (by ID)?",
                    name: "id"
                },
                {
                    type:"input",
                    message: "How much inventory do you want to add?",
                    name: "num"
                }
            ]).then(function(answer){
                var productSelected;
                for (var i = 0; i < results.length; i++){
                    if (results[i].item_id == answer.id){
                        productSelected = results[i];
                    }
                   
                }
                addInventory(answer.id, (productSelected.stock_quanity += parseInt(answer.num)))
            })    
        })
        }
        if(choice.menu == "Add New Product"){
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the new product?",
                    name: "name"
                },
                {
                    type: "input",
                    message: "Please set an item Id:",
                    name: "id"
                },
                {
                    type: "input",
                    message: "What department is this product in?",
                    name: "dep"
                },
                {
                    type: "input",
                    message: "Set the price for this product:",
                    name: "price"
                },
                {
                    type: "input",
                    message: "How much inventory are you stocking?",
                    name: "quan"
                }
            ]).then(function(product){
                newProduct(product.id, product.name, product.dep, product.price, product.quan)
            })
            
        }
        if(choice.menu == "Exit"){
            connection.end()
        }
    })
}