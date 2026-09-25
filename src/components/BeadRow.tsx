import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

interface Props {
  count: number;
  /** Index of the bead being prayed, -1 if none yet, `count` if all are done. */
  current: number;
}

/** Beads on a cord. The one being prayed is larger and lit in the set's colour. */
export default function BeadRow({ count, current }: Props) {
  return (
    <Box
      role="img"
      aria-label={
        current < 0 ? `${count} beads` : current >= count ? `${count} of ${count} done` : `Bead ${current + 1} of ${count}`
      }
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: count * 34,
        height: 28,
        my: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 4,
          right: 4,
          top: '50%',
          borderTop: '1.5px solid',
          borderColor: 'divider',
        },
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Box
            key={i}
            sx={(t) => ({
              position: 'relative',
              width: 15,
              height: 15,
              borderRadius: '50%',
              border: '1.5px solid',
              borderColor: done || active ? 'primary.main' : 'text.secondary',
              bgcolor: active
                ? 'primary.main'
                : done
                  ? alpha(t.palette.primary.main, 0.4)
                  : 'background.default',
              transform: active ? 'scale(1.45)' : 'none',
              boxShadow: active ? `0 0 0 5px ${alpha(t.palette.primary.main, 0.22)}` : 'none',
              transition: 'transform 160ms ease-out, background-color 160ms, box-shadow 160ms',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            })}
          />
        );
      })}
    </Box>
  );
}
