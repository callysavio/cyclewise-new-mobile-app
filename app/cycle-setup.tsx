import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaProvider } from "react-native-safe-area-context";



// --- THEME & COLORS (Reusing the Cyclewise Design) ---
const PRIMARY_COLOR = '#E7625F'; // Reddish-orange

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: PRIMARY_COLOR,
    icon: '#687076',
    inputBorder: '#D1D5DB',
    dateSelectedBg: PRIMARY_COLOR,
    dateSelectedText: '#fff',
    dateUnselectedText: '#11181C',
    headerControl: '#687076', // For calendar arrows
  },
};

const useTheme = () => Colors.light;
// --- END THEME ---

// --- UTILITY TYPES & STATE ---

type Screen = 'CycleStart' | 'CycleLength' | 'PeriodDuration' | 'SetupComplete';

interface CycleState {
  cycleStart: string | null; // Selected date string 'YYYY-MM-DD'
  cycleLength: number | null; // Average length in days (e.g., 28)
  periodDuration: number | null; // Duration in days (e.g., 5)
}

// --- CUSTOM COMPONENTS (Reused and Simplified) ---

// Custom Modal Component to replace alert()
interface ModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
}
const MessageModal: React.FC<ModalProps> = ({ visible, title, message, onClose }) => {
    const theme = useTheme();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={[modalStyles.modalView, { backgroundColor: theme.background }]}>
                    <Text style={[modalStyles.modalTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[modalStyles.modalText, { color: theme.icon }]}>{message}</Text>
                    <TouchableOpacity
                        style={[modalStyles.button, { backgroundColor: theme.tint }]}
                        onPress={onClose}
                    >
                        <Text style={modalStyles.textStyle}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, loading = false, disabled = false }) => {
  const theme = useTheme();
  const opacity = disabled || loading ? 0.6 : 1;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[
        styles.button,
        { backgroundColor: theme.tint, opacity },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.background} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Simplified Input for Numeric Pickers
interface NumericInputProps {
    label: string;
    unit: string;
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder: string;
    min: number;
    max: number;
}

const NumericInput: React.FC<NumericInputProps> = ({ label, unit, value, onChange, placeholder, min, max }) => {
    const theme = useTheme();

    const handleTextChange = (text: string) => {
        // Only allow digits to be processed
        const cleanText = text.replace(/[^0-9]/g, ''); 
        
        const num = parseInt(cleanText, 10);
        if (cleanText === '') { // Allow clearing the input
            onChange(null);
        } else if (!isNaN(num)) {
            // Check if within bounds
            if (num >= min && num <= max) {
                onChange(num);
            } else if (num < min || num > max) {
                // If input is outside range, still update state but allow user to continue typing if it's a two-digit number
                // We rely on the 'disabled' state of the button to enforce the rule.
                onChange(num); 
            }
        } else {
             onChange(null);
        }
    };
    
    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>{label}</Text>
            <View style={pickerStyles.pickerInputWrapper}>
                <TextInput
                    style={[pickerStyles.numericInput, { borderColor: theme.inputBorder, color: theme.text }]}
                    placeholder={placeholder}
                    placeholderTextColor={theme.icon}
                    keyboardType="number-pad"
                    maxLength={2}
                    value={value !== null ? String(value) : ''}
                    onChangeText={handleTextChange}
                    textAlign="center"
                />
                <Text style={[pickerStyles.unitText, { color: theme.icon }]}>{unit}</Text>
            </View>
            <Text style={[styles.infoText, { color: theme.icon, marginTop: 5, fontSize: 12 }]}>
                (Range: {min}-{max} {unit})
            </Text>
        </View>
    );
}

// --- SCREEN DEFINITIONS ---

interface SetupScreenProps {
  state: CycleState;
  setState: React.Dispatch<React.SetStateAction<CycleState>>;
  setCurrentScreen: (screen: Screen) => void;
  showMessage: (title: string, message: string) => void;
}

// 1. CYCLE START DATE SCREEN
const CycleStartScreen: React.FC<SetupScreenProps> = ({ state, setState, setCurrentScreen, showMessage }) => {
  const theme = useTheme();
  
  // State for the currently viewed month/year in the mock calendar
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(today);
  
  // State for picker visibility
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);


  // Calculate calendar properties based on currentDate
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const firstDayOfMonth = useMemo(() => {
    const date = new Date(currentYear, currentMonth, 1);
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return date.getDay();
  }, [currentYear, currentMonth]); 
  
  const daysInMonth = useMemo(() => {
    // Month + 1 is the next month, 0th day of the next month is the last day of the current month
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);
  
  
  // --- Calendar Handlers ---
  
  const clearSelectedDate = useCallback(() => {
    setState(prev => ({ ...prev, cycleStart: null }));
  }, [setState]);


  const handleMonthChange = useCallback((direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(currentMonth + 1);
    } else {
      newDate.setMonth(currentMonth - 1);
    }
    setCurrentDate(newDate);
    clearSelectedDate();
  }, [currentDate, currentMonth, clearSelectedDate]);

  const handleMonthSelect = useCallback((monthIndex: number) => {
    const newDate = new Date(currentDate);
    // Setting the month automatically handles year overflow/underflow
    newDate.setMonth(monthIndex); 
    setCurrentDate(newDate);
    setIsMonthPickerVisible(false);
    clearSelectedDate();
  }, [currentDate, clearSelectedDate]);
  
  const handleYearSelect = useCallback((year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setIsYearPickerVisible(false);
    clearSelectedDate();
  }, [currentDate, clearSelectedDate]);

  const handleDateSelect = (day: number) => {
    const month = String(currentMonth + 1).padStart(2, '0');
    const dateString = `${currentYear}-${month}-${String(day).padStart(2, '0')}`;
    
    // Simple check to prevent selecting dates in the future beyond today
    const selectedDateObj = new Date(currentYear, currentMonth, day);
    // Set time to midnight for accurate comparison, ignoring hours/minutes/seconds
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (selectedDateObj.getTime() > todayMidnight.getTime()) {
      showMessage("Future Date", "You can't select a start date in the future.");
      return;
    }
    
    setState(prev => ({ ...prev, cycleStart: dateString }));
  };
  
  const isSelected = (day: number) => {
    if (!state.cycleStart) return false;
    
    const [selectedYear, selectedMonth, selectedDay] = state.cycleStart.split('-').map(Number);
    
    return selectedYear === currentYear && selectedMonth === (currentMonth + 1) && selectedDay === day;
  };

  const handleNext = () => setCurrentScreen('CycleLength');


  // --- Helper Picker Components (Defined locally to access handlers) ---
  
  const MonthPickerView = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return (
        // The pickerOverlay is full size (absolute position)
        <View style={[calendarStyles.pickerOverlay, { backgroundColor: theme.background }]}>
            {/* 1. Spacer for the Calendar Header (fixed height) */}
            <View style={{ height: 60 }} /> 
            
            {/* 2. Content Container (uses flex: 1 to fill remaining space) */}
            <View style={calendarStyles.monthGridContainer}>
                {months.map((name, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            calendarStyles.pickerItem,
                            currentMonth === index && { backgroundColor: theme.tint, opacity: 1 }
                        ]}
                        onPress={() => handleMonthSelect(index)}
                    >
                        <Text style={[
                            calendarStyles.pickerText,
                            { 
                                color: currentMonth === index ? theme.dateSelectedText : theme.text,
                                // Make selected month text extra bold
                                fontWeight: currentMonth === index ? '900' : '600'
                            }
                        ]}>
                            {name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
  };
  
  const YearPickerView = () => {
    const currentYearToday = today.getFullYear();
    // Allow selecting years up to 20 years back
    const startYear = currentYearToday - 20; 
    const endYear = currentYearToday; // Max year user should select for a period start date
    
    // Array of years to display
    // We reverse the array so the current year is at the top of the ScrollView
    const years = useMemo(() => Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i), [startYear, endYear]);
    
    return (
        <View style={[calendarStyles.pickerOverlay, { backgroundColor: theme.background }]}>
            {/* 1. Spacer for the Calendar Header (fixed height) */}
            <View style={{ height: 60 }} /> 
            
            {/* 2. Scrollable Content (uses flex: 1 to fill remaining space) */}
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} style={calendarStyles.yearScrollViewContent}>
                {years.map((year) => (
                    <TouchableOpacity
                        key={year}
                        style={[
                            calendarStyles.yearItem,
                            currentYear === year && { backgroundColor: theme.tint, opacity: 1 }
                        ]}
                        onPress={() => handleYearSelect(year)}
                    >
                        <Text style={[
                            calendarStyles.pickerText,
                            { 
                                color: currentYear === year ? theme.dateSelectedText : theme.text,
                                // Make selected year text extra bold
                                fontWeight: currentYear === year ? '900' : '600'
                            }
                        ]}>
                            {year}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
  };


  return (
    <View style={styles.screenContent}>
        <Text style={[styles.subheader, { color: theme.text }]}>Cycle Setup</Text>
        <Text style={[styles.infoText, { color: theme.icon, marginBottom: 40 }]}>
            Let's understand your cycle - tell us a bit about your period to personalize your experience.
        </Text>

        <Text style={[styles.title, { color: theme.text }]}>
            When did your last period start?
        </Text>

        {/* Dynamic Calendar */}
        <View style={calendarStyles.calendarContainer}>
            {/* Month/Year Header with Navigation */}
            <View style={calendarStyles.monthHeaderContainer}>
                <TouchableOpacity 
                    onPress={() => handleMonthChange('prev')} 
                    disabled={isMonthPickerVisible || isYearPickerVisible}
                    style={calendarStyles.navButton}
                >
                    <Text style={[calendarStyles.navText, { color: theme.headerControl }]}>&lt;</Text>
                </TouchableOpacity>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Clickable Month - Toggles Month Picker, closes Year Picker */}
                    <TouchableOpacity 
                        onPress={() => {
                            setIsYearPickerVisible(false); 
                            setIsMonthPickerVisible(prev => !prev); 
                        }}
                    >
                        <Text style={[
                            calendarStyles.monthHeader, 
                            { 
                                color: theme.text, 
                                // Underline only the active title or when no picker is open
                                textDecorationLine: isMonthPickerVisible ? 'none' : (isYearPickerVisible ? 'none' : 'underline')
                            }
                        ]}>
                            {monthName}
                        </Text>
                    </TouchableOpacity>
                    {/* Clickable Year - Toggles Year Picker, closes Month Picker */}
                    <TouchableOpacity 
                        onPress={() => {
                            setIsMonthPickerVisible(false);
                            setIsYearPickerVisible(prev => !prev);
                        }}
                    >
                        <Text style={[
                            calendarStyles.monthHeader, 
                            { 
                                color: theme.text, 
                                // Underline only the active title or when no picker is open
                                textDecorationLine: isYearPickerVisible ? 'none' : (isMonthPickerVisible ? 'none' : 'underline'), 
                                marginLeft: 8 
                            }
                        ]}>
                            {currentYear}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    onPress={() => handleMonthChange('next')} 
                    // Disable next button if viewing current month/year, or if picker is open
                    disabled={
                        (currentMonth === today.getMonth() && currentYear === today.getFullYear()) || 
                        isMonthPickerVisible || isYearPickerVisible
                    } 
                    style={[
                        calendarStyles.navButton,
                        ((currentMonth === today.getMonth() && currentYear === today.getFullYear()) || isMonthPickerVisible || isYearPickerVisible) && {opacity: 0.4}
                    ]}
                >
                    <Text style={[calendarStyles.navText, { color: theme.headerControl }]}>&gt;</Text>
                </TouchableOpacity>
            </View>

            {/* Render Pickers as Overlays */}
            {isMonthPickerVisible && <MonthPickerView />}
            {isYearPickerVisible && <YearPickerView />}

            {/* Calendar Grid (Visible only if no pickers are active) */}
            {!(isMonthPickerVisible || isYearPickerVisible) && (
                <>
                    <View style={calendarStyles.dayNamesContainer}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <Text key={day} style={[calendarStyles.dayName, { color: theme.icon }]}>{day}</Text>
                        ))}
                    </View>
                    <View style={calendarStyles.daysContainer}>
                        {/* Offset for first day of the month */}
                        {Array(firstDayOfMonth).fill(0).map((_, i) => <View key={`empty-${i}`} style={calendarStyles.dayCell} />)}

                        {Array(daysInMonth).fill(0).map((_, index) => {
                            const day = index + 1;
                            const selected = isSelected(day);
                            
                            // Comparison for today
                            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                            
                            // Comparison for future date (set time to midnight for accurate day comparison)
                            const selectedDateObj = new Date(currentYear, currentMonth, day);
                            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const isFuture = selectedDateObj.getTime() > todayMidnight.getTime();
                            
                            return (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        calendarStyles.dayCell, 
                                        selected && { backgroundColor: theme.dateSelectedBg, borderRadius: 9999 },
                                        isFuture && { opacity: 0.4 } // Dim future dates
                                    ]}
                                    onPress={() => handleDateSelect(day)}
                                    disabled={isFuture}
                                >
                                    <Text 
                                        style={[
                                            calendarStyles.dayText, 
                                            selected ? { color: theme.dateSelectedText } : { color: theme.dateUnselectedText },
                                            isToday && { fontWeight: '700' }
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            )}
        </View>

        <CustomButton
            title="Next"
            onPress={handleNext}
            disabled={!state.cycleStart}
        />
    </View>
  );
};

// 2. CYCLE LENGTH SCREEN
const CycleLengthScreen: React.FC<SetupScreenProps> = ({ state, setState, setCurrentScreen }) => {
  const theme = useTheme();
  
  const handleNext = () => setCurrentScreen('PeriodDuration');
  const handleBack = () => setCurrentScreen('CycleStart');

  return (
    <View style={styles.screenContent}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.subheader, { color: theme.text, marginTop: 40 }]}>Cycle Setup</Text>
        <Text style={[styles.infoText, { color: theme.icon, marginBottom: 40 }]}>
            Let's understand your cycle - tell us a bit about your period to personalize your experience.
        </Text>

        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>
            What's the average length of your menstrual cycle?
        </Text>
        
        <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <NumericInput
                label="Average Cycle Length"
                unit="days"
                value={state.cycleLength}
                onChange={(num) => setState(prev => ({ ...prev, cycleLength: num }))}
                placeholder="28"
                min={21}
                max={35}
            />
        </View>

        <CustomButton
            title="Apply"
            onPress={handleNext}
            disabled={!state.cycleLength || state.cycleLength < 21 || state.cycleLength > 35}
        />
    </View>
  );
};

// 3. PERIOD DURATION SCREEN
const PeriodDurationScreen: React.FC<SetupScreenProps> = ({ state, setState, setCurrentScreen }) => {
    const theme = useTheme();

    const handleComplete = useCallback(() => {
        // Here you would typically save the final state to a database or storage
        console.log("Cycle Setup Complete:", state);
        setCurrentScreen('SetupComplete');
    }, [state, setCurrentScreen]);

    const handleBack = () => setCurrentScreen('CycleLength');

    return (
      <View style={styles.screenContent}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.subheader, { color: theme.text, marginTop: 40 }]}>Cycle Setup</Text>
        <Text style={[styles.infoText, { color: theme.icon, marginBottom: 40 }]}>
            Let's understand your cycle - tell us a bit about your period to personalize your experience.
        </Text>
  
        <Text style={[styles.title, { color: theme.text, textAlign: 'center' }]}>
            How long does your period last?
        </Text>
        
        <View style={{ alignItems: 'center', marginVertical: 40 }}>
             <NumericInput
                label="Period Duration"
                unit="days"
                value={state.periodDuration}
                onChange={(num) => setState(prev => ({ ...prev, periodDuration: num }))}
                placeholder="5"
                min={3}
                max={7}
            />
        </View>

        <CustomButton
          title="Continue"
          onPress={handleComplete}
          disabled={!state.periodDuration || state.periodDuration < 3 || state.periodDuration > 7}
        />
      </View>
    );
};

// 4. SETUP COMPLETE SCREEN
const SetupCompleteScreen: React.FC<SetupScreenProps> = ({ state, setCurrentScreen }) => {
    const theme = useTheme();
    
    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[styles.subheader, { color: theme.text, fontSize: 32, textAlign: 'center' }]}>
                ✅ Setup Complete!
            </Text>
            <Text style={[styles.infoText, { color: theme.icon, marginVertical: 20, textAlign: 'center' }]}>
                Thank you for setting up your cycle details. We're ready to personalize your experience!
            </Text>
            <View style={{ padding: 10 }}>
                <Text style={[styles.linkText, { color: theme.text, fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>
                    Your Settings:
                </Text>
                <Text style={[styles.infoText, { color: theme.icon }]}>Last Period Start: {state.cycleStart || 'N/A'}</Text>
                <Text style={[styles.infoText, { color: theme.icon }]}>Cycle Length: {state.cycleLength || 'N/A'} days</Text>
                <Text style={[styles.infoText, { color: theme.icon, marginBottom: 20 }]}>Period Duration: {state.periodDuration || 'N/A'} days</Text>
            </View>
            <TouchableOpacity onPress={() => setCurrentScreen('CycleStart')} style={{ padding: 10 }}>
                <Text style={[styles.linkText, { color: theme.tint, fontWeight: 'bold', fontSize: 16 }]}>
                    Restart Setup
                </Text>
            </TouchableOpacity>
        </View>
    );
};


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const theme = useTheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('CycleStart');
  const [cycleState, setCycleState] = useState<CycleState>({ cycleStart: null, cycleLength: null, periodDuration: null });
  
  // State for custom message modal (reused from Auth flow)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const showMessage = useCallback((title: string, message: string) => {
    setModalContent({ title, message });
    setModalVisible(true);
  }, []);

  const hideMessage = useCallback(() => {
    setModalVisible(false);
    setModalContent({ title: '', message: '' });
  }, []);


  const renderScreen = useMemo(() => {
    // Pass showMessage down to children
    const props = { state: cycleState, setState: setCycleState, setCurrentScreen, showMessage }; 
    switch (currentScreen) {
      case 'CycleStart':
        return <CycleStartScreen {...props} />;
      case 'CycleLength':
        return <CycleLengthScreen {...props} />;
      case 'PeriodDuration':
        return <PeriodDurationScreen {...props} />;
      case 'SetupComplete':
          return <SetupCompleteScreen {...props} />;
      default:
        return <CycleStartScreen {...props} />;
    }
  }, [currentScreen, cycleState, showMessage]);

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: theme.background }]}>
      <MessageModal
          visible={modalVisible}
          title={modalContent.title}
          message={modalContent.message}
          onClose={hideMessage}
      />
      <KeyboardAvoidingView
        style={styles.container}
        // 'height' on Android and 'padding' on iOS/Web is common practice
        behavior={Platform.OS === 'ios' || Platform.OS === 'web' ? 'padding' : 'height'} 
      >
        <View style={styles.innerContainer}>
            {renderScreen}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Max width for web/desktop viewing
    alignSelf: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  screenContent: {
    paddingHorizontal: 25,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center', // Center content for number picker
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 25,
    padding: 10,
    zIndex: 10,
  },
});

const calendarStyles = StyleSheet.create({
    calendarContainer: {
        backgroundColor: '#F7F7F7',
        borderRadius: 15,
        padding: 15,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        overflow: 'hidden', // Crucial for containing absolute children (pickers)
    },
    monthHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: 60, // Give header a fixed height
    },
    navButton: {
        padding: 5,
    },
    navText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    monthHeader: {
        // Updated for visibility
        fontSize: 24, 
        fontWeight: '900', // Ultra Bold
        textAlign: 'center',
    },
    dayNamesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    dayName: {
        fontSize: 14,
        fontWeight: '500',
        width: '14%',
        textAlign: 'center',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14%', // 1/7th of the row width
        aspectRatio: 1, // Makes it a square
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    dayText: {
        fontSize: 16,
    },
    
    // --- Picker Styles ---
    pickerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        borderRadius: 15,
        // The overlay itself needs to be a flex container to make its children fill the space
        flexDirection: 'column', 
    },
    
    // New styles for the content within the picker overlay
    monthGridContainer: {
        flex: 1, // Fills the remaining vertical space
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    yearScrollViewContent: {
        flex: 1, // Fills the remaining vertical space
        paddingHorizontal: 15,
    },
    
    // Original month/year item styles (kept these)
    pickerItem: {
        width: '30%',
        marginVertical: 10,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB', // Light gray background for unselected
        opacity: 0.8,
    },
    pickerText: {
        // Updated: Increased font size for better visibility, as requested
        fontSize: 20, 
        fontWeight: '600',
    },
    yearItem: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: '#E5E7EB', // Light gray background for unselected
        opacity: 0.8,
    }
});

const pickerStyles = StyleSheet.create({
    pickerInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    numericInput: {
        // Reduced size for better tap target, made rectangular
        width: 150, 
        height: 60,
        borderWidth: 1,
        borderRadius: 8, // Added rounding for better aesthetic
        fontSize: 28, // Smaller font, but still prominent
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 5, // Add vertical padding for better spacing
        paddingHorizontal: 10,
    },
    unitText: {
        fontSize: 18,
        marginLeft: 10,
    }
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxWidth: 400,
    },
    button: {
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        marginTop: 20,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default App;







