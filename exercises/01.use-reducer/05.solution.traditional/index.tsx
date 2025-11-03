import { useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

type State = { count: number }
// 🐨 make it so the action is one of two objects:
// - a type string with the value 'increment' and a step number with the value of the step
// - a type string with the value 'decrement' and a step number with the value of the step
type Action =
	| { type: 'increment'; step: number }
	| { type: 'decrement'; step: number }

// 🐨 update the countReducer to handle the new action type
// 💯 handle situations where the action's type is neither increment nor decrement
const countReducer = (state: State, action: Action) => ({
	...state,

	// jesli typ ktory przekazujemy to inkrementacja to pobieramy sobie poprzednia wartosc i dodajemy do niej step z akcji ktora przekazalismy w dispatchu, a jesli jest to dekrementacja to po prostu odejmujemy, countReducer uaktualnia nam typ state i wszystko smiga jak ta lala 
	 count:
    action.type === 'increment'
      ? state.count + action.step
      : action.type === 'decrement'
      ? state.count - action.step
      : state.count, // domyślnie zwracamy bez zmian


	  //ALTERNATYWA!!
	  /*
	   const { type, step } = action
	switch (type) {
		case 'increment': {
			return {
				...state,
				count: state.count + step,
			}
		}
		case 'decrement': {
			return {
				...state,
				count: state.count - step,
			}
		}
	}
	  */

})

function Counter({ initialCount = 0, step = 1 }) {
	// 🐨 rename "setState" to "dispatch"
	const [state, dispatch] = useReducer(countReducer, {
		count: initialCount,
	})
	const { count } = state

	// 🐨 the logic has now been moved back to the reducer, update these to pass
	// the appropriate action object to the dispatch function
	const increment = () =>
		dispatch({type:"increment", step })
	const decrement = () =>
		dispatch({type:"decrement", step })
		//dispatch((currentState) => ({ count: currentState.count - step }))
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
