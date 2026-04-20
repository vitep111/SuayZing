import { useAppState } from '../state/AppStateContext'
import Card from './Card'
import NumberInput from './NumberInput'

const MONTHS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12']

export default function RampUpEditor() {
  const { state, dispatch } = useAppState()
  return (
    <Card
      id="rampup"
      title="Ramp-up curve"
      subtitle="Share of full-capacity volume achieved each month in Year 1."
    >
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {state.rampUpCurve.map((value, i) => (
          <label key={i} className="flex flex-col gap-1">
            <span className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">
              {MONTHS[i]}
            </span>
            <div className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-1 py-1">
              <NumberInput
                value={value * 100}
                onChange={(v) =>
                  dispatch({ type: 'SET_RAMP_MONTH', index: i, value: v / 100 })
                }
                fractionDigits={0}
                align="center"
                min={0}
              />
              <span className="pr-1 text-xs text-slate-500">%</span>
            </div>
          </label>
        ))}
      </div>
    </Card>
  )
}
