import { UserRole } from '../context/AuthContext'
import { roleNames, roleDescriptions, rolePermissions } from '../utils/permissions'

interface RoleInfoProps {
  role: UserRole
}

export const RoleInfo: React.FC<RoleInfoProps> = ({ role }) => {
  const permissions = rolePermissions[role]
  
  const permissionLabels: Record<string, string> = {
    view_incidents: 'Xem danh sách sự cố',
    create_incident: 'Tạo sự cố mới',
    edit_incident: 'Chỉnh sửa sự cố',
    delete_incident: 'Xóa sự cố',
    update_status: 'Cập nhật trạng thái',
    assign_handler: 'Gán người xử lý',
    add_notes: 'Thêm ghi chú',
    view_reports: 'Xem báo cáo'
  }

  const roleColors: Record<UserRole, { bg: string; border: string; text: string }> = {
    supervisor: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', text: '#22c55e' },
    coordinator: { bg: 'rgba(96, 165, 250, 0.1)', border: '#60a5fa', text: '#60a5fa' },
    handler: { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', text: '#f59e0b' }
  }

  const colors = roleColors[role]

  return (
    <div style={{
      backgroundColor: colors.bg,
      borderLeft: `4px solid ${colors.border}`,
      padding: '15px',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h4 style={{ color: colors.text, marginTop: 0, marginBottom: '10px' }}>
        {roleNames[role]}
      </h4>
      <p style={{ margin: '5px 0', color: '#999', fontSize: '13px' }}>
        {roleDescriptions[role]}
      </p>
      <div style={{ marginTop: '10px' }}>
        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
          Quyền hạn:
        </p>
        <ul style={{ margin: '5px 0', paddingLeft: '20px', color: '#888', fontSize: '12px' }}>
          {permissions.map((perm) => (
            <li key={perm}>{permissionLabels[perm]}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
