import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { AppColors } from '@/constants/theme';

type Tab = 'home' | 'profile';

const WIDTH = 200;
const HEIGHT = 56;
const PAD = 4;
const TAB_W = (WIDTH - PAD * 2) / 2;

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  colors: AppColors;
  labels: { home: string; profile: string };
}

export default function TabBar({ active, onChange, colors, labels }: Props) {
  const x = useSharedValue(active === 'home' ? 0 : TAB_W);

  useEffect(() => {
    x.value = withTiming(active === 'home' ? 0 : TAB_W, { duration: 280 });
  }, [active]);

  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const tabs: { key: Tab; icon: string; iconActive: string; label: string }[] = [
    { key: 'home', icon: 'home-outline', iconActive: 'home', label: labels.home },
    { key: 'profile', icon: 'person-outline', iconActive: 'person', label: labels.profile },
  ];

  return (
    <View style={[s.pill, { backgroundColor: colors.pillBg, shadowColor: colors.pillShadow }]}>
      <Animated.View style={[s.indicator, { backgroundColor: colors.pillIndicator }, indicator]} />
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity key={tab.key} style={s.tab} onPress={() => onChange(tab.key)} activeOpacity={0.7}>
            <Ionicons
              name={isActive ? tab.iconActive as any : tab.icon as any}
              size={20}
              color={isActive ? colors.text : colors.textTertiary}
            />
            <Text style={[s.label, { color: isActive ? colors.text : colors.textTertiary }, isActive && s.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    width: WIDTH,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    padding: PAD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  indicator: {
    position: 'absolute',
    top: PAD,
    left: PAD,
    width: TAB_W,
    height: HEIGHT - PAD * 2,
    borderRadius: (HEIGHT - PAD * 2) / 2,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    gap: 2,
  },
  label: { fontSize: 10 },
  labelActive: { fontWeight: '600' },
});
