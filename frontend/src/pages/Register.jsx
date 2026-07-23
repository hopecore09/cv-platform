import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import api from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    try {
      await api.post('/auth/register', Object.fromEntries(data))
      navigate('/login')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <Card><Card.Body>
          <h3 className="text-center mb-4">Register</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control name="firstName" required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control name="lastName" required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control name="email" type="email" required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control name="password" type="password" required /></Form.Group>
            <Button type="submit" className="w-100">Register</Button>
          </Form>
          <div className="text-center mt-3"><Link to="/login">Already have an account?</Link></div>
        </Card.Body></Card>
      </div>
    </div>
  )
}