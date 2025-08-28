import Link from 'next/link';
import { Zap, Target, RadioTower } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <main>
        {/* 1. Hero Section */}
        <header className="hero">
          <h1 className="hero__title">Redefining Drone Command & Control</h1>
          <p className="hero__subtitle">
            An integrated platform for autonomous systems, delivering unparalleled situational awareness and operational superiority.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/commander" className="btn btn--primary">View Platform</Link>
            <Link href="/planner" className="btn btn--secondary">Plan a Mission</Link>
          </div>
        </header>

        {/* 2. Credibility Section */}
        <section className="section section--darker section--centered">
          <div className="container">
            <p className="text-muted text-uppercase" style={{ marginBottom: '2rem' }}>Trusted by leaders in aerospace & defense</p>
            <div className="logos">
              <span className="logos__item">LOGO ONE</span>
              <span className="logos__item">LOGO TWO</span>
              <span className="logos__item">LOGO THREE</span>
              <span className="logos__item">LOGO FOUR</span>
            </div>
          </div>
        </section>

        {/* 3. Core Capabilities */}
        <section className="section">
          <div className="container">
            <div className="grid grid--3-col">
              <div className="card">
                <Zap size={32} color="#00E3B2" />
                <h3 className="card__title" style={{ marginTop: '1rem' }}>Multi-Drone Ops</h3>
                <p className="card__body">Coordinate complex missions with simultaneous control over heterogeneous fleets.</p>
              </div>
              <div className="card">
                <Target size={32} color="#00E3B2" />
                <h3 className="card__title" style={{ marginTop: '1rem' }}>AI-Powered Mission Planning</h3>
                <p className="card__body">Generate optimal routes and strategies with our predictive analytics engine.</p>
              </div>
              <div className="card">
                <RadioTower size={32} color="#00E3B2" />
                <h3 className="card__title" style={{ marginTop: '1rem' }}>Secure, Live Telemetry</h3>
                <p className="card__body">Maintain end-to-end encrypted data streams with real-time asset monitoring.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. System Visualization Banner */}
        <section className="section section--dark">
          <div className="container section--centered">
            <h2 className="section-title" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>Mission Awareness. In Real Time.</h2>
            <div style={{ height: '300px', border: '1px solid #2A3240', background: '#0A0D12', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              <p className="text-muted">[Cinematic Tactical Map Visualization]</p>
            </div>
          </div>
        </section>

        {/* 5. Core Interfaces */}
        <section className="section">
          <div className="container">
            <h2 className="section-title">Core Interfaces</h2>
            <div className="grid grid--4-col">
              <Link href="/commander" className="card-link">
                <div className="card">
                  <h4 className="card__title">Commander View</h4>
                  <p className="card__body">Top-level strategic oversight and decision-making.</p>
                </div>
              </Link>
              <Link href="/operator" className="card-link">
                <div className="card">
                  <h4 className="card__title">Operator View</h4>
                  <p className="card__body">Direct control and real-time telemetry for individual assets.</p>
                </div>
              </Link>
              <Link href="/planner" className="card-link">
                <div className="card">
                  <h4 className="card__title">Planner View</h4>
                  <p className="card__body">Design, simulate, and assign complex mission plans.</p>
                </div>
              </Link>
              <Link href="/analyst" className="card-link">
                <div className="card">
                  <h4 className="card__title">Analyst View</h4>
                  <p className="card__body">Fuse and analyze multi-source intelligence data.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Case Studies */}
        <section className="section section--dark">
           <div className="container">
            <h2 className="section-title">Proven in the Field</h2>
            <div className="grid grid--3-col">
                <div className="card" style={{ alignItems: 'flex-end', display: 'flex', minHeight: '300px' }}>
                  <h4 className="card__title">Border Surveillance</h4>
                </div>
                <div className="card" style={{ alignItems: 'flex-end', display: 'flex', minHeight: '300px' }}>
                  <h4 className="card__title">Disaster Response</h4>
                </div>
                <div className="card" style={{ alignItems: 'flex-end', display: 'flex', minHeight: '300px' }}>
                  <h4 className="card__title">Urban Operations</h4>
                </div>
            </div>
           </div>
        </section>

        {/* 7. Call-to-Action Section */}
        <section className="section section--centered">
          <h2 style={{ fontSize: '48px', fontWeight: 800, lineHeight: '1.1', marginBottom: '2rem', textTransform: 'uppercase' }}>Command the Future.</h2>
          <Link href="/demo" className="btn btn--primary" style={{ padding: '20px 48px', fontSize: '18px' }}>Request a Demo</Link>
        </section>
      </main>

      {/* 8. Footer */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid #2A3240', color: '#9AA0AF' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <p>&copy; {new Date().getFullYear()} Eidryon Systems, Inc.</p>
          <p>Global HQ: San Francisco, CA</p>
          <p>ITAR & CMMC Compliant</p>
        </div>
      </footer>
    </>
  );
}
