import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Select from 'react-select'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function PositionForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const qc = useQueryClient()
  const [error, setError] = useState('')
  const [attrs, setAttrs] = useState([])

  const { data: position } = useQuery({
    queryKey: ['position', id],
    queryFn: () => id ? api.get(`/positions/${id}`).then(r => r.data) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })

  const { data: allAttrs } = useQuery({
    queryKey: ['all-attributes'],
    queryFn: () => api.get('/attributes').then(r => r.data),
    staleTime: 1000 * 60 * 10
  })

  useEffect(() => {
    if (position?.attrs) {
      setAttrs(position.attrs.map(a => ({ value: a.attributeId, label: a.attribute.name })))
    }
  }, [position])

  const save = useMutation({
    mutationFn: (data) => {
      const payload = {
        title: data.title,
        description: data.description,
        company: data.company || null,
        level: data.level || null,
        attributeIds: attrs.map(a => a.value)
      }
      return id ? api.put(`/positions/${id}`, payload) : api.post('/positions', payload)
    },
    onSuccess: () => { qc.invalidateQueries(['positions']); navigate('/positions') },
    onError: () => setError('Save failed')
  })

  const submit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    save.mutate(data)
  }

  return (
    <div>
      <h2 className="mb-4">{id ? 'Edit' : 'New'} Position</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={submit}>
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group><Form.Label>Title</Form.Label><Form.Control name="title" defaultValue={position?.title} required /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>Company</Form.Label><Form.Control name="company" defaultValue={position?.company} /></Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group><Form.Label>Level</Form.Label>
                  <Form.Select name="level" defaultValue={position?.level}>
                    <option value="">Select...</option>
                    {['Junior', 'Middle', 'Senior', 'Lead', 'C-level'].map(l => <option key={l}>{l}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} name="description" defaultValue={position?.description} /></Form.Group>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Form.Label>Attributes</Form.Label>
            <Select
              isMulti
              options={allAttrs?.map(a => ({ value: a.id, label: a.name })) || []}
              value={attrs}
              onChange={setAttrs}
              placeholder="Select attributes..."
            />
          </Card.Body>
        </Card>

        <div className="mt-4">
          <Button type="submit" variant="primary" disabled={save.isPending}>
            {save.isPending ? 'Saving...' : t('app.save')}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate('/positions')}>
            {t('app.cancel')}
          </Button>
        </div>
      </Form>
    </div>
  )
}