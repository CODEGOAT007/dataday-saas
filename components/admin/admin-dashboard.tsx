'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Users, Target, Mail, Search, ExternalLink, UserCheck, DollarSign, TrendingUp, Briefcase, Copy } from 'lucide-react'
import { LeadLinearActions } from '@/components/admin/lead-linear-actions'
import { LeadWorkspace } from '@/components/admin/lead-workspace'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  subscription_status: string
  onboarding_completed_at: string | null
}

interface UserStats {
  total_users: number
  paying_users: number
  free_users: number
  active_goals: number
  completed_onboarding: number
  support_circle_members: number
  total_phone_leads: number
  new_phone_leads: number
}

interface PhoneLead {
  id: string
  phone: string
  email: string | null
  full_name: string | null
  lead_source: string
  lead_status: string
  lead_notes: string | null
  created_at: string
  updated_at: string
  contacted_at: string | null
  qualified_at: string | null
  converted_at: string | null
  converted_user_id: string | null
  priority: string
  assigned_to: string | null
  next_follow_up: string | null
}

export function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [phoneLeads, setPhoneLeads] = useState<PhoneLead[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'leads'>('leads')
  const [vmTemplate, setVmTemplate] = useState<string>("Hey, it's Chris from DataDay. I saw you entered your number on the site. I'm giving you a quick call now and will try again shortly. You can also text me back here and we’ll get you set up. Talk soon.") // Reason: Default script for fast action
  const [vmEditorOpen, setVmEditorOpen] = useState<boolean>(false) // Reason: Controls the template editor dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState<boolean>(false) // Reason: Controls the checkout link dialog
  const [summaryCollapsed, setSummaryCollapsed] = useState<boolean>(true) // Reason: Collapse the header/summary by default
  const [adminEmail, setAdminEmail] = useState<string | null>(null) // Reason: Identify admin for server-side prefs
  const [paymentLink, setPaymentLink] = useState<string | null>(null) // Reason: Stores generated checkout URL
  const [attachDialogOpen, setAttachDialogOpen] = useState<boolean>(false) // Reason: Controls the attach user dialog
  const [attachLeadId, setAttachLeadId] = useState<string | null>(null) // Reason: Target lead to attach a user to
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null) // Reason: Selected user to attach
  const [userFilter, setUserFilter] = useState<string>('') // Reason: Filter users in attach dialog
  const [workspaceLeadId, setWorkspaceLeadId] = useState<string | null>(null) // Reason: Slide-over focus mode

  useEffect(() => {
    // Reason: Load VM template from local storage (still device-specific)
    const saved = typeof window !== 'undefined' ? localStorage.getItem('vm_template') : null
    if (saved) setVmTemplate(saved)

    // Reason: Load admin session and preferences from server
    ;(async () => {
      try {
        const verify = await fetch('/api/admin/auth/verify')
        if (verify.ok) {
          const v = await verify.json()
          const email = v.session?.email as string | undefined
          if (email) setAdminEmail(email)

          const prefsRes = await fetch(`/api/admin/preferences?email=${encodeURIComponent(email || '')}`)
          if (prefsRes.ok) {
            const prefs = await prefsRes.json()
            if (typeof prefs.summary_collapsed === 'boolean') {
              setSummaryCollapsed(prefs.summary_collapsed)
            }
          }
        }
      } catch (e) {
        console.warn('Could not load admin preferences', e)
      }
    })()
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, statsResponse, phoneLeadsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/phone-leads')
      ])

      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }

      if (phoneLeadsResponse.ok) {
        const phoneLeadsData = await phoneLeadsResponse.json()
        setPhoneLeads(phoneLeadsData.phoneLeads || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data', { id: 'dashboard-fetch' })
    } finally {
      setLoading(false)
    }
  }

  const handleImpersonateUser = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Failed to impersonate user')
      }

      toast.success(`Now coaching ${userEmail}`)

      // Open user's goals page in new tab with impersonation
      window.open(`/admin/coach/${userId}/goals`, '_blank')

    } catch (error) {
      console.error('Impersonation error:', error)
      toast.error('Failed to start coaching session')
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Calculate business metrics
  const totalUsers = stats?.total_users || 0
  const payingUsers = stats?.paying_users || 0
  const freeUsers = stats?.free_users || 0
  const pricePerUser = 65 // $65/month per user
  const currentMRR = payingUsers * pricePerUser // Only count paying users
  const postTaxMultiplier = 0.61 // ~39% tax rate
  const currentPostTaxMonthly = currentMRR * postTaxMultiplier

  // Business goals
  const shortTermGoal = { users: 110, mrr: 7150, postTax: 4362.50, label: "Replace Job" }
  const mediumTermGoal = { users: 600, mrr: 40000, label: "Scale Business" }
  const longTermGoal = { users: 6000, mrr: 400000, label: "10 Coach Network" }

  const shortTermProgress = Math.min((payingUsers / shortTermGoal.users) * 100, 100)
  const mediumTermProgress = Math.min((payingUsers / mediumTermGoal.users) * 100, 100)
  const longTermProgress = Math.min((payingUsers / longTermGoal.users) * 100, 100)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Founder Dashboard</h1>
        <p className="text-gray-400">Business progress and user management</p>
      </div>

      {/* Business Goals Progress */}
      {/* Collapsible Summary Section */}
      <div className="mb-4">
        <button
          onClick={async () => {
            const next = !summaryCollapsed
            setSummaryCollapsed(next)
            try {
              if (adminEmail) {
                await fetch('/api/admin/preferences', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: adminEmail, summary_collapsed: next })
                })
              }
            } catch {}
          }}
          className="text-sm text-gray-300 hover:text-white underline"
        >
          {summaryCollapsed ? 'Show summary' : 'Hide summary'}
        </button>
      </div>
      {!summaryCollapsed && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Short-term Goal */}
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-green-300">Replace Job</h3>
              </div>
              <span className="text-2xl font-bold text-green-400">{shortTermProgress.toFixed(1)}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paying Users</span>
                <span className="text-white">{payingUsers} / {shortTermGoal.users}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${shortTermProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">MRR</span>
                <span className="text-white">${currentMRR.toLocaleString()} / ${shortTermGoal.mrr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Post-tax Monthly</span>
                <span className="text-green-400 font-medium">${currentPostTaxMonthly.toLocaleString()} / ${shortTermGoal.postTax.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medium-term Goal */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-blue-300">Scale Business</h3>
              </div>
              <span className="text-2xl font-bold text-blue-400">{mediumTermProgress.toFixed(1)}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paying Users</span>
                <span className="text-white">{payingUsers} / {mediumTermGoal.users}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mediumTermProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">MRR Target</span>
                <span className="text-white">${mediumTermGoal.mrr.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Need {mediumTermGoal.users - payingUsers} more paying users
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Long-term Goal */}
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-purple-300">Coach Network</h3>
              </div>
              <span className="text-2xl font-bold text-purple-400">{longTermProgress.toFixed(1)}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Paying Users</span>
                <span className="text-white">{payingUsers} / {longTermGoal.users}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${longTermProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">MRR Target</span>
                <span className="text-white">${longTermGoal.mrr.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                10 coaches × 600 users each
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Current Revenue Summary */}
      {!summaryCollapsed && (
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Users</span>
              </div>
              <div className="text-3xl font-bold text-white">{payingUsers}</div>
              <div className="text-xs text-gray-400">
                {payingUsers} paying / {totalUsers} total
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Monthly Revenue</span>
              </div>
              <div className="text-3xl font-bold text-green-400">${currentMRR.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Post-Tax Monthly</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">${currentPostTaxMonthly.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400 text-sm">Annual Revenue</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">${(currentMRR * 12).toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Stats Cards */}
      {stats && !summaryCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total_users}</p>
                  <div className="flex gap-4 text-xs mt-1">
                    <span className="text-green-400">{stats.paying_users} paying</span>
                    <span className="text-gray-500">{stats.free_users} free</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{stats.active_goals}</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Completed Onboarding</p>
                  <p className="text-2xl font-bold text-white">{stats.completed_onboarding}</p>
                </div>
                <UserCheck className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Support Members</p>
                  <p className="text-2xl font-bold text-white">{stats.support_circle_members}</p>
                </div>
                <Mail className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Phone Leads</p>
                  <p className="text-2xl font-bold text-white">{stats.total_phone_leads}</p>
              <Dialog open={vmEditorOpen} onOpenChange={setVmEditorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-gray-700 text-gray-200 hover:bg-gray-800/60">
                    ✍️ Edit Text + VM Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
                  <DialogHeader>
                    <DialogTitle>Text + VM Template</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={vmTemplate}
                    onChange={(e) => setVmTemplate(e.target.value)}
                    className="min-h-[160px] bg-gray-800 border-gray-700 text-gray-100"
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        localStorage.setItem('vm_template', vmTemplate)
                        toast.success('Template saved')
                        setVmEditorOpen(false)
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
                  <div className="flex gap-4 text-xs mt-1">
                    <span className="text-orange-400">{stats.new_phone_leads} new</span>
                    <span className="text-gray-500">{stats.total_phone_leads - stats.new_phone_leads} processed</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Management Tabs */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('leads')}
                className={`text-white ${activeTab === 'leads' ? 'bg-gray-800 border border-gray-700' : 'hover:bg-gray-800/60'}`}
              >
                📱 Phone Leads ({phoneLeads.length})
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('users')}
                className={`text-white ${activeTab === 'users' ? 'bg-gray-800 border border-gray-700' : 'hover:bg-gray-800/60'}`}
              >
                <Users className="w-4 h-4 mr-2" />
                Users ({users.length})
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder={activeTab === 'leads' ? "Search phone leads..." : "Search users..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'users' ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-white">{user.full_name || 'No name'}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                          {user.subscription_status || 'free'}
                        </Badge>
                        {user.onboarding_completed_at && (
                          <Badge variant="outline" className="border-green-600 text-green-400">
                            Onboarded
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleImpersonateUser(user.id, user.email)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Coach User
                    </Button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {phoneLeads.filter(lead =>
                lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.lead_source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.lead_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer" onClick={() => router.push(`/admin/leads/${lead.id}/call-flow`)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {lead.full_name || lead.phone}
                          {lead.email && <span className="text-gray-400 text-sm ml-2">({lead.email})</span>}
                        </h3>
                        <p className="text-gray-400 text-sm">📱 {lead.phone} • Source: {lead.lead_source}</p>
                        {lead.lead_notes && (
                          <p className="text-gray-500 text-xs mt-1">{lead.lead_notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          lead.lead_status === 'new' ? 'destructive' :
                          lead.lead_status === 'contacted' ? 'default' :
                          lead.lead_status === 'qualified' ? 'default' :
                          lead.lead_status === 'converted' ? 'default' :
                          'secondary'
                        }>
                          {lead.lead_status}
                        </Badge>
                        {lead.converted_user_id && (
                          <Badge variant="outline" className="border-green-600 text-green-400">
                            Converted
                          </Badge>
                        )}
                        {lead.priority === 'high' && (
                          <Badge variant="destructive">
                            High Priority
                          </Badge>
                        )}
                        <div className="w-56">
                          <Select
                            value={lead.lead_status}
                            onValueChange={async (value) => {
                              try {
                                const res = await fetch('/api/admin/phone-leads', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: lead.id, status: value })
                                })
                                if (!res.ok) throw new Error('Failed')
                                toast.success(`Status updated to ${value}`)
                                fetchDashboardData()
                              } catch {
                                toast.error('Could not update status')
                              }
                            }}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200 h-9">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                              {/* Reach Out / Contact */}
                              <SelectItem value="new">Reached Out: Not Yet</SelectItem>
                              <SelectItem value="contacted">Reached Out: No Response</SelectItem>
                              <SelectItem value="connected_now">Connected – Live Now</SelectItem>
                              <SelectItem value="rescheduled">Reached Out: Rescheduled</SelectItem>
                              <SelectItem value="declined">Reached Out: Declined</SelectItem>
                              {/* Guided Flow */}
                              <SelectItem value="signup_sent">Signup Link Sent</SelectItem>
                              <SelectItem value="account_created">Account Created</SelectItem>
                              <SelectItem value="payment_pending">Payment Pending</SelectItem>
                              <SelectItem value="card_on_file">Card on File</SelectItem>
                              {/* Outcomes */}
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Onboarded</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      Submitted: {new Date(lead.created_at).toLocaleDateString()} at {new Date(lead.created_at).toLocaleTimeString()}
                      {lead.contacted_at && (
                        <span className="ml-4">• Contacted: {new Date(lead.contacted_at).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>

                  <LeadLinearActions
                    lead={lead}
                    vmTemplate={vmTemplate}
                    onRefresh={fetchDashboardData}
                    onAttachUser={() => { setAttachLeadId(lead.id); setAttachDialogOpen(true); }}
                    onOpenPayment={(url) => { setPaymentLink(url); setPaymentDialogOpen(true); }}
                    isOpen={workspaceLeadId === lead.id}
                    onToggleWorkspace={() => setWorkspaceLeadId(workspaceLeadId === lead.id ? null : lead.id)}
                  />
                </div>
              ))}

              {phoneLeads.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No phone leads yet. They'll appear here when people submit via /learn-more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Link Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle>Payment Link</DialogTitle>
          </DialogHeader>
          {paymentLink ? (
            <div className="space-y-3">
              <div className="text-blue-300 break-all">{paymentLink}</div>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(paymentLink)
                      toast.success('Payment link copied')
                    } catch {
                      toast.error('Could not copy link')
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Copy
                </Button>
                <a href={paymentLink} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="border-gray-600 text-gray-200">Open</Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No link available</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lead Workspace Slide-over */}
      {workspaceLeadId && (
        <LeadWorkspace
          lead={phoneLeads.find((l) => l.id === workspaceLeadId)!}
          vmTemplate={vmTemplate}
          onClose={() => setWorkspaceLeadId(null)}
          onRefresh={fetchDashboardData}
          onAttachUser={() => { setAttachLeadId(workspaceLeadId); setAttachDialogOpen(true); }}
          onOpenPayment={(url) => { setPaymentLink(url); setPaymentDialogOpen(true); }}
          useFullscreen={true}
        />
      )}

      {/* Attach Lead to User Dialog */}
      <Dialog open={attachDialogOpen} onOpenChange={setAttachDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle>Attach Lead to Existing User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users (email or name)"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="max-h-64 overflow-auto border border-gray-800 rounded">
              {users
                .filter(u =>
                  u.email.toLowerCase().includes(userFilter.toLowerCase()) ||
                  (u.full_name || '').toLowerCase().includes(userFilter.toLowerCase())
                )
                .slice(0, 50)
                .map(u => (
                  <div key={u.id} className={`p-2 text-sm cursor-pointer ${selectedUserId === u.id ? 'bg-gray-800' : 'hover:bg-gray-800/60'}`}
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <div className="text-white">{u.full_name || 'No name'}</div>
                    <div className="text-gray-400">{u.email}</div>
                  </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300"
                onClick={() => { setAttachDialogOpen(false); setSelectedUserId(null); setAttachLeadId(null); }}
              >
                Cancel
              </Button>
              <Button
                disabled={!selectedUserId || !attachLeadId}
                onClick={async () => {
                  try {
                    // Save mapping and set lead to account_created
                    const res = await fetch('/api/admin/phone-leads', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: attachLeadId, status: 'account_created', converted_user_id: selectedUserId })
                    })
                    if (!res.ok) throw new Error('Failed')
                    toast.success('Lead attached to user')
                    setAttachDialogOpen(false)
                    setSelectedUserId(null)
                    setAttachLeadId(null)
                    fetchDashboardData()
                  } catch {
                    toast.error('Could not attach lead')
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Attach
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
