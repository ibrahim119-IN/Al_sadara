import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'
import type { Where } from 'payload'

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const status = searchParams.get('status') || 'approved'
    const sort = searchParams.get('sort') || '-createdAt'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const rating = searchParams.get('rating')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const payload = await getCachedPayload()

    const where: Where = {
      product: { equals: productId },
      status: { equals: status },
    }

    if (rating) {
      (where as Record<string, unknown>).rating = { equals: parseInt(rating) }
    }

    const reviews = await payload.find({
      collection: 'reviews',
      where: where as Where,
      sort,
      page,
      limit,
      depth: 2,
    })

    // Calculate rating distribution
    const allReviews = await payload.find({
      collection: 'reviews',
      where: {
        product: { equals: productId },
        status: { equals: 'approved' },
      },
      limit: 1000,
    })

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0

    allReviews.docs.forEach((review) => {
      const r = review.rating as number
      distribution[r as keyof typeof distribution]++
      totalRating += r
    })

    const averageRating = allReviews.totalDocs > 0
      ? totalRating / allReviews.totalDocs
      : 0

    return NextResponse.json({
      ...reviews,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: allReviews.totalDocs,
        distribution,
      },
    })
  } catch (error) {
    console.error('[Reviews API] Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, customerId, rating, title, content, pros, cons, images } = body

    if (!productId || !customerId || !rating) {
      return NextResponse.json(
        { error: 'Product ID, Customer ID, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const payload = await getCachedPayload()

    // Check if customer already reviewed this product
    const existingReview = await payload.find({
      collection: 'reviews',
      where: {
        product: { equals: productId },
        customer: { equals: customerId },
      },
      limit: 1,
    })

    if (existingReview.totalDocs > 0) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if customer has purchased this product (for verified purchase badge)
    const orders = await payload.find({
      collection: 'orders',
      where: {
        customer: { equals: customerId },
        status: { in: ['delivered', 'completed'] },
      },
      limit: 100,
    })

    let verifiedPurchase = false
    for (const order of orders.docs) {
      const items = order.items
      if (items?.some((item) => {
        const itemProductId = typeof item.product === 'object' ? String(item.product.id) : String(item.product)
        return itemProductId === productId
      })) {
        verifiedPurchase = true
        break
      }
    }

    // Create the review
    const review = await payload.create({
      collection: 'reviews',
      data: {
        product: productId,
        customer: customerId,
        rating,
        title: title || '',
        content: content || '',
        pros: pros?.map((text: string) => ({ text })) || [],
        cons: cons?.map((text: string) => ({ text })) || [],
        images: images?.map((id: string) => ({ image: id })) || [],
        verifiedPurchase,
        status: 'pending', // Reviews need approval
        helpfulVotes: 0,
        notHelpfulVotes: 0,
      },
    })

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully. It will be visible after approval.',
    })
  } catch (error) {
    console.error('[Reviews API] Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
