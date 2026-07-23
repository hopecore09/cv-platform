import { useParams, Link } from 'react-router-dom'
import { Card, Badge, Button } from 'react-bootstrap'
import { useQuery } from '@tanstack/react-query'
import api from '../api'

export default function CVPage() {
  const { id } = useParams()
  const { data: cv, isLoading } = useQuery({
    queryKey: ['cv', id],
    queryFn: () => api.get(`/cv/${id}`).then(r => r.data),
    staleTime: 1000 * 60 * 2
  })

  if (isLoading) return <div className="text-center py-5">Loading...</div>
  if (!cv) return <div className="text-center py-5">CV not found</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{cv.user?.firstName} {cv.user?.lastName}</h2>
        <Link to="/profile"><Button variant="outline-secondary">Back</Button></Link>
      </div>

      <Card className="mb-4"><Card.Body>
        <h5>{cv.position?.title}</h5>
        <Badge bg={cv.isPublished ? 'success' : 'warning'}>
          {cv.isPublished ? 'Published' : 'Draft'}
        </Badge>
      </Card.Body></Card>

      {cv.attrs?.map(a => {
        const val = a.value?.value !== undefined ? a.value.value : a.value
        const displayVal = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '')
        const isEmpty = !a.isFilled || val === null || val === '' || val === undefined

        return (
          <div key={a.id} className="d-flex py-2 border-bottom">
            <div className="fw-bold" style={{ width: '200px' }}>{a.attribute?.name || 'Attribute'}</div>
            <div className={isEmpty ? 'text-danger fst-italic' : ''}>
              {isEmpty ? '—' : displayVal}
            </div>
          </div>
        )
      })}
    </div>
  )
}