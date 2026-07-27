import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Button, Badge, ListGroup, Row, Col } from 'react-bootstrap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import DynamicForm from '../components/DynamicForm'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

export default function PositionView() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { isCandidate, canViewCVs } = useAuth()
  const [cvData, setCvData] = useState({})
  const [selectedCvId, setSelectedCvId] = useState(null)

  const { data: position } = useQuery({
    queryKey: ['position', id],
    queryFn: () => api.get(`/positions/${id}`).then(r => r.data)
  })

  const { data: myCV } = useQuery({
    queryKey: ['my-cv', id],
    queryFn: async () => {
      const res = await api.get('/cv/my')
      return res.data.find(c => c.positionId === +id) || null
    },
    enabled: !!id && isCandidate
  })

  const { data: allCVs } = useQuery({
    queryKey: ['position-cvs', id],
    queryFn: () => api.get(`/cv/position/${id}`).then(r => r.data),
    enabled: !!id && canViewCVs
  })

  useEffect(() => {
    const cvId = myCV?.id || selectedCvId
    if (!cvId) return

    api.get(`/cv/${cvId}`).then(r => {
      const data = {}
      r.data.attrs?.forEach(a => {
        const val = a.value
        data[a.attributeId] = val?.value !== undefined ? val.value : val
      })
      setCvData(data)
    })
  }, [myCV?.id, selectedCvId])

  useEffect(() => {
    if (myCV?.id) {
      setSelectedCvId(myCV.id)
    }
  }, [myCV?.id])

  const handleSelectCandidate = (cvId) => {
    setSelectedCvId(cvId)
  }

  const saveCV = useMutation({
    mutationFn: () => api.post('/cv', { positionId: +id, attributes: cvData }),
    onSuccess: () => qc.invalidateQueries(['my-cv', id])
  })

  const publishCV = useMutation({
    mutationFn: () => api.put(`/cv/${myCV?.id}/publish`),
    onSuccess: () => qc.invalidateQueries(['my-cv', id])
  })

  if (!position) return <div className="text-center py-5">{t('app.loading')}</div>

  const selectedCV = allCVs?.find(c => c.id === selectedCvId)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2>{position.title}</h2>
          {position.company && <h6 className="text-muted">{position.company} • {position.level || 'No level'}</h6>}
          <Badge bg="info">{position.cvs?.length || 0} CVs</Badge>
        </div>
        <div>
          {canViewCVs && (
            <Button variant="outline-primary" size="sm" onClick={() => navigate(`/positions/${id}/edit`)}>
              {t('position.edit')}
            </Button>
          )}
          <Button variant="outline-secondary" size="sm" className="ms-2" onClick={() => navigate('/positions')}>
            {t('position.back')}
          </Button>
        </div>
      </div>

      {position.description && <Card className="mb-4"><Card.Body>{position.description}</Card.Body></Card>}

      <Card>
        <Card.Header>
          <h5 className="mb-0">CV</h5>
        </Card.Header>
        <Card.Body>
          {isCandidate && !myCV && (
            <Button onClick={() => saveCV.mutate()}>{t('position.createCV')}</Button>
          )}

          {isCandidate && myCV && (
            <>
              <DynamicForm
                attributes={position.attrs?.map(a => a.attribute) || []}
                values={cvData}
                onChange={(id, value) => setCvData({ ...cvData, [id]: value })}
              />
              <div className="mt-3">
                <Button variant="primary" onClick={() => saveCV.mutate()} disabled={saveCV.isPending}>
                  {saveCV.isPending ? 'Saving...' : t('position.saveCV')}
                </Button>
                {!myCV.isPublished && (
                  <Button variant="success" className="ms-2" onClick={() => publishCV.mutate()} disabled={publishCV.isPending}>
                    {t('cv.publish')}
                  </Button>
                )}
                {myCV.isPublished && <Badge bg="success" className="ms-2">Published</Badge>}
              </div>
            </>
          )}

          {canViewCVs && (
            <>
              {allCVs?.length > 0 ? (
                <Row>
                  <Col md={4}>
                    <Card className="mb-3">
                      <Card.Header>
                        <small className="text-muted">Candidates</small>
                      </Card.Header>
                      <ListGroup variant="flush">
                        {allCVs.map(c => (
                          <ListGroup.Item
                            key={c.id}
                            action
                            active={selectedCvId === c.id}
                            onClick={() => handleSelectCandidate(c.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <span>
                                {c.user?.firstName} {c.user?.lastName}
                              </span>
                              <Badge bg={c.isPublished ? 'success' : 'warning'}>
                                {c.isPublished ? 'Pub' : 'Draft'}
                              </Badge>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card>
                  </Col>

                  <Col md={8}>
                    {selectedCV ? (
                      <>
                        <div className="mb-2">
                          <strong>{selectedCV.user?.firstName} {selectedCV.user?.lastName}</strong>
                          <Badge bg={selectedCV.isPublished ? 'success' : 'warning'} className="ms-2">
                            {selectedCV.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <DynamicForm
                          attributes={position.attrs?.map(a => a.attribute) || []}
                          values={cvData}
                          readOnly={true}
                        />
                      </>
                    ) : (
                      <p className="text-muted text-center py-5">Select a candidate to view their CV</p>
                    )}
                  </Col>
                </Row>
              ) : (
                <p className="text-muted">{t('position.noCVs')}</p>
              )}
            </>
          )}

          {!isCandidate && !canViewCVs && (
            <p className="text-muted">{t('position.noCV')}</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}