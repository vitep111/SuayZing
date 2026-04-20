import { useAppState } from '../state/AppStateContext'
import Card from './Card'
import NumberInput from './NumberInput'

function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="rounded-md border border-slate-300 bg-white px-2 py-1">
        {children}
      </div>
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

export default function GlobalSettings() {
  const { state, dispatch } = useAppState()
  const set = (path, value) => dispatch({ type: 'SET', path, value })

  return (
    <Card
      id="settings"
      title="Global settings"
      subtitle="Tax rate and available capital. Year 2 / 3 growth rates are set inline in the projection table."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tax rate" hint="Applied only to positive EBITDA.">
          <div className="flex items-center gap-1">
            <NumberInput
              value={state.taxRate * 100}
              onChange={(v) => set(['taxRate'], v / 100)}
              fractionDigits={1}
              min={0}
            />
            <span className="pr-1 text-slate-500">%</span>
          </div>
        </Field>

        <Field label="Startup capital" hint="Available funds for the build-out.">
          <div className="flex items-center gap-1">
            <NumberInput
              value={state.startupCapital}
              onChange={(v) => set(['startupCapital'], v)}
              min={0}
            />
            <span className="pr-1 text-xs text-slate-500">THB</span>
          </div>
        </Field>
      </div>
    </Card>
  )
}
