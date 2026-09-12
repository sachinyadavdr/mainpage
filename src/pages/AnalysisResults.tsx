import { Leaf, RotateCcw } from 'lucide-react'
import { Header } from '../components/Layout/Header'
import { AIAnswerCard } from '../components/Dashboard/AIAnswerCard'
import { FeatureDetectionCard } from '../components/Dashboard/FeatureDetectionCard'
import { UploadAnalysis } from '../components/Dashboard/UploadAnalysis'
import { EarthGlobe } from '../components/Earth/EarthGlobe'
import { LocationInsights } from '../components/Dashboard/LocationInsights'

export function AnalysisResults() {
    return <div className="app-shell"><Header onMenuClick={() => { }} />
        <main className="main-content"><div className="content-heading"><div>
            <span className="section-index">01 / INSIGHT REPORT</span>
            <h1>Analysis <em>Results</em></h1><p>AI-powered insights from your satellite image</p>
        </div><div className="heading-aside"><div className="sustainability"><Leaf size={18} />
            <span>Turning Satellite Data<br /><b>into Real-World Solutions</b></span>
        </div><div className="date-card"><span>LAST SYNC</span>
                    <strong>09 SEP 2026</strong><small>10:42:08 IST <i />
                    </small>
                </div>
            </div>
        </div>
            <div className="dashboard-grid"><AIAnswerCard />
                <FeatureDetectionCard /><section className="panel earth-card">
                    <div className="panel-title-row"><div>
                        <span className="eyebrow">SPATIAL ANCHOR</span><h2>Interactive Globe <span>& Coordinates</span>
                        </h2></div><button className="reset-button" aria-label="Reset globe">
                            <RotateCcw size={14} /></button>
                    </div><EarthGlobe />
                    <LocationInsights />
                </section></div><UploadAnalysis /><footer>
                <span>BHOO DRISHTI AI <b>•</b> EARTH OBSERVATION INTELLIGENCE</span>
                <span>DATA SOURCE: SATELLITE IMAGERY <i /></span>
            </footer>
        </main>
    </div>
}
