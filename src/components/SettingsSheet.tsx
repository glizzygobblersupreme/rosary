import { useId, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { LEARNABLE, PRAYERS } from '../data/prayers';
import type { Settings } from '../logic/settings';

interface Props {
  open: boolean;
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mt: 3 }}>
      <Typography variant="h3" component="h3">
        {title}
      </Typography>
      {hint && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
          {hint}
        </Typography>
      )}
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

function Toggle(props: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <Box
      component="label"
      htmlFor={id}
      sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.9, minHeight: 48, cursor: 'pointer' }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontSize: '1.05rem' }}>
          {props.label}
        </Typography>
        {props.hint && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
            {props.hint}
          </Typography>
        )}
      </Box>
      <Switch id={id} checked={props.checked} onChange={(e) => props.onChange(e.target.checked)} />
    </Box>
  );
}

export default function SettingsSheet({ open, settings: s, onChange, onClose }: Props) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...s, [key]: value });
  const textSizeId = useId();

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 620,
          width: '100%',
          mx: 'auto',
          px: 3,
          pt: 2.5,
          pb: 'max(env(safe-area-inset-bottom), 16px)',
          maxHeight: '88dvh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">Settings</Typography>
          <Button onClick={onClose}>Done</Button>
        </Box>

        <Section title="While praying">
          <Toggle
            label="Count beads on screen"
            hint="Tap anywhere to move bead by bead. Turn off if you only use your own beads."
            checked={s.counter}
            onChange={(v) => set('counter', v)}
          />
          <Toggle
            label="Vibrate on each bead"
            hint="Android only; iPhones do not allow it."
            checked={s.vibrate}
            onChange={(v) => set('vibrate', v)}
          />
          <Toggle
            label="Show a short meditation"
            hint="Under the scripture for each mystery."
            checked={s.meditation}
            onChange={(v) => set('meditation', v)}
          />
          <Toggle
            label="Show the beads at the top"
            hint="The part of the rosary for the current screen, with your bead lit. The notes on when to move along always show."
            checked={s.beadGuide}
            onChange={(v) => set('beadGuide', v)}
          />
          <Typography id={textSizeId} variant="body2" sx={{ fontSize: '1.05rem', mt: 1 }}>
            Text size
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              aria-labelledby={textSizeId}
              value={s.textScale}
              min={0.85}
              max={1.45}
              step={0.05}
              marks={[{ value: 1 }]}
              onChange={(_, v) => set('textScale', v as number)}
            />
          </Box>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={s.theme}
            onChange={(_, v: Settings['theme'] | null) => v && set('theme', v)}
            aria-label="Appearance"
            sx={{ mt: 1 }}
          >
            <ToggleButton value="dark" sx={{ textTransform: 'none' }}>
              Dark
            </ToggleButton>
            <ToggleButton value="light" sx={{ textTransform: 'none' }}>
              Light
            </ToggleButton>
          </ToggleButtonGroup>
        </Section>

        <Section
          title="Prayers I know by heart"
          hint="These shrink to their first words, so more of the decade fits on one screen."
        >
          {LEARNABLE.map((id) => (
            <Toggle
              key={id}
              label={PRAYERS[id].title}
              checked={s.known.includes(id)}
              onChange={(v) => set('known', v ? [...s.known, id] : s.known.filter((k) => k !== id))}
            />
          ))}
        </Section>

        <Section title="Optional prayers">
          <Toggle
            label="Fatima Prayer"
            hint="After the Glory Be of each decade."
            checked={s.fatima}
            onChange={(v) => set('fatima', v)}
          />
          <Toggle
            label="Hail, Holy Queen and concluding prayer"
            checked={s.salve}
            onChange={(v) => set('salve', v)}
          />
          <Toggle label="Litany of Loreto" checked={s.litany} onChange={(v) => set('litany', v)} />
          <Toggle
            label="For the Pope’s intentions"
            hint="Our Father, Hail Mary and Glory Be, as asked for the Rosary indulgence."
            checked={s.popeIntentions}
            onChange={(v) => set('popeIntentions', v)}
          />
          <Toggle label="Prayer to Saint Michael" checked={s.stMichael} onChange={(v) => set('stMichael', v)} />
          <Toggle label="Memorare" checked={s.memorare} onChange={(v) => set('memorare', v)} />
        </Section>

        <Section title="Which mysteries on which day">
          <Toggle
            label="Luminous Mysteries on Thursday"
            hint="Off gives the older weekly pattern of Joyful, Sorrowful and Glorious only."
            checked={s.luminous}
            onChange={(v) => set('luminous', v)}
          />
          <Toggle
            label="Follow the season on Sundays"
            hint="Joyful in Advent and Christmas, Sorrowful in Lent, Glorious otherwise."
            checked={s.seasonalSunday}
            onChange={(v) => set('seasonalSunday', v)}
          />
        </Section>
      </Box>
    </Drawer>
  );
}
