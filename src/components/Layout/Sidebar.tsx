import { useState } from 'react'
import { BarChart3, Bookmark, Clock3, Globe2, Home, Layers3, Map, PanelLeft, ScrollText, X } from 'lucide-react'

const navigation = [
    { label: 'Home', icon: Home }, { label: 'Analyze', icon: BarChart3 }, { label: 'Compare', icon: Layers3 },
    { label: 'Explore Map', icon: Map }, { label: '3D Earth', icon: Globe2 }, { label: 'Reports', icon: ScrollText },
    { label: 'Saved', icon: Bookmark }, { label: 'History', icon: Clock3 },
]

interface SidebarProps { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: SidebarProps) {
    const [active, setActive] = useState('Home')
    return <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar-head"><span className="side-kicker">WORKSPACE</span>
            <button className="icon-button close-sidebar" onClick={onClose} aria-label="Close navigation"><X size={18} />
            </button>
            <PanelLeft size={18} />
        </div>
        <nav aria-label="Primary navigation">{navigation.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); onClose() }} className={`nav-item ${active === label ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>{active === label && <i />}</button>)}</nav>
        <div className="sidebar-quote"><div className="quote-art"><span>⌁</span>
        </div><p>A Greener Planet<br /><b>for Brighter Tomorrows</b>
            </p><span className="quote-line" /></div>
    </aside>
}
