import AddApiKeyDialog from "@/components/layout/api-keys/AddApiKeyDialog";
import DisplayApiKeys from "@/components/layout/api-keys/DisplayApiKeys";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Keys",
};

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Manage your api keys</h1>
        <AddApiKeyDialog />
      </div>

      <DisplayApiKeys />
    </div>
  );
};

export default page;
