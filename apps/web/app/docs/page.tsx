import { CodeBlock } from "@/components/layout/docs/CodeBlock";
import RequestInfo from "@/components/layout/docs/RequestInfo";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const page = async () => {
  const returnTypesCode = `export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnail: string | undefined;
  url: string;
  github: string;
  dateRange: string;
  sortOrder: string;
}

export interface Skill {
  id: string;
  userId: string;
  title: string;
  tags: string[];
  sortOrder: string;
}

export interface Award {
  id: string;
  userId: string;
  title: string;
  thumbnail: string | undefined;
  shortDescription: string;
  longDescription: string;
  year: string;
  tags: string[];
  sortOrder: string;
}
`;

  const requestCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseCode = `{
  success: true,
  data: {
    projects: [], // Array of Project objects
    awards: [], // Array of Award objects
    skills: [], // Array of Skill objects
}`

  const requestProjectsCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/projects", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseProjectsCode = `{
  success: true,
  data: [] // Array of Project objects
}`

  const requestSkillsCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/skills", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseSkillsCode = `{
  success: true,
  data: [] // Array of Skill objects
}`

  const requestAwardsCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/awards", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseAwardsCode = `{
  success: true,
  data: [] // Array of Award objects
}`

  const requestProjectCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/projects/{project_id}", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseProjectCode = `{
  success: true,
  data: {} // Project object
}`

  const requestSkillCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/skills/{skill_id}", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseSkillCode = `{
  success: true,
  data: {} // Skill object
}`

  const requestAwardCode = `const apiKey = process.env.FETCHFOLIO_API_KEY;
const res = await fetch("https://headless-portfolio-cms-api.vercel.app/public/v1/awards/{award_id}", {
  headers: {
    "X-API-Key": apiKey
  }
});
const data = await res.json();
`;

  const responseAwardCode = `{
  success: true,
  data: {} // Award object
}`

  const requests = [
    {
      title: "Fetch all data",
      description: "GET /public/v1",
      request: requestCode,
      response: responseCode,
    },
    {
      title: "Fetch Projects only",
      description: "GET /public/v1/projects",
      request: requestProjectsCode,
      response: responseProjectsCode,
    },
    {
      title: "Fetch Skills only",
      description: "GET /public/v1/skills",
      request: requestSkillsCode,
      response: responseSkillsCode,
    },
    {
      title: "Fetch Awards only",
      description: "GET /public/v1/awards",
      request: requestAwardsCode,
      response: responseAwardsCode,
    },
    {
      title: "Fetch a single project",
      description: "GET /public/v1/projects/{project_id}",
      request: requestProjectCode,
      response: responseProjectCode,
    },
    {
      title: "Fetch a single skill",
      description: "GET /public/v1/skills/{skill_id}",
      request: requestSkillCode,
      response: responseSkillCode,
    },
    {
      title: "Fetch a single award",
      description: "GET /public/v1/awards/{award_id}",
      request: requestAwardCode,
      response: responseAwardCode,
    },
  ]

  return (
    <div className="grid w-full min-w-0 gap-6">
      {/* Table of contents */}
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card/40 p-6 shadow-sm backdrop-blur-xs space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What you'll find here?
          </h2>
        </div>
        <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
          {requests.map((request) => (
            <li key={request.title} className="group flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-200" />
              <Link
                href={`#${request.title.toLowerCase().replace(" ", "-")}`}
                className="text-muted-foreground visited:text-muted-foreground hover:text-foreground hover:visited:text-foreground font-medium underline decoration-primary/30 visited:decoration-primary/30 hover:decoration-primary hover:visited:decoration-primary decoration-2 underline-offset-[4px] transition-all duration-200"
              >
                {request.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full min-w-0 space-y-4">
        <h1 className="text-2xl font-bold">Return types for TypeScript</h1>
        <CodeBlock language="typescript" code={returnTypesCode} />
      </div>

      <div className="w-full min-w-0 space-y-4">
        <h1 className="text-2xl font-bold">Set your environment variable</h1>
        <CodeBlock language="dotenv" code='FETCHFOLIO_API_KEY={api_key} # Or NEXT_PUBLIC_FETCHFOLIO_API_KEY for Next.js projects' />

        <Button variant="outline" asChild>
          <Link href="/api-keys">Create your API Key</Link>
        </Button>
      </div>

      {requests.map((request, idx) => (
        <RequestInfo
          key={request.title}
          title={request.title}
          description={request.description}
          request={request.request}
          response={request.response}
        />
      ))}
    </div>
  )
}

export default page