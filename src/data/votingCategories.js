/**
 * Class voting categories and nominees (edit names to match your batch).
 * Vote counts persist in the browser via localStorage.
 */
export const VOTING_CATEGORIES = [
  {
    id: "comedian",
    emoji: "😂",
    title: "Class Comedian",
    subtitle: "Who always made everyone laugh?",
    nominees: [
      { id: "c_viresh", name: "Viresh" },
      { id: "c_mallamma", name: "Mallamma" },
      { id: "c_gollalappa", name: "Gollalappa" },
      { id: "c_chaitra", name: "Chaitra" },
    ],
  },
  {
    id: "same_person",
    emoji: "🔄",
    title: "Still Same Person (No Change)",
    subtitle: "Who never really changed?",
    nominees: [
      { id: "s_suvarna", name: "Suvarna" },
      { id: "s_viresh", name: "Viresh" },
      { id: "s_mahesh", name: "Mahesh" },
      { id: "s_vinod", name: "Vinod" },
    ],
  },
  {
    id: "non_stop_talker",
    emoji: "💬",
    title: "Non-Stop Talker",
    subtitle: "Who could talk for hours?",
    nominees: [
      { id: "t_shweta", name: "Shweta" },
      { id: "t_prema", name: "Prema" },
      { id: "t_suchitra", name: "Suchitra" },
      { id: "t_Bhimu", name: "Bhimu" },
    ],
  },
  {
    id: "confused_confident",
    emoji: "😅",
    title: "Confused But Confident",
    subtitle: "Smiling through the confusion",
    nominees: [
      { id: "cc_ganga", name: "Ganga" },
      { id: "cc_ambika", name: "Ambika" },
      { id: "cc_ambadas", name: "Ambadas" },
      { id: "cc_umashree", name: "Umashree" },
    ],
  },
  {
    id: "silent_innocent",
    emoji: "🤫",
    title: "Silent and Innocent",
    subtitle: "Quiet souls in the batch",
    nominees: [
      { id: "si_ningamma", name: "Ningamma" },
      { id: "si_parvati", name: "Parvati" },
      { id: "si_bhimashankar", name: "Bhimashankar" },
      { id: "si_sunil", name: "Sunil" },
    ],
  },
  {
    id: "hunters",
    emoji: "🎯",
    title: "Hunters",
    subtitle: "Always on the lookout",
    nominees: [
      { id: "h_chandrashekar", name: "Chandrashekar" },
      { id: "h_jatteppa", name: "Jatteppa" },
      { id: "h_marilinga", name: "Marilinga" },
      { id: "h_ningappa", name: "Ningappa" },
    ],
  },
  {
    id: "debate_champion",
    emoji: "🏆",
    title: "Debate Champion (Always Wins Arguments)",
    subtitle: "Who talks like a lawyer?",
    nominees: [
      { id: "dc_mallamma", name: "Mallamma" },
      { id: "dc_roopa", name: "Roopa" },
      { id: "dc_hrutik", name: "Hrutik" },
      { id: "dc_arun", name: "Arun" },
    ],
  },
];
