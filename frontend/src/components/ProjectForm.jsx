import { useState } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'

export default function ProjectForm({ show, onHide, onSave, project }) {
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')
  const [startDate, setStartDate] = useState(project?.startDate?.slice(0, 10) || '')
  const [endDate, setEndDate] = useState(project?.endDate?.slice(0, 10) || '')
  const [tags, setTags] = useState(project?.tags?.join(', ') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name,
      description,
      startDate,
      endDate: endDate || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    })
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{project?.id ? 'Edit' : 'New'} Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={e => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Node.js, TypeScript" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}