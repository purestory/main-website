// Assumes this script is loaded after DOM is ready (e.g. via defer)

// --- Calculator DOM Selectors ---
const calcDisplay = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calc-btn'); // Query all calculator buttons
const calculatorWindow = document.getElementById('calculator-app-window'); // Calculator window element

// --- Calculator State Variables ---
let calcCurrentOperand = '';
let calcPreviousOperand = '';
let calcOperation = null;
let calcDisplayNeedsReset = false;

// --- Calculator Helper Functions ---
function updateCalcDisplay(value) {
    if (calcDisplay) { // Check if display element exists
        calcDisplay.value = value;
    }
}

function clearCalculator() {
    calcCurrentOperand = '';
    calcPreviousOperand = '';
    calcOperation = null;
    calcDisplayNeedsReset = false;
    updateCalcDisplay('0');
}

function appendDigit(digit) {
    if (calcDisplayNeedsReset) {
        calcCurrentOperand = '';
        calcDisplayNeedsReset = false;
    }
    if (calcCurrentOperand === '0' && digit === '0') return;
    if (calcCurrentOperand === '0' && digit !== '0') {
        calcCurrentOperand = digit;
    } else {
        if (calcCurrentOperand.length >= 15) return;
        calcCurrentOperand += digit;
    }
    updateCalcDisplay(calcCurrentOperand);
}

function chooseOperation(operation) {
    if (calcCurrentOperand === '' && calcPreviousOperand !== '') {
        calcOperation = operation;
        return;
    }
    if (calcCurrentOperand === '') return;

    if (calcPreviousOperand !== '') {
        computeCalculation();
    }
    calcOperation = operation;
    calcPreviousOperand = calcCurrentOperand;
    calcCurrentOperand = '';
    calcDisplayNeedsReset = true;
    updateCalcDisplay(calcPreviousOperand);
}

function computeCalculation() {
    let result;
    const prev = parseFloat(calcPreviousOperand);
    const current = parseFloat(calcCurrentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (calcOperation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Error: Division by zero');
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    // Basic result formatting (e.g. to fixed decimal places if it's a float)
    // For now, direct toString is fine for integer-based V1.
    // result = parseFloat(result.toFixed(10)); // Example for future float handling
    calcCurrentOperand = result.toString();
    updateCalcDisplay(calcCurrentOperand);
    calcOperation = null;
    calcPreviousOperand = '';
    calcDisplayNeedsReset = true;
}

function removeLastDigit() {
    if (calcDisplayNeedsReset) { // If a calculation was just done, don't modify the result with backspace
        return;
    }
    if (calcCurrentOperand.length > 0) {
        calcCurrentOperand = calcCurrentOperand.slice(0, -1);
    }
    // If operand becomes empty, display '0', otherwise display the new operand
    updateCalcDisplay(calcCurrentOperand === '' ? '0' : calcCurrentOperand);
}

// --- Calculator Button Event Listeners ---
if (calcButtons.length > 0) { // Check if buttons were found
    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;
            const isNumber = button.classList.contains('calc-btn-number');
            const isOperator = button.classList.contains('calc-btn-operator');
            const isEquals = button.classList.contains('calc-btn-equals');
            const isClear = button.classList.contains('calc-btn-clear');

            if (isNumber) {
                appendDigit(value);
            } else if (isOperator) {
                chooseOperation(value);
            } else if (isEquals) {
                computeCalculation();
            } else if (isClear) {
                clearCalculator();
            }
        });
    });

    // Initialize calculator display and state when script loads
    clearCalculator();
} else {
    // This might happen if calculator window is not yet in DOM when this script runs
    // or if script is not deferred. However, with defer and structure, it should be fine.
    // Alternatively, initialization could be tied to when the calculator window is opened.
    // For now, clearCalculator() is called assuming elements are available due to defer.
    // If calcDisplay is null, clearCalculator will also do nothing harmful.
    console.warn("Calculator buttons not found, calculator not initialized by default.");
}

// --- Calculator Keyboard Input Listener ---
document.addEventListener('keydown', function(event) {
    // Check if the calculator window is visible and active
    if (calculatorWindow && calculatorWindow.style.display === 'block' && calculatorWindow.classList.contains('active')) {
        event.preventDefault(); // Prevent default browser actions for handled keys

        const key = event.key;

        if (key >= '0' && key <= '9') {
            appendDigit(key);
        } else if (key === '.') {
            // Add decimal point functionality if desired, for now, it's not explicitly in appendDigit
            // appendDigit(key); // Or a new function handleDecimal()
        } else if (key === '+') {
            chooseOperation('+');
        } else if (key === '-') {
            chooseOperation('-');
        } else if (key === '*') {
            chooseOperation('*');
        } else if (key === '/') {
            chooseOperation('/');
        } else if (key === 'Enter' || key === '=') {
            computeCalculation();
        } else if (key === 'Escape') {
            clearCalculator();
        } else if (key === 'Backspace') {
            removeLastDigit(); // This function will be implemented in the next step
        }
        // console.log('Key pressed for calculator:', key); // For testing
    }
});
