import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testing",
};

const page = async () => {
  const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL!;
  const CMS_API_KEY = process.env.NEXT_PUBLIC_CMS_API_KEY!;

  const res = await fetch(`${CMS_API_URL}/public/v1`, {
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": CMS_API_KEY,
    },
  });

  const { data: skills } = await res.json();

  console.log(skills);

  return <div>asd</div>;
};

export default page;
