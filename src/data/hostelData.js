/** Boys hostel — exact copy of provided data */
export const boysHouses = [
  {
    id: "krishna",
    name: "Krishna House",
    houseMaster: "Subhas Sir",
    houseLeader: "Ambadas",
    roommates: ["Marilinga", "Ningappa", "Viresh", "Golallappa", "Ambadas"],
  },
  {
    id: "bhima",
    name: "Bhima House",
    houseMaster: "Ramesh Sir",
    houseLeader: "Arun",
    roommates: ["Sunil","Praveen" , "Arun"],
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
    roommates: ["Jatteppa", "Mallikarjun", "Praveen", "Mahesh", "Hrutik"],
  },
];

/** Girls hostel — placeholder until data is available */
export const girlsHouses = [];

export function getHousesForGender(gender) {
  return gender === "boys" ? boysHouses : girlsHouses;
}

export function getHouseById(gender, roomId) {
  return getHousesForGender(gender).find((h) => h.id === roomId) ?? null;
}
