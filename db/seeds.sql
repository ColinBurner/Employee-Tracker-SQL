INSERT INTO department (name) VALUES 
('Engineering'), 
('Finance'), 
('Legal'), 
('Sales');

INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1), 
('Accountant', 60000, 2), 
('Lawyer', 120000, 3), 
('Sales Representative', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL), 
('Jane', 'Smith', 2, 1), 
('Bill', 'Jones', 3, NULL), 
('Anna', 'Taylor', 4, 3);