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

  const canManage = ['recruiter', 'admin'].includes(user?.role)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('pos.title')}</h2>
        {canManage && (
          <Button onClick={() => navigate('/positions/new')}>
            <Plus size={18} /> {t('app.new')}
          </Button>
        )}
      </div>

      <InputGroup className="mb-3">
        <InputGroup.Text><Search size={18} /></InputGroup.Text>
        <Form.Control placeholder={t('app.search')} value={search} onChange={e => setSearch(e.target.value)} />
      </InputGroup>

      <div className="d-flex align-items-center gap-3 p-2 mb-3 bg-light rounded">
        {selected.length > 0 ? (
          <>
            <span className="fw-semibold">{selected.length} selected</span>
            {canManage && (
              <Button variant="outline-danger" size="sm" onClick={() => remove.mutate(selected)}>
                {t('app.delete')}
              </Button>
            )}
          </>
        ) : (
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Select items to delete</span>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-5">{t('app.loading')}</div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Form.Check
                  checked={selected.length === positions?.length && positions?.length > 0}
                  onChange={e => setSelected(e.target.checked ? positions.map(p => p.id) : [])}
                />
              </th>
              <th>{t('pos.title')}</th>
              <th>{t('pos.company')}</th>
              <th>{t('pos.level')}</th>
              <th>{t('pos.cvs')}</th>
            </tr>
          </thead>
          <tbody>
            {positions?.length ? positions.map(p => (
              <tr
                key={p.id}
                className={selected.includes(p.id) ? 'table-active' : ''}
                onDoubleClick={() => {
                  if (canManage) navigate(`/positions/${p.id}/edit`)
                }}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <Form.Check
                    checked={selected.includes(p.id)}
                    onChange={() => setSelected(prev =>
                      prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                    )}
                  />
                </td>
                <td><Link to={`/positions/${p.id}`}>{p.title}</Link></td>
                <td>{p.company || '-'}</td>
                <td>{p.level && <Badge bg="secondary">{p.level}</Badge>}</td>
                <td><Badge bg="info">{p._count?.cvs || 0}</Badge></td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4">{t('app.noData')}</td></tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  )
}