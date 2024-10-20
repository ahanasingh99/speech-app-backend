import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useState } from 'react'

export default function PaginationComp({
  previousPage,
  nextPage,
  pageIndex,
  pageOptions,
  gotoPage,
}) {
  const [selectedPage, setSelectedPage] = useState(pageIndex)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {selectedPage > 0 ? (
            <PaginationPrevious
              className="hover:cursor-pointer"
              onClick={() => {
                setSelectedPage((prev) => prev - 1)
                previousPage()
              }}
            />
          ) : (
            <PaginationPrevious className="disabled text-gray-400 hover:bg-white hover:text-gray-400" />
          )}
        </PaginationItem>
        {pageOptions.map((data, key) => {
          return (
            <PaginationItem key={key}>
              <PaginationLink
                className={
                  selectedPage === key
                    ? 'hover:cursor-pointer border-2'
                    : 'hover:cursor-pointer'
                }
                onClick={() => {
                  setSelectedPage(key)
                  gotoPage(key)
                }}
              >
                {key + 1}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* <PaginationItem>
            <PaginationLink onClick={() => gotoPage(3)}>3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem> */}
        <PaginationItem>
          {selectedPage < pageOptions.length - 1 ? (
            <PaginationNext
              className="hover:cursor-pointer"
              onClick={() => {
                setSelectedPage((prev) => prev + 1)
                nextPage()
              }}
            />
          ) : (
            <PaginationNext className="disabled text-gray-400 hover:bg-white hover:text-gray-400" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
