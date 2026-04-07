import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const SCREEN_W = Dimensions.get('window').width;

interface Props {
  uri: string;
  ratio: number;
  onClose: () => void;
}

export default function ImageViewer({ uri, ratio, onClose }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  const imgH = SCREEN_W / ratio;

  const pinch = Gesture.Pinch()
    .onUpdate((e) => { scale.value = savedScale.value * e.scale; })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      } else if (scale.value > 5) {
        scale.value = withTiming(5);
        savedScale.value = 5;
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      offsetX.value = savedX.value + e.translationX;
      offsetY.value = savedY.value + e.translationY;
    })
    .onEnd(() => {
      if (savedScale.value <= 1) {
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      } else {
        savedX.value = offsetX.value;
        savedY.value = offsetY.value;
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
        savedX.value = 0;
        savedY.value = 0;
      } else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const gesture = Gesture.Race(doubleTap, Gesture.Simultaneous(pinch, pan));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  const insets = useSafeAreaInsets();

  return (
    <Modal visible transparent statusBarTranslucent animationType="fade">
      <GestureHandlerRootView style={s.root}>
        <View style={s.backdrop}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[s.imageContainer, animatedStyle]}>
              <Image
                source={{ uri }}
                style={{ width: SCREEN_W, height: imgH }}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
          <TouchableOpacity
            style={[s.close, { top: insets.top + 12 }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <View style={s.closeBg}>
              <Ionicons name="close" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    right: 16,
  },
  closeBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
