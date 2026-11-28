import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../data/student_zone_model.dart';

class StudentZoneService {
  static const String _storageKey = 'mdrs_students_zone_all_batches_v9';
  static const String _adminPinKey = 'mdrs_students_zone_admin_pin';
  static const String defaultPin = '2013';

  static const List<String> availableBatches = [
    '2013',
    '2014',
    '2015',
    '2016',
    '2017'
  ];

  static final ValueNotifier<List<StudentZoneEntry>> entriesNotifier =
      ValueNotifier<List<StudentZoneEntry>>([]);

  static bool _initialized = false;

  static List<StudentZoneEntry> get defaultEntries => [
        // ==========================================
        // BATCH 2013
        // ==========================================
        // --- TOPPERS ---
        const StudentZoneEntry(
          id: '2013_top_1',
          name: 'Ayyappa Swami',
          batch: '2013',
          category: StudentCategory.topper,
          tag: 'SSLC Distinction • Class Leader',
          badge: '🏆 Academic All-Rounder',
          rankOrDetail: 'Rank 1 • Distinction',
          image: null,
          description:
              'Balanced academics and campus leadership effortlessly. Kept the morning assembly in perfect order while maintaining top test grades all year round.',
        ),
        const StudentZoneEntry(
          id: '2013_top_2',
          name: 'Prashant',
          batch: '2013',
          category: StudentCategory.topper,
          tag: 'SSLC 94.6% • Mathematics Genius',
          badge: '⭐ School 1st Rank',
          rankOrDetail: 'Rank 2 • Math Master',
          image: null,
          description:
              'Never missed a class, solved advanced theorems before teachers finished on the blackboard, and led group study sessions that helped everyone pass mathematics.',
        ),
        const StudentZoneEntry(
          id: '2013_top_3',
          name: 'Praveen Patil',
          batch: '2013',
          category: StudentCategory.topper,
          tag: 'Science & Technology Star',
          badge: '🥇 Science Star',
          rankOrDetail: 'Distinction Achiever',
          image: null,
          description:
              'Consistently scored top marks across science and mathematics, brilliant problem solver, and represented MDRS in district competitions.',
        ),

        // --- WANTED ---
        const StudentZoneEntry(
          id: '2013_wnt_1',
          name: 'Karan',
          batch: '2013',
          category: StudentCategory.wanted,
          tag: 'Midnight Mess Smuggler',
          badge: '🚨 Bounty: 10 Mangoes',
          rankOrDetail: 'Most Wanted #1',
          image: null,
          description:
              'Wanted for executing midnight raids on the hostel kitchen to smuggle hot puris, crunchy papads, and raw mangoes with chili powder without alerting the warden.',
        ),
        const StudentZoneEntry(
          id: '2013_wnt_3',
          name: 'Anand',
          batch: '2013',
          category: StudentCategory.wanted,
          tag: 'Paper Plane Ace & Chalk Smuggler',
          badge: '🎯 Classroom Prankster',
          rankOrDetail: 'Master of Chaos',
          image: null,
          description:
              'Wanted for launching precision aerodynamic paper jets across the classroom and hiding teachers\' chalk sticks inside the science globe.',
        ),

        // --- BACKBENCHERS ---
        const StudentZoneEntry(
          id: '2013_bb_1',
          name: 'Shivukumar',
          batch: '2013',
          category: StudentCategory.backbencher,
          tag: 'Corner Bench Philosopher & Zen Master',
          badge: '👑 King of Bench #5',
          rankOrDetail: 'Zen Emperor',
          image: null,
          description:
              'Ruled the last bench with calm wisdom. Perfected the art of peaceful daydreaming during theory classes while always keeping classmates entertained.',
        ),
        const StudentZoneEntry(
          id: '2013_bb_2',
          name: 'Kodachi',
          batch: '2013',
          category: StudentCategory.backbencher,
          tag: 'Last Bench Humorist & Excuses Legend',
          badge: '🎭 Master of Excuses',
          rankOrDetail: 'Desk Humorist',
          image: null,
          description:
              'Could invent 100+ hilarious excuses on the spot for missing homework. The undisputed entertainer of the back row who kept everyone laughing.',
        ),
        const StudentZoneEntry(
          id: '2013_bb_3',
          name: 'Mallikarjun',
          batch: '2013',
          category: StudentCategory.backbencher,
          tag: 'Desk Drummer & Silent Commentator',
          badge: '📻 Back Row Radio',
          rankOrDetail: 'Classroom Musician',
          image: null,
          description:
              'Could play full beats using pen refills on wooden desks and provided ball-by-ball whispered commentary during cricket match days.',
        ),

        // ==========================================
        // BATCH 2014
        // ==========================================
        // --- TOPPERS ---
        const StudentZoneEntry(
          id: '2014_top_1',
          name: 'Devaraj',
          batch: '2014',
          category: StudentCategory.topper,
          tag: 'SSLC Distinction • Mathematics Ace',
          badge: '🏆 Batch 1st Rank',
          rankOrDetail: 'Rank 1 • Distinction',
          image: null,
          description:
              'Top scorer in board examinations with distinction. Mastered complex mathematics formulas and led group study circles for the entire batch.',
        ),
        const StudentZoneEntry(
          id: '2014_top_2',
          name: 'Laxmi',
          batch: '2014',
          category: StudentCategory.topper,
          tag: 'Science & Biology Star',
          badge: '⭐ Science Distinction',
          rankOrDetail: 'Science Topper',
          image: null,
          description:
              'Scored top marks in science practicals. Known for flawless diagram notes and disciplined study habits throughout high school.',
        ),
        const StudentZoneEntry(
          id: '2014_top_3',
          name: 'Radhika',
          batch: '2014',
          category: StudentCategory.topper,
          tag: 'Kannada & English Gold Medalist',
          badge: '🥇 Language Maestro',
          rankOrDetail: 'State Shield Winner',
          image: null,
          description:
              'Won inter-school essay and debate competitions. Her handwriting and exam answers were used as sample benchmarks for the juniors.',
        ),
        const StudentZoneEntry(
          id: '2014_top_4',
          name: 'Kaif',
          batch: '2014',
          category: StudentCategory.topper,
          tag: 'Social Science & Quiz Champion',
          badge: '🎖️ All-Round Achiever',
          rankOrDetail: 'Quiz Star',
          image: null,
          description:
              'Memorized all historical timelines and constitutional articles with effortless recall. High scorer across all internal and board exams.',
        ),

        // --- WANTED ---
        const StudentZoneEntry(
          id: '2014_wnt_1',
          name: 'Kiran',
          batch: '2014',
          category: StudentCategory.wanted,
          tag: 'Hostel Terrace Commander',
          badge: '🚨 Most Wanted #1',
          rankOrDetail: 'Night Outlaw',
          image: 'assets/images/Kiran.jpg',
          description:
              'Wanted for leading unauthorized late-night terrace stargazing expeditions and sneaking out to buy hot samosas before evening study hour.',
        ),
        const StudentZoneEntry(
          id: '2014_wnt_2',
          name: 'Sakkarappa',
          batch: '2014',
          category: StudentCategory.wanted,
          tag: 'Mess Sugar & Jaggery Smuggler',
          badge: '🍬 Sweet Tooth Bandit',
          rankOrDetail: 'Pantry Phantom',
          image: null,
          description:
              'Wanted for stealthily raiding the hostel pantry at 1:30 AM to liberate sugar and jaggery jars for the midnight dormitory tea parties.',
        ),
        const StudentZoneEntry(
          id: '2014_wnt_3',
          name: 'Sanjaya',
          batch: '2014',
          category: StudentCategory.wanted,
          tag: 'Fake Bell & Footstep Master',
          badge: '🎭 Mimicry Legend',
          rankOrDetail: 'Master Trickster',
          image: null,
          description:
              'Wanted for mimicking the warden\'s whistle and footsteps outside the dormitory, causing 40 students to dive under their beds in panic.',
        ),
        const StudentZoneEntry(
          id: '2014_wnt_4',
          name: 'Gyanappa',
          batch: '2014',
          category: StudentCategory.wanted,
          tag: 'Secret Corridor Navigator',
          badge: '🕵️ Campus Phantom',
          rankOrDetail: 'Boundary Crosser',
          image: null,
          description:
              'Wanted for finding secret shortcuts around the school boundary and orchestrating covert hostel cricket matches behind the overhead water tank.',
        ),

        // --- BACKBENCHERS ---
        const StudentZoneEntry(
          id: '2014_bb_1',
          name: 'Revansiddappa',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Last Bench Philosopher & Leader',
          badge: '👑 King of Bench #4',
          rankOrDetail: 'Last Bench Boss',
          image: null,
          description:
              'Reigned supreme over the fourth bench. Held discussions on whether hostel food could be sent to space while pretending to write notes.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_2',
          name: 'Ashok',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Undetected Afternoon Napper',
          badge: '😴 Sleep Grandmaster',
          rankOrDetail: 'Siesta King',
          image: null,
          description:
              'Could fall into deep slumber while propping his chin on his pencil box, nodding occasionally as if in deep agreement with the teacher.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_3',
          name: 'Sharanamma',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Whisper Queen & Storyteller',
          badge: '💬 Non-Stop Talker',
          rankOrDetail: 'Classroom Narrator',
          image: null,
          description:
              'Could narrate an entire 3-hour movie plot in whispers during a single grammar period without catching the teacher\'s attention.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_4',
          name: 'Kaveri',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Back Row Cartoonist & Artist',
          badge: '🎨 Notebook Doodler',
          rankOrDetail: 'Creative Mind',
          image: null,
          description:
              'Filled the margins of every textbook with hilarious caricatures of school life and comic strips of classroom antics.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_5',
          name: 'Sangita',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Desk Humming Virtuoso',
          badge: '🎵 Melodious Singer',
          rankOrDetail: 'Corner Singer',
          image: null,
          description:
              'Hummed popular film melodies in the back corner with such subtle resonance that students thought the classroom had background music.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_6',
          name: 'Bhagyashree',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Chakli & Mixture Distributor',
          badge: '🍿 Snack Smuggler',
          rankOrDetail: 'Foodie Captain',
          image: null,
          description:
              'Mastered the art of passing home-made snacks under desks from the back row all the way to the second row without making a sound.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_7',
          name: 'Rahul',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Heavyweight Desk Combatant',
          badge: '⚔️ Pen Fight Legend',
          rankOrDetail: 'Arena Ruler',
          image: null,
          description:
              'Engineered heavily weighted combat pens with erasers and grip tape. Ruled the 2014 backbench desk tournament arena.',
        ),
        const StudentZoneEntry(
          id: '2014_bb_8',
          name: 'Ramesh',
          batch: '2014',
          category: StudentCategory.backbencher,
          tag: 'Garden Cricket Specialist',
          badge: '🏏 Pitch Contractor',
          rankOrDetail: 'Sports Enthusiast',
          image: null,
          description:
              'Designed miniature cricket games using ruler bats and crumpled paper balls in the back row during rainy day study hours.',
        ),

        // ==========================================
        // BATCH 2015
        // ==========================================
        // --- TOPPERS ---
        const StudentZoneEntry(
          id: '2015_top_1',
          name: 'Savita',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'B.Sc (CBZ) Scholar • Science Star',
          badge: '🏆 Academic Star',
          rankOrDetail: 'Science Distinction',
          image: 'assets/images/Savita.jpeg',
          description:
              'Academic star in biological sciences and chemistry. Known for exemplary laboratory records, diagram accuracy, and board exam distinction.',
        ),
        const StudentZoneEntry(
          id: '2015_top_2',
          name: 'Ambadas',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'Medical (BAMS) • Bidar',
          badge: '⭐ Ayurveda Scholar',
          rankOrDetail: 'Top Scorer',
          image: 'assets/images/Ambadas.jpeg',
          description:
              'Mastered biology diagrams and Sanskrit terminology. Led Krishna House with dedication and outstanding academic distinction.',
        ),
        const StudentZoneEntry(
          id: '2015_top_3',
          name: 'Hrutik',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'Medical (BHMS) • Dharwad',
          badge: '🥇 Medical Scholar',
          rankOrDetail: 'Science & Math Ace',
          image: 'assets/images/Hrutik.jpeg',
          description:
              'High scorer in science and mathematics. Dedicated scholar pursuing homeopathic medicine, always leading academic group study circles.',
        ),
        const StudentZoneEntry(
          id: '2015_top_4',
          name: 'Suchitra',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'Nursing & Healthcare Star',
          badge: '🌟 Yamuna House Leader',
          rankOrDetail: 'Distinction Achiever',
          image: 'assets/images/Suchitra.jpeg',
          description:
              'Led Yamuna House with calm authority and distinction. Top scorer in biological sciences, health education, and campus discipline.',
        ),
        const StudentZoneEntry(
          id: '2015_top_5',
          name: 'Prema',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'B.Sc Final Year • Surapur',
          badge: '🎖️ Ganga House Leader',
          rankOrDetail: 'Debate Champion',
          image: 'assets/images/Prema.jpeg',
          description:
              'Distinguished academic record and house leader of Ganga House. Winner of multiple inter-school essay, speech, and science exhibitions.',
        ),
        const StudentZoneEntry(
          id: '2015_top_6',
          name: 'Ganga',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'B.Sc Nursing • Raichur',
          badge: '🩺 Healthcare Scholar',
          rankOrDetail: 'Science Distinction',
          image: 'assets/images/Ganga.jpeg',
          description:
              'Excellence in science and healthcare studies. Dedicated to medical service with consistent top grades throughout her years at MDRS.',
        ),
        const StudentZoneEntry(
          id: '2015_top_7',
          name: 'Shweta',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'B.Sc Nursing • Gulbarga',
          badge: '📚 Honor Roll',
          rankOrDetail: 'Biology Topper',
          image: 'assets/images/Shweta.jpg',
          description:
              'Top performer in biology practicals and written board exams. Consistent honor roll student, disciplined scholar, and beloved classmate.',
        ),
        const StudentZoneEntry(
          id: '2015_top_8',
          name: 'Ambika',
          batch: '2015',
          category: StudentCategory.topper,
          tag: 'M.Sc Forensic Science • Christ University',
          badge: '🔬 Forensic Scientist',
          rankOrDetail: '90%+ Board Exam',
          image: 'assets/images/Ambika.jpeg',
          description:
              'Brilliant analytical mind in forensic science and chemistry. Maintained over 90% across board exams and regional science fairs.',
        ),

        // --- WANTED ---
        const StudentZoneEntry(
          id: '2015_wnt_1',
          name: 'Mallikarjun',
          batch: '2015',
          category: StudentCategory.wanted,
          tag: 'Mess Ration Inspector',
          badge: '🚨 Most Wanted #1',
          rankOrDetail: 'Midnight Snacker',
          image: null,
          description:
              'Wanted for sneaking into the mess storeroom to inspect the crispiness of hot jalebis and distributing evening snacks before study hours.',
        ),
        const StudentZoneEntry(
          id: '2015_wnt_2',
          name: 'Marilinga',
          batch: '2015',
          category: StudentCategory.wanted,
          tag: 'Sleep Escape Artist',
          badge: '😴 Nap Master',
          rankOrDetail: 'B.Com • Bangalore',
          image: 'assets/images/Marilinga.jpeg',
          description:
              'Wanted for mastering the art of sleeping with his eyes half open during two continuous social science periods without dropping his spectacles.',
        ),
        const StudentZoneEntry(
          id: '2015_wnt_3',
          name: 'Viresh',
          batch: '2015',
          category: StudentCategory.wanted,
          tag: 'Hostel Rooftop Commander',
          badge: '🌍 Global Outlaw',
          rankOrDetail: 'MBBS in Russia',
          image: 'assets/images/Viresh.jpg',
          description:
              'Wanted for planning complex midnight hostel rooftop excursions and leading international medical adventures all the way to Russia.',
        ),
        const StudentZoneEntry(
          id: '2015_wnt_4',
          name: 'Sharanamma',
          batch: '2015',
          category: StudentCategory.wanted,
          tag: 'Corridor News Network Host',
          badge: '🗣️ Whisper Queen',
          rankOrDetail: 'Campus Broadcaster',
          image: null,
          description:
              'Wanted for running the unofficial girls hostel radio network, broadcasting campus news and laughter across dormitory windows after lights out.',
        ),
        const StudentZoneEntry(
          id: '2015_wnt_5',
          name: 'Bhimashankar',
          batch: '2015',
          category: StudentCategory.wanted,
          tag: 'Wall Climber & Boundary Breaker',
          badge: '🕵️ Hostel Phantom',
          rankOrDetail: 'PU Science • Bangalore',
          image: 'assets/images/Bhimashankar.jpeg',
          description:
              'Wanted for scaling the campus compound wall to retrieve lost cricket balls and slipping back into study hall completely undetected.',
        ),

        // --- BACKBENCHERS ---
        const StudentZoneEntry(
          id: '2015_bb_1',
          name: 'Arun',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Bhima House Leader & Witty Monarch',
          badge: '👑 Back Row King',
          rankOrDetail: 'Medical (BAMS) • Udupi',
          image: 'assets/images/Arun.jpeg',
          description:
              'Reigned over the last bench of Bhima House. Known for witty one-liners that kept the entire back row chuckling during study period.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_2',
          name: 'Vinod',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Hostel Night Philosopher',
          badge: '🌙 Night Owl',
          rankOrDetail: 'B.A in Vijayapur',
          image: 'assets/images/Vinod.jpg',
          description:
              'Held deep philosophical discussions under dormitory bedsheets with flashlights debating whether aliens would enjoy MDRS upma.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_3',
          name: 'Bhima',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Lab Tube Percussionist',
          badge: '🔬 Specimen Rebel',
          rankOrDetail: 'Paramedical Tech',
          image: 'assets/images/Bhimu.jpeg',
          description:
              'Mastered making musical sound effects using laboratory test tubes and kept an impressive personal collection of leaves in his dictionary.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_4',
          name: 'Jatteppa',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Aviation Chief & Pilot',
          badge: '✈️ 50-Meter Flight Ace',
          rankOrDetail: 'Aerodynamics Master',
          image: 'assets/images/Jattappa.jpeg',
          description:
              'Constructed aerodynamic twin-tail paper gliders that circled the ceiling fan three times before nose-diving onto the teacher\'s podium.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_5',
          name: 'Chaitra',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Staff Bell Impersonator',
          badge: '🎭 Mimicry Queen',
          rankOrDetail: 'Paramedical & B.Sc CBZ',
          image: 'assets/images/Chaitra.jpeg',
          description:
              'Imitated the staffroom bicycle bell so accurately that the entire girls hostel thought surprise inspection rounds were commencing.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_6',
          name: 'Mallamma',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Secret Snack Supply Chief',
          badge: '🍿 Snack Smuggler',
          rankOrDetail: 'Diploma in Nursing',
          image: 'assets/images/Mallamma.jpeg',
          description:
              'The undisputed distributor of homemade peanut chikki and spicy sev in the back row during long afternoon revision periods.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_7',
          name: 'Umashree',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Notebook Cartoonist',
          badge: '🎨 Doodle Artist',
          rankOrDetail: 'B.Sc Final Year',
          image: 'assets/images/Umashree.jpg',
          description:
              'Filled textbook margins with comic sketches of hostel life and secret backbench caricatures of teachers that circulated the whole class.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_8',
          name: 'Roopa',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Power Nap Specialist',
          badge: '💤 Siesta Connoisseur',
          rankOrDetail: '2nd PUC • Chill Queen',
          image: 'assets/images/Roopa.jpeg',
          description:
              'Could take a refreshing 10-minute power nap resting her head on an open geography atlas and wake up right when the bell rang.',
        ),
        const StudentZoneEntry(
          id: '2015_bb_9',
          name: 'Suvarna',
          batch: '2015',
          category: StudentCategory.backbencher,
          tag: 'Desk Rhythm Virtuoso',
          badge: '🎶 Back Row Melody',
          rankOrDetail: 'B.Sc Nursing',
          image: 'assets/images/Suvarna.jpeg',
          description:
              'Tapped out gentle rhythmic beats on the back of wooden benches that gave the back row its own soothing background music.',
        ),

        // ==========================================
        // BATCH 2016
        // ==========================================
        // --- TOPPERS ---
        const StudentZoneEntry(
          id: '2016_top_1',
          name: 'Viresh',
          batch: '2016',
          category: StudentCategory.topper,
          tag: 'SSLC Distinction • Mathematics Ace',
          badge: '🏆 Batch 1st Rank',
          rankOrDetail: 'Rank 1 • Distinction',
          image: null,
          description:
              'Top scorer in board examinations with distinction. Known for solving complex geometry and algebra problems before anyone else.',
        ),
        const StudentZoneEntry(
          id: '2016_top_2',
          name: 'Kavya',
          batch: '2016',
          category: StudentCategory.topper,
          tag: 'Biology & Science Star',
          badge: '⭐ Science Distinction',
          rankOrDetail: '99% Science',
          image: null,
          description:
              'Scored 99% in science practicals. Known for spotless botanical diagrams and outstanding examination performance.',
        ),
        const StudentZoneEntry(
          id: '2016_top_3',
          name: 'Aishwarya',
          batch: '2016',
          category: StudentCategory.topper,
          tag: 'Kannada & English Gold Medalist',
          badge: '🥇 Language Maestro',
          rankOrDetail: 'Essay Champion',
          image: null,
          description:
              'State essay and debate winner. Had immaculate handwriting and represented MDRS across multiple district-level competitions.',
        ),
        const StudentZoneEntry(
          id: '2016_top_4',
          name: 'Sangita',
          batch: '2016',
          category: StudentCategory.topper,
          tag: 'Social Science & Quiz Champion',
          badge: '🎖️ Academic Star',
          rankOrDetail: 'Quiz Winner',
          image: null,
          description:
              'Memorized all historical timelines, dates, and Indian constitution articles with ease. Consistent rank holder all year round.',
        ),
        const StudentZoneEntry(
          id: '2016_top_5',
          name: 'Sidda',
          batch: '2016',
          category: StudentCategory.topper,
          tag: 'All-Rounder • Academic Pillar',
          badge: '📚 Consistent Achiever',
          rankOrDetail: 'Honor Roll',
          image: null,
          description:
              'Balanced discipline, sports, and academics effortlessly. Guided study groups and helped classmates prepare for board exams.',
        ),

        // --- WANTED ---
        const StudentZoneEntry(
          id: '2016_wnt_1',
          name: 'Shweta',
          batch: '2016',
          category: StudentCategory.wanted,
          tag: 'Dormitory Radio Host',
          badge: '🚨 Most Wanted #1',
          rankOrDetail: 'Night Outlaw',
          image: null,
          description:
              'Wanted for running unauthorized late-night gossip broadcasts across dormitory windows and orchestrating midnight snack raids.',
        ),
        const StudentZoneEntry(
          id: '2016_wnt_2',
          name: 'Dhanaraddi',
          batch: '2016',
          category: StudentCategory.wanted,
          tag: 'Emergency Gong Bandit',
          badge: '🔔 False Alarm Legend',
          rankOrDetail: 'Chaos Maker',
          image: null,
          description:
              'Wanted for banging the brass emergency fire triangle with a spoon because a stray puppy entered the hostel playground.',
        ),
        const StudentZoneEntry(
          id: '2016_wnt_3',
          name: 'Ravi M',
          batch: '2016',
          category: StudentCategory.wanted,
          tag: 'Study Hour Mango Bandit',
          badge: '🥭 Orchard Raider',
          rankOrDetail: 'Hostel Phantom',
          image: null,
          description:
              'Wanted for sneaking fresh raw mangoes from the campus orchard into the evening study hall and peeling them with compass dividers.',
        ),
        const StudentZoneEntry(
          id: '2016_wnt_4',
          name: 'Lingaraja',
          batch: '2016',
          category: StudentCategory.wanted,
          tag: 'Staff Room Footstep Impersonator',
          badge: '🎭 Mimicry Outlaw',
          rankOrDetail: 'Master Trickster',
          image: null,
          description:
              'Wanted for mimicking the Headmaster\'s authoritative footsteps in the corridor, causing the entire class to dive into dead silence.',
        ),

        // --- BACKBENCHERS ---
        const StudentZoneEntry(
          id: '2016_bb_1',
          name: 'Mahuli',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Last Row Philosopher',
          badge: '👑 King of Corner Bench',
          rankOrDetail: 'Zen Master',
          image: null,
          description:
              'Reigned over the last bench with profound peace. Master of keeping a serious face while secretly making the back two benches laugh.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_2',
          name: 'Ravi P',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Hostel Stargazer & Dreamer',
          badge: '🌙 Night Owl',
          rankOrDetail: 'Sports Strategist',
          image: null,
          description:
              'Spent theory classes drawing constellation maps and designing evening volleyball tactics from the last bench.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_3',
          name: 'Minakshi',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Margin Doodler & Artist',
          badge: '🎨 Notebook Cartoonist',
          rankOrDetail: 'Creative Mind',
          image: null,
          description:
              'Filled textbook margins with funny caricatures of hostel life and secret backbench sketches that circulated the whole room.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_4',
          name: 'Yallappa',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Ruler & Pen Beatboxer',
          badge: '🥁 Desk Tabla Virtuoso',
          rankOrDetail: 'Classroom Musician',
          image: null,
          description:
              'Tapped out viral folk rhythms using two Natraj pencils on wooden desks during 5-minute teacher handover intervals.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_5',
          name: 'Sharanamma',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Non-Stop Storyteller',
          badge: '💬 Whisper Queen',
          rankOrDetail: 'Back Row Narrator',
          image: null,
          description:
              'Could narrate an entire 3-hour movie plot in continuous whispers throughout geography period without alerting the teacher.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_6',
          name: 'Mallappa',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Heavyweight Desk Combatant',
          badge: '⚔️ Pen Fight Legend',
          rankOrDetail: 'Arena Champion',
          image: null,
          description:
              'Engineered customized weighted pens with erasers and grip tape. Undefeated champion of the 2016 backbench desk arena.',
        ),
        const StudentZoneEntry(
          id: '2016_bb_7',
          name: 'Gurunath',
          batch: '2016',
          category: StudentCategory.backbencher,
          tag: 'Under-Desk Food Distributor',
          badge: '🍿 Snack Smuggler',
          rankOrDetail: 'Foodie Captain',
          image: null,
          description:
              'Expert at passing homemade roasted peanuts and crunchy chikkis from the back bench all the way to the front rows in total silence.',
        ),

        // ==========================================
        // BATCH 2017
        // ==========================================
        // --- TOPPERS ---
        const StudentZoneEntry(
          id: '2017_top_1',
          name: 'Bhagyashree',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'SSLC Distinction • Mathematics Centum',
          badge: '🏆 Batch 1st Rank',
          rankOrDetail: 'Rank 1 • Centum Math',
          image: null,
          description:
              'Scored perfect centum in mathematics and state distinction. Led study circles and assisted classmates across all difficult subjects.',
        ),
        const StudentZoneEntry(
          id: '2017_top_2',
          name: 'Gopal',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'Physics & Science Wizard',
          badge: '⭐ Science Distinction',
          rankOrDetail: 'Science Olympiad',
          image: null,
          description:
              'Excellence in theoretical and practical sciences. Won the inter-school science exhibition with innovative working electronics models.',
        ),
        const StudentZoneEntry(
          id: '2017_top_3',
          name: 'Mareamma',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'Kannada & Literature Star',
          badge: '🥇 Language Maestro',
          rankOrDetail: 'State Essay Champion',
          image: null,
          description:
              'State essay writing champion with handwriting that looked like computer font. Consistently topped semester evaluations and debates.',
        ),
        const StudentZoneEntry(
          id: '2017_top_4',
          name: 'Ashwini',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'Social Science & History Scholar',
          badge: '🎖️ Academic All-Rounder',
          rankOrDetail: 'Honor Roll',
          image: null,
          description:
              'Memorized all constitutional amendments, geography maps, and timelines effortlessly. Honor roll student throughout high school.',
        ),
        const StudentZoneEntry(
          id: '2017_top_5',
          name: 'Sharada',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'Biology & Environmental Science Star',
          badge: '🌟 Gold Star Achiever',
          rankOrDetail: 'Botany Star',
          image: null,
          description:
              'Spotless laboratory notebooks and top marks in botany taxonomy practicals. Dedicated, disciplined, and beloved scholar.',
        ),
        const StudentZoneEntry(
          id: '2017_top_6',
          name: 'Subash',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'General Knowledge & Trivia Ace',
          badge: '📚 Quiz & Debate Champion',
          rankOrDetail: 'Quiz Winner',
          image: null,
          description:
              'Rapid-fire champion who led the school quiz team to regional victory. Outstanding performance in high school board examinations.',
        ),
        const StudentZoneEntry(
          id: '2017_top_7',
          name: 'Niveditha',
          batch: '2017',
          category: StudentCategory.topper,
          tag: 'Distinction Star • School Pride',
          badge: '✨ High Scorer',
          rankOrDetail: 'Academic Distinction',
          image: null,
          description:
              'Quiet dedication, perfect attendance record, and stellar marks in both internal tests and final state board exams.',
        ),

        // --- WANTED ---
        const StudentZoneEntry(
          id: '2017_wnt_1',
          name: 'Manjunath',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Hostel Midnight Snack King',
          badge: '🚨 Most Wanted #1',
          rankOrDetail: 'Mess Phantom',
          image: null,
          description:
              'Wanted for organizing covert midnight mess store raids to procure extra jalebis and spicy mixture packets after nightly roll call.',
        ),
        const StudentZoneEntry(
          id: '2017_wnt_2',
          name: 'Kallappa',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Gate & Storeroom Locksmith',
          badge: '🗝️ Master of Keys',
          rankOrDetail: 'Campus Phantom',
          image: null,
          description:
              'Wanted for mysteriously possessing master duplicate keys to every sports cupboard, badminton box, and terrace door on campus.',
        ),
        const StudentZoneEntry(
          id: '2017_wnt_3',
          name: 'Anil',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Immersion Rod Master',
          badge: '🍜 Midnight Maggi Chef',
          rankOrDetail: 'Hostel Outlaw',
          image: null,
          description:
              'Wanted for constructing underground immersion heaters from shaving blades and copper wires to boil noodles in buckets at 1:30 AM.',
        ),
        const StudentZoneEntry(
          id: '2017_wnt_4',
          name: 'Sona',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Corridor Sound Effects Artist',
          badge: '🎭 Mimicry Outlaw',
          rankOrDetail: 'Master Trickster',
          image: null,
          description:
              'Wanted for mimicking the warden\'s footsteps and keys jingling outside dormitory rooms, causing 30 students to dive under beds in panic.',
        ),
        const StudentZoneEntry(
          id: '2017_wnt_5',
          name: 'Pavitra',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Secret Terrace Stargazer',
          badge: '🕵️ Dormitory Phantom',
          rankOrDetail: 'Night Outlaw',
          image: null,
          description:
              'Wanted for leading unauthorized rooftop stargazing expeditions and sneaking out to buy hot samosas before evening study hours.',
        ),
        const StudentZoneEntry(
          id: '2017_wnt_6',
          name: 'Abhishek',
          batch: '2017',
          category: StudentCategory.wanted,
          tag: 'Hostel Hallway Cricket Master',
          badge: '🏏 Pitch Contractor',
          rankOrDetail: 'Sports Bandit',
          image: null,
          description:
              'Wanted for transforming the first-floor hostel corridor into a bowling pitch with bathroom slippers as wickets on Sunday afternoons.',
        ),

        // --- BACKBENCHERS ---
        const StudentZoneEntry(
          id: '2017_bb_1',
          name: 'Geeta',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Last Bench Philosopher & Leader',
          badge: '👑 Queen of Corner Bench',
          rankOrDetail: 'Corner Boss',
          image: null,
          description:
              'Ruled the back row with calm authority. Master of keeping a straight face while cracking jokes that made the whole row giggle.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_2',
          name: 'Sudhakar',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Deep REM Afternoon Napper',
          badge: '😴 Sleep Grandmaster',
          rankOrDetail: 'Siesta King',
          image: null,
          description:
              'Perfected the art of leaning on his open social science atlas with his chin propped on his palm, nodding in pretend agreement.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_3',
          name: 'Shashikala',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Back Row Whisper Queen',
          badge: '💬 Non-Stop Storyteller',
          rankOrDetail: 'Class Narrator',
          image: null,
          description:
              'Could narrate an entire Kannada movie plot in whispers throughout a 45-minute grammar period without missing a single beat.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_4',
          name: 'Vishal',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: '50-Meter Paper Jet Architect',
          badge: '✈️ Aerodynamic Pilot',
          rankOrDetail: 'Aero Specialist',
          image: null,
          description:
              'Engineered supersonic paper gliders from notebook back covers that circled the ceiling fan before landing in the chalk box.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_5',
          name: 'Prajwal',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Window Watcher & Football Chief',
          badge: '⚽ Ground Strategist',
          rankOrDetail: 'Free Spirit',
          image: null,
          description:
              'Spent entire periods gazing out the corner window calculating wind speed and evening football match team formations.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_6',
          name: 'Laxami',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Under-Desk Mixture Distributor',
          badge: '🍿 Snack Smuggler',
          rankOrDetail: 'Foodie Captain',
          image: null,
          description:
              'Expert at secretly distributing homemade chakli and roasted peanuts under desks from the last row all the way to row two.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_7',
          name: 'Raghavendra',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Heavyweight Desk Combatant',
          badge: '⚔️ Pen Fight Legend',
          rankOrDetail: 'Arena Champion',
          image: null,
          description:
              'Engineered customized weighted pens with erasers and grip tape. Undefeated champion of the 2017 backbench desk arena.',
        ),
        const StudentZoneEntry(
          id: '2017_bb_8',
          name: 'Pavitra',
          batch: '2017',
          category: StudentCategory.backbencher,
          tag: 'Margin Doodler & Sketch Artist',
          badge: '🎨 Notebook Cartoonist',
          rankOrDetail: 'Creative Mind',
          image: null,
          description:
              'Filled textbook margins with funny caricatures of hostel life and secret backbench doodles that kept everyone entertained.',
        ),
      ];

  static Future<void> initialize() async {
    if (_initialized) return;
    await loadEntries();
    _initialized = true;
  }

  static Future<List<StudentZoneEntry>> loadEntries() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_storageKey);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List;
        final list = decoded.map((e) => StudentZoneEntry.fromMap(e)).toList();
        if (list.isNotEmpty) {
          entriesNotifier.value = list;
          return list;
        }
      }
    } catch (e) {
      debugPrint('[StudentZoneService] Load error: $e');
    }

    // Default seed for all batches
    final list = List<StudentZoneEntry>.from(defaultEntries);
    entriesNotifier.value = list;
    await _saveToStorage(list);
    return list;
  }

  static Future<void> addEntry(StudentZoneEntry entry) async {
    final current = List<StudentZoneEntry>.from(entriesNotifier.value);
    current.insert(0, entry);
    entriesNotifier.value = current;
    await _saveToStorage(current);
  }

  static Future<void> updateEntry(StudentZoneEntry entry) async {
    final current = List<StudentZoneEntry>.from(entriesNotifier.value);
    final idx = current.indexWhere((e) => e.id == entry.id);
    if (idx != -1) {
      current[idx] = entry;
      entriesNotifier.value = current;
      await _saveToStorage(current);
    }
  }

  static Future<void> deleteEntry(String id) async {
    final current = List<StudentZoneEntry>.from(entriesNotifier.value);
    current.removeWhere((e) => e.id == id);
    entriesNotifier.value = current;
    await _saveToStorage(current);
  }

  static Future<void> resetToDefaults() async {
    final list = List<StudentZoneEntry>.from(defaultEntries);
    entriesNotifier.value = list;
    await _saveToStorage(list);
  }

  static Future<bool> verifyAdminPin(String enteredPin) async {
    final prefs = await SharedPreferences.getInstance();
    final savedPin = prefs.getString(_adminPinKey) ?? defaultPin;
    return enteredPin.trim() == savedPin.trim();
  }

  static Future<void> setAdminPin(String newPin) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_adminPinKey, newPin.trim());
  }

  static Future<void> _saveToStorage(List<StudentZoneEntry> list) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = jsonEncode(list.map((e) => e.toMap()).toList());
      await prefs.setString(_storageKey, raw);
    } catch (e) {
      debugPrint('[StudentZoneService] Save error: $e');
    }
  }
}
