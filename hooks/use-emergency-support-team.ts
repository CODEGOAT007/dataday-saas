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
    phone: '(555) 987-6543',
    email: 'sarah@example.com',
    preferred_contact_method: 'text_only',
    consent_given: true,
    consent_date: '2024-01-01T00:00:00Z',
    consent_method: 'email',
    last_contacted: '2024-01-15T10:30:00Z',
    contact_count: 2,
    response_count: 2,
    milestone_notifications_enabled: true,
    escalation_notifications_enabled: true,
    is_active: true,
    deactivated_reason: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
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

// Reason: Custom hook for Emergency Support Team management
export function useEmergencySupportTeam() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Reason: Query for user's Emergency Support Team members
  const {
    data: emergencySupportTeam = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['emergency_support_team', user?.id || 'demo'],
    queryFn: async (): Promise<SupportCircleMember[]> => {
      // Reason: If no user, return sample data for demo
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return sampleSupportCircle
      }
      
      const { data, error } = await supabase
        .from('emergency_support_team')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Reason: Mutation for adding Emergency Support Team member
  const addMemberMutation = useMutation({
    mutationFn: async (memberData: SupportCircleInsert): Promise<SupportCircleMember> => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('emergency_support_team')
        .insert({
          ...memberData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_support_team'] })
    },
  })

  // Reason: Mutation for updating Emergency Support Team member
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SupportCircleUpdate }) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('emergency_support_team')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_support_team'] })
    },
  })

  // Reason: Mutation for deactivating Emergency Support Team member
  const deactivateMemberMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('emergency_support_team')
        .update({
          is_active: false,
          deactivated_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_support_team'] })
    },
  })

  // Reason: Mutation for bulk adding Emergency Support Team members (onboarding)
  const addMultipleMembersMutation = useMutation({
    mutationFn: async (members: SupportCircleInsert[]): Promise<SupportCircleMember[]> => {
      if (!user) throw new Error('User not authenticated')
      
      const membersWithUserId = members.map(member => ({
        ...member,
        user_id: user.id,
      }))

      const { data, error } = await supabase
        .from('emergency_support_team')
        .insert(membersWithUserId)
        .select()

      if (error) throw error
      return data || []
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency_support_team'] })
    },
  })

  return {
    // Data
    emergencySupportTeam,
    isLoading,
    error,

    // Computed values
    activeMembers: (emergencySupportTeam || []).filter(member => member.is_active),
    consentedMembers: (emergencySupportTeam || []).filter(member => member.consent_given),
    hasEmergencySupportTeam: (emergencySupportTeam || []).length > 0,
    
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

// Reason: Hook for escalation logs and Emergency Support Team activity
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
        await new Promise(resolve => setTimeout(resolve, 200))
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
          emergency_support_team (
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
    emergencySupportTeamNotifications: (escalationLogs || []).filter(log =>
      log.type === 'emergency_support_team_notification'
    ),
    milestoneCelebrations: (escalationLogs || []).filter(log =>
      log.type === 'milestone_celebration'
    ),
  }
}
