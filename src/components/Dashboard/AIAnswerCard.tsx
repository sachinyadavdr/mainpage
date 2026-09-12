import { CheckCircle2, Grid2X2, Info, Leaf, Sprout, Waves } from 'lucide-react'
import { analysisSections } from '../../data/analysisData'
import type { AnalysisSection } from '../../types/analysis'

const icons = { grid: Grid2X2, leaf: Leaf, sprout: Sprout, waves: Waves }

export function AIAnswerCard() {
    return <section className="panel ai-card"><div className="panel-title-row"><div>

        <span className="eyebrow">BHOODRISHTI AI</span><h2>ANALYSIS RESULT</h2>
    </div><span className="confidence">
            <CheckCircle2 size={14} /> Confidence: 92%</span>
    </div><p className="answer-intro">The satellite image shows a rapidly evolving peri-urban landscape where structured development meets productive agricultural land.</p>
        <div className="analysis-list">{analysisSections.map((section) => <AnalysisItem key={section.title} section={section} />)}</div>
        <div className="info-box"><Info size={16} /><span>This analysis is based on visual interpretation of the satellite image. For precise details, refer to official geospatial data sources.</span>
        </div>
    </section>
}

function AnalysisItem({ section }: { section: AnalysisSection }) {
    const Icon = icons[section.icon as keyof typeof icons]
    return <div className={`analysis-item ${section.tone}`}>
        <div className="item-icon"><Icon size={16} />
        </div><div><h3>{section.title}</h3>
            <p>{section.description}</p></div>
    </div>
}
