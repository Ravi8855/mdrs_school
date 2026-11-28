import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';

class UniformSignature {
  final String id;
  final String name;
  final String photo;
  final String roleOrBatch;
  final String message;
  final Color markerColor;
  final double rotation;
  final String doodle;
  final bool isGirlsUniform;
  int hearts;

  UniformSignature({
    required this.id,
    required this.name,
    required this.photo,
    required this.roleOrBatch,
    required this.message,
    required this.markerColor,
    this.rotation = 0.0,
    required this.doodle,
    required this.isGirlsUniform,
    this.hearts = 12,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'photo': photo,
        'roleOrBatch': roleOrBatch,
        'message': message,
        'markerColor': markerColor.value,
        'rotation': rotation,
        'doodle': doodle,
        'isGirlsUniform': isGirlsUniform,
        'hearts': hearts,
      };

  factory UniformSignature.fromJson(Map<String, dynamic> json) => UniformSignature(
        id: json['id'] ?? '',
        name: json['name'] ?? '',
        photo: json['photo'] ?? '',
        roleOrBatch: json['roleOrBatch'] ?? '',
        message: json['message'] ?? '',
        markerColor: Color(json['markerColor'] ?? 0xFF1D4ED8),
        rotation: (json['rotation'] as num?)?.toDouble() ?? 0.0,
        doodle: json['doodle'] ?? '❤️',
        isGirlsUniform: json['isGirlsUniform'] ?? false,
        hearts: json['hearts'] ?? 0,
      );
}

class FarewellShirtScreen extends StatefulWidget {
  const FarewellShirtScreen({super.key});

  @override
  State<FarewellShirtScreen> createState() => _FarewellShirtScreenState();
}

class _FarewellShirtScreenState extends State<FarewellShirtScreen>
    with SingleTickerProviderStateMixin {
  late TabController _genderController;
  bool _isGirlsUniform = false;
  List<UniformSignature> _customSignatures = [];
  bool _isLoading = true;

  // 1. Authentic Girls Signatures with exact requested names
  final List<UniformSignature> _girlsSignatures = [
    UniformSignature(
      id: 'g_shweta',
      name: 'Shweta',
      photo: 'assets/images/Shweta.jpg',
      roleOrBatch: 'Batch 2017 • Roll 28',
      message:
          'Our 5:30 AM hot water bucket sprints & blanket gossips! Never forget 10th standard SSLC study nights. Best friends forever! 💕',
      markerColor: const Color(0xFFBE185D), // Deep Rose Pink
      rotation: -0.03,
      doodle: '💖',
      isGirlsUniform: true,
      hearts: 94,
    ),
    UniformSignature(
      id: 'g_chaitra',
      name: 'Chaitra',
      photo: 'assets/images/Chaitra.jpeg',
      roleOrBatch: 'Batch 2017 • Roll 09',
      message:
          'Sharing home snacks from the trunk box before prayer bell! You always saved the last Laddoo for me. Love you Sakhi! ✨',
      markerColor: const Color(0xFF7C3AED), // Purple
      rotation: 0.04,
      doodle: '✨',
      isGirlsUniform: true,
      hearts: 88,
    ),
    UniformSignature(
      id: 'g_ambika',
      name: 'Ambika',
      photo: 'assets/images/Ambika.jpeg',
      roleOrBatch: 'Batch 2017 • Roll 03',
      message:
          'Class 10th Maths study partner — solving theorem proofs on the hostel floor till midnight! We made it! 🌸',
      markerColor: const Color(0xFF1D4ED8), // Royal Blue
      rotation: -0.02,
      doodle: '🌸',
      isGirlsUniform: true,
      hearts: 76,
    ),
    UniformSignature(
      id: 'g_umashree',
      name: 'Umashree',
      photo: 'assets/images/Umashree.jpg',
      roleOrBatch: 'Batch 2017 • Roll 36',
      message:
          'Dining hall laughs with Laxmi Aunty’s sweet smiles! Stay the kindest soul always. Remember MDRS days! 👭',
      markerColor: const Color(0xFF047857), // Emerald Green
      rotation: 0.03,
      doodle: '🎀',
      isGirlsUniform: true,
      hearts: 69,
    ),
    UniformSignature(
      id: 'g_roopa',
      name: 'Roopa',
      photo: 'assets/images/Roopa.jpeg',
      roleOrBatch: 'Batch 2017 • Roll 24',
      message:
          'Sharing secret chits under the wooden desk during science class! Don’t forget our hostel corridor chats. 💫',
      markerColor: const Color(0xFFB91C1C), // Crimson Red
      rotation: -0.04,
      doodle: '💫',
      isGirlsUniform: true,
      hearts: 83,
    ),
    UniformSignature(
      id: 'g_prema',
      name: 'Prema',
      photo: 'assets/images/Prema.jpeg',
      roleOrBatch: 'Batch 2017 • Roll 21',
      message:
          'Sunday special chicken sambar fights & washing uniform together at the pump! True sisters for life! ❤️',
      markerColor: const Color(0xFFC2410C), // Deep Orange
      rotation: 0.02,
      doodle: '❤️',
      isGirlsUniform: true,
      hearts: 91,
    ),
  ];

  // 2. Authentic Boys Signatures with exact requested names
  final List<UniformSignature> _boysSignatures = [
    UniformSignature(
      id: 'b_arun',
      name: 'Arun',
      photo: 'assets/images/Arun.jpeg',
      roleOrBatch: 'Kho-Kho Captain • Roll 04',
      message:
          'Kho-Kho captain & ground hero! Scoring the winning point against Shahapur school will be remembered forever! 🏆',
      markerColor: const Color(0xFF1E3A8A), // Deep Navy
      rotation: -0.03,
      doodle: '🏆',
      isGirlsUniform: false,
      hearts: 102,
    ),
    UniformSignature(
      id: 'b_hrutik',
      name: 'Hrutik',
      photo: 'assets/images/Hrutik.jpeg',
      roleOrBatch: 'Backbencher • Roll 12',
      message:
          'Sleeping in 8:00 AM morning prep class with open textbook! Master thought you were deep in contemplation! 😂',
      markerColor: const Color(0xFF0F766E), // Teal Green
      rotation: 0.04,
      doodle: '😴',
      isGirlsUniform: false,
      hearts: 87,
    ),
    UniformSignature(
      id: 'b_ambadas',
      name: 'Ambadas',
      photo: 'assets/images/Ambadas.jpeg',
      roleOrBatch: 'Batch 2015 • Roll 02',
      message:
          'First in line when 1:00 PM lunch bell rang! Who will share Sunday biryani gravy now? Miss you brother! 🍗',
      markerColor: const Color(0xFFB91C1C), // Crimson Red
      rotation: -0.04,
      doodle: '🍗',
      isGirlsUniform: false,
      hearts: 95,
    ),
    UniformSignature(
      id: 'b_vinod',
      name: 'Vinod',
      photo: 'assets/images/Vinod.jpg',
      roleOrBatch: 'Night Study Incharge • Roll 38',
      message:
          'Late night study tea kettle master! We kept the whole dormitory awake with our laughter. Friends 4ever! ☕',
      markerColor: const Color(0xFF7C3AED), // Purple
      rotation: 0.03,
      doodle: '☕',
      isGirlsUniform: false,
      hearts: 79,
    ),
    UniformSignature(
      id: 'b_bhimu',
      name: 'Bhimu',
      photo: 'assets/images/Bhimu.jpeg',
      roleOrBatch: 'Dorm Leader • Roll 08',
      message:
          'Whistle runner & warden sir’s favorite backbencher! 6th std homesick boy became 10th std champion! 🏃‍♂️',
      markerColor: const Color(0xFFDC2626), // Ruby Red
      rotation: -0.02,
      doodle: '🏃‍♂️',
      isGirlsUniform: false,
      hearts: 91,
    ),
    UniformSignature(
      id: 'b_bhimashankar',
      name: 'Bhimashankar',
      photo: 'assets/images/Bhimashankar.jpeg',
      roleOrBatch: 'Krishna House Leader • Roll 07',
      message:
          'Packing steel trunk 3 days before holiday notice! The most disciplined leader of Krishna house! 🧳',
      markerColor: const Color(0xFF047857), // Forest Green
      rotation: 0.04,
      doodle: '🧳',
      isGirlsUniform: false,
      hearts: 84,
    ),
    UniformSignature(
      id: 'b_marilinga',
      name: 'Marilinga',
      photo: 'assets/images/Marilinga.jpeg',
      roleOrBatch: 'Batch 2014 • Roll 18',
      message:
          'Saturday night hostel ghost stories in room #4! Even warden sir was scared to enter our hall! 👻',
      markerColor: const Color(0xFF1D4ED8), // Royal Blue
      rotation: -0.03,
      doodle: '👻',
      isGirlsUniform: false,
      hearts: 73,
    ),
    UniformSignature(
      id: 'b_viresh',
      name: 'Viresh',
      photo: 'assets/images/Viresh.jpg',
      roleOrBatch: 'Class Monitor • Roll 40',
      message:
          'Classroom monitor who wrote everyone’s name on the blackboard except his own gang! Legend! ⭐',
      markerColor: const Color(0xFFC2410C), // Orange
      rotation: 0.02,
      doodle: '⭐',
      isGirlsUniform: false,
      hearts: 99,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _genderController = TabController(length: 2, vsync: this);
    _genderController.addListener(() {
      if (_genderController.indexIsChanging) return;
      setState(() {
        _isGirlsUniform = _genderController.index == 1;
      });
    });
    _loadCustomSignatures();
  }

  @override
  void dispose() {
    _genderController.dispose();
    super.dispose();
  }

  Future<void> _loadCustomSignatures() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getStringList('mdrs_farewell_uniform_sigs_v2') ?? [];
      setState(() {
        _customSignatures =
            data.map((item) => UniformSignature.fromJson(jsonDecode(item))).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _saveCustomSignature(UniformSignature sig) async {
    setState(() {
      _customSignatures.insert(0, sig);
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = _customSignatures.map((s) => jsonEncode(s.toJson())).toList();
      await prefs.setStringList('mdrs_farewell_uniform_sigs_v2', data);
    } catch (_) {}
  }

  List<UniformSignature> get _currentSignatures {
    final custom = _customSignatures.where((s) => s.isGirlsUniform == _isGirlsUniform);
    final defaults = _isGirlsUniform ? _girlsSignatures : _boysSignatures;
    return [...custom, ...defaults];
  }

  void _shareOnWhatsApp() async {
    HapticFeedback.lightImpact();
    final names = _isGirlsUniform
        ? "Shweta, Chaitra, Ambika, Umashree, Roopa, Prema"
        : "Arun, Hrutik, Ambadas, Vinod, Bhimu, Bhimashankar, Marilinga, Viresh";
    final uniformName = _isGirlsUniform ? "Girls Uniform" : "Boys Uniform";

    final text = """
🎓 *MDRS SSLC Farewell $uniformName Autograph Canvas* ✍️👕

Our batch mates signed on the official MDRS school uniform:
$names

Check out the signatures, memories & hostel dialogues in our MDRS School Memories App! ❤️
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

  void _showSignatureDialog(UniformSignature sig) {
    HapticFeedback.lightImpact();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: const BorderSide(color: AppColors.cardBorder, width: 1.2),
        ),
        title: Row(
          children: [
            if (sig.photo.isNotEmpty)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  sig.photo,
                  width: 44,
                  height: 48,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => CircleAvatar(
                    backgroundColor: AppColors.blushPink,
                    child: Text(sig.name.isNotEmpty ? sig.name[0] : 'S'),
                  ),
                ),
              ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    sig.name,
                    style: GoogleFonts.poppins(
                      fontWeight: FontWeight.w800,
                      fontSize: 16,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    sig.roleOrBatch,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Text(sig.doodle, style: const TextStyle(fontSize: 22)),
          ],
        ),
        content: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.background,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.roseGold.withAlpha(80)),
          ),
          child: Text(
            sig.message,
            style: GoogleFonts.kalam(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: sig.markerColor,
              height: 1.4,
            ),
          ),
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              setState(() => sig.hearts++);
              Navigator.pop(ctx);
            },
            icon: const Icon(Icons.favorite_rounded, color: Color(0xFFE11D48)),
            label: Text("Heart (${sig.hearts})", style: const TextStyle(color: Color(0xFFE11D48))),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Close", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSignShirtDialog() {
    HapticFeedback.selectionClick();
    final nameCtrl = TextEditingController();
    final roleCtrl = TextEditingController();
    final msgCtrl = TextEditingController();
    Color selectedColor = const Color(0xFF1D4ED8);
    String selectedDoodle = '❤️';

    final markerColors = [
      const Color(0xFF1D4ED8), // Blue
      const Color(0xFFDC2626), // Red
      const Color(0xFF047857), // Green
      const Color(0xFF7C3AED), // Purple
      const Color(0xFFC2410C), // Orange
      const Color(0xFF111827), // Black
    ];

    final doodles = ['❤️', '⭐', '🎓', '🔥', '✨', '🏆', '🌸', '👑'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _isGirlsUniform ? "Sign On Girls Uniform ✍️👗" : "Sign On Boys Uniform ✍️👕",
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w800,
                        fontSize: 16,
                        color: AppColors.primary,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: nameCtrl,
                  decoration: InputDecoration(
                    labelText: "Your Name",
                    hintText: "e.g. Raju, Sunita...",
                    filled: true,
                    fillColor: AppColors.background,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: roleCtrl,
                  decoration: InputDecoration(
                    labelText: "Batch or Dormitory Roll",
                    hintText: "e.g. Batch 2017 • Roll 15",
                    filled: true,
                    fillColor: AppColors.background,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: msgCtrl,
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: "Farewell Autograph Message",
                    hintText: "Write your favorite memory or wish on the uniform...",
                    filled: true,
                    fillColor: AppColors.background,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  "Choose Permanent Marker Color:",
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 12),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: markerColors.map((col) {
                    final isSel = selectedColor == col;
                    return GestureDetector(
                      onTap: () => setModalState(() => selectedColor = col),
                      child: Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: col,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSel ? Colors.black : Colors.transparent,
                            width: 3,
                          ),
                        ),
                        child: isSel
                            ? const Icon(Icons.check, color: Colors.white, size: 20)
                            : null,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 14),
                Text(
                  "Choose Doodle / Stamp:",
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 12),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: doodles.map((d) {
                    final isSel = selectedDoodle == d;
                    return GestureDetector(
                      onTap: () => setModalState(() => selectedDoodle = d),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: isSel ? AppColors.blushPink : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: isSel ? AppColors.primary : Colors.black12,
                          ),
                        ),
                        child: Text(d, style: const TextStyle(fontSize: 20)),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      final n = nameCtrl.text.trim();
                      final m = msgCtrl.text.trim();
                      if (n.isEmpty || m.isEmpty) return;

                      final sig = UniformSignature(
                        id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
                        name: n,
                        photo: '',
                        roleOrBatch: roleCtrl.text.trim().isNotEmpty
                            ? roleCtrl.text.trim()
                            : 'MDRS Alumni',
                        message: m,
                        markerColor: selectedColor,
                        rotation: (math.Random().nextDouble() * 0.08) - 0.04,
                        doodle: selectedDoodle,
                        isGirlsUniform: _isGirlsUniform,
                        hearts: 1,
                      );

                      _saveCustomSignature(sig);
                      Navigator.pop(ctx);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: Text(
                      "Write On Uniform ✨",
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Class 10th Farewell Uniform',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.verified, color: AppColors.metallicGold, size: 16),
              ],
            ),
            Text(
              'Official SSLC last day autograph uniform canvas',
              style: GoogleFonts.poppins(
                fontSize: 10.5,
                color: Colors.white70,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Share Uniform on WhatsApp',
            icon: const Icon(Icons.share_rounded, color: Colors.white),
            onPressed: _shareOnWhatsApp,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : Column(
              children: [
                // Top Gender Uniform Switcher Bar
                Container(
                  height: 48,
                  margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.cardBorder, width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withAlpha(12),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: TabBar(
                    controller: _genderController,
                    dividerColor: Colors.transparent,
                    dividerHeight: 0,
                    indicatorSize: TabBarIndicatorSize.tab,
                    indicatorPadding: EdgeInsets.zero,
                    labelPadding: EdgeInsets.zero,
                    indicator: BoxDecoration(
                      color: const Color(0xFF9E2A4B), // Professional Light Maroon
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF9E2A4B).withAlpha(45),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    labelColor: Colors.white,
                    unselectedLabelColor: AppColors.textPrimary,
                    labelStyle: GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w700),
                    unselectedLabelStyle:
                        GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w600),
                    tabs: const [
                      Tab(
                        height: 40,
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('👔', style: TextStyle(fontSize: 14)),
                              SizedBox(width: 6),
                              Text('Boys Uniform'),
                            ],
                          ),
                        ),
                      ),
                      Tab(
                        height: 40,
                        child: Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('👗', style: TextStyle(fontSize: 14)),
                              SizedBox(width: 6),
                              Text('Girls Uniform'),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Hint Banner
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
                  child: Row(
                    children: [
                      const Icon(Icons.draw_rounded, color: AppColors.primary, size: 14),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          _isGirlsUniform
                              ? 'Shweta, Chaitra, Ambika, Umashree, Roopa & Prema signatures on uniform!'
                              : 'Arun, Hrutik, Ambadas, Vinod, Bhimu, Bhimashankar, Marilinga & Viresh signatures!',
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // The Realistic Uniform Shirt Canvas & Interactive Autographs
                Expanded(
                  child: ListView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    children: [
                      // 1. The Uniform Canvas with Autographs Written Over It
                      _buildUniformCanvas(),

                      const SizedBox(height: 18),

                      // 2. Autograph Signers Roll Call Header
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.blushPink,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.groups_rounded,
                              size: 16,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _isGirlsUniform
                                ? "GIRLS CLASSMATES SIGNATURES"
                                : "BOYS CLASSMATES SIGNATURES",
                            style: GoogleFonts.poppins(
                              color: AppColors.primary,
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                            ),
                          ),
                          const Spacer(),
                          Text(
                            "${_currentSignatures.length} Autographs",
                            style: GoogleFonts.poppins(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 10),

                      // 3. Classmates Autograph Cards with Photos
                      ...List.generate(_currentSignatures.length, (idx) {
                        final sig = _currentSignatures[idx];
                        return _buildSignerCard(sig);
                      }),

                      const SizedBox(height: 80),
                    ],
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        elevation: 6,
        icon: const Icon(Icons.draw_rounded, color: Colors.white),
        label: Text(
          _isGirlsUniform ? 'Sign Girls Uniform' : 'Sign Boys Uniform',
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.bold,
            fontSize: 13,
            color: Colors.white,
          ),
        ),
        onPressed: _showSignShirtDialog,
      ),
    );
  }

  // ==========================================
  // UNIFORM CANVAS (Existing Boys & Girls Uniform Image + Overlaid Handwritings)
  // ==========================================
  Widget _buildUniformCanvas() {
    final uniformAsset = _isGirlsUniform
        ? 'assets/images/mdrs_girls_uniform.png'
        : 'assets/images/mdrs_boys_uniform.png';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.roseGold.withAlpha(120), width: 1.4),
        boxShadow: const [
          BoxShadow(
            color: AppColors.cardShadow,
            blurRadius: 18,
            offset: Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background: Clean Authentic MDRS Uniform Shirt Image (no text/names overlay)
          ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child: SizedBox(
              height: 480,
              width: double.infinity,
              child: Image.asset(
                uniformAsset,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => Container(
                  color: AppColors.background,
                  child: const Center(child: Icon(Icons.checkroom, size: 60, color: AppColors.primary)),
                ),
              ),
            ),
          ),

          // Bottom Watermark Pill
          Positioned(
            bottom: 8,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(235),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.roseGold.withAlpha(140), width: 1.0),
              ),
              child: Text(
                _isGirlsUniform
                    ? "MDRS Girls Official Farewell Uniform"
                    : "MDRS Boys Official Farewell Uniform",
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // SIGNER CARD WITH PHOTO & FULL MESSAGE
  // ==========================================
  Widget _buildSignerCard(UniformSignature sig) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.cardBorder, width: 1.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.cardShadow,
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => _showSignatureDialog(sig),
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo Thumbnail
              Container(
                width: 52,
                height: 58,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.roseGold.withAlpha(120), width: 1.2),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(11),
                  child: sig.photo.isNotEmpty
                      ? Image.asset(
                          sig.photo,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: AppColors.blushPink,
                            child: Center(
                              child: Text(
                                sig.name[0],
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ),
                        )
                      : Container(
                          color: AppColors.blushPink,
                          child: Center(
                            child: Text(
                              sig.name[0],
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ),
                ),
              ),

              const SizedBox(width: 12),

              // Name, Role & Message
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          sig.name,
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w800,
                            fontSize: 14.5,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(sig.doodle, style: const TextStyle(fontSize: 13)),
                        const Spacer(),
                        InkWell(
                          onTap: () {
                            HapticFeedback.lightImpact();
                            setState(() => sig.hearts++);
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            child: Row(
                              children: [
                                const Icon(Icons.favorite_rounded,
                                    color: Color(0xFFE11D48), size: 14),
                                const SizedBox(width: 3),
                                Text(
                                  "${sig.hearts}",
                                  style: GoogleFonts.poppins(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      sig.roleOrBatch,
                      style: GoogleFonts.poppins(
                        fontSize: 10.5,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(10),
                        border: Border(left: BorderSide(color: sig.markerColor, width: 3.5)),
                      ),
                      child: Text(
                        "“${sig.message}”",
                        style: GoogleFonts.kalam(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: sig.markerColor,
                          height: 1.35,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
