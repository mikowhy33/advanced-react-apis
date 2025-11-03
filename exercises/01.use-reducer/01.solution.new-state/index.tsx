import { useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

// 🐨 here's where you'll implement your countReducer function.

function Counter({ initialCount = 0, step = 1 }) {
	//const countReducer=(state:unknown,newState:number)=>newState;

	// 🐨 replace useState with useReducer.
	// 💰 useReducer(countReducer, initialCount)

	//setCount(x) → przekazuje x do countReducer(state, x),
	const [count, setCount] = useReducer(countReducer, initialCount)

	//countReducer zwraca nową wartość → React ustawia count = nowa_wartość,
	// state to aktualna wartosc licznika, przekazywana przez react do countReducer
	// newState to nowa wartosc ktora chce ustawic przekazuje w setCount
	function countReducer(state: number, newState: number) {
		return newState
	}
	// 💰 you can write the countReducer function above so you don't have to make
	// any changes to the next two lines of code! Remember:
	// The 1st argument is called "state" - the current value of count
	// The 2nd argument is called "newState" - the value passed to setCount

	// to sie dzieje gdy wywyolujemy setCount(count + step)
	//const newState = countReducer(currentState, count + step)
	const increment = () => setCount(count + step)
	const decrement = () => setCount(count - step)
	return (
		<div className="counter">
			<output>{count}</output>
			<div>
				<button onClick={decrement}>⬅️</button>
				<button onClick={increment}>➡️</button>
			</div>
		</div>
	)
}

function App() {
	const [step, setStep] = useState(1)

	return (
		<div className="app">
			<h1>Counter:</h1>
			<form>
				<div>
					<label htmlFor="step-input">Step</label>
					<input
						id="step-input"
						type="number"
						value={step}
						onChange={(e) => setStep(Number(e.currentTarget.value))}
					/>
				</div>
			</form>
			<Counter step={step} />
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
