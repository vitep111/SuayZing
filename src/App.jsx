import { useState } from 'react'
import { AppStateProvider, useAppState } from './state/AppStateContext'
import { computeModel } from './state/calculations'

const SCENARIOS = [
  { id: 'bear', label: 'Bear −30%' },
  { id: 'base', label: 'Base' },
  { id: 'bull', label: 'Bull +30%' },
  { id: 'custom', label: 'Custom' },
]

function ScenarioPicker() {
  const { state, dispatch } = useAppState()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-600">Scenario:</span>
      <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => dispatch({ type: 'SET_SCENARIO', scenario: s.id })}
            className={`px-3 py-1.5 text-sm ${
              state.activeScenario === s.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {state.activeScenario === 'custom' && (
        <label className="flex items-center gap-1 text-sm text-slate-600">
          ×
          <input
            type="number"
            step="0.05"
            value={state.scenarios.custom}
            onChange={(e) =>
              dispatch({
                type: 'SET_CUSTOM_MULTIPLIER',
                value: Number(e.target.value) || 0,
              })
            }
            className="w-20 rounded border border-slate-300 px-2 py-1"
          />
        </label>
      )}
    </div>
  )
}

function Inspector() {
  const { state, dispatch } = useAppState()
  const model = computeModel(state)
  const [showRaw, setShowRaw] = useState(false)

  const btn =
    'rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100'

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            SuayZing <span className="font-normal text-slate-400">· Feasibility Study</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Phase 2 complete — reactive calculation engine. Toggle scenarios or edit
            <code className="mx-1 rounded bg-slate-200 px-1 py-0.5 text-xs">localStorage</code>
            and watch the derived model recompute.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <ScenarioPicker />
          <div className="grow" />
          <button className={btn} onClick={() => dispatch({ type: 'RESET' })}>
            Reset
          </button>
          <button className={btn} onClick={() => dispatch({ type: 'ADD_SERVICE' })}>
            + Service
          </button>
          <button className={btn} onClick={() => dispatch({ type: 'ADD_STAFF' })}>
            + Staff
          </button>
          <button className={btn} onClick={() => dispatch({ type: 'ADD_FIXED_COST' })}>
            + Fixed cost
          </button>
          <button className={btn} onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? 'Hide raw state' : 'Show raw state'}
          </button>
        </div>

        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Computed model
          </h2>
          <pre className="max-h-[60vh] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-800">
            {JSON.stringify(model, null, 2)}
          </pre>
        </section>

        {showRaw && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Raw state
            </h2>
            <pre className="max-h-[60vh] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-800">
              {JSON.stringify(state, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <AppStateProvider>
      <Inspector />
    </AppStateProvider>
  )
}

export default App
