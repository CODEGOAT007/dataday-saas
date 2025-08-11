'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from './use-auth'
import type { 
  SupportCircleMember, 
  SupportCircleInsert, 
  SupportCircleUpdate,
  EscalationLog 
} from '@/types'

const supabase = createClient()

// Demo mode state management
let demoSupportCircle: SupportCircleMember[] | null = null

// Sample data for demo mode
const sampleSupportCircle: SupportCircleMember[] = [
  {
    id: '1',
    user_id: 'demo-user',
    name: 'Mom',
    relationship: 'parent',
    phone: '(555) 123-4567',
    email: 'mom@example.com',
    preferred_contact_method: 'text_voicemail',
    consent_given: true,
    consent_date: '2024-01-01T00:00:00Z',
    consent_method: 'phone',
    last_contacted: null,
    contact_count: 0,
    response_count: 0,
    milestone_notifications_enabled: true,
    escalation_notifications_enabled: true,
    is_active: true,
    deactivated_reason: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'demo-user',
    name: 'Sarah (Best Friend)',
    relationship: 'friend',
    phone: '(555) 234-5678',
    email: 'sarah@example.com',
    preferred_contact_method: 'text_only',
    consent_given: true,
    consent_date: '2024-01-01T00:00:00Z',
    consent_method: 'text',
    last_contacted: null,
    contact_count: 0,
    response_count: 0,
    milestone_notifications_enabled: true,
    escalation_notifications_enabled: true,
    is_active: true,
    deactivated_reason: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'demo-user',
    name: 'Mike (Brother)',
    relationship: 'sibling',
    phone: '(555) 456-7890',
    email: 'mike@example.com',
    preferred_contact_method: 'email',
    consent_given: true,
    consent_date: '2024-01-01T00:00:00Z',
    consent_method: 'in_person',
    last_contacted: null,
    contact_count: 0,
    response_count: 0,
    milestone_notifications_enabled: true,
    escalation_notifications_enabled: true,
    is_active: true,
    deactivated_reason: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Reason: Custom hook for Support Circle management
export function useSupportCircle() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Reason: Query for user's Support Circle members
  const {
    data: supportCircle = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['support_circle', user?.id || 'demo'],
    queryFn: async (): Promise<SupportCircleMember[]> => {
      // Reason: If no user, return sample data for demo
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 100))
        // Initialize demo state if not already done
        if (!demoSupportCircle) {
          demoSupportCircle = [...sampleSupportCircle]
        }
        return demoSupportCircle
      }
      
      const { data, error } = await supabase
        .from('support_circle')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Reason: Mutation for adding Support Circle member
  const addMemberMutation = useMutation({
    mutationFn: async (memberData: SupportCircleInsert): Promise<SupportCircleMember> => {
      // Reason: Handle demo mode - simulate adding member
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

        if (!demoSupportCircle) {
          demoSupportCircle = [...sampleSupportCircle]
        }

        const newMember: SupportCircleMember = {
          id: `demo-${Date.now()}`,
          user_id: 'demo-user',
          ...memberData,
          phone: memberData.phone || null,
          email: memberData.email || null,
          consent_given: false,
          consent_date: null,
          consent_method: null,
          last_contacted: null,
          contact_count: 0,
          response_count: 0,
          milestone_notifications_enabled: true,
          escalation_notifications_enabled: true,
          is_active: true,
          deactivated_reason: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        demoSupportCircle.push(newMember)
        return newMember
      }

      const insertData = {
        ...memberData,
        user_id: user.id,
      }

      console.log('Inserting member data into database:', insertData)

      const { data, error } = await supabase
        .from('support_circle')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Supabase insertion error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }

      console.log('Member successfully added to database:', data)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_circle'] })
    },
  })

  // Reason: Mutation for updating Support Circle member
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SupportCircleUpdate }): Promise<SupportCircleMember> => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('support_circle')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_circle'] })
    },
  })

  // Reason: Mutation for deactivating Support Circle member
  const deactivateMemberMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }): Promise<SupportCircleMember> => {
      // Reason: Handle demo mode - simulate removal by updating demo state
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

        if (!demoSupportCircle) {
          demoSupportCircle = [...sampleSupportCircle]
        }

        const memberIndex = demoSupportCircle.findIndex(m => m.id === id)
        if (memberIndex === -1) throw new Error('Member not found')

        // Update the member in demo state
        demoSupportCircle[memberIndex] = {
          ...demoSupportCircle[memberIndex],
          is_active: false,
          deactivated_reason: reason || 'User removed'
        }

        return demoSupportCircle[memberIndex]
      }

      console.log('Deactivating member in database:', { id, userId: user.id, reason })

      const { data, error } = await supabase
        .from('support_circle')
        .update({
          is_active: false,
          deactivated_reason: reason || 'User removed'
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      console.log('Database update result:', { data, error })

      if (error) {
        console.error('Database update failed:', error)
        throw error
      }

      if (!data) {
        console.error('No data returned from update - member might not exist or belong to user')
        throw new Error('Member not found or access denied')
      }

      console.log('Member successfully deactivated:', data)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_circle'] })
    },
  })

  // Reason: Mutation for bulk adding Support Circle members (onboarding)
  const addMultipleMembersMutation = useMutation({
    mutationFn: async (members: SupportCircleInsert[]): Promise<SupportCircleMember[]> => {
      if (!user) throw new Error('User not authenticated')
      
      const membersWithUserId = members.map(member => ({
        ...member,
        user_id: user.id,
      }))

      const { data, error } = await supabase
        .from('support_circle')
        .insert(membersWithUserId)
        .select()

      if (error) throw error
      return data || []
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support_circle'] })
    },
  })

  return {
    // Data
    supportCircle,
    isLoading,
    error,

    // Computed values
    activeMembers: (supportCircle || []).filter(member => member.is_active),
    consentedMembers: (supportCircle || []).filter(member => member.is_active && member.consent_given),
    hasSupportCircle: (supportCircle || []).length > 0,
    
    // Actions
    addMember: addMemberMutation.mutate,
    addMultipleMembers: addMultipleMembersMutation.mutate,
    updateMember: updateMemberMutation.mutate,
    deactivateMember: deactivateMemberMutation.mutate,
    
    // Loading states
    isAddingMember: addMemberMutation.isPending,
    isUpdatingMember: updateMemberMutation.isPending,
    isDeactivatingMember: deactivateMemberMutation.isPending,
    isAddingMultiple: addMultipleMembersMutation.isPending,
  }
}

// Reason: Hook for escalation logs related to Support Circle
export function useEscalationLogs() {
  const { user } = useAuth()

  const {
    data: escalationLogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['escalation_logs', user?.id || 'demo'],
    queryFn: async (): Promise<EscalationLog[]> => {
      // Reason: If no user, return sample data for demo
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 50))
        return [
          {
            id: '1',
            user_id: 'demo-user',
            goal_id: '1',
            emergency_support_team_id: '2',
            escalation_day: 2,
            type: 'emergency_support_team_notification',
            contact_method: 'text_only',
            message_sent: 'Hi Sarah! Your friend could use some encouragement...',
            response_received: null,
            successful: false,
            created_at: '2024-01-15T10:30:00Z'
          }
        ] as EscalationLog[]
      }
      
      const { data, error } = await supabase
        .from('escalation_logs')
        .select(`
          *,
          goals (
            id,
            title
          ),
          support_circle (
            id,
            name,
            relationship
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  return {
    escalationLogs,
    isLoading,
    error,

    // Computed values
    recentEscalations: (escalationLogs || []).slice(0, 10),
    supportCircleNotifications: (escalationLogs || []).filter(log =>
      log.type === 'emergency_support_team_notification'
    ),
    milestoneCelebrations: (escalationLogs || []).filter(log =>
      log.type === 'milestone_celebration'
    ),
  }
}
