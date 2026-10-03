import { StatusBar } from 'expo-status-bar';
import type { OrbState, OrbTheme } from 'expo-orbs';
import { ORB_LABELS, ORB_STATES, ThinkingOrb, useThinkingOrbs } from 'expo-orbs';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const VERBS: Record<OrbState, string> = {
  working: 'particles on tilted orbits',
  searching: 'a scan meridian sweeps a globe',
  solving: 'bands scramble, then click back',
  listening: 'a waveform rolls through rings',
  connecting: 'a constellation wires itself',
  weaving: 'three strands plait the sphere',
  composing: 'an undulating multi-band sash',
  breathing: 'a face-on ring slowly morphing',
  shaping: 'circle → triangle → square',
};

const THEMES: OrbTheme[] = ['auto', 'dark', 'light'];
const SPEEDS = [0.5, 1, 2];

type Palette = ReturnType<typeof palette>;
function palette(dark: boolean) {
  return dark
    ? { bg: '#0B0B0C', card: '#141416', line: '#242428', text: '#EDEDEB', muted: '#86868B', chip: '#1D1D20', chipOn: '#EDEDEB', chipOnText: '#0B0B0C' }
    : { bg: '#F5F5F2', card: '#FFFFFF', line: '#E3E3DE', text: '#111111', muted: '#6E6E6A', chip: '#EDEDE8', chipOn: '#111111', chipOnText: '#F5F5F2' };
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Showcase />
    </SafeAreaProvider>
  );
}

function Showcase() {
  const insets = useSafeAreaInsets();
  const { isDark, theme, setTheme, paused, togglePaused, speed, setSpeed, reduceMotion } =
    useThinkingOrbs();
  const c = palette(isDark);
  const [hero, setHero] = useState<OrbState>('searching');

  return (
    <View style={[styles.fill, { backgroundColor: c.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={[
          styles.page,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 },
        ]}>
        {/* header */}
        <View style={styles.row}>
          <ThinkingOrb state="working" size={20} />
          <Text style={[styles.mono, { color: c.muted }]}>expo-orbs</Text>
        </View>
        <Text style={[styles.title, { color: c.text }]}>Thinking orbs</Text>
        <Text style={[styles.lede, { color: c.muted }]}>
          Nine dotted states for AI & agent UIs. Skia on iOS & Android, a plain canvas on web,
          Jotai atoms underneath. Runs in Expo Go.
        </Text>

        {/* hero */}
        <Card c={c}>
          <View style={styles.hero}>
            <ThinkingOrb state={hero} size={112} />
            <Text style={[styles.heroLabel, { color: c.text }]}>{ORB_LABELS[hero]}</Text>
            <Text style={[styles.small, { color: c.muted }]}>{VERBS[hero]}</Text>
          </View>
          <View style={styles.chips}>
            {ORB_STATES.map((s) => (
              <Chip key={s} c={c} on={s === hero} onPress={() => setHero(s)}>
                {s}
              </Chip>
            ))}
          </View>
        </Card>

        {/* global controls = atoms */}
        <Section c={c} title="Global controls" hint="useThinkingOrbs() → Jotai atoms">
          <Control c={c} label="Theme">
            {THEMES.map((t) => (
              <Chip key={t} c={c} on={t === theme} onPress={() => setTheme(t)}>
                {t}
              </Chip>
            ))}
          </Control>
          <Control c={c} label="Motion">
            <Chip c={c} on={paused} onPress={togglePaused}>
              {paused ? 'paused' : 'playing'}
            </Chip>
            {reduceMotion ? (
              <Text style={[styles.small, { color: c.muted }]}>reduce motion is on</Text>
            ) : null}
          </Control>
          <Control c={c} label="Speed">
            {SPEEDS.map((s) => (
              <Chip key={s} c={c} on={s === speed} onPress={() => setSpeed(s)}>
                {`${s}×`}
              </Chip>
            ))}
          </Control>
        </Section>

        {/* every state at both tuned sizes */}
        <Section c={c} title="All states" hint="size 64 · size 20">
          <View style={styles.grid}>
            {ORB_STATES.map((s) => (
              <View key={s} style={[styles.cell, { borderColor: c.line }]}>
                <View style={styles.cellOrbs}>
                  <ThinkingOrb state={s} size={64} />
                  <ThinkingOrb state={s} size={20} />
                </View>
                <Text style={[styles.mono, { color: c.text }]}>{s}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* in context */}
        <Section c={c} title="In a chat" hint="inline at size 20">
          <View style={[styles.bubble, { backgroundColor: c.chip }]}>
            <Text style={[styles.body, { color: c.text }]}>
              Can you check why the build is failing on Android?
            </Text>
          </View>
          <View style={styles.agentRow}>
            <ThinkingOrb state="searching" size={20} />
            <Text style={[styles.body, { color: c.muted }]}>Searching the repository…</Text>
          </View>
          <View style={styles.agentRow}>
            <ThinkingOrb state="solving" size={20} />
            <Text style={[styles.body, { color: c.muted }]}>Solving a dependency conflict…</Text>
          </View>
          <View style={styles.agentRow}>
            <ThinkingOrb state="composing" size={20} />
            <Text style={[styles.body, { color: c.text }]}>Composing a reply…</Text>
          </View>
        </Section>

        <Text style={[styles.footer, { color: c.muted }]}>
          {Platform.OS} · based on thinking-orbs by Jakub Antalik · MIT
        </Text>
      </ScrollView>
    </View>
  );
}

function Card({ c, children }: { c: Palette; children: ReactNode }) {
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.line }]}>{children}</View>
  );
}

function Section({
  c,
  title,
  hint,
  children,
}: {
  c: Palette;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <Card c={c}>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
        <Text style={[styles.mono, { color: c.muted }]}>{hint}</Text>
      </View>
      {children}
    </Card>
  );
}

function Control({ c, label, children }: { c: Palette; label: string; children: ReactNode }) {
  return (
    <View style={styles.control}>
      <Text style={[styles.controlLabel, { color: c.muted }]}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function Chip({
  c,
  on,
  onPress,
  children,
}: {
  c: Palette;
  on: boolean;
  onPress: () => void;
  children: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: on ? c.chipOn : c.chip, opacity: pressed ? 0.7 : 1 },
      ]}>
      <Text style={[styles.chipText, { color: on ? c.chipOnText : c.text }]}>{children}</Text>
    </Pressable>
  );
}

const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'ui-monospace, monospace' });

const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { paddingHorizontal: 16, gap: 16, maxWidth: 720, width: '100%', alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mono: { fontFamily: mono, fontSize: 12 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, marginTop: 4 },
  lede: { fontSize: 15, lineHeight: 22 },
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 14 },
  hero: { alignItems: 'center', paddingVertical: 12, gap: 6 },
  heroLabel: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  small: { fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: '500' },
  sectionHead: { gap: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  control: { gap: 8 },
  controlLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 96,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  cellOrbs: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubble: { alignSelf: 'flex-end', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '85%' },
  body: { fontSize: 15, lineHeight: 21 },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});
