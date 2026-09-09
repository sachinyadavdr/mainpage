const stats = [{ value: '42.3%', label: 'Built-up Area', tone: 'cyan' },
{ value: '28.6%', label: 'Vegetation', tone: 'green' },
{ value: '22.1%', label: 'Agricultural', tone: 'amber' },
{ value: '7.0%', label: 'Water Body', tone: 'blue' }]

export function StatisticsCards() {
    return <div className="stats-grid">{stats.map((stat) => <div className={`stat-card ${stat.tone}`} key={stat.label}>
        <strong>{stat.value}</strong>
        <span>{stat.label}</span>
    </div>)}</div>
}
