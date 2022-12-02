const buttons = document.querySelector('.buttons');
const expressionDisplay = document.querySelector('.top');
const resultDisplay = document.querySelector('.bottom');

const Calculator = {
    expression: [],
    result: null,
    reset: false,
    error: false,

    get isOperatorPresent() {
        if (this.expression.length > 1) {
            return true;
        }
        return false;
    },
    get isFirstDigitDefined() {
        if (typeof this.expression[0] === 'undefined') {
            return false;
        }
        return true;
    },
    get isSecondDigitDefined() {
        if (typeof this.expression[2] === 'undefined') {
            return false;
        }
        return true;
    },
    get firstDigit() {
        return this.expression[0];
    },
    get secondDigit() {
        return this.expression[2];
    },
    get expressionLength() {
        return this.expression.length;
    },
    get operator() {
        return this.expression[1];
    },

    set setFirstDigit(digit) {
        this.expression[0] = digit;
    },
    set setSecondDigit(digit) {
        this.expression[2] = digit;
    },
    set setOperator(operator) {
        this.expression[1] = operator;
    },
    set setEquals(position) {
        this.expression[position] = '=';
    },
    set setResult(result) {
        this.result = result;
    },
    set setExpression(expression) {
        this.expression = expression;
    },
    set setError(boolean) {
        this.error = boolean;
    },
    set setReset(boolean) {
        this.reset = boolean;
    },

    displayExpression(type, expression) {
        expressionDisplay[type] = expression;
    },
    displayResult(result) {
        resultDisplay.textContent = result;
    },
    isFirstDigit() {
        if (this.expression.length > 1) {
            return false;
        }
        return true;
    },
    removeTrailingZeros() {
        this.setExpression = this.expression.map((x, index) => {
            if (index === 0 || index === 2) {
                return parseFloat(x).toString();
            }
            return x;
        });
    },
    resetOnEqualsOrError() {
        this.setExpression = [];
        this.setResult = null;

        if (this.reset) this.setReset = false;
        if (this.error) this.setError = false;

        this.displayExpression('innerHTML', '&#8203');
    },
    resetOnError() {
        this.setExpression = [];
        this.setResult = null;
        this.setError = false;
        this.displayExpression('innerHTML', '&#8203');
    },

    addNumber(inputNumber) {
        if (this.reset || this.error) this.resetOnEqualsOrError();

        if (!this.isOperatorPresent) {
            if (this.isFirstDigitDefined && this.firstDigit !== '0') {
                this.setFirstDigit = this.firstDigit + inputNumber;
            } else {
                this.setFirstDigit = inputNumber;
            }

            this.setResult = this.firstDigit;
        } else {
            if (this.isSecondDigitDefined && this.secondDigit !== '0') {
                this.setSecondDigit = this.secondDigit + inputNumber;
            } else {
                this.setSecondDigit = inputNumber;
            }
            this.setResult = this.secondDigit;
        }

        this.displayResult(this.result);
    },
    getResult() {
        let result;

        if (!this.secondDigit) this.setSecondDigit = this.firstDigit;
        if (this.operator === '/' && this.secondDigit === '0') return 'Cannot divide by zero';

        switch (this.operator) {
            case '+':
                result = +this.firstDigit + +this.secondDigit;
                break;
            case '-':
                result = +this.firstDigit - +this.secondDigit;
                break;
            case '/':
                result = +this.firstDigit / +this.secondDigit;
                break;
            case '*':
                result = +this.firstDigit * +this.secondDigit;
                break;
            default:
                result = 'Error';
        }

        return parseFloat(result.toFixed(10)).toString();
    },
    performActionBasedOnOperator(operator) {
        if (this.error) this.resetOnError();

        this.setReset = false;
        this.removeTrailingZeros();

        if (!this.isOperatorPresent) {
            if (!this.isFirstDigitDefined) {
                this.setFirstDigit = this.result ? parseFloat(this.result).toString() : '0';
            }

            this.setOperator = operator;
            this.setResult = this.firstDigit;
            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
        } else {
            if (this.expressionLength === 2) {
                this.setOperator = operator;
                this.displayExpression('textContent', this.expression.join(' '));
                return;
            }

            const result = this.getResult();

            if (Number.isNaN(result)) {
                this.setEquals = 3; // this is position, where to insert equals ["1", "+", "3", "="] || ["1", "="] should be 1.
                this.displayExpression('textContent', this.expression.join(' '));
                this.displayResult(result);
                this.setError = true;
                return;
            }

            this.setExpression = [result, operator];
            this.setResult = result;
            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(result);
        }
    },

    equals() {
        if (this.error) this.resetOnError();
        this.removeTrailingZeros();

        if (!this.isOperatorPresent) {
            if (!this.isFirstDigitDefined) {
                this.setExpression = ['0', '='];
                this.setResult = this.firstDigit;
            } else {
                this.setEquals = 1;
                this.setResult = this.firstDigit;
            }

            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
            this.setReset = true;
        } else if (this.expressionLength === 2) {
            if (this.operator === '=') return;

            const result = this.getResult();

            if (Number.isNaN(result)) {
                this.setError = true;
            } else {
                this.setReset = true;
            }

            this.setExpression = [this.firstDigit, this.operator, this.firstDigit, '='];
            this.setResult = result;
            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
        } else if (this.expressionLength === 3) {
            const result = this.getResult();

            if (Number.isNaN(result)) {
                this.setError = true;
            } else {
                this.setReset = true;
            }

            this.setEquals = 3;
            this.setResult = result;
            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
        } else if (this.expressionLength === 4) {
            const oldResult = this.getResult();
            const newResult = this.getResult();
            if (Number.isNaN(oldResult) || Number.isNaN(newResult)) {
                this.setError = true;
            } else {
                this.setReset = true;
            }
            this.setFirstDigit = oldResult;
            this.setResult = newResult;
            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
        }
    },
    addDot() {
        if (this.reset || this.error) this.resetOnEqualsOrError();

        if (!this.isOperatorPresent) {
            if (!this.isFirstDigitDefined) {
                this.setFirstDigit = '0.';
                this.setResult = this.firstDigit;
                this.displayResult(this.result);
            } else {
                const includesDot = this.firstDigit.includes('.');
                if (includesDot) return;

                this.setFirstDigit = `${this.firstDigit}.`;
                this.setResult = this.firstDigit;
                this.displayResult(this.result);
            }
        } else if (!this.isSecondDigitDefined) {
            this.setSecondDigit = '0.';
            this.setResult = this.secondDigit;
            this.displayResult(this.result);
        } else {
            const includesDot = this.secondDigit.includes('.');
            if (includesDot) return;

            this.setSecondDigit = `${this.secondDigit}.`;
            this.setResult = this.secondDigit;
            this.displayResult(this.result);
        }
    },
    delete() {
        if (this.expressionLength === 0 && !this.result) return;

        if (this.expression.includes('=')) {
            this.setExpression = [];
            this.displayExpression('innerHTML', '&#8203');
        } else if (this.expressionLength === 1) {
            if (this.firstDigit.length === 1) {
                this.setFirstDigit = '0';
            } else if (this.firstDigit.length > 0) {
                if (this.firstDigit[0] === '-' && this.firstDigit.length === 2) {
                    this.expression[0] = '0';
                } else {
                    this.setFirstDigit = this.firstDigit.slice(0, -1);
                }
            }

            this.setResult = this.firstDigit;
            this.displayResult(this.result);
        } else if (this.expressionLength === 3) {
            if (this.secondDigit.length === 1) {
                this.setSecondDigit = '0';
            } else if (this.secondDigit.length > 0) {
                if (this.secondDigit[0] === '-' && this.secondDigit.length === 2) {
                    this.setSecondDigit = '0';
                } else {
                    this.setSecondDigit = this.secondDigit.slice(0, -1);
                }
            }

            this.setResult = this.secondDigit;
            this.displayResult(this.result);
        }
    },
    clear() {
        this.setExpression = [];
        this.setResult = null;
        this.resetAfterEquals = false;
        this.setError = false;
        this.displayExpression('innerHTML', '&#8203');
        this.displayResult('0');
    },
    inverse() {
        if (this.expression.includes('=')) {
            if (this.result.includes('-')) {
                this.setResult = this.result.slice(1);
            } else {
                this.setResult = `-${this.result}`;
            }

            this.setExpression = [this.result];

            this.displayExpression('textContent', this.expression.join(' '));
            this.displayResult(this.result);
        } else if (this.expressionLength === 1) {
            if (!this.isFirstDigitDefined || parseFloat(this.firstDigit).toString() === '0') return;

            if (this.firstDigit.includes('-')) {
                this.setFirstDigit = this.firstDigit.slice(1);
            } else {
                this.setFirstDigit = `-${this.firstDigit}`;
            }

            this.displayResult(this.firstDigit);
        } else if (this.expressionLength === 3) {
            if (!this.isSecondDigitDefined || parseFloat(this.secondDigit).toString() === '0')
                return;

            if (this.secondDigit.includes('-')) {
                this.setSecondDigit = this.secondDigit.slice(1);
            } else {
                this.setSecondDigit = `-${this.secondDigit}`;
            }

            this.displayResult(this.secondDigit);
        }
    },
    percent() {
        if (this.expressionLength === 1) {
            if (this.isFirstDigitDefined) {
                this.setFirstDigit = parseFloat((this.firstDigit / 100).toFixed(10));
                this.setResult = this.firstDigit;
                this.displayResult(this.result);
            }
        } else if (this.expressionLength === 3) {
            if (this.isSecondDigitDefined) {
                this.setSecondDigit = parseFloat((this.secondDigit / 100).toFixed(10));
                this.setResult = this.secondDigit;
                this.displayResult(this.result);
            }
        } else if (this.expressionLength === 4) {
            const result = this.getResult();

            if (Number.isNaN(result)) {
                this.setError = true;
                this.setResult = result;
            } else {
                this.setResult = parseFloat((result / 100).toFixed(10));
                this.setExpression = [this.result];
                this.displayExpression('innerHTML', '&#8203');
            }

            this.displayResult(this.result);
        }
    }
};

buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const { number, operator, equals, dot, del, clear, inverse, percent } = btn.dataset;

    if (number) Calculator.addNumber(number);
    else if (operator) Calculator.performActionBasedOnOperator(operator);
    else if (equals) Calculator.equals();
    else if (dot) Calculator.addDot();
    else if (del) Calculator.delete();
    else if (clear) Calculator.clear();
    else if (inverse) Calculator.inverse();
    else if (percent) Calculator.percent();
});

window.addEventListener('keyup', (e) => {
    const isNumber = !Number.isNaN(+e.key);

    if (isNumber) {
        Calculator.addNumber(e.key);
    } else if (e.key === '+' || e.key === '/' || e.key === '*' || e.key === '-')
        Calculator.performActionBasedOnOperator(e.key);
    else if (e.key === '=' || e.key === 'Enter') Calculator.equals();
    else if (e.key === '.') Calculator.addDot();
    else if (e.key === 'Delete' || e.key === 'C' || e.key === 'c') Calculator.clear();
    else if (e.key === 'Backspace') Calculator.delete();
    else if (e.key === 's') Calculator.inverse();
    else if (e.key === '%') Calculator.percent();
});
