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




// Functions start here
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
                    connection.end();
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
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: response.deptName
                },
                (err) => {
                    if (err) throw err;
                    start();
                }
            );
            console.log(`Department ${response.deptName} successfully added`);
            start();
        })
};


const addJob = () => {
    let departmentList =  connection.query(
        "SELECT name FROM department", (err, res) => {
            if (err) throw err;
            let departmentsArray = [];
            res.forEach(({name}) => {
                departmentsArray.push(name);
            });
            return departmentsArray;
        }
    );
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the job title being added?",
                name: "title"
            },
            {
                type: "input",
                message: "What is the annual salary of the position?",
                name: "salary"
            },
            {
                type: "list",
                message: "What is the department ID for the position?",
                name: "department",
                choices: departmentList
            }
        ])
        .then((response) => {
            connection.query(
                "INSERT INTO job SET ?",
                {
                    title: response.title,
                    salary: response.salary,
                    department_id: response.department
                }
            )
        })
}


connection.connect((err) => {
    if (err) throw err;
    start();
});

// Variables for choices
/*
const jobList = connection.query(
    "SELECT name FROM job", (err, res) => {
        if (err) throw err;
        const jobsArray = [];
        res.forEach(({name}) => {
            jobsArray.push(name);
        });
        return jobsArray;
    }
);

const departmentList = connection.query(
    "SELECT name FROM department", (err, res) => {
        if (err) throw err;
        const departmentsArray = [];
        res.forEach(({name}) => {
            departmentsArray.push(name);
        });
        return departmentsArray;
    }
);
*/