import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [positions, cvs, attributes] = await Promise.all([
        api.get('/positions'),
        api.get('/cv/all'),
        api.get('/attributes')
      ])
      return {
        positions: positions.data.length,
        cvs: cvs.data.length,
        attributes: attributes.data.length
      }
    },
    enabled: isAuthenticated
  })

  const { data: popular } = useQuery({
    queryKey: ['popular'],
    queryFn: () => api.get('/positions', { params: { sort: 'popular' } }).then(r => r.data),
    enabled: isAuthenticated
  })

  if (!isAuthenticated) {
    return (
      <div className="text-center py-5">
        <h4>Please log in to view dashboard</h4>
        <Button as={Link} to="/login" variant="primary" className="mt-3">Go to Login</Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4">{t('home.statistics')}</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card><Card.Body><h5>{t('home.positions')}</h5><h2>{stats?.positions || 0}</h2></Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card><Card.Body><h5>{t('home.cvs')}</h5><h2>{stats?.cvs || 0}</h2></Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card><Card.Body><h5>{t('home.attributes')}</h5><h2>{stats?.attributes || 0}</h2></Card.Body></Card>
        </Col>
      </Row>

      <h3 className="mb-3">{t('home.popularPositions')}</h3>
      {popular?.slice(0, 5).map(p => (
        <Card key={p.id} className="mb-2">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <Link to={`/positions/${p.id}`}>{p.title}</Link>
            <Badge bg="info">{p._count?.cvs || 0} CVs</Badge>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}