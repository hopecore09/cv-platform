import { useState } from 'react'
import { Table, Button, Badge, Form } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function AdminUsers() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const [selected, setSelected] = useState([])

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
    staleTime: 1000 * 60 * 2
  })

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries(['admin-users'])
  })

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries(['admin-users'])
  })

  const handleDeleteSelected = () => {
    if (selected.length === 0) return
    if (window.confirm(`Delete ${selected.length} user(s)?`)) {
      Promise.all(selected.map(id => deleteUser.mutate(id)))
      setSelected([])
    }
  }

  const handleMakeRecruiter = () => {
    if (selected.length === 0) return
    Promise.all(selected.map(id => changeRole.mutate({ id, role: 'recruiter' })))
    setSelected([])
  }

  const handleMakeCandidate = () => {
    if (selected.length === 0) return
    Promise.all(selected.map(id => changeRole.mutate({ id, role: 'candidate' })))
    setSelected([])
  }

  return (
    <div>
      <h2 className="mb-4">{t('app.users')}</h2>

      <div className="d-flex align-items-center gap-2 p-2 mb-3 bg-light rounded flex-wrap">
        <span className="fw-semibold me-2">{selected.length} selected</span>
        {selected.length > 0 ? (
          <>
            <Button size="sm" variant="outline-primary" onClick={handleMakeRecruiter}>
              Make Recruiter
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={handleMakeCandidate}>
              Make Candidate
            </Button>
            <Button size="sm" variant="outline-danger" onClick={handleDeleteSelected}>
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
                onChange={e => setSelected(e.target.checked ? users.map(u => u.id) : [])}
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