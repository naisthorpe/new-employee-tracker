const mysql = require('mysql');
const inquirer = require('inquirer');
require("dotenv").config();

// create the connection info for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "employee_trackerdb",
    password: process.env.DB_PASSWORD
});


const start = () => {
    inquirer
        .prompt(
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: ["VIEW Employees", "VIEW Jobs", "VIEW Departments", "ADD Employee", "ADD Job", "ADD Department",   
                    "UPDATE Employee Job", "EXIT Application"]
            }
        )
        .then((response) => {
            switch(response.choice) {
                case ("ADD Department"):
                    addDepartment();
                    break;
                case ("ADD Job"):
                    addJob();
                    break;
                case ("ADD Employee"):
                    addEmployee();
                    break;
                case ("VIEW Departments"):
                    viewDepartments();
                    break;
                case ("VIEW Jobs"):
                    viewJobs();
                    break;
                case ("VIEW Employees"):
                    viewEmployees();
                    break;
                case ("UPDATE Employee Job"):
                    updateEmployeeJob();
                    break;
                default:
                    console.log("Add connection end here.");
            }
        })
};

const addDepartment = () => {
    inquirer
        .prompt(
            {
                type: "input",
                message: "What is the department name to be added?",
                name: "deptName"
            }
        )
        .then((response) => {
            console.log(response.deptName);
            console.log("\n======\n");
            start();
        })
};

connection.connect((err) => {
    if (err) throw err;
    start();
})