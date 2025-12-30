import type { GlobalConfig } from 'payload'
import { pageBuilderBlocks } from '@/blocks'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Content',
  },
  label: {
    en: 'Homepage',
    ar: 'الصفحة الرئيسية',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Hero Section', ar: 'قسم البطل' },
          fields: [
            {
              name: 'heroType',
              type: 'select',
              required: true,
              defaultValue: 'slider',
              options: [
                { label: { en: 'Image', ar: 'صورة' }, value: 'image' },
                { label: { en: 'Video', ar: 'فيديو' }, value: 'video' },
                { label: { en: 'Slider', ar: 'سلايدر' }, value: 'slider' },
              ],
              label: { en: 'Hero Type', ar: 'نوع البطل' },
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: { en: 'Title (English)', ar: 'العنوان (إنجليزي)' },
            },
            {
              name: 'heroTitleAr',
              type: 'text',
              label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              label: { en: 'Subtitle (English)', ar: 'العنوان الفرعي (إنجليزي)' },
            },
            {
              name: 'heroSubtitleAr',
              type: 'text',
              label: { en: 'Subtitle (Arabic)', ar: 'العنوان الفرعي (عربي)' },
            },
            {
              name: 'heroBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Background Image', ar: 'صورة الخلفية' },
              admin: {
                condition: (_, siblingData) => siblingData?.heroType === 'image',
              },
            },
            {
              name: 'heroVideoUrl',
              type: 'text',
              label: { en: 'Video URL', ar: 'رابط الفيديو' },
              admin: {
                condition: (_, siblingData) => siblingData?.heroType === 'video',
              },
            },
            {
              name: 'heroSlides',
              type: 'array',
              label: { en: 'Slides', ar: 'الشرائح' },
              admin: {
                condition: (_, siblingData) => siblingData?.heroType === 'slider',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: { en: 'Image', ar: 'الصورة' },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: { en: 'Title (English)', ar: 'العنوان (إنجليزي)' },
                    },
                    {
                      name: 'titleAr',
                      type: 'text',
                      label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'subtitle',
                      type: 'text',
                      label: { en: 'Subtitle (English)', ar: 'العنوان الفرعي (إنجليزي)' },
                    },
                    {
                      name: 'subtitleAr',
                      type: 'text',
                      label: { en: 'Subtitle (Arabic)', ar: 'العنوان الفرعي (عربي)' },
                    },
                  ],
                },
                {
                  name: 'ctaButton',
                  type: 'group',
                  label: { en: 'CTA Button', ar: 'زر الإجراء' },
                  fields: [
                    {
                      name: 'show',
                      type: 'checkbox',
                      defaultValue: false,
                      label: { en: 'Show Button', ar: 'إظهار الزر' },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          label: { en: 'Text (English)', ar: 'النص (إنجليزي)' },
                        },
                        {
                          name: 'textAr',
                          type: 'text',
                          label: { en: 'Text (Arabic)', ar: 'النص (عربي)' },
                        },
                      ],
                    },
                    {
                      name: 'link',
                      type: 'text',
                      label: { en: 'Link', ar: 'الرابط' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'heroCTA',
              type: 'group',
              label: { en: 'Main CTA Button', ar: 'زر الإجراء الرئيسي' },
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
                      defaultValue: 'Explore Products',
                      label: { en: 'Text (English)', ar: 'النص (إنجليزي)' },
                    },
                    {
                      name: 'textAr',
                      type: 'text',
                      defaultValue: 'استكشف المنتجات',
                      label: { en: 'Text (Arabic)', ar: 'النص (عربي)' },
                    },
                  ],
                },
                {
                  name: 'link',
                  type: 'text',
                  defaultValue: '/products',
                  label: { en: 'Link', ar: 'الرابط' },
                },
              ],
            },
            {
              name: 'heroOverlay',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: { en: 'None', ar: 'بدون' }, value: 'none' },
                { label: { en: 'Light', ar: 'خفيف' }, value: 'light' },
                { label: { en: 'Medium', ar: 'متوسط' }, value: 'medium' },
                { label: { en: 'Dark', ar: 'داكن' }, value: 'dark' },
              ],
              label: { en: 'Overlay', ar: 'التعتيم' },
            },
            {
              name: 'heroHeight',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: { en: 'Full Screen', ar: 'شاشة كاملة' }, value: 'full' },
                { label: { en: '80% Screen', ar: '80% الشاشة' }, value: '80vh' },
                { label: { en: '60% Screen', ar: '60% الشاشة' }, value: '60vh' },
                { label: { en: 'Medium (500px)', ar: 'متوسط' }, value: 'medium' },
              ],
              label: { en: 'Height', ar: 'الارتفاع' },
            },
          ],
        },
        {
          label: { en: 'Page Sections', ar: 'أقسام الصفحة' },
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              blocks: pageBuilderBlocks,
              label: { en: 'Page Sections', ar: 'أقسام الصفحة' },
              admin: {
                description: {
                  en: 'Add and arrange sections for the homepage',
                  ar: 'أضف ورتب أقسام الصفحة الرئيسية',
                },
              },
            },
          ],
        },
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
                  admin: { description: 'Lucide icon name (e.g., truck, shield-check, headphones)' },
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
          label: { en: 'SEO', ar: 'تحسين محركات البحث' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: { en: 'Meta Title (English)', ar: 'عنوان السيو (إنجليزي)' },
                },
                {
                  name: 'metaTitleAr',
                  type: 'text',
                  label: { en: 'Meta Title (Arabic)', ar: 'عنوان السيو (عربي)' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: { en: 'Meta Description (English)', ar: 'وصف السيو (إنجليزي)' },
                },
                {
                  name: 'metaDescriptionAr',
                  type: 'textarea',
                  label: { en: 'Meta Description (Arabic)', ar: 'وصف السيو (عربي)' },
                },
              ],
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'OG Image', ar: 'صورة المشاركة' },
            },
          ],
        },
      ],
    },
  ],
}
