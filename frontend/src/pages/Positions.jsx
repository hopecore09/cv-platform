import { useState } from 'react'
import { Table, Form, Button, InputGroup, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function Positions() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions', search],
    queryFn: () => api.get('/positions', { params: { search } }).then(r => r.data),
    staleTime: 1000 * 60 * 2
  })

  const remove = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => api.delete(`/positions/${id}`))),
    onSuccess: () => { qc.invalidateQueries(['positions']); setSelected([]) }
  })

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this position?')) remove.mutate([id])
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('pos.title')}</h2>
        {user?.role === 'recruiter' && (
          <Button onClick={() => navigate('/positions/new')}><Plus size={18} /> {t('app.new')}</Button>
        )}
      </div>

      <InputGroup className="mb-3">
        <InputGroup.Text><Search size={18} /></InputGroup.Text>
        <Form.Control placeholder={t('app.search')} value={search} onChange={e => setSearch(e.target.value)} />
      </InputGroup>

      {selected.length > 0 && (
        <div className="mb-3 p-2 bg-light rounded d-flex align-items-center gap-3">
          <span>{selected.length} selected</span>
          <Button variant="outline-danger" size="sm" onClick={() => remove.mutate(selected)}>
            {t('app.delete')}
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">{t('app.loading')}</div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check
                  checked={selected.length === positions?.length}
                  onChange={e => setSelected(e.target.checked ? positions.map(p => p.id) : [])}
                />
              </th>
              <th>{t('pos.title')}</th>
              <th>{t('pos.company')}</th>
              <th>{t('pos.level')}</th>
              <th>{t('pos.cvs')}</th>
              <th>{t('pos.status')}</th>
            </tr>
          </thead>
          <tbody>
            {positions?.length ? positions.map(p => (
              <tr key={p.id} className={selected.includes(p.id) ? 'table-active' : ''}>
                <td>
                  <Form.Check
                    checked={selected.includes(p.id)}
                    onChange={() => setSelected(prev =>
                      prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                    )}
                  />
                </td>
                <td>
                  <Link to={`/positions/${p.id}`}>{p.title}</Link>
                  <span className="ms-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-secondary"
                      onClick={(e) => { e.stopPropagation(); navigate(`/positions/${p.id}/edit`) }}
                      style={{ textDecoration: 'none' }}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={(e) => handleDelete(p.id, e)}
                      style={{ textDecoration: 'none' }}
                    >
                      🗑️
                    </Button>
                  </span>
                </td>
                <td>{p.company || '-'}</td>
                <td>{p.level && <Badge bg="secondary">{p.level}</Badge>}</td>
                <td><Badge bg="info">{p._count?.cvs || 0}</Badge></td>
                <td>
                  <Badge bg={p.isPublic ? 'success' : 'warning'}>
                    {p.isPublic ? t('pos.public') : t('pos.private')}
                  </Badge>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center py-4">{t('app.noData')}</td></tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  )
}