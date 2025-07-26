"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getUserDesigns, deleteDesign } from "@/lib/design-actions"
import { useAuth } from "@/components/auth-provider"
import { ShoeViewer } from "@/components/shoe-viewer"
import { Loader, Edit, Trash2, ShoppingCart, Plus, ArrowLeft } from "lucide-react"
import { addToCart } from "@/lib/cart-actions"
import Link from "next/link"
import { FallbackShoeDisplay } from "@/components/fallback-shoe-display"

export default function SavedDesignsPage() {
  const [designs, setDesigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchDesigns = async () => {
      if (!user) return

      try {
        setLoading(true)
        const userDesigns = await getUserDesigns(user.id)
        setDesigns(userDesigns)
      } catch (error) {
        console.error("Error fetching designs:", error)
        toast({
          title: "Error",
          description: "Failed to load your saved designs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user && !authLoading) {
      fetchDesigns()
    }
  }, [user, authLoading, toast])

  const handleDeleteDesign = async (designId: string) => {
    if (!user) return

    setActionLoading(designId)
    try {
      const result = await deleteDesign(designId, user.id)
      if (result.success) {
        setDesigns((prev) => prev.filter((design) => design.id !== designId))
        toast({ title: "Design Deleted", description: "Your design has been deleted" })
      } else {
        throw new Error(result.error || "Failed to delete design")
      }
    } catch (error) {
      console.error("Error deleting design:", error)
      toast({
        title: "Error",
        description: "Failed to delete design",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddToCart = async (design: any) => {
    if (!user) return

    setActionLoading(design.id)
    try {
      await addToCart(user.id, design.design)
      toast({
        title: "Added to Cart",
        description: "Design added to your cart",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditDesign = (designId: string) => {
    router.push(`/customize?designId=${designId}`)
  }

  if (authLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your saved designs...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Saved Designs</h1>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
              <p className="mb-6">You need to be logged in to view your saved designs.</p>
              <Button asChild>
                <Link href="/login?redirectTo=/saved-designs">Log In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Saved Designs</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your saved designs...</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No saved designs yet</h3>
          <p className="text-muted-foreground mb-4">Start customizing shoes and save your designs here</p>
          <Button asChild>
            <Link href="/customize">Create a Design</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              You have {designs.length} saved design{designs.length !== 1 ? "s" : ""}
            </p>
            <Button asChild>
              <Link href="/customize">
                <Plus className="h-4 w-4 mr-2" />
                New Design
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <Card key={design.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted relative">
                  {/* Model preview container with proper alignment */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full">
                      {design.design ? (
                        <ShoeViewer
                          design={design.design}
                          height="100%"
                          interactive={false}
                          cameraPosition={[0, 0, 2.5]}
                        />
                      ) : (
                        <FallbackShoeDisplay
                          design={{
                            sole: { color: design.sole_color, material: design.sole_material },
                            trim: { color: design.trim_color, material: design.trim_material },
                            head: { color: design.head_color, material: design.head_material },
                            laces: { color: design.laces_color, material: design.laces_material },
                          }}
                          height="100%"
                        />
                      )}
                    </div>
                  </div>

                  {/* Overlay with actions on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="mr-2" onClick={() => handleEditDesign(design.id)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDesign(design.id)}
                      disabled={actionLoading === design.id}
                    >
                      {actionLoading === design.id ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium">{design.name || "Custom Design"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(design.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(design)}
                    disabled={actionLoading === design.id}
                  >
                    {actionLoading === design.id ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full" onClick={() => handleEditDesign(design.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Design
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
