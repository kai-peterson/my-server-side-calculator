$(document).ready(readyNow);

function readyNow() {
    displayResult();
    $('#calculate').on('click', calculateResult);
    $('#clear').on('click', clearInputs)
    $('.myInput').on('click', concatValue);
    $('#deleteHistory').on('click', deleteHistory)
    $('#history').on('click', '.operation', reEquation)
}

function concatValue() {
    let currentValue = $('#input').val()
    currentValue += $(this).val();
    $('#input').val(currentValue);
}

function clearInputs() {
    $('#input').val('');
}

function calculateResult() {
    let equation = $('#input').val();
    const regexOperators = /[-+/*]/;
    const regexEndingOperator = /[+/*-]$/;
    const regexStartingOperator = /^[+/*-]/;
    // add a regex to check for anything other than digits/operators
    // aka letters (capital and lowercase) and any other special characters

    // if user forgot an operator, alert
    if (regexOperators.exec(equation) == null) {
        return alert(`You didn't input an operator!`)
    }
    // if input value starts or ends with operator, alert
    else if (regexStartingOperator.exec(equation) != null || regexEndingOperator.exec(equation) != null) {
        return alert(`Your equation cannot start or end with an operator`)
    }
    // after removing the first operator, if there is still another operator, alert
    else if (regexOperators.exec(equation.slice(0, regexOperators.exec(equation).index) + equation.slice(regexOperators.exec(equation).index + 1, equation.length)) != null) {
        return alert(`You can only have one operator, sorry! Greater functionality coming soon!`)
    }

    let mathObject = {
        equation: equation
    }

    $.ajax({
        url: '/calculate',
        type: 'POST',
        data: mathObject
    })

    displayResult();
}

function displayResult() {
    $.ajax({
        url: '/calculate',
        type: 'GET'
    }).then(function (res) {
        if (res.result != 'undefined') {
            $('#result').text('');
            $('#result').text(res.result);
        }
        $('#history').empty();
        appendHistory(res.equations);
    });
}

function appendHistory(operations) {
    operations.forEach(function (operation) {
        $('#history').append(`<li class="operation">${operation}</li>`);
    })
};

function deleteHistory() {
    let check = confirm('Are you sure you want to delete your history?')
    if (check) {
        $('#history').empty();
        $('#result').empty();
        $('#input').val('');
        $.ajax({
            url: '/calculate',
            type: 'DELETE'
        })
    }
}

function reEquation() {
    const regexUntilEquals = /[^=]*/;
    let untilEquals = regexUntilEquals.exec($(this).text())[0];
    $('#input').val(untilEquals);
    calculateResult();
}