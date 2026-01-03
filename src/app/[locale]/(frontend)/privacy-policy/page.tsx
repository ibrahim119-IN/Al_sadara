'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const { locale, isArabic } = useLocale()

  const breadcrumbItems = [
    { label: isArabic ? 'سياسة الخصوصية' : 'Privacy Policy' },
  ]

  const content = {
    ar: {
      title: 'سياسة الخصوصية',
      subtitle: 'نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية',
      lastUpdated: 'آخر تحديث: ديسمبر 2024',
      sections: [
        {
          icon: Database,
          title: 'المعلومات التي نجمعها',
          content: `نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل:
          • الاسم الكامل وعنوان البريد الإلكتروني
          • رقم الهاتف وعنوان الشحن
          • معلومات الدفع (يتم معالجتها بشكل آمن عبر مزودي خدمات الدفع)
          • تفضيلات التسوق وسجل الطلبات

          كما نجمع معلومات تلقائياً عند استخدام موقعنا، تشمل:
          • عنوان IP ونوع المتصفح
          • صفحات الويب التي تزورها ووقت الزيارة
          • معلومات الجهاز ونظام التشغيل`,
        },
        {
          icon: Eye,
          title: 'كيف نستخدم معلوماتك',
          content: `نستخدم المعلومات المجمعة للأغراض التالية:
          • معالجة وتنفيذ طلباتك
          • التواصل معك بشأن طلباتك وحسابك
          • إرسال تحديثات عن المنتجات والعروض الترويجية (بموافقتك)
          • تحسين موقعنا وتجربة التسوق
          • منع الاحتيال وضمان أمان الموقع
          • الامتثال للالتزامات القانونية`,
        },
        {
          icon: Shield,
          title: 'حماية البيانات',
          content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:
          • تشفير SSL لجميع عمليات نقل البيانات
          • تخزين آمن للبيانات مع التشفير
          • الوصول المقيد للموظفين المخولين فقط
          • مراجعات أمنية دورية وتحديثات
          • الامتثال لمعايير PCI DSS لبيانات الدفع`,
        },
        {
          icon: UserCheck,
          title: 'حقوقك',
          content: `لديك الحقوق التالية فيما يتعلق ببياناتك:
          • الوصول إلى بياناتك الشخصية
          • تصحيح البيانات غير الدقيقة
          • طلب حذف بياناتك
          • الاعتراض على معالجة بياناتك
          • سحب موافقتك في أي وقت
          • نقل بياناتك إلى خدمة أخرى`,
        },
        {
          icon: Lock,
          title: 'ملفات تعريف الارتباط (Cookies)',
          content: `نستخدم ملفات تعريف الارتباط لـ:
          • تذكر تفضيلاتك وإعدادات الحساب
          • تحليل حركة المرور على الموقع
          • تخصيص تجربة التسوق
          • عرض إعلانات ذات صلة

          يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.`,
        },
        {
          icon: Mail,
          title: 'اتصل بنا',
          content: `إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا:
          • البريد الإلكتروني: info@alsadara.org
          • الهاتف: +966 55 440 1575
          • العنوان: جدة، السعودية`,
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'We are committed to protecting your privacy and personal data',
      lastUpdated: 'Last Updated: December 2024',
      sections: [
        {
          icon: Database,
          title: 'Information We Collect',
          content: `We collect information you provide directly to us, such as:
          • Full name and email address
          • Phone number and shipping address
          • Payment information (processed securely via payment providers)
          • Shopping preferences and order history

          We also automatically collect information when you use our site:
          • IP address and browser type
          • Pages visited and time of visit
          • Device information and operating system`,
        },
        {
          icon: Eye,
          title: 'How We Use Your Information',
          content: `We use the collected information for the following purposes:
          • Processing and fulfilling your orders
          • Communicating with you about your orders and account
          • Sending product updates and promotions (with your consent)
          • Improving our website and shopping experience
          • Preventing fraud and ensuring site security
          • Complying with legal obligations`,
        },
        {
          icon: Shield,
          title: 'Data Protection',
          content: `We implement strict security measures to protect your information:
          • SSL encryption for all data transfers
          • Secure data storage with encryption
          • Restricted access to authorized personnel only
          • Regular security audits and updates
          • PCI DSS compliance for payment data`,
        },
        {
          icon: UserCheck,
          title: 'Your Rights',
          content: `You have the following rights regarding your data:
          • Access your personal data
          • Correct inaccurate data
          • Request deletion of your data
          • Object to data processing
          • Withdraw consent at any time
          • Transfer your data to another service`,
        },
        {
          icon: Lock,
          title: 'Cookies',
          content: `We use cookies to:
          • Remember your preferences and account settings
          • Analyze site traffic
          • Personalize your shopping experience
          • Display relevant advertisements

          You can control cookies through your browser settings.`,
        },
        {
          icon: Mail,
          title: 'Contact Us',
          content: `If you have any questions about this Privacy Policy, please contact us:
          • Email: info@alsadara.org
          • Phone: +966 55 440 1575
          • Address: Jeddah, Saudi Arabia`,
        },
      ],
    },
  }

  const t = content[locale]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
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
              <Shield className="w-5 h-5 text-primary-400" />
              <span className="text-white/90 font-medium">{t.lastUpdated}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.title}
            </h1>

            <p className="text-xl text-white/80">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {t.sections.map((section, index) => {
              const Icon = section.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-secondary-900 mb-4">
                        {section.title}
                      </h2>
                      <div className="text-secondary-600 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
