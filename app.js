const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


let employeeList;

function enterEmployeeInformation(jobTitle) {
    inquirer
        .prompt([
            {
                type: "input",
                message: `What is your ${jobTitle}'s name?`,
                name: "name"
            },
            {
                type: "input",
                message: `What is your ${jobTitle}'s id?`,
                name: "id"
            },
            {
                type: "input",
                message: `What is your ${jobTitle}'s email?`,
                name: "email"
            },
            {
                type: "input",
                message: "What is your Managers's office number?",
                name: "officeNumber",
                when: jobTitle === "Manager"
            },
            {
                type: "input",
                message: "What is your Engineer's Github Username?",
                name: "github",
                when: jobTitle === "Engineer"
            },
            {
                type: "input",
                message: "What is your Intern's school?",
                name: "school",
                when: jobTitle === "Intern"
            },
            {
                type: "confirm",
                message: "Do you have anymore employees to enter?",
                name: "moreQuestions"
            },
            {
                type: "list",
                message: `What is the next employee's role?`,
                choices: ["Manager", "Engineer", "Intern"],
                name: "role",
                when: answers => answers.moreQuestions
            },
        ]).then(answers => {
            if (jobTitle === "Manager") {
                employeeList.push(new Manager(answers.name, answers.id, answers.email, answers.officeNumber));
            }
            else if (jobTitle === "Engineer") {
                employeeList.push(new Engineer(answers.name, answers.id, answers.email, answers.github));
            }
            else if (jobTitle === "Intern") {
                employeeList.push(new Intern(answers.name, answers.id, answers.email, answers.school));
            }

            if (answers.moreQuestions) {
                enterEmployeeInformation(answers.role);
            }
            else {
                fs.writeFile(outputPath, render(employeeList), (err) =>
                    err ? console.error(err) : console.log('Success!')
                );
            }
        }).catch(err => {
            console.log(err);
        });
}

function init () {
    employeeList = [];
    enterEmployeeInformation("Manager");
}
init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
