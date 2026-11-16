import "./App.css";

const projects = [
  {
    name: "Portfolio Website",
    description: "Personal portfolio for internship applications",
    status: "Active",
    progress: 70,
  },
  {
    name: "Study Planner",
    description: "Organize courses, assignments, and deadlines",
    status: "Active",
    progress: 45,
  },
  {
    name: "API Practice",
    description: "Practice building and testing REST APIs",
    status: "On Hold",
    progress: 25,
  },
];

const tasks = [
  {
    title: "Create responsive homepage",
    project: "Portfolio Website",
    priority: "High",
    status: "In Progress",
    dueDate: "Nov 25",
  },
  {
    title: "Add project screenshots",
    project: "Portfolio Website",
    priority: "Medium",
    status: "Todo",
    dueDate: "Nov 27",
  },
  {
    title: "Finish assignment tracker",
    project: "Study Planner",
    priority: "High",
    status: "Todo",
    dueDate: "Nov 29",
  },
];

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <h1 className="logo">DevTrack</h1>
          <p className="logo-subtitle">Project workspace</p>
        </div>

        <nav>
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Projects</button>
          <button className="nav-item">Tasks</button>
        </nav>

        <div className="sidebar-footer">
          <p>Developer productivity dashboard</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <p className="eyebrow">WORKSPACE</p>
            <h2>Dashboard</h2>
            <p className="subtitle">
              Track projects, tasks, and development progress.
            </p>
          </div>

          <button className="primary-button">+ New Project</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Projects</span>
            <strong>3</strong>
            <p>2 currently active</p>
          </div>

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>8</strong>
            <p>Across all projects</p>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>3</strong>
            <p>Tasks being worked on</p>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>4</strong>
            <p>Tasks finished</p>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h3>Projects</h3>
              <p>Your current development projects</p>
            </div>

            <button className="secondary-button">View all</button>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className="project-card-top">
                  <h4>{project.name}</h4>
                  <span
                    className={`status-badge ${
                      project.status === "Active" ? "active-status" : ""
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p>{project.description}</p>

                <div className="progress-info">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <h3>Upcoming Tasks</h3>
              <p>Tasks that need your attention</p>
            </div>

            <button className="secondary-button">View all</button>
          </div>

          <div className="task-table">
            <div className="task-row task-heading">
              <span>Task</span>
              <span>Project</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Due</span>
            </div>

            {tasks.map((task) => (
              <div className="task-row" key={task.title}>
                <strong>{task.title}</strong>
                <span>{task.project}</span>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span>{task.status}</span>
                <span>{task.dueDate}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
