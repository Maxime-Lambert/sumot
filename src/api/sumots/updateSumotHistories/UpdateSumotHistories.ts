import axios from "@/api/axios";

export interface UpdateSumotHistoryCommand {
  word: string;
  tries: string[];
  won: boolean;
}

export interface UpdateSumotHistoriesRequest {
  histories: UpdateSumotHistoryCommand[];
  overwrite: boolean;
}

export type UpdateSumotHistoriesResponse = void;

export async function updateSumotHistories(
  request: UpdateSumotHistoriesRequest
): Promise<UpdateSumotHistoriesResponse> {
  await axios.post("/sumothistories/updaterange", request);
}
