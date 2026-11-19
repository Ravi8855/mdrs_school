import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';

class ShirtSignature {
  final String id;
  final String name;
  final String roleOrBatch;
  final String message;
  final Color markerColor;
  final double rotation; // In radians
  final bool isBackSide;
  final String doodle;
  int hearts;

  ShirtSignature({
    required this.id,
    required this.name,
    required this.roleOrBatch,
    required this.message,
    required this.markerColor,
    this.rotation = 0.0,
    this.isBackSide = false,
    this.doodle = '❤️',
    this.hearts = 12,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'roleOrBatch': roleOrBatch,
    'message': message,
    'markerColor': markerColor.value,
    'rotation': rotation,
    'isBackSide': isBackSide,
    'doodle': doodle,
    'hearts': hearts,
  };

  factory ShirtSignature.fromJson(Map<String, dynamic> json) => ShirtSignature(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    roleOrBatch: json['roleOrBatch'] ?? '',
    message: json['message'] ?? '',
    markerColor: Color(json['markerColor'] ?? 0xFF1E40AF),
    rotation: (json['rotation'] as num?)?.toDouble() ?? 0.0,
    isBackSide: json['isBackSide'] ?? false,
    doodle: json['doodle'] ?? '❤️',
    hearts: json['hearts'] ?? 0,
  );
}

class FarewellShirtScreen extends StatefulWidget {
  const FarewellShirtScreen({super.key});

  @override
  State<FarewellShirtScreen> createState() => _FarewellShirtScreenState();
}

class _FarewellShirtScreenState extends State<FarewellShirtScreen> with SingleTickerProviderStateMixin {
  bool _isBackSide = false;
  late TabController _sideController;
  List<ShirtSignature> _customSignatures = [];
  bool _isLoading = true;

  // Authentic Default Signatures
  final List<ShirtSignature> _defaultSignatures = [
    // FRONT SIDE SIGNATURES
    ShirtSignature(
      id: 'f1',
      name: 'Ramesh Sir',
      roleOrBatch: 'Science Teacher',
      message: 'Always be curious and aim high. Make MDRS proud! God bless you.',
      markerColor: const Color(0xFF047857), // Green marker
      rotation: -0.04,
      isBackSide: false,
      doodle: '🔬',
      hearts: 48,
    ),
    ShirtSignature(
      id: 'f2',
      name: 'Ravi',
      roleOrBatch: 'Batch 2013 • Roll 14',
      message: 'Night study partner! You always slept at 9:30 PM & told warden sir you were meditating! 😂',
      markerColor: const Color(0xFF1D4ED8), // Blue marker
      rotation: 0.03,
      isBackSide: false,
      doodle: '⭐',
      hearts: 64,
    ),
    ShirtSignature(
      id: 'f3',
      name: 'Laxmi Aunty',
      roleOrBatch: 'Hostel Mother',
      message: '6th std crying champion who missed home, 10th std school hero! Always eat well putta.',
      markerColor: const Color(0xFFDC2626), // Red marker
      rotation: -0.02,
      isBackSide: false,
      doodle: '❤️',
      hearts: 92,
    ),
    ShirtSignature(
      id: 'f4',
      name: 'Kiran B.',
      roleOrBatch: 'Batch 2014',
      message: 'Best Kho-Kho raider! Never forget our red mud ground matches. Keep this shirt safe!',
      markerColor: const Color(0xFF7C3AED), // Purple marker
      rotation: 0.05,
      isBackSide: false,
      doodle: '🏆',
      hearts: 39,
    ),
    ShirtSignature(
      id: 'f5',
      name: 'Ambadas',
      roleOrBatch: 'Batch 2015',
      message: 'Who will share Sunday chicken gravy with me now? 😢 Miss our dining hall sprints!',
      markerColor: const Color(0xFF111827), // Black marker
      rotation: -0.03,
      isBackSide: false,
      doodle: '🍗',
      hearts: 55,
    ),

    // BACK SIDE SIGNATURES (Big Canvas)
    ShirtSignature(
      id: 'b1',
      name: 'Rajkumar Sir',
      roleOrBatch: 'Head Master',
      message: 'Discipline and hard work lead to greatness. Wishing you a golden future! — MDRS Principal',
      markerColor: const Color(0xFF1E3A8A), // Deep Navy
      rotation: -0.02,
      isBackSide: true,
      doodle: '🎓',
      hearts: 81,
    ),
    ShirtSignature(
      id: 'b2',
      name: 'Bhimu',
      roleOrBatch: 'Dormitory Leader',
      message: 'Warden sir whistle could never wake you, but 1:00 PM lunch bell did! CEO of skipping morning PT! 🏃‍♂️',
      markerColor: const Color(0xFFB91C1C), // Deep Crimson
      rotation: 0.04,
      isBackSide: true,
      doodle: '⏰',
      hearts: 73,
    ),
    ShirtSignature(
      id: 'b3',
      name: 'Sunil',
      roleOrBatch: 'Room #3 Partner',
      message: 'Kit box seller! Secretly traded Mysore Sandal soap for pocket money to buy bakery puffs! 🤫',
      markerColor: const Color(0xFF0F766E), // Teal Green
      rotation: -0.05,
      isBackSide: true,
      doodle: '🧼',
      hearts: 88,
    ),
    ShirtSignature(
      id: 'b4',
      name: 'Suchitra & Prema',
      roleOrBatch: 'Batch 2017',
      message: 'Water scarcity days in girls hostel were unforgettable! You always helped carry the extra bucket. Best friend!',
      markerColor: const Color(0xFFBE185D), // Pink/Magenta
      rotation: 0.03,
      isBackSide: true,
      doodle: '🪣',
      hearts: 67,
    ),
    ShirtSignature(
      id: 'b5',
      name: 'Raju Anna',
      roleOrBatch: 'Campus Cook',
      message: 'Always came for 2nd round of Upma with sweet smile. Study big and visit MDRS again!',
      markerColor: const Color(0xFFC2410C), // Orange Red
      rotation: -0.02,
      isBackSide: true,
      doodle: '🍲',
      hearts: 95,
    ),
    ShirtSignature(
      id: 'b6',
      name: 'Chandrashekar',
      roleOrBatch: 'Backbencher Legend',
      message: 'Packing our trunks 3 days before holiday announcement! We made hostel feel like home. Friends 4ever! ✨',
      markerColor: const Color(0xFF1E40AF), // Blue
      rotation: 0.04,
      isBackSide: true,
      doodle: '🧳',
      hearts: 58,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _sideController = TabController(length: 2, vsync: this);
    _sideController.addListener(() {
      setState(() {
        _isBackSide = _sideController.index == 1;
      });
    });
    _loadCustomSignatures();
  }

  @override
  void dispose() {
    _sideController.dispose();
    super.dispose();
  }

  Future<void> _loadCustomSignatures() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getStringList('mdrs_farewell_signatures') ?? [];
      setState(() {
        _customSignatures = data.map((item) => ShirtSignature.fromJson(jsonDecode(item))).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _saveCustomSignature(ShirtSignature sig) async {
    setState(() {
      _customSignatures.insert(0, sig);
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = _customSignatures.map((s) => jsonEncode(s.toJson())).toList();
      await prefs.setStringList('mdrs_farewell_signatures', data);
    } catch (_) {}
  }

  List<ShirtSignature> get _currentSignatures {
    final list = [
      ..._customSignatures.where((s) => s.isBackSide == _isBackSide),
      ..._defaultSignatures.where((s) => s.isBackSide == _isBackSide),
    ];
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0B1A), // Dark atmospheric classroom theme
      appBar: AppBar(
        backgroundColor: const Color(0xFF1B0E33),
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
                  'Class 10th Farewell Shirt',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 6),
                const Icon(Icons.verified, color: Colors.amber, size: 16),
              ],
            ),
            Text(
              'The official SSLC last day autograph memory canvas',
              style: GoogleFonts.poppins(
                fontSize: 11,
                color: Colors.white70,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Share Shirt on WhatsApp',
            icon: const Icon(Icons.share_rounded, color: Colors.amber),
            onPressed: _shareOnWhatsApp,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
          : Column(
              children: [
                // Top Flip Toggle Bar
                Container(
                  margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  child: TabBar(
                    controller: _sideController,
                    indicator: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.white60,
                    labelStyle: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.bold),
                    unselectedLabelStyle: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w500),
                    tabs: const [
                      Tab(text: '👔 Front Side (Pocket & Chest)'),
                      Tab(text: '🔄 Back Side (Big Slam Canvas)'),
                    ],
                  ),
                ),

                // Hint Banner
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
                  child: Row(
                    children: [
                      Icon(
                        _isBackSide ? Icons.auto_awesome_rounded : Icons.touch_app_rounded,
                        color: Colors.amber,
                        size: 14,
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          _isBackSide
                              ? 'Tap any marker note to read or heart ❤️ • Tap "+ Sign Shirt" to write your autograph!'
                              : 'Front uniform pocket side • Flip to Back side for the large batch autograph board!',
                          style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70),
                        ),
                      ),
                    ],
                  ),
                ),

                // The Realistic Uniform Shirt Canvas
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    child: _buildRealisticShirtCanvas(),
                  ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFE11D48), // Permanent marker crimson red
        elevation: 6,
        icon: const Icon(Icons.draw_rounded, color: Colors.white),
        label: Text(
          'Sign On Shirt',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
        ),
        onPressed: _showSignShirtDialog,
      ),
    );
  }

  Widget _buildRealisticShirtCanvas() {
    final signatures = _currentSignatures;

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC), // Authentic crisp white school shirt cotton
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFCBD5E1), width: 3), // Stitched edge
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
          BoxShadow(
            color: Colors.white.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Realistic Shirt Collar Header
          _buildCollarHeader(),

          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // Signatures Area
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Front Side Specific: MDRS Chest Pocket Badge
                if (!_isBackSide) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // MDRS Embroidered Crest Pocket
                      Container(
                        width: 130,
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(16),
                            bottomRight: Radius.circular(16),
                          ),
                          border: Border.all(color: const Color(0xFF94A3B8), width: 1.5),
                        ),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFF1E3A8A),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'M.D.R.S.',
                                style: GoogleFonts.poppins(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'CLASS X • SSLC\nFAREWELL 2026',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.robotoMono(
                                fontSize: 8,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Pen clipped in pocket visual
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber.shade100,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.amber.shade300),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text('🖊️', style: TextStyle(fontSize: 12)),
                            const SizedBox(width: 4),
                            Text(
                              'Permanent Marker Ready',
                              style: GoogleFonts.poppins(
                                fontSize: 9,
                                fontWeight: FontWeight.w600,
                                color: Colors.amber.shade900,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],

                // Back Side Specific: Giant "MDRS MEMORIES FOREVER" Header
                if (_isBackSide) ...[
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.red.shade200, width: 1.5),
                      ),
                      child: Text(
                        '★ MORARJI DESAI RESIDENTIAL SCHOOL ★\nLAST DAY AUTOGRAPH CANVAS',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.permanentMarker(
                          fontSize: 12,
                          color: const Color(0xFF991B1B),
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // The Marker Notes Grid
                ...signatures.map((sig) => _buildMarkerScribbleItem(sig)),

                const SizedBox(height: 40),

                // Bottom Shirt Hem Line
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      border: Border(top: BorderSide(color: Colors.blueGrey.shade300, width: 1.5)),
                    ),
                    child: Text(
                      '~ END OF SCHOOL DAYS • FOREVER MDRSIANS ~',
                      style: GoogleFonts.poppins(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.blueGrey.shade400,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCollarHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: const BoxDecoration(
        color: Color(0xFFE2E8F0),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Left Collar Wing
          Transform.rotate(
            angle: -0.15,
            child: Container(
              width: 50,
              height: 18,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Central Collar Button
          Container(
            width: 14,
            height: 14,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFF94A3B8), width: 2),
            ),
            child: Center(
              child: Container(
                width: 4,
                height: 4,
                decoration: const BoxDecoration(
                  color: Color(0xFF94A3B8),
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Right Collar Wing
          Transform.rotate(
            angle: 0.15,
            child: Container(
              width: 50,
              height: 18,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFCBD5E1)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMarkerScribbleItem(ShirtSignature sig) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Transform.rotate(
        angle: sig.rotation,
        child: InkWell(
          onTap: () => _showSignatureDetails(sig),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.95),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: sig.markerColor.withOpacity(0.3), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: sig.markerColor.withOpacity(0.08),
                  blurRadius: 8,
                  offset: const Offset(1, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Name & Doodle
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          sig.doodle,
                          style: const TextStyle(fontSize: 16),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          sig.name,
                          style: GoogleFonts.permanentMarker(
                            fontSize: 15,
                            color: sig.markerColor,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: sig.markerColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        sig.roleOrBatch,
                        style: GoogleFonts.poppins(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: sig.markerColor,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),

                // Authentic Handwriting Message
                Text(
                  '"${sig.message}"',
                  style: GoogleFonts.kalam(
                    fontSize: 14,
                    height: 1.3,
                    fontWeight: FontWeight.w700,
                    color: sig.markerColor.withOpacity(0.95),
                  ),
                ),
                const SizedBox(height: 6),

                // Heart / Like counter
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    InkWell(
                      onTap: () {
                        setState(() {
                          sig.hearts++;
                        });
                      },
                      child: Row(
                        children: [
                          const Icon(Icons.favorite, size: 14, color: Colors.redAccent),
                          const SizedBox(width: 4),
                          Text(
                            '${sig.hearts}',
                            style: GoogleFonts.poppins(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showSignatureDetails(ShirtSignature sig) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1B0E33),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(sig.doodle, style: const TextStyle(fontSize: 28)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        sig.name,
                        style: GoogleFonts.permanentMarker(fontSize: 18, color: Colors.white),
                      ),
                      Text(
                        sig.roleOrBatch,
                        style: GoogleFonts.poppins(fontSize: 12, color: AppColors.accent),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.favorite, color: Colors.redAccent),
                  onPressed: () {
                    setState(() => sig.hearts++);
                    Navigator.pop(ctx);
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.06),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white12),
              ),
              child: Text(
                '"${sig.message}"',
                style: GoogleFonts.kalam(
                  fontSize: 16,
                  height: 1.4,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
            const SizedBox(height: 18),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.share, color: Colors.white, size: 18),
                label: Text('Share this memory with friends', style: GoogleFonts.poppins(color: Colors.white)),
                onPressed: () {
                  Navigator.pop(ctx);
                  _shareSingleMemory(sig);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showSignShirtDialog() {
    final nameCtrl = TextEditingController();
    final batchCtrl = TextEditingController(text: 'Batch 2014');
    final msgCtrl = TextEditingController();
    Color selectedColor = const Color(0xFF1D4ED8); // Default Blue
    String selectedDoodle = '❤️';
    bool signOnBack = _isBackSide;

    final colors = [
      const Color(0xFF1D4ED8), // Blue
      const Color(0xFF111827), // Black
      const Color(0xFFDC2626), // Red
      const Color(0xFF047857), // Green
      const Color(0xFF7C3AED), // Violet
    ];

    final doodles = ['❤️', '⭐', '🏏', '🏆', '✌️', '🎓', '🔥'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDlgState) => AlertDialog(
          backgroundColor: const Color(0xFF1B0E33),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(
            '✍️ Sign on Farewell Shirt',
            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name
                TextField(
                  controller: nameCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Your Name / Nickname',
                    labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.white24),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppColors.accent),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Batch
                TextField(
                  controller: batchCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Batch or Role (e.g. Batch 2013, Roll 08)',
                    labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.white24),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppColors.accent),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 10),

                // Message
                TextField(
                  controller: msgCtrl,
                  maxLines: 3,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Farewell Memory or Message',
                    hintText: 'e.g. Never forget our night study hour fights!',
                    hintStyle: const TextStyle(color: Colors.white30, fontSize: 11),
                    labelStyle: const TextStyle(color: Colors.white60, fontSize: 12),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.white24),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppColors.accent),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Marker Color Picker
                Text('Marker Pen Color:', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
                const SizedBox(height: 6),
                Row(
                  children: colors.map((c) => GestureDetector(
                    onTap: () => setDlgState(() => selectedColor = c),
                    child: Container(
                      margin: const EdgeInsets.only(right: 10),
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: c,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: selectedColor == c ? Colors.white : Colors.transparent,
                          width: 2.5,
                        ),
                      ),
                    ),
                  )).toList(),
                ),
                const SizedBox(height: 12),

                // Doodle Picker
                Text('Add Little Doodle:', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 8,
                  children: doodles.map((d) => GestureDetector(
                    onTap: () => setDlgState(() => selectedDoodle = d),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: selectedDoodle == d ? Colors.white24 : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(d, style: const TextStyle(fontSize: 18)),
                    ),
                  )).toList(),
                ),
                const SizedBox(height: 12),

                // Placement (Front or Back)
                Row(
                  children: [
                    Text('Side:', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70)),
                    const SizedBox(width: 10),
                    ChoiceChip(
                      label: const Text('Front'),
                      selected: !signOnBack,
                      onSelected: (val) => setDlgState(() => signOnBack = !val),
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(color: !signOnBack ? Colors.white : Colors.white60, fontSize: 11),
                    ),
                    const SizedBox(width: 8),
                    ChoiceChip(
                      label: const Text('Back'),
                      selected: signOnBack,
                      onSelected: (val) => setDlgState(() => signOnBack = val),
                      selectedColor: AppColors.primary,
                      labelStyle: TextStyle(color: signOnBack ? Colors.white : Colors.white60, fontSize: 11),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.white60)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE11D48)),
              onPressed: () {
                final name = nameCtrl.text.trim();
                final msg = msgCtrl.text.trim();
                if (name.isEmpty || msg.isEmpty) return;

                // Random slight natural marker tilt between -0.05 and +0.05 rad
                final random = math.Random();
                final rot = (random.nextDouble() * 0.1) - 0.05;

                final newSig = ShirtSignature(
                  id: 'user_${DateTime.now().millisecondsSinceEpoch}',
                  name: name,
                  roleOrBatch: batchCtrl.text.trim().isEmpty ? 'MDRSian' : batchCtrl.text.trim(),
                  message: msg,
                  markerColor: selectedColor,
                  rotation: rot,
                  isBackSide: signOnBack,
                  doodle: selectedDoodle,
                  hearts: 1,
                );

                _saveCustomSignature(newSig);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: const Color(0xFF047857),
                    content: Text('🎉 Your signature was permanently inked on the ${signOnBack ? "Back" : "Front"} of the shirt!'),
                  ),
                );
              },
              child: const Text('Ink on Shirt ✍️', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _shareOnWhatsApp() async {
    final text = '👕 *MDRS School — Class 10th Farewell Autograph Shirt*\n\n'
        'Remember the last day of SSLC exams when we signed each other\'s white shirts with marker pens?\n\n'
        'Check out our batch memories & sign your own message on the shirt in the MDRS School app! ❤️\n\n'
        '#MDRSSchool #FarewellShirt #HostelMemories';
    final url = Uri.parse('whatsapp://send?text=${Uri.encodeComponent(text)}');
    try {
      await launchUrl(url);
    } catch (_) {}
  }

  void _shareSingleMemory(ShirtSignature sig) async {
    final text = '👕 *MDRS Farewell Shirt Memory*\n\n'
        'From: *${sig.name}* (${sig.roleOrBatch})\n'
        '"${sig.message}"\n\n'
        '— Signed on the MDRS School Farewell Shirt ❤️';
    final url = Uri.parse('whatsapp://send?text=${Uri.encodeComponent(text)}');
    try {
      await launchUrl(url);
    } catch (_) {}
  }
}
