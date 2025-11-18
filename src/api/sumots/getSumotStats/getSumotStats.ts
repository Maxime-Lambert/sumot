import axios from "@/api/axios";

export interface GetSumotStatsResponse {
  date: string;
  isMobile: boolean;
  visits: number;
  attempts: number;
  finishes: number;
}

export async function getSumotStats(): Promise<GetSumotStatsResponse[]> {
  const response = await axios.get<GetSumotStatsResponse[]>("/sumotstats");
  return response.data;
}
