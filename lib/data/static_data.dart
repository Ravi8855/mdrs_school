import 'models.dart';

class StaticData {
  // Principal
  static const Teacher principal = Teacher(
    name: "Eranna Arkera Sir",
    subject: "Principal",
    image: "assets/images/principal.jpg",
    bio: "Headmaster guiding and mentoring Morarji Desai Residential School students.",
  );

  // Faculty & Teachers
  static const List<Teacher> teachers = [
    Teacher(name: "Subhas Sir", subject: "Science", image: "assets/images/Subhas sir.jpg"),
    Teacher(name: "Bhagamma Mam", subject: "Social Science", image: "assets/images/Bhagamma mam.jpg"),
    Teacher(name: "Sumanth Sir", subject: "English", image: "assets/images/Sumanth sir.jpg"),
    Teacher(name: "Madivalappa Sir", subject: "Kannada", image: "assets/images/Madivalappa sir.jpg"),
    Teacher(name: "Mallu Sir", subject: "Health Care", image: "assets/images/Mallu sir.jpg"),
    Teacher(name: "Rajkumar Sir", subject: "Physical Education", image: "assets/images/Rajkumar sir.jpg"),
    Teacher(name: "Shantalingappa Sir", subject: "Kannada", image: "assets/images/Shantalingappa sir.jpg"),
    Teacher(name: "Chandru Sir", subject: "Hindi", image: "assets/images/Chandru sir.jpg"),
    Teacher(name: "Renuka Mam", subject: "English", image: "assets/images/Renuka mam.jpg"),
    Teacher(name: "Ashwini Mam", subject: "Computer Science", image: "assets/images/Ashwini mam.jpg"),
    Teacher(name: "Ramesh Sir", subject: "Singing & Arts", image: "assets/images/Ramesh sir.jpg"),
  ];

  // Hostel Houses
  static const List<HostelHouse> hostelHouses = [
    HostelHouse(
      id: "krishna",
      name: "Krishna House",
      gender: "boys",
      houseMaster: "Subhas Sir",
      houseLeader: "Ambadas",
      roommates: ["Marilinga", "Ningappa", "Golallappa", "Ambadas"],
    ),
    HostelHouse(
      id: "bhima",
      name: "Bhima House",
      gender: "boys",
      houseMaster: "Madivalappa Sir",
      houseLeader: "Arun",
      roommates: ["Sunil", "Praveen", "Chandrashekar", "Arun"],
    ),
    HostelHouse(
      id: "sindhu",
      name: "Sindhu House",
      gender: "boys",
      houseMaster: "Chandru Sir",
      houseLeader: "Ravi",
      roommates: ["Bhimashankar", "Bhimu", "Vinod", "Ravi"],
    ),
    HostelHouse(
      id: "godhawari",
      name: "Godhawari House",
      gender: "boys",
      houseMaster: "Rajkumar Sir",
      houseLeader: "Hrutik",
      roommates: ["Jatteppa", "Mallikarjun", "Viresh", "Mahesh", "Hrutik"],
    ),
    HostelHouse(
      id: "kaveri",
      name: "Kaveri House",
      gender: "girls",
      houseMaster: "Renuka Mam",
      houseLeader: "Chaitra",
      roommates: ["Shweta", "Umashree", "Parvati", "Ambika", "Chaitra"],
    ),
    HostelHouse(
      id: "yamuna",
      name: "Yamuna House",
      gender: "girls",
      houseMaster: "Shilpa Mam",
      houseLeader: "Suchitra",
      roommates: ["Mamtha", "Savita", "Roopa", "Suchitra"],
    ),
    HostelHouse(
      id: "ganga",
      name: "Ganga House",
      gender: "girls",
      houseMaster: "Bhagamma Mam",
      houseLeader: "Prema",
      roommates: ["Shreedevi", "Sharanamma", "Prema"],
    ),
  ];

  // Alumni Directory
  static const List<AlumniMember> alumniMembers = [
    AlumniMember(
      name: "Viresh",
      qual: "MBBS in Russia",
      qualification: "Medical (MBBS)",
      collegeUniversity: "Mari State University, Russia",
      location: "Russia",
      image: "assets/images/Viresh.jpg",
    ),
    AlumniMember(
      name: "Ambadas",
      qual: "Medical (BAMS) in Bidar",
      qualification: "Medical (BAMS)",
      collegeUniversity: "Sri Sidharameshwar Ayurvedic Medical College",
      location: "Bidar",
      image: "assets/images/Ambadas.jpeg",
    ),
    AlumniMember(
      name: "Arun",
      qual: "Medical (BAMS) in Udupi",
      qualification: "Medical (BAMS)",
      collegeUniversity: "SDM Ayurvedic Medical College, Udupi",
      location: "Udupi",
      image: "assets/images/Arun.jpeg",
    ),
    AlumniMember(
      name: "Ravi",
      qual: "Engineering (CSE) in Mysore",
      qualification: "Engineering (CSE)",
      collegeUniversity: "VTU Mysore",
      location: "Mysore",
      image: "assets/images/Ravi.png",
    ),
    AlumniMember(
      name: "Ambika",
      qual: "M.Sc Forensic Science in Bangalore",
      qualification: "Masters in Forensic Science",
      collegeUniversity: "Christ University",
      location: "Bangalore",
      image: "assets/images/Ambika.jpeg",
    ),
    AlumniMember(
      name: "Hrutik",
      qual: "Medical (BHMS) in Dharwad",
      qualification: "Medical (BHMS)",
      collegeUniversity: "Dharwad University",
      location: "Dharwad",
      image: "assets/images/Hrutik.jpeg",
    ),
    AlumniMember(
      name: "Golallappa",
      qual: "M.Com (ongoing)",
      qualification: "M.Com",
      collegeUniversity: "Gulbarga University",
      location: "Kalaburagi",
      image: "assets/images/Golallappa.jpeg",
    ),
    AlumniMember(
      name: "Marilinga",
      qual: "B.Com in Bangalore",
      qualification: "B.Com",
      collegeUniversity: "Bangalore University",
      location: "Bangalore",
      image: "assets/images/Marilinga.jpeg",
    ),
    AlumniMember(
      name: "Chandrashekar",
      qual: "B.A in Yadagir",
      qualification: "B.A",
      location: "Yadgir",
      image: "assets/images/Chandrashekar.jpeg",
    ),
    AlumniMember(
      name: "Jattappa",
      qual: "2nd PUC (working)",
      image: "assets/images/Jattappa.jpeg",
    ),
    AlumniMember(
      name: "Bhimashankar",
      qual: "PU Science in Bangalore",
      image: "assets/images/Bhimashankar.jpeg",
    ),
    AlumniMember(
      name: "Bhimu",
      qual: "Paramedical Lab Technician",
      image: "assets/images/Bhimu.jpeg",
    ),
    AlumniMember(
      name: "Prema",
      qual: "B.Sc Final Year in Surapur",
      image: "assets/images/Prema.jpeg",
    ),
    AlumniMember(
      name: "Chaitra",
      qual: "Paramedical & B.Sc CBZ Degree",
      image: "assets/images/Chaitra.jpeg",
    ),
    AlumniMember(
      name: "Parvati",
      qual: "B.A Final Year in Surapur",
      image: "assets/images/Parvati.jpg",
    ),
    AlumniMember(
      name: "Umashree",
      qual: "B.Sc Final Year in Surapur",
      image: "assets/images/Umashree.jpg",
    ),
    AlumniMember(
      name: "Ganga",
      qual: "B.Sc Nursing 3rd Year in Raichur",
      image: "assets/images/Ganga.jpeg",
    ),
    AlumniMember(
      name: "Roopa",
      qual: "2nd PUC",
      image: "assets/images/Roopa.jpeg",
    ),
    AlumniMember(
      name: "Shweta",
      qual: "B.Sc Nursing in Gulbarga",
      image: "assets/images/Shweta.jpg",
    ),
    AlumniMember(
      name: "Vinod",
      qual: "B.A in Vijayapur",
      image: "assets/images/Vinod.jpg",
    ),
    AlumniMember(
      name: "Mahesh",
      qual: "B.A in Shahapur",
      image: "assets/images/Mahesh.jpeg",
    ),
    AlumniMember(
      name: "Praveen",
      qual: "PUC in Shahapur",
      image: "assets/images/Praveen.jpeg",
    ),
    AlumniMember(
      name: "Sunil",
      qual: "Paramedical (working)",
      image: "assets/images/Sunil.jpeg",
    ),
    AlumniMember(
      name: "Bheembai",
      qual: "B.A in Gulbarga",
      image: "assets/images/Bheembai.jpeg",
    ),
    AlumniMember(
      name: "Suvarna",
      qual: "B.Sc Nursing",
      image: "assets/images/Suvarna.jpeg",
    ),
    AlumniMember(
      name: "Suchitra",
      qual: "Nursing",
      image: "assets/images/Suchitra.jpeg",
    ),
    AlumniMember(
      name: "Savita",
      qual: "B.Sc (CBZ)",
      image: "assets/images/Savita.jpeg",
    ),
    AlumniMember(
      name: "Mallamma",
      qual: "Diploma in Nursing",
      image: "assets/images/Mallamma.jpeg",
    ),
  ];

  // Batch Class Lists
  static const List<String> batch2013 = [
    "Ayyappa Swamy", "Karan", "Bhimashankar", "Prashant", "Shivakumar",
    "Siddaling", "Anand", "Ashok Rathod", "Mallikarjun", "Praveen Patil",
    "Pavan", "Mounesh", "Ajay", "Kodachi (Siddanna)", "Praveen",
    "Bhojappa", "Arun Chawan", "Chandrashekar", "Bhagesh"
  ];

  static const List<String> batch2014 = [
    "Gyanappa", "Revansiddappa", "Prakash", "Ramesh", "Mahesh",
    "Kiran Kumara", "Ashok", "Jattappa", "Arun", "Sanjay",
    "Devaraj", "Venugopal", "Kaif", "Musthafa", "Rahul",
    "Kaveri", "Laxmi", "Radhika", "Sangita", "Bhagyashree",
    "Sakareppa", "Hulagappa", "Aishwarya", "Sharanamma", "Girija",
    "Prashant Rathod", "Chandu", "Suma", "Vanitha", "Uma", "Roopa"
  ];

  static const List<String> batch2015 = [
    "Ambadas", "Arun", "Bhimu", "Bhimashankar", "Hrutik", "Jattappa",
    "Ningappa", "Mallikarjun", "Marilinga", "Ravi", "Vinod", "Viresh",
    "Chandrashekar", "Gollalappa", "Sunil", "Ambika", "Bheembai",
    "Chaitra", "Ganga", "Mallamma", "Ningamma", "Parvati", "Prema",
    "Roopa", "Savita", "Sharanamma", "Shweta", "Shweta H", "Suvarna",
    "Umashree", "Mahesh", "Praveen", "Suchitra", "Shreedevi", "Mamtha", "Archana"
  ];

  static const List<String> batch2016 = [
    "Darshan", "Vireesh", "Dhanaraddi", "Ravi.P", "Ravi.M",
    "Yallappa", "Lingaraja", "Shweta", "Sangita", "Kavya",
    "Mallappa.R", "Sharanamma", "Minakshi", "Mahuli", "Aishwarya", "Gurunath"
  ];

  static const List<String> batch2017 = [
    "Prajwal N", "Prajwal Gonal", "Kailasa", "Vishal", "Rahul Rathod",
    "Rahul Bahadur", "Anil", "Kallappa", "Manju Devaraja", "Basavaraja",
    "Maryappa", "Channabasava", "Subhash", "Sudhakar", "Gopal",
    "Bhagyashree", "Pavitra", "Sona", "Niveditha", "Geeta",
    "Geeta Pawar", "Irshad Begum", "Shashikala", "Suprita", "Ashwini",
    "Laxmi", "Akash", "Amoghsidda", "Abhishek", "Parshuram",
    "Mareamma", "Aishwarya", "Sharada M", "Sharada", "Monika", "Pooja"
  ];

  // Voting Categories
  static const List<VotingCategory> votingCategories = [
    VotingCategory(
      id: "comedian",
      emoji: "😂",
      title: "Class Comedian",
      subtitle: "Who always made everyone laugh?",
      nominees: [
        VotingNominee(id: "c_viresh", name: "Viresh"),
        VotingNominee(id: "c_mallamma", name: "Mallamma"),
        VotingNominee(id: "c_gollalappa", name: "Gollalappa"),
        VotingNominee(id: "c_chaitra", name: "Chaitra"),
      ],
    ),
    VotingCategory(
      id: "same_person",
      emoji: "🔄",
      title: "Still Same Person (No Change)",
      subtitle: "Who never really changed?",
      nominees: [
        VotingNominee(id: "s_suvarna", name: "Suvarna"),
        VotingNominee(id: "s_viresh", name: "Viresh"),
        VotingNominee(id: "s_mahesh", name: "Mahesh"),
        VotingNominee(id: "s_vinod", name: "Vinod"),
      ],
    ),
    VotingCategory(
      id: "non_stop_talker",
      emoji: "💬",
      title: "Non-Stop Talker",
      subtitle: "Who could talk for hours without stopping?",
      nominees: [
        VotingNominee(id: "t_shweta", name: "Shweta"),
        VotingNominee(id: "t_prema", name: "Prema"),
        VotingNominee(id: "t_suchitra", name: "Suchitra"),
        VotingNominee(id: "t_Bhimu", name: "Bhimu"),
      ],
    ),
    VotingCategory(
      id: "confused_confident",
      emoji: "😅",
      title: "Confused But Confident",
      subtitle: "Always smiling through the confusion",
      nominees: [
        VotingNominee(id: "cc_ganga", name: "Ganga"),
        VotingNominee(id: "cc_ambika", name: "Ambika"),
        VotingNominee(id: "cc_ambadas", name: "Ambadas"),
        VotingNominee(id: "cc_umashree", name: "Umashree"),
      ],
    ),
    VotingCategory(
      id: "silent_innocent",
      emoji: "🤫",
      title: "Silent & Innocent",
      subtitle: "The quietest souls in the batch",
      nominees: [
        VotingNominee(id: "si_ningamma", name: "Ningamma"),
        VotingNominee(id: "si_parvati", name: "Parvati"),
        VotingNominee(id: "si_bhimashankar", name: "Bhimashankar"),
        VotingNominee(id: "si_sunil", name: "Sunil"),
      ],
    ),
    VotingCategory(
      id: "hunters",
      emoji: "🎯",
      title: "The Hunters",
      subtitle: "Always planning the next adventure",
      nominees: [
        VotingNominee(id: "h_chandrashekar", name: "Chandrashekar"),
        VotingNominee(id: "h_jatteppa", name: "Jatteppa"),
        VotingNominee(id: "h_marilinga", name: "Marilinga"),
        VotingNominee(id: "h_ningappa", name: "Ningappa"),
      ],
    ),
    VotingCategory(
      id: "debate_champion",
      emoji: "🏆",
      title: "Debate Champion",
      subtitle: "Who argues like a Supreme Court lawyer?",
      nominees: [
        VotingNominee(id: "dc_mallamma", name: "Mallamma"),
        VotingNominee(id: "dc_roopa", name: "Roopa"),
        VotingNominee(id: "dc_hrutik", name: "Hrutik"),
        VotingNominee(id: "dc_arun", name: "Arun"),
      ],
    ),
  ];

  // Gallery Photos
  static const List<String> galleryPhotos = [
    "assets/gallery/00.jpg",
    "assets/gallery/05.jpg",
    "assets/gallery/08.jpg",
    "assets/gallery/09.jpg",
    "assets/gallery/2.jpg",
    "assets/gallery/21.jpg",
    "assets/gallery/22.jpg",
    "assets/gallery/23.jpg",
    "assets/gallery/33.jpg",
    "assets/gallery/img1.jpg",
    "assets/gallery/img2.jpg",
    "assets/gallery/img3.jpg",
    "assets/gallery/img4.jpg",
    "assets/gallery/img6.jpg",
    "assets/gallery/img9.jpg",
    "assets/gallery/img10.jpg",
    "assets/gallery/img11.jpg",
    "assets/gallery/img12.jpg",
  ];
}
