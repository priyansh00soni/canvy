import Editor from '@/components/editor/Editor'

type EditorByIdPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditorByIdPage({ params }: EditorByIdPageProps) {
  const { id } = await params
  return <Editor initialCanvasId={id} />
}
