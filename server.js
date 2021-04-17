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
            switch (response.choice) {
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
                    break;
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
                    console.log(`Department ${response.deptName} successfully added`);
                    start();
                }
            );
        })
};


const addJob = () => {
    connection.query(
        "SELECT name, id FROM department", (err, res) => {
            if (err) throw err;
            let departmentsArray = [];
            for (let i = 0; i < res.length; i++) {
                let department = res[i]
                let departmentObject = {
                    name: department.name,
                    value: department.id
                }
                departmentsArray.push(departmentObject);
            };

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
                        choices: departmentsArray
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
    );
};

const addEmployee = () => {
    // Get array of jobs
    connection.query(
        "SELECT title, id FROM job", (err, res) => {
            if (err) throw err;

            let jobsArray = [];
            for (let i = 0; i < res.length; i++) {
                let jobTitle = res[i].title;
                let jobId = res[i].id;
                let jobNameObject = {
                    name: jobTitle,
                    value: jobId
                }
                jobsArray.push(jobNameObject);
            };
            // Get array of departments
            connection.query(
                "SELECT name, id FROM department", (err, res) => {
                    if (err) throw err;
                    let departmentsArray = [];
                    for (let i = 0; i < res.length; i++) {
                        let department = res[i]
                        let departmentObject = {
                            name: department.name,
                            value: department.id
                        }
                        departmentsArray.push(departmentObject);
                    };
                    // Get array of employees
                    connection.query(
                        "SELECT first_name, last_name, id FROM employee", (err, res) => {
                            if (err) throw err;

                            let employeesArray = [];
                            for (let i = 0; i < res.length; i++) {
                                let empName = `${res[i].first_name} ${res[i].last_name}`;
                                let empId = res[i].id;
                                let empNameObject = {
                                    name: empName,
                                    value: empId
                                }
                                employeesArray.push(empNameObject);
                            };

                            inquirer
                                .prompt([
                                    {
                                        type: "input",
                                        message: "What is the new employee's first name?",
                                        name: "firstName"
                                    },
                                    {
                                        type: "input",
                                        message: "What is the new employee's last name?",
                                        name: "lastName"
                                    },
                                    {
                                        type: "list",
                                        message: "Which department will the new employee work in?",
                                        name: "department",
                                        choices: departmentsArray
                                    },
                                    {
                                        type: "list",
                                        message: "What is the employee's new job title?",
                                        name: "jobTitle",
                                        choices: jobsArray
                                    },
                                    {
                                        type: "list",
                                        message: "Does this employee have a manager?",
                                        name: "hasManager",
                                        choices: ["Yes", "No"]
                                    },
                                    {
                                        type: "list",
                                        message: "Please select the new employee's manager.",
                                        name: "managerName",
                                        when: (answers) => answers.hasManager === "Yes",
                                        choices: employeesArray
                                    }
                                ]
                                )
                                .then( (response) => {                                    
                                    connection.query(
                                        "INSERT INTO employee SET ?",
                                        [{
                                            first_name: response.firstName,
                                            last_name: response.lastName,
                                            job_id: response.jobTitle,
                                            manager_id: response.managerName
                                        }],
                                        (err, res) => {
                                            if (err) throw err;
                                            console.log("Employee added successfully!");
                                            start();
                                        }
                                    )
                                    
                                })
                        }

                    )
                }
            )
        });
};

const updateEmployeeJob = () => {
    connection.query(
        "SELECT first_name, last_name, id FROM employee", (err, res) => {
            if (err) throw err;

            let employeesArray = [];
            for (let i = 0; i < res.length; i++) {
                let empName = `${res[i].first_name} ${res[i].last_name}`;
                let empId = res[i].id;
                let empNameObject = {
                    name: empName,
                    value: empId
                }
                employeesArray.push(empNameObject);
            };

            connection.query(
                "SELECT title, id FROM job", (err, res) => {
                    if (err) throw err;

                    let jobsArray = [];
                    for (let i = 0; i < res.length; i++) {
                        let jobTitle = res[i].title;
                        let jobId = res[i].id;
                        let jobNameObject = {
                            name: jobTitle,
                            value: jobId
                        }
                        jobsArray.push(jobNameObject);
                    };

                    inquirer
                        .prompt([

                            {
                                type: "list",
                                message: "Which employee would you like to update?",
                                name: "name",
                                choices: employeesArray
                            },
                            {
                                type: "list",
                                message: "What is the employee's new job title?",
                                name: "jobTitle",
                                choices: jobsArray
                            }
                        ]
                        )
                        .then((response) => {
                            connection.query(
                                "UPDATE employee SET ? WHERE id = ?",
                                [{
                                    job_id: response.jobTitle
                                },
                                {
                                    id: response.name
                                }],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("Job update successful!");
                                    start();
                                }
                            )
                        })
                }

            )
        }
    )
};

connection.connect((err) => {
    if (err) throw err;
    start();
});

