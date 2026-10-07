import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  HiOutlineViewGrid, HiOutlineLightningBolt, HiOutlineUsers,
  HiOutlineChatAlt2, HiOutlineClock, HiOutlineChartBar, HiOutlineCog,
  HiOutlineQuestionMarkCircle, HiOutlineBell, HiOutlineRefresh,
  HiOutlineSearch, HiOutlineFilter, HiOutlinePlus, HiOutlineX,
  HiOutlineMenu, HiOutlineChevronDown, HiOutlineDotsHorizontal,
  HiOutlineExternalLink, HiOutlineMail, HiOutlinePaperAirplane,
  HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlineCalendar,
  HiOutlineAdjustments, HiOutlineSparkles, HiOutlineCheckCircle,
  HiOutlineExclamation, HiOutlineTrendingUp, HiOutlineTrendingDown,
  HiOutlineSun, HiOutlineMoon
} from "react-icons/hi";
import { BsRobot, BsStars, BsBullseye } from "react-icons/bs";
import { RiSparklingFill } from "react-icons/ri";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

/* ═══════════════════ Demo Data ═══════════════════ */

const campaignsSeed = [
  {
    id: "CMP-001", name: "Series-A SaaS Founders — India",
    status: "Active", leads: 1247, sent: 893, opens: 412, replies: 87, bounces: 12,
    reputation: 96, updated: "Today, 10:42 AM",
    description: "Targeting bootstrapped-to-Series A SaaS founders in Bengaluru, Mumbai and Delhi NCR"
  },
  {
    id: "CMP-002", name: "FinTech CFOs & Decision Makers",
    status: "Active", leads: 834, sent: 561, opens: 248, replies: 52, bounces: 9,
    reputation: 97, updated: "Today, 09:15 AM",
    description: "Senior finance executives at high-growth fintech companies across APAC"
  },
  {
    id: "CMP-003", name: "US Enterprise Marketing VPs",
    status: "Active", leads: 672, sent: 423, opens: 189, replies: 38, bounces: 11,
    reputation: 94, updated: "Today, 08:30 AM",
    description: "VP Marketing and CMOs at mid-market to enterprise B2B companies in the US"
  },
  {
    id: "CMP-004", name: "European HR Tech Leaders",
    status: "Paused", leads: 456, sent: 312, opens: 134, replies: 24, bounces: 7,
    reputation: 93, updated: "Yesterday, 4:20 PM",
    description: "CHRO and HR Directors evaluating people analytics platforms in EU/UK"
  },
  {
    id: "CMP-005", name: "DevTool Startup CTOs — Global",
    status: "Active", leads: 389, sent: 267, opens: 121, replies: 31, bounces: 5,
    reputation: 98, updated: "Yesterday, 2:10 PM",
    description: "CTOs and VP Engineering at seed-to-Series B developer tool companies"
  },
  {
    id: "CMP-006", name: "Healthcare AI — North America",
    status: "Draft", leads: 0, sent: 0, opens: 0, replies: 0, bounces: 0,
    reputation: 100, updated: "2 days ago",
    description: "Healthcare AI/ML product leaders at hospitals and health systems"
  }
];

const leadsSeed = [
  { id: 1, name: "Priya Venkatesh", company: "ScalePilot", role: "Co-founder & CEO", email: "priya@scalepilot.io", status: "Interested", next: "Today, 4:30 PM", campaign: "Series-A SaaS Founders — India", avatar: "PV" },
  { id: 2, name: "Rahul Mehta", company: "FinEdge Capital", role: "VP Growth & Strategy", email: "rahul.mehta@finedge.com", status: "Follow-up", next: "Today, 6:00 PM", campaign: "FinTech CFOs & Decision Makers", avatar: "RM" },
  { id: 3, name: "Sarah Mitchell", company: "MarketFlow Inc.", role: "VP of Marketing", email: "sarah.mitchell@marketflow.com", status: "Genuine Reply", next: "Tomorrow, 10:00 AM", campaign: "US Enterprise Marketing VPs", avatar: "SM" },
  { id: 4, name: "Vikram Rao", company: "CloudNest AI", role: "Co-founder & CTO", email: "vikram@cloudnest.ai", status: "Contacted", next: "Oct 12, 2:00 PM", campaign: "Series-A SaaS Founders — India", avatar: "VR" },
  { id: 5, name: "Emily Chen", company: "TalentGrid", role: "Chief People Officer", email: "emily.chen@talentgrid.co", status: "Not Interested", next: "—", campaign: "European HR Tech Leaders", avatar: "EC" },
  { id: 6, name: "Arjun Nair", company: "DataPulse Analytics", role: "Founder & CEO", email: "arjun@datapulse.in", status: "Out of Office", next: "Oct 15, 11:00 AM", campaign: "Series-A SaaS Founders — India", avatar: "AN" },
  { id: 7, name: "James O'Brien", company: "Nexus DevTools", role: "CTO", email: "james@nexusdev.io", status: "Interested", next: "Today, 3:00 PM", campaign: "DevTool Startup CTOs — Global", avatar: "JO" },
  { id: 8, name: "Aisha Patel", company: "FinSure Tech", role: "CFO", email: "aisha.patel@finsure.com", status: "Follow-up", next: "Tomorrow, 11:30 AM", campaign: "FinTech CFOs & Decision Makers", avatar: "AP" }
];

const repliesSeed = [
  { name: "Priya Venkatesh", company: "ScalePilot", type: "Genuine", preview: "This looks really promising. Can you send over the case study and pricing tiers? I'd love to discuss how this could fit into our current growth stack.", time: "12 min ago", confidence: 98 },
  { name: "Sarah Mitchell", company: "MarketFlow Inc.", type: "Genuine", preview: "Happy to learn more. Our team is evaluating solutions in this space. Let's set up a 30-min call next week — Thursday afternoon works best for me.", time: "41 min ago", confidence: 96 },
  { name: "James O'Brien", company: "Nexus DevTools", type: "Genuine", preview: "Interesting approach. We've been looking for something like this to streamline our outbound. Can you share a quick demo recording?", time: "58 min ago", confidence: 94 },
  { name: "Emily Chen", company: "TalentGrid", type: "Not Interested", preview: "Appreciate the outreach, but we recently signed a 2-year contract with another vendor. Perhaps we can reconnect when our agreement is up for renewal.", time: "1 hr ago", confidence: 99 },
  { name: "Arjun Nair", company: "DataPulse Analytics", type: "Out of Office", preview: "Thank you for your email. I'm currently out of office until October 15 with limited connectivity. I'll get back to you upon my return.", time: "2 hrs ago", confidence: 99 },
  { name: "Aisha Patel", company: "FinSure Tech", type: "Genuine", preview: "We're in the middle of budget planning for Q1 next year. This could be a great fit. Can you send me a one-pager I can share with my team?", time: "3 hrs ago", confidence: 92 }
];

const eventsSeed = [
  { time: "10:42 AM", event: "Reply received", detail: "Priya Venkatesh (ScalePilot) replied to sequence step 2 — classified as Genuine", kind: "success" },
  { time: "10:35 AM", event: "Follow-up scheduled", detail: "Rahul Mehta → automated follow-up queued for today at 6:00 PM", kind: "info" },
  { time: "10:21 AM", event: "Bounce prevented", detail: "Invalid address detected and removed from sender pool before delivery", kind: "warning" },
  { time: "09:58 AM", event: "Batch delivered", detail: "127 messages delivered successfully across 3 campaigns with 99.2% deliverability", kind: "success" },
  { time: "09:45 AM", event: "New leads enriched", detail: "42 new prospects enriched with LinkedIn data and verified email addresses", kind: "success" },
  { time: "09:15 AM", event: "Reputation check", detail: "All sender domains passed SPF/DKIM/DMARC — sender pool health: 96/100", kind: "info" },
  { time: "08:50 AM", event: "AI optimization", detail: "Subject line A/B test concluded: Variant B showed 23% higher open rate", kind: "info" }
];

const navItems = [
  ["dashboard",  "Dashboard",           HiOutlineViewGrid],
  ["campaigns",  "Campaigns",           BsBullseye],
  ["leads",      "Leads",               HiOutlineUsers],
  ["replies",    "Replies & Reputation", HiOutlineChatAlt2],
  ["followups",  "Follow-ups",          HiOutlineClock],
  ["analytics",  "Analytics",           HiOutlineChartBar]
];

/* ═══════════════════ App ═══════════════════ */

function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaigns, setCampaigns] = useState(campaignsSeed);
  const [leads, setLeads] = useState(leadsSeed);
  const [replies, setReplies] = useState(repliesSeed);
  const [events, setEvents] = useState(eventsSeed);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("apios-theme");
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("apios-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }, []);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const addCampaign = (data) => {
    const newCampaign = {
      id: `CMP-${String(campaigns.length + 1).padStart(3, "0")}`,
      name: data.name,
      status: "Draft",
      leads: 0, sent: 0, opens: 0, replies: 0, bounces: 0, reputation: 100,
      updated: "Just now",
      description: data.offer || "New campaign"
    };
    setCampaigns([newCampaign, ...campaigns]);
    setShowCreate(false);
    notify("Campaign created successfully as draft.");
    setPage("campaigns");
  };

  const pauseCampaign = (id) => {
    setCampaigns(campaigns.map(c =>
      c.id === id
        ? { ...c, status: c.status === "Active" ? "Paused" : "Active", updated: "Just now" }
        : c
    ));
    notify("Campaign status updated.");
  };

  const refresh = () => {
    setEvents([
      { time: "Just now", event: "Dashboard refreshed", detail: "All data synced — latest metrics loaded", kind: "success" },
      ...events
    ]);
    notify("Dashboard refreshed with latest data.");
  };

  return (
    <div className="app-shell">
      {/* ─── Sidebar ─── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><RiSparklingFill /></div>
          <div>
            <strong>APIOS</strong>
            <span>Outreach Intelligence</span>
          </div>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)}>
            <HiOutlineX />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">A</div>
          <div>
            <b>APIOS Workspace</b>
            <small>Pro Plan • 3 members</small>
          </div>
          <HiOutlineChevronDown className="muted" />
        </div>

        <nav>
          <div className="nav-label">Workspace</div>
          {navItems.map(([key, label, Icon]) => (
            <button
              key={key}
              className={`nav-item ${page === key ? "active" : ""}`}
              onClick={() => { setPage(key); setSidebarOpen(false); }}
            >
              <Icon className="nav-icon" />
              <span>{label}</span>
              {key === "replies" && <span className="nav-badge">{replies.filter(r => !r.handled).length}</span>}
            </button>
          ))}

          <div className="nav-label nav-gap">System</div>
          <button className="nav-item" onClick={() => notify("Settings module is ready for integration.", "success")}>
            <HiOutlineCog className="nav-icon" />
            <span>Settings</span>
          </button>
          <button className="nav-item" onClick={() => notify("Documentation portal coming soon.", "success")}>
            <HiOutlineQuestionMarkCircle className="nav-icon" />
            <span>Help & Docs</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-health">
            <span className="health-dot" />
            All systems operational
          </div>
          <div className="user-card">
            <div className="user-avatar">U</div>
            <div><b>APIOS User</b><small>Workspace Admin</small></div>
            <HiOutlineDotsHorizontal className="more-icon" />
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ─── Main ─── */}
      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn mobile-menu" onClick={() => setSidebarOpen(true)}>
              <HiOutlineMenu />
            </button>
            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{navItems.find(x => x[0] === page)?.[1]}</strong>
            </div>
          </div>
          <div className="top-actions">
            <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
            </button>
            <button className="icon-btn" title="Refresh data" onClick={refresh}>
              <HiOutlineRefresh />
            </button>
            <button className="icon-btn notification">
              <HiOutlineBell />
              <span className="notification-dot" />
            </button>
            <div className="top-user">U</div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <Dashboard campaigns={campaigns} leads={leads} events={events}
              onCreate={() => setShowCreate(true)} onPage={setPage} />
          )}
          {page === "campaigns" && (
            <Campaigns campaigns={campaigns} onCreate={() => setShowCreate(true)}
              onToggle={pauseCampaign} notify={notify} />
          )}
          {page === "leads" && (
            <Leads leads={leads} setLeads={setLeads} campaigns={campaigns} notify={notify} />
          )}
          {page === "replies" && (
            <Replies replies={replies} setReplies={setReplies} notify={notify} />
          )}
          {page === "followups" && (
            <Followups leads={leads} notify={notify} />
          )}
          {page === "analytics" && (
            <Analytics campaigns={campaigns} events={events} />
          )}
        </div>
      </main>

      {showCreate && <CreateCampaign onClose={() => setShowCreate(false)} onCreate={addCampaign} />}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <HiOutlineCheckCircle className="toast-icon" size={18} />
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ Sub-Components ═══════════════════ */

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Metric({ label, value, trend, up, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className="metric-icon">{icon}</div>
        <span className={up ? "trend up" : "trend down"}>
          {up ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />} {trend}
        </span>
      </div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Funnel({ label, value, width }) {
  return (
    <div className="funnel-item">
      <div className="funnel-label"><span>{label}</span><b>{value.toLocaleString()}</b></div>
      <div className="funnel-track"><div style={{ width }} /></div>
    </div>
  );
}

function PanelHeader({ title, action }) {
  return <div className="panel-header"><h2>{title}</h2>{action}</div>;
}

function StatusBadge({ status }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status ${cls}`}>{status}</span>;
}

/* ═══════════════════ Dashboard ═══════════════════ */

function Dashboard({ campaigns, leads, events, onCreate, onPage }) {
  const total = campaigns.reduce((a, c) => a + c.leads, 0);
  const sent = campaigns.reduce((a, c) => a + c.sent, 0);
  const opens = campaigns.reduce((a, c) => a + c.opens, 0);
  const repliesCount = campaigns.reduce((a, c) => a + c.replies, 0);
  const bounces = campaigns.reduce((a, c) => a + c.bounces, 0);
  const replyRate = sent ? ((repliesCount / sent) * 100).toFixed(1) : "0.0";
  const openRate = sent ? ((opens / sent) * 100).toFixed(1) : "0.0";

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Good morning 👋"
        description="Here's a real-time snapshot of your outreach workspace performance."
        action={
          <button className="primary-btn" onClick={onCreate}>
            <HiOutlinePlus size={16} /> New Campaign
          </button>
        }
      />

      <div className="metric-grid">
        <Metric label="Total Prospects" value={total.toLocaleString()} trend="+14.2%" up icon={<HiOutlineUsers />} />
        <Metric label="Emails Delivered" value={sent.toLocaleString()} trend="+9.7%" up icon={<HiOutlinePaperAirplane />} />
        <Metric label="Open Rate" value={`${openRate}%`} trend="+3.1%" up icon={<HiOutlineMail />} />
        <Metric label="Reply Rate" value={`${replyRate}%`} trend="+1.8%" up icon={<HiOutlineChatAlt2 />} />
        <Metric label="Bounce Rate" value={`${sent ? ((bounces / sent) * 100).toFixed(1) : "0.0"}%`} trend="-0.4%" up icon={<HiOutlineShieldCheck />} />
      </div>

      <div className="grid-2 dashboard-main">
        <section className="panel">
          <PanelHeader
            title="Campaign Performance"
            action={
              <button className="text-btn" onClick={() => onPage("campaigns")}>
                View all <FiArrowUpRight size={14} />
              </button>
            }
          />
          <div className="chart-wrap">
            <div className="chart-legend">
              <span><i /> Delivered</span>
              <span><i /> Opened</span>
              <span><i /> Replied</span>
            </div>
            <div className="bar-chart">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div className="bar-col" key={d}>
                  <div className="bars">
                    <span style={{ height: [58, 74, 68, 92, 78, 45, 71][i] + "%" }} />
                    <span style={{ height: [32, 46, 39, 58, 52, 26, 44][i] + "%" }} />
                    <span style={{ height: [12, 17, 16, 26, 20, 10, 18][i] + "%" }} />
                  </div>
                  <small>{d}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <PanelHeader title="Outreach Funnel" />
          <div className="funnel">
            <Funnel label="Prospects" value={total} width="100%" />
            <Funnel label="Delivered" value={sent} width={`${Math.round(sent / total * 100)}%`} />
            <Funnel label="Opened" value={opens} width={`${Math.round(opens / total * 100)}%`} />
            <Funnel label="Replied" value={repliesCount} width={`${Math.round(repliesCount / total * 100)}%`} />
          </div>
          <div className="funnel-note">
            <span className="health-dot" /> Reply conversion is trending upward — +18% vs last week
          </div>
        </section>
      </div>

      <div className="grid-2 lower-grid">
        <section className="panel">
          <PanelHeader
            title="Active Campaigns"
            action={<button className="text-btn" onClick={() => onPage("campaigns")}>Manage</button>}
          />
          <div className="campaign-mini-list">
            {campaigns.filter(c => c.status === "Active").slice(0, 4).map(c => (
              <div className="campaign-row" key={c.id}>
                <div className="campaign-icon"><BsBullseye /></div>
                <div className="grow">
                  <b>{c.name}</b>
                  <small>{c.leads.toLocaleString()} leads • {c.sent.toLocaleString()} sent • {c.opens.toLocaleString()} opens</small>
                </div>
                <StatusBadge status={c.status} />
                <span className="score">{c.reputation}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Recent Activity"
            action={<button className="text-btn" onClick={() => onPage("analytics")}>All activity</button>}
          />
          <div className="activity-list">
            {events.slice(0, 5).map((e, i) => (
              <div className="activity" key={i}>
                <div className={`event-icon ${e.kind}`}>
                  {e.kind === "success" ? <HiOutlineCheckCircle /> :
                   e.kind === "warning" ? <HiOutlineExclamation /> :
                   <HiOutlineLightningBolt />}
                </div>
                <div className="grow">
                  <b>{e.event}</b>
                  <small>{e.detail}</small>
                </div>
                <time>{e.time}</time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════ Campaigns ═══════════════════ */

function Campaigns({ campaigns, onCreate, onToggle, notify }) {
  const [search, setSearch] = useState("");
  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Campaigns"
        description="Create, monitor and manage your personalized outreach campaigns with AI-powered optimization."
        action={
          <button className="primary-btn" onClick={onCreate}>
            <HiOutlinePlus size={16} /> New Campaign
          </button>
        }
      />
      <section className="panel">
        <div className="toolbar">
          <div className="searchbox">
            <HiOutlineSearch size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." />
          </div>
          <button className="secondary-btn">
            <HiOutlineFilter size={15} /> Filter
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Campaign</th><th>Status</th><th>Leads</th><th>Sent</th>
                <th>Open Rate</th><th>Replies</th><th>Reputation</th><th>Updated</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="table-primary">
                      <div className="campaign-icon"><BsBullseye /></div>
                      <div>
                        <b>{c.name}</b>
                        <small>{c.id} • {c.description?.slice(0, 50)}...</small>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{c.leads.toLocaleString()}</td>
                  <td>{c.sent.toLocaleString()}</td>
                  <td>{c.sent ? Math.round(c.opens / c.sent * 100) + "%" : "—"}</td>
                  <td>{c.replies}</td>
                  <td><span className="reputation">{c.reputation}/100</span></td>
                  <td className="muted">{c.updated}</td>
                  <td>
                    <button className="row-action" onClick={() => { onToggle(c.id); }}>
                      {c.status === "Active" ? "Pause" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════ Leads ═══════════════════ */

function Leads({ leads, setLeads, campaigns, notify }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const statuses = ["All", "Interested", "Follow-up", "Genuine Reply", "Contacted", "Not Interested", "Out of Office"];

  const filtered = leads.filter(l =>
    (l.name + l.company + l.email).toLowerCase().includes(query.toLowerCase()) &&
    (status === "All" || l.status === status)
  );

  const cycleStatus = (id) => {
    const order = ["Contacted", "Follow-up", "Interested", "Genuine Reply", "Not Interested"];
    setLeads(leads.map(l =>
      l.id === id
        ? { ...l, status: order[(order.indexOf(l.status) + 1) % order.length] }
        : l
    ));
    notify("Lead status updated.");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Prospects"
        title="Lead Management"
        description="Track prospect status, campaign membership, and schedule next actions with AI-driven insights."
      />
      <section className="panel">
        <div className="toolbar">
          <div className="searchbox">
            <HiOutlineSearch size={16} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, company or email..." />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="secondary-btn">
            <HiOutlineAdjustments size={15} /> Advanced
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr><th>Lead</th><th>Company / Role</th><th>Status</th><th>Campaign</th><th>Next Action</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <div className="lead-cell">
                      <div className="person-avatar">{l.avatar || l.name[0]}</div>
                      <div><b>{l.name}</b><small>{l.email}</small></div>
                    </div>
                  </td>
                  <td><b>{l.company}</b><small>{l.role}</small></td>
                  <td><StatusBadge status={l.status} /></td>
                  <td className="muted">{l.campaign}</td>
                  <td>
                    <span className="next-action">
                      <HiOutlineCalendar size={14} /> {l.next}
                    </span>
                  </td>
                  <td>
                    <button className="row-action" onClick={() => cycleStatus(l.id)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="small-note">
        <BsRobot size={15} /> Lead data syncs in real-time with your CRM and enrichment pipeline.
      </div>
    </div>
  );
}

/* ═══════════════════ Replies ═══════════════════ */

function Replies({ replies, setReplies, notify }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Genuine", "Not Interested", "Out of Office"];
  const visible = replies.filter(r => filter === "All" || r.type === filter);

  const markHandled = (name) => {
    setReplies(replies.map(r => r.name === name ? { ...r, handled: true } : r));
    notify("Reply marked as handled.");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Reputation"
        title="Replies & Reputation"
        description="Review AI-classified inbound replies and monitor sender reputation health."
      />

      <div className="reputation-banner">
        <div className="reputation-big">
          <HiOutlineShieldCheck size={28} className="rep-icon" />
          <div>
            <small>Overall Sender Reputation</small>
            <strong>96<span>/100</span></strong>
          </div>
        </div>
        <div className="rep-stat">
          <span>Delivery Health</span>
          <b>99.1%</b>
        </div>
        <div className="rep-stat">
          <span>Bounce Rate</span>
          <b>1.2%</b>
        </div>
        <div className="rep-stat">
          <span>Spam Complaints</span>
          <b>0.1%</b>
        </div>
      </div>

      <section className="panel">
        <div className="tabs">
          {filters.map(f => (
            <button className={filter === f ? "tab active" : "tab"} key={f} onClick={() => setFilter(f)}>
              {f}
              <span>{f === "All" ? replies.length : replies.filter(r => r.type === f).length}</span>
            </button>
          ))}
        </div>
        <div className="reply-list">
          {visible.map(r => (
            <div className={`reply-card ${r.handled ? "handled" : ""}`} key={r.name}>
              <div className="person-avatar">{r.name[0]}</div>
              <div className="reply-main">
                <div className="reply-head">
                  <div>
                    <b>{r.name}</b>
                    <span>{r.company}</span>
                  </div>
                  <div>
                    <span className={`reply-type ${r.type.toLowerCase().replaceAll(" ", "-")}`}>{r.type}</span>
                    <time>{r.time}</time>
                  </div>
                </div>
                <p>{r.preview}</p>
                <div className="reply-foot">
                  <span>AI Confidence <b>{r.confidence}%</b></span>
                  <span className="ai-tag"><BsStars size={13} /> Claude Classification</span>
                  {!r.handled && (
                    <button className="row-action" onClick={() => markHandled(r.name)}>Mark handled</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════ Follow-ups ═══════════════════ */

function Followups({ leads, notify }) {
  const pending = leads.filter(l =>
    l.status === "Follow-up" || l.status === "Out of Office" || l.status === "Interested"
  );

  return (
    <div>
      <PageHeader
        eyebrow="Automation"
        title="Follow-up Queue"
        description="Leads awaiting the next automated action based on AI reply classification and optimal timing."
        action={
          <button className="secondary-btn" onClick={() => notify("Follow-up orchestration powered by n8n + Claude AI.")}>
            <BsRobot size={15} /> Strategy Status
          </button>
        }
      />

      <div className="metric-grid follow-metrics">
        <Metric label="Due Today" value="12" trend="+3" up icon={<HiOutlineClock />} />
        <Metric label="Scheduled This Week" value="38" trend="+8" up icon={<HiOutlineCalendar />} />
        <Metric label="Paused / Waiting" value="5" trend="-2" up icon={<HiOutlineClock />} />
      </div>

      <section className="panel">
        <PanelHeader title="Next Actions" />
        <div className="follow-list">
          {pending.map(l => (
            <div className="follow-row" key={l.id}>
              <div className="person-avatar">{l.avatar || l.name[0]}</div>
              <div className="grow">
                <b>{l.name}</b>
                <small>{l.company} • {l.role}</small>
              </div>
              <StatusBadge status={l.status} />
              <div className="follow-time">
                <HiOutlineCalendar size={14} />
                <b>{l.next}</b>
              </div>
              <button className="row-action" onClick={() => notify(`Follow-up for ${l.name} opened.`)}>Open</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════ Analytics ═══════════════════ */

function Analytics({ campaigns, events }) {
  const totalSent = campaigns.reduce((a, c) => a + c.sent, 0);
  const totalOpen = campaigns.reduce((a, c) => a + c.opens, 0);
  const totalReply = campaigns.reduce((a, c) => a + c.replies, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Deep-dive into performance trends across deliverability, engagement, and sender reputation."
        action={
          <button className="secondary-btn">
            <HiOutlineDocumentText size={15} /> Export Report
          </button>
        }
      />

      <div className="metric-grid">
        <Metric label="Delivery Rate" value="98.8%" trend="+1.4%" up icon={<HiOutlinePaperAirplane />} />
        <Metric label="Open Rate" value={`${totalSent ? Math.round(totalOpen / totalSent * 100) : 0}%`} trend="+3.1%" up icon={<HiOutlineMail />} />
        <Metric label="Reply Rate" value={`${totalSent ? Math.round(totalReply / totalSent * 100) : 0}%`} trend="+1.8%" up icon={<HiOutlineChatAlt2 />} />
        <Metric label="Sender Reputation" value="96/100" trend="+4" up icon={<HiOutlineShieldCheck />} />
        <Metric label="Active Campaigns" value={campaigns.filter(c => c.status === "Active").length} trend="+2" up icon={<BsBullseye />} />
      </div>

      <div className="grid-2">
        <section className="panel">
          <PanelHeader title="Sender Performance" />
          <div className="sender-table">
            {campaigns.filter(c => c.sent > 0).map(c => (
              <div className="sender-row" key={c.id}>
                <div className="campaign-icon"><HiOutlinePaperAirplane /></div>
                <div className="grow">
                  <b>{c.name}</b>
                  <small>{c.sent.toLocaleString()} sent • {c.opens.toLocaleString()} opened • {c.replies} replied</small>
                </div>
                <div className="progress">
                  <span style={{ width: c.reputation + "%" }} />
                </div>
                <b>{c.reputation}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader title="Event Stream" />
          <div className="activity-list">
            {events.map((e, i) => (
              <div className="activity" key={i}>
                <div className={`event-icon ${e.kind}`}>
                  {e.kind === "success" ? <HiOutlineCheckCircle /> :
                   e.kind === "warning" ? <HiOutlineExclamation /> :
                   <HiOutlineLightningBolt />}
                </div>
                <div className="grow">
                  <b>{e.event}</b>
                  <small>{e.detail}</small>
                </div>
                <time>{e.time}</time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ═══════════════════ Create Campaign Modal ═══════════════════ */

function CreateCampaign({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "", industry: "SaaS", offer: "", limit: "50", timezone: "Recipient local time"
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onCreate(form);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">New Campaign</span>
            <h2>Create Campaign</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><HiOutlineX /></button>
        </div>
        <form onSubmit={submit}>
          <label>
            Campaign Name
            <input required value={form.name} onChange={e => update("name", e.target.value)}
              placeholder="e.g. Series-A SaaS Founders — India" />
          </label>

          <div className="form-grid">
            <label>
              Industry / ICP
              <select value={form.industry} onChange={e => update("industry", e.target.value)}>
                <option>SaaS</option><option>FinTech</option><option>Marketing</option>
                <option>HR Tech</option><option>Healthcare</option><option>DevTools</option>
                <option>E-commerce</option>
              </select>
            </label>
            <label>
              Daily Send Limit
              <input type="number" min="1" value={form.limit} onChange={e => update("limit", e.target.value)} />
            </label>
          </div>

          <label>
            Offer / Value Proposition
            <textarea rows="3" value={form.offer} onChange={e => update("offer", e.target.value)}
              placeholder="Describe the value you're offering this ICP segment..." />
          </label>

          <label>
            Scheduling
            <select value={form.timezone} onChange={e => update("timezone", e.target.value)}>
              <option>Recipient local time</option>
              <option>Sender local time</option>
              <option>Custom schedule</option>
            </select>
          </label>

          <div className="modal-note">
            <BsRobot size={16} />
            Research, copywriting, deliverability checks and AI orchestration are handled automatically.
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button className="primary-btn" type="submit">
              <HiOutlinePlus size={15} /> Create Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;