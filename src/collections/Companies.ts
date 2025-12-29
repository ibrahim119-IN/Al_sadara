import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameAr', 'companyType', 'country', 'active', 'order'],
    group: 'Content',
  },
  labels: {
    singular: {
      en: 'Company',
      ar: 'شركة',
    },
    plural: {
      en: 'Companies',
      ar: 'الشركات',
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    // Basic Info
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Basic Info', ar: 'المعلومات الأساسية' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Name (English)',
                    ar: 'الاسم (إنجليزي)',
                  },
                },
                {
                  name: 'nameAr',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Name (Arabic)',
                    ar: 'الاسم (عربي)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shortName',
                  type: 'text',
                  label: {
                    en: 'Short Name (English)',
                    ar: 'الاسم المختصر (إنجليزي)',
                  },
                },
                {
                  name: 'shortNameAr',
                  type: 'text',
                  label: {
                    en: 'Short Name (Arabic)',
                    ar: 'الاسم المختصر (عربي)',
                  },
                },
              ],
            },
            {
              name: 'tagline',
              type: 'text',
              label: {
                en: 'Tagline (English)',
                ar: 'الشعار (إنجليزي)',
              },
            },
            {
              name: 'taglineAr',
              type: 'text',
              label: {
                en: 'Tagline (Arabic)',
                ar: 'الشعار (عربي)',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: {
                en: 'Description (English)',
                ar: 'الوصف (إنجليزي)',
              },
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: {
                en: 'Description (Arabic)',
                ar: 'الوصف (عربي)',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'companyType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: { en: 'Plastics Trading', ar: 'تجارة بلاستيك' }, value: 'plastics' },
                    { label: { en: 'Electronics & Security', ar: 'إلكترونيات وأمن' }, value: 'electronics' },
                    { label: { en: 'Manufacturing', ar: 'تصنيع' }, value: 'manufacturing' },
                    { label: { en: 'Recycling', ar: 'تدوير' }, value: 'recycling' },
                  ],
                  label: {
                    en: 'Company Type',
                    ar: 'نوع الشركة',
                  },
                },
                {
                  name: 'foundedYear',
                  type: 'number',
                  min: 1900,
                  max: 2100,
                  label: {
                    en: 'Founded Year',
                    ar: 'سنة التأسيس',
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Media', ar: 'الوسائط' },
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Logo',
                ar: 'الشعار',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Logo (Dark)',
                ar: 'الشعار (داكن)',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Hero Image',
                ar: 'صورة البانر',
              },
            },
            {
              name: 'galleryImages',
              type: 'array',
              label: {
                en: 'Gallery Images',
                ar: 'معرض الصور',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
                {
                  name: 'captionAr',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Branding', ar: 'الهوية البصرية' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: {
                    en: 'Primary Color',
                    ar: 'اللون الأساسي',
                  },
                  admin: {
                    description: 'Hex color code (e.g., #0066CC)',
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: {
                    en: 'Secondary Color',
                    ar: 'اللون الثانوي',
                  },
                  admin: {
                    description: 'Hex color code (e.g., #FF5500)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'accentColor',
                  type: 'text',
                  label: {
                    en: 'Accent Color',
                    ar: 'لون التمييز',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: {
                    en: 'Background Color',
                    ar: 'لون الخلفية',
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Location', ar: 'الموقع' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'select',
                  required: true,
                  options: [
                    { label: { en: 'Egypt', ar: 'مصر' }, value: 'egypt' },
                    { label: { en: 'Saudi Arabia', ar: 'السعودية' }, value: 'saudi' },
                    { label: { en: 'UAE', ar: 'الإمارات' }, value: 'uae' },
                  ],
                  label: {
                    en: 'Country',
                    ar: 'الدولة',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: {
                    en: 'City (English)',
                    ar: 'المدينة (إنجليزي)',
                  },
                },
                {
                  name: 'cityAr',
                  type: 'text',
                  label: {
                    en: 'City (Arabic)',
                    ar: 'المدينة (عربي)',
                  },
                },
              ],
            },
            {
              name: 'address',
              type: 'textarea',
              label: {
                en: 'Address (English)',
                ar: 'العنوان (إنجليزي)',
              },
            },
            {
              name: 'addressAr',
              type: 'textarea',
              label: {
                en: 'Address (Arabic)',
                ar: 'العنوان (عربي)',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'latitude',
                  type: 'number',
                  label: {
                    en: 'Latitude',
                    ar: 'خط العرض',
                  },
                },
                {
                  name: 'longitude',
                  type: 'number',
                  label: {
                    en: 'Longitude',
                    ar: 'خط الطول',
                  },
                },
              ],
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
              label: {
                en: 'Google Maps URL',
                ar: 'رابط خرائط جوجل',
              },
            },
          ],
        },
        {
          label: { en: 'Contact', ar: 'التواصل' },
          fields: [
            {
              name: 'phones',
              type: 'array',
              label: {
                en: 'Phone Numbers',
                ar: 'أرقام الهاتف',
              },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  label: { en: 'Number', ar: 'الرقم' },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: { en: 'Label', ar: 'التسمية' },
                },
                {
                  name: 'isWhatsApp',
                  type: 'checkbox',
                  label: { en: 'WhatsApp', ar: 'واتساب' },
                },
              ],
            },
            {
              name: 'emails',
              type: 'array',
              label: {
                en: 'Email Addresses',
                ar: 'البريد الإلكتروني',
              },
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                  label: { en: 'Email', ar: 'البريد' },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: { en: 'Label', ar: 'التسمية' },
                },
              ],
            },
            {
              name: 'website',
              type: 'text',
              label: {
                en: 'Website',
                ar: 'الموقع الإلكتروني',
              },
            },
            {
              name: 'socialLinks',
              type: 'group',
              label: {
                en: 'Social Media',
                ar: 'التواصل الاجتماعي',
              },
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  label: 'Facebook',
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn',
                },
                {
                  name: 'twitter',
                  type: 'text',
                  label: 'Twitter/X',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube',
                },
              ],
            },
            {
              name: 'businessHours',
              type: 'group',
              label: {
                en: 'Business Hours',
                ar: 'ساعات العمل',
              },
              fields: [
                {
                  name: 'weekdays',
                  type: 'text',
                  label: { en: 'Weekdays', ar: 'أيام الأسبوع' },
                  admin: {
                    description: 'e.g., 9:00 AM - 6:00 PM',
                  },
                },
                {
                  name: 'weekends',
                  type: 'text',
                  label: { en: 'Weekends', ar: 'نهاية الأسبوع' },
                },
                {
                  name: 'note',
                  type: 'text',
                  label: { en: 'Note', ar: 'ملاحظة' },
                },
                {
                  name: 'noteAr',
                  type: 'text',
                  label: { en: 'Note (Arabic)', ar: 'ملاحظة (عربي)' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Vision & Mission', ar: 'الرؤية والرسالة' },
          fields: [
            {
              name: 'vision',
              type: 'textarea',
              label: {
                en: 'Vision (English)',
                ar: 'الرؤية (إنجليزي)',
              },
            },
            {
              name: 'visionAr',
              type: 'textarea',
              label: {
                en: 'Vision (Arabic)',
                ar: 'الرؤية (عربي)',
              },
            },
            {
              name: 'mission',
              type: 'textarea',
              label: {
                en: 'Mission (English)',
                ar: 'الرسالة (إنجليزي)',
              },
            },
            {
              name: 'missionAr',
              type: 'textarea',
              label: {
                en: 'Mission (Arabic)',
                ar: 'الرسالة (عربي)',
              },
            },
            {
              name: 'values',
              type: 'array',
              label: {
                en: 'Core Values',
                ar: 'القيم الأساسية',
              },
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: { en: 'Value', ar: 'القيمة' },
                },
                {
                  name: 'valueAr',
                  type: 'text',
                  label: { en: 'Value (Arabic)', ar: 'القيمة (عربي)' },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: { en: 'Description', ar: 'الوصف' },
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
        {
          label: { en: 'Services', ar: 'الخدمات' },
          fields: [
            {
              name: 'services',
              type: 'array',
              label: {
                en: 'Services',
                ar: 'الخدمات',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Service Name', ar: 'اسم الخدمة' },
                },
                {
                  name: 'nameAr',
                  type: 'text',
                  label: { en: 'Service Name (Arabic)', ar: 'اسم الخدمة (عربي)' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: { en: 'Description', ar: 'الوصف' },
                },
                {
                  name: 'descriptionAr',
                  type: 'textarea',
                  label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: { en: 'Icon', ar: 'الأيقونة' },
                  admin: {
                    description: 'Lucide icon name (e.g., camera, shield, flame)',
                  },
                },
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              label: {
                en: 'Certifications',
                ar: 'الشهادات',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: { en: 'Certification Name', ar: 'اسم الشهادة' },
                },
                {
                  name: 'nameAr',
                  type: 'text',
                  label: { en: 'Name (Arabic)', ar: 'الاسم (عربي)' },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: { en: 'Logo', ar: 'الشعار' },
                },
                {
                  name: 'year',
                  type: 'number',
                  label: { en: 'Year', ar: 'السنة' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'SEO', ar: 'تحسين محركات البحث' },
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: {
                en: 'Meta Title',
                ar: 'عنوان السيو',
              },
            },
            {
              name: 'metaTitleAr',
              type: 'text',
              label: {
                en: 'Meta Title (Arabic)',
                ar: 'عنوان السيو (عربي)',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: {
                en: 'Meta Description',
                ar: 'وصف السيو',
              },
            },
            {
              name: 'metaDescriptionAr',
              type: 'textarea',
              label: {
                en: 'Meta Description (Arabic)',
                ar: 'وصف السيو (عربي)',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'OG Image',
                ar: 'صورة المشاركة',
              },
            },
          ],
        },
      ],
    },
    // Sidebar Fields
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Used for subdomain routing (e.g., industry, talah, polymers)',
      },
      label: {
        en: 'Slug',
        ar: 'المعرف',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'Display Order',
        ar: 'ترتيب العرض',
      },
    },
    {
      name: 'isParent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Is this the parent/holding company?',
      },
      label: {
        en: 'Parent Company',
        ar: 'الشركة الأم',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'Active',
        ar: 'نشط',
      },
    },
    {
      name: 'showInMainNav',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'Show in Navigation',
        ar: 'عرض في القائمة',
      },
    },
  ],
}
