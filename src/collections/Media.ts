import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'uploads',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1200,
        height: 1200,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: {
        en: 'Alt Text',
        ar: 'النص البديل',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: {
        en: 'Caption',
        ar: 'التسمية التوضيحية',
      },
    },
  ],
}
