import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { fetchApod } from '@/services/nasa';
import { getDeviceLabel, getLocationLabel } from '@/services/device';
import { ApodResponse, HistoryEntry } from '@/types/apod';
import { getColors, Spacing, BorderRadius, FontSize, AppColors } from '@/constants/theme';
import { t, Language } from '@/constants/i18n';

import TabBar from '@/components/TabBar';
import DatePicker, { formatDate, todayStr } from '@/components/DatePicker';
import ImageViewer from '@/components/ImageViewer';
import HistoryModal from '@/components/HistoryModal';

const { width: SCREEN_W } = Dimensions.get('window');
const IMG_W = SCREEN_W - Spacing.lg * 2;
const HISTORY_KEY = '@nasa_skyalert_history';
const MAX_HISTORY = 25;

type Tab = 'home' | 'profile';

function ApodTab({
  colors,
  language,
  onImageTap,
  onNewEntry,
}: {
  colors: AppColors;
  language: Language;
  onImageTap: (uri: string, ratio: number) => void;
  onNewEntry: (apod: ApodResponse) => void;
}) {
  const str = t(language).home;
  const [date, setDate] = useState(todayStr());
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratio, setRatio] = useState(16 / 9);

  const load = useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    setApod(null);

    try {
      const data = await fetchApod(d === todayStr() ? undefined : d);
      setApod(data);
      onNewEntry(data);

      if (data.media_type === 'image' && data.url) {
        Image.getSize(data.url, (w, h) => { if (w && h) setRatio(w / h); }, () => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : str.errorTitle);
    } finally {
      setLoading(false);
    }
  }, [str.errorTitle, onNewEntry]);

  useEffect(() => { load(date); }, []);

  const changeDate = (d: string) => {
    setDate(d);
    load(d);
  };

  return (
    <>
      <DatePicker
        value={date}
        onChange={changeDate}
        colors={colors}
        language={language}
        todayLabel={str.today}
      />

      <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {loading && (
          <View style={s.center}>
            <ActivityIndicator size="large" color={colors.text} />
            <Text style={[s.centerText, { color: colors.textSecondary }]}>{str.loading}</Text>
          </View>
        )}

        {error && !loading && (
          <View style={s.center}>
            <Text style={[s.errorTitle, { color: colors.text }]}>{str.errorTitle}</Text>
            <Text style={[s.centerText, { color: colors.textSecondary }]}>{error}</Text>
            <TouchableOpacity
              style={[s.retryBtn, { backgroundColor: colors.primary }]}
              onPress={() => load(date)}
              activeOpacity={0.7}
            >
              <Text style={[s.retryLabel, { color: colors.primaryText }]}>{str.retry}</Text>
            </TouchableOpacity>
          </View>
        )}

        {apod && !loading && (
          <Animated.View entering={FadeIn.duration(350)}>
            {apod.media_type === 'image' ? (
              <TouchableOpacity onPress={() => onImageTap(apod.url, ratio)} activeOpacity={0.9}>
                <Image source={{ uri: apod.url }} style={[s.img, { height: IMG_W / ratio }]} resizeMode="cover" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.videoWrap} onPress={() => Linking.openURL(apod.url)} activeOpacity={0.8}>
                {apod.thumbnail_url ? (
                  <Image source={{ uri: apod.thumbnail_url }} style={[s.img, { height: IMG_W / (16 / 9) }]} resizeMode="cover" />
                ) : (
                  <View style={[s.videoFallback, { height: IMG_W / (16 / 9), backgroundColor: colors.surface }]}>
                    <Ionicons name="play-circle-outline" size={48} color={colors.textSecondary} />
                  </View>
                )}
                <View style={s.playOverlay}>
                  <View style={[s.playBtn, { backgroundColor: colors.overlay }]}>
                    <Ionicons name="play" size={24} color="#FFF" style={{ marginLeft: 2 }} />
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <View style={s.info}>
              <Text style={[s.title, { color: colors.text }]}>{apod.title}</Text>
              <View style={s.meta}>
                <Text style={[s.metaText, { color: colors.textSecondary }]}>{formatDate(apod.date, language)}</Text>
                {apod.copyright && (
                  <Text style={[s.copyright, { color: colors.textTertiary }]}>{apod.copyright.trim()}</Text>
                )}
              </View>
              <View style={[s.divider, { backgroundColor: colors.separator }]} />
              <Text style={[s.explanation, { color: colors.text }]}>{apod.explanation}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </>
  );
}

function ProfileTab({ colors, language }: { colors: AppColors; language: Language }) {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode, setLanguage } = usePreferences();
  const str = t(language).profile;

  return (
    <ScrollView style={s.flex} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={s.avatarWrap}>
        <View style={[s.avatar, { backgroundColor: colors.surface }]}>
          <Text style={[s.avatarLetter, { color: colors.text }]}>U</Text>
        </View>
      </View>

      <View style={s.info}>
        <Text style={[s.title, { color: colors.text }]}>{str.userName}</Text>
        <View style={s.meta}>
          <Text style={[s.metaText, { color: colors.textSecondary }]}>usuario@nasa.com</Text>
        </View>

        <View style={[s.divider, { backgroundColor: colors.separator }]} />

        <View style={s.settingRow}>
          <View style={s.settingLeft}>
            <Ionicons name="moon-outline" size={18} color={colors.textSecondary} />
            <Text style={[s.settingLabel, { color: colors.text }]}>{str.darkMode}</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: '#34C759' }}
            thumbColor="#FFF"
          />
        </View>

        <View style={[s.divider, { backgroundColor: colors.separator }]} />

        <View style={s.settingRow}>
          <View style={s.settingLeft}>
            <Ionicons name="language-outline" size={18} color={colors.textSecondary} />
            <Text style={[s.settingLabel, { color: colors.text }]}>{str.language}</Text>
          </View>
          <View style={[s.langPicker, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {(['es', 'en'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[s.langBtn, language === lang && [s.langBtnActive, { backgroundColor: colors.text }]]}
                onPress={() => setLanguage(lang)}
                activeOpacity={0.7}
              >
                <Text style={[s.langBtnLabel, { color: language === lang ? colors.primaryText : colors.textSecondary }]}>
                  {lang === 'es' ? str.spanish : str.english}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[s.divider, { backgroundColor: colors.separator }]} />

        <TouchableOpacity style={s.settingRow} onPress={logout} activeOpacity={0.5}>
          <View style={s.settingLeft}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={[s.settingLabel, { color: colors.error }]}>{str.logout}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <Text style={[s.version, { color: colors.textTertiary }]}>NASA SkyAlert {str.version}</Text>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { isDarkMode, language } = usePreferences();
  const colors = getColors(isDarkMode);
  const insets = useSafeAreaInsets();
  const homeStr = t(language).home;
  const profileStr = t(language).profile;
  const historyStr = t(language).history;

  const [tab, setTab] = useState<Tab>('home');
  const [viewer, setViewer] = useState<{ uri: string; ratio: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const device = useRef(getDeviceLabel());

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((raw) => { if (raw) setHistory(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  const persist = useCallback(async (list: HistoryEntry[]) => {
    try { await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch {}
  }, []);

  const addEntry = useCallback(async (apod: ApodResponse) => {
    const location = await getLocationLabel();
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      apod: { title: apod.title, date: apod.date, media_type: apod.media_type, url: apod.url },
      consultedAt: new Date().toISOString(),
      device: device.current,
      location,
    };

    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      persist(next);
      return next;
    });
  }, [persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(HISTORY_KEY).catch(() => {});
  }, []);

  return (
    <View style={[s.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={s.header}>
        <View>
          <Text style={[s.headerTitle, { color: colors.text }]}>
            {tab === 'home' ? homeStr.title : profileStr.title}
          </Text>
          <Text style={[s.headerSub, { color: colors.textSecondary }]}>
            {tab === 'home' ? homeStr.subtitle : profileStr.subtitle}
          </Text>
        </View>
        {tab === 'home' && (
          <TouchableOpacity onPress={() => setHistoryOpen(true)} activeOpacity={0.6} style={s.historyBtn}>
            <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
            {history.length > 0 && (
              <View style={[s.badge, { backgroundColor: colors.text }]}>
                <Text style={[s.badgeText, { color: colors.primaryText }]}>{history.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {tab === 'home' ? (
        <ApodTab
          colors={colors}
          language={language}
          onImageTap={(uri, r) => setViewer({ uri, ratio: r })}
          onNewEntry={addEntry}
        />
      ) : (
        <ProfileTab colors={colors} language={language} />
      )}

      <View style={[s.barWrap, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md }]}>
        <TabBar
          active={tab}
          onChange={setTab}
          colors={colors}
          labels={{ home: homeStr.tabHome, profile: homeStr.tabProfile }}
        />
      </View>

      {viewer && (
        <ImageViewer uri={viewer.uri} ratio={viewer.ratio} onClose={() => setViewer(null)} />
      )}

      <HistoryModal
        visible={historyOpen}
        entries={history}
        onClose={() => setHistoryOpen(false)}
        onClear={clearHistory}
        colors={colors}
        language={language}
        strings={historyStr}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: { fontSize: FontSize.title1, fontWeight: '700' },
  headerSub: { fontSize: FontSize.footnote, marginTop: 3 },

  historyBtn: { padding: 6, position: 'relative' },
  badge: {
    position: 'absolute', top: 0, right: 0,
    minWidth: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },

  scrollContent: { paddingBottom: Spacing.lg },

  center: { justifyContent: 'center', alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.lg },
  centerText: { fontSize: FontSize.body, textAlign: 'center', marginTop: Spacing.sm },
  errorTitle: { fontSize: FontSize.title3, fontWeight: '600', marginBottom: Spacing.sm },
  retryBtn: { marginTop: Spacing.lg, paddingVertical: 10, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.sm },
  retryLabel: { fontSize: FontSize.body, fontWeight: '600' },

  img: { width: IMG_W, borderRadius: BorderRadius.lg, alignSelf: 'center' },
  videoWrap: { position: 'relative', alignSelf: 'center' },
  videoFallback: { width: IMG_W, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },

  info: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  title: { fontSize: FontSize.title2, fontWeight: '700', lineHeight: 28 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: Spacing.md },
  metaText: { fontSize: FontSize.caption },
  copyright: { fontSize: FontSize.caption, fontStyle: 'italic' },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.lg },
  explanation: { fontSize: FontSize.body, lineHeight: 22 },

  avatarWrap: { alignItems: 'center', paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  avatarLetter: { fontSize: FontSize.title1, fontWeight: '600' },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm + 2 },
  settingLabel: { fontSize: FontSize.body },

  langPicker: { flexDirection: 'row', borderRadius: BorderRadius.sm, borderWidth: StyleSheet.hairlineWidth, padding: 2 },
  langBtn: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: BorderRadius.sm - 2 },
  langBtnActive: {},
  langBtnLabel: { fontSize: FontSize.footnote, fontWeight: '500' },

  version: { textAlign: 'center', fontSize: FontSize.caption, marginTop: Spacing.xl, paddingHorizontal: Spacing.lg, letterSpacing: 0.3 },

  barWrap: { alignItems: 'center', paddingTop: Spacing.sm },
});
