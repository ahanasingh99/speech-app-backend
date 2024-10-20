import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { tableDropdownStyle } from '@/app/config/constants'

export const Filter = ({ column }) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render('Filter')}
    </div>
  )
}

export const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`search (${length}) ...`}
    />
  )
}

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const [conceptList, setConceptList] = useState([])

  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  useEffect(() => {
    const conceptNameList = []
    if (
      !_.isUndefined(options) &&
      !_.isEmpty(options) &&
      id === 'conceptName'
    ) {
      options.map((name) => {
        if (name.indexOf(',') !== -1) {
          name
            .split(',')
            .map((namecomma) => conceptNameList.push(namecomma.trim()))
        } else {
          conceptNameList.push(name)
        }

        return name
      })
      setConceptList(conceptNameList)
    }
  }, [id, options])

  return (
    <select
      value={filterValue || 'All'}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
      className={tableDropdownStyle}
    >
      <option value="">
        <span className="text-white">All</span>
      </option>
      {_.uniq(
        _.flatten(id === 'conceptName' ? conceptList.sort() : options.sort()),
      ).map((option) => {
        if (!_.isUndefined(option) && !_.isEmpty(option)) {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          )
        }
        return option
      })}
    </select>
  )
}

Filter.propTypes = {
  column: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}
