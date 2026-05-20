import axios from "@/lib/axios";
import { CreateApiKeyFormValues } from "@/lib/zod-schemas/api-keys-schema";

export const createApiKey = (data: CreateApiKeyFormValues) => {
  return axios.post("/api/api-keys", data);
};

export const getApiKeys = () => {
  return axios.get("/api/api-keys");
};

export const revokeApiKey = (id: string) => {
  return axios.delete(`/api/api-keys/${id}`);
};

export const bulkRevokeApiKeys = (ids: string[]) => {
  return axios.post("/api/api-keys/bulk-revoke", { ids });
};

