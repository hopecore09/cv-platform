import { useState } from 'react'
import { Table, Button, Badge, Form } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

export default function AdminUsers() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { isAdmin } = useAuth()
  const [selected, setSelected] = useState([])

  if (!isAdmin) {
    return <div className="text-center py-5">Access denied</div>
  }

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data)
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries(['admin-users'])
  })

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries(['admin-users'])
  })

  const handleBulkAction = async (action, role) => {
    if (selected.length === 0) return
    if (action === 'delete' && !window.confirm(`Delete ${selected.length} user(s)?`)) return

    const promises = selected.map(id => {
      if (action === 'delete') return deleteUser.mutate(id)
      if (action === 'role') return changeRole.mutate({ id, role })
    })
    await Promise.all(promises)
    setSelected([])
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(users.map(u => u.id))
    } else {
      setSelected([])
    }
  }

  return (
    <div>
      <h2 className="mb-4">{t('app.users')}</h2>

      <div className="d-flex align-items-center gap-2 p-2 mb-3 rounded flex-wrap" style={{ background: 'var(--bs-tertiary-bg)' }}>
        <span className="fw-semibold me-2">{selected.length} selected</span>
        {selected.length > 0 ? (
          <>
            <Button size="sm" variant="outline-primary" onClick={() => handleBulkAction('role', 'recruiter')}>
              Make Recruiter
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => handleBulkAction('role', 'candidate')}>
              Make Candidate
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => handleBulkAction('delete')}>
              Delete
            </Button>
          </>
        ) : (
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Select users to perform actions</span>
        )}
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <Form.Check
                checked={selected.length === users?.length && users?.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(u => (
            <tr
              key={u.id}
              className={selected.includes(u.id) ? 'table-active' : ''}
              onClick={() => setSelected(prev =>
                prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
              )}
              style={{ cursor: 'pointer' }}
            >
              <td onClick={e => e.stopPropagation()}>
                <Form.Check
                  checked={selected.includes(u.id)}
                  onChange={() => setSelected(prev =>
                    prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                  )}
                />
              </td>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.firstName} {u.lastName}</td>
              <td>
                <Badge bg={u.role === 'admin' ? 'danger' : u.role === 'recruiter' ? 'warning' : 'secondary'}>
                  {u.role}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}