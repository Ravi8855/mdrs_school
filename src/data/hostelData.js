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
    roommates: ["Jatteppa", "Mallikarjun", "Praveen","Viresh", "Mahesh", "Hrutik"],
  },
];

/** Girls hostel — Kaveri & Yamuna houses */
export const girlsHouses = [
  {
    id: "kaveri-1",
    name: "Kaveri House-1",
    houseMaster: "Renuka Mam",
    houseLeader: "Parvati",
    roommates: ["Parvati", "Ambika"],
  },
  {
    id: "kaveri-2",
    name: "Kaveri House-2",
    houseMaster: "Renuka Mam",
    houseLeader: "Chaitra",
    roommates: ["Shweta", "Umashree", "Chaitra"],
  },
  {
    id: "yamuna-1",
    name: "Yamuna House-1",
    houseMaster: "Shilpa Mam",
    houseLeader: "Suchitra",
    roommates: ["Mamtha", "Suchitra"],
  },
  {
    id: "yamuna-2",
    name: "Yamuna House-2",
    houseMaster: "Shilpa Mam",
    houseLeader: "Savita",
    roommates: ["Savita", "Roopa"],
  },
];

export function getHousesForGender(gender) {
  return gender === "boys" ? boysHouses : girlsHouses;
}

export function getHouseById(gender, roomId) {
  return getHousesForGender(gender).find((h) => h.id === roomId) ?? null;
}
