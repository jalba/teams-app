import { Link } from 'react-router';
import { Pencil } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const EditButton = ({ teamId }: { teamId: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Link to={`/teams/${teamId}`}>
          <TooltipTrigger>
            <Pencil size={18} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit team</p>
          </TooltipContent>
        </Link>
      </Tooltip>
    </TooltipProvider>
  );
};
