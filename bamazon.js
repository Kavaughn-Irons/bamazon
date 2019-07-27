var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

function logProducts(data){
    for(var i = 0; i < data.length; i++){
        console.log("Product ID: " + data[i].item_id + " Product Name: " + data[i].product_name + " Price: " + data[i].price);
    }
}

function findId(data,input,inputTwo){
    
    var foundId = false;
    
    for(var i = 0; i < data.length;i++){
        if(Number(input) === data[i].item_id){
            foundId = true;
            var idnum = i;
            if(data[i].stock_quantity >= inputTwo){                

       
                console.log("connected as id " + connection.threadId);
                var subtract = data[idnum].stock_quantity - inputTwo;
               
                connection.query("UPDATE bamazon SET stock_quantity = "+subtract+" WHERE item_id = " + data[idnum].item_id, function (err, result, fields) {
                    if (err) throw err;
                });
                
                connection.end();
                
                console.log("You bought this product: " + data[i].product_name);
                console.log("You bought this many: " + inputTwo);
                console.log("The cost of your purchase: $" + (data[i].price * inputTwo).toFixed(2));
            }else{
                console.log("NOT ENOUGH IN STOCK!")
                connection.end();
            }
        }
    }
    
    if(!foundId){
       console.log("ID NOT FOUND!");
       connection.end();
    }
    

}

function promptUser(data){
    
inquirer.prompt([
{   message: "What is the ID of the product you're looking for?",
    type: "input",
    name: "ID"
},
{   message: "How much of the product do you want?",
    type: "input",
    name: "Amount"
}
]).then(function(answers){
    findId(data,answers.ID,answers.Amount);
});

}


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
   
  connection.query("SELECT * FROM bamazon", function (err, result, fields) {
    if (err) throw err;
     logProducts(result);
     promptUser(result);  
});
  
    
    
    
});
