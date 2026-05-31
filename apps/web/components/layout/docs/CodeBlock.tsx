import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  code: string
  language: string
}

export async function CodeBlock({ code, language }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark' // Feel free to change this!
  })

  return (
    <div
      className="w-full min-w-0 overflow-hidden rounded-md border border-gray-800 shadow-2xl [&>pre]:block [&>pre]:w-full [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}