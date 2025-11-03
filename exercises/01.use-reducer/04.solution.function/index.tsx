import { useReducer, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

type State = { count: number }
// 🦺 make it so the action can be a function which accepts State and returns Partial<State>
type Action = Partial<State> | ((currentState: State) => Partial<State>)

const countReducer = (state: State, action: Action) => ({
	...state,

	// jesli action jest funkcja destrukturyzujemy funkcje, jesli jest obiektem to destrukturyzacja nastapi na obiekcie
	// funckja tutaj brana z action, ktory jest przekazywany w countReducer!
	...(typeof action === 'function' ? action(state) : action),

	// 🐨 if the action is a function, then call it with the state and spread the results,
	// otherwise, just spread the results (as it is now).
})

function Counter({ initialCount = 0, step = 1 }) {
	const [state, setState] = useReducer(countReducer, {
		count: initialCount,
	})
	const { count } = state
	// 🐨 update these calls to use the callback form. Use the currentState given
	// to you by the callback form of setState when calculating the new state.

	// ➕ Funkcyjna forma dispatcha: za każdym razem React wywoła tę funkcję
	//    z najświeższym stanem (currentState). Nawet jeśli wywołasz trzy razy
	//    w jednej turze lub asynchronicznie, każda aktualizacja “złapie” bieżący stan.
	const increment = () =>
		setState((currentState) => ({ count: currentState.count + step }))

	// 📦 Obiektowa forma dispatcha: przekazujesz tutaj
	//    snapshot closure-u — wartość `count` z chwili zainicjowania funkcji.
	//    Jeśli wywołasz kilka razy szybko lub w timeout’cie, wszystkie
	//    użyją tej samej, “zamrożonej” wartości.
	// 	  jesli nie nastapi re-ender to lipa wartosc nadal zamrozona
	const decrement = () => setState({ count: count - step })

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
