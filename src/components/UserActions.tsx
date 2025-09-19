'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
import { KratosIdentity } from '@/lib/kratos'
import { updateUserAction, deleteUserAction } from '@/app/actions'

interface UserActionsProps {
  user: KratosIdentity
}

function UpdateButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Updating...' : 'Update User'}
    </button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

export function UserActions({ user }: UserActionsProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [updateState, updateFormAction] = useActionState(updateUserAction, null)
  const [deleteState, deleteFormAction] = useActionState(deleteUserAction, null)


  return (
    <>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowEditForm(true)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
        <form
          action={deleteFormAction}
          style={{ display: 'inline' }}
          onSubmit={(e) => {
            if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
              e.preventDefault()
            }
          }}
        >
          <input type="hidden" name="id" value={user.id} />
          <DeleteButton />
        </form>
      </div>

      {(updateState?.error || deleteState?.error) && (
        <div className="mt-2 text-xs text-red-600">
          {updateState?.error || deleteState?.error}
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {updateState?.error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">{updateState.error}</p>
                </div>
              )}

              <form action={updateFormAction} className="space-y-4">
                <input type="hidden" name="id" value={user.id} />
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={user.traits.email}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={typeof user.traits.name === 'string' ? user.traits.name : ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-xs text-yellow-700">
                    Note: Password cannot be changed through this interface. 
                    Users must use the password reset flow.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <UpdateButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}