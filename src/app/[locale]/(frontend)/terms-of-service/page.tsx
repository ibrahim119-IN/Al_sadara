'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { FileText, Scale, ShoppingBag, CreditCard, Truck, AlertTriangle, Gavel } from 'lucide-react'

export default function TermsOfServicePage() {
  const { locale, isArabic } = useLocale()

  const breadcrumbItems = [
    { label: isArabic ? 'شروط الخدمة' : 'Terms of Service' },
  ]

  const content = {
    ar: {
      title: 'شروط الخدمة',
      subtitle: 'يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا',
      lastUpdated: 'آخر تحديث: ديسمبر 2024',
      sections: [
        {
          icon: FileText,
          title: 'قبول الشروط',
          content: `باستخدامك لموقع مجموعة الصدارة القابضة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام موقعنا.

تحتفظ مجموعة الصدارة القابضة بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التغييرات على هذه الصفحة، ويعتبر استمرارك في استخدام الموقع بعد نشر التغييرات موافقة منك على الشروط المعدلة.`,
        },
        {
          icon: Scale,
          title: 'الأهلية',
          content: `لاستخدام خدماتنا، يجب أن:
          • تكون في سن 18 عامًا أو أكثر
          • تمتلك الأهلية القانونية لإبرام العقود
          • تقدم معلومات صحيحة ودقيقة
          • تحافظ على سرية بيانات حسابك

          نحتفظ بالحق في رفض الخدمة لأي شخص في أي وقت.`,
        },
        {
          icon: ShoppingBag,
          title: 'الطلبات والمنتجات',
          content: `• جميع الطلبات خاضعة للتوفر والقبول
          • نحتفظ بالحق في رفض أي طلب
          • الأسعار قابلة للتغيير دون إشعار مسبق
          • صور المنتجات للتوضيح فقط وقد تختلف عن المنتج الفعلي
          • نضمن جودة جميع المنتجات المباعة
          • للمنتجات الإلكترونية ضمان حسب سياسة الشركة المصنعة`,
        },
        {
          icon: CreditCard,
          title: 'الدفع والأسعار',
          content: `• جميع الأسعار معروضة بالجنيه المصري أو الريال السعودي
          • يتم احتساب الضرائب حسب موقعك
          • نقبل طرق دفع متعددة (بطاقات ائتمان، تحويل بنكي، الدفع عند الاستلام)
          • يتم تأكيد الطلب بعد التحقق من الدفع
          • في حالة فشل الدفع، قد يتم إلغاء الطلب`,
        },
        {
          icon: Truck,
          title: 'الشحن والتوصيل',
          content: `• مواعيد التوصيل تقديرية وليست مضمونة
          • نحن غير مسؤولين عن التأخيرات الخارجة عن إرادتنا
          • يجب فحص المنتجات عند الاستلام
          • أي ضرر ظاهر يجب الإبلاغ عنه فورًا
          • رسوم الشحن غير قابلة للاسترداد`,
        },
        {
          icon: AlertTriangle,
          title: 'حدود المسؤولية',
          content: `• الموقع متاح "كما هو" دون أي ضمانات
          • لا نتحمل مسؤولية الأضرار غير المباشرة
          • مسؤوليتنا محدودة بقيمة المنتج المشترى
          • لا نضمن عدم انقطاع الخدمة
          • لسنا مسؤولين عن محتوى الروابط الخارجية`,
        },
        {
          icon: Gavel,
          title: 'القانون الواجب التطبيق',
          content: `تخضع هذه الشروط لقوانين جمهورية مصر العربية والمملكة العربية السعودية حسب موقع الخدمة. أي نزاع ينشأ يخضع للاختصاص القضائي للمحاكم المختصة.

للاستفسارات القانونية، يرجى التواصل على: info@alsadara.org`,
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      subtitle: 'Please read these terms carefully before using our website',
      lastUpdated: 'Last Updated: December 2024',
      sections: [
        {
          icon: FileText,
          title: 'Acceptance of Terms',
          content: `By using Al Sadara Holding Group's website, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, please do not use our website.

Al Sadara Holding Group reserves the right to modify these terms at any time. Changes will be posted on this page, and your continued use of the site after posting changes constitutes acceptance of the modified terms.`,
        },
        {
          icon: Scale,
          title: 'Eligibility',
          content: `To use our services, you must:
          • Be 18 years of age or older
          • Have legal capacity to enter into contracts
          • Provide true and accurate information
          • Maintain the confidentiality of your account data

          We reserve the right to refuse service to anyone at any time.`,
        },
        {
          icon: ShoppingBag,
          title: 'Orders and Products',
          content: `• All orders are subject to availability and acceptance
          • We reserve the right to refuse any order
          • Prices are subject to change without prior notice
          • Product images are for illustration only and may differ from actual product
          • We guarantee the quality of all products sold
          • Electronic products have warranty per manufacturer's policy`,
        },
        {
          icon: CreditCard,
          title: 'Payment and Pricing',
          content: `• All prices are displayed in Egyptian Pounds or Saudi Riyals
          • Taxes are calculated based on your location
          • We accept multiple payment methods (credit cards, bank transfer, cash on delivery)
          • Order is confirmed after payment verification
          • In case of payment failure, the order may be cancelled`,
        },
        {
          icon: Truck,
          title: 'Shipping and Delivery',
          content: `• Delivery times are estimates and not guaranteed
          • We are not responsible for delays beyond our control
          • Products should be inspected upon receipt
          • Any visible damage must be reported immediately
          • Shipping fees are non-refundable`,
        },
        {
          icon: AlertTriangle,
          title: 'Limitation of Liability',
          content: `• The website is available "as is" without any warranties
          • We are not liable for indirect damages
          • Our liability is limited to the value of the purchased product
          • We do not guarantee uninterrupted service
          • We are not responsible for external link content`,
        },
        {
          icon: Gavel,
          title: 'Governing Law',
          content: `These terms are governed by the laws of the Arab Republic of Egypt and the Kingdom of Saudi Arabia depending on service location. Any dispute arising is subject to the jurisdiction of the competent courts.

For legal inquiries, please contact: info@alsadara.org`,
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
              <FileText className="w-5 h-5 text-primary-400" />
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
