import { Droplets, MapPin, Navigation, Waves } from 'lucide-react'
import { locationInsights } from '../../data/analysisData'

export function LocationInsights() {
    return <div className="location-insights"><div className="location-heading"><span className="eyebrow">REGIONAL METRICS</span>
        <h3>Geographic Summary</h3>
    </div>{locationInsights.map((insight, index) => <div className="insight-row" key={insight.label}>
        <span className="insight-label">{index === 0 ? <MapPin size={13} /> : index === 1 ? <Navigation size={13} /> : index === 3 ? <Waves size={13} /> : <Droplets size={13} />}{insight.label}</span><strong>{insight.value}</strong></div>)}</div>
}
