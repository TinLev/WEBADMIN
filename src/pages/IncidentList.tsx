import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import './IncidentList.css'

interface Incident {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'high' | 'medium' | 'low'
  location: string
  description: string
  createdAt: string
  lat: number
  lng: number
}

export default function IncidentList() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load mock data
    const mockIncidents: Incident[] = [
      {
        id: '1',
        title: 'Hỏng đường phố khu A',
        status: 'open',
        priority: 'high',
        location: 'Đường Nguyễn Huệ, Hà Nội',
        description: 'Mặt đường bị hư hỏng, cần sửa chữa',
        createdAt: '2026-02-05',
        lat: 21.0285,
        lng: 105.8542
      },
      {
        id: '2',
        title: 'Sự cố đèn giao thông',
        status: 'in-progress',
        priority: 'medium',
        location: 'Giao lộ Hàng Béo - Bà Triệu',
        description: 'Đèn giao thông không hoạt động bình thường',
        createdAt: '2026-02-04',
        lat: 21.0294,
        lng: 105.8553
      },
      {
        id: '3',
        title: 'Cây cối ngã đổ',
        status: 'open',
        priority: 'high',
        location: 'Công viên Tao Đàn',
        description: 'Cây xanh lớn bị gió mạnh làm ngã đổ',
        createdAt: '2026-02-05',
        lat: 21.0283,
        lng: 105.8475
      },
      {
        id: '4',
        title: 'Lỗ hố trên đường',
        status: 'resolved',
        priority: 'medium',
        location: 'Đường Phạm Ngũ Lão',
        description: 'Lỗ hố sâu trên mặt đường đã được sửa chữa',
        createdAt: '2026-02-01',
        lat: 21.0289,
        lng: 105.8461
      },
      {
        id: '5',
        title: 'Vỡ ống nước',
        status: 'in-progress',
        priority: 'high',
        location: 'Hẻm 34 Bà Triệu',
        description: 'Ống nước chính bị vỡ gây tràn nước',
        createdAt: '2026-02-05',
        lat: 21.0303,
        lng: 105.8556
      },
      {
        id: '6',
        title: 'Bề mặt trơn trượt',
        status: 'open',
        priority: 'low',
        location: 'Cầu Vàng',
        description: 'Bề mặt cầu trơn do mưa, cần làm sạch',
        createdAt: '2026-02-03',
        lat: 21.0275,
        lng: 105.8520
      }
    ]

    setIncidents(mockIncidents)
  }, [])

  const filteredIncidents = incidents.filter(incident => {
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Chờ xử lý'
      case 'in-progress':
        return 'Đang xử lý'
      case 'resolved':
        return 'Đã giải quyết'
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴 Cao'
      case 'medium':
        return '🟡 Trung bình'
      case 'low':
        return '🟢 Thấp'
      default:
        return priority
    }
  }

  return (
    <Layout>
      <div className="incident-list-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Danh sách sự cố</h2>
          {hasPermission(['supervisor', 'coordinator']) && (
            <button 
              className="btn btn-primary"
              onClick={() => alert('Tính năng tạo sự cố sẽ được thêm vào')}
            >
              + Tạo sự cố mới
            </button>
          )}
        </div>

        {/* Filter and Search */}
        <div className="card filter-card">
          <div className="filter-controls">
            <div className="form-group">
              <input
                type="text"
                placeholder="Tìm kiếm sự cố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <div className="form-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '200px' }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="open">Chờ xử lý</option>
                <option value="in-progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="card">
          {filteredIncidents.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Địa điểm</th>
                  <th>Trạng thái</th>
                  <th>Ưu tiên</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id}>
                    <td>#{incident.id}</td>
                    <td>{incident.title}</td>
                    <td>{incident.location}</td>
                    <td>
                      <span className={`status-badge status-${incident.status}`}>
                        {getStatusLabel(incident.status)}
                      </span>
                    </td>
                    <td>{getPriorityLabel(incident.priority)}</td>
                    <td>{incident.createdAt}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/incidents/${incident.id}`)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#8b92b2' }}>Không tìm thấy sự cố nào</p>
            </div>
          )}
        </div>

        {/* Pagination Info */}
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#8b92b2' }}>
          Hiển thị {filteredIncidents.length} trên {incidents.length} sự cố
        </div>
      </div>
    </Layout>
  )
}
