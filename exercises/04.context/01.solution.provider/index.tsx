import { createContext, useEffect, useState, use, useCallback } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	type BlogPost,
	generateGradient,
	getMatchingPosts,
} from '#shared/blog-posts'
import { setGlobalSearchParams } from '#shared/utils'

// 🦺 create a SearchParamsTuple type here that's a readonly array of two elements:
// - the first element is a URLSearchParams instance
// - the second element is typeof setGlobalSearchParams

const bzz = typeof setGlobalSearchParams
// okreslamy typ krotki
type SearchParamsTuple = readonly [
	URLSearchParams,
	typeof setGlobalSearchParams,
]
// 🐨 create a SearchParamsContext that is of this type
// 💰 let's start with this as the default value (we'll improve it next):
// [new URLSearchParams(window.location.search), setGlobalSearchParams]

// tworzymy kontekst, okreslamy, ze ma byc typu SearchParamsTuple i przyjmuje na start parametry ktore sobie podalismy

// createContext Tworzy obiekt, który będzie w stanie przechować jedną wartość (naszą krotkę) i dostarczyć ją wszystkim komponentom, które o to poproszą.

// realnie nigdy nie uzywamy tego co w () dopiero w wywolaniu value
const SearchParamsContext = createContext<SearchParamsTuple>([
	new URLSearchParams(window.location.search),
	setGlobalSearchParams,
])

// 🐨 change this to SearchParamsProvider and accept children

// okreslamy ze przyjmuje childreny czyli wartosci przekazywane w srodku
function SearchParamsProvider({ children }: { children: React.ReactNode }) {
	// searchParams, nasze aktualne search Parametry, set wiadomo funkcja do ich zmiany
	const [searchParams, setSearchParamsState] = useState(
		() => new URLSearchParams(window.location.search),
	)

	// nasluchiwanie na zmiany URL
	useEffect(() => {
		function updateSearchParams() {
			// zmiana parametrow
			setSearchParamsState((prevParams) => {
				const newParams = new URLSearchParams(window.location.search)
				return prevParams.toString() === newParams.toString()
					? prevParams
					: newParams
			})
		}
		// nasluchiwanie na zmiane popstateu czyli tych strzalek wtedy zmieniamy searchParamsy
		window.addEventListener('popstate', updateSearchParams)
		return () => window.removeEventListener('popstate', updateSearchParams)
	}, [])

	// pod zmienna setSearchParams przypisujemy sobie funkcje useCallback ktora mowi, że ta funkcja powstaje raz i zachowuje tę samą referencję między renderami, nie zmieniamy jej w zadnym innym wypadku, poniewaz [] pozostaly puste. Jest to stabilne miedzy renderami

	// funckja do zmiany stanu
	const setSearchParams = useCallback(
		// argumenty maja byc parametrami setGlobalSearchParams
		// pakuje sobie je do listy
		(...args: Parameters<typeof setGlobalSearchParams>) => {
			// tutaj rozpakowane argumenty pod searchParams
			const searchParamszz = setGlobalSearchParams(...args)
			// rowniez zmiana parametrow
			setSearchParamsState((prevParams) => {
				return prevParams.toString() === searchParamszz.toString()
					? prevParams
					: searchParamszz
			})
			return searchParamszz
		},
		[], // brak zaleznosci funkcja totalnie stabilna,
	)

	// 🐨 instead of returning this, render the SearchParamsContext and
	// provide this tuple as the value
	// 💰 make sure to render the children as well!

	// tupla posiada aktualne searchparametry, oraz metosda do zamiany
	const tupla = [searchParams, setSearchParams] as const

	// renderujemy nasze dzieci z wartosciami ktore okreslilismy w SearchParamsContext, wszystkie dzieci maja teraz dostep do tego tupla
	return <SearchParamsContext value={tupla}>{children}</SearchParamsContext>
}

// 🐨 create a useSearchParams hook here that returns use(SearchParamsContext)

// tu funkcja do zwrotu wartosci z SearchParamsContext
export function useSearchParams() {
	return use(SearchParamsContext)
}

const getQueryParam = (params: URLSearchParams) => params.get('query') ?? ''

function App() {
	return (
		// 🐨 wrap this in the SearchParamsProvider
		// opakowujemy wszystko w providera wiec form i matchingposts maja dostep
		<SearchParamsProvider>
			<div className="app">
				<Form />
				<MatchingPosts />
			</div>
		</SearchParamsProvider>
	)
}

function Form() {
	// pobranie aktualnej krotki z provideram sarchParams aktualny obiekt URLSearchParams

	//setSearchParams → funkcja, która modyfikuje URL i aktualizuje stan w Providerze

	// gdyby nie owiniecie to tutaj serachParams i setSearch bylyby innymi instancjami niz to rowniez w mathcing!
	const [searchParams, setSearchParams] = useSearchParams()
	const query = getQueryParam(searchParams)
	const words = query.split(' ').map((w) => w.trim())

	const dogChecked = words.includes('dog')
	const catChecked = words.includes('cat')
	const caterpillarChecked = words.includes('caterpillar')

	function handleCheck(tag: string, checked: boolean) {
		const newWords = checked ? [...words, tag] : words.filter((w) => w !== tag)
		setSearchParams(
			{ query: newWords.filter(Boolean).join(' ').trim() },
			{ replace: true },
		)
	}

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<div>
				<label htmlFor="searchInput">Search:</label>
				<input
					id="searchInput"
					name="query"
					type="search"
					value={query}
					onChange={(e) =>
						setSearchParams({ query: e.currentTarget.value }, { replace: true })
					}
				/>
			</div>
			<div>
				<label>
					<input
						type="checkbox"
						checked={dogChecked}
						onChange={(e) => handleCheck('dog', e.currentTarget.checked)}
					/>{' '}
					🐶 dog
				</label>
				<label>
					<input
						type="checkbox"
						checked={catChecked}
						onChange={(e) => handleCheck('cat', e.currentTarget.checked)}
					/>{' '}
					🐱 cat
				</label>
				<label>
					<input
						type="checkbox"
						checked={caterpillarChecked}
						onChange={(e) =>
							handleCheck('caterpillar', e.currentTarget.checked)
						}
					/>{' '}
					🐛 caterpillar
				</label>
			</div>
		</form>
	)
}

function MatchingPosts() {
	const [searchParams] = useSearchParams()
	const query = getQueryParam(searchParams)
	const matchingPosts = getMatchingPosts(query)

	return (
		<ul className="post-list">
			{matchingPosts.map((post) => (
				<Card key={post.id} post={post} />
			))}
		</ul>
	)
}

function Card({ post }: { post: BlogPost }) {
	const [isFavorited, setIsFavorited] = useState(false)
	return (
		<li>
			{isFavorited ? (
				<button
					aria-label="Remove favorite"
					onClick={() => setIsFavorited(false)}
				>
					❤️
				</button>
			) : (
				<button aria-label="Add favorite" onClick={() => setIsFavorited(true)}>
					🤍
				</button>
			)}
			<div
				className="post-image"
				style={{ background: generateGradient(post.id) }}
			/>
			<a
				href={post.id}
				onClick={(event) => {
					event.preventDefault()
					alert(`Great! Let's go to ${post.id}!`)
				}}
			>
				<h2>{post.title}</h2>
				<p>{post.description}</p>
			</a>
		</li>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
