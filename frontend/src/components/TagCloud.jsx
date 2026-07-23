import { Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function TagCloud({ tags }) {
  if (!tags?.length) return null

  return (
    <div className="d-flex flex-wrap gap-2">
      {tags.map(tag => (
        <Link key={tag} to={`/positions?search=${tag}`}>
          <Badge bg="secondary" pill className="px-3 py-2" style={{ fontSize: '0.9rem' }}>
            #{tag}
          </Badge>
        </Link>
      ))}
    </div>
  )
}