import type { CollectionConfig } from 'payload'
import { pageBuilderBlocks } from '@/blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Content',
  },
  labels: {
    singular: { en: 'Page', ar: 'صفحة' },
    plural: { en: 'Pages', ar: 'الصفحات' },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
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
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: { en: 'Slug', ar: 'الرابط' },
              admin: {
                description: 'URL-friendly identifier (e.g., about-us, privacy-policy)',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                    }
                    return value
                  },
                ],
              },
            },
            {
              name: 'showHero',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Hero Section', ar: 'إظهار قسم البطل' },
            },
            {
              name: 'hero',
              type: 'group',
              label: { en: 'Hero Section', ar: 'قسم البطل' },
              admin: {
                condition: (_, siblingData) => siblingData?.showHero,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: { en: 'Hero Title (English)', ar: 'عنوان البطل (إنجليزي)' },
                    },
                    {
                      name: 'titleAr',
                      type: 'text',
                      label: { en: 'Hero Title (Arabic)', ar: 'عنوان البطل (عربي)' },
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
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: { en: 'Background Image', ar: 'صورة الخلفية' },
                },
                {
                  name: 'size',
                  type: 'select',
                  defaultValue: 'medium',
                  options: [
                    { label: { en: 'Small', ar: 'صغير' }, value: 'small' },
                    { label: { en: 'Medium', ar: 'متوسط' }, value: 'medium' },
                    { label: { en: 'Large', ar: 'كبير' }, value: 'large' },
                  ],
                  label: { en: 'Hero Size', ar: 'حجم البطل' },
                },
                {
                  name: 'showBreadcrumbs',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show Breadcrumbs', ar: 'إظهار مسار التنقل' },
                },
              ],
            },
            {
              name: 'content',
              type: 'blocks',
              blocks: pageBuilderBlocks,
              label: { en: 'Page Content', ar: 'محتوى الصفحة' },
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
                  admin: {
                    description: 'Leave empty to use page title',
                  },
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
            {
              name: 'noIndex',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'No Index (Hide from Search Engines)', ar: 'إخفاء من محركات البحث' },
            },
          ],
        },
        {
          label: { en: 'Settings', ar: 'الإعدادات' },
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: { en: 'Draft', ar: 'مسودة' }, value: 'draft' },
                { label: { en: 'Published', ar: 'منشور' }, value: 'published' },
              ],
              label: { en: 'Status', ar: 'الحالة' },
            },
            {
              name: 'template',
              type: 'select',
              defaultValue: 'default',
              options: [
                { label: { en: 'Default', ar: 'افتراضي' }, value: 'default' },
                { label: { en: 'Full Width', ar: 'عرض كامل' }, value: 'full-width' },
                { label: { en: 'Sidebar', ar: 'مع شريط جانبي' }, value: 'sidebar' },
                { label: { en: 'Landing Page', ar: 'صفحة هبوط' }, value: 'landing' },
              ],
              label: { en: 'Page Template', ar: 'قالب الصفحة' },
            },
            {
              name: 'parent',
              type: 'relationship',
              relationTo: 'pages',
              label: { en: 'Parent Page', ar: 'الصفحة الأم' },
              admin: {
                description: 'Optional: Set parent page for hierarchical structure',
              },
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              label: { en: 'Menu Order', ar: 'ترتيب القائمة' },
            },
          ],
        },
      ],
    },
  ],
}
