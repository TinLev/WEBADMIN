import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import './IncidentDetail.css'

interface Incident {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'high' | 'medium' | 'low'
  location: string
  lat: number
  lng: number
  createdAt: string
  assignee?: string
  notes: string[]
}

// Fix Leaflet default icon issue
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, hasPermission } = useAuth()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [newStatus, setNewStatus] = useState<'open' | 'in-progress' | 'resolved'>('open')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock incidents data
  const mockIncidents: Record<string, Incident> = {
    '1': {
      id: '1',
      title: 'Hỏng đường phố khu A',
      description: 'Mặt đường bị hư hỏng, cần sửa chữa ngay. Ảnh hưởng đến giao thông thành phố',
      status: 'open',
      priority: 'high',
      location: 'Đường Nguyễn Huệ, Hà Nội',
      lat: 21.0285,
      lng: 105.8542,
      createdAt: '2026-02-05',
      assignee: 'Nguyễn Văn A',
      notes: ['Khảo sát hiện trường', 'Chuẩn bị vật liệu sửa chữa']
    },
    '2': {
      id: '2',
      title: 'Sự cố đèn giao thông',
      description: 'Đèn giao thông không hoạt động bình thường, cần kiểm tra và sửa chữa',
      status: 'in-progress',
      priority: 'medium',
      location: 'Giao lộ Hàng Béo - Bà Triệu',
      lat: 21.0294,
      lng: 105.8553,
      createdAt: '2026-02-04',
      assignee: 'Trần Thị B',
      notes: ['Kiểm tra hệ thống điện', 'Thay thế bóng đèn']
    },
    '3': {
      id: '3',
      title: 'Cây cối ngã đổ',
      description: 'Cây xanh lớn bị gió mạnh làm ngã đổ, cần cắt thành những khúc nhỏ',
      status: 'open',
      priority: 'high',
      location: 'Công viên Tao Đàn',
      lat: 21.0283,
      lng: 105.8475,
      createdAt: '2026-02-05',
      assignee: '',
      notes: ['Cần xin phép cắt cây', 'Xếp cỏ khô']
    },
    '4': {
      id: '4',
      title: 'Lỗ hố trên đường',
      description: 'Lỗ hố sâu trên mặt đường đã được sửa chữa hoàn toàn',
      status: 'resolved',
      priority: 'medium',
      location: 'Đường Phạm Ngũ Lão',
      lat: 21.0289,
      lng: 105.8461,
      createdAt: '2026-02-01',
      assignee: 'Lê Văn C',
      notes: ['Xúc bề mặt', 'Đổ bê tông', 'Kỳ cọ và ưỡn']
    },
    '5': {
      id: '5',
      title: 'Vỡ ống nước',
      description: 'Ống nước chính bị vỡ gây tràn nước',
      status: 'in-progress',
      priority: 'high',
      location: 'Hẻm 34 Bà Triệu',
      lat: 21.0303,
      lng: 105.8556,
      createdAt: '2026-02-05',
      assignee: '',
      notes: []
    },
    '6': {
      id: '6',
      title: 'Bề mặt trơn trượt',
      description: 'Bề mặt cầu trơn do mưa, cần làm sạch',
      status: 'open',
      priority: 'low',
      location: 'Cầu Vàng',
      lat: 21.0275,
      lng: 105.8520,
      createdAt: '2026-02-03',
      assignee: '',
      notes: []
    }
  }

  useEffect(() => {
    // Try to get from localStorage first
    const storageKey = `incident_${id}`
    const stored = localStorage.getItem(storageKey)
    
    let selectedIncident: Incident | undefined
    
    if (stored) {
      // Use stored data if available
      selectedIncident = JSON.parse(stored)
    } else {
      // Otherwise use mock data
      selectedIncident = mockIncidents[id || '1']
      if (selectedIncident) {
        // Save mock data to localStorage
        localStorage.setItem(storageKey, JSON.stringify(selectedIncident))
      }
    }

    if (selectedIncident) {
      setIncident(selectedIncident)
      setNewStatus(selectedIncident.status)
    }
    setLoading(false)
  }, [id])

  const handleStatusUpdate = () => {
    if (incident) {
      const updatedIncident = { ...incident, status: newStatus }
      setIncident(updatedIncident)
      // Save to localStorage
      localStorage.setItem(`incident_${incident.id}`, JSON.stringify(updatedIncident))
      alert('Trạng thái đã được cập nhật!')
    }
  }

  const handleAddNote = () => {
    if (notes.trim() && incident) {
      const updatedIncident = {
        ...incident,
        notes: [...incident.notes, notes]
      }
      setIncident(updatedIncident)
      // Save to localStorage
      localStorage.setItem(`incident_${incident.id}`, JSON.stringify(updatedIncident))
      setNotes('')
      alert('Ghi chú đã được thêm!')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div>Đang tải...</div>
      </Layout>
    )
  }

  if (!incident) {
    return (
      <Layout>
        <div className="error-container">
          <h2>Không tìm thấy sự cố</h2>
          <button className="btn btn-primary" onClick={() => navigate('/incidents')}>
            Quay lại danh sách
          </button>
        </div>
      </Layout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#e74c3c'
      case 'in-progress':
        return '#f39c12'
      case 'resolved':
        return '#27ae60'
      default:
        return '#666'
    }
  }

  return (
    <Layout>
      <div className="incident-detail-container">
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/incidents')}>
            ← Quay lại
          </button>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Left Column - Details */}
          <div>
            <div className="card">
              <h2 style={{ marginBottom: '15px' }}>{incident.title}</h2>
              <div className="detail-field">
                <label>Mô tả:</label>
                <p>{incident.description}</p>
              </div>

              <div className="detail-field">
                <label>Địa điểm:</label>
                <p>{incident.location}</p>
              </div>

              <div className="detail-row">
                <div className="detail-field">
                  <label>Trạng thái hiện tại:</label>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(incident.status) }}
                  >
                    {incident.status === 'open' && 'Chờ xử lý'}
                    {incident.status === 'in-progress' && 'Đang xử lý'}
                    {incident.status === 'resolved' && 'Đã giải quyết'}
                  </span>
                </div>
                <div className="detail-field">
                  <label>Ưu tiên:</label>
                  <p>
                    {incident.priority === 'high' && '🔴 Cao'}
                    {incident.priority === 'medium' && '🟡 Trung bình'}
                    {incident.priority === 'low' && '🟢 Thấp'}
                  </p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-field">
                  <label>Ngày tạo:</label>
                  <p>{incident.createdAt}</p>
                </div>
                <div className="detail-field">
                  <label>Người phụ trách:</label>
                  <p>{incident.assignee || 'Chưa gán'}</p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            {hasPermission(['supervisor', 'coordinator']) || (hasPermission(['handler']) && incident.status === 'in-progress') ? (
              <div className="card">
                <h3 style={{ marginBottom: '15px' }}>Cập nhật trạng thái xử lý</h3>
                <div className="form-group">
                  <label>Chọn trạng thái mới:</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    disabled={hasPermission(['handler']) && incident.status !== 'in-progress'}
                  >
                    <option value="open">Chờ xử lý</option>
                    <option value="in-progress">Đang xử lý</option>
                    <option value="resolved">Đã giải quyết</option>
                  </select>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={handleStatusUpdate}
                  disabled={hasPermission(['handler']) && incident.status !== 'in-progress'}
                >
                  Cập nhật trạng thái
                </button>
                {hasPermission(['handler']) && incident.status !== 'in-progress' && (
                  <p style={{ fontSize: '12px', color: '#f39c12', marginTop: '10px' }}>
                    💡 Chỉ có thể cập nhật trạng thái khi sự cố đang được xử lý
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* Right Column - Map */}
          <div>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '15px' }}>Vị trí trên bản đồ</h3>
              <div className="map-container" style={{ flex: 1 }}>
                <MapContainer center={[incident.lat, incident.lng]} zoom={16} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[incident.lat, incident.lng]} icon={defaultIcon}>
                    <Popup>
                      <div>
                        <strong>{incident.title}</strong>
                        <p>{incident.location}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Ghi chú và nhận xét</h3>

          <div className="form-group">
            <label>Thêm ghi chú mới:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú..."
              style={{ minHeight: '100px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddNote}>
            Thêm ghi chú
          </button>
          {user?.role === 'handler' && (
            <p style={{ fontSize: '12px', color: '#8b92b2', marginTop: '10px' }}>
              📝 Bạn có thể thêm ghi chú về tiến độ xử lý
            </p>
          )}

          {/* Existing Notes */}
          {incident.notes.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Ghi chú trước đây:</h4>
              <div className="notes-list">
                {incident.notes.map((note, index) => (
                  <div key={index} className="note-item">
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
