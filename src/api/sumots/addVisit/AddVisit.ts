import axios from "@/api/axios";

export interface AddVisitCommand {
  date: string;
  isMobile: boolean;
}

export type AddVisitResponse = void;

export async function addVisit(
  request: AddVisitCommand
): Promise<AddVisitResponse> {
  await axios.post("/sumotstats/addvisit", request);
}
