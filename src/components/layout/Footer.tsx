import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { groupInfo } from '@/data/group-data'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  ArrowRight,
  Cylinder,
  Box,
  Layers,
  Recycle,
  CheckCircle2,
  Award,
  Headphones
} from 'lucide-react'

interface FooterProps {
  locale: Locale
  dict: Dictionary
}

export function Footer({ locale, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const isRTL = locale === 'ar'

  const products = [
    { name: isRTL ? 'بولي إيثيلين عالي الكثافة' : 'HDPE', href: `/${locale}/categories/hdpe`, icon: Cylinder },
    { name: isRTL ? 'بولي إيثيلين منخفض الكثافة' : 'LDPE', href: `/${locale}/categories/ldpe`, icon: Box },
    { name: isRTL ? 'بولي بروبلين' : 'Polypropylene (PP)', href: `/${locale}/categories/pp`, icon: Layers },
    { name: isRTL ? 'بلاستيك معاد التدوير' : 'Recycled Plastics', href: `/${locale}/categories/recycled`, icon: Recycle },
  ]

  const quickLinks = [
    { name: dict.common.products, href: `/${locale}/products` },
    { name: dict.common.about, href: `/${locale}/about` },
    { name: dict.common.contact, href: `/${locale}/contact` },
    { name: dict.quote.title, href: `/${locale}/quote-request` },
  ]

  const support = [
    { name: isRTL ? 'الأسئلة الشائعة' : 'FAQ', href: `/${locale}/faq` },
    { name: isRTL ? 'الدعم الفني' : 'Technical Support', href: `/${locale}/support` },
    { name: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', href: `/${locale}/privacy` },
    { name: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions', href: `/${locale}/terms` },
  ]

  const features = [
    { text: isRTL ? 'جودة عالية مضمونة' : 'Guaranteed Quality', icon: CheckCircle2 },
    { text: isRTL ? 'دعم فني متواصل' : 'Continuous Support', icon: Headphones },
    { text: isRTL ? 'خامات أصلية 100%' : '100% Genuine Materials', icon: Award },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Features Bar */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700">
        <div className="container-wide py-6">
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3 text-white group">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Info - Larger Column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg bg-white/10">
                <Image
                  src={groupInfo.logo}
                  alt={isRTL ? groupInfo.name.ar : groupInfo.name.en}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-bold text-2xl block">
                  {groupInfo.shortName.en}
                </span>
                <span className="text-secondary-400 text-sm">
                  {isRTL ? groupInfo.name.ar : groupInfo.name.en}
                </span>
              </div>
            </div>

            <p className="text-secondary-400 leading-relaxed mb-6">
              {isRTL
                ? groupInfo.description.ar
                : groupInfo.description.en}
            </p>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-secondary-800/80 to-secondary-800/40 rounded-2xl p-6 border border-secondary-700/50">
              <h4 className="font-bold text-lg mb-2">
                {isRTL ? 'اشترك في النشرة البريدية' : 'Subscribe to Newsletter'}
              </h4>
              <p className="text-secondary-400 text-sm mb-4">
                {isRTL ? 'احصل على آخر العروض والمنتجات الجديدة' : 'Get the latest offers and new products'}
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your email'}
                  className="flex-1 px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-xl text-white placeholder:text-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm transition-all"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-primary-600 hover:bg-primary-500 rounded-xl transition-all hover:-translate-y-0.5 shadow-btn"
                >
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              {isRTL ? 'منتجاتنا' : 'Our Products'}
            </h3>
            <ul className="space-y-3">
              {products.map((product) => {
                const Icon = product.icon
                return (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      className="flex items-center gap-2 text-secondary-400 hover:text-white transition-colors group"
                    >
                      <Icon className="w-4 h-4 text-primary-500 group-hover:text-primary-400" />
                      <span className="text-sm">{product.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'rotate-180' : ''}`} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              {isRTL ? 'الدعم' : 'Support'}
            </h3>
            <ul className="space-y-3">
              {support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'rotate-180' : ''}`} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              {dict.footer.contactUs}
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+966554401575" className="flex items-start gap-3 text-secondary-400 hover:text-white transition-colors group">
                  <div className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-500 block">{isRTL ? 'اتصل بنا' : 'Call us'}</span>
                    <span className="text-sm" dir="ltr">+966 55 440 1575</span>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${groupInfo.contact.email}`} className="flex items-start gap-3 text-secondary-400 hover:text-white transition-colors group">
                  <div className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-500 block">{isRTL ? 'البريد الإلكتروني' : 'Email'}</span>
                    <span className="text-sm">{groupInfo.contact.email}</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-secondary-400">
                  <div className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-500 block">{isRTL ? 'العنوان' : 'Address'}</span>
                    <span className="text-sm">{isRTL ? 'جدة، السعودية' : 'Jeddah, Saudi Arabia'}</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-secondary-400">
                  <div className="w-9 h-9 bg-secondary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-secondary-500 block">{isRTL ? 'ساعات العمل' : 'Working Hours'}</span>
                    <span className="text-sm">{isRTL ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9AM - 6PM'}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-wide py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-secondary-500 text-sm text-center md:text-start">
              {dict.footer.copyright} {currentYear} {groupInfo.shortName.en}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-secondary-500 text-sm hidden sm:block">{dict.footer.followUs}:</span>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/966554401575"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 text-secondary-500 text-sm">
              <span className="hidden sm:block">{isRTL ? 'طرق الدفع:' : 'Payment Methods:'}</span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-secondary-800 rounded text-xs">Visa</span>
                <span className="px-2 py-1 bg-secondary-800 rounded text-xs">Vodafone Cash</span>
                <span className="px-2 py-1 bg-secondary-800 rounded text-xs">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
