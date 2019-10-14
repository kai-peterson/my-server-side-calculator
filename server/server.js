const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

let result;
let equations = [];

app.post('/calculate', (req, res) => {
    mathEquation = req.body.equation;
    console.log(mathEquation);

    calculateEquation(mathEquation);
    equations.push(mathEquation + ` = ${result}`)
    res.sendStatus(200);
})

app.get('/calculate', (req, res) => {
    res.send({
        result: String(result),
        equations: equations
    });
})

app.delete('/calculate', (req, res) => {
    equations = [];
    result = 0;
    res.sendStatus(200);
})

// the following two equations are able to calculate with multiple operators
// while following order of operations
// i wrote them on client side first so i could test/debug easier, then copied them over here
function calculateEquation(equation) {
    myEquation = equation.split(' ');

    while (myEquation.findIndex(x => (x == '*' || x == '/')) != -1) {
        let indexMinusOne = myEquation.findIndex(x => (x == '*' || x == '/')) - 1;
        let tempOperation = myEquation.splice(indexMinusOne, 3);
        myEquation.splice(indexMinusOne, 0, calculateSimpleEquation(tempOperation));
    }
    while (myEquation.findIndex(x => (x == '+' || x == '-')) != -1) {
        let indexMinusOne = myEquation.findIndex(x => (x == '+' || x == '-')) - 1;
        let tempOperation = myEquation.splice(indexMinusOne, 3);
        myEquation.splice(indexMinusOne, 0, calculateSimpleEquation(tempOperation));
    }
    result = myEquation[0];
}

function calculateSimpleEquation(equation) {
    let operator = equation[1];

    if (operator == '+') {
        return Number(equation[0]) + Number(equation[2]);
    }
    else if (operator == '-') {
        return Number(equation[0]) - Number(equation[2]);
    }
    else if (operator == '*') {
        return Number(equation[0]) * Number(equation[2]);
    }
    else if (operator == '/') {
        return Number(equation[0]) / Number(equation[2]);
    }
}

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});