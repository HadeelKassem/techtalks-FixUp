import { useMemo, useState } from 'react'
import './App.css'
import ClientProfile from "./components/ClientProfile";

const initialRequests = [
  {
    id: 1,
    client: 'Sarah Haddad',
    provider: 'John Plumbing',
    service: 'Emergency Plumbing Repair',
    date: 'June 28, 2026',
    time: '10:00 AM',
    location: 'Achrafieh, Beirut',
    status: 'Pending',
    notes: 'Kitchen sink is leaking under the cabinet.',
  },
  {
    id: 2,
    client: 'Karim Mansour',
    provider: 'John Plumbing',
    service: 'Pipe Installation',
    date: 'June 29, 2026',
    time: '2:30 PM',
    location: 'Jounieh',
    status: 'Accepted',
    notes: 'Install a water pipe for a washing machine.',
  },
  {
    id: 3,
    client: 'Maya Khoury',
    provider: 'John Plumbing',
    service: 'Bathroom Repair',
    date: 'June 25, 2026',
    time: '11:00 AM',
    location: 'Hazmieh',
    status: 'In Progress',
    notes: 'Replace the bathroom faucet and check the drain.',
  },
  {
    id: 4,
    client: 'Nadine Salameh',
    provider: 'John Plumbing',
    service: 'Water Heater Check',
    date: 'June 19, 2026',
    time: '9:00 AM',
    location: 'Verdun, Beirut',
    status: 'Completed',
    notes: 'Annual water-heater maintenance visit.',
  },
]

const statusSteps = ['Pending', 'Accepted', 'In Progress', 'Completed']

function statusClass(status) {
  return status.toLowerCase().replaceAll(' ', '-')
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${statusClass(status)}`}>{status}</span>
}

function StatusTracker({ status }) {
  if (status === 'Rejected') {
    return (
      <div className="rejected-tracker" role="status">
        <span className="rejected-icon">×</span>
        This request was rejected by the provider.
      </div>
    )
  }

  const currentStep = statusSteps.indexOf(status)

  return (
    <div className="status-tracker" aria-label={`Request status: ${status}`}>
      {statusSteps.map((step, index) => (
        <div className="tracker-item" key={step}>
          <div className={`tracker-dot ${index <= currentStep ? 'is-complete' : ''}`}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={index <= currentStep ? 'tracker-label is-complete' : 'tracker-label'}>
            {step}
          </span>
          {index < statusSteps.length - 1 && (
            <span className={`tracker-line ${index < currentStep ? 'is-complete' : ''}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function RequestDetails({ request }) {
  return (
    <div className="request-details">
      <div>
        <span className="detail-label">Client</span>
        <span>{request.client}</span>
      </div>
      <div>
        <span className="detail-label">Date & time</span>
        <span>{request.date} · {request.time}</span>
      </div>
      <div>
        <span className="detail-label">Location</span>
        <span>{request.location}</span>
      </div>
      <div className="details-notes">
        <span className="detail-label">Client notes</span>
        <span>{request.notes}</span>
      </div>
    </div>
  )
}
/*
function App() {
  const [activeView, setActiveView] = useState('provider')
  const [requests, setRequests] = useState(initialRequests)
  const [expandedRequestId, setExpandedRequestId] = useState(null)

  const updateStatus = (id, status) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    )
    setExpandedRequestId(id)
  }

  const summary = useMemo(() => ({
    pending: requests.filter((request) => request.status === 'Pending').length,
    active: requests.filter((request) => ['Accepted', 'In Progress'].includes(request.status)).length,
    completed: requests.filter((request) => request.status === 'Completed').length,
  }), [requests])

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => setActiveView('provider')}>
          Fix<span>Up</span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <button
            type="button"
            className={activeView === 'provider' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView('provider')}
          >
            Provider Dashboard
          </button>
          <button
            type="button"
            className={activeView === 'history' ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView('history')}
          >
            Request History
          </button>
          <button type="button" className="profile-chip" aria-label="Open provider profile">
            JP
          </button>
        </nav>
      </header>

      {activeView === 'provider' ? (
        <main className="page-wrap">
          <section className="page-heading provider-heading">
            <div>
              <p className="eyebrow">SERVICE PROVIDER DASHBOARD</p>
              <h1>Welcome back, John</h1>
              <p className="subheading">Review client requests and update each job as you work.</p>
            </div>
            <button type="button" className="primary-button">Edit Profile</button>
          </section>

          <section className="summary-grid" aria-label="Request summary">
            <article className="summary-card">
              <span className="summary-icon">◌</span>
              <div><p>New requests</p><strong>{summary.pending}</strong></div>
            </article>
            <article className="summary-card">
              <span className="summary-icon">↻</span>
              <div><p>Active requests</p><strong>{summary.active}</strong></div>
            </article>
            <article className="summary-card">
              <span className="summary-icon">✓</span>
              <div><p>Completed</p><strong>{summary.completed}</strong></div>
            </article>
            <article className="summary-card">
              <span className="summary-icon">★</span>
              <div><p>Average rating</p><strong>4.8</strong></div>
            </article>
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>Manage requests</h2>
                <p>Accept or reject new requests, then move accepted jobs through their status.</p>
              </div>
            </div>

            <div className="request-list">
              {requests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div className="request-card-main">
                    <div className="request-title-row">
                      <div>
                        <p className="service-category">SERVICE REQUEST</p>
                        <h3>{request.service}</h3>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                    <div className="request-meta">
                      <span><b>Client:</b> {request.client}</span>
                      <span><b>When:</b> {request.date} · {request.time}</span>
                      <span><b>Where:</b> {request.location}</span>
                    </div>

                    {expandedRequestId === request.id && <RequestDetails request={request} />}
                  </div>

                  <div className="request-actions">
                    {request.status === 'Pending' && (
                      <>
                        <button type="button" className="primary-button compact" onClick={() => updateStatus(request.id, 'Accepted')}>Accept</button>
                        <button type="button" className="danger-button compact" onClick={() => updateStatus(request.id, 'Rejected')}>Reject</button>
                      </>
                    )}
                    {request.status === 'Accepted' && (
                      <button type="button" className="primary-button compact" onClick={() => updateStatus(request.id, 'In Progress')}>Start Service</button>
                    )}
                    {request.status === 'In Progress' && (
                      <button type="button" className="success-button compact" onClick={() => updateStatus(request.id, 'Completed')}>Mark Completed</button>
                    )}
                    <button
                      type="button"
                      className="secondary-button compact"
                      onClick={() => setExpandedRequestId((currentId) => currentId === request.id ? null : request.id)}
                    >
                      {expandedRequestId === request.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      ) : (
        <main className="page-wrap">
          <section className="page-heading">
            <div>
              <p className="eyebrow">CLIENT DASHBOARD</p>
              <h1>Request History</h1>
              <p className="subheading">Track each service request from submission to completion.</p>
            </div>
            <button type="button" className="primary-button">+ Create Request</button>
          </section>

          <section className="content-section">
            <div className="request-list history-list">
              {requests.map((request) => (
                <article className="history-card" key={request.id}>
                  <div className="request-title-row">
                    <div>
                      <p className="service-category">{request.provider}</p>
                      <h3>{request.service}</h3>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="history-date">Requested for {request.date} at {request.time}</p>
                  <StatusTracker status={request.status} />
                  <button
                    type="button"
                    className="secondary-button compact details-toggle"
                    onClick={() => setExpandedRequestId((currentId) => currentId === request.id ? null : request.id)}
                  >
                    {expandedRequestId === request.id ? 'Hide Details' : 'View Details'}
                  </button>
                  {expandedRequestId === request.id && <RequestDetails request={request} />}
                </article>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  )
}
*/

function App() {
  return <ClientProfile />;
}

export default App;