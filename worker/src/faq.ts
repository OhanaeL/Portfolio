/** Prepared answers Jev may pick instead of calling the LLM. `question` tells Jev what each one answers. */
export const FAQ: Record<string, { question: string; answer: string }> = {
  greeting: {
    question: "A greeting, thanks, or asking what this assistant can do.",
    answer: "Hi! I'm the guide to Lynn's portfolio. Ask me what he has built, where he has worked, or where to find something on this page.",
  },
  about: {
    question: "Who Lynn is or what he does in general, such as 'who is he', 'tell me about him', 'what does he do' or 'introduce him'.",
    answer:
      "Lynn (Htin Linn) is a software engineer at MagickMind. He builds the runtime AI agents run on: the supervisor that launches each agent as an isolated process, the AI inference service behind it, and agent memory, in Rust, Go and Python.",
  },
  current_role: {
    question: "His current job, employer or role.",
    answer:
      "Since April 2026 he has been a Software Engineer at General Magick Industries on MagickMind, where he owns the agent runtime: the agent supervisor, the AI inference service and agent memory.",
  },
  location: {
    question: "Where he is based or lives.",
    answer: "He is based in Bangkok, Thailand.",
  },
  contact: {
    question: "How to contact or reach him, his email, LinkedIn or GitHub.",
    answer: "You can email him at htinlinn.dev.03@gmail.com, or find him on LinkedIn and on GitHub as OhanaeL.",
  },
  languages: {
    question: "Which programming languages or tech stack he works in.",
    answer: "Mostly Rust, Go and Python, plus TypeScript for front ends.",
  },
  brillar: {
    question: "His job at Brillar or Atenxion.",
    answer:
      "From May 2025 to April 2026 he was an Associate Fullstack Engineer at Brillar (Atenxion), on a remote team in Singapore. He built a Google ADK multi-agent workflow platform, the CRM integration service behind it (Zoho, SalesIQ, Chatwoot, Zendesk), and its RAG retrieval.",
  },
  rangsit: {
    question: "His work at Rangsit University or Rangsit International College.",
    answer:
      "From August 2024 to December 2025 he built internal systems at Rangsit International College: a QR attendance system, a job fair platform used by 300+ students and 100+ companies, and a course recommendation system used by about 100 students.",
  },
  education: {
    question: "His education, degree, university or GPA.",
    answer: "He has a B.Sc. in ICT from Rangsit International College, Rangsit University (2022–2025), with a 3.96 GPA and First Class Honours.",
  },
  hackathons: {
    question: "Hackathons or awards he has won.",
    answer: "He won 1st place at the CIMSO Hospitality ERP Hackathon 2025 and 3rd place at Hack the Zodiac 2024.",
  },
  open_source: {
    question: "His open-source work.",
    answer: "He contributes to Mindroid, MagickMind's open-source Rust agent runtime, and built sitepilot, the open-source library behind this chat.",
  },
  results: {
    question: "His biggest results, impact or numbers.",
    answer:
      "He cut hot-path latency 40% on a production AI service and per-turn agent latency from 4s to 2.5s, and the reasoning methods he built scored up to 34 points higher on GPQA than a direct call to the same model.",
  },
  this_chat: {
    question: "How this chat or assistant works, or what powers it.",
    answer: "This guide runs on sitepilot, Lynn's open-source library. TypeSafe's Jev handles quick requests and prepared answers, and Gemini answers the open questions.",
  },
};

export const OFF_TOPIC = "I can only help with Lynn's work and this site. Ask me about his projects, roles or skills, or where to find something on the page.";
