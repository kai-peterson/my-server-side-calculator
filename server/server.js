const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('server/public'));

let mathEquation;
let result;
let equations = [];
let operator = '';

app.post('/operator', (req, res) => {
    operator = req.body.operator;
    res.sendStatus(200);
})

app.post('/calculate', (req, res) => {
    mathEquation = req.body.equation;
    const regexOperators = /[-+/*]/;
    console.log(mathEquation);
    operator = regexOperators.exec(mathEquation)[0];
    console.log(operator);
    
    
    // this is where we need to parse through the string to pull out values and operator
    // prob need regex
    if (operator == '+') {
        result = Number(mathEquation.split('+')[0]) + Number(mathEquation.split('+')[1]);
    }
    else if (operator == '-') {
        result = Number(mathEquation.split('-')[0]) - Number(mathEquation.split('-')[1]);
    }
    else if (operator == '*') {
        result = Number(mathEquation.split('*')[0]) * Number(mathEquation.split('*')[1]);
    }
    else if (operator == '/') {
        result = Number(mathEquation.split('/')[0]) / Number(mathEquation.split('/')[1]);
    }

    equations.push(mathEquation + `=${result}`)
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

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});