import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div data-bs-theme={theme}>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">{t('app.title')}</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/positions" className={isActive('/positions')}>
                {t('app.positions')}
              </Nav.Link>
              {user && ['candidate', 'admin'].includes(user?.role) && (
                <Nav.Link as={Link} to="/profile" className={isActive('/profile')}>
                  {t('app.profile')}
                </Nav.Link>
              )}
              {user?.role === 'recruiter' && (
                <Nav.Link as={Link} to="/attributes" className={isActive('/attributes')}>
                  {t('app.attributes')}
                </Nav.Link>
              )}
              {user?.role === 'admin' && (
                <Nav.Link as={Link} to="/admin/users" className={isActive('/admin/users')}>
                  {t('app.users')}
                </Nav.Link>
              )}
            </Nav>
            <Nav>
              <NavDropdown title={i18n.language.toUpperCase()}>
                {['en', 'ru'].map(l => (
                  <NavDropdown.Item 
                    key={l} 
                    onClick={() => { 
                      i18n.changeLanguage(l)
                      localStorage.setItem('language', l)
                    }}
                  >
                    {l}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown title={t('app.theme')}>
                <NavDropdown.Item onClick={() => setTheme('light')}>Light</NavDropdown.Item>
                <NavDropdown.Item onClick={() => setTheme('dark')}>Dark</NavDropdown.Item>
              </NavDropdown>
              {user ? (
                <Button variant="outline-light" size="sm" onClick={() => { localStorage.clear(); navigate('/login') }}>
                  {t('app.logout')}
                </Button>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">{t('app.login')}</Nav.Link>
                  <Nav.Link as={Link} to="/register">{t('app.register')}</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-3">
        <Outlet />
      </Container>
    </div>
  )
}