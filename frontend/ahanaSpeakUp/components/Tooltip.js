import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from './ui/button'
import { ChevronDown } from 'lucide-react'

export const Tooltip = ({ triggerText, children }) => {
  return (
    <TooltipProvider delayDuration={75}>
      <TooltipComponent>
        <TooltipTrigger asChild>
          <Button className="text-base" variant="link" size="sm">
            {triggerText}
            <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="max-w-xl p-4 max-h-[37.5rem] overflow-y-auto"
          side="bottom"
        >
          {children}
        </TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  )
}
