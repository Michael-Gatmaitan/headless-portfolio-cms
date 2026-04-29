"use client";

import { useSkills } from "@/hooks/useSkills";

const Page = () => {
  const { data: skills = [], isLoading: skillsLoading } = useSkills();

  return (
    <div>
      <h1>Dashboard</h1>
      {skillsLoading ? (
        <p>Loading skills...</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>{skill.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page;