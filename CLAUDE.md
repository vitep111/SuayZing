# Feasibility Study Platform — CLAUDE.md

## Project Overview
An interactive financial planning platform for an aesthetic clinic startup.
Not a spreadsheet — a live decision-making tool for non-technical founders to model scenarios,
stress-test assumptions, and present findings to partners.

## Tech Stack
- React + Vite
- Tailwind CSS
- Recharts (for all charts)
- No backend — all state in-memory (or localStorage for persistence)

---

## Build Phases

### Phase 1 — Data Model & State Structure
- Services: name, price per case, COGS per case, monthly volume
- Fixed Costs: staff (role + headcount + salary), rent, utilities, marketing, insurance, misc
- Optional Costs: loan repayment (default 0), equipment lease (default 0)
- Startup Costs: Renovation, Medical Equipment, Legal & Licenses, Inventory & Working Capital
- Scenarios: Base, Bear (−30%), Bull (+30%), Custom (user-defined multiplier)
- Growth Rates: Y2 default +20%, Y3 default +15% (both editable)
- Ramp-up curve: monthly % array for Month 1–12
- Tax rate %
- Total available startup capital (default: 2,000,000 THB)
- All state must be globally accessible and editable from any section

### Phase 2 — Calculation Engine
All calculations must be reactive — changing any input updates everything instantly.

**Service Calculations (per service):**
- Revenue = price × monthly volume
- COGS Total = COGS per case × monthly volume
- Gross Profit = Revenue − COGS Total
- Gross Margin % = Gross Profit / Revenue

**P&L (Monthly):**
- Total Revenue = sum of all service revenues
- Total COGS = sum of all service COGS
- Gross Profit = Total Revenue − Total COGS
- Total Fixed Costs = sum of all fixed cost line items
- EBITDA = Gross Profit − Total Fixed Costs
- Tax = EBITDA × tax rate % (only if EBITDA > 0)
- Net Profit = EBITDA − Tax
- Net Margin % = Net Profit / Total Revenue

**Annual P&L:**
- Monthly × 12 (Year 1)
- Year 2 = Year 1 × (1 + Y2 growth rate)
- Year 3 = Year 2 × (1 + Y3 growth rate)

**Break-even:**
- Break-even Revenue = Total Fixed Costs / (1 − COGS%)
- Average Ticket = Total Revenue / Total Monthly Cases
- Break-even Cases/Month = Break-even Revenue / Average Ticket
- Break-even Cases/Day = Break-even Cases/Month / 26 working days

**Scenario Multipliers:**
- Bear: volume × 0.70
- Base: volume × 1.00
- Bull: volume × 1.30
- Custom: volume × user-defined multiplier

**Startup Cost:**
- Auto-total per category
- Grand total vs available capital → surplus or shortfall

**KPIs:**
- Payback Period (months) = Total Startup Cost / Monthly Net Profit
- Annual ROI = (Annual Net Profit / Total Startup Cost) × 100

### Phase 3 — UI: Input Forms & Tables
- All inputs must be editable inline (no modal required, but acceptable)
- Add / Edit / Delete rows for: services, cost items, startup cost items
- Adding/removing rows must never break calculations
- Staff table: role name, headcount, salary per head → auto total
- All number inputs: Thai Baht format preferred (comma-separated)

### Phase 4 — Charts & Dashboard

**Executive Dashboard KPI Cards:**
- Monthly Revenue
- Gross Profit
- Net Profit
- Net Margin %
- Payback Period
- Annual ROI

**Charts (use Recharts):**
- Cash Flow Projection — 12-month line chart (with ramp-up curve applied)
- Revenue Mix — donut chart by service
- Cost Structure — bar chart (fixed vs variable breakdown)
- Margin by Service — horizontal bar chart
- Monthly Profit Track — bar chart (profit per month over 12 months)
- Revenue Contribution — horizontal bar chart by service

**Smart Alerts (show warning banners when):**
- Any service gross margin < 40%
- Net margin < 10%
- Payback period > 24 months
- Total startup cost exceeds available capital

### Phase 5 — Scenario Planning & 3-Year Projection

**Scenario Toggle:**
- Persistent toggle (Bear / Base / Bull / Custom) visible on all pages
- Switching scenario instantly updates all calculations and charts

**3-Year Projection Table:**
- Columns: Year 1, Year 2, Year 3
- Rows: Revenue, COGS, Gross Profit, OPEX, EBITDA, Tax, Net Profit, Net Margin %
- Growth rates editable inline

---

## Current Services (defaults)
| Service | Price (THB) | COGS (THB) | Monthly Volume |
|---|---|---|---|
| Botox | - | - | - |
| Filler | - | - | - |
| Biostimulator | - | - | - |
| Meso | - | - | - |
| IV Drip | - | - | - |
| HIFU | - | - | - |
| Oligio | - | - | - |
| Weight Loss Injection | - | - | - |

> Prices and volumes to be filled in by user. No hardcoded defaults for financials.

---

## Non-Functional Requirements
- Every field must be editable — no locked inputs
- Adding a new service or cost row must not require touching formulas
- All calculations are derived from state — no hardcoded numbers in UI
- Mobile-friendly layout is a bonus, not a priority
- No authentication required
- Data persists in localStorage (so refreshing doesn't wipe inputs)

---

## Prompt Convention for Claude Code
When building, always reference this file.
Use phase numbers in your prompts:
- "Build Phase 1 per CLAUDE.md"
- "Build Phase 2 per CLAUDE.md"
- etc.

Do not skip phases. Complete and confirm each phase before moving to the next.
