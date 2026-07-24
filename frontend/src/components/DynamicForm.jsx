import { Form } from 'react-bootstrap'

export default function DynamicForm({ attributes, values, onChange, readOnly }) {
  if (!attributes?.length) return null

  return attributes.map(a => {
    const raw = values?.[a.id]
    const v = raw?.value !== undefined ? raw.value : raw ?? ''

    return (
      <Form.Group key={a.id} className="mb-3">
        <Form.Label>{a.name}{a.required && <span className="text-danger ms-1">*</span>}</Form.Label>
        {a.type === 'boolean' ? (
          <Form.Check type="switch" checked={!!v} onChange={e => onChange?.(a.id, e.target.checked)} disabled={readOnly} />
        ) : a.type === 'dropdown' ? (
          <Form.Select value={v} onChange={e => onChange?.(a.id, e.target.value)} disabled={readOnly}>
            <option value="">Select...</option>
            {(a.options || []).map(o => <option key={o} value={o}>{o}</option>)}
          </Form.Select>
        ) : a.type === 'text' ? (
          <Form.Control as="textarea" rows={3} value={v} onChange={e => onChange?.(a.id, e.target.value)} disabled={readOnly} />
        ) : a.type === 'date' ? (
          <Form.Control type="date" value={v} onChange={e => onChange?.(a.id, e.target.value)} disabled={readOnly} />
        ) : a.type === 'numeric' ? (
          <Form.Control type="number" step="any" value={v} onChange={e => onChange?.(a.id, parseFloat(e.target.value) || 0)} disabled={readOnly} />
        ) : (
          <Form.Control type="text" value={v} onChange={e => onChange?.(a.id, e.target.value)} disabled={readOnly} placeholder={a.description} />
        )}
        {a.description && <Form.Text className="text-muted">{a.description}</Form.Text>}
      </Form.Group>
    )
  })
}