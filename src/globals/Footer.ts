import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Content',
  },
  label: {
    en: 'Footer',
    ar: 'التذييل',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Features Bar', ar: 'شريط المميزات' },
          fields: [
            {
              name: 'showFeaturesBar',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Features Bar', ar: 'إظهار شريط المميزات' },
            },
            {
              name: 'features',
              type: 'array',
              maxRows: 4,
              label: { en: 'Features', ar: 'المميزات' },
              admin: {
                condition: (_, siblingData) => siblingData?.showFeaturesBar,
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: { en: 'Icon Name', ar: 'اسم الأيقونة' },
                  admin: { description: 'Lucide icon name' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: { en: 'Title (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'titleAr',
                      type: 'text',
                      required: true,
                      label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'description',
                      type: 'text',
                      label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
                    },
                    {
                      name: 'descriptionAr',
                      type: 'text',
                      label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Footer Columns', ar: 'أعمدة التذييل' },
          fields: [
            {
              name: 'columns',
              type: 'array',
              maxRows: 5,
              label: { en: 'Footer Columns', ar: 'أعمدة التذييل' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      required: true,
                      label: { en: 'Heading (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'headingAr',
                      type: 'text',
                      required: true,
                      label: { en: 'Heading (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  name: 'type',
                  type: 'select',
                  defaultValue: 'links',
                  options: [
                    { label: { en: 'Links', ar: 'روابط' }, value: 'links' },
                    { label: { en: 'Contact Info', ar: 'معلومات التواصل' }, value: 'contact' },
                    { label: { en: 'Text', ar: 'نص' }, value: 'text' },
                  ],
                  label: { en: 'Column Type', ar: 'نوع العمود' },
                },
                {
                  name: 'links',
                  type: 'array',
                  label: { en: 'Links', ar: 'الروابط' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'links',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                          label: { en: 'Label (English)', ar: 'التسمية (إنجليزي)' },
                        },
                        {
                          name: 'labelAr',
                          type: 'text',
                          required: true,
                          label: { en: 'Label (Arabic)', ar: 'التسمية (عربي)' },
                        },
                      ],
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                      label: { en: 'Link', ar: 'الرابط' },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      label: { en: 'Open in New Tab', ar: 'فتح في تبويب جديد' },
                    },
                  ],
                },
                {
                  name: 'contactInfo',
                  type: 'group',
                  label: { en: 'Contact Info', ar: 'معلومات التواصل' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'contact',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'address',
                          type: 'textarea',
                          label: { en: 'Address (English)', ar: 'العنوان (إنجليزي)' },
                        },
                        {
                          name: 'addressAr',
                          type: 'textarea',
                          label: { en: 'Address (Arabic)', ar: 'العنوان (عربي)' },
                        },
                      ],
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: { en: 'Phone', ar: 'الهاتف' },
                    },
                    {
                      name: 'email',
                      type: 'email',
                      label: { en: 'Email', ar: 'البريد الإلكتروني' },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'workingHours',
                          type: 'text',
                          label: { en: 'Working Hours (English)', ar: 'ساعات العمل (إنجليزي)' },
                        },
                        {
                          name: 'workingHoursAr',
                          type: 'text',
                          label: { en: 'Working Hours (Arabic)', ar: 'ساعات العمل (عربي)' },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'textContent',
                  type: 'group',
                  label: { en: 'Text Content', ar: 'المحتوى النصي' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'text',
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'richText',
                      label: { en: 'Text (English)', ar: 'النص (إنجليزي)' },
                    },
                    {
                      name: 'textAr',
                      type: 'richText',
                      label: { en: 'Text (Arabic)', ar: 'النص (عربي)' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Newsletter', ar: 'النشرة البريدية' },
          fields: [
            {
              name: 'showNewsletter',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Newsletter Section', ar: 'إظهار قسم النشرة البريدية' },
            },
            {
              name: 'newsletter',
              type: 'group',
              label: { en: 'Newsletter', ar: 'النشرة البريدية' },
              admin: {
                condition: (_, siblingData) => siblingData?.showNewsletter,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      defaultValue: 'Subscribe to Our Newsletter',
                      label: { en: 'Title (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'titleAr',
                      type: 'text',
                      defaultValue: 'اشترك في نشرتنا البريدية',
                      label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'description',
                      type: 'text',
                      label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
                    },
                    {
                      name: 'descriptionAr',
                      type: 'text',
                      label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'buttonText',
                      type: 'text',
                      defaultValue: 'Subscribe',
                      label: { en: 'Button Text (English)', ar: 'نص الزر (إنجليزي)' },
                    },
                    {
                      name: 'buttonTextAr',
                      type: 'text',
                      defaultValue: 'اشترك',
                      label: { en: 'Button Text (Arabic)', ar: 'نص الزر (عربي)' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Social Links', ar: 'روابط التواصل' },
          fields: [
            {
              name: 'showSocialLinks',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Social Links', ar: 'إظهار روابط التواصل' },
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: { en: 'Social Links', ar: 'روابط التواصل' },
              admin: {
                condition: (_, siblingData) => siblingData?.showSocialLinks,
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Telegram', value: 'telegram' },
                  ],
                  label: { en: 'Platform', ar: 'المنصة' },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: { en: 'URL', ar: 'الرابط' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Copyright & Legal', ar: 'حقوق النشر' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'copyrightText',
                  type: 'text',
                  defaultValue: 'All Rights Reserved.',
                  label: { en: 'Copyright Text (English)', ar: 'نص حقوق النشر (إنجليزي)' },
                },
                {
                  name: 'copyrightTextAr',
                  type: 'text',
                  defaultValue: 'جميع الحقوق محفوظة.',
                  label: { en: 'Copyright Text (Arabic)', ar: 'نص حقوق النشر (عربي)' },
                },
              ],
            },
            {
              name: 'legalLinks',
              type: 'array',
              label: { en: 'Legal Links', ar: 'الروابط القانونية' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: { en: 'Label (English)', ar: 'التسمية (إنجليزي)' },
                    },
                    {
                      name: 'labelAr',
                      type: 'text',
                      required: true,
                      label: { en: 'Label (Arabic)', ar: 'التسمية (عربي)' },
                    },
                  ],
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  label: { en: 'Link', ar: 'الرابط' },
                },
              ],
            },
            {
              name: 'paymentMethods',
              type: 'array',
              label: { en: 'Accepted Payment Methods', ar: 'طرق الدفع المقبولة' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Name', ar: 'الاسم' },
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: { en: 'Icon', ar: 'الأيقونة' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Settings', ar: 'الإعدادات' },
          fields: [
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'dark',
              options: [
                { label: { en: 'Dark', ar: 'داكن' }, value: 'dark' },
                { label: { en: 'Light', ar: 'فاتح' }, value: 'light' },
                { label: { en: 'Primary', ar: 'رئيسي' }, value: 'primary' },
              ],
              label: { en: 'Background Color', ar: 'لون الخلفية' },
            },
            {
              name: 'showBackToTop',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Back to Top Button', ar: 'إظهار زر العودة للأعلى' },
            },
            {
              name: 'showLogo',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Logo', ar: 'إظهار الشعار' },
            },
          ],
        },
      ],
    },
  ],
}
