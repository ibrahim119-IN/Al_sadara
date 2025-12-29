import type { GlobalConfig } from 'payload'

export const GroupSettings: GlobalConfig = {
  slug: 'group-settings',
  admin: {
    group: 'Settings',
  },
  label: {
    en: 'Group Settings',
    ar: 'إعدادات المجموعة',
  },
  access: {
    read: () => true,
  },
  fields: [
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
                  name: 'groupName',
                  type: 'text',
                  required: true,
                  defaultValue: 'El Sayed Shehata Group for Trade and Industry',
                  label: {
                    en: 'Group Name (English)',
                    ar: 'اسم المجموعة (إنجليزي)',
                  },
                },
                {
                  name: 'groupNameAr',
                  type: 'text',
                  required: true,
                  defaultValue: 'مجموعة السيد شحاتة للتجارة والصناعة',
                  label: {
                    en: 'Group Name (Arabic)',
                    ar: 'اسم المجموعة (عربي)',
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
                  defaultValue: 'ESS Group',
                  label: {
                    en: 'Short Name (English)',
                    ar: 'الاسم المختصر (إنجليزي)',
                  },
                },
                {
                  name: 'shortNameAr',
                  type: 'text',
                  defaultValue: 'مجموعة السيد شحاتة',
                  label: {
                    en: 'Short Name (Arabic)',
                    ar: 'الاسم المختصر (عربي)',
                  },
                },
              ],
            },
            {
              name: 'slogan',
              type: 'text',
              defaultValue: 'Leaders in Plastics and Building Systems in the Middle East',
              label: {
                en: 'Slogan (English)',
                ar: 'الشعار (إنجليزي)',
              },
            },
            {
              name: 'sloganAr',
              type: 'text',
              defaultValue: 'رواد صناعة وتجارة البلاستيك وأنظمة المباني في الشرق الأوسط',
              label: {
                en: 'Slogan (Arabic)',
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
                  name: 'foundedYear',
                  type: 'number',
                  defaultValue: 2005,
                  label: {
                    en: 'Founded Year',
                    ar: 'سنة التأسيس',
                  },
                },
                {
                  name: 'mainDomain',
                  type: 'text',
                  defaultValue: 'alsadara.org',
                  label: {
                    en: 'Main Domain',
                    ar: 'الدومين الرئيسي',
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
              name: 'groupLogo',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Group Logo',
                ar: 'شعار المجموعة',
              },
            },
            {
              name: 'groupLogoDark',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Group Logo (Dark)',
                ar: 'شعار المجموعة (داكن)',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Hero Image',
                ar: 'صورة البانر الرئيسي',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Favicon',
                ar: 'أيقونة الموقع',
              },
            },
          ],
        },
        {
          label: { en: 'Vision & Mission', ar: 'الرؤية والرسالة' },
          fields: [
            {
              name: 'vision',
              type: 'textarea',
              defaultValue: 'To be the most trusted partner in plastics and building systems across the Middle East and Africa by 2030.',
              label: {
                en: 'Vision (English)',
                ar: 'الرؤية (إنجليزي)',
              },
            },
            {
              name: 'visionAr',
              type: 'textarea',
              defaultValue: 'أن نكون الشريك الأكثر ثقة في صناعة وتجارة البلاستيك وأنظمة المباني في الشرق الأوسط وأفريقيا بحلول 2030.',
              label: {
                en: 'Vision (Arabic)',
                ar: 'الرؤية (عربي)',
              },
            },
            {
              name: 'mission',
              type: 'textarea',
              defaultValue: 'Providing high-quality plastic raw materials and smart building solutions with competitive pricing and exceptional customer service.',
              label: {
                en: 'Mission (English)',
                ar: 'الرسالة (إنجليزي)',
              },
            },
            {
              name: 'missionAr',
              type: 'textarea',
              defaultValue: 'توفير خامات بلاستيك عالية الجودة وحلول مباني ذكية بأسعار تنافسية وخدمة عملاء استثنائية.',
              label: {
                en: 'Mission (Arabic)',
                ar: 'الرسالة (عربي)',
              },
            },
          ],
        },
        {
          label: { en: 'Statistics', ar: 'الإحصائيات' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'totalCompanies',
                  type: 'number',
                  defaultValue: 6,
                  label: {
                    en: 'Total Companies',
                    ar: 'عدد الشركات',
                  },
                },
                {
                  name: 'countriesPresence',
                  type: 'number',
                  defaultValue: 3,
                  label: {
                    en: 'Countries Presence',
                    ar: 'عدد الدول',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'totalEmployees',
                  type: 'number',
                  label: {
                    en: 'Total Employees',
                    ar: 'عدد الموظفين',
                  },
                },
                {
                  name: 'totalClients',
                  type: 'number',
                  defaultValue: 1000,
                  label: {
                    en: 'Total Clients',
                    ar: 'عدد العملاء',
                  },
                },
              ],
            },
            {
              name: 'countries',
              type: 'array',
              label: {
                en: 'Countries of Presence',
                ar: 'دول التواجد',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: { en: 'Country (English)', ar: 'الدولة (إنجليزي)' },
                    },
                    {
                      name: 'nameAr',
                      type: 'text',
                      label: { en: 'Country (Arabic)', ar: 'الدولة (عربي)' },
                    },
                  ],
                },
                {
                  name: 'flag',
                  type: 'text',
                  label: { en: 'Flag Emoji', ar: 'علم الدولة' },
                  admin: {
                    description: 'e.g., 🇪🇬 🇸🇦 🇦🇪',
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Contact', ar: 'التواصل' },
          fields: [
            {
              name: 'mainEmail',
              type: 'email',
              label: {
                en: 'Main Email',
                ar: 'البريد الرئيسي',
              },
            },
            {
              name: 'mainPhone',
              type: 'text',
              label: {
                en: 'Main Phone',
                ar: 'الهاتف الرئيسي',
              },
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: {
                en: 'WhatsApp',
                ar: 'واتساب',
              },
            },
            {
              name: 'headquarters',
              type: 'group',
              label: {
                en: 'Headquarters',
                ar: 'المقر الرئيسي',
              },
              fields: [
                {
                  name: 'address',
                  type: 'text',
                  label: { en: 'Address', ar: 'العنوان' },
                },
                {
                  name: 'addressAr',
                  type: 'text',
                  label: { en: 'Address (Arabic)', ar: 'العنوان (عربي)' },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: { en: 'City', ar: 'المدينة' },
                },
                {
                  name: 'country',
                  type: 'text',
                  label: { en: 'Country', ar: 'الدولة' },
                },
              ],
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
          ],
        },
        {
          label: { en: 'SEO', ar: 'تحسين محركات البحث' },
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              defaultValue: 'El Sayed Shehata Group - Plastics & Building Systems',
              label: {
                en: 'Meta Title',
                ar: 'عنوان السيو',
              },
            },
            {
              name: 'metaTitleAr',
              type: 'text',
              defaultValue: 'مجموعة السيد شحاتة - خامات بلاستيك وأنظمة مباني',
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
            {
              name: 'keywords',
              type: 'text',
              label: {
                en: 'Keywords',
                ar: 'الكلمات المفتاحية',
              },
            },
            {
              name: 'keywordsAr',
              type: 'text',
              label: {
                en: 'Keywords (Arabic)',
                ar: 'الكلمات المفتاحية (عربي)',
              },
            },
          ],
        },
      ],
    },
  ],
}
