'use client'

import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { HelpCircle, ChevronDown, ShoppingCart, Truck, CreditCard, RefreshCw, Phone, Building2 } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  icon: React.ComponentType<{ className?: string }>
  title: string
  items: FAQItem[]
}

export default function FAQPage() {
  const { locale, isArabic } = useLocale()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const breadcrumbItems = [
    { label: isArabic ? 'الأسئلة الشائعة' : 'FAQ' },
  ]

  const content: Record<string, { title: string; subtitle: string; categories: FAQCategory[] }> = {
    ar: {
      title: 'الأسئلة الشائعة',
      subtitle: 'إجابات على أكثر الأسئلة شيوعًا',
      categories: [
        {
          icon: Building2,
          title: 'عن مجموعة الصدارة',
          items: [
            {
              question: 'ما هي مجموعة الصدارة القابضة؟',
              answer: 'مجموعة الصدارة القابضة هي شركة رائدة في مجال تجارة خامات البلاستيك والبوليمرات، تعمل في السعودية ومصر والإمارات مع 5 شركات متخصصة تقدم منتجات وخدمات عالية الجودة منذ 2005.',
            },
            {
              question: 'ما هي الشركات التابعة لمجموعة الصدارة؟',
              answer: 'تضم المجموعة 5 شركات: الصدارة للصناعة (السعودية)، التالة الخضراء والقيصر (مصر)، إس.إيه.إم والسيد شحاتة بوليمرز (الإمارات). كل شركة متخصصة في تجارة وتوريد خامات البلاستيك.',
            },
            {
              question: 'أين تقع مكاتب الشركة؟',
              answer: 'لدينا مكاتب في السعودية (جدة)، مصر (6 أكتوبر)، والإمارات (الشارقة ودبي). يمكنك زيارة صفحة "تواصل معنا" للحصول على العناوين التفصيلية.',
            },
          ],
        },
        {
          icon: ShoppingCart,
          title: 'الطلبات والمنتجات',
          items: [
            {
              question: 'كيف يمكنني تقديم طلب؟',
              answer: 'يمكنك تقديم طلب بسهولة عبر موقعنا: تصفح المنتجات، أضفها إلى السلة، ثم أتمم عملية الدفع. ستتلقى تأكيدًا بالبريد الإلكتروني فور إتمام الطلب.',
            },
            {
              question: 'هل يمكنني تعديل طلبي بعد تقديمه؟',
              answer: 'يمكنك تعديل طلبك خلال ساعة واحدة من تقديمه عبر التواصل مع خدمة العملاء. بعد بدء تجهيز الطلب، قد لا يكون التعديل ممكنًا.',
            },
            {
              question: 'هل المنتجات المعروضة أصلية؟',
              answer: 'نعم، جميع منتجاتنا أصلية 100% ومستوردة من مصادر موثوقة. نوفر ضمان المصنع الرسمي على جميع المنتجات.',
            },
          ],
        },
        {
          icon: CreditCard,
          title: 'الدفع',
          items: [
            {
              question: 'ما هي طرق الدفع المتاحة؟',
              answer: 'نقبل: بطاقات الائتمان (فيزا، ماستركارد)، التحويل البنكي، الدفع عند الاستلام (في مناطق محددة)، وخدمات الدفع الإلكتروني مثل فوري.',
            },
            {
              question: 'هل الدفع آمن؟',
              answer: 'نعم، موقعنا مؤمن بشهادة SSL ونستخدم بوابات دفع معتمدة تتوافق مع معايير PCI DSS لضمان أمان معلوماتك المالية.',
            },
            {
              question: 'هل يمكنني الدفع بالتقسيط؟',
              answer: 'نعم، نوفر خيارات التقسيط عبر البنوك الشريكة على المشتريات التي تزيد عن 3000 جنيه. تواصل معنا لمعرفة التفاصيل.',
            },
          ],
        },
        {
          icon: Truck,
          title: 'الشحن والتوصيل',
          items: [
            {
              question: 'كم تستغرق عملية التوصيل؟',
              answer: 'في مصر: 2-5 أيام عمل للقاهرة والإسكندرية، 5-7 أيام للمحافظات الأخرى. في السعودية: 3-5 أيام عمل للرياض وجدة، 5-10 أيام للمدن الأخرى.',
            },
            {
              question: 'كيف يمكنني تتبع طلبي؟',
              answer: 'بعد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني والرسائل النصية. يمكنك استخدامه لتتبع الشحنة عبر حسابك أو موقع شركة الشحن.',
            },
            {
              question: 'هل تتوفر خدمة التوصيل المجاني؟',
              answer: 'نعم، التوصيل مجاني للطلبات التي تزيد قيمتها عن 500 جنيه في مصر و200 ريال في السعودية.',
            },
          ],
        },
        {
          icon: RefreshCw,
          title: 'الإرجاع والاستبدال',
          items: [
            {
              question: 'ما هي سياسة الإرجاع؟',
              answer: 'يمكنك إرجاع المنتج خلال 14 يومًا من الاستلام بشرط أن يكون في حالته الأصلية مع العبوة الأصلية. بعض المنتجات مستثناة من الإرجاع.',
            },
            {
              question: 'كيف أقوم بإرجاع منتج؟',
              answer: 'تواصل مع خدمة العملاء لطلب الإرجاع، احصل على رقم مرجعي، ثم أرسل المنتج عبر شركة الشحن المعتمدة. سيتم استرداد المبلغ خلال 7-14 يوم عمل.',
            },
            {
              question: 'ماذا لو وصلني منتج تالف؟',
              answer: 'إذا وصلك منتج تالف، يرجى التواصل معنا فورًا مع إرفاق صور للمنتج والعبوة. سنقوم باستبداله مجانًا أو استرداد المبلغ كاملاً.',
            },
          ],
        },
        {
          icon: Phone,
          title: 'الدعم والتواصل',
          items: [
            {
              question: 'كيف يمكنني التواصل مع خدمة العملاء؟',
              answer: 'يمكنك التواصل معنا عبر: الهاتف (9 ص - 9 م)، البريد الإلكتروني support@alsadara.org، أو الدردشة المباشرة على الموقع.',
            },
            {
              question: 'هل لديكم ضمان على المنتجات؟',
              answer: 'نعم، جميع منتجاتنا مشمولة بضمان المصنع. مدة الضمان تختلف حسب المنتج وتتراوح بين سنة إلى 3 سنوات.',
            },
          ],
        },
      ],
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers to the most common questions',
      categories: [
        {
          icon: Building2,
          title: 'About Al Sadara Group',
          items: [
            {
              question: 'What is Al Sadara Holding Group?',
              answer: 'Al Sadara Holding Group is a leading company in plastic raw materials and polymers trading, operating in Saudi Arabia, Egypt, and UAE with 5 specialized companies offering high-quality products and services since 2005.',
            },
            {
              question: 'What are the subsidiaries of Al Sadara Group?',
              answer: 'The group includes 5 companies: Al Sadara Industry (Saudi Arabia), Al Talah Al Khadra and Al Qaysar (Egypt), S.A.M and El Sayed Shehata Polymers (UAE). Each specializes in plastic raw materials trading and supply.',
            },
            {
              question: 'Where are the company offices located?',
              answer: 'We have offices in Saudi Arabia (Jeddah), Egypt (6th of October City), and UAE (Sharjah and Dubai). Visit our "Contact Us" page for detailed addresses.',
            },
          ],
        },
        {
          icon: ShoppingCart,
          title: 'Orders and Products',
          items: [
            {
              question: 'How can I place an order?',
              answer: 'You can easily place an order on our website: browse products, add them to cart, then complete checkout. You will receive an email confirmation upon order completion.',
            },
            {
              question: 'Can I modify my order after placing it?',
              answer: 'You can modify your order within one hour of placing it by contacting customer service. After order processing begins, modifications may not be possible.',
            },
            {
              question: 'Are the products genuine?',
              answer: 'Yes, all our products are 100% genuine and imported from trusted sources. We provide official manufacturer warranty on all products.',
            },
          ],
        },
        {
          icon: CreditCard,
          title: 'Payment',
          items: [
            {
              question: 'What payment methods are available?',
              answer: 'We accept: credit cards (Visa, Mastercard), bank transfer, cash on delivery (in selected areas), and electronic payment services like Fawry.',
            },
            {
              question: 'Is payment secure?',
              answer: 'Yes, our website is secured with SSL certificate and we use certified payment gateways compliant with PCI DSS standards to ensure your financial information security.',
            },
            {
              question: 'Can I pay in installments?',
              answer: 'Yes, we offer installment options through partner banks for purchases over 3000 EGP. Contact us for details.',
            },
          ],
        },
        {
          icon: Truck,
          title: 'Shipping and Delivery',
          items: [
            {
              question: 'How long does delivery take?',
              answer: 'In Egypt: 2-5 business days for Cairo and Alexandria, 5-7 days for other governorates. In Saudi Arabia: 3-5 business days for Riyadh and Jeddah, 5-10 days for other cities.',
            },
            {
              question: 'How can I track my order?',
              answer: 'After your order ships, you will receive a tracking number via email and SMS. You can use it to track the shipment through your account or the shipping company website.',
            },
            {
              question: 'Is free shipping available?',
              answer: 'Yes, shipping is free for orders over 500 EGP in Egypt and 200 SAR in Saudi Arabia.',
            },
          ],
        },
        {
          icon: RefreshCw,
          title: 'Returns and Exchanges',
          items: [
            {
              question: 'What is the return policy?',
              answer: 'You can return the product within 14 days of receipt provided it is in its original condition with original packaging. Some products are exempt from returns.',
            },
            {
              question: 'How do I return a product?',
              answer: 'Contact customer service to request a return, get a reference number, then send the product via the approved shipping company. Refund will be processed within 7-14 business days.',
            },
            {
              question: 'What if I receive a damaged product?',
              answer: 'If you receive a damaged product, please contact us immediately with photos of the product and packaging. We will replace it free of charge or issue a full refund.',
            },
          ],
        },
        {
          icon: Phone,
          title: 'Support and Contact',
          items: [
            {
              question: 'How can I contact customer service?',
              answer: 'You can reach us via: phone (9 AM - 9 PM), email support@alsadara.org, or live chat on the website.',
            },
            {
              question: 'Do you have warranty on products?',
              answer: 'Yes, all our products are covered by manufacturer warranty. Warranty duration varies by product and ranges from 1 to 3 years.',
            },
          ],
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
              <HelpCircle className="w-5 h-5 text-primary-400" />
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

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {t.categories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon
              return (
                <div key={categoryIndex}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900">
                      {category.title}
                    </h2>
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => {
                      const key = `${categoryIndex}-${itemIndex}`
                      const isOpen = openItems[key]

                      return (
                        <div
                          key={itemIndex}
                          className="bg-white rounded-xl border border-secondary-100 overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary-50 transition-colors"
                          >
                            <span className="font-semibold text-secondary-900 pr-4">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-secondary-400 flex-shrink-0 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-200 ${
                              isOpen ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <div className="px-5 pb-5 text-secondary-600 leading-relaxed border-t border-secondary-100 pt-4">
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              {isArabic ? 'لم تجد إجابة لسؤالك؟' : "Didn't find your answer?"}
            </h2>
            <p className="text-secondary-600 mb-6">
              {isArabic
                ? 'فريق خدمة العملاء متاح لمساعدتك على مدار الساعة'
                : 'Our customer service team is available to help you around the clock'}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
