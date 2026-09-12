import { Expand } from 'lucide-react'
import { analysisData } from '../../data/analysisData'
import { SatelliteImageViewer } from './SatelliteImageViewer'
import { StatisticsCards } from './StatisticsCards'

export function FeatureDetectionCard() {
    return <section className="panel feature-card"><div className="panel-title-row"><div>
        <span className="eyebrow">TERRAIN & SURFACE METRICS</span>
        <h2>Active Feature Overlay <span>(Highlighted)</span>
        </h2>
    </div>
        <button className="icon-button" aria-label="Expand feature detection">
            <Expand size={17} /></button>
    </div>
        <SatelliteImageViewer image={analysisData.satelliteImage} />
        <div className="legend">

            <span className="eyebrow">MAP LEGEND</span>
            <div className="legend-items">
                <span><i className="cyan" />Built-up Area</span>
                <span><i className="green" />Vegetation</span>
                <span><i className="amber" />Agricultural Land</span>
                <span><i className="blue" />Water Body</span>
            </div>
        </div>
        <StatisticsCards />
    </section>
}
