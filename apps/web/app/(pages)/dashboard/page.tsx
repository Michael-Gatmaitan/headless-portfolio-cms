"use client";

import { useSkills } from "@/hooks/useSkills";

const Page = () => {
  const { data: skills = [], isLoading: skillsLoading } = useSkills();

  console.log("skills: ", skills);

  return (
    <div>
      <h1>Dashboard</h1>
      {skillsLoading ? (
        <p>Loading skills...</p>
      ) : !skills ? (
        <p>No skills found.</p>
      ) : (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>{skill.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
