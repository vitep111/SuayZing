// Phase 2 — pure calculation engine.
// Every function here is a pure derivation from AppState. Consumers call
// computeModel(state) inside render; reactivity comes from React re-rendering
// when state in the provider changes.
//
// Conventions:
//  - Percentages and margins are returned as decimals (0.42 == 42%).
//    Annual ROI is the one exception (returned as a percentage number) because
//    CLAUDE.md defines it that way.
//  - When a denominator is zero we return 0 for margins/ratios so the UI can
//    safely format them.
//  - paybackMonths returns null when the business is not yet profitable.

export const activeMultiplier = (state) =>
  state.scenarios[state.activeScenario] ?? 1

export const computeService = (service, multiplier = 1) => {
  const effectiveVolume = service.monthlyVolume * multiplier
  const revenue = service.pricePerCase * effectiveVolume
  const cogs = service.cogsPerCase * effectiveVolume
  const grossProfit = revenue - cogs
  const grossMargin = revenue > 0 ? grossProfit / revenue : 0
  return {
    id: service.id,
    name: service.name,
    pricePerCase: service.pricePerCase,
    cogsPerCase: service.cogsPerCase,
    monthlyVolume: service.monthlyVolume,
    effectiveVolume,
    revenue,
    cogs,
    grossProfit,
    grossMargin,
  }
}

export const computeStaffTotal = (staff) =>
  staff.reduce((sum, r) => sum + r.headcount * r.salaryPerHead, 0)

export const computeFixedCostsTotal = (state) => {
  const staffTotal = computeStaffTotal(state.staff)
  const itemsTotal = state.fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  return staffTotal + itemsTotal
}

export const computePnlMonthly = (services, state) => {
  const revenue = services.reduce((s, x) => s + x.revenue, 0)
  const cogs = services.reduce((s, x) => s + x.cogs, 0)
  const grossProfit = revenue - cogs
  const grossMargin = revenue > 0 ? grossProfit / revenue : 0
  const fixedCosts = computeFixedCostsTotal(state)
  const ebitda = grossProfit - fixedCosts
  const tax = ebitda > 0 ? ebitda * state.taxRate : 0
  const netProfit = ebitda - tax
  const netMargin = revenue > 0 ? netProfit / revenue : 0
  const totalCases = services.reduce((s, x) => s + x.effectiveVolume, 0)
  return {
    revenue,
    cogs,
    grossProfit,
    grossMargin,
    fixedCosts,
    ebitda,
    tax,
    netProfit,
    netMargin,
    totalCases,
  }
}

const annualizeMonthly = (m) => {
  const revenue = m.revenue * 12
  const cogs = m.cogs * 12
  const grossProfit = m.grossProfit * 12
  const fixedCosts = m.fixedCosts * 12
  const ebitda = m.ebitda * 12
  const tax = m.tax * 12
  const netProfit = m.netProfit * 12
  return {
    revenue,
    cogs,
    grossProfit,
    fixedCosts,
    ebitda,
    tax,
    netProfit,
    grossMargin: revenue > 0 ? grossProfit / revenue : 0,
    netMargin: revenue > 0 ? netProfit / revenue : 0,
  }
}

// Per CLAUDE.md: "Year 2 = Year 1 × (1 + Y2 growth rate)". Every line scales
// uniformly; margins stay flat as a result (revenue and costs both grow).
const scaleYear = (year, growth) => {
  const f = 1 + growth
  return {
    revenue: year.revenue * f,
    cogs: year.cogs * f,
    grossProfit: year.grossProfit * f,
    fixedCosts: year.fixedCosts * f,
    ebitda: year.ebitda * f,
    tax: year.tax * f,
    netProfit: year.netProfit * f,
    grossMargin: year.grossMargin,
    netMargin: year.netMargin,
  }
}

export const computePnlAnnual = (monthly, growthRates) => {
  const year1 = annualizeMonthly(monthly)
  const year2 = scaleYear(year1, growthRates.year2)
  const year3 = scaleYear(year2, growthRates.year3)
  return { year1, year2, year3 }
}

export const computeBreakeven = (monthly, services) => {
  const cogsPct = monthly.revenue > 0 ? monthly.cogs / monthly.revenue : 0
  const denom = 1 - cogsPct
  const breakevenRevenue = denom > 0 ? monthly.fixedCosts / denom : 0
  const totalCases = services.reduce((s, x) => s + x.effectiveVolume, 0)
  const avgTicket = totalCases > 0 ? monthly.revenue / totalCases : 0
  const breakevenCasesPerMonth = avgTicket > 0 ? breakevenRevenue / avgTicket : 0
  const breakevenCasesPerDay = breakevenCasesPerMonth / 26
  return {
    cogsPct,
    breakevenRevenue,
    avgTicket,
    breakevenCasesPerMonth,
    breakevenCasesPerDay,
  }
}

export const computeStartup = (state) => {
  const byCategory = {}
  let total = 0
  for (const [key, items] of Object.entries(state.startupCosts)) {
    const catTotal = items.reduce((s, it) => s + it.amount, 0)
    byCategory[key] = catTotal
    total += catTotal
  }
  const diff = state.startupCapital - total
  return {
    byCategory,
    total,
    capital: state.startupCapital,
    surplus: diff >= 0 ? diff : 0,
    shortfall: diff < 0 ? -diff : 0,
  }
}

export const computeKpis = (monthly, annualYear1, startup) => ({
  paybackMonths: monthly.netProfit > 0 ? startup.total / monthly.netProfit : null,
  annualRoiPct: startup.total > 0 ? (annualYear1.netProfit / startup.total) * 100 : 0,
})

// 12-month monthly series with the ramp-up curve applied. Used by the
// dashboard for Cash Flow Projection and Monthly Profit Track. Starting
// cash = startup capital minus total startup cost (the day-zero runway);
// each month adds that month's net profit.
export const computeMonthlySeries = (state) => {
  const multiplier = activeMultiplier(state)
  const services = state.services.map((s) => computeService(s, multiplier))
  const baseRevenue = services.reduce((s, x) => s + x.revenue, 0)
  const baseCogs = services.reduce((s, x) => s + x.cogs, 0)
  const fixedCosts = computeFixedCostsTotal(state)
  const startup = computeStartup(state)
  const startingCash = state.startupCapital - startup.total

  let cash = startingCash
  return state.rampUpCurve.map((r, i) => {
    const revenue = baseRevenue * r
    const cogs = baseCogs * r
    const grossProfit = revenue - cogs
    const ebitda = grossProfit - fixedCosts
    const tax = ebitda > 0 ? ebitda * state.taxRate : 0
    const netProfit = ebitda - tax
    cash += netProfit
    return {
      month: i + 1,
      label: `M${i + 1}`,
      revenue,
      cogs,
      grossProfit,
      fixedCosts,
      ebitda,
      tax,
      netProfit,
      cumulativeCash: cash,
      rampPct: r,
    }
  })
}

export const computeModel = (state) => {
  const multiplier = activeMultiplier(state)
  const services = state.services.map((s) => computeService(s, multiplier))
  const pnlMonthly = computePnlMonthly(services, state)
  const pnlAnnual = computePnlAnnual(pnlMonthly, state.growthRates)
  const breakeven = computeBreakeven(pnlMonthly, services)
  const startup = computeStartup(state)
  const kpis = computeKpis(pnlMonthly, pnlAnnual.year1, startup)
  return {
    scenario: state.activeScenario,
    multiplier,
    services,
    pnlMonthly,
    pnlAnnual,
    breakeven,
    startup,
    kpis,
  }
}
