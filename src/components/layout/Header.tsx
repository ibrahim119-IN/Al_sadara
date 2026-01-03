'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { groupInfo } from '@/data/group-data'
import {
  Phone,
  Mail,
  MapPin,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Camera,
  Shield,
  Phone as PhoneIcon,
  Radio,
  Flame,
  MapPinned,
  Layers,
  HeadphonesIcon,
  Clock,
  ArrowRight,
  LogOut,
  Package,
  Settings,
  Mic,
} from 'lucide-react'
import { CartBadge } from '@/components/cart/CartBadge'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { VoiceSearch } from '@/components/ai/VoiceSearch'

interface HeaderProps {
  locale: Locale
  dict: Dictionary
}

const categories = [
  {
    slug: 'cctv',
    nameEn: 'CCTV Cameras',
    nameAr: 'كاميرات المراقبة',
    descEn: 'IP & Analog surveillance systems',
    descAr: 'أنظمة مراقبة IP وتناظرية',
    icon: Camera
  },
  {
    slug: 'access-control',
    nameEn: 'Access Control',
    nameAr: 'أجهزة الحضور والانصراف',
    descEn: 'Biometric & Card-based systems',
    descAr: 'أنظمة بصمة وكارت',
    icon: Shield
  },
  {
    slug: 'pbx',
    nameEn: 'PBX Systems',
    nameAr: 'السنترالات',
    descEn: 'IP & Digital phone systems',
    descAr: 'أنظمة هاتف رقمية',
    icon: PhoneIcon
  },
  {
    slug: 'intercom',
    nameEn: 'Intercom Systems',
    nameAr: 'أنظمة الإنتركم',
    descEn: 'Video & Audio intercoms',
    descAr: 'إنتركم صوت وصورة',
    icon: Radio
  },
  {
    slug: 'fire-alarm',
    nameEn: 'Fire Alarm',
    nameAr: 'إنذار الحريق',
    descEn: 'Detection & Alert systems',
    descAr: 'أنظمة كشف وتنبيه',
    icon: Flame
  },
  {
    slug: 'gps',
    nameEn: 'GPS Tracking',
    nameAr: 'تتبع GPS',
    descEn: 'Vehicle & Asset tracking',
    descAr: 'تتبع المركبات والأصول',
    icon: MapPinned
  },
  {
    slug: 'nurse-call',
    nameEn: 'Nurse Call',
    nameAr: 'نداء التمريض',
    descEn: 'Hospital call systems',
    descAr: 'أنظمة استدعاء المستشفيات',
    icon: HeadphonesIcon
  },
  {
    slug: 'raw-materials',
    nameEn: 'Raw Materials',
    nameAr: 'الخامات',
    descEn: 'PP, PE, HDPE & more',
    descAr: 'بولي بروبلين وغيرها',
    icon: Layers
  },
]

export function Header({ locale, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const isRTL = locale === 'ar'
  const router = useRouter()
  const { customer, isAuthenticated, logout } = useAuth()

  // Handle voice search result
  const handleVoiceSearchResult = useCallback((text: string) => {
    setSearchQuery(text)
  }, [])

  // Handle search submit
  const handleSearch = useCallback((query?: string) => {
    const searchText = query || searchQuery
    if (searchText.trim()) {
      router.push(`/${locale}/products?q=${encodeURIComponent(searchText.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }, [locale, router, searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
    router.push(`/${locale}`)
    router.refresh()
  }

  const navigation = [
    { name: dict.common.home, href: `/${locale}` },
    { name: isRTL ? 'شركاتنا' : 'Our Companies', href: `/${locale}/companies` },
    { name: dict.common.products, href: `/${locale}/products`, hasMegaMenu: true },
    { name: dict.common.about, href: `/${locale}/about` },
    { name: dict.common.contact, href: `/${locale}/contact` },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'shadow-hard' : ''}`}>
      {/* Top Bar - Hidden when scrolled */}
      <div className={`bg-primary-900 text-white transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-10 text-sm">
            {/* Contact Info */}
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+966554401575" className="flex items-center gap-2 hover:text-accent-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span dir="ltr">+966 55 440 1575</span>
              </a>
              <a href="mailto:info@alsadara.org" className="flex items-center gap-2 hover:text-accent-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@alsadara.org</span>
              </a>
              <span className="flex items-center gap-2 text-primary-200">
                <Clock className="w-4 h-4" />
                <span>{isRTL ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9AM - 6PM'}</span>
              </span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 ms-auto">
              <span className="hidden lg:flex items-center gap-2 text-primary-200">
                <MapPin className="w-4 h-4" />
                <span>{isRTL ? 'جدة، السعودية' : 'Jeddah, Saudi Arabia'}</span>
              </span>
              <div className="h-4 w-px bg-primary-700 hidden lg:block" />
              <ThemeToggle locale={locale} />
              <div className="h-4 w-px bg-primary-700" />
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md border-b transition-all duration-300 ${isScrolled ? 'border-secondary-200/50 dark:border-secondary-700/50' : 'border-secondary-200 dark:border-secondary-700'}`}>
        <div className="container-wide">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className={`relative overflow-hidden rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300 bg-white p-1 ${isScrolled ? 'w-14 h-14' : 'w-16 h-16'}`}>
                <Image
                  src={groupInfo.logo}
                  alt={isRTL ? groupInfo.name.ar : groupInfo.name.en}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                  {isRTL ? groupInfo.name.ar : groupInfo.shortName.en}
                </span>
                <span className={`text-xs text-secondary-500 dark:text-secondary-400 transition-all duration-300 ${isScrolled ? 'hidden' : 'hidden sm:block'}`}>
                  {isRTL ? 'للتجارة والصناعة' : groupInfo.name.en}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && setIsMegaMenuOpen(true)}
                  onMouseLeave={() => item.hasMegaMenu && setIsMegaMenuOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all font-medium ${
                      item.hasMegaMenu && isMegaMenuOpen ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' : ''
                    }`}
                  >
                    {item.name}
                    {item.hasMegaMenu && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {item.hasMegaMenu && isMegaMenuOpen && (
                    <div className="absolute top-full start-0 pt-2 w-[600px] animate-slide-down">
                      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-hard dark:shadow-lg dark:shadow-secondary-900/50 border border-secondary-200 dark:border-secondary-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-secondary-900 dark:text-white">
                            {isRTL ? 'تصفح الأقسام' : 'Browse Categories'}
                          </h3>
                          <Link
                            href={`/${locale}/products`}
                            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                          >
                            {isRTL ? 'عرض الكل' : 'View All'}
                            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {categories.map((cat) => {
                            const Icon = cat.icon
                            return (
                              <Link
                                key={cat.slug}
                                href={`/${locale}/categories/${cat.slug}`}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors group"
                              >
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="font-medium text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors block">
                                    {isRTL ? cat.nameAr : cat.nameEn}
                                  </span>
                                  <span className="text-xs text-secondary-500 dark:text-secondary-400">
                                    {isRTL ? cat.descAr : cat.descEn}
                                  </span>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                aria-label={isRTL ? 'بحث' : 'Search'}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <CartBadge locale={locale} />

              {/* Account / Auth */}
              {isAuthenticated && customer ? (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                    className="flex items-center gap-2 px-3 py-2 text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:block">
                      {customer.firstName}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full end-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-xl shadow-hard dark:shadow-lg dark:shadow-secondary-900/50 border border-secondary-200 dark:border-secondary-700 py-2 animate-slide-down z-50">
                      <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{customer.email}</p>
                      </div>
                      <Link
                        href={`/${locale}/account`}
                        className="flex items-center gap-3 px-4 py-2.5 text-secondary-700 dark:text-secondary-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">{isRTL ? 'حسابي' : 'My Account'}</span>
                      </Link>
                      <Link
                        href={`/${locale}/account/orders`}
                        className="flex items-center gap-3 px-4 py-2.5 text-secondary-700 dark:text-secondary-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span className="text-sm">{isRTL ? 'طلباتي' : 'My Orders'}</span>
                      </Link>
                      <Link
                        href={`/${locale}/account/settings`}
                        className="flex items-center gap-3 px-4 py-2.5 text-secondary-700 dark:text-secondary-200 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">{isRTL ? 'الإعدادات' : 'Settings'}</span>
                      </Link>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-error-600 dark:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all font-medium"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm hidden md:block">{dict.common.login}</span>
                </Link>
              )}

              {/* Quote Request Button */}
              <Link
                href={`/${locale}/quote-request`}
                className="hidden md:flex items-center gap-2 btn bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-soft hover:shadow-medium"
              >
                {isRTL ? 'طلب عرض سعر' : 'Get Quote'}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-3 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 animate-slide-down">
          <div className="container-custom py-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-1 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.hasMegaMenu && <ChevronDown className="w-4 h-4" />}
                </Link>
              ))}
            </nav>

            {/* Mobile Categories */}
            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4 mb-4">
              <h3 className="text-sm font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3 px-4">
                {isRTL ? 'الأقسام' : 'Categories'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${locale}/categories/${cat.slug}`}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-200">
                        {isRTL ? cat.nameAr : cat.nameEn}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/${locale}/quote-request`}
                className="btn bg-primary-600 text-white text-center py-3 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {isRTL ? 'طلب عرض سعر' : 'Get Quote'}
              </Link>
              {isAuthenticated && customer ? (
                <>
                  <Link
                    href={`/${locale}/account`}
                    className="btn border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-200 text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    {isRTL ? 'حسابي' : 'My Account'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="btn border border-error-300 dark:border-error-600 text-error-600 dark:text-error-400 text-center py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    {isRTL ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="btn border border-secondary-300 dark:border-secondary-600 text-secondary-700 dark:text-secondary-200 text-center py-3 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.common.login}
                </Link>
              )}
            </div>

            {/* Mobile Contact */}
            <div className="border-t border-secondary-200 dark:border-secondary-700 mt-4 pt-4">
              <a href="tel:+966554401575" className="flex items-center gap-3 text-secondary-600 dark:text-secondary-300 py-2">
                <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span dir="ltr">+966 55 440 1575</span>
              </a>
              <a href="mailto:info@alsadara.org" className="flex items-center gap-3 text-secondary-600 dark:text-secondary-300 py-2">
                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span>info@alsadara.org</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer locale={locale} dict={dict} />

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 relative">
                  <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'ابحث عن المنتجات...' : 'Search products...'}
                    className="w-full ps-12 pe-4 py-3 bg-secondary-100 dark:bg-secondary-700 border-0 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Voice Search Button */}
                <VoiceSearch
                  variant="button"
                  onResult={handleVoiceSearchResult}
                  onSearch={handleSearch}
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                  aria-label={isRTL ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-3">
                {isRTL ? 'تصفح سريع' : 'Quick Links'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${locale}/categories/${cat.slug}`}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary-100 dark:bg-secondary-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm text-secondary-700 dark:text-secondary-200">
                        {isRTL ? cat.nameAr : cat.nameEn}
                      </span>
                    </Link>
                  )
                })}
              </div>

              {/* Voice Search Hint */}
              <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center gap-3">
                <Mic className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  {isRTL
                    ? 'اضغط على أيقونة الميكروفون للبحث صوتياً'
                    : 'Click the microphone icon to search by voice'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
