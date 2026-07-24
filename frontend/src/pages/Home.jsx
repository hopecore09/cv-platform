import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../api'

export default function Home() {
  const { t } = useTranslation()

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
    staleTime: 1000 * 60 * 10
  })

  const { data: popular } = useQuery({
    queryKey: ['popular'],
    queryFn: () => api.get('/positions', { params: { sort: 'popular' } }).then(r => r.data),
    staleTime: 1000 * 60 * 5
  })

  return (
    <div>
      <h1 className="mb-4">{t('home.statistics')}</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Card><Card.Body>
            <h5>{t('home.positions')}</h5>
            <h2>{stats?.positions || 0}</h2>
          </Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card><Card.Body>
            <h5>{t('home.cvs')}</h5>
            <h2>{stats?.cvs || 0}</h2>
          </Card.Body></Card>
        </Col>
        <Col md={4}>
          <Card><Card.Body>
            <h5>{t('home.attributes')}</h5>
            <h2>{stats?.attributes || 0}</h2>
          </Card.Body></Card>
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
