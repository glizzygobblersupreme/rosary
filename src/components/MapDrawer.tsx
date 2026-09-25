import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import type { Segment } from '../logic/sequence';
import SegmentList from './SegmentList';

interface Props {
  open: boolean;
  title: string;
  segments: Segment[];
  current: number;
  onClose: () => void;
  onPick: (seg: number) => void;
  onHome: () => void;
}

export default function MapDrawer({ open, title, segments, current, onClose, onPick, onHome }: Props) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 620,
          width: '100%',
          mx: 'auto',
          px: 1.5,
          pt: 2.5,
          pb: 'max(env(safe-area-inset-bottom), 16px)',
          maxHeight: '88dvh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h3" component="h2" sx={{ px: 1.5, mb: 1 }}>
          {title}
        </Typography>
        <SegmentList segments={segments} current={current} onPick={onPick} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, px: 1.5 }}>
          <Button variant="outlined" onClick={onHome} sx={{ flex: 1 }}>
            Pause and go to start screen
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
