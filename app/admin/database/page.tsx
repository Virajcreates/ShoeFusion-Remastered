"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseInitializer } from "@/components/database-initializer"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function AdminDatabasePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("initialize")

  // Redirect if not logged in
  if (!loading && !user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="initialize">Initialize</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="seed">Seed Data</TabsTrigger>
        </TabsList>

        <TabsContent value="initialize" className="space-y-4">
          <DatabaseInitializer />
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>View and manage database tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">users</h3>
                  <p className="text-sm text-muted-foreground">User profiles and authentication data</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">designs</h3>
                  <p className="text-sm text-muted-foreground">Saved shoe designs</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">cart_items</h3>
                  <p className="text-sm text-muted-foreground">Items in user shopping carts</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">addresses</h3>
                  <p className="text-sm text-muted-foreground">User shipping addresses</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">orders</h3>
                  <p className="text-sm text-muted-foreground">User orders</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium">order_items</h3>
                  <p className="text-sm text-muted-foreground">Items in user orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seed Data</CardTitle>
              <CardDescription>Add sample data to the database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will add sample data to your database for testing purposes.
              </p>
              <Button>Seed Database</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
