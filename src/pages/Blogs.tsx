import { Card, Field, Toolbar } from '../components/Field'
import { mediaSrc } from '../lib/api'
import { useState } from 'react'
import ImagePicker from '../components/ImagePicker'
import { useForm } from 'react-hook-form'
import {
  useBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  type Blog
} from '../lib/queries'

export default function Blogs() {
  const [editing, setEditing] = useState<Blog | null>(null)
  const { register, handleSubmit, reset, setValue, watch } = useForm<Blog>({})
  const img = watch('imageUrl')

  // Tanstack Query hooks
  const { data: list = [], isLoading } = useBlogs()
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editing) {
        await updateBlog.mutateAsync({ ...data, id: editing.id })
      } else {
        await createBlog.mutateAsync(data)
      }
      reset({} as any)
      setEditing(null)
    } catch (e) {
      // Error is already handled by the mutation
    }
  })

  const del = (id: string) => {
    if (!confirm('Delete this blog?')) return
    deleteBlog.mutateAsync(id)
  }
  return (
    <div className="space-y-6">
      <Card
        title={editing ? 'Edit Blog' : 'New Blog'}
        footer={
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => { reset({} as any); setEditing(null) }}
            >
              Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={createBlog.isPending || updateBlog.isPending}
            >
              {createBlog.isPending || updateBlog.isPending
                ? 'Saving...'
                : editing ? 'Save Changes' : 'Create'
              }
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Title">
            <input className="input" {...register('title', { required: true })} />
          </Field>
          <Field label="Slug">
            <input className="input" {...register('slug', { required: true })} />
          </Field>
          <Field label="Excerpt">
            <textarea className="input" rows={3} {...register('excerpt')} />
          </Field>
          <Field label="Content">
            <textarea className="input" rows={8} {...register('content', { required: true })} />
          </Field>
          <Field label="Image">
            <ImagePicker
              value={mediaSrc(img)}
              onChange={(val) => setValue('imageUrl', val, { shouldDirty: true })}
            />
          </Field>
        </div>
      </Card>

      <div className="card">
        <Toolbar>
          <div className="text-lg font-semibold">Blogs</div>
          <div className="grow" />
          <button
            className="btn btn-outline"
            onClick={() => { reset({} as any); setEditing(null) }}
          >
            New
          </button>
        </Toolbar>

        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(b => (
              <div key={b.id} className="rounded-2xl overflow-hidden border bg-white">
                <img src={mediaSrc(b.imageUrl)} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-1">
                  <div className="font-semibold">{b.title}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(b.createdAt || '').toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="btn btn-outline"
                      onClick={() => { setEditing(b); reset(b) }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => del(b.id)}
                      disabled={deleteBlog.isPending}
                    >
                      {deleteBlog.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
