import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import './Dashboard.css'

interface Incident {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'high' | 'medium' | 'low'
  location: string
  lat: number
  lng: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    // Load mock data
    const mockIncidents: Incident[] = [
      {
        id: '1',
        title: 'Hỏng đường phố khu A',
        status: 'open',
        priority: 'high',
        location: 'Đường Nguyễn Huệ',
        lat: 21.0285,
        lng: 105.8542
      },
      {
        id: '2',
        title: 'Sự cố đèn giao thông',
        status: 'in-progress',
        priority: 'medium',
        location: 'Giao lộ Hàng Béo',
        lat: 21.0294,
        lng: 105.8553
      },
      {
        id: '3',
        title: 'Cây cối ngã đổ',
        status: 'open',
        priority: 'high',
        location: 'Công viên Tao Đàn',
        lat: 21.0283,
        lng: 105.8475
      },
      {
        id: '4',
        title: 'Lỗ hố trên đường',
        status: 'resolved',
        priority: 'medium',
        location: 'Đường Phạm Ngũ Lão',
        lat: 21.0289,
        lng: 105.8461
      },
      {
        id: '5',
        title: 'Vỡ ống nước',
        status: 'in-progress',
        priority: 'high',
        location: 'Hẻm 34 Bà Triệu',
        lat: 21.0303,
        lng: 105.8556
      }
    ]

    // Override with localStorage data if available
    const updatedIncidents = mockIncidents.map(incident => {
      const stored = localStorage.getItem(`incident_${incident.id}`)
      if (stored) {
        const storedIncident = JSON.parse(stored)
        return { ...incident, status: storedIncident.status }
      }
      return incident
    })

    setIncidents(updatedIncidents)

    const statsData = {
      total: updatedIncidents.length,
      open: updatedIncidents.filter(i => i.status === 'open').length,
      inProgress: updatedIncidents.filter(i => i.status === 'in-progress').length,
      resolved: updatedIncidents.filter(i => i.status === 'resolved').length
    }
    setStats(statsData)
  }, [])

  const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
    <div className="stat-card" style={{ background: color }}>
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  )

  return (
    <Layout>
      <div className="dashboard-container">
        <h2 style={{ marginBottom: '30px' }}>Bảng điều khiển tổng quan</h2>

        {/* Role Info Card */}
        {user?.role === 'supervisor' && (
          <div className="card" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', borderLeft: '4px solid #34d399', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#34d399' }}>
              ✓ <strong>Giám sát (Supervisor):</strong> Bạn có toàn quyền quản lý hệ thống, tạo, chỉnh sửa, và xóa các sự cố
            </p>
          </div>
        )}
        {user?.role === 'coordinator' && (
          <div className="card" style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', borderLeft: '4px solid #60a5fa', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#60a5fa' }}>
              ✓ <strong>Điều phối (Coordinator):</strong> Bạn có thể xem, cập nhật, và gán công việc sự cố
            </p>
          </div>
        )}
        {user?.role === 'handler' && (
          <div className="card" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#f59e0b' }}>
              ✓ <strong>Người đi xử lý (Handler):</strong> Bạn có thể xem và cập nhật trạng thái sự cố của mình
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid">
          <StatCard
            title="Tổng sự cố"
            value={stats.total}
            color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
          <StatCard
            title="Chờ xử lý"
            value={stats.open}
            color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          />
          <StatCard
            title="Đang xử lý"
            value={stats.inProgress}
            color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          />
          <StatCard
            title="Đã giải quyết"
            value={stats.resolved}
            color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </div>

        {/* Recent Incidents */}
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Sự cố gần đây</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Ưu tiên</th>
                <th>Địa điểm</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {incidents.slice(0, 5).map((incident) => (
                <tr key={incident.id}>
                  <td>#{incident.id}</td>
                  <td>{incident.title}</td>
                  <td>
                    <span
                      className={`status-badge status-${incident.status.replace('-', '-')}`}
                    >
                      {incident.status === 'open' && 'Chờ xử lý'}
                      {incident.status === 'in-progress' && 'Đang xử lý'}
                      {incident.status === 'resolved' && 'Đã giải quyết'}
                    </span>
                  </td>
                  <td>
                    {incident.priority === 'high' && '🔴 Cao'}
                    {incident.priority === 'medium' && '🟡 Trung bình'}
                    {incident.priority === 'low' && '🟢 Thấp'}
                  </td>
                  <td>{incident.location}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/incidents')}
          >
            Xem tất cả sự cố
          </button>
        </div>
      </div>
    </Layout>
  )
}
