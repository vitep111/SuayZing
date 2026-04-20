import { useAppState } from '../../state/AppStateContext'
import { computeModel, computeMonthlySeries } from '../../state/calculations'
import KpiCards from './KpiCards'
import SmartAlerts from './SmartAlerts'
import DashboardCharts from './DashboardCharts'

export default function Dashboard() {
  const { state } = useAppState()
  const model = computeModel(state)
  const monthlySeries = computeMonthlySeries(state)

  return (
    <section id="dashboard" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Executive dashboard</h2>
        <p className="text-xs text-slate-500">
          Headline metrics at the active scenario. All values update live as inputs change.
        </p>
      </div>
      <KpiCards model={model} />
      <SmartAlerts model={model} />
      <DashboardCharts model={model} monthlySeries={monthlySeries} />
    </section>
  )
}
