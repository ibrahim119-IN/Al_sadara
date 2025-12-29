'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { Truck, Package, RefreshCw, Clock, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

export default function ShippingReturnsPage() {
  const { locale, isArabic } = useLocale()

  const breadcrumbItems = [
    { label: isArabic ? 'الشحن والإرجاع' : 'Shipping & Returns' },
  ]

  const content = {
    ar: {
      title: 'الشحن والإرجاع',
      subtitle: 'كل ما تحتاج معرفته عن الشحن والإرجاع',
      shipping: {
        title: 'سياسة الشحن',
        sections: [
          {
            icon: Truck,
            title: 'مناطق التوصيل',
            content: `نقوم بالتوصيل إلى جميع أنحاء مصر والمملكة العربية السعودية:

**مصر:**
• القاهرة والجيزة والإسكندرية
• جميع محافظات الدلتا والصعيد
• المدن الساحلية والسياحية

**السعودية:**
• الرياض وجدة والدمام
• مكة المكرمة والمدينة المنورة
• جميع المناطق والمدن الرئيسية`,
          },
          {
            icon: Clock,
            title: 'مواعيد التوصيل',
            items: [
              { label: 'القاهرة الكبرى', value: '2-3 أيام عمل' },
              { label: 'الإسكندرية', value: '3-4 أيام عمل' },
              { label: 'المحافظات الأخرى', value: '5-7 أيام عمل' },
              { label: 'الرياض وجدة', value: '3-5 أيام عمل' },
              { label: 'مدن السعودية الأخرى', value: '5-10 أيام عمل' },
            ],
          },
          {
            icon: CreditCard,
            title: 'تكاليف الشحن',
            content: `**الشحن المجاني:**
• للطلبات أكثر من 500 ج.م في مصر
• للطلبات أكثر من 200 ر.س في السعودية

**رسوم الشحن العادي:**
• القاهرة الكبرى: 30-50 ج.م
• المحافظات: 50-80 ج.م
• السعودية: 30-60 ر.س

*قد تختلف الرسوم حسب حجم ووزن الشحنة*`,
          },
          {
            icon: MapPin,
            title: 'تتبع الشحنة',
            content: `بمجرد شحن طلبك، ستتلقى:
• رقم تتبع عبر البريد الإلكتروني
• رسالة نصية برقم التتبع
• إشعارات بتحديثات الشحنة

يمكنك تتبع طلبك من خلال:
• حسابك على الموقع
• موقع شركة الشحن مباشرة
• التواصل مع خدمة العملاء`,
          },
        ],
      },
      returns: {
        title: 'سياسة الإرجاع والاستبدال',
        sections: [
          {
            icon: RefreshCw,
            title: 'شروط الإرجاع',
            content: `يمكنك إرجاع المنتج خلال 14 يومًا من الاستلام بالشروط التالية:
• المنتج في حالته الأصلية وغير مستخدم
• العبوة الأصلية متوفرة وسليمة
• جميع الملحقات والإكسسوارات متوفرة
• فاتورة الشراء الأصلية موجودة`,
          },
          {
            icon: AlertCircle,
            title: 'المنتجات المستثناة من الإرجاع',
            items: [
              'المنتجات المخصصة أو المصنعة حسب الطلب',
              'البرمجيات والمنتجات الرقمية بعد الفتح',
              'المنتجات التي تم استخدامها أو تلفها',
              'منتجات العناية الشخصية والصحية',
              'المنتجات المخفضة أو التصفيات النهائية',
            ],
          },
          {
            icon: Package,
            title: 'خطوات الإرجاع',
            steps: [
              'تواصل مع خدمة العملاء لطلب الإرجاع',
              'احصل على رقم مرجعي للإرجاع (RMA)',
              'قم بتغليف المنتج بشكل آمن مع كافة الملحقات',
              'أرسل الشحنة عبر شركة الشحن المعتمدة',
              'انتظر إشعار استلام ومراجعة المنتج',
              'سيتم استرداد المبلغ خلال 7-14 يوم عمل',
            ],
          },
          {
            icon: CreditCard,
            title: 'طرق الاسترداد',
            content: `يتم الاسترداد بنفس طريقة الدفع الأصلية:
• **بطاقات الائتمان:** 7-14 يوم عمل
• **التحويل البنكي:** 5-7 أيام عمل
• **الدفع عند الاستلام:** تحويل بنكي أو رصيد متجر

**رسوم الإرجاع:**
• في حالة العيوب المصنعية: مجاني
• في حالة تغيير الرأي: على حساب العميل`,
          },
        ],
      },
      warranty: {
        title: 'الضمان',
        content: `جميع منتجاتنا مشمولة بضمان المصنع الرسمي:
• **الإلكترونيات:** ضمان 1-2 سنة
• **الأجهزة الذكية:** ضمان 1-3 سنوات
• **الإضاءة:** ضمان سنة واحدة

**ما يغطيه الضمان:**
• العيوب المصنعية
• أعطال المكونات الداخلية
• مشاكل الأداء غير الطبيعية

**ما لا يغطيه الضمان:**
• الأضرار الناتجة عن سوء الاستخدام
• الأضرار الناتجة عن الحوادث أو الماء
• التعديلات غير المصرح بها`,
      },
    },
    en: {
      title: 'Shipping & Returns',
      subtitle: 'Everything you need to know about shipping and returns',
      shipping: {
        title: 'Shipping Policy',
        sections: [
          {
            icon: Truck,
            title: 'Delivery Areas',
            content: `We deliver throughout Egypt and Saudi Arabia:

**Egypt:**
• Cairo, Giza, and Alexandria
• All Delta and Upper Egypt governorates
• Coastal and tourist cities

**Saudi Arabia:**
• Riyadh, Jeddah, and Dammam
• Mecca and Medina
• All regions and major cities`,
          },
          {
            icon: Clock,
            title: 'Delivery Times',
            items: [
              { label: 'Greater Cairo', value: '2-3 business days' },
              { label: 'Alexandria', value: '3-4 business days' },
              { label: 'Other governorates', value: '5-7 business days' },
              { label: 'Riyadh and Jeddah', value: '3-5 business days' },
              { label: 'Other Saudi cities', value: '5-10 business days' },
            ],
          },
          {
            icon: CreditCard,
            title: 'Shipping Costs',
            content: `**Free Shipping:**
• Orders over 500 EGP in Egypt
• Orders over 200 SAR in Saudi Arabia

**Standard Shipping Fees:**
• Greater Cairo: 30-50 EGP
• Governorates: 50-80 EGP
• Saudi Arabia: 30-60 SAR

*Fees may vary based on shipment size and weight*`,
          },
          {
            icon: MapPin,
            title: 'Shipment Tracking',
            content: `Once your order ships, you'll receive:
• Tracking number via email
• SMS with tracking number
• Shipment update notifications

You can track your order through:
• Your account on our website
• Shipping company website directly
• Contacting customer service`,
          },
        ],
      },
      returns: {
        title: 'Returns & Exchange Policy',
        sections: [
          {
            icon: RefreshCw,
            title: 'Return Conditions',
            content: `You can return the product within 14 days of receipt under these conditions:
• Product is in original condition and unused
• Original packaging is available and intact
• All accessories and attachments are included
• Original purchase receipt is available`,
          },
          {
            icon: AlertCircle,
            title: 'Products Excluded from Returns',
            items: [
              'Custom or made-to-order products',
              'Software and digital products after opening',
              'Products that have been used or damaged',
              'Personal care and health products',
              'Discounted or final clearance products',
            ],
          },
          {
            icon: Package,
            title: 'Return Steps',
            steps: [
              'Contact customer service to request a return',
              'Obtain a Return Merchandise Authorization (RMA) number',
              'Pack the product securely with all accessories',
              'Ship via the approved shipping company',
              'Wait for receipt and product review notification',
              'Refund will be processed within 7-14 business days',
            ],
          },
          {
            icon: CreditCard,
            title: 'Refund Methods',
            content: `Refunds are issued via the original payment method:
• **Credit Cards:** 7-14 business days
• **Bank Transfer:** 5-7 business days
• **Cash on Delivery:** Bank transfer or store credit

**Return Shipping Fees:**
• Manufacturing defects: Free
• Change of mind: Customer's responsibility`,
          },
        ],
      },
      warranty: {
        title: 'Warranty',
        content: `All our products are covered by official manufacturer warranty:
• **Electronics:** 1-2 year warranty
• **Smart Devices:** 1-3 years warranty
• **Lighting:** 1 year warranty

**What warranty covers:**
• Manufacturing defects
• Internal component failures
• Abnormal performance issues

**What warranty doesn't cover:**
• Damage from misuse
• Damage from accidents or water
• Unauthorized modifications`,
      },
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
              <Truck className="w-5 h-5 text-primary-400" />
              <RefreshCw className="w-5 h-5 text-primary-400" />
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

      {/* Shipping Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary-600" />
              {t.shipping.title}
            </h2>

            <div className="grid gap-8">
              {t.shipping.sections.map((section, index) => {
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
                        <h3 className="text-xl font-bold text-secondary-900 mb-4">
                          {section.title}
                        </h3>

                        {section.content && (
                          <div className="text-secondary-600 leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                            {section.content.split('**').map((part, i) =>
                              i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                            )}
                          </div>
                        )}

                        {section.items && (
                          <div className="space-y-3">
                            {section.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center py-2 border-b border-secondary-100 last:border-0">
                                <span className="text-secondary-600">{item.label}</span>
                                <span className="font-semibold text-secondary-900">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-primary-600" />
              {t.returns.title}
            </h2>

            <div className="grid gap-8">
              {t.returns.sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div
                    key={index}
                    className="bg-secondary-50 rounded-2xl p-8 border border-secondary-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-secondary-900 mb-4">
                          {section.title}
                        </h3>

                        {section.content && (
                          <div className="text-secondary-600 leading-relaxed whitespace-pre-line">
                            {section.content}
                          </div>
                        )}

                        {section.items && (
                          <ul className="space-y-2">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-secondary-600">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.steps && (
                          <ol className="space-y-3">
                            {section.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="text-secondary-600">{step}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{t.warranty.title}</h2>
                </div>
              </div>

              <div className="text-white/90 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                {t.warranty.content.split('**').map((part, i) =>
                  i % 2 === 0 ? part : <strong key={i} className="text-white">{part}</strong>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
