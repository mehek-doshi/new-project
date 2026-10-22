/* Sample content for Tech Radar (Neuleap). */
window.TR_DATA = {
  user: { name: "Mehek Doshi", email: "mehek.doshi@neuleap.ai", team: "Applied AI · Bengaluru", role: "Engineer" },

  topics: [
    {
      title: "Small language models for on-device agents",
      summary: "Sub-4B parameter models (Phi-4-mini, Gemma 3n, Llama 3.2 3B) now run tool-calling agents on laptops and phones with acceptable latency.",
      ring: "Trial",
      category: "AI & ML",
      volunteers: 4,
      found: "2 days ago",
      articles: ["Phi-4-mini technical report", "Gemma 3n on-device benchmarks", "Running agents on Apple Silicon"],
      tests: ["Latency on M3 / Snapdragon X", "Tool-call accuracy vs GPT-4o-mini", "Battery impact over 1 hour"],
      suggestion: "Prototype an offline meeting-notes assistant for field sales that summarises calls without sending audio to the cloud."
    },
    {
      title: "Model Context Protocol (MCP) for internal tools",
      summary: "An open protocol for connecting LLM apps to data sources and tools. Most major IDEs and agent frameworks now support it.",
      ring: "Adopt",
      category: "Platforms",
      volunteers: 7,
      found: "5 days ago",
      articles: ["MCP specification", "Securing MCP servers", "MCP in VS Code and JetBrains"],
      tests: ["Expose the HR policy search as an MCP server", "Auth with Entra ID"],
      suggestion: "Wrap Talents Scooper’s candidate search as an MCP server so recruiters can query it from any assistant."
    },
    {
      title: "DuckDB + Iceberg for analytics workloads",
      summary: "DuckDB’s Iceberg extension lets small teams query lakehouse tables directly without a warehouse cluster.",
      ring: "Assess",
      category: "Data",
      volunteers: 2,
      found: "1 week ago",
      articles: ["DuckDB Iceberg extension", "Cost comparison with Snowflake"],
      tests: ["Query 50 GB of events from ADLS", "Concurrency limits"],
      suggestion: "Replace the nightly pipeline-metrics export with a DuckDB notebook that reads Iceberg tables in place."
    },
    {
      title: "Passkeys for employee sign-in",
      summary: "FIDO2 passkeys are now supported by Entra ID across Windows, macOS, iOS and Android, removing passwords for workforce apps.",
      ring: "Trial",
      category: "Security",
      volunteers: 3,
      found: "1 week ago",
      articles: ["Entra ID passkey rollout guide", "Phishing-resistant MFA"],
      tests: ["Pilot with 20 users", "Recovery flow for lost devices"],
      suggestion: "Pilot passkeys for the Testing App’s admin console."
    },
    {
      title: "WebGPU for in-browser inference",
      summary: "WebGPU is shipping in all major browsers, making client-side model inference practical for small vision and text models.",
      ring: "Hold",
      category: "Frontend",
      volunteers: 1,
      found: "2 weeks ago",
      articles: ["WebGPU browser support", "transformers.js v3"],
      tests: ["Face-detection FPS on a mid-range laptop"],
      suggestion: "Move the Testing App’s motion check into the browser to cut proctoring costs."
    }
  ],

  invitations: [
    { from: "Ananya Iyer", topic: "Model Context Protocol (MCP) for internal tools", role: "Write test cases", due: "Due 31 Oct" },
    { from: "Vikram Rao", topic: "Small language models for on-device agents", role: "Co-present at Tech Talk", due: "Session on 6 Nov" }
  ],

  badges: [
    { name: "First Volunteer", icon: "hand-heart", earned: true, tone: "" },
    { name: "Test Case Contributor", icon: "flask-conical", earned: true, tone: "green" },
    { name: "Artifact Author", icon: "file-pen-line", earned: true, tone: "amber" },
    { name: "Presenter", icon: "presentation", earned: false, tone: "" },
    { name: "Explorer", icon: "compass", earned: false, tone: "green" }
  ],

  certificates: [
    { title: "Tech Radar Contributor · Q3 2026", meta: "Issued 2 Oct 2026 · 3 artifacts, 9 test cases" },
    { title: "Applied GenAI Explorer", meta: "Issued 14 Aug 2026 · MCP and RAG evaluations" }
  ],

  artifacts: [
    { title: "MCP server for HR policy search", type: "Code", icon: "code-xml", topic: "Model Context Protocol", author: "Mehek Doshi", updated: "Updated 2 hours ago", status: "Published" },
    { title: "SLM latency benchmark — M3 vs Snapdragon X", type: "Report", icon: "file-bar-chart", topic: "Small language models", author: "Vikram Rao", updated: "Updated yesterday", status: "In review" },
    { title: "Passkey pilot runbook", type: "Document", icon: "file-text", topic: "Passkeys", author: "Sara Khan", updated: "Updated 3 days ago", status: "Published" },
    { title: "DuckDB on Iceberg — query notebook", type: "Notebook", icon: "notebook-pen", topic: "DuckDB + Iceberg", author: "Meera Nair", updated: "Updated 4 days ago", status: "Draft" },
    { title: "Tech Talk deck: Agents on-device", type: "Slides", icon: "presentation", topic: "Small language models", author: "Mehek Doshi", updated: "Updated last week", status: "Published" },
    { title: "WebGPU face detection demo", type: "Code", icon: "code-xml", topic: "WebGPU", author: "Arjun Das", updated: "Updated 2 weeks ago", status: "Archived" }
  ],

  admin: {
    kpis: [
      { label: "Topics discovered", value: "48", delta: "+9 this month", up: true },
      { label: "Active volunteers", value: "36", delta: "+5 this month", up: true },
      { label: "Use cases submitted", value: "21", delta: "+4 this month", up: true },
      { label: "Artifacts published", value: "64", delta: "+12 this month", up: true },
      { label: "Avg. time to first artifact", value: "9 days", delta: "−2 days", up: true }
    ],
    attention: [
      { icon: "file-check", tone: "warning", title: "6 use cases waiting for moderation", meta: "Oldest submitted 4 days ago", href: "admin-moderation.html", cta: "Review" },
      { icon: "user-x", tone: "error", title: "3 volunteers are overdue", meta: "No update in more than 14 days", href: "admin-volunteers.html", cta: "Nudge" },
      { icon: "calendar-plus", tone: "", title: "2 presenters awaiting a slot", meta: "Requested Tech Talk sessions", href: "admin-schedule.html", cta: "Schedule" },
      { icon: "plug-zap", tone: "warning", title: "SharePoint sync token expires in 5 days", meta: "Reconnect to keep artifacts syncing", href: "admin-settings.html", cta: "Reconnect" }
    ],
    sources: [
      { name: "arXiv (cs.AI, cs.CL, cs.LG)", kind: "Research", items: 412, last: "Today, 6:00 AM", on: true },
      { name: "GitHub Trending", kind: "Open source", items: 186, last: "Today, 6:00 AM", on: true },
      { name: "Hacker News", kind: "Community", items: 240, last: "Today, 6:00 AM", on: true },
      { name: "Papers with Code", kind: "Research", items: 98, last: "Today, 6:00 AM", on: true },
      { name: "Vendor release notes", kind: "Vendor", items: 57, last: "Yesterday, 6:00 AM", on: true },
      { name: "Internal #tech-radar channel", kind: "Internal", items: 23, last: "Yesterday, 6:00 AM", on: false }
    ],
    runs: [
      { at: "Today, 6:00 AM", found: 14, kept: 5, status: "Completed" },
      { at: "Yesterday, 6:00 AM", found: 11, kept: 3, status: "Completed" },
      { at: "20 Oct, 6:00 AM", found: 0, kept: 0, status: "Failed · source timeout" }
    ],
    categories: [
      { name: "AI & ML", on: true },
      { name: "Data", on: true },
      { name: "Platforms & DevEx", on: true },
      { name: "Security", on: false }
    ],
    include: ["LLM", "agents", "RAG", "lakehouse", "passkeys"],
    exclude: ["crypto", "NFT", "gaming"],
    volunteers: [
      { name: "Ananya Iyer", topic: "Model Context Protocol", status: "Active", due: "31 Oct", progress: 70 },
      { name: "Vikram Rao", topic: "Small language models", status: "Active", due: "6 Nov", progress: 55 },
      { name: "Sara Khan", topic: "Passkeys for employee sign-in", status: "Completed", due: "12 Oct", progress: 100 },
      { name: "Meera Nair", topic: "DuckDB + Iceberg", status: "Overdue", due: "15 Oct", progress: 30 },
      { name: "Arjun Das", topic: "WebGPU for in-browser inference", status: "Overdue", due: "10 Oct", progress: 20 },
      { name: "Karan Verma", topic: "Model Context Protocol", status: "Pending", due: "—", progress: 0 },
      { name: "Divya Pillai", topic: "Small language models", status: "Overdue", due: "18 Oct", progress: 45 }
    ],
    sessions: [
      { day: "28", month: "Oct", title: "Agents on-device with small language models", who: "Vikram Rao, Mehek Doshi", time: "4:00 – 4:45 PM · Teams" },
      { day: "30", month: "Oct", title: "MCP for internal tools: lessons from the HR pilot", who: "Ananya Iyer", time: "11:00 – 11:30 AM · Bengaluru Hub" },
      { day: "4", month: "Nov", title: "Passkeys rollout: what we learned", who: "Sara Khan", time: "3:00 – 3:30 PM · Teams" },
      { day: "11", month: "Nov", title: "DuckDB on Iceberg in 30 minutes", who: "Meera Nair", time: "5:00 – 5:30 PM · Teams" }
    ],
    awaiting: [
      { name: "Arjun Das", topic: "WebGPU for in-browser inference", length: "30 min" },
      { name: "Farhan Ali", topic: "Vector databases at small scale", length: "45 min" }
    ],
    moderation: [
      { title: "Offline meeting-notes assistant", type: "Use case", author: "Vikram Rao", topic: "Small language models", submitted: "18 Oct" },
      { title: "MCP wrapper for candidate search", type: "Use case", author: "Ananya Iyer", topic: "Model Context Protocol", submitted: "19 Oct" },
      { title: "SLM latency benchmark", type: "Artifact", author: "Vikram Rao", topic: "Small language models", submitted: "20 Oct" },
      { title: "DuckDB nightly metrics notebook", type: "Artifact", author: "Meera Nair", topic: "DuckDB + Iceberg", submitted: "21 Oct" },
      { title: "Passkeys for Testing App admin", type: "Use case", author: "Sara Khan", topic: "Passkeys", submitted: "21 Oct" }
    ],
    users: [
      { name: "Mehek Doshi", email: "mehek.doshi@neuleap.ai", role: "Admin", status: "Active" },
      { name: "Ananya Iyer", email: "ananya.iyer@neuleap.ai", role: "Moderator", status: "Active" },
      { name: "Vikram Rao", email: "vikram.rao@neuleap.ai", role: "Contributor", status: "Active" },
      { name: "Sara Khan", email: "sara.khan@neuleap.ai", role: "Contributor", status: "Active" },
      { name: "Meera Nair", email: "meera.nair@neuleap.ai", role: "Contributor", status: "Invited" },
      { name: "Arjun Das", email: "arjun.das@neuleap.ai", role: "Viewer", status: "Suspended" }
    ],
    badgeRules: [
      { name: "First Volunteer", icon: "hand-heart", tone: "", rule: "Volunteer for a topic", threshold: 1, unit: "topic", earned: 31 },
      { name: "Test Case Contributor", icon: "flask-conical", tone: "green", rule: "Write approved test cases", threshold: 5, unit: "test cases", earned: 18 },
      { name: "Artifact Author", icon: "file-pen-line", tone: "amber", rule: "Publish artifacts", threshold: 3, unit: "artifacts", earned: 12 },
      { name: "Presenter", icon: "presentation", tone: "", rule: "Present at a Tech Talk", threshold: 1, unit: "session", earned: 7 },
      { name: "Explorer", icon: "compass", tone: "green", rule: "Contribute across categories", threshold: 3, unit: "categories", earned: 4 }
    ],
    integrations: [
      { name: "Microsoft Entra ID", icon: "shield-check", desc: "Single sign-on and user sync", status: "Connected" },
      { name: "SharePoint", icon: "cloud", desc: "Artifacts library · /sites/TechRadar", status: "Expires in 5 days" },
      { name: "Microsoft Teams", icon: "messages-square", desc: "Invitations and session reminders", status: "Connected" },
      { name: "Outlook Calendar", icon: "calendar", desc: "Tech Talk scheduling", status: "Not connected" }
    ],
    rules: [
      { name: "Invite volunteers when a topic is published", on: true },
      { name: "Send a reminder 3 days before the due date", on: true },
      { name: "Auto-invite past contributors in the same category", on: false }
    ],
    audit: [
      { at: "22 Oct, 9:41 AM", who: "Mehek Doshi", action: "Ran discovery agent manually", target: "Discovery agent" },
      { at: "22 Oct, 9:12 AM", who: "Ananya Iyer", action: "Approved use case", target: "MCP wrapper for candidate search" },
      { at: "21 Oct, 6:05 PM", who: "Mehek Doshi", action: "Changed role to Moderator", target: "Ananya Iyer" },
      { at: "21 Oct, 4:30 PM", who: "System", action: "Awarded badge", target: "Artifact Author → Mehek Doshi" },
      { at: "21 Oct, 11:02 AM", who: "Ananya Iyer", action: "Rejected artifact", target: "Old RAG eval sheet" },
      { at: "20 Oct, 6:00 AM", who: "System", action: "Discovery run failed", target: "Source timeout · Papers with Code" },
      { at: "19 Oct, 3:15 PM", who: "Mehek Doshi", action: "Updated relevance threshold to 0.72", target: "Discovery agent" },
      { at: "18 Oct, 10:20 AM", who: "Mehek Doshi", action: "Scheduled session", target: "Agents on-device · 28 Oct" }
    ]
  }
};
