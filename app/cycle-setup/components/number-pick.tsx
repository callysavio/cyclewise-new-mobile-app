import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = 60;

interface Props {
  min: number;
  max: number;
  initial?: number;
  onChange?: (value: number) => void;
}

export default function NumberPicker({ min, max, initial = min, onChange }: Props) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ref = useRef<any>(null);

  // 👉 FIX: use scrollToOffset(), NOT scrollTo()
  useEffect(() => {
    const idx = numbers.indexOf(initial);
    if (idx >= 0) {
      setTimeout(() => {
        const offset = idx * ITEM_SIZE;
        ref.current?.scrollToOffset({ offset, animated: true });
      }, 50);
    }
  }, []);

  return (
    <Animated.FlatList
      ref={ref}
      data={numbers}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(n) => String(n)}
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: (width - ITEM_SIZE) / 2,
        marginTop: 20,
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 2) * ITEM_SIZE,
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
          (index + 2) * ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.7, 0.85, 1.2, 0.85, 0.7],
          extrapolate: "clamp",
        });

        const color = scrollX.interpolate({
          inputRange,
          outputRange: ["#ccc", "#aaa", "#E5563D", "#aaa", "#ccc"],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={{
              width: ITEM_SIZE,
              alignItems: "center",
              transform: [{ scale }],
            }}
          >
            <TouchableOpacity onPress={() => onChange?.(item)}>
              <Animated.Text
                style={{
                  fontFamily: "Lexend_600SemiBold",
                  fontSize: 22,
                  color,
                }}
              >
                {item}
              </Animated.Text>
              <Text
                style={{
                  fontFamily: "Lexend_400Regular",
                  fontSize: 12,
                  color: "#999",
                }}
              >
                Days
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    />
  );
}
