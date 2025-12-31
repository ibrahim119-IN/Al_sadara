'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { UserCog, Plus, Edit, Shield } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

const roleConfig: Record<string, { label: string; labelAr: string; color: string }> = {
  'super-admin': { label: 'Super Admin', labelAr: 'مدير أعلى', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  'admin': { label: 'Admin', labelAr: 'مدير', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  'manager': { label: 'Manager', labelAr: 'مشرف', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'staff': { label: 'Staff', labelAr: 'موظف', color: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-400' },
}

export default function UsersSettingsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = {
    title: isRTL ? 'إدارة المستخدمين' : 'Users Management',
    addUser: isRTL ? 'إضافة مستخدم' : 'Add User',
    name: isRTL ? 'الاسم' : 'Name',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    role: isRTL ? 'الدور' : 'Role',
    joined: isRTL ? 'تاريخ الانضمام' : 'Joined',
    actions: isRTL ? 'إجراءات' : 'Actions',
    noUsers: isRTL ? 'لا يوجد مستخدمين' : 'No users found',
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        // This would need a users API endpoint
        // For now, we'll show an empty state or mock data
        setUsers([])
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <Link
          href={`/${locale}/admin/collections/users/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addUser}
        </Link>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <UserCog className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400 mb-4">{t.noUsers}</p>
            <Link
              href={`/${locale}/admin/collections/users`}
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700"
            >
              <Shield className="w-4 h-4" />
              {isRTL ? 'إدارة المستخدمين في Payload' : 'Manage Users in Payload'}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.name}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.email}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.role}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.joined}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {users.map((user) => {
                  const role = roleConfig[user.role] || roleConfig.staff
                  return (
                    <tr key={user.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", role.color)}>
                          {isRTL ? role.labelAr : role.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/${locale}/admin/collections/users/${user.id}`}
                          className="p-1 text-secondary-500 hover:text-primary-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
