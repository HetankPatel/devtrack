import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");

  async function loadData() {
    try {
      setError("");

      const [projectResponse, taskResponse] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/tasks`),
      ]);

      if (!projectResponse.ok || !taskResponse.ok) {
        throw new Error("Could not load DevTrack data.");
      }

      setProjects(await projectResponse.json());
      setTasks(await taskResponse.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createProject(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          status: "ACTIVE",
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create project.");
      }

      setProjectName("");
      setProjectDescription("");
      setShowProjectForm(false);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function createTask(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status: "TODO",
          priority: taskPriority,
          dueDate: taskDueDate || null,
          projectId: Number(taskProjectId),
        }),
      });

      if (!response.ok) {
        throw new Error("Could not create task.");
      }

      setTaskTitle("");
      setTaskDescription("");
      setTaskProjectId("");
      setTaskPriority("MEDIUM");
      setTaskDueDate("");
      setShowTaskForm(false);

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function formatStatus(status) {
    if (!status) return "";

    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getProjectProgress(projectId) {
    const projectTasks = tasks.filter(
      (task) => task.project?.id === projectId
    );

    if (projectTasks.length === 0) return 0;

    const completed = projectTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    return Math.round((completed / projectTasks.length) * 100);
  }

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <h1 className="logo">DevTrack</h1>
          <p className="logo-subtitle">Project workspace</p>

          <nav>
            <button className="nav-item active">Dashboard</button>
            <button className="nav-item">Projects</button>
            <button className="nav-item">Tasks</button>
          </nav>
        </div>

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

          <button
            className="primary-button"
            onClick={() => setShowProjectForm(true)}
          >
            + New Project
          </button>
        </header>

        {showProjectForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h3>Create Project</h3>
                <p>Add a new project to your workspace.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowProjectForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={createProject}>
              <label>
                Project Name
                <input
                  type="text"
                  value={projectName}
                  onChange={(event) =>
                    setProjectName(event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={projectDescription}
                  onChange={(event) =>
                    setProjectDescription(event.target.value)
                  }
                  rows="3"
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowProjectForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}

        {showTaskForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h3>Create Task</h3>
                <p>Add a task to one of your projects.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowTaskForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={createTask}>
              <label>
                Task Title
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(event) =>
                    setTaskTitle(event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  value={taskDescription}
                  onChange={(event) =>
                    setTaskDescription(event.target.value)
                  }
                  rows="3"
                />
              </label>

              <label>
                Project
                <select
                  value={taskProjectId}
                  onChange={(event) =>
                    setTaskProjectId(event.target.value)
                  }
                  required
                >
                  <option value="">Select a project</option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Priority
                <select
                  value={taskPriority}
                  onChange={(event) =>
                    setTaskPriority(event.target.value)
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>

              <label>
                Due Date
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(event) =>
                    setTaskDueDate(event.target.value)
                  }
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowTaskForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && (
          <div className="message-card">
            Loading DevTrack data...
          </div>
        )}

        {error && (
          <div className="message-card error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span>Total Projects</span>
                <strong>{projects.length}</strong>
                <p>{activeProjects} currently active</p>
              </div>

              <div className="stat-card">
                <span>Total Tasks</span>
                <strong>{tasks.length}</strong>
                <p>Across all projects</p>
              </div>

              <div className="stat-card">
                <span>In Progress</span>
                <strong>{inProgressTasks}</strong>
                <p>Tasks being worked on</p>
              </div>

              <div className="stat-card">
                <span>Completed</span>
                <strong>{completedTasks}</strong>
                <p>Tasks finished</p>
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <div>
                  <h3>Projects</h3>
                  <p>Your current development projects</p>
                </div>
              </div>

              <div className="project-grid">
                {projects.map((project) => {
                  const progress = getProjectProgress(project.id);

                  return (
                    <article
                      className="project-card"
                      key={project.id}
                    >
                      <div className="project-card-top">
                        <h4>{project.name}</h4>

                        <span
                          className={`status-badge ${
                            project.status === "ACTIVE"
                              ? "active-status"
                              : ""
                          }`}
                        >
                          {formatStatus(project.status)}
                        </span>
                      </div>

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>

                      <div className="progress-info">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <div>
                  <h3>Tasks</h3>
                  <p>Tasks stored in DevTrack</p>
                </div>

                <button
                  className="secondary-button"
                  onClick={() => setShowTaskForm(true)}
                  disabled={projects.length === 0}
                >
                  + New Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="message-card">
                  No tasks yet.
                </div>
              ) : (
                <div className="task-table">
                  <div className="task-row task-heading">
                    <span>Task</span>
                    <span>Project</span>
                    <span>Priority</span>
                    <span>Status</span>
                    <span>Due</span>
                  </div>

                  {tasks.map((task) => (
                    <div className="task-row" key={task.id}>
                      <strong>{task.title}</strong>
                      <span>{task.project?.name || "Unknown"}</span>

                      <span
                        className={`priority ${
                          task.priority
                            ? task.priority.toLowerCase()
                            : ""
                        }`}
                      >
                        {formatStatus(task.priority)}
                      </span>

                      <span>{formatStatus(task.status)}</span>
                      <span>{task.dueDate || "No date"}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
