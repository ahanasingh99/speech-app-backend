import _ from 'lodash'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function convertNumberToLetterQuestion(answer) {
  if (answer === undefined || answer === null || answer === '') {
    return 'Omitted';
  } else if (answer === 0) {
    return 'A';
  } else if (answer === 1) {
    return 'B';
  } else if (answer === 2) {
    return 'C';
  } else if (answer === 3) {
    return 'D';
  }
  return answer;
}


export function studentAnserconvertLetterToNumber(answer) {
  if (answer === 'A') {
    return 0
  } else if (answer === 'B') {
    return 1
  } else if (answer === 'C') {
    return 2
  } else if (answer === 'D') {
    return 3
  }
  return answer
}

export function answerConvertNumberToLetterQuestion(answer) {
  if (answer === 0) {
    return 'A'
  } else if (answer === 1) {
    return 'B'
  } else if (answer === 2) {
    return 'C'
  } else if (answer === 3) {
    return 'D'
  }
  return answer
}

export const answerBannerMsg = (isCorrect, answer) => {
  if (
    isCorrect === 'Omitted' ||
    isCorrect === undefined ||
    isCorrect === null ||
    answer === undefined ||
    answer === null ||
    (typeof answer === 'string' && answer.trim() === '') ||
    (Array.isArray(answer) && answer.length === 0) // checks if answer is an empty array
  ) {
    return `Omitted response. The correct answer is option ${answer}.`;
  }
  if (isCorrect) {
    return `Correct response. The answer is option ${answer}.`;
  }
  if (!isCorrect) {
    return `Incorrect response. The correct answer is option ${answer}.`;
  }
}


export const frqAnswerBannerMsg = (isCorrect, answer) => {
  console.log("FRQ Answer Banner - Before conversion");
  console.log("isCorrect:", isCorrect);
  console.log("answer:", answer);

  // Reverse the conversion if the answer is 'A', 'B', 'C', or 'D'
  if (answer === 'A') {
    answer = 0;
  } else if (answer === 'B') {
    answer = 1;
  } else if (answer === 'C') {
    answer = 2;
  } else if (answer === 'D') {
    answer = 3;
  }

  console.log("FRQ Answer Banner - After conversion");
  console.log("isCorrect:", isCorrect);
  console.log("answer:", answer);

  // Check if answer is a number and within range 0-3
  if (typeof answer === 'number' && answer >= 0 && answer < 4) {
    console.log("Checking for converted answers");

    if (typeof isCorrect === 'string' && isCorrect === 'Omitted') {
      console.log("Condition met for Omitted response");
      return `Omitted response. The correct answer is ${answer}.`;
    }
    
    if (isCorrect) {
      console.log("Condition met for Correct response");
      return `Correct response. The answer is ${answer}.`;
    }
    if (!isCorrect) {
      console.log("Condition met for Incorrect response");
      return `Incorrect response. The correct answer is ${answer}.`;
    }

    if (isCorrect === null || isCorrect === undefined) {
      console.log("Condition met for Omitted response due to null isCorrect");
      return `Omitted response. The correct answer is ${answer}.`;
    }
  } else {
    // Normal path for other checks
    console.log("Checking for other conditions");
    if (
      isCorrect === 'Omitted' ||
      isCorrect === undefined ||
      isCorrect === null ||
      answer === undefined ||
      answer === null ||
      (typeof answer === 'string' && answer.trim() === '') ||
      (Array.isArray(answer) && answer.length === 0) // checks if answer is an empty array
    ) {
      console.log("Condition met for Omitted response");
      return `Omitted response. The correct answer is ${answer}.`;
    }
    if (isCorrect) {
      console.log("Condition met for Correct response");
      return `Correct response. The answer is ${answer}.`;
    }
    if (!isCorrect) {
      console.log("Condition met for Incorrect response");
      return `Incorrect response. The correct answer is ${answer}.`;
    }
  }
};


export const answerStyle = (isCorrect, answer) => {
  if (
    isCorrect === 'Omitted' ||
    isCorrect === undefined ||
    isCorrect === null ||
    answer === undefined ||
    answer === null ||
    (typeof answer === 'string' && answer.trim() === '') ||
    (Array.isArray(answer) && answer.length === 0) // checks if answer is an empty array
  ) {
    return `p-4 bg-yellow-400 mb-8 mt-8`;
  }
  if (isCorrect) {
    return `p-4 bg-green-400 mb-8 mt-8`;
  }
  if (!isCorrect) {
    return `p-4 bg-red-400 mb-8 mt-8`;
  }
};


/**
 * Checks if the LaTeX string has extra backslashes and normalizes it.
 * 
 * @param {string} latexString - The LaTeX string to check and normalize.
 * @returns {string} - The normalized LaTeX string.
 */
export const normalizeLatexString = (latexString) => {
  // Regular expression to check for double backslashes
  const doubleBackslashPattern = /\\\\/;

  // If the pattern is found, replace double backslashes with single backslashes
  if (doubleBackslashPattern.test(latexString)) {
    return latexString.replace(/\\\\/g, '\\');
  }

  // If no double backslashes are found, return the string unchanged
  return latexString;
}

export const eliminationStateObj = [
  { id: 0, A: true, B: true, C: true, D: true },
]
