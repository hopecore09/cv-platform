import { useState } from 'react'
import { Table, Form, Button, InputGroup, Badge, Modal } from 'react-bootstrap'
import { Search, Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function Attributes() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selected, setSelected] = useState([])
  const [show, setShow] = useState(false)
  const [editing, setEditing] = useState(null)
  const qc = useQueryClient()

  const { data: attrs, isLoading } = useQuery({
    queryKey: ['attributes', search, category],
    queryFn: () => api.get('/attributes', { params: { search, category } }).then(r => r.data),
    staleTime: 1000 * 60 * 5
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/attributes/categories').then(r => r.data),
    staleTime: 1000 * 60 * 10
  })

  const remove = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => api.delete(`/attributes/${id}`))),
    onSuccess: () => { qc.invalidateQueries(['attributes']); setSelected([]) }
  })

  const save = useMutation({
    mutationFn: (data) => data.id ? api.put(`/attributes/${data.id}`, data) : api.post('/attributes', data),
    onSuccess: () => { qc.invalidateQueries(['attributes']); setShow(false); setEditing(null) }
  })

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('attr.title')}</h2>
        <Button onClick={() => { setEditing(null); setShow(true) }}><Plus size={18} /> {t('app.new')}</Button>
      </div>

      <div className="d-flex gap-3 mb-3">
        <InputGroup style={{ flex: 1 }}>
          <InputGroup.Text><Search size={18} /></InputGroup.Text>
          <Form.Control placeholder={t('app.search')} value={search} onChange={e => setSearch(e.target.value)} />
        </InputGroup>
        <Form.Select style={{ width: '200px' }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories?.map(c => <option key={c} value={c}>{c}</option>)}
        </Form.Select>
      </div>

      {selected.length > 0 && (
        <div className="mb-3 p-2 bg-light rounded d-flex align-items-center gap-3">
          <span>{selected.length} selected</span>
          <Button variant="outline-danger" size="sm" onClick={() => remove.mutate(selected)}>{t('app.delete')}</Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">{t('app.loading')}</div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th><Form.Check checked={selected.length === attrs?.length} onChange={e => setSelected(e.target.checked ? attrs.map(a => a.id) : [])} /></th>
              <th>{t('attr.name')}</th><th>{t('attr.category')}</th><th>{t('attr.type')}</th><th>{t('attr.required')}</th>
            </tr>
          </thead>
          <tbody>
            {attrs?.length ? attrs.map(a => (
              <tr key={a.id} className={selected.includes(a.id) ? 'table-active' : ''}>
                <td>
                  <Form.Check
                    checked={selected.includes(a.id)}
                    onChange={() => setSelected(prev =>
                      prev.includes(a.id) ? prev.filter(id => id !== a.id) : [...prev, a.id]
                    )}
                  />
                </td>
                <td>
                  {a.name}
                  <span className="ms-2">
                    <Button variant="link" size="sm" className="p-0 text-secondary" onClick={() => { setEditing(a); setShow(true) }}>✏️</Button>
                    <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => remove.mutate([a.id])}>🗑️</Button>
                  </span>
                </td>
                <td><Badge bg="secondary">{a.category}</Badge></td>
                <td>{a.type}</td>
                <td>{a.required ? '✅' : '❌'}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center py-4">{t('app.noData')}</td></tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>{editing?.id ? 'Edit' : 'New'} Attribute</Modal.Title></Modal.Header>
        <Form onSubmit={e => {
          e.preventDefault()
          const data = Object.fromEntries(new FormData(e.target))
          save.mutate({ ...data, id: editing?.id, options: data.options?.split(',').map(s => s.trim()) })
        }}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>{t('attr.name')}</Form.Label><Form.Control name="name" defaultValue={editing?.name} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>{t('attr.category')}</Form.Label><Form.Control name="category" defaultValue={editing?.category} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>{t('attr.type')}</Form.Label>
              <Form.Select name="type" defaultValue={editing?.type}>
                {['string', 'text', 'numeric', 'date', 'boolean', 'dropdown'].map(t => <option key={t}>{t}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3"><Form.Label>{t('attr.options')} (comma separated)</Form.Label><Form.Control name="options" defaultValue={editing?.options?.join(', ')} /></Form.Group>
            <Form.Group className="mb-3"><Form.Check type="checkbox" name="required" label={t('attr.required')} defaultChecked={editing?.required} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>{t('attr.description')}</Form.Label><Form.Control name="description" defaultValue={editing?.description} /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>{t('app.cancel')}</Button>
            <Button type="submit" variant="primary">{t('app.save')}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}