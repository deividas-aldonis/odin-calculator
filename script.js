const buttonGrid = document.querySelector('.button-grid');
const screen = document.querySelector('.screen');

const Calculator = {
    firstDigit: null,
    secondDigit: null,
    operator: null,
    tempOperator: null,
    tempDigit: null,
    reset: false,
    _error: false,
    _result: null,

    get error() {
        return this._error;
    },
    set error(error) {
        if (error) {
            this.firstDigit = null;
            this.secondDigit = null;
            this.operator = null;
            this.tempDigit = null;
            this.tempOperator = null;
            this.reset = false;
            this._error = false;

            screen.textContent = 'Error';
        }
    },

    get result() {
        return this._result;
    },
    set result(result) {
        if (!Number.isNaN(result)) {
            this._result = String(parseFloat(Number(result).toFixed(10)));
            screen.textContent = this._result;
        } else {
            this._result = result;
        }
    },

    removeActiveBtn() {
        document.querySelectorAll('.operator').forEach((btn) => btn.classList.remove('active'));
    },
    addActiveBtn(operator) {
        document.querySelector(`[data-operator="${operator}"]`).classList.add('active');
    },
    addNumber(inputNum) {
        this.removeActiveBtn();

        if (this.reset) {
            this.result = null;
            this.reset = false;
        }

        if (!this.operator) {
            if (!this.firstDigit) this.firstDigit = '0';

            if (this.firstDigit === '0') {
                this.firstDigit = inputNum;
            } else if (
                this.firstDigit.length === 2 &&
                this.firstDigit[0] === '-' &&
                this.firstDigit[1] === '0'
            ) {
                this.firstDigit = `-${inputNum}`;
            } else {
                this.firstDigit += inputNum;
            }
            screen.textContent = this.firstDigit;
        }

        if (this.operator) {
            if (!this.secondDigit) this.secondDigit = '0';

            if (this.secondDigit === '0') {
                this.secondDigit = inputNum;
            } else if (
                this.secondDigit.length === 2 &&
                this.secondDigit[0] === '-' &&
                this.secondDigit[1] === '0'
            ) {
                this.secondDigit = `-${inputNum}`;
            } else {
                this.secondDigit += inputNum;
            }
            screen.textContent = this.secondDigit;
        }
    },
    addOperator(operator) {
        if (!this.firstDigit && this.result) {
            this.firstDigit = this.result;
        }

        if (this.reset) this.reset = false;

        if (this.tempDigit && this.tempOperator) {
            this.tempDigit = null;
            this.tempOperator = null;
        }

        if (!this.secondDigit) this.operator = operator;

        if (this.secondDigit) {
            this.operate();
            this.operator = operator;
            this.firstDigit = this.result;
            this.secondDigit = null;
        }

        this.removeActiveBtn();
        this.addActiveBtn(operator);
    },
    operate() {
        if (this.operator === '+') {
            this.result = Number(this.firstDigit) + Number(this.secondDigit);
        } else if (this.operator === '-') {
            this.result = Number(this.firstDigit) - Number(this.secondDigit);
        } else if (this.operator === '/') {
            const secondDigit = String(parseFloat(this.secondDigit));
            if (secondDigit === '0') {
                this.error = true;
                return;
            }
            this.result = Number(this.firstDigit) / Number(this.secondDigit);
        } else if (this.operator === '*') {
            this.result = Number(this.firstDigit) * Number(this.secondDigit);
        }
    },
    equal() {
        this.removeActiveBtn();

        if (!this.firstDigit && this.result) {
            this.firstDigit = this.result;
            this.result = null;
        }

        if (!this.firstDigit && !this.operator) return;

        if (!this.firstDigit && this.operator && !this.secondDigit) {
            this.firstDigit = '0';
            this.secondDigit = '0';

            this.operate();
            if (this.error) return;

            this.tempOperator = this.operator;
            this.tempDigit = this.secondDigit;
            this.operator = null;
            this.firstDigit = null;
            this.secondDigit = null;
            this.reset = true;
        } else if (!this.firstDigit && this.operator && this.secondDigit) {
            this.firstDigit = '0';

            this.operate();
            if (this.error) return;

            this.tempOperator = this.operator;
            this.tempDigit = this.secondDigit;
            this.operator = null;
            this.firstDigit = null;
            this.secondDigit = null;
            this.reset = true;
        } else if (this.firstDigit && !this.operator && !this.tempDigit) {
            this.result = this.firstDigit;
            this.firstDigit = null;
        } else if (this.firstDigit && this.operator && !this.secondDigit) {
            this.secondDigit = this.firstDigit;

            this.operate();
            if (this.error) return;

            this.tempDigit = this.secondDigit;
            this.tempOperator = this.operator;
            this.operator = null;
            this.firstDigit = null;
            this.secondDigit = null;
            this.reset = true;
        } else if (this.firstDigit && this.secondDigit) {
            this.operate();
            if (this.error) return;

            this.tempDigit = this.secondDigit;
            this.tempOperator = this.operator;
            this.operator = null;
            this.firstDigit = null;
            this.secondDigit = null;
            this.reset = true;
        } else if (this.firstDigit && this.tempDigit && this.tempOperator) {
            this.secondDigit = this.tempDigit;
            this.operator = this.tempOperator;

            this.operate();
            if (this.error) return;

            this.operator = null;
            this.firstDigit = null;
            this.secondDigit = null;
            this.reset = true;
        }
    },
    addDot() {
        this.removeActiveBtn();

        if (!this.operator && !this.firstDigit) {
            this.firstDigit = '0.';
            screen.textContent = this.firstDigit;
        } else if (!this.operator && this.firstDigit && !this.firstDigit.includes('.')) {
            this.firstDigit += '.';
            screen.textContent = this.firstDigit;
        } else if (this.operator && !this.secondDigit) {
            this.secondDigit = '0.';
            screen.textContent = this.secondDigit;
        } else if (this.operator && this.secondDigit && !this.secondDigit.includes('.')) {
            this.secondDigit += '.';
            screen.textContent = this.secondDigit;
        }
    },
    clear() {
        this.removeActiveBtn();

        this.firstDigit = null;
        this.secondDigit = null;
        this.operator = null;
        this.tempDigit = null;
        this.tempOperator = null;
        this.reset = false;
        this.result = null;
        this.error = false;

        screen.textContent = '0';
    },
    addMinus() {
        this.removeActiveBtn();

        if (!this.operator && !this.firstDigit) {
            this.firstDigit = '-0';
            screen.textContent = this.firstDigit;
        } else if (!this.operator && this.firstDigit.includes('-')) {
            this.firstDigit = this.firstDigit.slice(1);
            screen.textContent = this.firstDigit;
        } else if (!this.operator && !this.firstDigit.includes('-')) {
            this.firstDigit = `-${this.firstDigit}`;
            screen.textContent = this.firstDigit;
        } else if (this.operator && !this.secondDigit) {
            this.secondDigit = '-0';
            screen.textContent = this.secondDigit;
        } else if (this.operator && this.secondDigit.includes('-')) {
            this.secondDigit = this.secondDigit.slice(1);
            screen.textContent = this.secondDigit;
        } else if (this.secondDigit && !this.secondDigit.includes('-')) {
            this.secondDigit = `-${this.secondDigit}`;
            screen.textContent = this.secondDigit;
        }
    },
    percent() {
        this.removeActiveBtn();

        if (!this.firstDigit && this.result) {
            this.firstDigit = this.result;
        }

        if (!this.operator && !this.firstDigit) {
            this.firstDigit = '0.01';
            this.result = this.firstDigit;
        } else if (!this.operator && this.firstDigit) {
            this.firstDigit = String(Number(this.firstDigit) / 100);
            this.result = this.firstDigit;
        } else if (this.operator && !this.secondDigit) {
            this.secondDigit = '0.01';
            this.result = this.secondDigit;
        } else if (this.operator && this.secondDigit) {
            this.secondDigit = String(Number(this.secondDigit) / 100);
            this.result = this.secondDigit;
        }
    }
};

buttonGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('number')) Calculator.addNumber(btn.dataset.number);
    else if (btn.classList.contains('operator')) Calculator.addOperator(btn.dataset.operator);
    else if (btn.classList.contains('equal')) Calculator.equal();
    else if (btn.classList.contains('dot')) Calculator.addDot();
    else if (btn.classList.contains('clear')) Calculator.clear();
    else if (btn.classList.contains('add-minus')) Calculator.addMinus();
    else if (btn.classList.contains('percent')) Calculator.percent();
});

window.addEventListener('keypress', (e) => {
    // For some reason when event is set to keydown, firefox doesn't preventDefault so I changed it to keypress.
    const isNumber = !Number.isNaN(+e.key);

    if (isNumber) Calculator.addNumber(e.key);
    else if (e.key === '+' || e.key === '/' || e.key === '*' || e.key === '-') {
        if (e.key === '/') e.preventDefault();
        Calculator.addOperator(e.key);
    } else if (e.key === '=' || e.key === 'Enter') Calculator.equal();
    else if (e.key === '.') Calculator.addDot();
    else if (e.key === 'Delete' || e.key === 'C' || e.key === 'c') Calculator.clear();
    else if (e.key === 's') Calculator.addMinus();
    else if (e.key === '%') Calculator.percent();
});
