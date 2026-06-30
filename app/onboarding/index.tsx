// app/onboarding/index.tsx
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProviders';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/images/onboarding1.png'),
    title: 'Track your cycle with ease',
    subtitle: 'Get personalized insights into your cycle, ovulation, and fertility window.',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding2.png'),
    title: 'Log your symptoms',
    subtitle: 'Track your mood, energy, and more to understand your cycle better.',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding3.png'),
    title: 'Track your cycle and ovulation',
    subtitle: 'Understand your body better and plan ahead with accurate predictions.',
  },
  {
    id: '4',
    image: require('@/assets/images/onboarding4.png'),
    title: 'Track your pregnancy',
    subtitle: "Follow your baby's growth and learn what to expect.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

 const handleNext = async () => {
  if (currentIndex < slides.length - 1) {
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  } else {
    
    await completeOnboarding();

    // Send first-time users into the login flow before home
    router.replace("/(auth)/login");
  }
};

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.3 }]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: "-10%",
  },

  // Each onboarding page
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
    paddingTop: height * 0.07, 
  },

  
  image: {
    width: width,
    height: height * 0.45,
    resizeMode: "cover",
    marginBottom: 30,
  },

  title: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 28,
    color: "#E5563D", 
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 35,
    paddingHorizontal: 20,
  },

  subtitle: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 16,
    color: "#666", // softer gray for subheading
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },

  // Footer section (dots + button)
  footer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 40,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E5563D",
    marginHorizontal: 5,
  },

  button: {
    backgroundColor: "#E5563D",
    borderRadius: 25,
    width: width * 0.8, 
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FAFAFA",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 18,
  },
});
