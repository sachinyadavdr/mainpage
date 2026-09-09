import { Maximize2, ScanSearch } from 'lucide-react'
import type { SatelliteImageConfig } from '../../types/analysis'

interface SatelliteImageViewerProps { image: SatelliteImageConfig }

export function SatelliteImageViewer({ image }: SatelliteImageViewerProps) {
    return <div className="satellite-viewer"><div className="image-toolbar">
        <span><span className="live-dot" /> LIVE ANALYSIS LAYER</span>
        <div><button className="mini-icon" aria-label="Zoom image">
            <ScanSearch size={15} /></button>
            <button className="mini-icon" aria-label="Fullscreen image"><Maximize2 size={15} /></button>
        </div>
    </div>
        <div className="satellite-frame">
            {image?.url ? <img src={image.url} alt={image.alt} /> :
                <div className="satellite-placeholder">
                    <div className="grid-globe">◎</div>
                    <strong>Satellite Image Preview</strong>
                    <span>Awaiting image input</span></div>}
            <div className="scan-line" /><span className="corner tl" /><span className="corner tr" />
            <span className="corner bl" />
            <span className="corner br" /></div></div>
}
