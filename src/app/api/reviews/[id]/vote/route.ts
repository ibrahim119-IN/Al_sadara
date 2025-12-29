import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'

// POST /api/reviews/[id]/vote - Vote on a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { vote, customerId } = body

    if (!vote || !['helpful', 'not_helpful'].includes(vote)) {
      return NextResponse.json(
        { error: 'Vote must be either "helpful" or "not_helpful"' },
        { status: 400 }
      )
    }

    const payload = await getCachedPayload()

    // Get the current review
    const review = await payload.findByID({
      collection: 'reviews',
      id,
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Update the vote count
    const updateData = vote === 'helpful'
      ? { helpfulVotes: ((review.helpfulVotes as number) || 0) + 1 }
      : { notHelpfulVotes: ((review.notHelpfulVotes as number) || 0) + 1 }

    const updatedReview = await payload.update({
      collection: 'reviews',
      id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      helpfulVotes: updatedReview.helpfulVotes,
      notHelpfulVotes: updatedReview.notHelpfulVotes,
    })
  } catch (error) {
    console.error('[Reviews Vote API] Error voting:', error)
    return NextResponse.json(
      { error: 'Failed to vote on review' },
      { status: 500 }
    )
  }
}
