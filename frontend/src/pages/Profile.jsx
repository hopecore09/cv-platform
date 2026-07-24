import { useEffect } from 'react'
import { Card, Form, Row, Col, Button, Badge } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import DynamicForm from '../components/DynamicForm'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const { register, reset, handleSubmit } = useForm()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile/me').then(r => r.data),
    staleTime: 1000 * 60 * 5,
    enabled: user?.role === 'candidate' || user?.role === 'admin'
  })

  const { data: attributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.get('/attributes').then(r => r.data),
    staleTime: 1000 * 60 * 10
  })

  const update = useMutation({
    mutationFn: (data) => api.put('/profile/me', data),
    onSuccess: () => qc.invalidateQueries(['profile'])
  })

  useEffect(() => {
    if (profile) {
      const formData = { ...profile }
      profile.profileAttrs?.forEach(p => {
        const val = p.value
        formData[p.attributeId] = val?.value !== undefined ? val.value : val
      })
      reset(formData)
    }
  }, [profile, reset])

  const onSubmit = (data) => {
    const attrData = {}
    attributes?.forEach(a => {
      if (data[a.id] !== undefined && data[a.id] !== null && data[a.id] !== '') {
        attrData[a.id] = data[a.id]
      }
    })
    update.mutate({ firstName: data.firstName, lastName: data.lastName, attributes: attrData })
  }

  const formValues = {}
  profile?.profileAttrs?.forEach(p => {
    const val = p.value
    formValues[p.attributeId] = val?.value !== undefined ? val.value : val
  })

  if (user?.role === 'recruiter') {
    return <div className="text-center py-5">Recruiters cannot access profile editing</div>
  }

  return (
    <div>
      <h2 className="mb-4">{t('profile.title')}</h2>

      <Card className="mb-4">
        <Card.Header>Me</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group><Form.Label>{t('profile.firstName')}</Form.Label><Form.Control {...register('firstName')} /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group><Form.Label>{t('profile.lastName')}</Form.Label><Form.Control {...register('lastName')} /></Form.Group>
              </Col>
            </Row>
            <Form.Group><Form.Label>{t('profile.email')}</Form.Label><Form.Control value={profile?.email || ''} disabled /></Form.Group>
            <Button type="submit" className="mt-3" disabled={update.isPending}>
              {update.isPending ? 'Saving...' : 'Save'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Info</Card.Header>
        <Card.Body>
          <DynamicForm
            attributes={attributes}
            values={formValues}
            onChange={(id, value) => {
              const newProfile = { ...profile }
              const existing = newProfile.profileAttrs?.find(p => p.attributeId === id)
              if (existing) {
                existing.value = value
              } else {
                if (!newProfile.profileAttrs) newProfile.profileAttrs = []
                newProfile.profileAttrs.push({ attributeId: id, value })
              }
              const formData = { ...newProfile }
              newProfile.profileAttrs?.forEach(p => {
                const val = p.value
                formData[p.attributeId] = val?.value !== undefined ? val.value : val
              })
              reset(formData)
            }}
          />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>CVs</Card.Header>
        <Card.Body>
          {profile?.cvs?.length ? (
            <div className="list-group">
              {profile.cvs.map(cv => (
                <Link key={cv.id} to={`/cv/${cv.id}`} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  {cv.position?.title}
                  <Badge bg={cv.isPublished ? 'success' : 'warning'}>
                    {cv.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-3">No CVs yet</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}