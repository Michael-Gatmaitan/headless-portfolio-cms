import axios from "@/lib/axios"

export const getAwards = () => {
  return axios.get("/api/awards");
}