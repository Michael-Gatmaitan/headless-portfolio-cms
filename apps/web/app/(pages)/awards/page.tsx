import AddAwardDialog from "@/components/layout/awards/AddAwardDialog";
import DisplayAwards from "@/components/layout/awards/DisplayAwards";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Update your awards</h1>
        <AddAwardDialog />
      </div>

      {/* Display awards */}
      <DisplayAwards />
    </div>
  );
};

export default page;
