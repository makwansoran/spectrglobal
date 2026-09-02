import type { Metadata } from "next";
import { AdminResearchWorkspace } from "@/components/admin-research-workspace";
import { listResearchEssays } from "@/lib/hubs";

export const metadata: Metadata = { title: "Research posts" };

export default async function AdminResearchPage() {
  const posts = await listResearchEssays();

  return (
    <>
      <h1 className="admin-title">Research posts</h1>
      <p className="admin-lede">Write, preview, and manage essays. Published posts go live on /research. Add figures by entering data, then dragging the graph into the body.</p>
      <AdminResearchWorkspace posts={posts} />
    </>
  );
}
