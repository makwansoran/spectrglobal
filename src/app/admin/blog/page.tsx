import type { Metadata } from "next";
import { AdminPostForm } from "@/components/admin-post-form";
import { listBlogPosts } from "@/lib/hubs";

export const metadata: Metadata = { title: "Blog posts" };

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();

  return (
    <>
      <h1 className="admin-title">Blog posts</h1>
      <p className="admin-lede">Write a post. It goes live on /blog immediately. Set font, size, and weight per paragraph, then create a graph and drag it into the body.</p>

      <div className="admin-split">
        <section className="admin-panel">
          <h2>New blog post</h2>
          <AdminPostForm kind="blog" />
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
