'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Shield, AlertTriangle, CheckCircle, Edit, Trash2, Eye, Search, Filter, Plus } from 'lucide-react'
import { adminService, UserGroup, RecentEnrollment } from '@/services/adminService'
import { useToast } from '@/contexts/ToastContext'

const getRiskBadge = (riskLevel: string) => {
  const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
  switch (riskLevel) {
    case 'High':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'Medium':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'Low':
      return `${baseClasses} bg-green-100 text-green-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'in_progress':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case 'pending':
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <CheckCircle className="h-4 w-4 text-gray-500" />
  }
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  role: string
  status: string
  lastLogin: string
  trainingProgress: number
  riskScore: number
}

export default function UserManagement() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const [recentEnrollments, setRecentEnrollments] = useState<RecentEnrollment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [groupsData, enrollmentsData] = await Promise.all([
          adminService.getUserGroups(),
          adminService.getRecentEnrollments()
        ])
        setUserGroups(groupsData)
        setRecentEnrollments(enrollmentsData)
        
        // Mock users data for now - will be replaced with real API call
        const mockUsers: User[] = enrollmentsData.map((enrollment, index) => ({
          id: enrollment.id,
          firstName: enrollment.name.split(' ')[0],
          lastName: enrollment.name.split(' ')[1] || '',
          email: enrollment.email,
          department: enrollment.department,
          role: enrollment.role,
          status: enrollment.status === 'completed' ? 'active' : 'pending',
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          trainingProgress: Math.floor(Math.random() * 100),
          riskScore: Math.floor(Math.random() * 100)
        }))
        setUsers(mockUsers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data')
        console.error('Error fetching user management data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddGroup = async () => {
    try {
      const newGroup = await adminService.createUserGroup({
        name: 'New Group',
        count: 0,
        riskLevel: 'Medium',
        lastTraining: 'Never',
        status: 'active'
      })
      setUserGroups([...userGroups, newGroup])
      showToast('User group created successfully', 'success')
    } catch (err) {
      console.error('Error creating user group:', err)
      showToast('Failed to create user group', 'error')
    }
  }

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      // Mock creation - replace with real API call
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        department: userData.department || '',
        role: userData.role || 'employee',
        status: 'active',
        lastLogin: 'Never',
        trainingProgress: 0,
        riskScore: 50
      }
      setUsers([...users, newUser])
      setShowCreateUserModal(false)
      showToast('User created successfully', 'success')
    } catch (err) {
      console.error('Error creating user:', err)
      showToast('Failed to create user', 'error')
    }
  }

  const handleEditUser = async (userId: string, userData: Partial<User>) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, ...userData } : user
      )
      setUsers(updatedUsers)
      setEditingUser(null)
      showToast('User updated successfully', 'success')
    } catch (err) {
      console.error('Error updating user:', err)
      showToast('Failed to update user', 'error')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      showToast('User deleted successfully', 'success')
    } catch (err) {
      console.error('Error deleting user:', err)
      showToast('Failed to delete user', 'error')
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      if (action === 'delete') {
        const updatedUsers = users.filter(user => !selectedUsers.includes(user.id))
        setUsers(updatedUsers)
        setSelectedUsers([])
        showToast(`${selectedUsers.length} users deleted successfully`, 'success')
      } else if (action === 'activate') {
        const updatedUsers = users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
        )
        setUsers(updatedUsers)
        setSelectedUsers([])
        showToast(`${selectedUsers.length} users activated successfully`, 'success')
      }
    } catch (err) {
      console.error('Error performing bulk action:', err)
      showToast('Failed to perform bulk action', 'error')
    }
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === '' || user.role === filterRole
    const matchesDepartment = filterDepartment === '' || user.department === filterDepartment
    
    return matchesSearch && matchesRole && matchesDepartment
  })

  const departments = Array.from(new Set(users.map(user => user.department).filter(Boolean)))
  const roles = Array.from(new Set(users.map(user => user.role).filter(Boolean)))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load user data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-harmony-cream">Manage users, groups, and permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Users className="h-4 w-4" />
            <span>Create Group</span>
          </button>
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harmony-cream" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role} className="bg-harmony-dark text-white">{role}</option>
              ))}
            </select>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-harmony-dark text-white">{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-harmony-cream text-sm">{selectedUsers.length} users selected</span>
            <button
              onClick={() => handleBulkAction('activate')}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg border border-harmony-cream/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-harmony-cream/20">
          <h3 className="text-lg font-semibold text-white">All Users ({filteredUsers.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    className="rounded border-harmony-cream/20"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Training Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-harmony-cream uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                      className="rounded border-harmony-cream/20"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-harmony-cream/20 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-harmony-cream">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-harmony-cream">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${user.trainingProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-harmony-cream">{user.trainingProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      user.riskScore > 70 ? 'text-red-400' :
                      user.riskScore > 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {user.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-harmony-cream">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Groups Overview */}
      <div className="bg-harmony-dark/20 backdrop-blur-sm rounded-lg p-6 border border-harmony-cream/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">User Groups</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userGroups.map((group) => (
            <div key={group.id} className="bg-white/5 border border-harmony-cream/20 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-harmony-cream/20 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-harmony-cream" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{group.name}</h3>
                    <p className="text-sm text-harmony-cream">{group.count} users</p>
                  </div>
                </div>
                <span className={getRiskBadge(group.riskLevel)}>
                  {group.riskLevel}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-harmony-cream">
                <span>Last Training: {group.lastTraining}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  group.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {group.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onSubmit={handleCreateUser}
          departments={departments}
          roles={roles}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => handleEditUser(editingUser.id, userData)}
          departments={departments}
          roles={roles}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          onSubmit={handleAddGroup}
        />
      )}
    </div>
  )
}

// Create User Modal Component
interface CreateUserModalProps {
  onClose: () => void
  onSubmit: (userData: Partial<User>) => void
  departments: string[]
  roles: string[]
}

function CreateUserModal({ onClose, onSubmit, departments, roles }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: 'employee'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-md border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Create New User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="" className="bg-harmony-dark text-white">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-harmony-dark text-white">{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              {roles.map(role => (
                <option key={role} value={role} className="bg-harmony-dark text-white">{role}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit User Modal Component
interface EditUserModalProps {
  user: User
  onClose: () => void
  onSubmit: (userData: Partial<User>) => void
  departments: string[]
  roles: string[]
}

function EditUserModal({ user, onClose, onSubmit, departments, roles }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    role: user.role,
    status: user.status
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-md border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Edit User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white placeholder-harmony-cream/60 focus:outline-none focus:border-harmony-cream/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="" className="bg-harmony-dark text-white">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-harmony-dark text-white">{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              {roles.map(role => (
                <option key={role} value={role} className="bg-harmony-dark text-white">{role}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-harmony-cream mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-harmony-cream/20 rounded-lg text-white focus:outline-none focus:border-harmony-cream/40"
            >
              <option value="active" className="bg-harmony-dark text-white">Active</option>
              <option value="inactive" className="bg-harmony-dark text-white">Inactive</option>
              <option value="pending" className="bg-harmony-dark text-white">Pending</option>
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Create Group Modal Component
interface CreateGroupModalProps {
  onClose: () => void
  onSubmit: () => void
}

function CreateGroupModal({ onClose, onSubmit }: CreateGroupModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-harmony-dark rounded-lg p-6 w-full max-w-md border border-harmony-cream/20">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Group</h3>
        <p className="text-harmony-cream mb-4">Group creation form will be implemented here.</p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit()
              onClose()
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
