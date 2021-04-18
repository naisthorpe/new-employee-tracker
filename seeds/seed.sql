USE employee_trackerdb;

INSERT INTO department (name)
VALUES ("Toys"), ("Food"), ("Auto"), ("Hardware");

INSERT INTO job (title, salary, department_id)
VALUES ("Boss", 120000, 1),
    ("Cashier", 40000, 2),
    ("Associate", 45000, 3);

-- have to insert manager first --
INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES ("Nick", "Aisthorpe", 1, null);
    
-- then insert employees that report to manager -- 
INSERT INTO employee(first_name, last_name, job_id, manager_id)
VALUES ("Brittany", "Elliott", 2, 1),
    ("Daniel", "Doyle", 2, 1);