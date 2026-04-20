import { AppStateProvider, useAppState } from './state/AppStateContext'

function StateInspector() {
  const { state, dispatch } = useAppState()

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            SuayZing <span className="text-slate-400 font-normal">· Feasibility Study</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Phase 1 complete — data model initialized and persisted to <code className="rounded bg-slate-200 px-1 py-0.5 text-xs">localStorage</code>.
            No UI features yet.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            Reset to defaults
          </button>
          <button
            onClick={() => dispatch({ type: 'ADD_SERVICE' })}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            + Service
          </button>
          <button
            onClick={() => dispatch({ type: 'ADD_STAFF' })}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            + Staff
          </button>
          <button
            onClick={() => dispatch({ type: 'ADD_FIXED_COST' })}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            + Fixed cost
          </button>
        </div>

        <pre className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-800">
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppStateProvider>
      <StateInspector />
    </AppStateProvider>
  )
}

export default App
