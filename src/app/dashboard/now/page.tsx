import { getNowStatus } from "@/lib/data";
import { NowEditor } from "./NowEditor";

export default async function NowEditorPage() {
  const now = await getNowStatus();
  return <NowEditor initial={now} />;
}
