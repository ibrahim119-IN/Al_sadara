import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  User,
  Building2,
  FileText,
  CheckCircle2,
  Globe
} from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'تواصل معنا | مجموعة الصدارة القابضة'
      : 'Contact Us | Al Sadara Holding Group',
    description: isArabic
      ? 'تواصل مع مجموعة الصدارة القابضة - نحن هنا لمساعدتك. اتصل بنا، أرسل بريد إلكتروني، أو زورنا في مكاتبنا في مصر والسعودية.'
      : 'Contact Al Sadara Holding Group - We are here to help. Call us, email us, or visit our offices in Egypt and Saudi Arabia.',
    keywords: isArabic
      ? ['تواصل معنا', 'الصدارة', 'دعم العملاء', 'مصر', 'السعودية']
      : ['contact us', 'Al Sadara', 'customer support', 'Egypt', 'Saudi Arabia'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        'ar': `${BASE_URL}/ar/contact`,
        'en': `${BASE_URL}/en/contact`,
      },
    },
    openGraph: {
      title: isArabic ? 'تواصل معنا' : 'Contact Us',
      description: isArabic
        ? 'نحن هنا لمساعدتك - تواصل مع مجموعة الصدارة'
        : 'We are here to help - Contact Al Sadara Group',
      url: `${BASE_URL}/${locale}/contact`,
      type: 'website',
    },
  }
}

interface ContactPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const breadcrumbItems = [
    { label: isRTL ? 'تواصل معنا' : 'Contact Us' },
  ]

  // Contact Page Schema
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: isRTL ? 'تواصل مع مجموعة الصدارة' : 'Contact Al Sadara Group',
    description: isRTL
      ? 'صفحة التواصل مع مجموعة الصدارة القابضة'
      : 'Contact page for Al Sadara Holding Group',
    url: `${BASE_URL}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: isRTL ? 'مجموعة الصدارة القابضة' : 'Al Sadara Holding Group',
      telephone: '+20 2 1234 5678',
      email: 'info@alsadara.org',
      address: {
        '@type': 'PostalAddress',
        addressLocality: isRTL ? 'القاهرة' : 'Cairo',
        addressCountry: isRTL ? 'مصر' : 'Egypt',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+20 2 1234 5678',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English'],
        },
        {
          '@type': 'ContactPoint',
          telephone: '+966 11 123 4567',
          contactType: 'sales',
          areaServed: 'SA',
          availableLanguage: ['Arabic', 'English'],
        },
      ],
    },
  }

  const content = {
    title: isRTL ? 'تواصل معنا' : 'Contact Us',
    subtitle: isRTL
      ? 'نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك.'
      : "We're here to help. Contact us through any method that suits you.",
    form: {
      title: isRTL ? 'أرسل لنا رسالة' : 'Send us a message',
      description: isRTL
        ? 'املأ النموذج التالي وسنرد عليك في أقرب وقت ممكن.'
        : 'Fill out the form below and we will get back to you as soon as possible.',
      name: isRTL ? 'الاسم الكامل' : 'Full Name',
      email: isRTL ? 'البريد الإلكتروني' : 'Email Address',
      phone: isRTL ? 'رقم الهاتف' : 'Phone Number',
      company: isRTL ? 'اسم الشركة' : 'Company Name',
      subject: isRTL ? 'الموضوع' : 'Subject',
      message: isRTL ? 'رسالتك' : 'Your Message',
      send: isRTL ? 'إرسال الرسالة' : 'Send Message',
      success: isRTL ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!',
    },
    offices: [
      {
        country: isRTL ? 'مصر' : 'Egypt',
        city: isRTL ? 'القاهرة' : 'Cairo',
        address: isRTL ? 'المعادي، القاهرة' : 'Maadi, Cairo',
        phone: '+20 2 1234 5678',
        email: 'egypt@alsadara.org',
      },
      {
        country: isRTL ? 'السعودية' : 'Saudi Arabia',
        city: isRTL ? 'الرياض' : 'Riyadh',
        address: isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia',
        phone: '+966 11 123 4567',
        email: 'saudi@alsadara.org',
      },
    ],
    info: [
      {
        icon: Phone,
        title: isRTL ? 'الهاتف' : 'Phone',
        value: '+20 2 1234 5678',
        link: 'tel:+2021234567',
      },
      {
        icon: Mail,
        title: isRTL ? 'البريد الإلكتروني' : 'Email',
        value: 'info@alsadara.org',
        link: 'mailto:info@alsadara.org',
      },
      {
        icon: Clock,
        title: isRTL ? 'ساعات العمل' : 'Working Hours',
        value: isRTL ? 'السبت - الخميس: 9ص - 6م' : 'Sat - Thu: 9AM - 6PM',
        link: null,
      },
      {
        icon: Globe,
        title: isRTL ? 'الموقع' : 'Website',
        value: 'alsadara.org',
        link: 'https://alsadara.org',
      },
    ],
    subjects: [
      { value: 'sales', label: isRTL ? 'استفسار مبيعات' : 'Sales Inquiry' },
      { value: 'support', label: isRTL ? 'دعم فني' : 'Technical Support' },
      { value: 'quote', label: isRTL ? 'طلب عرض سعر' : 'Quote Request' },
      { value: 'partnership', label: isRTL ? 'شراكة' : 'Partnership' },
      { value: 'careers', label: isRTL ? 'وظائف' : 'Careers' },
      { value: 'other', label: isRTL ? 'أخرى' : 'Other' },
    ],
    benefits: [
      { text: isRTL ? 'رد خلال 24 ساعة' : 'Response within 24 hours', icon: Clock },
      { text: isRTL ? 'فريق دعم متخصص' : 'Dedicated support team', icon: User },
      { text: isRTL ? 'استشارة مجانية' : 'Free consultation', icon: CheckCircle2 },
    ],
  }

  return (
    <>
      {/* Contact Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="min-h-screen bg-secondary-50">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <SimpleBreadcrumb
              items={breadcrumbItems}
              locale={locale}
              className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
            />

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                <span className="text-white/90 font-medium">
                  {isRTL ? 'نحن هنا للمساعدة' : "We're Here to Help"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {content.title}
              </h1>

              <p className="text-xl text-white/80 leading-relaxed">
                {content.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-12 -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {content.offices.map((office, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-secondary-100 hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-7 h-7 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-secondary-900">{office.city}</h3>
                        <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-0.5 rounded-full">
                          {office.country}
                        </span>
                      </div>
                      <p className="text-secondary-600 text-sm mb-3">{office.address}</p>
                      <div className="space-y-1">
                        <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr">{office.phone}</span>
                        </a>
                        <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600">
                          <Mail className="w-4 h-4" />
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-secondary-100">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                      {content.form.title}
                    </h2>
                    <p className="text-secondary-600">
                      {content.form.description}
                    </p>
                  </div>

                  <form className="space-y-6" action="/api/contact" method="POST">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {content.form.name} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-secondary-400">
                            <User className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            required
                            className="w-full ps-12 pe-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder={content.form.name}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {content.form.email} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-secondary-400">
                            <Mail className="w-5 h-5" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full ps-12 pe-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {content.form.phone}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-secondary-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            className="w-full ps-12 pe-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder="+20 1XX XXX XXXX"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          {content.form.company}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-secondary-400">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            name="company"
                            className="w-full ps-12 pe-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            placeholder={content.form.company}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {content.form.subject} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-secondary-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <select
                          name="subject"
                          required
                          className="w-full ps-12 pe-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                        >
                          <option value="">{isRTL ? 'اختر الموضوع...' : 'Select subject...'}</option>
                          {content.subjects.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                              {subject.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        {content.form.message} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        required
                        className="w-full px-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                      <Send className="w-5 h-5" />
                      {content.form.send}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="space-y-6">
                {/* Quick Contact */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
                  <h3 className="font-bold text-lg text-secondary-900 mb-4">
                    {isRTL ? 'معلومات التواصل' : 'Contact Information'}
                  </h3>
                  <div className="space-y-4">
                    {content.info.map((item, index) => {
                      const Icon = item.icon
                      return item.link ? (
                        <a
                          key={index}
                          href={item.link}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                            <Icon className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm text-secondary-500">{item.title}</p>
                            <p className="font-medium text-secondary-900 group-hover:text-primary-600" dir={item.title.includes('هاتف') || item.title === 'Phone' ? 'ltr' : undefined}>
                              {item.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div key={index} className="flex items-center gap-3 p-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-sm text-secondary-500">{item.title}</p>
                            <p className="font-medium text-secondary-900">{item.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-4">
                    {isRTL ? 'لماذا تتواصل معنا؟' : 'Why Contact Us?'}
                  </h3>
                  <ul className="space-y-4">
                    {content.benefits.map((benefit, index) => {
                      const Icon = benefit.icon
                      return (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span>{benefit.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Social Links */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
                  <h3 className="font-bold text-secondary-900 mb-4">{isRTL ? 'تابعنا' : 'Follow Us'}</h3>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com/alsadara"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://instagram.com/alsadara"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com/company/alsadara"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 hover:bg-blue-700 hover:text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="https://wa.me/201234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 hover:bg-green-600 hover:text-white transition-colors"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-96 bg-secondary-200 relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.0!2d31.2357!3d29.9773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU4JzM4LjMiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={isRTL ? 'موقعنا على الخريطة' : 'Our Location on Map'}
          />
        </section>
      </div>
    </>
  )
}
