'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { Eye, ArrowRight, Sparkles } from 'lucide-react'

export function DemoBanner() {
  const { user } = useAuth()

  // Only show banner when not authenticated (demo mode)
  if (user) return null

  return (
    <Card className="mb-8 border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-blue-900">
                  Demo Mode
                </h3>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Preview
                </Badge>
              </div>
              <p className="text-blue-700">
                You're viewing sample data. Sign up to track your own goals and progress!
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/auth/login'}
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = '/auth/signup'}
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
