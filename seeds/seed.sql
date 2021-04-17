USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Toys"), ("Food"), ("Auto"), ("Hardware");

INSERT INTO job (title, salary, department_id)
VALUES ("Boss", 120000, 1),
    ("Cashier", 40000, 2),
    ("Associate", 45000, 3);

INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES ("Nick", "Aisthorpe", 1, null),
    ("Brittany", "Elliott", 2, 3)
    ("Daniel", "Doyle", 3, 1);