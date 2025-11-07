import axios from "@/api/axios";

export interface GetSumotHistoriesRequest {
  startDate?: string;
  endDate?: string;
}

export interface GetSumotHistoriesResponse {
  id: number;
  word: string;
  tries: string[];
  userName: string;
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
