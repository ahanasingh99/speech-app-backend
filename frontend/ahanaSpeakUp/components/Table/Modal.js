import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import { Button } from '../Button'
import { QuestionContext } from '@/components/Question/QuestionContext'
import { Separator } from '@/components/ui/separator'
import { Question } from '@/components/Question/Question'
import { ScrollArea } from '@/components/ui/scroll-area'
import { convertNumberToLetterQuestion } from '@/lib/utils'
import { closeButtonStyle } from '@/app/config/constants'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
}

function Modal({ show, close, rowData }) {
  const [modalOpen, setModalOpen] = useState(show)
  const handleClose = () => close()

  console.log(rowData);
  return (
    <div>
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
      >
        <div className="flex justify-end mx-4 my-2">
          <Button buttonStyle={closeButtonStyle} onClick={handleClose}>
            Close
          </Button>
        </div>
        <Separator className="mt-4 h-[3px] bg-darkBlue" />
        <ScrollArea className="h-fit" maxHeight="max-h-[70vh]">
          <div className="flex mx-4 gap-4 min-h-[100%]">
            {rowData ? (
              <>
                <QuestionContext
                  className="basis-1/2 mt-4"
                  context={rowData.context}
                  images={rowData.images}
                />
                <Separator
                  className="h-auto w-[3px] bg-[#979797D1]"
                  orientation="vertical"
                />
                <Question
                  className="basis-1/2 mt-4"
                  question={rowData}
                  currQuestionIndex={rowData.number - 1}
                  questionNumber={rowData.number}
                  isTestReport={true}
                  answer={rowData.answer}
                  currAnswer={rowData.answer[0]}
                  studentAnswer={convertNumberToLetterQuestion(
                    rowData.studentAnswer
                  )}
                  isCorrect={rowData.isCorrect}
                  isForReview={true}
                  answerExplanation={rowData.testQuestionAnswerExplanation}
                />
              </>
            ) : (
              ''
            )}
          </div>
        </ScrollArea>
        <Separator className="mb-4 h-[3px] bg-darkBlue" />
      </ReactModal>
    </div>
  )
}

Modal.propTypes = {
  column: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  show: PropTypes.bool,
  close: PropTypes.func,
  rowData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default Modal
