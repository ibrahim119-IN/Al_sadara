import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: {
      en: 'Review',
      ar: 'مراجعة',
    },
    plural: {
      en: 'Reviews',
      ar: 'المراجعات',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'customer', 'rating', 'status', 'createdAt'],
    group: {
      en: 'Customers',
      ar: 'العملاء',
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user?.collection === 'users'),
    delete: ({ req: { user } }) => Boolean(user?.collection === 'users'),
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update product average rating after review is created/updated
        if (operation === 'create' || operation === 'update') {
          try {
            const payload = req.payload
            const productId = typeof doc.product === 'object' ? doc.product.id : doc.product

            // Get all approved reviews for this product
            const reviews = await payload.find({
              collection: 'reviews',
              where: {
                and: [
                  { product: { equals: productId } },
                  { status: { equals: 'approved' } },
                ],
              },
              limit: 1000,
            })

            if (reviews.docs.length > 0) {
              const totalRating = reviews.docs.reduce((sum, review) => sum + (review.rating || 0), 0)
              const averageRating = totalRating / reviews.docs.length

              // Update product with new average rating and review count
              // Note: This requires adding averageRating and reviewCount fields to Products collection
              console.log(`[Reviews] Product ${productId} - Average: ${averageRating.toFixed(1)}, Count: ${reviews.docs.length}`)
            }
          } catch (error) {
            console.error('[Reviews] Error updating product rating:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: {
        en: 'Product',
        ar: 'المنتج',
      },
      admin: {
        description: {
          en: 'The product being reviewed',
          ar: 'المنتج المراد تقييمه',
        },
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: {
        en: 'Customer',
        ar: 'العميل',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: {
        en: 'Rating',
        ar: 'التقييم',
      },
      admin: {
        description: {
          en: 'Rating from 1 to 5 stars',
          ar: 'التقييم من 1 إلى 5 نجوم',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: {
        en: 'Review Title',
        ar: 'عنوان المراجعة',
      },
      maxLength: 200,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: {
        en: 'Review Content',
        ar: 'محتوى المراجعة',
      },
      maxLength: 2000,
    },
    {
      name: 'pros',
      type: 'array',
      label: {
        en: 'Pros',
        ar: 'المميزات',
      },
      maxRows: 5,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          maxLength: 100,
        },
      ],
    },
    {
      name: 'cons',
      type: 'array',
      label: {
        en: 'Cons',
        ar: 'العيوب',
      },
      maxRows: 5,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          maxLength: 100,
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      label: {
        en: 'Review Images',
        ar: 'صور المراجعة',
      },
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Verified Purchase',
        ar: 'شراء موثق',
      },
      admin: {
        description: {
          en: 'Whether the customer has purchased this product',
          ar: 'هل قام العميل بشراء هذا المنتج',
        },
      },
    },
    {
      name: 'helpfulVotes',
      type: 'number',
      defaultValue: 0,
      label: {
        en: 'Helpful Votes',
        ar: 'تصويتات مفيدة',
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'notHelpfulVotes',
      type: 'number',
      defaultValue: 0,
      label: {
        en: 'Not Helpful Votes',
        ar: 'تصويتات غير مفيدة',
      },
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: {
        en: 'Status',
        ar: 'الحالة',
      },
      options: [
        {
          label: {
            en: 'Pending',
            ar: 'قيد المراجعة',
          },
          value: 'pending',
        },
        {
          label: {
            en: 'Approved',
            ar: 'موافق عليها',
          },
          value: 'approved',
        },
        {
          label: {
            en: 'Rejected',
            ar: 'مرفوضة',
          },
          value: 'rejected',
        },
      ],
    },
    {
      name: 'adminReply',
      type: 'textarea',
      label: {
        en: 'Admin Reply',
        ar: 'رد المسؤول',
      },
      maxLength: 1000,
      admin: {
        description: {
          en: 'Optional reply from the store admin',
          ar: 'رد اختياري من مسؤول المتجر',
        },
      },
    },
    {
      name: 'adminReplyDate',
      type: 'date',
      label: {
        en: 'Reply Date',
        ar: 'تاريخ الرد',
      },
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data?.adminReply),
      },
    },
  ],
  timestamps: true,
  indexes: [
    {
      name: 'product_status',
      fields: { product: 1, status: 1 },
    },
    {
      name: 'customer_product',
      fields: { customer: 1, product: 1 },
      unique: true,
    },
  ],
}
