import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'placement', 'isActive', 'startDate', 'endDate'],
    group: 'Content',
  },
  labels: {
    singular: { en: 'Banner', ar: 'بانر' },
    plural: { en: 'Banners', ar: 'البانرات' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Content', ar: 'المحتوى' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: { en: 'Internal Title', ar: 'العنوان الداخلي' },
                  admin: {
                    description: 'Used for admin reference only',
                  },
                },
                {
                  name: 'placement',
                  type: 'select',
                  required: true,
                  options: [
                    { label: { en: 'Header Bar', ar: 'شريط الهيدر' }, value: 'header' },
                    { label: { en: 'Homepage Hero', ar: 'بطل الصفحة الرئيسية' }, value: 'homepage-hero' },
                    { label: { en: 'Homepage Section', ar: 'قسم في الصفحة الرئيسية' }, value: 'homepage-section' },
                    { label: { en: 'Sidebar', ar: 'الشريط الجانبي' }, value: 'sidebar' },
                    { label: { en: 'Product Page', ar: 'صفحة المنتج' }, value: 'product-page' },
                    { label: { en: 'Category Page', ar: 'صفحة الفئة' }, value: 'category-page' },
                    { label: { en: 'Checkout', ar: 'الدفع' }, value: 'checkout' },
                    { label: { en: 'Popup', ar: 'نافذة منبثقة' }, value: 'popup' },
                    { label: { en: 'Footer', ar: 'التذييل' }, value: 'footer' },
                  ],
                  label: { en: 'Placement', ar: 'الموضع' },
                },
              ],
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'image',
              options: [
                { label: { en: 'Image', ar: 'صورة' }, value: 'image' },
                { label: { en: 'Text Only', ar: 'نص فقط' }, value: 'text' },
                { label: { en: 'HTML', ar: 'HTML' }, value: 'html' },
              ],
              label: { en: 'Banner Type', ar: 'نوع البانر' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Banner Image', ar: 'صورة البانر' },
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'image',
              },
            },
            {
              name: 'mobileImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Mobile Image (Optional)', ar: 'صورة الموبايل (اختياري)' },
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'image',
              },
            },
            {
              name: 'textContent',
              type: 'group',
              label: { en: 'Text Content', ar: 'المحتوى النصي' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      label: { en: 'Heading (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'headingAr',
                      type: 'text',
                      label: { en: 'Heading (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'subheading',
                      type: 'text',
                      label: { en: 'Subheading (English)', ar: 'العنوان الفرعي (إنجليزي)' },
                    },
                    {
                      name: 'subheadingAr',
                      type: 'text',
                      label: { en: 'Subheading (Arabic)', ar: 'العنوان الفرعي (عربي)' },
                    },
                  ],
                },
                {
                  name: 'textColor',
                  type: 'select',
                  defaultValue: 'white',
                  options: [
                    { label: { en: 'White', ar: 'أبيض' }, value: 'white' },
                    { label: { en: 'Black', ar: 'أسود' }, value: 'black' },
                    { label: { en: 'Primary', ar: 'رئيسي' }, value: 'primary' },
                  ],
                  label: { en: 'Text Color', ar: 'لون النص' },
                },
              ],
            },
            {
              name: 'htmlContent',
              type: 'textarea',
              label: { en: 'HTML Content', ar: 'محتوى HTML' },
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'html',
              },
            },
            {
              name: 'cta',
              type: 'group',
              label: { en: 'Call to Action', ar: 'زر الإجراء' },
              fields: [
                {
                  name: 'show',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show Button', ar: 'إظهار الزر' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: { en: 'Button Text (English)', ar: 'نص الزر (إنجليزي)' },
                    },
                    {
                      name: 'textAr',
                      type: 'text',
                      label: { en: 'Button Text (Arabic)', ar: 'نص الزر (عربي)' },
                    },
                  ],
                },
                {
                  name: 'link',
                  type: 'text',
                  label: { en: 'Link URL', ar: 'رابط الزر' },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { en: 'Open in New Tab', ar: 'فتح في تبويب جديد' },
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: { en: 'Primary', ar: 'رئيسي' }, value: 'primary' },
                    { label: { en: 'Secondary', ar: 'ثانوي' }, value: 'secondary' },
                    { label: { en: 'Outline', ar: 'مخطط' }, value: 'outline' },
                    { label: { en: 'White', ar: 'أبيض' }, value: 'white' },
                  ],
                  label: { en: 'Button Style', ar: 'نمط الزر' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Scheduling', ar: 'الجدولة' },
          fields: [
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Active', ar: 'نشط' },
            },
            {
              name: 'startDate',
              type: 'date',
              label: { en: 'Start Date', ar: 'تاريخ البداية' },
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              label: { en: 'End Date', ar: 'تاريخ النهاية' },
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'priority',
              type: 'number',
              defaultValue: 0,
              label: { en: 'Priority', ar: 'الأولوية' },
              admin: {
                description: 'Higher number = higher priority when multiple banners match',
              },
            },
          ],
        },
        {
          label: { en: 'Targeting', ar: 'الاستهداف' },
          fields: [
            {
              name: 'targetPages',
              type: 'select',
              defaultValue: 'all',
              options: [
                { label: { en: 'All Pages', ar: 'جميع الصفحات' }, value: 'all' },
                { label: { en: 'Specific Pages', ar: 'صفحات محددة' }, value: 'specific' },
                { label: { en: 'Specific Categories', ar: 'فئات محددة' }, value: 'categories' },
              ],
              label: { en: 'Target Pages', ar: 'الصفحات المستهدفة' },
            },
            {
              name: 'pages',
              type: 'relationship',
              relationTo: 'pages',
              hasMany: true,
              label: { en: 'Pages', ar: 'الصفحات' },
              admin: {
                condition: (_, siblingData) => siblingData?.targetPages === 'specific',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: { en: 'Categories', ar: 'الفئات' },
              admin: {
                condition: (_, siblingData) => siblingData?.targetPages === 'categories',
              },
            },
            {
              name: 'targetDevices',
              type: 'select',
              defaultValue: 'all',
              options: [
                { label: { en: 'All Devices', ar: 'جميع الأجهزة' }, value: 'all' },
                { label: { en: 'Desktop Only', ar: 'سطح المكتب فقط' }, value: 'desktop' },
                { label: { en: 'Mobile Only', ar: 'الموبايل فقط' }, value: 'mobile' },
              ],
              label: { en: 'Target Devices', ar: 'الأجهزة المستهدفة' },
            },
            {
              name: 'showToLoggedIn',
              type: 'select',
              defaultValue: 'all',
              options: [
                { label: { en: 'All Users', ar: 'جميع المستخدمين' }, value: 'all' },
                { label: { en: 'Logged In Only', ar: 'المسجلين فقط' }, value: 'logged-in' },
                { label: { en: 'Guests Only', ar: 'الضيوف فقط' }, value: 'guests' },
              ],
              label: { en: 'Show To', ar: 'إظهار لـ' },
            },
          ],
        },
        {
          label: { en: 'Popup Settings', ar: 'إعدادات النافذة المنبثقة' },
          fields: [
            {
              name: 'popupSettings',
              type: 'group',
              label: { en: 'Popup Settings', ar: 'إعدادات النافذة المنبثقة' },
              admin: {
                condition: (data) => data?.placement === 'popup',
              },
              fields: [
                {
                  name: 'trigger',
                  type: 'select',
                  defaultValue: 'time',
                  options: [
                    { label: { en: 'After Time Delay', ar: 'بعد فترة زمنية' }, value: 'time' },
                    { label: { en: 'On Exit Intent', ar: 'عند محاولة الخروج' }, value: 'exit' },
                    { label: { en: 'On Scroll', ar: 'عند التمرير' }, value: 'scroll' },
                  ],
                  label: { en: 'Trigger', ar: 'المحفز' },
                },
                {
                  name: 'delay',
                  type: 'number',
                  defaultValue: 3,
                  label: { en: 'Delay (seconds)', ar: 'التأخير (ثواني)' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.trigger === 'time',
                  },
                },
                {
                  name: 'scrollPercentage',
                  type: 'number',
                  defaultValue: 50,
                  min: 0,
                  max: 100,
                  label: { en: 'Scroll Percentage', ar: 'نسبة التمرير' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.trigger === 'scroll',
                  },
                },
                {
                  name: 'frequency',
                  type: 'select',
                  defaultValue: 'session',
                  options: [
                    { label: { en: 'Once Per Session', ar: 'مرة واحدة بالجلسة' }, value: 'session' },
                    { label: { en: 'Once Per Day', ar: 'مرة واحدة باليوم' }, value: 'day' },
                    { label: { en: 'Once Ever', ar: 'مرة واحدة فقط' }, value: 'once' },
                    { label: { en: 'Every Visit', ar: 'كل زيارة' }, value: 'always' },
                  ],
                  label: { en: 'Show Frequency', ar: 'تكرار العرض' },
                },
                {
                  name: 'closable',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Allow Close', ar: 'السماح بالإغلاق' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Analytics', ar: 'التحليلات' },
          fields: [
            {
              name: 'trackClicks',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Track Clicks', ar: 'تتبع النقرات' },
            },
            {
              name: 'clickCount',
              type: 'number',
              defaultValue: 0,
              label: { en: 'Click Count', ar: 'عدد النقرات' },
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'impressionCount',
              type: 'number',
              defaultValue: 0,
              label: { en: 'Impression Count', ar: 'عدد المشاهدات' },
              admin: {
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
