import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, UserRole } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('handler')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(username, password, role)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không hợp lệ')
      }
    } catch (err) {
      setError('Lỗi đăng nhập. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-header">
          <h1>Urban Admin</h1>
          <p>Hệ thống quản lý sự cố thành phố</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Chọn vai trò:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="supervisor">👨‍💼 Giám sát (Supervisor) - Full quyền</option>
              <option value="coordinator">📋 Điều phối (Coordinator) - Quản lý sự cố</option>
              <option value="handler">🔧 Người đi xử lý (Handler) - Xử lý sự cố</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="login-footer">
          <p><strong>Demo:</strong> Nhập bất kỳ tên đăng nhập, mật khẩu ≥ 6 ký tự, và chọn vai trò</p>
          <div className="role-info">
            <h4>Quyền hạn theo vai trò:</h4>
            <ul>
              <li><strong>Giám sát:</strong> Xem + Tạo + Sửa + Xóa tất cả sự cố, gán công việc</li>
              <li><strong>Điều phối:</strong> Xem + Cập nhật sự cố, gán công việc</li>
              <li><strong>Người đi xử lý:</strong> Xem + Cập nhật trạng thái sự cố của mình</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
