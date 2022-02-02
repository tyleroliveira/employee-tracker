const consoleDotTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);
const viewAllEmployees = () => {
  db.query(`SELECT * FROM employees`, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};
const viewAllRoles = () => {
  db.query(`SELECT * FROM roles`, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};
const viewAllDepartments = () => {
  db.query(`SELECT * FROM Departments`, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
};
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the department?",
      },
    ])
    .then(function (answer) {
      db.query(
        `INSERT INTO departments (department_name) VALUES (?)`,
        [answer.department_name],
        (err, res) => {
          if (err) throw err;
          console.log(
            `${answer.department_name} has been added to the database.`
          );
          menu();
        }
      );
    });
};
const addRole = () => {
db.query("SELECT * FROM departments", function (err, res) {
  if (err) throw err;
  const choices = res.map((department) => ({
    name: department.department_name,
    value: department.id,
  }));
      inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices,
        }
    ]).then(function(answer){
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [answer.title, answer.salary, answer.department_id], (err, res) => {
            if (err) throw err;
            console.log(`${answer.title} has been added to the database.`);
            menu();
        });
    });
});
};

// const addEmployee = () => {
//   db.query("SELECT * FROM roles","SELECT * FROM employees", function (err, res) {
//     console.log(res)
//     if (err) throw err;
//     const choices = res.map((roles) => ({
//       name: roles.title,
//       value: roles.id,
//     }));
//         inquirer.prompt([
//           {
//               type: "input",
//               name: "first_name",
//               message: "What is the employees first name?"
//           },
//           {
//               type: "input",
//               name: "last_name",
//               message: "What is the employees last name?"
//           },
//           {
//               type: "list",
//               name: "role_id",
//               message: "What is the employees role?",
//               choices,
//           },
//           {
//             type: "list",
//             name: "manager_id",
//             message: "What is the employees role?",
//             choices,
//         }
//       ]).then(function(answer){
//           db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
//               if (err) throw err;
//               console.log(`${answer.first_name} has been added to the database.`);
//               menu();
//           });
//       });
//   });
//   };


db.connect((err) => {
  if (err) throw err;
  console.log(`Connected to the employees_db database.`);
  menu();
});
const menu = () => {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "Select an option:",
      choices: [
        "View all employees",
        "Add employee",
        "Update employee role",
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Quit",
      ],
    })
    .then((answer) => {
      switch (answer.menu) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "Add role":
          addRole();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Quit":
          quit();
          break;
      }
    });
};
