import { useEffect, useMemo, useState } from 'react'
import { clearSession, getMyBookings, getMyProviderProfile, acceptBooking, denyBooking, providerCompleteBooking } from './api'
import './Providerdashboard.css'
import { useNavigate } from "react-router-dom";

const statusSteps = ['Pending', 'Accepted', 'In Progress', 'Completed']

// Backend enum values ("PENDING", "IN_PROGRESS", ...) -> the display
// strings statusSteps/StatusTracker expect ("Pending", "In Progress", ...).
function toDisplayStatus(rawStatus) {
  const map = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    DENIED: 'Rejected',
    CANCELLED: 'Rejected',
  }
  return map[(rawStatus || '').toUpperCase()] || rawStatus
}

// Reshapes a ServiceRequestResponseDTO into the { client, service, date,
// time, location, notes } shape this page's UI expects.
function toDisplayRequest(booking) {
  return {
    id: booking.id,
    client: booking.clientName,
    provider: booking.providerName,
    service: booking.categoryName,
    date: booking.preferredDate,
    time: booking.createdAt
      ? new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    location: booking.location,
    notes: booking.notes,
    status: toDisplayStatus(booking.status),
  }
}

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

function ProviderDashboard({ onLogout }) {
  const [activeView, setActiveView] = useState('provider')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [expandedRequestId, setExpandedRequestId] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    getMyBookings()
      .then((data) => setRequests(data.map(toDisplayRequest)))
      .catch((err) => setLoadError(err.message || "Couldn't load your requests."))
      .finally(() => setLoading(false))

    getMyProviderProfile()
      .then(setProfile)
      .catch(() => {
        // Non-fatal — the chip/header just falls back to defaults below.
      })
  }, [])

  const runAction = async (id, action) => {
    setBusyId(id)
    try {
      const updated = await action(id)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? toDisplayRequest(updated) : r))
      )
      setExpandedRequestId(id)
    } catch (err) {
      alert(err.message || 'That action failed. Please try again.')
    } finally {
      setBusyId(null)
    }
  }

  const summary = useMemo(() => ({
    pending: requests.filter((request) => request.status === 'Pending').length,
    active: requests.filter((request) => ['Accepted', 'In Progress'].includes(request.status)).length,
    completed: requests.filter((request) => request.status === 'Completed').length,
  }), [requests])

  const handleLogout = () => {
    clearSession()
    onLogout?.()
  }

  const chipContent = profile?.profilePictureUrl ? (
    <img src={profile.profilePictureUrl} alt="" className="profile-chip-img" />
  ) : (
    profile?.name?.slice(0, 2)?.toUpperCase() || 'JP'
  )

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
<button
  type="button"
  className="nav-link"
  onClick={() => navigate("/provider/chat")}
>
  Chat
</button>

<button
  type="button"
  className="nav-link"
  onClick={() => navigate("/provider/live-location")}
>
  Live Location
</button>
          <div className="profile-menu-wrap">
            <button
              type="button"
              className="profile-chip"
              aria-label="Open provider profile"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {chipContent}
            </button>
            {menuOpen && (
              <div className="profile-menu">
                <button type="button" onClick={handleLogout}>Log out</button>
                <button type="button" onClick={()=>{setMenuOpen(false); navigate("/provider/profile");}}>Profile</button>

              </div>
            )}
          </div>
        </nav>
      </header>

      {activeView === 'provider' ? (
        <main className="page-wrap">
          <section className="page-heading provider-heading">
            <div>
              <p className="eyebrow">SERVICE PROVIDER DASHBOARD</p>
              <h1>Welcome back{profile?.name ? `, ${profile.name}` : ''}</h1>
              <p className="subheading">Review client requests and update each job as you work.</p>
            </div>
            <button type="button" className="primary-button" onClick={() => navigate('/provider/profile')}>
              Edit Profile
            </button>
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
              <div><p>Average rating</p><strong>{profile?.avgRating?.toFixed?.(1) ?? '—'}</strong></div>
            </article>
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <h2>Manage requests</h2>
                <p>Accept or reject new requests, then confirm once a job is done.</p>
              </div>
            </div>

            {loading && <p className="subheading">Loading your requests…</p>}
            {loadError && <p className="subheading">{loadError}</p>}
            {!loading && !loadError && requests.length === 0 && (
              <p className="subheading">No requests yet.</p>
            )}

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
                        <button
                          type="button"
                          className="primary-button compact"
                          disabled={busyId === request.id}
                          onClick={() => runAction(request.id, acceptBooking)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="danger-button compact"
                          disabled={busyId === request.id}
                          onClick={() => runAction(request.id, denyBooking)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(request.status === 'Accepted' || request.status === 'In Progress') && (
                      <button
                        type="button"
                        className="success-button compact"
                        disabled={busyId === request.id}
                        onClick={() => runAction(request.id, providerCompleteBooking)}
                      >
                        Mark Completed
                      </button>
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
              <p className="eyebrow">REQUEST HISTORY</p>
              <h1>Request History</h1>
              <p className="subheading">Track each service request from submission to completion.</p>
            </div>
          </section>

          <section className="content-section">
            <div className="request-list history-list">
              {requests.map((request) => (
                <article className="history-card" key={request.id}>
                  <div className="request-title-row">
                    <div>
                      <p className="service-category">{request.client}</p>
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

export default ProviderDashboard