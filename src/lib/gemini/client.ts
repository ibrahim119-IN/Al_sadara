/**
 * Gemini SDK Client - Unified client for all Gemini services
 * Using the new @google/genai SDK
 */
import { GoogleGenAI } from '@google/genai'

// Singleton pattern for client instance
let client: GoogleGenAI | null = null

/**
 * Get the Gemini client instance (singleton)
 */
export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn('Warning: GEMINI_API_KEY not set. Gemini features will not work.')
      return null as any // Return null to allow build to proceed
    }

    client = new GoogleGenAI({ apiKey })
  }

  return client
}

/**
 * Model configurations
 */
export const MODELS = {
  // Main chat model - Gemini 3 Flash Preview for text chat
  CHAT: process.env.GEMINI_CHAT_MODEL || 'gemini-3-flash-preview',

  // Embedding model - Latest with flexible dimensions
  EMBEDDING: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',

  // Live API model for real-time voice/audio
  LIVE: process.env.GEMINI_LIVE_MODEL || 'gemini-2.5-flash-native-audio-preview-12-2025',
} as const

/**
 * Configuration defaults
 */
export const CONFIG = {
  // Embedding dimensions (768, 1536, or 3072)
  EMBEDDING_DIMENSIONS: parseInt(process.env.GEMINI_EMBEDDING_DIMENSIONS || '768'),

  // Enable features
  ENABLE_VOICE_SEARCH: process.env.ENABLE_VOICE_SEARCH === 'true',
  ENABLE_GOOGLE_GROUNDING: process.env.ENABLE_GOOGLE_GROUNDING === 'true',

  // Chat settings
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.3, // Lower for more deterministic function calling

  // Rate limiting
  REQUESTS_PER_MINUTE: 60,
  TOKENS_PER_MINUTE: 1000000,
} as const

/**
 * System prompts for the AI assistant
 */
export const SYSTEM_PROMPTS = {
  SHOPPING_ASSISTANT: `أنت مساعد متجر الصدارة للكاميرات وأجهزة الأمن. مهمتك مساعدة العملاء في إيجاد المنتجات المناسبة.

## القاعدة الذهبية
عند أي سؤال عن منتج أو فئة أو علامة تجارية → استخدم search_products فوراً!

## جدول البحث السريع
| عندما يسأل العميل عن | استخدم query |
|---------------------|--------------|
| كاميرا / مراقبة / كام | Camera |
| حضور / انصراف / بصمة | ZKTeco |
| تسجيل / مسجل / ريكوردر | DVR |
| هيكفيجن / Hikvision | Hikvision |
| داهوا / Dahua | Dahua |
| انتركم / جرس | Intercom |
| انذار / حريق | Fire Alarm |
| جي بي اس / تتبع | GPS |

## أمثلة عملية
المستخدم: "عندكم كاميرات؟"
→ search_products({query: "Camera"})

المستخدم: "أريد جهاز بصمة"
→ search_products({query: "ZKTeco"})

المستخدم: "ما أسعار Hikvision؟"
→ search_products({query: "Hikvision"})

## عند عرض النتائج
- اذكر اسم المنتج والسعر
- إذا لم تجد نتائج، اقترح كلمات بحث بديلة
- كن ودوداً ومساعداً

## ممنوع
- الرد بدون استخدام دالة البحث
- إرسال query فارغ
- تخمين أسماء منتجات غير موجودة`,

  VOICE_ASSISTANT: `أنت مساعد صوتي لمتجر الصدارة للكاميرات وأجهزة الأمن.

## أسلوب المحادثة
- تحدث بجمل قصيرة وواضحة
- تجنب القوائم الطويلة (اذكر 2-3 خيارات فقط)
- اسأل سؤالاً واحداً في كل مرة
- أكد الطلبات قبل تنفيذها

## عند البحث عن منتجات
استخدم نفس قواعد البحث:
- كاميرا → Camera
- حضور/بصمة → ZKTeco
- تسجيل → DVR

## عند عرض النتائج
- اذكر 2-3 منتجات فقط
- اذكر السعر بوضوح
- اسأل إذا أراد المزيد من الخيارات`,
} as const

/**
 * Reset client (useful for testing or key rotation)
 */
export function resetClient(): void {
  client = null
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY
}
