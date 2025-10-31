import { useEffect, useState, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { codeToHtml } from 'shiki'

interface CodeBlockProps extends ComponentProps<'div'> {
  code: string
  language?: string
}

export function CodeBlock({
  className,
  code,
  language = 'json',
  ...props
}: CodeBlockProps) {
  const [parsedCode, setParsedCode] = useState('')

  useEffect(() => {
    if (code) {
      codeToHtml(code, { lang: language, theme: 'vesper' }).then((parsed) =>
        setParsedCode(parsed),
      )
    }
  }, [code, language])

  return (
    <div
      className={twMerge(
        'relative rounded-lg border border-zinc-700 overflow-x-auto',
        className,
      )}
      {...props}
    >
      <div
        dangerouslySetInnerHTML={{ __html: parsedCode }}
        className="[&_pre]:p-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-relaxed"
      />
    </div>
  )
}
