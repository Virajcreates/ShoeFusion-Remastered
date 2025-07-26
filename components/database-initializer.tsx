"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader, Database, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isFixingRls, setIsFixingRls] = useState(false)
  const { toast } = useToast()

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/init-database")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Database initialized successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize database",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const fixRlsPolicies = async () => {
    setIsFixingRls(true)
    try {
      const response = await fetch("/api/fix-rls")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "RLS policies fixed successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fix RLS policies",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsFixingRls(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Initialize Database
          </CardTitle>
          <CardDescription>
            Create all necessary tables in the database. This is safe to run multiple times.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This will create the following tables if they don't exist:</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>users</li>
            <li>designs</li>
            <li>cart_items</li>
            <li>orders</li>
            <li>order_items</li>
            <li>addresses</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={initializeDatabase} disabled={isInitializing}>
            {isInitializing ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fix RLS Policies
          </CardTitle>
          <CardDescription>
            Fix Row Level Security policies for all tables. This will ensure proper data access control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This will recreate all RLS policies to ensure:</p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Users can only access their own data</li>
            <li>Service role can access all data</li>
            <li>Proper foreign key relationships are respected</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={fixRlsPolicies} disabled={isFixingRls}>
            {isFixingRls ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Fixing RLS Policies...
              </>
            ) : (
              "Fix RLS Policies"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
