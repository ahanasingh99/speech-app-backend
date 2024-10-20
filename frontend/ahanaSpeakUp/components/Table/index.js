import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Modal from './Modal'
import TableContainer from './TableContainer'
import { SelectColumnFilter } from './filters'
import {
  convertNumberToLetterQuestion,
  answerConvertNumberToLetterQuestion,
} from '@/lib/utils'
import { Button } from '../Button'
import { inputButtonStyle } from '@/app/config/constants'

const RePortList = ({ testReportData, subjectName, subjectKey }) => {
  const [tableList, setTableList] = useState([])
  const [rowData, setRowData] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [show, setShow] = useState(false)

  const Toggle = (id) => {
    setSelectedId(id)
    setShow(!show)
  }

  const parseConceptNames = (conceptDocumentsList) => {
    if (
      !Array.isArray(conceptDocumentsList) ||
      conceptDocumentsList.length === 0
    ) {
      return []
    }

    return conceptDocumentsList.map((concept) => concept.conceptName)
  }

  useEffect(() => {
    if (!_.isUndefined(selectedId) && !_.isNil(tableList)) {
      const selectedRowData = tableList.filter((row) => row._id === selectedId)
      setRowData(selectedRowData[0])
    }
  }, [selectedId, tableList])

  useEffect(() => {
    const tableMappingObj = []

    if (
      !_.isUndefined(testReportData) &&
      !_.isUndefined(testReportData.questionTable)
    ) {
      const rptSections = _.pick(testReportData.questionTable, ['sections'])

      rptSections.sections.map((section) => {
        section.questions.map((question) => {
          const tableObject = {
            ...question,
            studentAnswer: convertNumberToLetterQuestion(
              question?.studentAnswer,
            ),
            answer:
              question.answer.length === 1
                ? answerConvertNumberToLetterQuestion(Number(question?.answer))
                : question.answer.join(', '),
            sectionTitle: section.sectionTitle,
            conceptNames: parseConceptNames(question.conceptDocumentsList),
          }

          tableMappingObj.push(tableObject)
        })
      })
      setTableList(tableMappingObj)
    }
  }, [testReportData])

  // Custom SelectColumnFilter that only includes "Yes", "No", and "All"
  const YesNoSelectColumnFilter = ({ column: { filterValue, setFilter } }) => {
    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        className="block w-full px-3 py-2 border border-gray-500 bg-white  shadow-lg focus:outline-none"
      >
        <option value="">All</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Question',
        accessor: 'mergedStudentQuestionNumber',
        disableFilters: true,
        style: 'px-2 py-2 whitespace-nowrap text-center',
      },
      {
        Header: 'Section',
        accessor: 'sectionTitle',
        Filter: SelectColumnFilter,
        filter: 'includes',
        style: 'px-4 py-2 whitespace-nowrap text-center max-w-fit',
      },
      {
        Header: 'Skill',
        accessor: 'skillDocByQuestion.skillName',
        Filter: SelectColumnFilter,
        Cell: ({ row }) => {
          if (_.isNil(row.original.skillDocByQuestion?.skillName)) {
            return 'Data not available'
          }
          return row.original.skillDocByQuestion?.skillName
        },
        style: 'px-4 py-2 whitespace-nowrap text-center max-w-fit',
      },
      {
        Header: 'Concept',
        accessor: 'conceptNames',
        Filter: SelectColumnFilter,
        Cell: ({ row }) => {
          return (
            <div>
              {row.original.conceptDocumentsList.map((concept, index) => {
                return (
                  <div key={index}>
                    <Link
                      key={index}
                      className="underline"
                      href={`/${subjectName}/concepts/${encodeURIComponent(
                        concept.conceptEncryptedId,
                      )}?key=${encodeURIComponent(
                        subjectKey,
                      )}&id=${encodeURIComponent(
                        subjectName,
                      )}&concept=${encodeURIComponent(
                        concept.conceptEncryptedId,
                      )}`}
                      target="_blank"
                    >
                      {concept.conceptName}
                    </Link>
                  </div>
                )
              })}
            </div>
          )
        },
        style: 'px-4 py-2 whitespace-wrap text-center w-[400px]',
      },
      {
        Header: 'Difficulty level',
        accessor: 'difficultyLevel',
        Filter: SelectColumnFilter,
        filter: 'includes',
        style: 'px-4 py-2 whitespace-nowrap text-center max-w-fit',
      },
      {
        Header: 'Student answer',
        accessor: 'studentAnswer',
        disableFilters: true,
        style: 'px-4 py-2 whitespace-nowrap text-center w-fit',
        Cell: ({ row }) => {
          return row.original.isMultipleChoice
            ? row.values.studentAnswer
            : 'See Review'
        },
      },
      {
        Header: 'Correct answer',
        accessor: 'answer',
        disableFilters: true,
        style: 'px-4 py-2 whitespace-nowrap text-center w-fit ',
        Cell: ({ row }) => {
          return row.original.isMultipleChoice
            ? row.values.answer
            : 'See Review'
        },
      },
      {
        Header: 'Is Correct',
        accessor: 'isCorrect', // Accessor for "Is Correct" column
        Filter: YesNoSelectColumnFilter, // Custom filter with "Yes", "No", and "All"
        filter: (rows, id, filterValue) => {
          if (filterValue === '') return rows; // Show all rows if 'All' is selected
          
          return rows.filter((row) => {
            const { answer, studentAnswer } = row.original;
        
            const answerString = String(answer); // Convert answer to string
        
            console.log("Filter Debug - Answer:", answerString, "Student Answer:", studentAnswer);
        
            let isCorrect;
            
            if (typeof answerString === 'string') {
              const answerToArray = answerString.split(',');
              const foundAnswer = answerToArray.includes(studentAnswer);
              isCorrect = foundAnswer ? 'Yes' : 'No';
              console.log("Filter Debug - Is Correct (String):", isCorrect);
            } else if (Array.isArray(answer)) {
              const foundAnswer = answer.includes(studentAnswer);
              isCorrect = foundAnswer ? 'Yes' : 'No';
              console.log("Filter Debug - Is Correct (Array):", isCorrect);
            } else {
              isCorrect = 'Data not available'; // Handle other types if necessary
              console.log("Filter Debug - Is Correct (Other):", isCorrect);
            }
        
            console.log("Filter Debug - Final Is Correct:", isCorrect, "Filter Value:", filterValue);
        
            return isCorrect === filterValue;
          });
        },
        style: 'px-4 py-2 whitespace-nowrap text-center w-fit',
        Cell: ({ row }) => {
          const { answer, studentAnswer } = row.original;
        
          const answerString = String(answer); // Convert answer to string
        
          if (typeof answerString === 'string') {
            const answerToArray = answerString.split(',');
            const foundAnswer = answerToArray.includes(studentAnswer);
            return foundAnswer ? 'Yes' : 'No';
          } else if (Array.isArray(answer)) {
            console.log('Answer is an array:', answer);
            // If answer is already an array
            const foundAnswer = answer.includes(studentAnswer);
            return foundAnswer ? 'Yes' : 'No';
          } else {
            // Handle other types if necessary
            return 'Data not available';
          }
        },
      },
      // {
      //   Header: 'Total % Correct answer',
      //   accessor: 'correctQuestionPercentageByAllStudents',
      //   disableFilters: true,
      //   style: 'px-4 py-2 whitespace-nowrap text-center w-fit',
      // },
      {
        Header: 'Review',
        Cell: ({ row }) => {
          return (
            <div>
              <Button
                className={inputButtonStyle}
                onClick={() => Toggle(row.original._id)}
              >
                Review
              </Button>
            </div>
          )
        },
        style: 'px-4 py-2 whitespace-nowrap text-center w-fit',
      },
    ],
    [],
  )

  return (
    <div className="w-fit m-auto">
      <div style={{ marginTop: 100 }}>
        <TableContainer columns={columns} data={tableList} />
      </div>
      <div>
        {show && <Modal show={show} close={Toggle} rowData={rowData} />}
      </div>
    </div>
  )
}

RePortList.propTypes = {
  testReportData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default RePortList
