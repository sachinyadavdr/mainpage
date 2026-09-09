import { Bell, ChevronDown, Menu, Search, Sparkles } from 'lucide-react'

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="topbar">
            <button className="icon-button mobile-menu" onClick={onMenuClick} aria-label="Open navigation">
                <Menu size={20} /></button>
            <div className="brand-mark" aria-hidden="true"><span>
            </span>
            </div>
            <div className="brand-copy">
                <div className="brand-name">
                    <b>BHOO</b>
                    <strong>DRISHTI</strong>
                    <b>AI</b>
                </div>
                <div className="brand-tagline">Seeing Earth <span>
                </span> Understanding Tomorrow</div>
            </div>
            <div className="header-promise">
                <Sparkles size={15} /><span>From Space to a <b>Sustainable Tomorrow</b>
                </span>
            </div>
            <div className="header-actions">
                <label className="search-field">
                    <Search size={16} />
                    <input aria-label="Search" placeholder="Search locations, topics or anything..." />
                </label>
                <button className="icon-button notification" aria-label="Notifications">
                    <Bell size={18} /><i />
                </button>
                <button className="profile-button" aria-label="Open account menu">
                    <span className="avatar">S</span><span className="profile-name">sachin</span>
                    <ChevronDown size={15} />
                </button>
            </div>
        </header>
    )
}
