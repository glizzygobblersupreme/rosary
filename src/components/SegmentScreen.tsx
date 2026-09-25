import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TuneIcon from '@mui/icons-material/Tune';
import UndoIcon from '@mui/icons-material/Undo';
import { PRAYERS } from '../data/prayers';
import { placeFor, placesForSegment, stripFor } from '../logic/beads';
import { locate, stepCount, type Segment } from '../logic/sequence';
import type { Settings } from '../logic/settings';
import BeadRow from './BeadRow';
import { Block, PrayerContent, Where, type BlockState } from './PrayerBlock';
import RosaryStrip from './RosaryStrip';

interface Props {
  setAdjective: string;
  segments: Segment[];
  seg: number;
  step: number;
  settings: Settings;
  onAdvance: () => void;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
}

const SWIPE_MIN = 70;

export default function SegmentScreen(props: Props) {
  const { segments, seg, step, settings, setAdjective } = props;
  const segment = segments[seg];
  const { itemIndex, within } = locate(segment, step);
  const counting = settings.counter;
  // Nothing is dimmed until the counter is actually in use on this screen, so
  // someone praying on real beads sees the whole decade at full strength.
  const tracking = counting && step > 0;

  const scroller = useRef<HTMLDivElement>(null);
  const activeBlock = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [seg]);

  useEffect(() => {
    if (!tracking) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeBlock.current?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    // keyed on step, not just the block, so a tap also brings you back after scrolling away to reread
  }, [step, itemIndex, tracking]);

  const blockState = (i: number): BlockState => {
    if (!counting) return 'idle';
    if (i === itemIndex) return 'active';
    if (!tracking) return 'idle';
    return i < itemIndex ? 'past' : 'ahead';
  };

  const next = segments[seg + 1];

  // Bead strip (optional; the move/stay notes on each prayer always show): with the counter on it follows the current prayer; with it off
  // it shows everything this screen covers, since there is no current prayer.
  const guide = settings.beadGuide;
  const decade = segment.kind === 'decade' ? seg : 0;
  const activeItem = segment.items[itemIndex];
  const nowPlace = placeFor(segment, decade, activeItem, activeItem.count > 1 ? within : null);
  const litBeads = counting ? nowPlace.ids : placesForSegment(segment, decade);
  const nowTitle = activeItem.kind === 'mystery' ? 'Announce the mystery' : PRAYERS[activeItem.prayerId!].title;

  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, pt: 'max(env(safe-area-inset-top), 6px)' }}
      >
        <IconButton aria-label="All parts of the Rosary" onClick={props.onOpenMap}>
          <FormatListBulletedIcon />
        </IconButton>
        <ButtonBase
          onClick={props.onOpenMap}
          aria-label={`${segment.label}, part ${seg + 1} of ${segments.length}. Show all parts`}
          sx={{ flex: 1, display: 'flex', gap: '5px', py: 2.2, borderRadius: 1 }}
        >
          {segments.map((s, i) => {
            const fill = i < seg ? 1 : i > seg ? 0 : counting ? step / stepCount(segment) : 0;
            return (
              <Box
                key={s.id}
                sx={{
                  // opening and closing are short; decades get the width
                  flex: s.kind === 'decade' ? 3 : 1,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'divider',
                  overflow: 'hidden',
                  outline: i === seg ? '1px solid' : 'none',
                  outlineColor: 'primary.main',
                  outlineOffset: 1,
                }}
              >
                <Box sx={{ width: `${fill * 100}%`, height: '100%', bgcolor: 'primary.main' }} />
              </Box>
            );
          })}
        </ButtonBase>
        <IconButton aria-label="Settings" onClick={props.onOpenSettings}>
          <TuneIcon />
        </IconButton>
      </Box>

      <Box
        ref={scroller}
        component="main"
        onClick={() => {
          if (swiped.current) {
            swiped.current = false;
            return;
          }
          if (counting) props.onAdvance();
        }}
        onTouchStart={(e) => {
          swiped.current = false;
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 2) return;
          swiped.current = true;
          if (dx < 0) props.onNext();
          else props.onPrev();
        }}
        sx={{
          flex: 1,
          overflowY: 'auto',
          pl: 1,
          pr: 3,
          pb: 3,
          cursor: counting ? 'pointer' : 'default',
          userSelect: 'none',
          touchAction: 'pan-y',
        }}
      >
        <Box sx={{ maxWidth: 620, mx: 'auto' }}>
          {guide && (
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                pl: 2,
                pt: 0.5,
                pb: 0.75,
                mb: 0.5,
                bgcolor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <RosaryStrip ids={stripFor(segment, decade)} active={litBeads} />
              <Typography variant="body2" sx={{ fontSize: '0.95rem', mt: 0.25 }}>
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 650 }}>
                  {counting ? nowTitle : segment.label}
                </Box>{' '}
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  {counting
                    ? nowPlace.name.toLowerCase() + (activeItem.count > 1 ? `, bead ${within + 1} of ${activeItem.count}` : '')
                    : 'the lit beads'}
                </Box>
              </Typography>
            </Box>
          )}

          {segment.kind !== 'decade' && (
            <Typography variant="h2" component="h1" sx={{ pl: 2, pt: 1, pb: 1 }}>
              {segment.label}
            </Typography>
          )}

          {segment.items.map((item, i) => {
            const state = blockState(i);
            const ref = i === itemIndex ? activeBlock : undefined;

            if (item.kind === 'mystery') {
              const m = segment.mystery!;
              return (
                <Block key={item.key} ref={ref} state={state}>
                  <Where>{placeFor(segment, decade, item, null).hint}</Where>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {segment.ordinal} {setAdjective} Mystery
                  </Typography>
                  <Typography variant="h2" component="h1" sx={{ mt: 0.25 }}>
                    {m.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', mt: 0.75 }}>
                    Fruit of the mystery: {m.fruit}
                  </Typography>
                  <Typography component="blockquote" sx={{ m: 0, mt: 1.5, fontStyle: 'italic' }}>
                    {m.scripture}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {m.citation}
                  </Typography>
                  {settings.meditation && (
                    <Typography variant="body2" sx={{ mt: 1.5, fontSize: '1.05rem' }}>
                      {m.meditation}
                    </Typography>
                  )}
                </Block>
              );
            }

            const prayer = PRAYERS[item.prayerId!];
            const many = item.count > 1;
            const current = state === 'active' ? within : state === 'past' ? item.count : -1;
            return (
              <Block key={item.key} ref={ref} state={state}>
                <PrayerContent
                  title={many && !counting ? `${prayer.title} × ${item.count}` : prayer.title}
                  text={prayer.text}
                  cue={prayer.cue}
                  known={settings.known.includes(prayer.id)}
                  note={item.note}
                  where={placeFor(segment, decade, item, null).hint}
                  active={state === 'active'}
                  tally={many && state === 'active' ? `${within + 1} of ${item.count}` : undefined}
                  beads={many && counting && !guide ? <BeadRow count={item.count} current={current} /> : undefined}
                />
              </Block>
            );
          })}
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 1.5,
          pt: 1,
          pb: 'max(env(safe-area-inset-bottom), 10px)',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton
          aria-label="Go back one step"
          onClick={props.onBack}
          disabled={seg === 0 && step === 0}
          sx={{ visibility: counting ? 'visible' : 'hidden' }}
        >
          <UndoIcon />
        </IconButton>
        <Button
          variant="outlined"
          size="large"
          onClick={props.onNext}
          endIcon={<ChevronRightIcon />}
          sx={{ minHeight: 52, px: 2.5 }}
        >
          {next ? next.label : 'Finish'}
        </Button>
      </Box>
    </Box>
  );
}
