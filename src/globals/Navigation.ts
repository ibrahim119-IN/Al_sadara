import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Content',
  },
  label: {
    en: 'Navigation',
    ar: 'القائمة الرئيسية',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Top Bar', ar: 'الشريط العلوي' },
          fields: [
            {
              name: 'showTopBar',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Top Bar', ar: 'إظهار الشريط العلوي' },
            },
            {
              name: 'topBarContent',
              type: 'group',
              label: { en: 'Top Bar Content', ar: 'محتوى الشريط العلوي' },
              admin: {
                condition: (_, siblingData) => siblingData?.showTopBar,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'message',
                      type: 'text',
                      label: { en: 'Message (English)', ar: 'الرسالة (إنجليزي)' },
                    },
                    {
                      name: 'messageAr',
                      type: 'text',
                      label: { en: 'Message (Arabic)', ar: 'الرسالة (عربي)' },
                    },
                  ],
                },
                {
                  name: 'showContactInfo',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show Contact Info', ar: 'إظهار معلومات التواصل' },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: { en: 'Phone Number', ar: 'رقم الهاتف' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.showContactInfo,
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: { en: 'Email', ar: 'البريد الإلكتروني' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.showContactInfo,
                  },
                },
                {
                  name: 'showLanguageSwitcher',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show Language Switcher', ar: 'إظهار محول اللغة' },
                },
                {
                  name: 'showSocialIcons',
                  type: 'checkbox',
                  defaultValue: true,
                  label: { en: 'Show Social Icons', ar: 'إظهار أيقونات التواصل' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Main Menu', ar: 'القائمة الرئيسية' },
          fields: [
            {
              name: 'menuItems',
              type: 'array',
              label: { en: 'Menu Items', ar: 'عناصر القائمة' },
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
                  name: 'type',
                  type: 'select',
                  required: true,
                  defaultValue: 'link',
                  options: [
                    { label: { en: 'Link', ar: 'رابط' }, value: 'link' },
                    { label: { en: 'Dropdown', ar: 'قائمة منسدلة' }, value: 'dropdown' },
                    { label: { en: 'Mega Menu', ar: 'قائمة كبيرة' }, value: 'megamenu' },
                  ],
                  label: { en: 'Type', ar: 'النوع' },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: { en: 'Link', ar: 'الرابط' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'link',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { en: 'Open in New Tab', ar: 'فتح في تبويب جديد' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'link',
                  },
                },
                {
                  name: 'dropdownItems',
                  type: 'array',
                  label: { en: 'Dropdown Items', ar: 'عناصر القائمة المنسدلة' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'dropdown',
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
                      name: 'icon',
                      type: 'text',
                      label: { en: 'Icon Name', ar: 'اسم الأيقونة' },
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
                {
                  name: 'megaMenuColumns',
                  type: 'array',
                  label: { en: 'Mega Menu Columns', ar: 'أعمدة القائمة الكبيرة' },
                  maxRows: 4,
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'megamenu',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'heading',
                          type: 'text',
                          label: { en: 'Column Heading (English)', ar: 'عنوان العمود (إنجليزي)' },
                        },
                        {
                          name: 'headingAr',
                          type: 'text',
                          label: { en: 'Column Heading (Arabic)', ar: 'عنوان العمود (عربي)' },
                        },
                      ],
                    },
                    {
                      name: 'items',
                      type: 'array',
                      label: { en: 'Items', ar: 'العناصر' },
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
                      name: 'featuredImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: { en: 'Featured Image', ar: 'الصورة المميزة' },
                    },
                  ],
                },
                {
                  name: 'highlight',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { en: 'Highlight (New/Sale Badge)', ar: 'تمييز (شارة جديد/عرض)' },
                },
                {
                  name: 'highlightText',
                  type: 'text',
                  label: { en: 'Highlight Text', ar: 'نص التمييز' },
                  admin: {
                    condition: (_, siblingData) => siblingData?.highlight,
                    description: 'e.g., "New", "Sale", "Hot"',
                  },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'CTA Button', ar: 'زر الإجراء' },
          fields: [
            {
              name: 'showCTAButton',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show CTA Button', ar: 'إظهار زر الإجراء' },
            },
            {
              name: 'ctaButton',
              type: 'group',
              label: { en: 'CTA Button', ar: 'زر الإجراء' },
              admin: {
                condition: (_, siblingData) => siblingData?.showCTAButton,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      defaultValue: 'Get Quote',
                      label: { en: 'Text (English)', ar: 'النص (إنجليزي)' },
                    },
                    {
                      name: 'textAr',
                      type: 'text',
                      defaultValue: 'طلب عرض سعر',
                      label: { en: 'Text (Arabic)', ar: 'النص (عربي)' },
                    },
                  ],
                },
                {
                  name: 'link',
                  type: 'text',
                  defaultValue: '/quote',
                  label: { en: 'Link', ar: 'الرابط' },
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: { en: 'Primary', ar: 'رئيسي' }, value: 'primary' },
                    { label: { en: 'Secondary', ar: 'ثانوي' }, value: 'secondary' },
                    { label: { en: 'Outline', ar: 'مخطط' }, value: 'outline' },
                  ],
                  label: { en: 'Style', ar: 'النمط' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Settings', ar: 'الإعدادات' },
          fields: [
            {
              name: 'sticky',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Sticky Header', ar: 'هيدر ثابت' },
            },
            {
              name: 'transparent',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Transparent on Hero', ar: 'شفاف على البطل' },
            },
            {
              name: 'showSearch',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Search', ar: 'إظهار البحث' },
            },
            {
              name: 'showCart',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Cart', ar: 'إظهار السلة' },
            },
            {
              name: 'showAccount',
              type: 'checkbox',
              defaultValue: true,
              label: { en: 'Show Account', ar: 'إظهار الحساب' },
            },
          ],
        },
      ],
    },
  ],
}
