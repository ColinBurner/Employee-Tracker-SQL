const inquirer = require('inquirer');
const db = require('./db');
require('dotenv').config(); // load environment variables from .env for protecting user/password

async function startApp() {
  while (true) {
    // prompts the user for an action
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add a Department',
          'Add a Role',
          'Add an Employee',
          'Update an Employee Role',
          'Update Employee Manager',
          'View Employees by Manager',
          'View Employees by Department',
          'Delete a Department',
          'Delete a Role',
          'Delete an Employee',
          'View Total Utilized Budget by Department',
          'Exit'
        ]
      }
    ]);

    // performs the action
    switch (action) {
      case 'View All Departments':
        await viewAllDepartments();
        break;
      case 'View All Roles':
        await viewAllRoles();
        break;
      case 'View All Employees':
        await viewAllEmployees();
        break;
      case 'Add a Department':
        await addDepartment();
        break;
      case 'Add a Role':
        await addRole();
        break;
      case 'Add an Employee':
        await addEmployee();
        break;
      case 'Update an Employee Role':
        await updateEmployeeRole();
        break;
      case 'Update Employee Manager':
        await updateEmployeeManager();
        break;
      case 'View Employees by Manager':
        await viewEmployeesByManager();
        break;
      case 'View Employees by Department':
        await viewEmployeesByDepartment();
        break;
      case 'Delete a Department':
        await deleteDepartment();
        break;
      case 'Delete a Role':
        await deleteRole();
        break;
      case 'Delete an Employee':
        await deleteEmployee();
        break;
      case 'View Total Utilized Budget by Department':
        await viewTotalBudgetByDepartment();
        break;
      case 'Exit':
        db.end(); //closes the db connection
        console.log('Goodbye!');
        process.exit(0); // exits the app
    }
  }
}

// function to view all departments
async function viewAllDepartments() {
  try {
    const res = await db.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

// function to view all roles
async function viewAllRoles() {
  try {
    const query = `
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      JOIN department ON role.department_id = department.id
    `;
    const res = await db.query(query);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

// function to view all employees
async function viewAllEmployees() {
  try {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON manager.id = employee.manager_id
    `;
    const res = await db.query(query);
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

// function to add department
async function addDepartment() {
  try {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ]);

    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log('Department added successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to add new role
async function addRole() {
  try {
    const res = await db.query('SELECT * FROM department');
    const departments = res.rows.map(({ id, name }) => ({ name, value: id }));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:'
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the role:',
        choices: departments
      }
    ]);

    await db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
      [answers.title, answers.salary, answers.department_id]);
    console.log('Role added successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to add new employee
async function addEmployee() {
  try {
    const rolesRes = await db.query('SELECT * FROM role');
    const roles = rolesRes.rows.map(({ id, title }) => ({ name: title, value: id }));

    const managersRes = await db.query('SELECT * FROM employee');
    const managers = managersRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managers.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:'
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role of the employee:',
        choices: roles
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager of the employee:',
        choices: managers
      }
    ]);

    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
      [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log('Employee added successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to update employee role
async function updateEmployeeRole() {
  try {
    const employeesRes = await db.query('SELECT * FROM employee');
    const employees = employeesRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const rolesRes = await db.query('SELECT * FROM role');
    const roles = rolesRes.rows.map(({ id, title }) => ({ name: title, value: id }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role of the employee:',
        choices: roles
      }
    ]);

    await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', 
      [answers.role_id, answers.employee_id]);
    console.log('Employee role updated successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to update an employee's manager
async function updateEmployeeManager() {
  try {
    const employeesRes = await db.query('SELECT * FROM employee');
    const employees = employeesRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const managersRes = await db.query('SELECT * FROM employee');
    const managers = managersRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managers.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the new manager of the employee:',
        choices: managers
      }
    ]);

    await db.query('UPDATE employee SET manager_id = $1 WHERE id = $2', 
      [answers.manager_id, answers.employee_id]);
    console.log('Employee manager updated successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to view employees by their manager
async function viewEmployeesByManager() {
  try {
    const managersRes = await db.query(`
      SELECT DISTINCT manager.id, manager.first_name, manager.last_name 
      FROM employee 
      JOIN employee manager ON employee.manager_id = manager.id
    `);
    const managers = managersRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const { manager_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select a manager to view their employees:',
        choices: managers
      }
    ]);

    const res = await db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      WHERE employee.manager_id = $1
    `, [manager_id]);

    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

// function to view employees by their department
async function viewEmployeesByDepartment() {
  try {
    const departmentsRes = await db.query('SELECT * FROM department');
    const departments = departmentsRes.rows.map(({ id, name }) => ({ name, value: id }));

    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select a department to view its employees:',
        choices: departments
      }
    ]);

    const res = await db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
      WHERE department.id = $1
    `, [department_id]);

    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

// function to delete a department
async function deleteDepartment() {
  try {
    const departmentsRes = await db.query('SELECT * FROM department');
    const departments = departmentsRes.rows.map(({ id, name }) => ({ name, value: id }));

    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department to delete:',
        choices: departments
      }
    ]);

    await db.query('DELETE FROM department WHERE id = $1', [department_id]);
    console.log('Department deleted successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to delete a role
async function deleteRole() {
  try {
    const rolesRes = await db.query('SELECT * FROM role');
    const roles = rolesRes.rows.map(({ id, title }) => ({ name: title, value: id }));

    const { role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role to delete:',
        choices: roles
      }
    ]);

    await db.query('DELETE FROM role WHERE id = $1', [role_id]);
    console.log('Role deleted successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to delete an employee (ex: if they were fired or quit)
async function deleteEmployee() {
  try {
    const employeesRes = await db.query('SELECT * FROM employee');
    const employees = employeesRes.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

    const { employee_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to delete:',
        choices: employees
      }
    ]);

    await db.query('DELETE FROM employee WHERE id = $1', [employee_id]);
    console.log('Employee deleted successfully!');
  } catch (err) {
    console.error(err);
  }
}

// function to view the total budget of a department
async function viewTotalBudgetByDepartment() {
  try {
    const departmentsRes = await db.query('SELECT * FROM department');
    const departments = departmentsRes.rows.map(({ id, name }) => ({ name, value: id }));

    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select a department to view its total utilized budget:',
        choices: departments
      }
    ]);

    const res = await db.query(`
      SELECT department.name AS department, SUM(role.salary) AS utilized_budget
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      WHERE department.id = $1
      GROUP BY department.name
    `, [department_id]);

    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
}

startApp(); // starts the app