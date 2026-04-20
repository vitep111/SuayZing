import { createContext, useContext, useEffect, useReducer } from 'react'
import { buildDefaultState, newId } from './defaults'

const STORAGE_KEY = 'suayzing.state.v1'

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return buildDefaultState()
    const parsed = JSON.parse(raw)
    // Shallow-merge onto current defaults so added fields don't break old saves.
    return { ...buildDefaultState(), ...parsed }
  } catch {
    return buildDefaultState()
  }
}

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage may be unavailable (private mode, quota). Fail silent.
  }
}

const setIn = (obj, path, value) => {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(obj)) {
    const next = obj.slice()
    next[head] = setIn(obj[head], rest, value)
    return next
  }
  return { ...obj, [head]: setIn(obj?.[head], rest, value) }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return setIn(state, action.path, action.value)

    case 'ADD_SERVICE':
      return {
        ...state,
        services: [
          ...state.services,
          { id: newId(), name: 'New Service', pricePerCase: 0, cogsPerCase: 0, monthlyVolume: 0 },
        ],
      }
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map((s) =>
          s.id === action.id ? { ...s, ...action.patch } : s,
        ),
      }
    case 'REMOVE_SERVICE':
      return { ...state, services: state.services.filter((s) => s.id !== action.id) }

    case 'ADD_STAFF':
      return {
        ...state,
        staff: [
          ...state.staff,
          { id: newId(), role: 'New Role', headcount: 0, salaryPerHead: 0 },
        ],
      }
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map((s) => (s.id === action.id ? { ...s, ...action.patch } : s)),
      }
    case 'REMOVE_STAFF':
      return { ...state, staff: state.staff.filter((s) => s.id !== action.id) }

    case 'ADD_FIXED_COST':
      return {
        ...state,
        fixedCosts: [
          ...state.fixedCosts,
          { id: newId(), name: 'New Cost', amount: 0 },
        ],
      }
    case 'UPDATE_FIXED_COST':
      return {
        ...state,
        fixedCosts: state.fixedCosts.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c,
        ),
      }
    case 'REMOVE_FIXED_COST':
      return { ...state, fixedCosts: state.fixedCosts.filter((c) => c.id !== action.id) }

    case 'ADD_STARTUP_ITEM':
      return {
        ...state,
        startupCosts: {
          ...state.startupCosts,
          [action.category]: [
            ...(state.startupCosts[action.category] ?? []),
            { id: newId(), name: 'New Item', amount: 0 },
          ],
        },
      }
    case 'UPDATE_STARTUP_ITEM':
      return {
        ...state,
        startupCosts: {
          ...state.startupCosts,
          [action.category]: state.startupCosts[action.category].map((it) =>
            it.id === action.id ? { ...it, ...action.patch } : it,
          ),
        },
      }
    case 'REMOVE_STARTUP_ITEM':
      return {
        ...state,
        startupCosts: {
          ...state.startupCosts,
          [action.category]: state.startupCosts[action.category].filter(
            (it) => it.id !== action.id,
          ),
        },
      }

    case 'SET_SCENARIO':
      return { ...state, activeScenario: action.scenario }
    case 'SET_CUSTOM_MULTIPLIER':
      return { ...state, scenarios: { ...state.scenarios, custom: action.value } }

    case 'SET_RAMP_MONTH':
      return {
        ...state,
        rampUpCurve: state.rampUpCurve.map((v, i) => (i === action.index ? action.value : v)),
      }

    case 'RESET':
      return buildDefaultState()
    case 'IMPORT':
      return { ...buildDefaultState(), ...action.state }

    default:
      return state
  }
}

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
