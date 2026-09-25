import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import type { Segment } from '../logic/sequence';

interface Props {
  segments: Segment[];
  /** Segment to mark as the current place, if any. */
  current?: number;
  onPick: (index: number) => void;
}

/** The whole Rosary as seven rows. Tapping one starts from there. */
export default function SegmentList({ segments, current, onPick }: Props) {
  return (
    <List disablePadding aria-label="Parts of the Rosary">
      {segments.map((s, i) => {
        const here = i === current;
        return (
          <ListItemButton
            key={s.id}
            onClick={() => onPick(i)}
            aria-current={here ? 'step' : undefined}
            sx={{
              px: 1.5,
              py: 1.1,
              gap: 1.5,
              alignItems: 'baseline',
              borderRadius: 1,
              borderLeft: '3px solid',
              borderColor: here ? 'primary.main' : 'transparent',
            }}
          >
            <Typography
              component="span"
              sx={{ width: '1.1em', textAlign: 'center', color: here ? 'primary.main' : 'text.secondary', fontWeight: 600 }}
            >
              {s.kind === 'decade' ? i : '·'}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography component="span" sx={{ display: 'block', lineHeight: 1.3 }}>
                {s.kind === 'decade' ? s.detail : s.label}
              </Typography>
              <Typography component="span" variant="body2" sx={{ display: 'block', color: 'text.secondary' }}>
                {s.kind === 'decade' ? s.mystery!.fruit : s.detail}
              </Typography>
              {here && (
                <Typography component="span" variant="body2" sx={{ display: 'block', color: 'primary.main' }}>
                  You are here
                </Typography>
              )}
            </Box>
          </ListItemButton>
        );
      })}
    </List>
  );
}
