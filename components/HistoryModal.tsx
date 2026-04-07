import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HistoryEntry } from '@/types/apod';
import { AppColors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { Language } from '@/constants/i18n';

function formatTimestamp(iso: string, lang: Language): string {
  const d = new Date(iso);
  const day = d.getDate();
  const esM = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  const enM = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mon = (lang === 'es' ? esM : enM)[d.getMonth()];
  const year = d.getFullYear();
  const h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');

  if (lang === 'en') {
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${mon} ${day}, ${year} · ${h % 12 || 12}:${min} ${ampm}`;
  }
  return `${day} ${mon} ${year} · ${h}:${min}`;
}

interface Props {
  visible: boolean;
  entries: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
  colors: AppColors;
  language: Language;
  strings: { title: string; close: string; empty: string; clear: string };
}

export default function HistoryModal({ visible, entries, onClose, onClear, colors, language, strings }: Props) {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: HistoryEntry }) => {
    const json = JSON.stringify(item.apod, null, 2);

    return (
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[s.cardTitle, { color: colors.text }]}>{item.apod.title}</Text>

        <View style={[s.jsonBlock, { backgroundColor: colors.background }]}>
          <Text style={[s.jsonText, { color: colors.textSecondary }]}>{json}</Text>
        </View>

        <View style={s.meta}>
          <Ionicons name="time-outline" size={13} color={colors.textTertiary} />
          <Text style={[s.metaLabel, { color: colors.textTertiary }]}>
            {formatTimestamp(item.consultedAt, language)}
          </Text>
        </View>
        <View style={s.meta}>
          <Ionicons name="phone-portrait-outline" size={13} color={colors.textTertiary} />
          <Text style={[s.metaLabel, { color: colors.textTertiary }]}>{item.device}</Text>
        </View>
        <View style={s.meta}>
          <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
          <Text style={[s.metaLabel, { color: colors.textTertiary }]}>{item.location}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top || Spacing.lg }]}>
        <View style={s.header}>
          <Text style={[s.headerTitle, { color: colors.text }]}>{strings.title}</Text>
          <View style={s.actions}>
            {entries.length > 0 && (
              <TouchableOpacity onPress={onClear} activeOpacity={0.6} style={s.actionBtn}>
                <Text style={[s.actionText, { color: colors.error }]}>{strings.clear}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={s.actionBtn}>
              <Text style={[s.actionText, { color: colors.text }]}>{strings.close}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="document-text-outline" size={40} color={colors.textTertiary} />
            <Text style={[s.emptyLabel, { color: colors.textSecondary }]}>{strings.empty}</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.title2, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: Spacing.md },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  actionText: { fontSize: FontSize.body, fontWeight: '500' },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: 48 },
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: { fontSize: FontSize.headline, fontWeight: '600', marginBottom: Spacing.sm },
  jsonBlock: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
  },
  jsonText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 16,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  metaLabel: { fontSize: FontSize.caption },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  emptyLabel: { fontSize: FontSize.body },
});
