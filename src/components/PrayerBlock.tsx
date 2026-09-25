import { forwardRef, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type BlockState = 'idle' | 'past' | 'active' | 'ahead';

interface Props {
  state: BlockState;
  children: ReactNode;
}

const OPACITY: Record<BlockState, number> = { idle: 1, active: 1, past: 0.45, ahead: 0.8 };

/** A block on the prayer screen with the "you are here" bar down its left edge. */
export const Block = forwardRef<HTMLDivElement, Props>(function Block({ state, children }, ref) {
  return (
    <Box
      ref={ref}
      aria-current={state === 'active' ? 'step' : undefined}
      sx={{
        pl: 2,
        py: 1.25,
        borderLeft: '3px solid',
        borderColor: state === 'active' ? 'primary.main' : 'transparent',
        opacity: OPACITY[state],
        transition: 'opacity 200ms, border-color 200ms',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      {children}
    </Box>
  );
});

interface PrayerProps {
  title: string;
  text: string;
  cue: string;
  known: boolean;
  note?: string;
  /** Which bead this is said on. */
  where?: string;
  /** e.g. "4 of 10" */
  tally?: string;
  active: boolean;
  beads?: ReactNode;
}

export function Where({ children }: { children: string }) {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
      {children}
    </Typography>
  );
}

export function PrayerContent({ title, text, cue, known, note, where, tally, active, beads }: PrayerProps) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h3" component="h2" sx={{ color: active ? 'primary.main' : 'text.primary' }}>
          {title}
        </Typography>
        {tally && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            {tally}
          </Typography>
        )}
      </Box>
      {where && <Where>{where}</Where>}
      {note && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {note}
        </Typography>
      )}
      {beads}
      {known ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {cue}
        </Typography>
      ) : (
        <Typography sx={{ whiteSpace: 'pre-line', mt: 0.25 }}>{text}</Typography>
      )}
    </>
  );
}
