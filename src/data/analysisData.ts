import type { AnalysisSection, InsightRow, SatelliteImageConfig } from '../types/analysis'

export const analysisData: { satelliteImage: SatelliteImageConfig } = {
    satelliteImage: {
        url: '',
        alt: 'Satellite image of analyzed region',
    },
}

export const analysisSections: AnalysisSection[] = [
    { title: 'Built-up area', description: 'Dense development is concentrated around the central corridor and road network.', tone: 'cyan', icon: 'grid' },
    { title: 'Vegetation', description: 'Healthy vegetation appears in connected pockets along the agricultural edges.', tone: 'green', icon: 'leaf' },
    { title: 'Agricultural land', description: 'Cultivated parcels form a broad mosaic outside the urban footprint.', tone: 'amber', icon: 'sprout' },
    { title: 'River / Water body', description: 'The Ganga River system is visible to the north with smaller water channels nearby.', tone: 'blue', icon: 'waves' },
]

export const locationInsights: InsightRow[] = [
    { label: 'Region', value: 'Kanpur, Uttar Pradesh' },
    { label: 'Coordinates', value: '26.45° N, 80.33° E (approximate)' },
    { label: 'Dominant Land Cover', value: 'Urban + Agricultural' },
    { label: 'Nearby Water Body', value: 'Ganga River' },
    { label: 'Urbanization Level', value: 'High' },
]
