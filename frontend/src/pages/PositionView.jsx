import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Button, Badge, Form } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { DynamicForm } from '../components/DynamicForm'
import { useTranslation } from 'react-i18next'

export default function PositionView() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [cvData, setCvData] = useState({})

  const { data: position } = useQuery({
    queryKey: ['position', id],
    queryFn: () => api.get(`/positions/${id}`).then(r => r.data),
    staleTime: 1000 * 60 * 5
  })

  const { data: myCV } = useQuery({
    queryKey: ['my-cv', id],
    queryFn: () => api.get('/cv/my').then(r => r.data.find(c => c.positionId === +id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 2
  })

  useEffect(() => {
    if (myCV) {
      api.get(`/cv/${myCV.id}`).then(r => {
        const data = {}
        r.data.attrs?.forEach(a => {
          const val = a.value
          data[a.attributeId] = val?.value !== undefined ? val.value : val
        })
        setCvData(data)
      })
    }
  }, [myCV])

  const saveCV = useMutation({
    mutationFn: () => api.post('/cv', { positionId: +id, attributes: cvData }),
    onSuccess: () => qc.invalidateQueries(['my-cv', id])
  })

  const publishCV = useMutation({
    mutationFn: () => api.put(`/cv/${myCV?.id}/publish`),
    onSuccess: () => qc.invalidateQueries(['my-cv', id])
  })

  if (!position) return <div className="text-center py-5">{t('app.loading')}</div>

  const isRecruiter = ['recruiter', 'admin'].includes(user?.role)
  const canEdit = position.recruiterId === user?.id || isRecruiter
  const positionAttrs = position.attrs?.map(a => a.attribute) || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2>{position.title}</h2>
          {position.company && <h6 className="text-muted">{position.company} • {position.level || 'No level'}</h6>}
          <Badge bg={position.isPublic ? 'success' : 'warning'}>{position.isPublic ? 'Public' : 'Private'}</Badge>
          <Badge bg="info" className="ms-2">{position.cvs?.length || 0} CVs</Badge>
        </div>
        <div>
          {canEdit && <Button variant="outline-primary" onClick={() => navigate(`/positions/${id}/edit`)}>Edit</Button>}
          <Button variant="outline-secondary" className="ms-2" onClick={() => navigate('/positions')}>Back</Button>
        </div>
      </div>

      {position.description && <Card className="mb-4"><Card.Body>{position.description}</Card.Body></Card>}

      <Card className="mb-4">
        <Card.Header><h5 className="mb-0">My CV</h5></Card.Header>
        <Card.Body>
          {myCV ? (
            <>
              <DynamicForm attributes={positionAttrs} values={cvData} onChange={(id, value) => setCvData({ ...cvData, [id]: value })} />
              <div className="mt-3">
                <Button variant="primary" onClick={() => saveCV.mutate()} disabled={saveCV.isPending}>
                  {saveCV.isPending ? 'Saving...' : 'Save CV'}
                </Button>
                {!myCV.isPublished ? (
                  <Button variant="success" className="ms-2" onClick={() => publishCV.mutate()} disabled={publishCV.isPending}>
                    {t('cv.publish')}
                  </Button>
                ) : (
                  <Badge bg="success" className="ms-2">Published</Badge>
                )}
              </div>
            </>
          ) : (
            <Button onClick={() => saveCV.mutate()}>Create CV for this position</Button>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}