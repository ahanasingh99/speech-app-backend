import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  useTable,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from 'react-table'

import { Button } from '@/components/Button'
import { Filter, DefaultColumnFilter } from './filters'
import {
  paginationFirstButtonStyle,
  paginationPreviousButtonStyle,
  paginationNextButtonStyle,
  paginationLastButtonStyle,
} from '@/app/config/constants'
import { resetButtonStyle } from '@/app/config/constants'
import PaginationComp from '@/components/Table/Pagination'

const TableContainer = ({ columns, data, renderRowSubComponent }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setAllFilters,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
  )

  return (
    <Fragment>
      <Button buttonStyle={resetButtonStyle} onClick={() => setAllFilters([])}>
        Reset Filters
      </Button>

      <div className="mt-4 flex flex-col p-6">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block max-w-screen sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-2 border-gray-200 sm:rounded-lg">
              <table
                bordered
                hover
                {...getTableProps()}
                className="max-w-screen divide-y divide-gray-200"
              >
                <thead className="bg-gray-50 align-top">
                  {headerGroups.map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps({
                            style: {
                              minWidth: column.minWidth,
                              width: column.width,
                            },
                          })}
                          className="py-2"
                        >
                          <div {...column.getSortByToggleProps()}>
                            {column.render('Header')}
                          </div>
                          <Filter column={column} />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200 "
                >
                  {page.map((row, index) => {
                    prepareRow(row)
                    return (
                      <Fragment key={row.getRowProps().key}>
                        {index % 2 === 0 ? (
                          <>
                            <tr className="bg-white">
                              {row.cells.map((cell) => {
                                return (
                                  <td
                                    key={cell.Number}
                                    {...cell.getCellProps()}
                                    className={cell.column.style}
                                    role="cell"
                                  >
                                    {cell.render('Cell')}
                                  </td>
                                )
                              })}
                            </tr>
                            {row.isExpanded && (
                              <tr>
                                <td colSpan={visibleColumns.length}>
                                  {renderRowSubComponent(row)}
                                </td>
                              </tr>
                            )}
                          </>
                        ) : (
                          <>
                            <tr className="bg-gray-100">
                              {row.cells.map((cell) => {
                                return (
                                  <td
                                    key={cell.Number}
                                    {...cell.getCellProps()}
                                    className={cell.column.style}
                                    role="cell"
                                  >
                                    {cell.render('Cell')}
                                  </td>
                                )
                              })}
                            </tr>
                            {row.isExpanded && (
                              <tr>
                                <td colSpan={visibleColumns.length}>
                                  {renderRowSubComponent(row)}
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <select
        className="mt-1 ml-5 lock w-fit px-2 py-2 font-sans rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[5, 10, 20].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <PaginationComp
        previousPage={previousPage}
        nextPage={nextPage}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        gotoPage={gotoPage}
      />

      <div className="py-3 flex items-center justify-between">
        {/* <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-6 items-baseline">
            <span className="text-lg text-gray-700 ml-6">
              Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full px-2 py-2 font-sans rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              buttonStyle={paginationFirstButtonStyle}
            >
              <span>First</span>
            </Button>

            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              buttonStyle={paginationPreviousButtonStyle}
            >
              <span>Previous</span>
            </Button>
            <Button
              buttonStyle={paginationNextButtonStyle}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <span>Next</span>
            </Button>
            <Button
              buttonStyle={paginationLastButtonStyle}
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span>Last</span>
            </Button>
          </div>
        </div> */}
      </div>
    </Fragment>
  )
}

TableContainer.propTypes = {
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  renderRowSubComponent: PropTypes.func,
}

export default TableContainer
