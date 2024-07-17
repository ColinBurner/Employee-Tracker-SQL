# Employee-Tracker-SQL

## Description

This is a backend application that uses PostgreSQL to view and manage departments, roles and employees in a company utilizing a database. Using your terminal, with inquirer@8.2.4 pg and dotenv dependencies installed run node server.js. You will then be presented with a list of actions. When an action is chosen, the appropriate response is given from the application whether it's simply showing you the table of your choice, adding a department, role or employee or deleting a department, role or employee. Each time an action is chosen and something is input, the data is saved to the database. For example, if you added an employee, choose view all employees to verify that your new employee is now in the employees table with the data you entered.


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Visuals](#visuals)
- [Roadmap](#roadmap)
- [Tests](#tests)
- [Questions](#questions)

## Installation

**Clone the repository** || cd employee-tracker-SQL || install dependencies: npm install inquirer@8.2.4 pg dotenv || create your own .env for user/password protection

## Usage

Once installed run node server.js in your terminal. You will be given many prompts, follow these prompts for your needs.

Refer to video under [Visuals](#visuals) for a visual walkthrough on how to use the application.

## Visuals

Here is a video walkthrough of how the app works:

https://drive.google.com/file/d/1K0aU3n5buydhUq3qte8PRSB5ylFCYGds/view

![async function for prompting the user for an action](https://github.com/user-attachments/assets/b8288eba-9f2d-40b4-b1c5-4be6a0c2b90f)
Here is the async function for prompting the user for an action.

![role table example](https://github.com/user-attachments/assets/380e095d-dbca-4419-b449-30b8a6c3b08f)
Here is how the "role" table is created.

![insert into role from seeds](https://github.com/user-attachments/assets/388c1ec6-02f8-4044-af4f-948289bc83e0)
Here is how initial information was inserted into the role table using a seeds.sql.

![example of tables](https://github.com/user-attachments/assets/e054bc5a-5c64-4446-af27-2f1693dfbdb1)
Here is how the tables look on default.

## License

This project is licensed under the MIT license. For more information, please visit [this link](https://opensource.org/licenses/MIT).


## Contributing
N/A

Code of conduct || How to report bugs || How to submit changes || Coding standards || Tests

## Roadmap

This application is finished.

## Tests

## Questions

If you have any questions about the repo, open an issue or contact me directly at b2rn3r@yahoo.com. You can find more of my work at [ColinBurner](https://github.com/ColinBurner/).