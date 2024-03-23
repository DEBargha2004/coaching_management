import { useMemo } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination'
import { cn } from '@/lib/utils'

type Page = number | 'ellipsis'

export default function PaginationBar ({
  activePage,
  totalPages,
  minPage = 1,
  baseLink,
  replaceString,
  pageItemLimit = 5,
  className
}: {
  activePage: number
  totalPages: number
  baseLink: string
  replaceString: string
  minPage?: number
  pageItemLimit?: number
  className?: string
}) {
  const pagesCollection = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages])

  const getFrom = (active: number, next: number) => {
    return pagesCollection.slice(active, active + next)
  }
  const pagesMemo = useMemo<Page[]>(() => {
    let pages: (number | 'ellipsis')[] = []
    let endCollectStart: number
    const nextPagesFromNow = getFrom(activePage - 1, pageItemLimit - 1)
    activePage = activePage >= totalPages ? totalPages : activePage

    if (totalPages <= pageItemLimit) {
      return pagesCollection
    }

    if (nextPagesFromNow.at(-1) === totalPages) {
      if (nextPagesFromNow.length < pageItemLimit - 1) {
        const prevRemainingLength = pageItemLimit - 1 - nextPagesFromNow.length
        const prevRemaining = getFrom(
          activePage - 1 - prevRemainingLength,
          prevRemainingLength
        )
        pages = [...prevRemaining, ...nextPagesFromNow]
        endCollectStart = activePage - 1 - prevRemainingLength
      } else {
        pages = [...nextPagesFromNow]
        endCollectStart = activePage - 1
      }
    } else {
      pages.push(
        ...nextPagesFromNow.slice(0, activePage === minPage ? undefined : -1),
        'ellipsis',
        totalPages
      )
      endCollectStart = activePage - 1
    }

    const prevPagesFromNow = getFrom(minPage - 1, endCollectStart)

    if (prevPagesFromNow.at(-1) === minPage) {
      pages = [minPage, ...pages]
    } else {
      if (pages[0] !== minPage) {
        const prevsFormatted: Page[] =
          pages[0] === 'ellipsis' ? [minPage] : [minPage, 'ellipsis']
        pages = [...prevsFormatted, ...pages]
      }
    }

    return pages
  }, [activePage, totalPages, pagesCollection])
  return (
    <Pagination className={cn('', className)}>
      <PaginationContent className='cursor-pointer'>
        <PaginationItem>
          <PaginationPrevious
            href={baseLink?.replace(
              replaceString,
              (activePage - 1 >= minPage ? activePage - 1 : minPage).toString()
            )}
          />
        </PaginationItem>
        {pagesMemo.map((p, p_idx) => (
          <PaginationItem key={p_idx}>
            {p === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={baseLink?.replace(replaceString, p.toString())}
                className={p === activePage ? 'bg-primary' : ''}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={baseLink?.replace(
              replaceString,
              (activePage + 1 <= totalPages
                ? activePage + 1
                : totalPages
              ).toString()
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
