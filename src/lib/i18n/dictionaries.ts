import type { Locale } from './config'
import arDict from '@/dictionaries/ar.json'
import enDict from '@/dictionaries/en.json'

// Define the dictionary structure
export interface Dictionary {
  common: {
    home: string
    products: string
    categories: string
    about: string
    contact: string
    cart: string
    account: string
    login: string
    register: string
    logout: string
    search: string
    searchPlaceholder: string
    language: string
    currency: string
    addToCart: string
    buyNow: string
    viewDetails: string
    price: string
    quantity: string
    total: string
    checkout: string
    continueShopping: string
    emptyCart: string
    loading: string
    error: string
    success: string
    submit: string
    cancel: string
    save: string
    delete: string
    edit: string
    back: string
    next: string
    previous: string
    all: string
    filter: string
    sort: string
    noResults: string
  }
  home: {
    hero: {
      title: string
      subtitle: string
      cta: string
    }
    featuredProducts: string
    shopByCategory: string
    whyChooseUs: string
  }
  product: {
    specifications: string
    datasheet: string
    downloadDatasheet: string
    inStock: string
    outOfStock: string
    lowStock: string
    sku: string
    brand: string
    category: string
    relatedProducts: string
    reviews: string
    askQuestion: string
    requestQuote: string
  }
  cart: {
    title: string
    item: string
    items: string
    subtotal: string
    shipping: string
    discount: string
    orderTotal: string
    updateQuantity: string
    remove: string
    proceedToCheckout: string
  }
  checkout: {
    title: string
    shippingInfo: string
    paymentMethod: string
    orderSummary: string
    placeOrder: string
    fullName: string
    phone: string
    address: string
    city: string
    governorate: string
    notes: string
    bankTransfer: string
    vodafoneCash: string
    cashOnDelivery: string
  }
  quote: {
    title: string
    description: string
    companyName: string
    requirements: string
    submitRequest: string
    success: string
  }
  account: {
    title: string
    orders: string
    addresses: string
    profile: string
    orderHistory: string
    noOrders: string
  }
  order: {
    orderNumber: string
    date: string
    status: string
    total: string
    pending: string
    confirmed: string
    processing: string
    shipped: string
    delivered: string
    cancelled: string
    trackOrder: string
  }
  footer: {
    company: string
    quickLinks: string
    customerService: string
    contactUs: string
    followUs: string
    copyright: string
  }
  ai: {
    chatTitle: string
    placeholder: string
    thinking: string
    error: string
    welcome: string
    suggestions: string[]
  }
}

// Dictionary loader - using static imports for reliability
const dictionaries: Record<Locale, Dictionary> = {
  ar: arDict as Dictionary,
  en: enDict as Dictionary,
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.ar
}
