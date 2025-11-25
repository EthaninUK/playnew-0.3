import { notFound } from 'next/navigation';
import { getStaticPage, getStaticPages } from '@/lib/directus';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocsLayout } from '@/components/docs/DocsLayout';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getStaticPage(slug);

  if (!page) {
    return {
      title: '页面未找到',
    };
  }

  return {
    title: `${page.title} - PlayNew.ai`,
    description: page.description || page.title,
  };
}

export async function generateStaticParams() {
  const pages = await getStaticPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function StaticPageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getStaticPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <DocsLayout currentSlug={slug}>
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-lg text-muted-foreground">
            {page.description}
          </p>
        )}
      </div>

      <div className="pb-12 pt-8">
        <div className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:scroll-m-20 prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mb-4 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2
          prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
          prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
          prose-p:leading-7 prose-p:mb-4
          prose-ul:my-6 prose-ul:ml-6 prose-ul:list-disc
          prose-ol:my-6 prose-ol:ml-6 prose-ol:list-decimal
          prose-li:mt-2
          prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic
          prose-code:relative prose-code:rounded prose-code:bg-muted prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-semibold
          prose-pre:mt-6 prose-pre:mb-4 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-slate-950 prose-pre:py-4
          prose-a:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80
          prose-img:rounded-lg prose-img:border
          prose-hr:my-8
          prose-table:w-full prose-table:text-sm
          prose-th:border prose-th:border-slate-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold dark:prose-th:border-slate-700
          prose-td:border prose-td:border-slate-300 prose-td:px-4 prose-td:py-2 dark:prose-td:border-slate-700
          prose-strong:font-semibold
          [&>*:first-child]:mt-0
          [&>*:last-child]:mb-0
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {page.content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex items-center border-t pt-6 text-sm">
        <div className="flex-1 text-muted-foreground">
          最后更新：{new Date(page.updated_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </DocsLayout>
  );
}
