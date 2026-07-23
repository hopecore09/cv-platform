import { useState } from 'react'
import { Table, Button, Badge } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'

export default function AdminUsers() {
  const qc = useQueryClient()
  const [message, setMessage] = useState('')

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
    staleTime: 1000 * 60 * 2
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      qc.invalidateQueries(['admin-users'])
      setMessage({ type: 'success', text: 'Role updated!' })
      setTimeout(() => setMessage(''), 3000)
    },
    onError: () => setMessage({ type: 'danger', text: 'Failed to update role' })
  })

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['admin-users'])
      setMessage({ type: 'success', text: 'User deleted!' })
      setTimeout(() => setMessage(''), 3000)
    }
  })

  return (
    <div>
      <h2 className="mb-4">👥 Manage Users</h2>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <Table hover responsive>
        <thead>
          <tr><th>ID</th><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users?.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>
                <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'recruiter' ? 'warning' : 'secondary'}>
                  {u.role}
                </Badge>
              </td>
              <td>
                {u.role !== 'admin' && (
                  <Button size="sm" variant="outline-primary" onClick={() => changeRole.mutate({ id: u.id, role: 'recruiter' })}>
                    Make Recruiter
                  </Button>
                )}
                {u.role === 'recruiter' && (
                  <Button size="sm" variant="outline-secondary" className="ms-1" onClick={() => changeRole.mutate({ id: u.id, role: 'candidate' })}>
                    Make Candidate
                  </Button>
                )}
                {u.role !== 'admin' && (
                  <Button size="sm" variant="outline-danger" className="ms-1" onClick={() => deleteUser.mutate(u.id)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}