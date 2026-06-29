export const getGreeting = (name?: string): string => {
  const hour = new Date().getHours();
  let greeting = "";

  // Adjusted hours to catch the early birds properly!
  if (hour >= 4 && hour < 12) {
    greeting = "Good morning, sunshine";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon, lovely";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good evening, queen";
  } else {
    // This handles late night/early morning from 10:00 PM to 3:59 AM
    greeting = "Good night, beautiful";
  }

  const firstName = name?.trim().split(" ")[0] || "gorgeous";

  return `${greeting} ${firstName} 💕`;
};
