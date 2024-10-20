import { X } from 'lucide-react'

export const SnackBar = (
  backgroundColor,
  message,
  handleFunction,
  handleFunctionInput,
) => {
  console.log('sncak bar running')
  console.log('backgroundColor: ', backgroundColor)
  console.log('message: ', message)

  return (
    <div
      style={{
        backgroundColor: `${backgroundColor}`,
        color: 'white',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      {message}
      <button
        onClick={() => handleFunction(handleFunctionInput)}
        className="ml-2 text-white bg-transparent border-none align-middle cursor-pointer"
      >
        <X />
      </button>
    </div>
  )
}
