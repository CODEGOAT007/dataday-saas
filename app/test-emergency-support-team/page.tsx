import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Users, 
  MessageCircle, 
  Phone, 
  Mail,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Emergency Support Team Demo | Dataday',
  description: 'Test the Emergency Support Team system',
}

export default function TestEmergencySupportTeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Emergency Support Team System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test the complete social accountability system that drives 90%+ success rates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Setup Flow */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-orange-600" />
                1. Setup Emergency Support Team
              </CardTitle>
              <CardDescription>
                Add 1-5 people who care about your success
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Beautiful onboarding flow</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Consent collection system</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Multi-channel contact preferences</span>
                </div>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Link href="/onboarding/support-circle">
                  Try Setup Flow
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Escalation System */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                2. Escalation System
              </CardTitle>
              <CardDescription>
                Automated social accountability triggers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                  <span>Day 1: Progress Support Team outreach</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                  <span>Day 2: Emergency Support Team notification</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                  <span>Day 3+: Emergency Support Team check-in</span>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/api/escalations/process">
                  Test Escalation API
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Twilio integration for text messages and voicemail
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Production Ready
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Resend integration with beautiful HTML templates
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Production Ready
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Automated Processing</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Daily cron job processes all escalations automatically
              </p>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Vercel Cron
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Sample Consent Link */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              3. Consent Collection
            </CardTitle>
            <CardDescription>
              Test the consent flow that Emergency Support Team members see
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              When someone is added to an Emergency Support Team, they receive a consent request. 
              Here's what that experience looks like:
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Link href="/consent/demo-member-id">
                View Sample Consent Page
              </Link>
            </Button>
            <p className="text-xs text-gray-500">
              Note: This is a demo link and won't actually process consent
            </p>
          </CardContent>
        </Card>

        {/* Dashboard Integration */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-gray-600 mb-6">
            The Emergency Support Team system is fully integrated into the main dashboard
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Link href="/dashboard">
              View Dashboard Integration
            </Link>
          </Button>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Database Schema</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• emergency_support_team table</li>
                <li>• escalation_logs table</li>
                <li>• interactions table</li>
                <li>• planning_sessions table</li>
                <li>• Full RLS policies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Services & APIs</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• EscalationService</li>
                <li>• NotificationService</li>
                <li>• ConsentService</li>
                <li>• React hooks with TanStack Query</li>
                <li>• TypeScript types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
