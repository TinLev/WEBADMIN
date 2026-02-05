/**
 * Định nghĩa quyền hạn theo vai trò
 * Role: supervisor | coordinator | handler
 */

import { UserRole } from './context/AuthContext'

export type Permission = 
  | 'view_incidents'
  | 'create_incident'
  | 'edit_incident'
  | 'delete_incident'
  | 'update_status'
  | 'assign_handler'
  | 'add_notes'
  | 'view_reports'

export const rolePermissions: Record<UserRole, Permission[]> = {
  supervisor: [
    'view_incidents',
    'create_incident',
    'edit_incident',
    'delete_incident',
    'update_status',
    'assign_handler',
    'add_notes',
    'view_reports'
  ],
  coordinator: [
    'view_incidents',
    'edit_incident',
    'update_status',
    'assign_handler',
    'add_notes',
    'view_reports'
  ],
  handler: [
    'view_incidents',
    'update_status',
    'add_notes'
  ]
}

export const roleNames: Record<UserRole, string> = {
  supervisor: '👨‍💼 Giám sát',
  coordinator: '📋 Điều phối',
  handler: '🔧 Người đi xử lý'
}

export const roleDescriptions: Record<UserRole, string> = {
  supervisor: 'Quản lý toàn bộ hệ thống, có toàn quyền tạo, sửa, xóa, và gán sự cố',
  coordinator: 'Quản lý và điều phối các sự cố, gán công việc cho người xử lý',
  handler: 'Xử lý các sự cố được gán, cập nhật tiến độ và ghi chú'
}
