import axios from "@/api/axios";

export interface AddAttemptCommand {
  date: string;
  isMobile: boolean;
}

export type AddAttemptResponse = void;

export async function addAttempt(
  request: AddAttemptCommand
): Promise<AddAttemptResponse> {
  await axios.post("/sumotstats/addattempt", request);
}
