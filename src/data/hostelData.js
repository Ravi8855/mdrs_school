/** Boys hostel — exact copy of provided data */
export const boysHouses = [
  {
    id: "krishna",
    name: "Krishna House",
    houseMaster: "Subhas Sir",
    houseLeader: "Ambadas",
    roommates: ["Marilinga", "Ningappa",  "Golallappa", "Ambadas"],
  },
  {
    id: "bhima",
    name: "Bhima House",
    houseMaster: "Madivalappa sir ",
    houseLeader: "Arun",
    roommates: ["Sunil","Praveen" ,"Chandrashekar", "Arun"],
  },
  {
    id: "sindhu",
    name: "Sindhu House",
    houseMaster: "Chandru Sir",
    houseLeader: "Ravi",
    roommates: ["Bhimashankar", "Bhimu", "Vinod", "Ravi"],
  },
  {
    id: "godhawari",
    name: "Godhawari House",
    houseMaster: "Rajkumar Sir",
    houseLeader: "Hrutik",
    roommates: ["Jatteppa", "Mallikarjun","Viresh", "Mahesh", "Hrutik"],
  },
];

/** Girls hostel — Kaveri & Yamuna houses */
export const girlsHouses = [
  {
    id: "kaveri",
    name: "Kaveri House",
    houseMaster: "Renuka Mam",
    houseLeader: "Chaitra",
    roommates: ["Shweta", "Umashree","Parvati", "Ambika", "Chaitra"],
  },
  {
    id: "yamuna",
    name: "Yamuna House",
    houseMaster: "Shilpa Mam",
    houseLeader: "Suchitra",
    roommates: ["Mamtha","Savita", "Roopa", "Suchitra"],
  },
];

export function getHousesForGender(gender) {
  return gender === "boys" ? boysHouses : girlsHouses;
}

export function getHouseById(gender, roomId) {
  return getHousesForGender(gender).find((h) => h.id === roomId) ?? null;
}
