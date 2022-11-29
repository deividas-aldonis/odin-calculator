/* eslint-disable prefer-destructuring */
const buttons = document.querySelector('.buttons');
const expressionDisplay = document.querySelector('.top');
const resultDisplay = document.querySelector('.bottom');

function operate(x, operator, y) {
    let result;
    if (operator === '-') result = +x - +y;
    if (operator === '+') result = +x + +y;
    if (operator === '/') result = +x / +y;
    if (operator === '*') result = +x * +y;
    return String(result);
}

const Calculator = {
    expression: ['0'],
    result: '0',
    1(operator) {
        if (operator === '=') {
            this.expression[1] = '=';
        }
        if (operator !== '=') {
            this.expression[1] = operator;
        }

        expressionDisplay.textContent = this.expression.join(' ');
        this.result = null;
    },
    2(operator) {
        if (operator !== '=') {
            this.expression[1] = operator;
            expressionDisplay.textContent = this.expression.join(' ');
            this.result = null;
        }

        if (operator === '=') {
            const [x, o] = this.expression;
            if (o === '=') {
                this.result = x;
            } else {
                const result = operate(x, o, x);
                this.expression[2] = x;
                this.expression[3] = '=';
                this.result = result;
            }
            expressionDisplay.textContent = this.expression.join(' ');
            resultDisplay.textContent = this.result;
        }
    },
    3(operator) {
        if (operator === '=') {
            const [x, o, y] = this.expression;
            const result = operate(x, o, y);
            this.result = result;
            this.expression[3] = '=';
            expressionDisplay.textContent = this.expression.join(' ');
            resultDisplay.textContent = this.result;
        } else {
            // This block runs when 2 + 2 operator
            const [x, o, y] = this.expression;
            const result = operate(x, o, y);
            this.result = result;
            this.expression = [result, operator];
            expressionDisplay.textContent = this.expression.join(' ');
            resultDisplay.textContent = this.result;
            this.result = null;
        }
    },
    4(o) {
        if (o === '=') {
            const firstDigit = this.result;
            const [_, operator, secondDigit, equals] = this.expression;
            const result = operate(firstDigit, operator, secondDigit);
            this.result = result;
            this.expression = [firstDigit, operator, secondDigit, equals];

            expressionDisplay.textContent = this.expression.join(' ');
            resultDisplay.textContent = this.result;
        } else {
            const result = this.result;
            this.expression = [result, o];
            expressionDisplay.textContent = this.expression.join(' ');
            this.result = null;
        }
    }
};

buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const { number, operator, comma } = btn.dataset;
    const { expression, result } = Calculator;

    if (number) {
        console.log(Calculator);
        if (Calculator.expression.includes('=')) {
            Calculator.expression = [];
            Calculator.result = null;
            expressionDisplay.innerHTML = '&#8203;';
        }

        // Calculating first digit
        if (Calculator.expression.length === 0 || Calculator.expression.length === 1) {
            if (!Calculator.result) {
                Calculator.expression[0] = number;
                Calculator.result = number;
            } else if (number !== '0' && result === '0') {
                Calculator.expression[0] = number;
                Calculator.result = number;
            } else if (number === '0' && result === '0') {
                Calculator.expression[0] = number;
                Calculator.result = number;
            } else if (result !== '0') {
                Calculator.expression[0] += number;
                Calculator.result += number;
            }

            resultDisplay.textContent = Calculator.result;
        }
        // Calculating second digit
        else {
            if (!Calculator.result) {
                Calculator.expression[2] = number;
                Calculator.result = number;
            } else if (number === '0' && result === '0') {
                Calculator.expression[2] = number;
                Calculator.result = number;
            } else if (number !== '0' && result === '0') {
                Calculator.expression[2] = number;
                Calculator.result = number;
            } else if (result !== '0') {
                Calculator.expression[2] += number;
                Calculator.result += number;
            }
            resultDisplay.textContent = Calculator.result;
        }
    }

    if (operator) {
        Calculator[expression.length](operator);
    }
    console.log(Calculator);
});
