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

function viewTotals(){
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS sales, (SUM(products.product_sales) - departments.over_head_costs) AS profit FROM departments, products WHERE departments.department_name=products.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs ORDER BY departments.department_id", function(err,data){
        if (err) throw err;
        for(var i = 0; i<data.length; i++){
            console.log(`\nID: ${data[i].department_id} | Department: ${data[i].department_name} | Overhead Costs: ${data[i].over_head_costs} | Product Sales: ${data[i].sales} | Total Profit: ${data[i].profit}\n`)
        }
        startInquirer()
    })
}

function createDepartment(id, name, costs){
        console.log("Adding new department...\n")
        connection.query("INSERT INTO departments SET ?",
        [{
            department_id: id,
            department_name: name,
            over_head_costs: costs
        }],
        function(err, data){
            if (err) throw err;
            console.log(data.affectedRows + " department added!\n")
            viewDepartments()
            startInquirer()
        })
}

function viewDepartments(){
    connection.query("SELECT * FROM departments", function(err,data){
        if (err) throw err;
        for(var i = 0; i<data.length; i++){
            console.log(`\nID: ${data[i].department_id} | Department Name: ${data[i].department_name} | Over Head Costs: ${data[i].over_head_costs}\n`)
        }
    })
}

function startInquirer(){
    inquirer.prompt([
       {
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        name: "start"
       } 
    ]).then(function(choice){
        if (choice.start === "View Product Sales by Department"){
            viewTotals()
        }
        if (choice.start === "Create New Department"){
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new Department ID?",
                    name: "id"
                },
                {
                    type: "input",
                    message: "What is the new Department Name?",
                    name: "name"
                },
                {
                    type: "input",
                    message: "What is the Over Head Cost for the Department?",
                    name: "costs"
                }
            ]).then(function(dep){
                createDepartment(dep.id, dep.name, dep.costs)
            })
        }
        if (choice.start === "Exit"){
            connection.end();
        }
    })
}