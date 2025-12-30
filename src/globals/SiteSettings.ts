import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  label: {
    en: 'Site Settings',
    ar: 'إعدادات الموقع',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'General', ar: 'عام' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'siteName',
                  type: 'text',
                  required: true,
                  defaultValue: 'Al Sadara',
                  label: { en: 'Site Name (English)', ar: 'اسم الموقع (إنجليزي)' },
                },
                {
                  name: 'siteNameAr',
                  type: 'text',
                  required: true,
                  defaultValue: 'الصدارة',
                  label: { en: 'Site Name (Arabic)', ar: 'اسم الموقع (عربي)' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'tagline',
                  type: 'text',
                  label: { en: 'Tagline (English)', ar: 'الشعار (إنجليزي)' },
                },
                {
                  name: 'taglineAr',
                  type: 'text',
                  label: { en: 'Tagline (Arabic)', ar: 'الشعار (عربي)' },
                },
              ],
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Logo', ar: 'الشعار' },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Logo (Dark Mode)', ar: 'الشعار (الوضع الداكن)' },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Favicon', ar: 'أيقونة الموقع' },
            },
            {
              name: 'defaultLocale',
              type: 'select',
              defaultValue: 'ar',
              options: [
                { label: 'العربية (Arabic)', value: 'ar' },
                { label: 'English', value: 'en' },
              ],
              label: { en: 'Default Language', ar: 'اللغة الافتراضية' },
            },
          ],
        },
        {
          label: { en: 'Maintenance', ar: 'الصيانة' },
          fields: [
            {
              name: 'maintenanceMode',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Enable Maintenance Mode', ar: 'تفعيل وضع الصيانة' },
            },
            {
              name: 'maintenanceMessage',
              type: 'group',
              label: { en: 'Maintenance Message', ar: 'رسالة الصيانة' },
              admin: {
                condition: (_, siblingData) => siblingData?.maintenanceMode,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'We are under maintenance',
                      label: { en: 'Title (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'titleAr',
                      type: 'text',
                      defaultValue: 'الموقع تحت الصيانة',
                      label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'message',
                      type: 'textarea',
                      label: { en: 'Message (English)', ar: 'الرسالة (إنجليزي)' },
                    },
                    {
                      name: 'messageAr',
                      type: 'textarea',
                      label: { en: 'Message (Arabic)', ar: 'الرسالة (عربي)' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'maintenanceAllowedIPs',
              type: 'array',
              label: { en: 'Allowed IPs (Bypass Maintenance)', ar: 'عناوين IP المسموحة' },
              admin: {
                condition: (_, siblingData) => siblingData?.maintenanceMode,
              },
              fields: [
                {
                  name: 'ip',
                  type: 'text',
                  required: true,
                  label: { en: 'IP Address', ar: 'عنوان IP' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Features', ar: 'الميزات' },
          fields: [
            {
              name: 'features',
              type: 'group',
              label: { en: 'Feature Toggles', ar: 'تفعيل الميزات' },
              fields: [
                {
                  name: 'enableReviews',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Product Reviews', ar: 'تفعيل تقييمات المنتجات' },
                },
                {
                  name: 'enableWishlist',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Wishlist', ar: 'تفعيل قائمة الأمنيات' },
                },
                {
                  name: 'enableCompare',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Product Compare', ar: 'تفعيل مقارنة المنتجات' },
                },
                {
                  name: 'enableQuickView',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Quick View', ar: 'تفعيل العرض السريع' },
                },
                {
                  name: 'enableGuestCheckout',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Guest Checkout', ar: 'تفعيل الشراء كضيف' },
                },
                {
                  name: 'enableAIChat',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable AI Chat', ar: 'تفعيل محادثة الذكاء الاصطناعي' },
                },
                {
                  name: 'enableNewsletter',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Newsletter', ar: 'تفعيل النشرة البريدية' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'E-commerce', ar: 'التجارة الإلكترونية' },
          fields: [
            {
              name: 'currency',
              type: 'group',
              label: { en: 'Currency Settings', ar: 'إعدادات العملة' },
              fields: [
                {
                  name: 'code',
                  type: 'select',
                  defaultValue: 'EGP',
                  options: [
                    { label: 'Egyptian Pound (EGP)', value: 'EGP' },
                    { label: 'Saudi Riyal (SAR)', value: 'SAR' },
                    { label: 'US Dollar (USD)', value: 'USD' },
                    { label: 'UAE Dirham (AED)', value: 'AED' },
                  ],
                  label: { en: 'Currency Code', ar: 'رمز العملة' },
                },
                {
                  name: 'symbol',
                  type: 'text',
                  defaultValue: 'ج.م',
                  label: { en: 'Currency Symbol', ar: 'رمز العملة' },
                },
                {
                  name: 'symbolPosition',
                  type: 'select',
                  defaultValue: 'after',
                  options: [
                    { label: { en: 'Before Price', ar: 'قبل السعر' }, value: 'before' },
                    { label: { en: 'After Price', ar: 'بعد السعر' }, value: 'after' },
                  ],
                  label: { en: 'Symbol Position', ar: 'موضع الرمز' },
                },
                {
                  name: 'decimalPlaces',
                  type: 'number',
                  defaultValue: 2,
                  min: 0,
                  max: 4,
                  label: { en: 'Decimal Places', ar: 'الخانات العشرية' },
                },
              ],
            },
            {
              name: 'tax',
              type: 'group',
              label: { en: 'Tax Settings', ar: 'إعدادات الضريبة' },
              fields: [
                {
                  name: 'enableTax',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Enable Tax', ar: 'تفعيل الضريبة' },
                },
                {
                  name: 'taxRate',
                  type: 'number',
                  defaultValue: 14,
                  min: 0,
                  max: 100,
                  label: { en: 'Tax Rate (%)', ar: 'نسبة الضريبة (%)' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableTax,
                  },
                },
                {
                  name: 'taxIncludedInPrice',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Tax Included in Price', ar: 'الضريبة مشمولة في السعر' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.enableTax,
                  },
                },
              ],
            },
            {
              name: 'stock',
              type: 'group',
              label: { en: 'Stock Settings', ar: 'إعدادات المخزون' },
              fields: [
                {
                  name: 'lowStockThreshold',
                  type: 'number',
                  defaultValue: 5,
                  label: { en: 'Low Stock Threshold', ar: 'حد المخزون المنخفض' },
                },
                {
                  name: 'outOfStockVisibility',
                  type: 'select',
                  defaultValue: 'show',
                  options: [
                    { label: { en: 'Show Product', ar: 'إظهار المنتج' }, value: 'show' },
                    { label: { en: 'Hide Product', ar: 'إخفاء المنتج' }, value: 'hide' },
                  ],
                  label: { en: 'Out of Stock Visibility', ar: 'ظهور المنتجات غير المتوفرة' },
                },
                {
                  name: 'allowBackorders',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { en: 'Allow Backorders', ar: 'السماح بالطلبات المسبقة' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Shipping', ar: 'الشحن' },
          fields: [
            {
              name: 'shipping',
              type: 'group',
              label: { en: 'Shipping Settings', ar: 'إعدادات الشحن' },
              fields: [
                {
                  name: 'freeShippingThreshold',
                  type: 'number',
                  defaultValue: 500,
                  label: { en: 'Free Shipping Threshold', ar: 'الحد الأدنى للشحن المجاني' },
                  admin: { description: 'Set to 0 to disable free shipping' },
                },
                {
                  name: 'defaultShippingCost',
                  type: 'number',
                  defaultValue: 50,
                  label: { en: 'Default Shipping Cost', ar: 'تكلفة الشحن الافتراضية' },
                },
                {
                  name: 'estimatedDeliveryDays',
                  type: 'group',
                  label: { en: 'Estimated Delivery', ar: 'التوصيل المتوقع' },
                  fields: [
                    {
                      name: 'min',
                      type: 'number',
                      defaultValue: 2,
                      label: { en: 'Minimum Days', ar: 'الحد الأدنى (أيام)' },
                    },
                    {
                      name: 'max',
                      type: 'number',
                      defaultValue: 5,
                      label: { en: 'Maximum Days', ar: 'الحد الأقصى (أيام)' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'shippingZones',
              type: 'array',
              label: { en: 'Shipping Zones', ar: 'مناطق الشحن' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: { en: 'Zone Name (English)', ar: 'اسم المنطقة (إنجليزي)' },
                    },
                    {
                      name: 'nameAr',
                      type: 'text',
                      required: true,
                      label: { en: 'Zone Name (Arabic)', ar: 'اسم المنطقة (عربي)' },
                    },
                  ],
                },
                {
                  name: 'governorates',
                  type: 'text',
                  label: { en: 'Governorates (comma-separated)', ar: 'المحافظات (مفصولة بفواصل)' },
                },
                {
                  name: 'cost',
                  type: 'number',
                  required: true,
                  label: { en: 'Shipping Cost', ar: 'تكلفة الشحن' },
                },
                {
                  name: 'freeAbove',
                  type: 'number',
                  label: { en: 'Free Shipping Above', ar: 'شحن مجاني فوق' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Notifications', ar: 'الإشعارات' },
          fields: [
            {
              name: 'notifications',
              type: 'group',
              label: { en: 'Email Notifications', ar: 'إشعارات البريد الإلكتروني' },
              fields: [
                {
                  name: 'adminEmail',
                  type: 'email',
                  label: { en: 'Admin Notification Email', ar: 'بريد إشعارات الأدمن' },
                },
                {
                  name: 'orderConfirmation',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Send Order Confirmation', ar: 'إرسال تأكيد الطلب' },
                },
                {
                  name: 'shippingNotification',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Send Shipping Notification', ar: 'إرسال إشعار الشحن' },
                },
                {
                  name: 'lowStockAlert',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Low Stock Alerts', ar: 'تنبيهات المخزون المنخفض' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Analytics', ar: 'التحليلات' },
          fields: [
            {
              name: 'analytics',
              type: 'group',
              label: { en: 'Analytics & Tracking', ar: 'التحليلات والتتبع' },
              fields: [
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  label: { en: 'Google Analytics ID', ar: 'معرف جوجل أناليتكس' },
                  admin: { description: 'e.g., G-XXXXXXXXXX' },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  label: { en: 'Facebook Pixel ID', ar: 'معرف فيسبوك بكسل' },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  label: { en: 'Google Tag Manager ID', ar: 'معرف جوجل تاغ مانجر' },
                  admin: { description: 'e.g., GTM-XXXXXXX' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
