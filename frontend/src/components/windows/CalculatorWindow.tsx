import { useState, useEffect } from 'react'

const CalculatorWindow = () => {
  const [currentOperand, setCurrentOperand] = useState('')
  const [previousOperand, setPreviousOperand] = useState('')
  const [operation, setOperation] = useState<string | null>(null)
  const [displayNeedsReset, setDisplayNeedsReset] = useState(false)
  const [display, setDisplay] = useState('0')

  // 컨텍스트 메뉴 방지
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Initialize display
  useEffect(() => {
    setDisplay('0')
  }, [])

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault() // Prevent default browser actions for handled keys

      const key = event.key

      if (key >= '0' && key <= '9') {
        appendDigit(key)
      } else if (key === '+') {
        chooseOperation('+')
      } else if (key === '-') {
        chooseOperation('-')
      } else if (key === '*') {
        chooseOperation('*')
      } else if (key === '/') {
        chooseOperation('/')
      } else if (key === 'Enter' || key === '=') {
        computeCalculation()
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearCalculator()
      } else if (key === 'Backspace') {
        removeLastDigit()
      }
    }

    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentOperand, previousOperand, operation, displayNeedsReset]) // Dependencies for the handlers

  const updateDisplay = (value: string) => {
    setDisplay(value)
  }

  const clearCalculator = () => {
    setCurrentOperand('')
    setPreviousOperand('')
    setOperation(null)
    setDisplayNeedsReset(false)
    updateDisplay('0')
  }

  const appendDigit = (digit: string) => {
    if (displayNeedsReset) {
      setCurrentOperand('')
      setDisplayNeedsReset(false)
    }
    
    let newOperand = currentOperand
    if (currentOperand === '0' && digit === '0') return
    if (currentOperand === '0' && digit !== '0') {
      newOperand = digit
    } else {
      if (currentOperand.length >= 15) return
      newOperand = currentOperand + digit
    }
    
    setCurrentOperand(newOperand)
    updateDisplay(newOperand)
  }

  const chooseOperation = (selectedOperation: string) => {
    if (currentOperand === '' && previousOperand !== '') {
      setOperation(selectedOperation)
      return
    }
    if (currentOperand === '') return

    if (previousOperand !== '') {
      computeCalculation()
    }
    
    setOperation(selectedOperation)
    setPreviousOperand(currentOperand)
    setCurrentOperand('')
    setDisplayNeedsReset(true)
    updateDisplay(currentOperand)
  }

  const computeCalculation = () => {
    let result: number
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)

    if (isNaN(prev) || isNaN(current)) return

    switch (operation) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '*':
        result = prev * current
        break
      case '/':
        if (current === 0) {
          alert('Error: Division by zero')
          clearCalculator()
          return
        }
        result = prev / current
        break
      default:
        return
    }
    
    const resultString = result.toString()
    setCurrentOperand(resultString)
    updateDisplay(resultString)
    setOperation(null)
    setPreviousOperand('')
    setDisplayNeedsReset(true)
  }

  const removeLastDigit = () => {
    if (displayNeedsReset) { // If a calculation was just done, don't modify the result with backspace
      return
    }
    if (currentOperand.length > 0) {
      const newOperand = currentOperand.slice(0, -1)
      setCurrentOperand(newOperand)
      updateDisplay(newOperand === '' ? '0' : newOperand)
    }
  }

  const handleButtonClick = (value: string, type: string) => {
    switch (type) {
      case 'number':
        appendDigit(value)
        break
      case 'operator':
        chooseOperation(value)
        break
      case 'equals':
        computeCalculation()
        break
      case 'clear':
        clearCalculator()
        break
    }
  }

  return (
    <div className="calculator-body" onContextMenu={handleContextMenu}>
      <input 
        type="text" 
        className="calculator-display" 
        readOnly 
        value={display}
      />
      <div className="calculator-buttons">
        {/* Row 1 */}
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('7', 'number')}
        >
          7
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('8', 'number')}
        >
          8
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('9', 'number')}
        >
          9
        </button>
        <button 
          className="calc-btn calc-btn-operator" 
          onClick={() => handleButtonClick('/', 'operator')}
        >
          /
        </button>
        
        {/* Row 2 */}
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('4', 'number')}
        >
          4
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('5', 'number')}
        >
          5
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('6', 'number')}
        >
          6
        </button>
        <button 
          className="calc-btn calc-btn-operator" 
          onClick={() => handleButtonClick('*', 'operator')}
        >
          *
        </button>
        
        {/* Row 3 */}
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('1', 'number')}
        >
          1
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('2', 'number')}
        >
          2
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('3', 'number')}
        >
          3
        </button>
        <button 
          className="calc-btn calc-btn-operator" 
          onClick={() => handleButtonClick('-', 'operator')}
        >
          -
        </button>
        
        {/* Row 4 */}
        <button 
          className="calc-btn calc-btn-clear" 
          onClick={() => handleButtonClick('C', 'clear')}
        >
          C
        </button>
        <button 
          className="calc-btn calc-btn-number" 
          onClick={() => handleButtonClick('0', 'number')}
        >
          0
        </button>
        <button 
          className="calc-btn calc-btn-equals" 
          onClick={() => handleButtonClick('=', 'equals')}
        >
          =
        </button>
        <button 
          className="calc-btn calc-btn-operator" 
          onClick={() => handleButtonClick('+', 'operator')}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default CalculatorWindow 