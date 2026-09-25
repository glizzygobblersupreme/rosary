import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

interface Props {
  /** The stretch of rosary this screen covers, in the order it is prayed. */
  ids: string[];
  /** Beads or spaces being prayed now. */
  active: string[];
}

type State = 'done' | 'active' | 'ahead';

const kindOf = (id: string) =>
  id === 'crucifix' ? 'crucifix' : id.startsWith('medal') ? 'medal' : id.startsWith('gap') ? 'gap' : /^(p1|p3|l\d)$/.test(id) ? 'single' : 'small';

const SIZE = { small: 13, single: 19, medal: 23 };

/** Only the part of the rosary in use on this screen, laid out straight, with the current bead lit. */
export default function RosaryStrip({ ids, active }: Props) {
  const first = ids.findIndex((id) => active.includes(id));
  const stateOf = (id: string, i: number): State => (active.includes(id) ? 'active' : i < first ? 'done' : 'ahead');
  const alone = active.length === 1;

  return (
    <Box
      role="img"
      aria-label="The part of the rosary for this screen, with the current bead lit"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        height: 30,
        width: 'fit-content',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 6,
          right: 6,
          top: '50%',
          borderTop: '1.5px solid',
          borderColor: 'divider',
        },
      }}
    >
      {ids.map((id, i) => {
        const kind = kindOf(id);
        const state = stateOf(id, i);
        const lit = state !== 'ahead';

        if (kind === 'gap') {
          return (
            <Box
              key={id}
              sx={{
                position: 'relative',
                width: 26,
                height: state === 'active' ? 5 : 0,
                borderRadius: 3,
                bgcolor: 'primary.main',
              }}
            />
          );
        }

        if (kind === 'crucifix') {
          const colour = (t: { palette: { primary: { main: string }; text: { secondary: string } } }) =>
            state === 'active' ? t.palette.primary.main : state === 'done' ? alpha(t.palette.primary.main, 0.5) : t.palette.text.secondary;
          return (
            <Box key={id} sx={{ position: 'relative', width: 16, height: 26, flexShrink: 0 }}>
              <Box sx={(t) => ({ position: 'absolute', left: 6, top: 0, width: 4, height: 26, borderRadius: '1px', bgcolor: colour(t) })} />
              <Box sx={(t) => ({ position: 'absolute', left: 0, top: 7, width: 16, height: 4, borderRadius: '1px', bgcolor: colour(t) })} />
            </Box>
          );
        }

        const size = SIZE[kind];
        return (
          <Box
            key={id}
            sx={(t) => ({
              position: 'relative',
              flexShrink: 0,
              width: size,
              height: size,
              borderRadius: '50%',
              border: kind === 'medal' ? '2.5px double' : '1.5px solid',
              borderColor: lit ? 'primary.main' : 'text.secondary',
              bgcolor:
                state === 'active'
                  ? 'primary.main'
                  : state === 'done'
                    ? alpha(t.palette.primary.main, 0.4)
                    : 'background.default',
              transform: state === 'active' && alone ? 'scale(1.3)' : 'none',
              boxShadow: state === 'active' && alone ? `0 0 0 4px ${alpha(t.palette.primary.main, 0.22)}` : 'none',
              transition: 'transform 160ms ease-out, background-color 160ms, box-shadow 160ms',
              '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
            })}
          />
        );
      })}
    </Box>
  );
}
