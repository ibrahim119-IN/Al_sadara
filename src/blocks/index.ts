// Page Builder Blocks - Centralized exports
import type { Block } from 'payload'

// Hero Block
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: { en: 'Hero Section', ar: 'قسم البطل' },
    plural: { en: 'Hero Sections', ar: 'أقسام البطل' },
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: { en: 'Image', ar: 'صورة' }, value: 'image' },
        { label: { en: 'Video', ar: 'فيديو' }, value: 'video' },
        { label: { en: 'Slider', ar: 'سلايدر' }, value: 'slider' },
      ],
      label: { en: 'Hero Type', ar: 'نوع البطل' },
    },
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
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Background Image', ar: 'صورة الخلفية' },
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: { en: 'Video URL', ar: 'رابط الفيديو' },
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'video',
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: { en: 'Slides', ar: 'الشرائح' },
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'slider',
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
          name: 'title',
          type: 'text',
          label: { en: 'Title', ar: 'العنوان' },
        },
        {
          name: 'titleAr',
          type: 'text',
          label: { en: 'Title (Arabic)', ar: 'العنوان (عربي)' },
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
          defaultValue: true,
          label: { en: 'Show Button', ar: 'إظهار الزر' },
        },
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
        {
          name: 'link',
          type: 'text',
          label: { en: 'Button Link', ar: 'رابط الزر' },
        },
      ],
    },
    {
      name: 'overlay',
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
  ],
}

// Featured Products Block
export const FeaturedProductsBlock: Block = {
  slug: 'featured-products',
  labels: {
    singular: { en: 'Featured Products', ar: 'المنتجات المميزة' },
    plural: { en: 'Featured Products', ar: 'المنتجات المميزة' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: { en: 'Manual Selection', ar: 'اختيار يدوي' }, value: 'manual' },
        { label: { en: 'Latest Products', ar: 'أحدث المنتجات' }, value: 'latest' },
        { label: { en: 'Best Sellers', ar: 'الأكثر مبيعاً' }, value: 'bestsellers' },
        { label: { en: 'Featured', ar: 'مميزة' }, value: 'featured' },
      ],
      label: { en: 'Display Type', ar: 'طريقة العرض' },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: { en: 'Products', ar: 'المنتجات' },
      admin: {
        condition: (_, siblingData) => siblingData?.displayType === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 8,
      min: 1,
      max: 24,
      label: { en: 'Number of Products', ar: 'عدد المنتجات' },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
      label: { en: 'Columns', ar: 'الأعمدة' },
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show View All Button', ar: 'إظهار زر عرض الكل' },
    },
  ],
}

// Categories Grid Block
export const CategoriesGridBlock: Block = {
  slug: 'categories-grid',
  labels: {
    singular: { en: 'Categories Grid', ar: 'شبكة الفئات' },
    plural: { en: 'Categories Grids', ar: 'شبكات الفئات' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: { en: 'All Categories', ar: 'جميع الفئات' }, value: 'all' },
        { label: { en: 'Selected Categories', ar: 'فئات مختارة' }, value: 'selected' },
        { label: { en: 'Top Level Only', ar: 'الفئات الرئيسية فقط' }, value: 'top' },
      ],
      label: { en: 'Display Type', ar: 'طريقة العرض' },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: { en: 'Categories', ar: 'الفئات' },
      admin: {
        condition: (_, siblingData) => siblingData?.displayType === 'selected',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: { en: 'Grid', ar: 'شبكة' }, value: 'grid' },
        { label: { en: 'Carousel', ar: 'دائري' }, value: 'carousel' },
        { label: { en: 'Masonry', ar: 'متداخل' }, value: 'masonry' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '6', value: '6' },
      ],
      label: { en: 'Columns', ar: 'الأعمدة' },
    },
    {
      name: 'showProductCount',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show Product Count', ar: 'إظهار عدد المنتجات' },
    },
  ],
}

// Companies Showcase Block
export const CompaniesShowcaseBlock: Block = {
  slug: 'companies-showcase',
  labels: {
    singular: { en: 'Companies Showcase', ar: 'عرض الشركات' },
    plural: { en: 'Companies Showcases', ar: 'عروض الشركات' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
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
    {
      name: 'companies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      label: { en: 'Companies', ar: 'الشركات' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: { en: 'Cards', ar: 'بطاقات' }, value: 'cards' },
        { label: { en: 'Logo Grid', ar: 'شبكة شعارات' }, value: 'logos' },
        { label: { en: 'Featured', ar: 'مميز' }, value: 'featured' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
  ],
}

// Testimonials Block
export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: { en: 'Testimonials', ar: 'آراء العملاء' },
    plural: { en: 'Testimonials', ar: 'آراء العملاء' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: { en: 'All Testimonials', ar: 'جميع الآراء' }, value: 'all' },
        { label: { en: 'Selected', ar: 'مختارة' }, value: 'selected' },
        { label: { en: 'Latest', ar: 'الأحدث' }, value: 'latest' },
      ],
      label: { en: 'Display Type', ar: 'طريقة العرض' },
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: { en: 'Testimonials', ar: 'الآراء' },
      admin: {
        condition: (_, siblingData) => siblingData?.displayType === 'selected',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 6,
      label: { en: 'Limit', ar: 'الحد الأقصى' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'carousel',
      options: [
        { label: { en: 'Carousel', ar: 'دائري' }, value: 'carousel' },
        { label: { en: 'Grid', ar: 'شبكة' }, value: 'grid' },
        { label: { en: 'Masonry', ar: 'متداخل' }, value: 'masonry' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
  ],
}

// Stats Block
export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: { en: 'Statistics', ar: 'الإحصائيات' },
    plural: { en: 'Statistics', ar: 'الإحصائيات' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      label: { en: 'Statistics', ar: 'الإحصائيات' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              label: { en: 'Value', ar: 'القيمة' },
            },
            {
              name: 'suffix',
              type: 'text',
              label: { en: 'Suffix', ar: 'اللاحقة' },
              admin: { description: 'e.g., +, %, K' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: { en: 'Label (English)', ar: 'العنوان (إنجليزي)' },
            },
            {
              name: 'labelAr',
              type: 'text',
              required: true,
              label: { en: 'Label (Arabic)', ar: 'العنوان (عربي)' },
            },
          ],
        },
        {
          name: 'icon',
          type: 'text',
          label: { en: 'Icon Name', ar: 'اسم الأيقونة' },
          admin: { description: 'Lucide icon name (e.g., users, building, globe)' },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: { en: 'Primary', ar: 'رئيسي' }, value: 'primary' },
        { label: { en: 'Secondary', ar: 'ثانوي' }, value: 'secondary' },
        { label: { en: 'White', ar: 'أبيض' }, value: 'white' },
        { label: { en: 'Dark', ar: 'داكن' }, value: 'dark' },
      ],
      label: { en: 'Background Color', ar: 'لون الخلفية' },
    },
    {
      name: 'animate',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Animate Numbers', ar: 'تحريك الأرقام' },
    },
  ],
}

// CTA Block
export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: { en: 'Call to Action', ar: 'دعوة للإجراء' },
    plural: { en: 'Calls to Action', ar: 'دعوات للإجراء' },
  },
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
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
    },
    {
      name: 'descriptionAr',
      type: 'textarea',
      label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: { en: 'Primary Button', ar: 'الزر الرئيسي' },
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
        {
          name: 'link',
          type: 'text',
          label: { en: 'Link', ar: 'الرابط' },
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: { en: 'Secondary Button', ar: 'الزر الثانوي' },
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
        {
          name: 'link',
          type: 'text',
          label: { en: 'Link', ar: 'الرابط' },
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
      name: 'style',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: { en: 'Centered', ar: 'وسط' }, value: 'centered' },
        { label: { en: 'Left Aligned', ar: 'محاذاة يسار' }, value: 'left' },
        { label: { en: 'With Image', ar: 'مع صورة' }, value: 'with-image' },
      ],
      label: { en: 'Style', ar: 'النمط' },
    },
  ],
}

// Newsletter Block
export const NewsletterBlock: Block = {
  slug: 'newsletter',
  labels: {
    singular: { en: 'Newsletter', ar: 'النشرة البريدية' },
    plural: { en: 'Newsletters', ar: 'النشرات البريدية' },
  },
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
    {
      name: 'style',
      type: 'select',
      defaultValue: 'inline',
      options: [
        { label: { en: 'Inline', ar: 'سطري' }, value: 'inline' },
        { label: { en: 'Stacked', ar: 'متراكب' }, value: 'stacked' },
        { label: { en: 'Card', ar: 'بطاقة' }, value: 'card' },
      ],
      label: { en: 'Style', ar: 'النمط' },
    },
  ],
}

// Text Content Block
export const TextContentBlock: Block = {
  slug: 'text-content',
  labels: {
    singular: { en: 'Text Content', ar: 'محتوى نصي' },
    plural: { en: 'Text Contents', ar: 'محتويات نصية' },
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: { en: 'Content (English)', ar: 'المحتوى (إنجليزي)' },
    },
    {
      name: 'contentAr',
      type: 'richText',
      label: { en: 'Content (Arabic)', ar: 'المحتوى (عربي)' },
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: { en: 'Left', ar: 'يسار' }, value: 'left' },
        { label: { en: 'Center', ar: 'وسط' }, value: 'center' },
        { label: { en: 'Right', ar: 'يمين' }, value: 'right' },
      ],
      label: { en: 'Alignment', ar: 'المحاذاة' },
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: { en: 'Full', ar: 'كامل' }, value: 'full' },
        { label: { en: 'Large', ar: 'كبير' }, value: 'large' },
        { label: { en: 'Medium', ar: 'متوسط' }, value: 'medium' },
        { label: { en: 'Small', ar: 'صغير' }, value: 'small' },
      ],
      label: { en: 'Max Width', ar: 'العرض الأقصى' },
    },
  ],
}

// Image Gallery Block
export const ImageGalleryBlock: Block = {
  slug: 'image-gallery',
  labels: {
    singular: { en: 'Image Gallery', ar: 'معرض الصور' },
    plural: { en: 'Image Galleries', ar: 'معارض الصور' },
  },
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
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Images', ar: 'الصور' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { en: 'Image', ar: 'الصورة' },
        },
        {
          name: 'caption',
          type: 'text',
          label: { en: 'Caption', ar: 'التعليق' },
        },
        {
          name: 'captionAr',
          type: 'text',
          label: { en: 'Caption (Arabic)', ar: 'التعليق (عربي)' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: { en: 'Grid', ar: 'شبكة' }, value: 'grid' },
        { label: { en: 'Masonry', ar: 'متداخل' }, value: 'masonry' },
        { label: { en: 'Carousel', ar: 'دائري' }, value: 'carousel' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      label: { en: 'Columns', ar: 'الأعمدة' },
    },
    {
      name: 'lightbox',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Enable Lightbox', ar: 'تفعيل العرض المكبر' },
    },
  ],
}

// Video Block
export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: { en: 'Video', ar: 'فيديو' },
    plural: { en: 'Videos', ar: 'فيديوهات' },
  },
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
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: { en: 'Self Hosted', ar: 'مستضاف ذاتياً' }, value: 'self' },
      ],
      label: { en: 'Source', ar: 'المصدر' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { en: 'Video URL', ar: 'رابط الفيديو' },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Custom Thumbnail', ar: 'صورة مصغرة مخصصة' },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16:9',
      options: [
        { label: '16:9', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1', value: '1:1' },
        { label: '9:16', value: '9:16' },
      ],
      label: { en: 'Aspect Ratio', ar: 'نسبة العرض' },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Autoplay', ar: 'تشغيل تلقائي' },
    },
  ],
}

// FAQ Block
export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    plural: { en: 'FAQs', ar: 'الأسئلة الشائعة' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: { en: 'All FAQs', ar: 'جميع الأسئلة' }, value: 'all' },
        { label: { en: 'Selected', ar: 'مختارة' }, value: 'selected' },
        { label: { en: 'By Category', ar: 'حسب الفئة' }, value: 'category' },
      ],
      label: { en: 'Display Type', ar: 'طريقة العرض' },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      label: { en: 'FAQs', ar: 'الأسئلة' },
      admin: {
        condition: (_, siblingData) => siblingData?.displayType === 'selected',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: { en: 'Category', ar: 'الفئة' },
      admin: {
        condition: (_, siblingData) => siblingData?.displayType === 'category',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      label: { en: 'Limit', ar: 'الحد الأقصى' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'accordion',
      options: [
        { label: { en: 'Accordion', ar: 'أكورديون' }, value: 'accordion' },
        { label: { en: 'List', ar: 'قائمة' }, value: 'list' },
      ],
      label: { en: 'Style', ar: 'النمط' },
    },
  ],
}

// Features Block
export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: { en: 'Features', ar: 'المميزات' },
    plural: { en: 'Features', ar: 'المميزات' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      label: { en: 'Features', ar: 'المميزات' },
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
              type: 'textarea',
              label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
            },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
      label: { en: 'Columns', ar: 'الأعمدة' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: { en: 'Cards', ar: 'بطاقات' }, value: 'cards' },
        { label: { en: 'Icons Only', ar: 'أيقونات فقط' }, value: 'icons' },
        { label: { en: 'List', ar: 'قائمة' }, value: 'list' },
      ],
      label: { en: 'Style', ar: 'النمط' },
    },
  ],
}

// Partners Block
export const PartnersBlock: Block = {
  slug: 'partners',
  labels: {
    singular: { en: 'Partners', ar: 'الشركاء' },
    plural: { en: 'Partners', ar: 'الشركاء' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'partners',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Partners', ar: 'الشركاء' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: { en: 'Partner Name', ar: 'اسم الشريك' },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: { en: 'Logo', ar: 'الشعار' },
        },
        {
          name: 'url',
          type: 'text',
          label: { en: 'Website URL', ar: 'رابط الموقع' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'scroll',
      options: [
        { label: { en: 'Auto Scroll', ar: 'تمرير تلقائي' }, value: 'scroll' },
        { label: { en: 'Grid', ar: 'شبكة' }, value: 'grid' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Grayscale Logos', ar: 'شعارات رمادية' },
    },
  ],
}

// Spacer Block
export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: {
    singular: { en: 'Spacer', ar: 'مسافة' },
    plural: { en: 'Spacers', ar: 'مسافات' },
  },
  fields: [
    {
      name: 'size',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: { en: 'Extra Small (16px)', ar: 'صغير جداً' }, value: 'xs' },
        { label: { en: 'Small (32px)', ar: 'صغير' }, value: 'sm' },
        { label: { en: 'Medium (64px)', ar: 'متوسط' }, value: 'medium' },
        { label: { en: 'Large (96px)', ar: 'كبير' }, value: 'lg' },
        { label: { en: 'Extra Large (128px)', ar: 'كبير جداً' }, value: 'xl' },
      ],
      label: { en: 'Size', ar: 'الحجم' },
    },
  ],
}

// Divider Block
export const DividerBlock: Block = {
  slug: 'divider',
  labels: {
    singular: { en: 'Divider', ar: 'فاصل' },
    plural: { en: 'Dividers', ar: 'فواصل' },
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'solid',
      options: [
        { label: { en: 'Solid', ar: 'متصل' }, value: 'solid' },
        { label: { en: 'Dashed', ar: 'متقطع' }, value: 'dashed' },
        { label: { en: 'Dotted', ar: 'منقط' }, value: 'dotted' },
        { label: { en: 'Gradient', ar: 'تدرج' }, value: 'gradient' },
      ],
      label: { en: 'Style', ar: 'النمط' },
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: { en: 'Full', ar: 'كامل' }, value: 'full' },
        { label: { en: '3/4', ar: 'ثلاثة أرباع' }, value: '3/4' },
        { label: { en: '1/2', ar: 'نصف' }, value: '1/2' },
        { label: { en: '1/4', ar: 'ربع' }, value: '1/4' },
      ],
      label: { en: 'Width', ar: 'العرض' },
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: { en: 'Small', ar: 'صغير' }, value: 'sm' },
        { label: { en: 'Medium', ar: 'متوسط' }, value: 'medium' },
        { label: { en: 'Large', ar: 'كبير' }, value: 'lg' },
      ],
      label: { en: 'Vertical Spacing', ar: 'المسافة العمودية' },
    },
  ],
}

// Contact Form Block
export const ContactFormBlock: Block = {
  slug: 'contact-form',
  labels: {
    singular: { en: 'Contact Form', ar: 'نموذج التواصل' },
    plural: { en: 'Contact Forms', ar: 'نماذج التواصل' },
  },
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
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
    },
    {
      name: 'descriptionAr',
      type: 'textarea',
      label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
    },
    {
      name: 'fields',
      type: 'select',
      hasMany: true,
      defaultValue: ['name', 'email', 'message'],
      options: [
        { label: { en: 'Name', ar: 'الاسم' }, value: 'name' },
        { label: { en: 'Email', ar: 'البريد' }, value: 'email' },
        { label: { en: 'Phone', ar: 'الهاتف' }, value: 'phone' },
        { label: { en: 'Company', ar: 'الشركة' }, value: 'company' },
        { label: { en: 'Subject', ar: 'الموضوع' }, value: 'subject' },
        { label: { en: 'Message', ar: 'الرسالة' }, value: 'message' },
      ],
      label: { en: 'Form Fields', ar: 'حقول النموذج' },
    },
    {
      name: 'submitButtonText',
      type: 'text',
      defaultValue: 'Send Message',
      label: { en: 'Submit Button Text (English)', ar: 'نص زر الإرسال (إنجليزي)' },
    },
    {
      name: 'submitButtonTextAr',
      type: 'text',
      defaultValue: 'إرسال الرسالة',
      label: { en: 'Submit Button Text (Arabic)', ar: 'نص زر الإرسال (عربي)' },
    },
    {
      name: 'recipientEmail',
      type: 'email',
      label: { en: 'Recipient Email', ar: 'بريد المستلم' },
    },
  ],
}

// Timeline Block
export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: { en: 'Timeline', ar: 'الجدول الزمني' },
    plural: { en: 'Timelines', ar: 'الجداول الزمنية' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Section Title (English)', ar: 'عنوان القسم (إنجليزي)' },
    },
    {
      name: 'titleAr',
      type: 'text',
      label: { en: 'Section Title (Arabic)', ar: 'عنوان القسم (عربي)' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: { en: 'Timeline Items', ar: 'عناصر الجدول' },
      fields: [
        {
          name: 'year',
          type: 'text',
          required: true,
          label: { en: 'Year/Date', ar: 'السنة/التاريخ' },
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
              type: 'textarea',
              label: { en: 'Description (English)', ar: 'الوصف (إنجليزي)' },
            },
            {
              name: 'descriptionAr',
              type: 'textarea',
              label: { en: 'Description (Arabic)', ar: 'الوصف (عربي)' },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: { en: 'Image', ar: 'الصورة' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: { en: 'Vertical', ar: 'عمودي' }, value: 'vertical' },
        { label: { en: 'Horizontal', ar: 'أفقي' }, value: 'horizontal' },
      ],
      label: { en: 'Layout', ar: 'التخطيط' },
    },
  ],
}

// Map Block
export const MapBlock: Block = {
  slug: 'map',
  labels: {
    singular: { en: 'Map', ar: 'خريطة' },
    plural: { en: 'Maps', ar: 'خرائط' },
  },
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
    {
      name: 'embedCode',
      type: 'textarea',
      label: { en: 'Google Maps Embed Code', ar: 'كود تضمين خرائط جوجل' },
      admin: { description: 'Paste the iframe embed code from Google Maps' },
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: { en: 'Small (300px)', ar: 'صغير' }, value: 'small' },
        { label: { en: 'Medium (450px)', ar: 'متوسط' }, value: 'medium' },
        { label: { en: 'Large (600px)', ar: 'كبير' }, value: 'large' },
      ],
      label: { en: 'Height', ar: 'الارتفاع' },
    },
  ],
}

// Export all blocks as an array
export const pageBuilderBlocks: Block[] = [
  HeroBlock,
  FeaturedProductsBlock,
  CategoriesGridBlock,
  CompaniesShowcaseBlock,
  TestimonialsBlock,
  StatsBlock,
  CTABlock,
  NewsletterBlock,
  TextContentBlock,
  ImageGalleryBlock,
  VideoBlock,
  FAQBlock,
  FeaturesBlock,
  PartnersBlock,
  SpacerBlock,
  DividerBlock,
  ContactFormBlock,
  TimelineBlock,
  MapBlock,
]
