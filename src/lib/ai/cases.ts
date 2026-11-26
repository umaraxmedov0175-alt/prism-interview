export type CaseType = 'Profitability' | 'Market Entry' | 'Market Sizing';

export interface CaseExhibitRow {
  label: string;
  value: string;
}

export interface CaseExhibit {
  title: string;
  rows: CaseExhibitRow[];
}

export interface CaseStudy {
  id: string;
  title: string;
  type: CaseType;
  prompt: string;
  exhibits: CaseExhibit[];
  referenceStructure: string[];
}

export const CASE_LIBRARY: CaseStudy[] = [
  {
    id: 'northstar-roasters-profitability',
    title: 'Northstar Roasters Margin Compression',
    type: 'Profitability',
    prompt:
      'Northstar Roasters operates 140 specialty coffee cafés across the US Midwest. Over the past 12 months, revenue grew 9% year-over-year, yet operating profit fell by 18%. The CEO has asked you to diagnose the root cause of the profit decline and recommend concrete actions to restore margins within two quarters.',
    exhibits: [
      {
        title: 'Exhibit 1: P&L Comparison ($M, Annual)',
        rows: [
          { label: 'Total Revenue (Prior Year -> Current)', value: '$110.0M -> $119.9M (+9.0%)' },
          { label: 'COGS: Coffee Beans & Dairy', value: '$33.0M -> $39.6M (+20.0%)' },
          { label: 'Store Labor & Benefits', value: '$35.2M -> $40.8M (+15.9%)' },
          { label: 'Occupancy & Utilities', value: '$19.8M -> $20.4M (+3.0%)' },
          { label: 'Corporate SG&A', value: '$8.8M -> $8.3M (-5.7%)' },
          { label: 'Operating Profit (EBIT)', value: '$13.2M -> $10.8M (-18.2%)' },
        ],
      },
      {
        title: 'Exhibit 2: Channel & Product Mix Shift',
        rows: [
          { label: 'In-Store Espresso Drinks (% of Revenue)', value: '68% -> 56%' },
          { label: 'Third-Party Delivery Orders (% of Revenue)', value: '12% -> 26%' },
          { label: 'Packaged Retail Beans (% of Revenue)', value: '20% -> 18%' },
          { label: 'Delivery Platform Commission Fee', value: '22% of gross delivery order value' },
          { label: 'Average Ticket: In-Store vs. Delivery', value: '$7.40 vs. $11.80' },
        ],
      },
      {
        title: 'Exhibit 3: Store Labor & Throughput Metrics',
        rows: [
          { label: 'Average Barista Wage ($/hr)', value: '$16.50 -> $18.25 (+10.6%)' },
          { label: 'Orders per Labor Hour (In-Store)', value: '24.0 -> 21.5 (-10.4%)' },
          { label: 'Peak-Hour Order Abandonment Rate', value: '4% -> 11%' },
        ],
      },
    ],
    referenceStructure: [
      'Clarify objective & timeline (restore EBIT margin within 2 quarters)',
      'Revenue decomposition: Volume vs. Price/Mix across In-Store, Delivery, and Retail',
      'Cost decomposition: Variable COGS (beans/dairy, delivery commissions) vs. Fixed/Semi-fixed (store labor, occupancy, SG&A)',
      'Operational bottlenecks: Delivery order complexity slowing peak-hour throughput',
      'Levers & recommendations: Delivery menu pricing/bundling, peak-hour prep workflow, supplier hedging',
    ],
  },
  {
    id: 'kestrel-ev-fleet-entry',
    title: 'Kestrel Mobility: Commercial EV Fleet Software',
    type: 'Market Entry',
    prompt:
      'Kestrel Mobility sells telematics and route-optimization SaaS to mid-sized logistics fleets in North America ($45M ARR). Leadership is evaluating whether to enter Western Europe with a dedicated EV fleet-charging and battery-health module next year. Should Kestrel enter this market, and if so, how should it sequence the launch?',
    exhibits: [
      {
        title: 'Exhibit 1: Western Europe Commercial EV Fleet Market',
        rows: [
          { label: 'Addressable Commercial Vans & Light Trucks', value: '1.8M vehicles (growing 24% YoY)' },
          { label: 'Target Mid-Market Segment (25–250 vehicles)', value: '35% of total commercial EVs' },
          { label: 'Expected SaaS Willingness to Pay', value: '$28 / vehicle / month' },
          { label: 'Projected Year-2 Realistic Market Share', value: '6% of target segment' },
        ],
      },
      {
        title: 'Exhibit 2: Entry Cost & Unit Economics',
        rows: [
          { label: 'Upfront Localization & GDPR Compliance', value: '$2.4M one-time' },
          { label: 'Year-1 Go-to-Market & Partner Channel Setup', value: '$3.8M' },
          { label: 'Ongoing Regional Support & Cloud Hosting', value: '$1.4M / year' },
          { label: 'Gross Margin on SaaS Revenue', value: '78%' },
        ],
      },
      {
        title: 'Exhibit 3: Competitive & Regulatory Landscape',
        rows: [
          { label: 'Incumbent European Telematics Share', value: '62% (mostly legacy ICE-focused tools)' },
          { label: 'EV-Native SaaS Competitors', value: '2 regional players, <10% combined share' },
          { label: 'EU Mandate Trigger', value: 'Zero-emission urban delivery zones in 14 major cities by next year' },
        ],
      },
    ],
    referenceStructure: [
      'Market attractiveness: TAM/SAM sizing, growth rate, and regulatory tailwinds',
      'Financial viability: Year-1/Year-2 revenue vs. upfront + ongoing investment payback',
      'Competitive positioning: Incumbent ICE blind spots vs. Kestrel EV-native capabilities',
      'Go-to-market & risks: Direct sales vs. OEM/utility partnerships, GDPR & localization',
      'Recommendation & phased rollout: Beachhead cities with zero-emission mandates first',
    ],
  },
  {
    id: 'veridian-ai-scribe-sizing',
    title: 'Veridian Health: Ambient AI Clinical Scribe',
    type: 'Market Sizing',
    prompt:
      'Veridian Health is preparing to price and launch an ambient AI clinical documentation assistant for outpatient physicians in the United States. Estimate the annual addressable revenue opportunity (ARR) for this product in the US outpatient market and identify the key assumptions that drive sensitivity.',
    exhibits: [
      {
        title: 'Exhibit 1: US Physician & Practice Demographics',
        rows: [
          { label: 'Active US Physicians (Total)', value: '1,000,000' },
          { label: 'Share in Outpatient / Ambulatory Care', value: '70%' },
          { label: 'High-Documentation Specialties (Primary Care, IM, Psych, Derm)', value: '55% of outpatient physicians' },
          { label: 'Independent vs. Health-System Employed', value: '30% independent / 70% health-system' },
        ],
      },
      {
        title: 'Exhibit 2: Value & Pricing Benchmarks',
        rows: [
          { label: 'Average Charting Time Saved per Physician', value: '6.0 hours / week' },
          { label: 'Incremental Patient Visits Enabled', value: '2 visits / day (220 clinic days / year)' },
          { label: 'Average Net Contribution per Outpatient Visit', value: '$65' },
          { label: 'Proposed SaaS Price (per Physician / Month)', value: '$350 (Health-System) / $450 (Independent)' },
        ],
      },
    ],
    referenceStructure: [
      'Define scope: US outpatient physicians, annual recurring revenue (ARR)',
      'Top-down population funnel: Total physicians -> outpatient -> target specialties -> adoption/eligibility',
      'Segment pricing: Health-system vs. independent willingness to pay',
      'Bottom-up value sanity check: Incremental visit contribution vs. annual subscription cost (ROI)',
      'Sensitivity & risks: EHR integration friction, specialty mix, enterprise discounting',
    ],
  },
];
