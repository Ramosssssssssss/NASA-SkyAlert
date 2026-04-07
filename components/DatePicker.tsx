import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AppColors } from '@/constants/theme';
import { Language } from '@/constants/i18n';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';

const MIN_DATE_STR = '1995-06-16';
const MIN_DATE_OBJ = new Date('1995-06-16T12:00:00');

function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDate(s: string): Date {
  return new Date(s + 'T12:00:00');
}

function todayStr(): string {
  return toStr(new Date());
}

function formatDate(raw: string, lang: Language): string {
  const [year, month, day] = raw.split('-');
  const esM = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const enM = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const names = lang === 'es' ? esM : enM;
  const idx = parseInt(month, 10) - 1;
  const d = parseInt(day, 10);
  return lang === 'en' ? `${names[idx]} ${d}, ${year}` : `${d} de ${names[idx]} de ${year}`;
}

interface Props {
  value: string;
  onChange: (date: string) => void;
  colors: AppColors;
  language: Language;
  todayLabel: string;
}

export default function DatePicker({ value, onChange, colors, language, todayLabel }: Props) {
  const isToday = value === todayStr();
  const isMin = value === MIN_DATE_STR;
  const [pickerVisible, setPickerVisible] = useState(false);

  const prev = () => {
    const d = toDate(value);
    d.setDate(d.getDate() - 1);
    if (toStr(d) >= MIN_DATE_STR) onChange(toStr(d));
  };

  const next = () => {
    const d = toDate(value);
    d.setDate(d.getDate() + 1);
    if (toStr(d) <= todayStr()) onChange(toStr(d));
  };

  const handleNativePick = (_e: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setPickerVisible(false);
    if (date) {
      const str = toStr(date);
      if (str >= MIN_DATE_STR && str <= todayStr()) onChange(str);
    }
  };

  return (
    <>
      <View style={[s.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity onPress={prev} disabled={isMin} style={s.arrow} activeOpacity={0.5}>
          <Ionicons name="chevron-back" size={20} color={isMin ? colors.placeholder : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={s.center} onPress={() => setPickerVisible(true)} activeOpacity={0.6}>
          <Text style={[s.dateLabel, { color: colors.text }]}>{formatDate(value, language)}</Text>
          {!isToday && <Text style={[s.today, { color: colors.textSecondary }]}>{todayLabel}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={next} disabled={isToday} style={s.arrow} activeOpacity={0.5}>
          <Ionicons name="chevron-forward" size={20} color={isToday ? colors.placeholder : colors.text} />
        </TouchableOpacity>
      </View>

      {pickerVisible && Platform.OS === 'android' && (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          display="default"
          minimumDate={MIN_DATE_OBJ}
          maximumDate={new Date()}
          onChange={handleNativePick}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={pickerVisible} transparent animationType="slide">
          <View style={s.overlay}>
            <View style={[s.sheet, { backgroundColor: colors.card }]}>
              <View style={[s.sheetHeader, { borderBottomColor: colors.separator }]}>
                <TouchableOpacity onPress={() => { onChange(todayStr()); setPickerVisible(false); }} activeOpacity={0.6}>
                  <Text style={[s.sheetAction, { color: colors.textSecondary }]}>{todayLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPickerVisible(false)} activeOpacity={0.6}>
                  <Text style={[s.sheetAction, s.sheetDone, { color: colors.text }]}>OK</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={toDate(value)}
                mode="date"
                display="spinner"
                minimumDate={MIN_DATE_OBJ}
                maximumDate={new Date()}
                onChange={handleNativePick}
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
  },
  arrow: {
    width: 44,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: FontSize.body,
    fontWeight: '500',
  },
  today: {
    fontSize: FontSize.caption,
    marginTop: 2,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetAction: { fontSize: FontSize.headline },
  sheetDone: { fontWeight: '600' },
});

export { formatDate, toStr, toDate, todayStr };
