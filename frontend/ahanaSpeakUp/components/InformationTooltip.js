import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from './ui/button'
import { HelpCircle } from 'lucide-react'

export const InformationTooltip = ({ triggerText, children }) => {
  return (
    <TooltipProvider delayDuration={75}>
      <TooltipComponent>
        <TooltipTrigger asChild>
          <Button className="text-base" variant="link" size="sm">
            {triggerText}
            <HelpCircle className="h-4 w-4 opacity-70 text-white" />
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
