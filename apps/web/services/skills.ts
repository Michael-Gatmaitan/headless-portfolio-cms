import axios from "@/lib/axios"

export const getSkills = () => {
  return axios.get("/api/skills");
}