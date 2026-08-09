'use client'

import { useEffect, useRef } from 'react'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import type { BlockNoteEditor } from '@blocknote/core'
import { pt } from '@blocknote/core/locales'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'

interface EditorProps {
  /** Markdown to load in. The parent remounts on file switch, so this is read once. */
  initialMarkdown: string
  /** Hands the editor instance up so the parent can pull markdown out on save. */
  onReady: (editor: BlockNoteEditor) => void
  onDirty: () => void
}

export default function Editor({ initialMarkdown, onReady, onDirty }: EditorProps) {
  const editor = useCreateBlockNote({ dictionary: pt })
  // Captured at mount and never updated: saving triggers a router refresh that
  // re-reads the file, and re-applying those blocks would stomp on whatever is
  // being typed. The parent remounts this component when the open file changes.
  const mountedMarkdown = useRef(initialMarkdown)

  useEffect(() => {
    onReady(editor)
  }, [editor, onReady])

  // Markdown → blocks is async, so the editor starts empty and gets filled in.
  useEffect(() => {
    const markdown = mountedMarkdown.current
    if (!markdown.trim()) return
    let cancelled = false
    void (async () => {
      const blocks = await editor.tryParseMarkdownToBlocks(markdown)
      if (!cancelled) editor.replaceBlocks(editor.document, blocks)
    })()
    return () => {
      cancelled = true
    }
  }, [editor])

  // The border lives on a wrapper: BlockNoteView forwards `className` to both
  // its container and the inner view, which would draw the frame twice.
  return (
    <div className="min-h-[24rem] rounded-lg border border-[#DCD6C2] bg-white py-4">
      <BlockNoteView editor={editor} theme="light" onChange={onDirty} />
    </div>
  )
}
