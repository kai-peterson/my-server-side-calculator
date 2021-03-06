$(document).ready(readyNow);

function readyNow() {
    displayResult();
    $('#calculate').on('click', calculateResult);
    $('#clear').on('click', clearInputs)
    $('.myInput').on('click', concatValue);
    $('.operator').on('click', concatOperator);
    $('#deleteHistory').on('click', deleteHistory)
    $('#history').on('click', '.operation', redoEquation)
}

function concatValue() {
    let currentValue = $('#input').val()
    currentValue += $(this).val();
    $('#input').val(currentValue);
}

// i need the spaces before/after every operator because of how i calculate on server-side
// when you click the operator buttons it auto-adds spaces, but if a user were to type in the input
// they could easily break it by not putting spaces. prob solved by making the field not an input
// but i don't have time to do this rn so gonna leave it as is
function concatOperator() {
    let currentValue = $('#input').val();
    currentValue += ' ' + $(this).val() + ' ';
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
    const regexNotNumberOperator = /[^0-9-/+*\s.]/;

    // if user forgot an operator, alert
    if (regexOperators.exec(equation) == null) {
        return alert(`You didn't input an operator!`)
    }
    // if input value starts or ends with operator, alert
    else if (regexStartingOperator.exec(equation) != null || regexEndingOperator.exec(equation) != null) {
        return alert(`Your equation cannot start or end with an operator`)
    }
    // if there is anything other than numbers and math operators, alert
    else if (regexNotNumberOperator.exec(equation) != null) {
        return alert('Stick to numbers and math operators! No letters or any other special characters allowed >:(')
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

function redoEquation() {
    const regexUntilEquals = /[^=]*/;
    let untilEquals = regexUntilEquals.exec($(this).text())[0];
    $('#input').val(untilEquals);
    calculateResult();
}