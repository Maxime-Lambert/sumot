import axios from "@/api/axios";

export type ExportDataRequest = void;
export type ExportDataResponse = void;

export async function exportData(): Promise<ExportDataResponse> {
  const res = await axios.post("/users/export", null, {
    responseType: "blob",
  });

  const disposition = res.headers["content-disposition"];
  let fileName = "userdata.json";
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match?.[1]) {
      fileName = match[1];
    }
  }

  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
