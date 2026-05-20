import AddAwardDialog from "@/components/layout/awards/AddAwardDialog";
import DisplayAwards from "@/components/layout/awards/DisplayAwards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awards",
};

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Update your awards</h1>
        <AddAwardDialog />
      </div>

      <DisplayAwards />
    </div>
  );
};

export default page;
