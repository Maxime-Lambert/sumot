import axios from "@/api/axios";

export interface AddFinishCommand {
  date: string;
  isMobile: boolean;
}

export type AddFinishResponse = void;

export async function addFinish(
  request: AddFinishCommand
): Promise<AddFinishResponse> {
  await axios.post("/sumotstats/addfinish", request);
}
