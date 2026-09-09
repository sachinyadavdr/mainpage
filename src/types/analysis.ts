export type FeatureTone = 'cyan' | 'green' | 'amber' | 'blue'

export interface AnalysisSection {
    title: string
    description: string
    tone: FeatureTone
    icon: string
}

export interface InsightRow {
    label: string
    value: string
}

export interface SatelliteImageConfig {
    url: string
    alt: string
}
