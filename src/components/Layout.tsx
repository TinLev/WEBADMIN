import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const getRoleName = (role: string) => {
  switch (role) {
    case 'supervisor':
      return '👨‍💼 Giám sát'
    case 'coordinator':
      return '📋 Điều phối'
    case 'handler':
      return '🔧 Xử lý'
    default:
      return role
  }
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '20px', marginBottom: '10px' }}>Urban Admin</h1>
          <p style={{ fontSize: '12px', color: '#888' }}>Hệ thống quản lý sự cố</p>
          <div style={{ 
            marginTop: '10px', 
            padding: '8px', 
            backgroundColor: '#3a3a3a', 
            borderRadius: '5px',
            fontSize: '12px',
            color: '#4a90e2',
            fontWeight: 'bold'
          }}>
            {getRoleName(user?.role || '')}
          </div>
        </div>
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a
                href="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                📊 Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/incidents"
                className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}
              >
                🔴 Danh sách sự cố
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <h2>Urban Admin</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '13px' }}>
              <div style={{ color: '#8b92b2', marginBottom: '3px' }}>Người dùng</div>
              <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
            </div>
            <div style={{ fontSize: '13px' }}>
              <div style={{ color: '#8b92b2', marginBottom: '3px' }}>Vai trò</div>
              <div style={{ fontWeight: 'bold', color: '#4a90e2' }}>{getRoleName(user?.role || '')}</div>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
