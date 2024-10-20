'use client'
import React, { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { normalizeLatexString } from '@/lib/utils'

export default function LatexPage() {
  const jsonObject = {
    testId: '',
    testQuestionId: '',
    correctAnswerExplanation:
      "Meticulous means showing great attention to detail, and it's the correct choice here. The passage describes Carson as observing subtle effects and uncovering patterns missed by others, which suggests a high level of detail and thoroughness in her observations.",
    choiceOneExplanation:
      "Answer choice A is incorrect because casual observation implies a lack of thoroughness or seriousness. Given that Carson's observations led her to write a groundbreaking book, her observations were unlikely to have been casual.",
    choiceTwoExplanation:
      'Answer choice B is the correct answer. Please look at explanation on the very top.',
    choiceThreeExplanation:
      'Answer choice C is incorrect because being indifferent means having a lack of interest or concern. This does not fit the context as Carson was deeply involved and concerned about the effects of pesticides on wildlife.',
    choiceFourExplanation:
      "Answer choice D is incorrect because sporadic implies occurrences at irregular intervals or only in a few places; scattered. Given that Carson's observations led to a groundbreaking book, it's unlikely that her observations were infrequent or irregular.",
    choiceFiveExplanation: '',
    choiceImages: [],
  }

  const jsonObject2 = {
    testId: '',
    testQuestionId: '',
    correctAnswerExplanation:
      "Imagine a classroom where students are working on various tasks. Each completed task earns points. Some tasks are simpler and earn 5 points each. 'Others are more involved and earn 15 points each. If a student completes a 5-point task, they earn 5 points. If they complete two of these tasks, they earn 10 points, and so on. We can represent the total points earned from the 5-point tasks as $\\text{5}$ $\\times$ $\\text{number of 5 point tasks}$ . In our equation, the number of 5-point tasks is represented by the variable $\\text{a}$ . Similarly, for the 15-point tasks, the total points earned can be represented as $\\text{15}$ $\\times$ $\\text{number of 15 point tasks}$. Here, the number of 15-point tasks is represented by the variable $\\text{b}$ . The total points for the project is 150. This total comes from a combination of the 5-point tasks and the 15-point tasks. So, the equation that sums up the total points from both types of tasks to equal 150 is: $\\text{5a + 15b = 150}$ . Now, let's examine why the other options are incorrect: ",
    choiceOneExplanation:
      'Answer choice A is the correct answer. Please look at explanation on the very top.',
    choiceTwoExplanation:
      'Answer choice B is incorrect because $\\text{15a + 5b = 150}$ suggests that the simpler tasks are worth 15 points and the more involved tasks are worth 5 points. However, this contradicts the information given.',
    choiceThreeExplanation:
      "Answer choice C is incorrect because $\\text{5a - 15b = 150}$ suggests that completing a 15-point task actually takes away, or subtracts, 15 points from the total. This doesn't make logical sense because completing a task should add points, not subtract them.",
    choiceFourExplanation:
      'Answer choice D is incorrect because $\\text{5a + b = 150}$  suggests that each of the more involved tasks is worth only 1 point, which is inconsistent with the given information that these tasks are worth 15 points each.',
    choiceFiveExplanation: '',
    choiceImages: [],
  }

  const explanationKeys = [
    'correctAnswerExplanation',
    'choiceOneExplanation',
    'choiceTwoExplanation',
    'choiceThreeExplanation',
    'choiceFourExplanation',
    'choiceFiveExplanation',
  ]

  function splitTextIntoLines(text, maxWordsPerLine = 80) {
    const words = text.split(' ')
    const lines = []
    let currentLine = []
    let wordCount = 0

    words.forEach((word, index) => {
      currentLine.push(word)
      // Check if the word is a LaTeX command (starts and ends with $)
      if (!word.startsWith('$') || !word.endsWith('$')) {
        wordCount++
      }

      // Check for end of sentence punctuation
      const punctuation = '.!?'
      const lastChar = word.slice(-1)
      const isEndOfSentence = punctuation.includes(lastChar)
      const isLastWord = index === words.length - 1

      // Split the line if word count reaches maxWordsPerLine and the word ends with punctuation, or it's the last word
      if ((wordCount >= maxWordsPerLine && isEndOfSentence) || isLastWord) {
        lines.push(currentLine.join(' '))
        currentLine = []
        wordCount = 0
      }
    })

    // Add the remaining words as the last line if there are any
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '))
    }

    return lines
  }

  function boldFirstPart(text) {
    // Bold the first 15 characters and leave the rest of the text as it is.
    const boldPart = `$\\textbf{${text.substring(0, 15)}}$`
    return boldPart + text.substring(15)
  }

  function processExplanation(jsonObject) {
    return explanationKeys.flatMap((key) => {
      const content = jsonObject[key]
      if (content) {
        // Apply bold formatting except for 'correctAnswerExplanation'
        const processedContent =
          key === 'correctAnswerExplanation' ? content : boldFirstPart(content)
        return splitTextIntoLines(processedContent)
      }
      return [] // Return an empty array for non-existent keys
    })
  }

  const [explanations, setExplanations] = useState([])

  useEffect(() => {
    const newExplanations = processExplanation(jsonObject2)
    setExplanations(newExplanations)
  }, [])

  return (
    <div className="container mx-auto p-4">
      {explanations.map((line, index) => (
        <p key={index} className="mb-4">
          <Latex>{normalizeLatexString(line)}</Latex>
        </p>
      ))}
    </div>
  )
}
