"use client";
import { columns } from "@/app/(pages)/api-keys/columns";
import { DataTable } from "@/app/(pages)/api-keys/data-table";
import EmptyData from "@/components/EmptyData";
import { useApiKeys, useBulkRevokeApiKeys } from "@/hooks/useApiKeys";
import { ApiKey } from "@portfolio-types/shared";
import { FolderCodeIcon } from "lucide-react";
import AddApiKeyDialog from "./AddApiKeyDialog";

const DisplayApiKeys = () => {
  const { data: apiKeys, isLoading, error } = useApiKeys();
  const { mutateAsync: bulkRevoke, isPending: isRevoking } = useBulkRevokeApiKeys();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleDeleteSelected = async (selectedKeys: ApiKey[]) => {
    const ids = selectedKeys.map((key) => key.id);
    await bulkRevoke(ids);
  };

  return (
    <div className="py-6">
      {apiKeys && apiKeys.length > 0 ? (
        <DataTable
          columns={columns}
          data={apiKeys}
          onDeleteSelected={handleDeleteSelected}
          isDeletingSelected={isRevoking}
        />
      ) : (
        <EmptyData
          title="No API Keys Added"
          description="You haven't added any API keys yet. Get started by adding your first API key information."
          icon={FolderCodeIcon}
        >
          <AddApiKeyDialog />
        </EmptyData>
      )}
    </div>
  );
};

export default DisplayApiKeys;

