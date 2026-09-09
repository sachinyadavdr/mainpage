import { ArrowRight, Building2, Check, ChevronRight, Droplets, Eye, EyeOff, Leaf, LockKeyhole, Mail, Moon, ShieldCheck, Sprout, Sun, TreePine } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { OrbitalScene } from '../components/Landing/OrbitalScene'

interface LandingAuthProps { onEnter: () => void }

const features = [
    { icon: TreePine, label: 'Monitor Forests' },
    { icon: Building2, label: 'Track Urban Growth' },
    { icon: Droplets, label: 'Analyze Water Bodies' },
    { icon: Sprout, label: 'Support Agriculture' },
    { icon: ShieldCheck, label: 'Detect Land Changes' },
]

export function LandingAuth({ onEnter }: LandingAuthProps) {
    const [mode, setMode] = useState<'sign-in' | 'create'>('sign-in')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(true)
    const [isDay, setIsDay] = useState(false)

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (email.trim() && password.trim()) onEnter()
    }

    return <main className={`landing-shell ${isDay ? 'day-mode' : ''}`}>
        <OrbitalScene />
        <div className="landing-horizon" aria-hidden="true"><div className="horizon-sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="dish-station"><span /><i /></div></div>
        <div className="landing-noise" />
        <nav className="landing-nav" aria-label="Main navigation">
            <div className="landing-brand"><span className="brand-orbit"><Leaf size={18} /></span><span><strong>Bhoo Drishti <b>AI</b></strong><small>Seeing Today, Safer Tomorrow</small></span></div>
            <div className="landing-links"><a href="#home">Home</a><a href="#about">About</a><a href="#features">Features</a><a href="#impact">Our Impact</a><a href="#contact">Contact</a></div>
            <button className="theme-toggle" type="button" aria-label="Toggle day and night mode" onClick={() => setIsDay((value) => !value)}>{isDay ? <Sun size={15} /> : <Moon size={15} />}<span /></button>
        </nav>
        <section className="landing-content" id="home">
            <div className="landing-copy">
                <p className="landing-kicker"><Leaf size={15} /> AI FOR A SUSTAINABLE INDIA</p>
                <h1>Bhoo<br /><em>Drishti AI</em></h1>
                <p className="landing-tagline">From Space to a Better Tomorrow</p>
                <p className="landing-description">Harnessing satellite data and Artificial Intelligence to monitor land, detect changes, and build a greener, safer and more sustainable India.</p>
                <div className="feature-cards" id="features">{features.map(({ icon: Icon, label }) => <div className="feature-card" key={label}><Icon size={18} /><span>{label}</span></div>)}</div>
                <p className="landing-quote">“Smarter Insights, Healthier Lands, Brighter Tomorrow”</p>
            </div>
            <div className="auth-card">
                <div className="auth-brand"><span className="brand-orbit"><Leaf size={16} /></span><div><strong>Bhoo Drishti <b>AI</b></strong><small>Seeing Today, Safer Tomorrow</small></div></div>
                <div className="auth-card-heading"><strong>{mode === 'sign-in' ? 'Welcome back' : 'Begin your journey'}</strong><p>{mode === 'sign-in' ? 'Continue your view of the changing Earth.' : 'Start reading the signals beneath the surface.'}</p></div>
                <div className="auth-tabs" role="tablist"><button type="button" className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')}>Login</button><button type="button" className={mode === 'create' ? 'active' : ''} onClick={() => setMode('create')}>Sign Up</button></div>
                <form onSubmit={submit}>
                    <label><span>Email ID</span><div className="auth-input"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@organisation.com" required /></div></label>
                    <label><span>Password</span><div className="auth-input"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" minLength={6} required /><button type="button" className="input-action" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
                    <div className="auth-extras"><label className="remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span><Check size={11} /></span>Remember me</label><a href="#forgot">Forgot Password?</a></div>
                    <button className="auth-submit" type="submit">{mode === 'sign-in' ? 'Login' : 'Create account'} <ArrowRight size={17} /></button>
                </form>
                <div className="auth-divider"><span>OR</span></div>
                <div className="social-actions"><button type="button"><span className="google-mark">G</span>Continue with Google</button><button type="button"><Building2 size={16} />Continue with Institution</button></div>
                <p className="auth-note">{mode === 'sign-in' ? 'New here?' : 'Already have an account?'} <button type="button" onClick={() => setMode(mode === 'sign-in' ? 'create' : 'sign-in')}>{mode === 'sign-in' ? 'Create an account' : 'Login here'}</button></p>
            </div>
        </section>
        <footer className="landing-footer"><span><i /> LIVE INDIA SCAN <b>•</b> BUILT FOR A LIVING PLANET</span><span>LAT 22.5° N / LONG 78.0° E <ChevronRight size={13} /></span></footer>
    </main>
}
