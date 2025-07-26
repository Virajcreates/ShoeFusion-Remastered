export interface ShoeDesign {
  sole: PartDesign
  trim: PartDesign
  head: PartDesign
  laces: PartDesign
}

export interface PartDesign {
  color: string
  material: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  design: ShoeDesign
  size: string
}

export interface User {
  uid: string
  email: string
  displayName: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: string
  createdAt: string
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}
