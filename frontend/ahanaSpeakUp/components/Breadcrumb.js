import Link from 'next/link'

export const Breadcrumb = ({ path, nameIndex }) => {
  var subject = ''
  if (nameIndex) {
    subject = path[nameIndex].name
  } else {
    subject = path[0].name
  }
  return (
    <div className="flex flex-col py-2 pl-2 bg-blue-400 bg-cover border-t-2">
      <ol className="text-5xl p-1 font-semibold text-white">{subject}</ol>
      <ol className="inline-flex items-start space-x-1 md:space-x-3 mt-1">
        {path.map((item, index) => (
          <div className="flex items-center" key={index}>
            <li className="inline-flex items-center">
              {index !== 0 && (
                <svg
                  className="w-3 h-3 text-gray-200 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}
              {index === path.length - 1 ? (
                <span className="ml-1 text-medium font-medium text-gray-100 dark:text-gray-400">
                  {item.name}
                </span>
              ) : (
                <Link href={item.link}>
                  <span className="cursor-pointer inline-flex items-center text-medium ml-1 font-medium text-gray-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    {item.name}
                  </span>
                </Link>
              )}
            </li>
          </div>
        ))}
      </ol>
    </div>
  )
}
