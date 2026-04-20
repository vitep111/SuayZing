import { useState } from 'react'
import { AppStateProvider, useAppState } from './state/AppStateContext'
import { computeModel } from './state/calculations'
import ScenarioPicker from './components/ScenarioPicker'
import ServicesTable from './components/ServicesTable'
import StaffTable from './components/StaffTable'
import FixedCostsTable from './components/FixedCostsTable'
import StartupCostsTable from './components/StartupCostsTable'
import GlobalSettings from './components/GlobalSettings'
import RampUpEditor from './components/RampUpEditor'
import ProjectionTable from './components/ProjectionTable'
import Dashboard from './components/dashboard/Dashboard'

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projection', label: '3-year' },
  { id: 'services', label: 'Services' },
  { id: 'staff', label: 'Staff' },
  { id: 'fixed-costs', label: 'Fixed costs' },
  { id: 'startup', label: 'Startup' },
  { id: 'settings', label: 'Settings' },
  { id: 'rampup', label: 'Ramp-up' },
]

function Header() {
  const { dispatch } = useAppState()
  const [showInspector, setShowInspector] = useState(false)

  const confirmReset = () => {
    if (window.confirm('Reset all inputs to defaults? This cannot be undone.')) {
      dispatch({ type: 'RESET' })
    }
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-3">
          <div className="mr-auto">
            <h1 className="text-lg font-bold text-slate-900">
              SuayZing <span className="font-normal text-slate-400">· Feasibility Study</span>
            </h1>
            <p className="text-xs text-slate-500">
              Interactive financial model · inputs persist in your browser
            </p>
          </div>
          <ScenarioPicker />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInspector((v) => !v)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              {showInspector ? 'Hide' : 'Inspect'} model
            </button>
            <button
              onClick={confirmReset}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Reset
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-6 pb-2">
          <ul className="flex gap-1 text-xs">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-block rounded-full border border-transparent px-3 py-1 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {showInspector && <ModelInspector />}
    </>
  )
}

function ModelInspector() {
  const { state } = useAppState()
  const model = computeModel(state)
  return (
    <div className="border-b border-slate-200 bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Computed model (live)
        </h2>
        <pre className="max-h-[40vh] overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-relaxed">
          {JSON.stringify(model, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <Dashboard />
        <ProjectionTable />
        <ServicesTable />
        <StaffTable />
        <FixedCostsTable />
        <StartupCostsTable />
        <GlobalSettings />
        <RampUpEditor />
        <footer className="pt-4 text-center text-xs text-slate-400">
          All five phases complete · inputs persist in your browser · scenario updates
          recompute everything instantly.
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Layout />
    </AppStateProvider>
  )
}
