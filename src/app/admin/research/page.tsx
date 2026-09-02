import type { Metadata } from "next";
import { AdminPostForm } from "@/components/admin-post-form";
import { listResearchEssays } from "@/lib/hubs";

export const metadata: Metadata = { title: "Research posts" };

export default async function AdminResearchPage() {
  const posts = await listResearchEssays();

  return (
    <>
      <h1 className="admin-title">Research posts</h1>
      <p className="admin-lede">Publish an essay. It goes live on /research immediately.</p>

      <div className="admin-split">
        <section className="admin-panel">
          <h2>New research essay</h2>
          <AdminPostForm kind="research" />
        </section>
        <section className="admin-panel">
          <h2>Published</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug}>
                  <td>
                    <a href={post.href}>{post.title}</a>
                  </td>
                  <td>{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
