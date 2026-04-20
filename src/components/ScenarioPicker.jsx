import { useAppState } from '../state/AppStateContext'
import NumberInput from './NumberInput'

const SCENARIOS = [
  { id: 'bear', label: 'Bear −30%' },
  { id: 'base', label: 'Base' },
  { id: 'bull', label: 'Bull +30%' },
  { id: 'custom', label: 'Custom' },
]

export default function ScenarioPicker() {
  const { state, dispatch } = useAppState()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Scenario
      </span>
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
        <div className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-sm">
          <span className="text-slate-500">×</span>
          <div className="w-20">
            <NumberInput
              value={state.scenarios.custom}
              onChange={(v) => dispatch({ type: 'SET_CUSTOM_MULTIPLIER', value: v })}
              fractionDigits={2}
              align="center"
              className="px-1 py-0"
            />
          </div>
        </div>
      )}
    </div>
  )
}
