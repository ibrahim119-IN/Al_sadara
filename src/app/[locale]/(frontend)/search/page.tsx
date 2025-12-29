'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/contexts/LocaleContext'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { NoSearchResults } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Filter, Grid, List, ArrowRight } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'product' | 'company' | 'page'
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  image?: string
  url: string
  price?: number
  category?: string
  categoryAr?: string
}

// Mock search function - in production, this would call your API
const performSearch = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!query.trim()) return []

  // Mock results - replace with actual API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'product',
      title: 'Smart LED Bulb',
      titleAr: 'مصباح LED ذكي',
      description: 'Energy-efficient smart LED bulb with WiFi control',
      descriptionAr: 'مصباح LED ذكي موفر للطاقة مع تحكم WiFi',
      image: '/images/products/led-bulb.jpg',
      url: '/products/smart-led-bulb',
      price: 150,
      category: 'Lighting',
      categoryAr: 'إضاءة',
    },
    {
      id: '2',
      type: 'product',
      title: 'Smart Home Hub',
      titleAr: 'وحدة التحكم المنزلية الذكية',
      description: 'Central hub for all your smart home devices',
      descriptionAr: 'وحدة مركزية لجميع أجهزتك المنزلية الذكية',
      image: '/images/products/smart-hub.jpg',
      url: '/products/smart-home-hub',
      price: 850,
      category: 'Smart Home',
      categoryAr: 'المنزل الذكي',
    },
    {
      id: '3',
      type: 'company',
      title: 'Al Sadara Industry',
      titleAr: 'الصدارة للصناعة',
      description: 'Electronics manufacturing and assembly',
      descriptionAr: 'تصنيع وتجميع الإلكترونيات',
      url: '/companies/al-sadara-industry',
    },
    {
      id: '4',
      type: 'company',
      title: 'Coderatech',
      titleAr: 'كوديراتك',
      description: 'Software development and digital solutions',
      descriptionAr: 'تطوير البرمجيات والحلول الرقمية',
      url: '/companies/coderatech',
    },
    {
      id: '5',
      type: 'page',
      title: 'About Us',
      titleAr: 'من نحن',
      description: 'Learn about Al Sadara Holding Group',
      descriptionAr: 'تعرف على مجموعة الصدارة القابضة',
      url: '/about',
    },
  ]

  // Filter results based on query
  const lowerQuery = query.toLowerCase()
  return mockResults.filter(result =>
    result.title.toLowerCase().includes(lowerQuery) ||
    result.titleAr.includes(query) ||
    result.description.toLowerCase().includes(lowerQuery) ||
    result.descriptionAr.includes(query)
  )
}

export default function SearchPage() {
  const { locale, isArabic } = useLocale()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<'all' | 'product' | 'company' | 'page'>('all')

  const breadcrumbItems = [
    { label: isArabic ? 'البحث' : 'Search' },
  ]

  const content = {
    ar: {
      title: 'البحث',
      placeholder: 'ابحث عن منتجات، شركات، أو صفحات...',
      searchButton: 'بحث',
      resultsCount: (count: number) => `${count} نتيجة`,
      noResults: 'لا توجد نتائج',
      filters: {
        all: 'الكل',
        product: 'المنتجات',
        company: 'الشركات',
        page: 'الصفحات',
      },
      viewDetails: 'عرض التفاصيل',
      suggestions: 'اقتراحات البحث',
      recentSearches: 'عمليات البحث الأخيرة',
    },
    en: {
      title: 'Search',
      placeholder: 'Search for products, companies, or pages...',
      searchButton: 'Search',
      resultsCount: (count: number) => `${count} result${count !== 1 ? 's' : ''}`,
      noResults: 'No results',
      filters: {
        all: 'All',
        product: 'Products',
        company: 'Companies',
        page: 'Pages',
      },
      viewDetails: 'View Details',
      suggestions: 'Search Suggestions',
      recentSearches: 'Recent Searches',
    },
  }

  const t = content[locale]

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const searchResults = await performSearch(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery, handleSearch])

  const filteredResults = filterType === 'all'
    ? results
    : results.filter(r => r.type === filterType)

  const suggestions = isArabic
    ? ['إضاءة ذكية', 'أجهزة منزلية', 'كوديراتك', 'الصدارة للصناعة']
    : ['Smart lighting', 'Home devices', 'Coderatech', 'Al Sadara Industry']

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="container mx-auto px-4 relative z-10">
          <SimpleBreadcrumb
            items={breadcrumbItems}
            locale={locale}
            className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
          />

          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t.title}
            </h1>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder={t.placeholder}
                className="w-full px-6 py-4 pr-32 rounded-2xl bg-white text-secondary-900 placeholder-secondary-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                dir={isArabic ? 'rtl' : 'ltr'}
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    setHasSearched(false)
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-24 p-2 text-secondary-400 hover:text-secondary-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleSearch(query)}
                className="absolute top-1/2 -translate-y-1/2 right-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">{t.searchButton}</span>
              </button>
            </div>

            {/* Search Suggestions */}
            {!hasSearched && (
              <div className="mt-6">
                <p className="text-white/70 mb-3">{t.suggestions}:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(suggestion)
                        handleSearch(suggestion)
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : hasSearched ? (
            <>
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-secondary-600">
                    {t.resultsCount(filteredResults.length)}
                    {query && (
                      <span className="text-secondary-900 font-medium"> "{query}"</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Filter */}
                  <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                    <Filter className="w-4 h-4 text-secondary-400 mx-2" />
                    {(['all', 'product', 'company', 'page'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          filterType === type
                            ? 'bg-primary-600 text-white'
                            : 'text-secondary-600 hover:bg-secondary-100'
                        }`}
                      >
                        {t.filters[type]}
                      </button>
                    ))}
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-secondary-400'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {filteredResults.length > 0 ? (
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredResults.map((result) => (
                    <Link
                      key={result.id}
                      href={`/${locale}${result.url}`}
                      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-secondary-100 transition-all hover:-translate-y-1 ${
                        viewMode === 'list' ? 'flex items-center' : ''
                      }`}
                    >
                      {result.image && (
                        <div className={viewMode === 'grid' ? 'aspect-video relative' : 'w-32 h-32 relative flex-shrink-0'}>
                          <Image
                            src={result.image}
                            alt={isArabic ? result.titleAr : result.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            result.type === 'product'
                              ? 'bg-green-100 text-green-700'
                              : result.type === 'company'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {t.filters[result.type]}
                          </span>
                          {result.category && (
                            <span className="text-xs text-secondary-500">
                              {isArabic ? result.categoryAr : result.category}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-secondary-900 mb-2">
                          {isArabic ? result.titleAr : result.title}
                        </h3>

                        <p className="text-sm text-secondary-600 line-clamp-2 mb-3">
                          {isArabic ? result.descriptionAr : result.description}
                        </p>

                        <div className="flex items-center justify-between">
                          {result.price && (
                            <span className="font-bold text-primary-600">
                              {result.price} {isArabic ? 'ج.م' : 'EGP'}
                            </span>
                          )}
                          <span className="text-primary-600 text-sm font-medium flex items-center gap-1">
                            {t.viewDetails}
                            <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <NoSearchResults query={query} />
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-secondary-400" />
              </div>
              <p className="text-secondary-600">
                {isArabic ? 'أدخل كلمة للبحث' : 'Enter a search term'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
