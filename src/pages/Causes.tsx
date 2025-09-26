import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { mediaSrc } from '../lib/api'
import { Field, Card, Toolbar } from '../components/Field'
import ImagePicker from '../components/ImagePicker'
import {
  useCauses,
  useCreateCause,
  useUpdateCause,
  useDeleteCause,
  type Cause
} from '../lib/queries'

export default function Causes() {
  const [editing, setEditing] = useState<Cause | null>(null)
  const { register, handleSubmit, reset, setValue, watch } = useForm<Cause>({
    defaultValues: { status: 'active' } as any
  })
  const img = watch('imageUrl')

  // Tanstack Query hooks
  const { data: list = [], isLoading } = useCauses()
  const createCause = useCreateCause()
  const updateCause = useUpdateCause()
  const deleteCause = useDeleteCause()

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editing) {
        await updateCause.mutateAsync({ ...data, id: editing.id })
      } else {
        await createCause.mutateAsync(data)
      }
      reset()
      setEditing(null)
    } catch (e) {
      // Error is already handled by the mutation
    }
  })

  const startEdit = (c: Cause) => {
    setEditing(c)
    reset(c)
  }

  const del = async (id: string) => {
    if (!confirm('Delete this cause?')) return
    await deleteCause.mutateAsync(id)
  }
  return (
    <div className="space-y-6">
      <Card
        title={editing ? 'Edit Cause' : 'New Cause'}
        footer={
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => { reset({} as any); setEditing(null) }}
            >
              Reset
            </button>
            <button
              className="btn btn-primary"
              onClick={onSubmit}
              disabled={createCause.isPending || updateCause.isPending}
            >
              {createCause.isPending || updateCause.isPending
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
          <Field label="Category">
            <input className="input" {...register('category', { required: true })} />
          </Field>
          <Field label="Goal Amount">
            <input
              className="input"
              {...register('goalAmount', { required: true })}
              placeholder="40000.00"
            />
          </Field>
          <Field label="Status">
            <select className="input" {...register('status', { required: true })}>
              <option value="active">active</option>
              <option value="completed">completed</option>
              <option value="archived">archived</option>
            </select>
          </Field>
          <Field label="Description" hint="A brief description for the cause">
            <textarea
              className="input"
              rows={5}
              {...register('description', { required: true })}
            />
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
          <div className="text-lg font-semibold">Causes</div>
          <div className="grow" />
          <button
            className="btn btn-outline"
            onClick={() => { reset({ status: 'active' } as any); setEditing(null) }}
          >
            New
          </button>
        </Toolbar>

        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading causes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(c => (
              <div key={c.id} className="rounded-2xl overflow-hidden border bg-white">
                <img src={mediaSrc(c.imageUrl)} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-1">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-slate-500">{c.category}</div>
                  <div className="text-sm text-slate-500">
                    Goal: ${Number(c.goalAmount).toLocaleString()} •
                    Raised: ${Number(c.raisedAmount || 0).toLocaleString()}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="btn btn-outline"
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => del(c.id)}
                      disabled={deleteCause.isPending}
                    >
                      {deleteCause.isPending ? 'Deleting...' : 'Delete'}
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
