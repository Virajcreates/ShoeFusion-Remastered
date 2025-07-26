interface Window {
  cartProvider?: {
    updateCart: () => Promise<void>
  }
}
