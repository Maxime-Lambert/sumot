import axios from "@/api/axios";

export interface RollbackChangesRequest {
  token: string;
}

export type RollbackChangesResponse = void;

export async function rollbackChanges(
  request: RollbackChangesRequest
): Promise<RollbackChangesResponse> {
  await axios.post("/users/rollback", request);
}
