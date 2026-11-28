import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';
import 'speech_helper.dart';

class TeacherDialogue {
  final String id;
  final String name;
  final String subject;
  final String subjectKannada;
  final String dialogue;
  final String dialoguePhonetic;
  final String contextNote;
  final String voiceLang;
  final Color themeColor;
  final IconData icon;
  int laughCount;
  int heartCount;

  TeacherDialogue({
    required this.id,
    required this.name,
    required this.subject,
    required this.subjectKannada,
    required this.dialogue,
    required this.dialoguePhonetic,
    required this.contextNote,
    required this.voiceLang,
    required this.themeColor,
    required this.icon,
    this.laughCount = 24,
    this.heartCount = 48,
  });

  Map<String, dynamic> toMap() => {
        'id': id,
        'laughCount': laughCount,
        'heartCount': heartCount,
      };
}

class TeachersSoundboardScreen extends StatefulWidget {
  const TeachersSoundboardScreen({super.key});

  @override
  State<TeachersSoundboardScreen> createState() => _TeachersSoundboardScreenState();
}

class _TeachersSoundboardScreenState extends State<TeachersSoundboardScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _waveController;
  String? _currentlyPlayingId;
  String _selectedFilter = "All";

  final List<TeacherDialogue> _teachers = [
    TeacherDialogue(
      id: "revensiddappa",
      name: "Revansiddappa Sir",
      subject: "Mathematics",
      subjectKannada: "ಗಣಿತ",
      dialogue: "ಯಾಕೋಲೇ ತಮ್ಮ್ಯಾ... ಕೊಡ್ತೀನ್ ಕೊಡ್ತೀನ್ ನೋಡು ಒಂದ್ ಏಟು!",
      dialoguePhonetic: "Yakavoolee tammya kodata kodatin node ond yet!",
      contextNote: "ಲೆಕ್ಕ ತಪ್ಪು ಮಾಡಿದಾಗ ಅಥವಾ ಕ್ಲಾಸ್‌ನಲ್ಲಿ ನಕ್ಕಾಗ ಬರೋ ಕ್ಲಾಸಿಕ್ ಡೈಲಾಗ್!",
      voiceLang: "kn-IN",
      themeColor: const Color(0xFFD97706), // Amber Gold
      icon: Icons.calculate_rounded,
      laughCount: 89,
      heartCount: 142,
    ),
    TeacherDialogue(
      id: "shatlingappa",
      name: "Shantlingappa Sir",
      subject: "Kannada",
      subjectKannada: "ಕನ್ನಡ",
      dialogue: "ತಲೆಯೊಳಗೆ ಕತ್ತಲಿದ್ದರೆ ಬದುಕಿನಲ್ಲಿ ಬೆಳಕು ಹೇಗೆ ಬರುತ್ತದೆ? ಪದ್ಯವನ್ನು ರಾಗವಾಗಿ ಹೇಳಿ, ಇಲ್ಲದಿದ್ದರೆ 5 ರೌಂಡ್ ಗ್ರೌಂಡ್ ಸುತ್ತಬೇಕು!",
      dialoguePhonetic: "Taleyolage kattaliddare badukalli belaku hege barutte? Padyavannu ragavagi heli!",
      contextNote: "ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಪದ್ಯ ಕಂಠಪಾಠದ ಶಿಸ್ತು!",
      voiceLang: "kn-IN",
      themeColor: const Color(0xFFDC2626), // Ruby Crimson
      icon: Icons.menu_book_rounded,
      laughCount: 76,
      heartCount: 118,
    ),
    TeacherDialogue(
      id: "sumanth",
      name: "Sumanth Sir",
      subject: "English",
      subjectKannada: "ಇಂಗ್ಲಿಷ್",
      dialogue: "Hey! Stand up on the bench! Speak only in English in my class, don't talk like a fish market! What is the past tense of 'Go'?",
      dialoguePhonetic: "Open your English Reader page 42 and read loudly!",
      contextNote: "Strict English period — absolute pin-drop silence!",
      voiceLang: "en-IN",
      themeColor: const Color(0xFF2563EB), // Royal Blue
      icon: Icons.record_voice_over_rounded,
      laughCount: 94,
      heartCount: 165,
    ),
    TeacherDialogue(
      id: "bhagamma",
      name: "Bhagamma Mam",
      subject: "Social Science",
      subjectKannada: "ಸಮಾಜ ವಿಜ್ಞಾನ",
      dialogue: "ಭಾರತದ ನಕ್ಷೆ (Map Pointing) ಪೆನ್ಸಿಲ್‌ನಲ್ಲೇ ಗುರುತು ಮಾಡಿರಬೇಕು! ಇತಿಹಾಸ ನೆನಪಿಲ್ಲದಿದ್ದರೆ ಪರೀಕ್ಷೆಯಲ್ಲಿ 10 ಮಾರ್ಕ್ಸ್ ಕಟ್!",
      dialoguePhonetic: "Bharatada nakshe pencil-nalle gurutu madirabeku! Ithihasa nenapilladidre 10 marks cut!",
      contextNote: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಹಾಗೂ ನಕ್ಷೆ ಗುರುತಿಸುವ ಕ್ಲಾಸ್!",
      voiceLang: "kn-IN",
      themeColor: const Color(0xFF9333EA), // Purple
      icon: Icons.public_rounded,
      laughCount: 62,
      heartCount: 98,
    ),
    TeacherDialogue(
      id: "subhash",
      name: "Subash Sir",
      subject: "Science",
      subjectKannada: "ವಿಜ್ಞಾನ",
      dialogue: "ಹೇಯ್ ಯಾರ್ ಇವನು ಸತ್ಯಾನ್ ಸುವಾರ್! ಲ್ಯಾಬ್ ಉಪಕರಣಗಳನ್ನು ಮುಟ್ಟಿದರೆ ದಂಡ ಹಾಕ್ತೀನಿ!",
      dialoguePhonetic: "Heyy yar evanu sathyan suvar! Lab upakaranagalannu muttidre danda haktini!",
      contextNote: "ಸೈನ್ಸ್ ಲ್ಯಾಬ್ ಮತ್ತು ಫಿಸಿಕ್ಸ್ ಪ್ರಾಕ್ಟಿಕಲ್ಸ್ ಸಮಯದ ಪವರ್‌ಫುಲ್ ಮಾತು!",
      voiceLang: "kn-IN",
      themeColor: const Color(0xFF059669), // Emerald Green
      icon: Icons.science_rounded,
      laughCount: 120,
      heartCount: 198,
    ),
    TeacherDialogue(
      id: "chandru",
      name: "Chandru Sir",
      subject: "Hindi",
      subjectKannada: "ಹಿಂದಿ",
      dialogue: "अरे चुप बैठो! हिंदी दोहे और व्याकरण याद नहीं किया तो कल क्लास के बाहर खड़ा करूँगा! 'मुझे पानी चाहिए' बोलना सीखो!",
      dialoguePhonetic: "Are chup baitho! Hindi dohe yaad nahi kiya toh kal class ke bahar khada karunga!",
      contextNote: "ಕಬೀರ್ ಕೆ ದೋಹೆ ಮತ್ತು ಹಿಂದಿ ವ್ಯಾಕರಣ ತರಗತಿ!",
      voiceLang: "hi-IN",
      themeColor: const Color(0xFFEA580C), // Deep Orange
      icon: Icons.translate_rounded,
      laughCount: 81,
      heartCount: 134,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _waveController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    )..repeat(reverse: true);
    _loadReactions();
  }

  @override
  void dispose() {
    _waveController.dispose();
    stopDialogue();
    super.dispose();
  }

  Future<void> _loadReactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      for (final t in _teachers) {
        final laughs = prefs.getInt('teacher_laugh_${t.id}');
        final hearts = prefs.getInt('teacher_heart_${t.id}');
        if (laughs != null) t.laughCount = laughs;
        if (hearts != null) t.heartCount = hearts;
      }
      if (mounted) setState(() {});
    } catch (_) {}
  }

  Future<void> _incrementReaction(TeacherDialogue teacher, bool isHeart) async {
    HapticFeedback.lightImpact();
    setState(() {
      if (isHeart) {
        teacher.heartCount++;
      } else {
        teacher.laughCount++;
      }
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      if (isHeart) {
        await prefs.setInt('teacher_heart_${teacher.id}', teacher.heartCount);
      } else {
        await prefs.setInt('teacher_laugh_${teacher.id}', teacher.laughCount);
      }
    } catch (_) {}
  }

  void _playTeacherVoice(TeacherDialogue teacher) {
    HapticFeedback.mediumImpact();
    if (_currentlyPlayingId == teacher.id) {
      stopDialogue();
      setState(() => _currentlyPlayingId = null);
      return;
    }

    setState(() => _currentlyPlayingId = teacher.id);
    speakDialogue(teacher.dialogue, teacher.voiceLang, teacherId: teacher.id);

    // Auto reset indicator after 5 seconds
    Future.delayed(const Duration(milliseconds: 5000), () {
      if (mounted && _currentlyPlayingId == teacher.id) {
        setState(() => _currentlyPlayingId = null);
      }
    });
  }

  void _shareOnWhatsApp(TeacherDialogue teacher) async {
    final text = """
😂 *MDRS School - Legendary Teacher Dialogue* 👨‍🏫

*Teacher:* ${teacher.name} (${teacher.subject})
*Iconic Dialogue:*
"${teacher.dialogue}"

_${teacher.dialoguePhonetic}_

Remember this from our MDRS school days?! 💜
Download MDRS Alumni App to relive your hostel memories!
""";

    final url = Uri.parse('whatsapp://send?text=${Uri.encodeComponent(text)}');
    final webUrl = Uri.parse('https://wa.me/?text=${Uri.encodeComponent(text)}');

    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
        return;
      }
    } catch (_) {}

    try {
      await launchUrl(webUrl, mode: LaunchMode.externalApplication);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Could not open WhatsApp.")),
        );
      }
    }
  }

  List<TeacherDialogue> get _filteredTeachers {
    if (_selectedFilter == "All") return _teachers;
    if (_selectedFilter == "Languages") {
      return _teachers.where((t) => t.subject == "Kannada" || t.subject == "English" || t.subject == "Hindi").toList();
    }
    if (_selectedFilter == "Science & Maths") {
      return _teachers.where((t) => t.subject == "Mathematics" || t.subject == "Science").toList();
    }
    if (_selectedFilter == "Social") {
      return _teachers.where((t) => t.subject == "Social Science").toList();
    }
    return _teachers;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        title: Text(
          "Teachers' Soundboard",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 18, color: Colors.white),
        ),
        centerTitle: true,
        actions: const [],
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // Nostalgic Header Banner
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4C0519), Color(0xFF1A0208)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: AppColors.cardBorder),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(80),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withAlpha(40),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFF59E0B), width: 1.2),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.campaign_rounded, size: 14, color: Color(0xFFFCD34D)),
                            const SizedBox(width: 6),
                            Text(
                              "ಗುರುಗಳ ಧ್ವನಿ & ಡೈಲಾಗ್ಸ್",
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFFFCD34D),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Text(
                        "MDRS Nostalgia",
                        style: GoogleFonts.cinzel(fontSize: 11, color: Colors.white60, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "School Masters' Iconic Catchphrases",
                    style: GoogleFonts.cinzel(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Relive the legendary dialogues and memorable moments of our beloved teachers!",
                    style: GoogleFonts.poppins(
                      fontSize: 12.5,
                      color: const Color(0xFFCBD5E1),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Filter Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterChip("All"),
                        const SizedBox(width: 8),
                        _buildFilterChip("Science & Maths"),
                        const SizedBox(width: 8),
                        _buildFilterChip("Languages"),
                        const SizedBox(width: 8),
                        _buildFilterChip("Social"),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Teachers Soundboard List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final teacher = _filteredTeachers[index];
                  final isPlaying = _currentlyPlayingId == teacher.id;
                  return _buildTeacherCard(teacher, isPlaying);
                },
                childCount: _filteredTeachers.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 90)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    final isSelected = _selectedFilter == label;
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        setState(() => _selectedFilter = label);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white.withAlpha(20),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.gold : Colors.white24,
            width: isSelected ? 1.4 : 1,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 11.5,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected ? Colors.white : const Color(0xFFCBD5E1),
          ),
        ),
      ),
    );
  }

  Widget _buildTeacherCard(TeacherDialogue teacher, bool isPlaying) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isPlaying ? teacher.themeColor : AppColors.cardBorder,
          width: isPlaying ? 2 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: isPlaying ? teacher.themeColor.withAlpha(60) : Colors.black.withAlpha(40),
            blurRadius: isPlaying ? 16 : 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Avatar + Name + Subject + WhatsApp Share
            Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [teacher.themeColor, teacher.themeColor.withAlpha(160)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white24, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: teacher.themeColor.withAlpha(80),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Icon(teacher.icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        teacher.name,
                        style: GoogleFonts.cinzel(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Flexible(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(
                                color: teacher.themeColor.withAlpha(22),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: teacher.themeColor.withAlpha(90), width: 1),
                              ),
                              child: Text(
                                "${teacher.subject} • ${teacher.subjectKannada}",
                                style: GoogleFonts.poppins(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: teacher.themeColor,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Share to WhatsApp button
                IconButton(
                  tooltip: "Share to WhatsApp",
                  icon: const Icon(Icons.share_rounded, color: Color(0xFF25D366), size: 20),
                  onPressed: () => _shareOnWhatsApp(teacher),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Iconic Dialogue Quote Box (Chalkboard styling)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(14),
                border: Border(left: BorderSide(color: teacher.themeColor, width: 4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    teacher.dialogue,
                    style: GoogleFonts.kalam(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFFFEF08A), // Chalk yellow
                      height: 1.45,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    teacher.contextNote,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: const Color(0xFF94A3B8),
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // Bottom Action Bar: Laugh/Heart Reactions
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                // Reaction: Laugh
                InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => _incrementReaction(teacher, false),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    child: Row(
                      children: [
                        const Text("😂", style: TextStyle(fontSize: 16)),
                        const SizedBox(width: 4),
                        Text(
                          "${teacher.laughCount}",
                          style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(width: 8),

                // Reaction: Heart
                InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => _incrementReaction(teacher, true),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                    child: Row(
                      children: [
                        const Icon(Icons.favorite_rounded, color: Color(0xFFE11D48), size: 16),
                        const SizedBox(width: 4),
                        Text(
                          "${teacher.heartCount}",
                          style: GoogleFonts.poppins(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
