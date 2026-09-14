import { site } from "@/lib/site";

const Mail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="0" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const GitHub = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
  </svg>
);
const LinkedIn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" />
    <path d="M8 10v7M8 7v.5M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

export default function Contacts() {
  return (
    <ul className="contacts" aria-label="Contact">
      <li>
        <a href={`mailto:${site.email}`}>
          <Mail /> Email
        </a>
      </li>
      <li>
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          <GitHub /> GitHub
        </a>
      </li>
      <li>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
          <LinkedIn /> LinkedIn
        </a>
      </li>
    </ul>
  );
}
