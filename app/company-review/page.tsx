'use client'

import { CompanyPerformance } from '@/components/company-performance'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { PageTransition } from '@/components/page-transition'

export default function CompanyPerformancePage() {
  return (
    <PageTransition>
      <div className='p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8'>
        <Breadcrumbs />

        {/* Company Performance Component */}
        <CompanyPerformance />
      </div>
    </PageTransition>
  )
}
