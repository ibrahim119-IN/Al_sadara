'use client'

import { useEffect, useRef, useState } from 'react'
import { Quote, Star } from 'lucide-react'

interface TestimonialsSectionProps {
  locale: 'ar' | 'en'
}

const testimonials = [
  {
    nameEn: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    roleEn: 'IT Manager, ABC Company',
    roleAr: 'مدير تقنية المعلومات، شركة ABC',
    textEn: 'Excellent service and high-quality products. The technical support team is always responsive and helpful. We have been using their CCTV systems for 2 years now.',
    textAr: 'خدمة ممتازة ومنتجات عالية الجودة. فريق الدعم الفني دائماً متجاوب ومساعد. نستخدم أنظمة المراقبة الخاصة بهم منذ عامين.',
    rating: 5,
    avatar: 'أ',
  },
  {
    nameEn: 'Sara Mohamed',
    nameAr: 'سارة محمد',
    roleEn: 'Operations Director',
    roleAr: 'مديرة العمليات',
    textEn: 'Professional team with deep technical knowledge. The installation was completed on time and the system works perfectly. Highly recommended for any business.',
    textAr: 'فريق محترف بمعرفة تقنية عميقة. تم التركيب في الوقت المحدد والنظام يعمل بشكل مثالي. أنصح بهم بشدة لأي شركة.',
    rating: 5,
    avatar: 'س',
  },
  {
    nameEn: 'Mahmoud Ali',
    nameAr: 'محمود علي',
    roleEn: 'Hospital Administrator',
    roleAr: 'مدير مستشفى',
    textEn: 'The nurse call system they installed has transformed our patient care. Excellent quality, reasonable prices, and ongoing support. Could not be happier.',
    textAr: 'نظام نداء التمريض الذي ركبوه غير طريقة رعاية المرضى لدينا. جودة ممتازة وأسعار معقولة ودعم مستمر. سعداء جداً بالتعامل.',
    rating: 5,
    avatar: 'م',
  },
]

export default function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const isRTL = locale === 'ar'
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section bg-gradient-to-br from-violet-50/80 via-white to-primary-50/60 relative overflow-hidden">
      {/* Stronger decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-300 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-violet-200/25 rounded-full blur-3xl -translate-y-1/4 -translate-x-1/4 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 end-0 w-[450px] h-[450px] bg-primary-200/20 rounded-full blur-3xl translate-y-1/4 translate-x-1/4 pointer-events-none" aria-hidden="true" />

      {/* Large quote decorations - more visible */}
      <div className="absolute top-32 start-8 text-[180px] font-serif text-violet-200/40 leading-none pointer-events-none select-none hidden lg:block" aria-hidden="true">&ldquo;</div>
      <div className="absolute bottom-32 end-8 text-[180px] font-serif text-violet-200/40 leading-none pointer-events-none select-none hidden lg:block" aria-hidden="true">&rdquo;</div>

      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            {isRTL ? 'آراء العملاء' : 'Testimonials'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            {isRTL ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {isRTL
              ? 'نفخر بثقة عملائنا الكرام وآرائهم الإيجابية التي تدفعنا للمزيد'
              : 'We are proud of our valued clients trust and positive feedback that drives us forward'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group bg-white rounded-3xl p-8 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-violet-100 hover:border-violet-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors duration-300">
                <Quote className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent-400 text-accent-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-secondary-700 leading-relaxed mb-6 text-lg">
                &ldquo;{isRTL ? testimonial.textAr : testimonial.textEn}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-secondary-200">
                {/* Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  {isRTL ? testimonial.avatar : testimonial.nameEn.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-secondary-900 text-lg">
                    {isRTL ? testimonial.nameAr : testimonial.nameEn}
                  </p>
                  <p className="text-secondary-500">
                    {isRTL ? testimonial.roleAr : testimonial.roleEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
