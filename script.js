/* =========================================
   SCIENTIFIC CALCULATOR
========================================= */

const expressionDisplay =
    document.getElementById("expressionDisplay");

const resultDisplay =
    document.getElementById("resultDisplay");

const historyDisplay =
    document.getElementById("historyDisplay");

const modeBtn =
    document.getElementById("modeBtn");

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


let expression = "";

let memory = 0;

let angleMode = "DEG";

let history = [];


/* =========================================
   DISPLAY
========================================= */

function updateDisplay() {

    expressionDisplay.textContent =
        expression || "0";

}


/* =========================================
   BUTTON CLICK
========================================= */

document.querySelectorAll(
    ".calculator-grid button"
).forEach(button => {

    button.addEventListener("click", () => {

        const value =
            button.dataset.value;

        const action =
            button.dataset.action;


        if (value !== undefined) {

            addToExpression(value);

            return;
        }


        if (action) {

            handleAction(action);

        }

    });

});


/* =========================================
   SCIENTIFIC BUTTONS
========================================= */

document.querySelectorAll(
    ".scientific-grid button"
).forEach(button => {

    button.addEventListener("click", () => {

        const action =
            button.dataset.action;

        handleScientificAction(action);

    });

});


/* =========================================
   ADD TO EXPRESSION
========================================= */

function addToExpression(value) {

    if (
        resultDisplay.textContent !== "0" &&
        expression === ""
    ) {
        expression =
            resultDisplay.textContent;
    }


    expression += value;

    updateDisplay();

}


/* =========================================
   BASIC ACTIONS
========================================= */

function handleAction(action) {

    switch (action) {

        case "clear":

            expression = "";

            historyDisplay.textContent = "";

            resultDisplay.textContent = "0";

            updateDisplay();

            break;


        case "delete":

            expression =
                expression.slice(0, -1);

            updateDisplay();

            break;


        case "calculate":

            calculate();

            break;


        case "reciprocal":

            calculateUnary(
                value => 1 / value
            );

            break;

    }

}


/* =========================================
   SCIENTIFIC ACTIONS
========================================= */

function handleScientificAction(action) {

    switch (action) {

        case "sin":

            calculateUnary(
                value => Math.sin(
                    toRadians(value)
                )
            );

            break;


        case "cos":

            calculateUnary(
                value => Math.cos(
                    toRadians(value)
                )
            );

            break;


        case "tan":

            calculateUnary(
                value => Math.tan(
                    toRadians(value)
                )
            );

            break;


        case "asin":

            calculateUnary(
                value => fromRadians(
                    Math.asin(value)
                )
            );

            break;


        case "acos":

            calculateUnary(
                value => fromRadians(
                    Math.acos(value)
                )
            );

            break;


        case "atan":

            calculateUnary(
                value => fromRadians(
                    Math.atan(value)
                )
            );

            break;


        case "log":

            calculateUnary(
                value => Math.log10(value)
            );

            break;


        case "ln":

            calculateUnary(
                value => Math.log(value)
            );

            break;


        case "sqrt":

            calculateUnary(
                value => Math.sqrt(value)
            );

            break;


        case "square":

            calculateUnary(
                value => value ** 2
            );

            break;


        case "cube":

            calculateUnary(
                value => value ** 3
            );

            break;


        case "factorial":

            calculateUnary(
                factorial
            );

            break;

    }

}


/* =========================================
   UNARY CALCULATION
========================================= */

function calculateUnary(operation) {

    try {

        let value;

        if (expression) {

            value =
                evaluateExpression(
                    expression
                );

        } else {

            value =
                Number(
                    resultDisplay.textContent
                );

        }


        const result =
            operation(value);


        if (!Number.isFinite(result)) {

            throw new Error(
                "Invalid result"
            );

        }


        historyDisplay.textContent =
            `${expression || value}`;


        resultDisplay.textContent =
            formatNumber(result);


        addHistory(
            expression || String(value),
            formatNumber(result)
        );


        expression =
            formatNumber(result);


        updateDisplay();

    }

    catch (error) {

        showError();

    }

}


/* =========================================
   MAIN CALCULATION
========================================= */

function calculate() {

    if (!expression) {
        return;
    }

    try {

        const originalExpression =
            expression;

        const result =
            evaluateExpression(
                expression
            );


        if (!Number.isFinite(result)) {

            throw new Error(
                "Invalid calculation"
            );

        }


        historyDisplay.textContent =
            originalExpression;


        resultDisplay.textContent =
            formatNumber(result);


        addHistory(
            originalExpression,
            formatNumber(result)
        );


        expression =
            formatNumber(result);


        updateDisplay();

    }

    catch (error) {

        showError();

    }

}


/* =========================================
   EXPRESSION EVALUATOR
========================================= */

function evaluateExpression(input) {

    let exp =
        input;


    /* Constants */

    exp =
        exp.replaceAll(
            "π",
            "Math.PI"
        );


    exp =
        exp.replace(/\be\b/g, "Math.E");


    /* Percentage */

    exp =
        exp.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );


    /* Power */

    exp =
        exp.replaceAll(
            "^",
            "**"
        );


    /*
       Insert multiplication:

       2π
       2(3+4)
       (2)3
    */

    exp =
        exp.replace(
            /(\d|\))(?=Math\.PI|Math\.E|\()/g,
            "$1*"
        );


    exp =
        exp.replace(
            /(\))(?=\d)/g,
            "$1*"
        );


    /*
       Allow only mathematical
       characters and Math functions.
    */

    const allowed =
        /^[0-9+\-*/().\sMathPIE]+$/;


    if (!allowed.test(exp)) {

        throw new Error(
            "Invalid expression"
        );

    }


    return Function(
        `"use strict"; return (${exp})`
    )();

}


/* =========================================
   FACTORIAL
========================================= */

function factorial(n) {

    if (!Number.isInteger(n) || n < 0) {

        throw new Error(
            "Factorial requires a positive integer"
        );

    }


    if (n > 170) {

        throw new Error(
            "Number too large"
        );

    }


    let result = 1;


    for (
        let i = 2;
        i <= n;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================================
   ANGLE CONVERSION
========================================= */

function toRadians(value) {

    if (angleMode === "RAD") {

        return value;

    }

    return value * Math.PI / 180;

}


function fromRadians(value) {

    if (angleMode === "RAD") {

        return value;

    }

    return value * 180 / Math.PI;

}


/* =========================================
   MODE BUTTON
========================================= */

modeBtn.addEventListener(
    "click",
    () => {

        if (angleMode === "DEG") {

            angleMode = "RAD";

            modeBtn.textContent = "RAD";

        } else {

            angleMode = "DEG";

            modeBtn.textContent = "DEG";

        }

    }
);


/* =========================================
   MEMORY
========================================= */

document.querySelectorAll(
    "[data-memory]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.memory;


            switch (action) {

                case "mc":

                    memory = 0;

                    break;


                case "mr":

                    expression +=
                        formatNumber(memory);

                    updateDisplay();

                    break;


                case "mplus":

                    memory +=
                        getCurrentValue();

                    break;


                case "mminus":

                    memory -=
                        getCurrentValue();

                    break;

            }

        }
    );

});


function getCurrentValue() {

    try {

        if (expression) {

            return evaluateExpression(
                expression
            );

        }

        return Number(
            resultDisplay.textContent
        );

    }

    catch {

        return 0;

    }

}


/* =========================================
   HISTORY
========================================= */

function addHistory(
    calculation,
    result
) {

    history.unshift({
        calculation,
        result
    });


    if (history.length > 20) {

        history.pop();

    }


    renderHistory();

}


function renderHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            `<p class="empty-history">
                No calculations yet
             </p>`;

        return;

    }


    history.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "history-item";


            div.innerHTML = `
                <span class="history-expression">
                    ${escapeHTML(item.calculation)}
                </span>

                <span class="history-result">
                    ${escapeHTML(item.result)}
                </span>
            `;


            div.addEventListener(
                "click",
                () => {

                    expression =
                        item.result;

                    updateDisplay();

                    resultDisplay.textContent =
                        item.result;

                }
            );


            historyList.appendChild(div);

        }
    );

}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        renderHistory();

    }
);


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(number) {

    if (
        Math.abs(number) < 0.000000000001
    ) {

        number = 0;

    }


    if (
        Math.abs(number) >= 1e12 ||
        (
            Math.abs(number) > 0 &&
            Math.abs(number) < 1e-9
        )
    ) {

        return number.toExponential(8);

    }


    return Number(
        number.toPrecision(12)
    ).toString();

}


/* =========================================
   ERROR
========================================= */

function showError() {

    resultDisplay.textContent =
        "Error";

    expression = "";

    updateDisplay();

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        if (
            /^[0-9.]$/.test(key)
        ) {

            addToExpression(key);

            return;

        }


        if (
            ["+", "-", "*", "/", "(", ")", "^", "%"]
                .includes(key)
        ) {

            addToExpression(key);

            return;

        }


        if (key === "Enter" || key === "=") {

            event.preventDefault();

            calculate();

            return;

        }


        if (key === "Backspace") {

            expression =
                expression.slice(0, -1);

            updateDisplay();

            return;

        }


        if (key === "Escape") {

            expression = "";

            resultDisplay.textContent =
                "0";

            historyDisplay.textContent =
                "";

            updateDisplay();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

updateDisplay();

renderHistory();