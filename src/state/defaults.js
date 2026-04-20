// Initial state for the feasibility-study platform.
// Shape is driven by CLAUDE.md Phase 1. No hardcoded financial numbers
// for services (per spec) — prices/COGS/volumes start at 0 and are
// filled in by the user. Defaults exist only where CLAUDE.md names them.

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)

export const SERVICE_NAMES = [
  'Botox',
  'Filler',
  'Biostimulator',
  'Meso',
  'IV Drip',
  'HIFU',
  'Oligio',
  'Weight Loss Injection',
]

// Seed fixed-cost rows. Loan Repayment and Equipment Lease default to 0
// per CLAUDE.md; the rest also start at 0 (no hardcoded financials).
export const FIXED_COST_NAMES = [
  'Rent',
  'Utilities',
  'Marketing',
  'Insurance',
  'Misc',
  'Loan Repayment',
  'Equipment Lease',
]

export const STARTUP_CATEGORIES = [
  { key: 'renovation', label: 'Renovation' },
  { key: 'medicalEquipment', label: 'Medical Equipment' },
  { key: 'legalAndLicenses', label: 'Legal & Licenses' },
  { key: 'inventoryAndWorkingCapital', label: 'Inventory & Working Capital' },
]

export const SCENARIO_IDS = ['bear', 'base', 'bull', 'custom']

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {number} pricePerCase
 * @property {number} cogsPerCase
 * @property {number} monthlyVolume
 *
 * @typedef {Object} StaffRole
 * @property {string} id
 * @property {string} role
 * @property {number} headcount
 * @property {number} salaryPerHead
 *
 * @typedef {Object} NamedAmount
 * @property {string} id
 * @property {string} name
 * @property {number} amount
 *
 * @typedef {Object} AppState
 * @property {Service[]} services
 * @property {StaffRole[]} staff
 * @property {NamedAmount[]} fixedCosts
 * @property {Record<string, NamedAmount[]>} startupCosts  keyed by STARTUP_CATEGORIES.key
 * @property {Record<'bear'|'base'|'bull'|'custom', number>} scenarios  volume multipliers
 * @property {'bear'|'base'|'bull'|'custom'} activeScenario
 * @property {{ year2: number, year3: number }} growthRates  decimals, e.g. 0.20
 * @property {number[]} rampUpCurve  length 12, decimals in [0,1]
 * @property {number} taxRate  decimal, e.g. 0.20
 * @property {number} startupCapital  THB
 */

/** @returns {AppState} */
export const buildDefaultState = () => ({
  services: SERVICE_NAMES.map((name) => ({
    id: uid(),
    name,
    pricePerCase: 0,
    cogsPerCase: 0,
    monthlyVolume: 0,
  })),
  staff: [],
  fixedCosts: FIXED_COST_NAMES.map((name) => ({
    id: uid(),
    name,
    amount: 0,
  })),
  startupCosts: Object.fromEntries(
    STARTUP_CATEGORIES.map(({ key }) => [key, []]),
  ),
  scenarios: {
    bear: 0.7,
    base: 1.0,
    bull: 1.3,
    custom: 1.0,
  },
  activeScenario: 'base',
  growthRates: {
    year2: 0.2,
    year3: 0.15,
  },
  rampUpCurve: [0.3, 0.45, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0],
  taxRate: 0.2,
  startupCapital: 2_000_000,
})

export const newId = uid
