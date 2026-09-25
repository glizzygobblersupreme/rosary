import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import TuneIcon from '@mui/icons-material/Tune';
import { SETS, type SetId } from '../data/mysteries';
import { daysForSet, type ScheduleOptions } from '../data/schedule';
import type { Progress } from '../logic/progress';
import type { Segment } from '../logic/sequence';
import SegmentList from './SegmentList';

interface Props {
  progress: Progress;
  todaysSet: SetId;
  segments: Segment[];
  schedule: ScheduleOptions;
  onPickSet: (set: SetId) => void;
  onStartAt: (seg: number) => void;
  onContinue: () => void;
  onOpenSettings: () => void;
  /** A newer build is downloaded and waiting. */
  updateReady: boolean;
  onUpdate: () => void;
}

const SET_ORDER: SetId[] = ['joyful', 'luminous', 'sorrowful', 'glorious'];

export default function Home({ progress, todaysSet, segments, schedule, updateReady, ...on }: Props) {
  const set = SETS[progress.setId];
  const midway = progress.started && !progress.done;
  const dateLine = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const days = daysForSet(progress.setId, schedule);
  const choices = SET_ORDER.filter((id) => schedule.luminous || id !== 'luminous' || progress.setId === 'luminous');

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        maxWidth: 620,
        mx: 'auto',
        px: 2,
        pt: 'max(env(safe-area-inset-top), 12px)',
        pb: 'max(env(safe-area-inset-bottom), 16px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={progress.setId}
          onChange={(_, v: SetId | null) => v && on.onPickSet(v)}
          aria-label="Mysteries to pray"
          sx={{ flex: 1, minWidth: 0 }}
        >
          {choices.map((id) => (
            <ToggleButton
              key={id}
              value={id}
              // sized by their words rather than equally: the names differ a lot in length
              sx={{ flex: '1 1 auto', textTransform: 'none', fontSize: '0.8rem', px: 0.75, whiteSpace: 'nowrap' }}
            >
              {SETS[id].adjective}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <IconButton aria-label="Settings" onClick={on.onOpenSettings} edge="end">
          <TuneIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" sx={{ pl: 1.5, mt: 1.5, color: 'text.secondary' }}>
        {dateLine}
      </Typography>

      <Typography variant="h1" sx={{ pl: 1.5, mt: 1.5, color: 'primary.main' }}>
        {set.name}
      </Typography>
      {days && (
        <Typography sx={{ pl: 1.5, mt: 1 }}>Prayed on {days}</Typography>
      )}
      <Typography variant="body2" sx={{ pl: 1.5, mt: 0.5, color: 'text.secondary' }}>
        {progress.done
          ? 'You have prayed today’s Rosary.'
          : progress.setId === todaysSet
            ? 'These are the mysteries for today.'
            : `Today’s are ${SETS[todaysSet].name.replace('The ', 'the ')}.`}
      </Typography>

      <Box sx={{ mt: 2.5, mb: 1 }}>
        <SegmentList segments={segments} current={midway ? progress.seg : undefined} onPick={on.onStartAt} />
      </Box>

      <Box sx={{ mt: 'auto', pt: 2, px: 1.5 }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disableElevation
          onClick={midway ? on.onContinue : () => on.onStartAt(0)}
          sx={{ minHeight: 60, fontSize: '1.2rem' }}
        >
          {midway ? `Continue at ${segments[progress.seg].label.toLowerCase()}` : progress.done ? 'Pray again' : 'Begin'}
        </Button>
        {updateReady && (
          <Button variant="text" size="small" fullWidth onClick={on.onUpdate} sx={{ mt: 1 }}>
            A new version is ready. Update
          </Button>
        )}
      </Box>
    </Box>
  );
}
