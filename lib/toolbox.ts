import { asset } from "./paths";

/**
 * The stacks I actually work in, grouped by what they're for.
 * `icon` is a devicon slug; anything without one falls back to a monogram tile.
 */
export interface Tool {
  name: string;
  icon?: string;
  note?: string;
}

export interface ToolGroup {
  title: string;
  blurb: string;
  tools: Tool[];
}

// Icons are vendored into public/icons so the site has no external requests.
export const iconUrl = (t: Tool) => (t.icon ? asset(`/icons/${t.icon}.svg`) : undefined);

export const toolbox: ToolGroup[] = [
  {
    title: "Languages",
    blurb: "Rust, Go and Python often land in the same PR stack.",
    tools: [
      { name: "Python", icon: "python" },
      { name: "Rust", icon: "rust" },
      { name: "Go", icon: "go" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Java", icon: "java" },
      { name: "C#", icon: "csharp" },
    ],
  },
  {
    title: "Backend & APIs",
    blurb: "Where most of my production work lives.",
    tools: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "Django", icon: "django" },
      { name: "Flask", icon: "flask" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "express" },
      { name: "gRPC / Proto" },
    ],
  },
  {
    title: "AI & agents",
    blurb: "Agent runtimes, tool calling and retrieval.",
    tools: [
      { name: "LLM APIs" },
      { name: "LangChain" },
      { name: "RAG" },
      { name: "MCP" },
      { name: "Vector search" },
      { name: "OpenCV", icon: "opencv" },
      { name: "MediaPipe" },
    ],
  },
  {
    title: "Frontend",
    blurb: "Product surfaces, not just marketing pages.",
    tools: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind", icon: "tailwindcss" },
      { name: "TanStack Query" },
      { name: "HTML/CSS", icon: "html5" },
    ],
  },
  {
    title: "Data",
    blurb: "Relational by default, document stores where they earn it.",
    tools: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "SQLite", icon: "sqlite" },
    ],
  },
  {
    title: "Infra & tooling",
    blurb: "Shipping, observing and keeping it stable.",
    tools: [
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Git", icon: "git" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "AWS", icon: "amazonwebservices" },
      { name: "Grafana", icon: "grafana" },
      { name: "OpenTelemetry", icon: "opentelemetry" },
      { name: "pytest", icon: "pytest" },
      { name: "Jira", icon: "jira" },
    ],
  },
];
