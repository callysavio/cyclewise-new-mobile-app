export const phaseData = {
  MENSTRUAL: {
    title: "Menstrual Phase",
    color: "#FF699C",
    image: require("@/assets/images/menstral.png"),
    details: {
      whatHappens:
        "During this phase, the uterus sheds its lining, leading to menstrual bleeding. Hormone levels like estrogen and progesterone are at their lowest.",
      symptoms:
        "Cramps, fatigue, mood changes, lower back pain, and bloating are common during this time.",
      fertilization:
        "There’s no chance of fertilization since ovulation hasn’t occurred yet.",
    },
  },
  FOLLICULAR: {
    title: "Follicular Phase",
    color: "#00A9F1",
    image: require("@/assets/images/menstral.png"),
    details: {
      whatHappens:
        "Estrogen levels begin to rise, and the follicles in the ovaries mature in preparation for ovulation.",
      symptoms:
        "You may feel more energetic, focused, and experience improved mood.",
      fertilization:
        "Low chance of fertilization, but increasing as ovulation nears.",
    },
  },
  OVULATION: {
    title: "Ovulation Phase",
    color: "#FFC02D",
    image: require("@/assets/images/menstral.png"),
    details: {
      whatHappens:
        "The mature egg is released from the ovary. This is the most fertile time in your cycle.",
      symptoms:
        "Some experience mild cramps, increased libido, or changes in cervical mucus.",
      fertilization: "Highest chance of fertilization during this phase.",
    },
  },
  LUTEAL: {
    title: "Luteal Phase",
    color: "#DD8A64",
    image: require("@/assets/images/menstral.png"),
    details: {
      whatHappens:
        "The body prepares for possible pregnancy. If fertilization doesn’t occur, hormone levels drop.",
      symptoms:
        "Bloating, breast tenderness, mood swings, and cravings are common.",
      fertilization: "Low chance of fertilization after ovulation ends.",
    },
  },
} as const;

export type PhaseKey = keyof typeof phaseData;
