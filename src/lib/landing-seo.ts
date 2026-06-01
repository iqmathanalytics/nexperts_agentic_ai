/** Landing page SEO — keep in sync with index.html and changes.txt. */

export const LANDING_CANONICAL_URL = "https://nexpertsai.com/";

export const LANDING_PAGE_TITLE = "Agentic AI Engineering Course Malaysia - Nexperts AI";

export const LANDING_META_DESCRIPTION =
  "Join Malaysia's live Agentic AI Engineering course. Learn LangChain, LangGraph, RAG & AI agents in 80 hours. Become an AI Engineer in Malaysia";

export const LANDING_H1 = "Professional Agentic AI Engineering Course in Malaysia";

export const LANDING_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export const LANDING_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://nexpertsai.com/#organization",
      name: "Nexperts Academy",
      url: "https://nexpertsai.com/",
      description:
        "Professional Agentic AI Engineering training in Malaysia covering LangChain, LangGraph, CrewAI, AutoGen, RAG, Multi-Agent Systems, LLM applications and AI deployment.",
      email: "enquiry@nexpertsacademy.com",
      telephone: "+60 11-1221 6870",
      foundingDate: "2010",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 313, Block E, Phileo Damansara 1, Jalan 16/11",
        addressLocality: "Petaling Jaya",
        addressRegion: "Selangor",
        postalCode: "46350",
        addressCountry: "MY",
      },
      areaServed: "Malaysia",
      sameAs: [
        "https://www.linkedin.com/company/nexperts-academy-sdn-bhd/",
        "https://www.instagram.com/nexperts/",
        "https://www.youtube.com/@nexpertsacademy2877",
      ],
      parentOrganization: {
        "@type": "Organization",
        name: "Nexperts Academy",
        url: "https://www.nexpertsacademy.com/",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://nexpertsai.com/#website",
      url: "https://nexpertsai.com/",
      name: "Nexperts AI",
      publisher: { "@id": "https://nexpertsai.com/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "Course",
      "@id": "https://nexpertsai.com/#course",
      name: "Professional Agentic AI Engineering",
      description:
        "Live instructor-led Agentic AI Engineering programme in Malaysia covering LangChain, LangGraph, CrewAI, AutoGen, RAG, Multi-Agent Systems, AI deployment, LLM evaluation and production AI applications.",
      provider: { "@id": "https://nexpertsai.com/#organization" },
      courseMode: "Online",
      educationalLevel: "Professional",
      inLanguage: "en",
      availableLanguage: "English",
      teaches: [
        "Agentic AI",
        "LangChain",
        "LangGraph",
        "CrewAI",
        "AutoGen",
        "RAG",
        "Multi-Agent Systems",
        "AI Engineering",
        "LLM Applications",
        "AI Deployment",
      ],
    },
  ],
} as const;
