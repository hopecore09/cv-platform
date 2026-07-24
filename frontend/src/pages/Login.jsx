import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <Card>
          <Card.Body>
            <h3 className="text-center mb-4">{t('app.login')}</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>{t('profile.email')}</Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </Form.Group>
              <Button type="submit" className="w-100">{t('app.login')}</Button>
            </Form>
            <div className="text-center mt-3"><Link to="/register">{t('app.register')}</Link></div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}