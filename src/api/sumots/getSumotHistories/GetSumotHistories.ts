import axios from "@/api/axios";

export interface GetSumotHistoriesRequest {
  MinDate?: string;
  MaxDate?: string;
}

export interface GetSumotHistoriesResponse {
  id: number;
  word: string;
  tries: string[];
  username: string;
  won: boolean;
}

export async function getSumotHistories(
  params: GetSumotHistoriesRequest = {}
): Promise<GetSumotHistoriesResponse[]> {
  const response = await axios.get<GetSumotHistoriesResponse[]>(
    "/sumothistories",
    { params }
  );
  return response.data;
}
