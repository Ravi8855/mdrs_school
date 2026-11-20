import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';

class GirlsMemoriesScreen extends StatefulWidget {
  const GirlsMemoriesScreen({super.key});

  @override
  State<GirlsMemoriesScreen> createState() => _GirlsMemoriesScreenState();
}

class _GirlsMemoriesScreenState extends State<GirlsMemoriesScreen> {
  int _selectedTab = 0;

  // Scene 1: Bucket Queue
  final List<Map<String, String>> _buckets = [
    {"name": "ಪವಿತ್ರ (Pavithra)", "color": "Blue", "note": "5:15 AM ಗೆ ಇಟ್ಟಿದ್ದು! ಸೋಲಾರ್ ಬಿಸಿ ನೀರು ಇವಳಿಗೆ!"},
    {"name": "ಭಾಗ್ಯ (Bhagya)", "color": "Red", "note": "ಎರಡನೇ ನಂಬರ್, ನೀರು ಬಿಸಿ ಇದೆ ಅಂತ ಕಾಯ್ತಿದ್ದಾಳೆ"},
    {"name": "ಸೌಮ್ಯ (Sowmya)", "color": "Steel", "note": "ಕ್ಯೂನಲ್ಲಿ ಯಾರು ಬಕೆಟ್ ಸರಿಸಿದ್ರು ಅಂತ ಜಗಳ ಆಡ್ತಿದ್ದಾಳೆ!"},
    {"name": "ಗೀತಾ (Geetha)", "color": "Green", "note": "ಕಣ್ಣು ಉಜ್ಜುತ್ತಾ ಲೈನ್‌ನಲ್ಲಿ ನಿಂತಿದ್ದಾಳೆ"},
  ];

  // Scene 2: Trunk Lock
  bool _trunkUnlocked = false;

  // Scene 3: Blanket Torch
  bool _torchOn = true;

  // Scene 4: Desk Chit
  bool _chitUnfolded = false;
  String _activeChit = "ಏ ಸಖಿ, ಇವತ್ತು ಮಧ್ಯಾಹ್ನ ಮೆಸ್‌ನಲ್ಲಿ ಮೊಸರನ್ನ ಇರುತ್ತಾ? ನಿನ್ನ ಪಕ್ಕ ನನಗೆ ಸೀಟ್ ಇಡು! ಮತ್ತೆ ಸೈನ್ಸ್ ಮಾಸ್ಟರ್ ನಿನ್ನ ಫೇರ್ ನೋಟ್ಸ್ ಕೇಳ್ತಾರೆ, ಬ್ಯಾಗ್‌ನಿಂದ ತೆಗೆದಿಡು! — ನಿನ್ನ ಬೆಸ್ಟ್ ಫ್ರೆಂಡ್ 💕";

  // Scene 6: Birthday Candy Log
  String? _birthdayBlessing;

  final List<String> _tabs = [
    "🪣 ಬಕೆಟ್ ಯುದ್ಧ",
    "🧰 ಟ್ರಂಕ್ ತಿಂಡಿ",
    "🤫 ಕಂಬಳಿ ಹರಟೆ",
    "💌 ಡೆಸ್ಕ್ ಚೀಟಿ",
    "🎀 ರಿಬ್ಬನ್ ರಶ್",
    "🍬 ಬರ್ತ್‌ಡೇ ವಾಕ್",
  ];

  void _addBucketDialog() {
    final controller = TextEditingController();
    String selectedColor = "Pink";

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDState) => AlertDialog(
          backgroundColor: const Color(0xFF1B040B),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.cardBorder),
          ),
          title: Text(
            "ಬಕೆಟ್ ಕ್ಯೂನಲ್ಲಿ ಇಡಿ (5:30 AM)",
            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಬಕೆಟ್ ಬಣ್ಣ ಆಯ್ಕೆ ಮಾಡಿ:",
                style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 12),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "ಉದಾ: ಕಾವ್ಯ (Kavya)",
                  hintStyle: const TextStyle(color: Colors.white38),
                  filled: true,
                  fillColor: Colors.white.withAlpha(12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 14),
              Text("ಬಕೆಟ್ ಬಣ್ಣ:", style: GoogleFonts.poppins(color: Colors.white70, fontSize: 12)),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: ["Pink", "Blue", "Red", "Steel"].map((c) {
                  final isSel = selectedColor == c;
                  return GestureDetector(
                    onTap: () => setDState(() => selectedColor = c),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSel ? const Color(0xFFE11D48) : Colors.white10,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSel ? Colors.white : Colors.white24),
                      ),
                      child: Text(c, style: const TextStyle(color: Colors.white, fontSize: 12)),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("ರದ್ದು", style: TextStyle(color: Colors.white60)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE11D48)),
              onPressed: () {
                final name = controller.text.trim();
                if (name.isNotEmpty) {
                  setState(() {
                    _buckets.add({
                      "name": name,
                      "color": selectedColor,
                      "note": "ಕ್ಯೂನಲ್ಲಿ #${_buckets.length + 1} ಜಾಗ ಸಿಕ್ತು! ಬಿಸಿ ನೀರು ಗ್ಯಾರಂಟಿ!",
                    });
                  });
                  HapticFeedback.heavyImpact();
                  Navigator.pop(ctx);
                }
              },
              child: const Text("ಬಕೆಟ್ ಇಡು 🪣", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _shareChitOnWhatsApp() async {
    final text = """
💌 *MDRS School - ರಹಸ್ಯ ಡೆಸ್ಕ್ ಚೀಟಿ (Classroom Secret Chit)* 🏫

"$_activeChit"

Remember passing these folded chits under the desk during maths class?! 😂
Download MDRS Alumni App to relive our hostel sisterhood! 💕
""";
    final url = Uri.parse('whatsapp://send?text=${Uri.encodeComponent(text)}');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        title: Column(
          children: [
            Text(
              "ಸಖಿ ವಾಲ್ಟ್ • Girls' Memories",
              style: GoogleFonts.cinzel(fontWeight: FontWeight.w800, fontSize: 17, color: Colors.white),
            ),
            Text(
              "ಹಾಸ್ಟೆಲ್ ಸಖಿಯರ ನೈಜ ನೆನಪುಗಳು",
              style: GoogleFonts.tiroKannada(fontSize: 12, color: const Color(0xFFFDA4AF)),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Scene Selector Tabs
          Container(
            height: 52,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: _tabs.length,
              itemBuilder: (context, idx) {
                final isSelected = _selectedTab == idx;
                return GestureDetector(
                  onTap: () {
                    HapticFeedback.selectionClick();
                    setState(() => _selectedTab = idx);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFE11D48) : AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? const Color(0xFFFDA4AF) : AppColors.cardBorder,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: const Color(0xFFE11D48).withAlpha(100),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              ),
                            ]
                          : null,
                    ),
                    child: Center(
                      child: Text(
                        _tabs[idx],
                        style: GoogleFonts.poppins(
                          color: isSelected ? Colors.white : AppColors.textSecondary,
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Main Interactive Scene Body
          Expanded(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.all(16),
              child: _buildCurrentScene(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurrentScene() {
    switch (_selectedTab) {
      case 0:
        return _buildBucketScene();
      case 1:
        return _buildTrunkScene();
      case 2:
        return _buildBlanketScene();
      case 3:
        return _buildChitScene();
      case 4:
        return _buildRibbonScene();
      case 5:
        return _buildBirthdayScene();
      default:
        return _buildBucketScene();
    }
  }

  // -------------------------------------------------------------
  // 1. BUCKET QUEUE SCENE
  // -------------------------------------------------------------
  Widget _buildBucketScene() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "5:30 AM ಬಕೆಟ್ ಯುದ್ಧ (Bucket Queue War)",
          kannada: "45 ಹುಡುಗಿಯರು... 4 ಬಾತ್‌ರೂಮ್! ಸೋಲಾರ್ ಬಿಸಿ ನೀರಿಗಾಗಿ ಮಹಾಸಂಗ್ರಾಮ!",
          tag: "HOT WATER RUSH",
        ),
        const SizedBox(height: 14),

        // Add Bucket Action Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFE11D48).withAlpha(30),
                  shape: BoxShape.circle,
                ),
                child: const Text("🪣", style: TextStyle(fontSize: 28)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("ಬಕೆಟ್ ಲೈನ್‌ನಲ್ಲಿ ಇಡಿ!",
                        style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                    Text("ಸೋಲಾರ್ ಬಿಸಿ ನೀರು ಖಾಲಿಯಾಗೋ ಮುಂಚೆ ಸ್ನಾನ ಮಾಡಿ!",
                        style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 11)),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _addBucketDialog,
                child: const Text("ಇಡು 🪣", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),
        Text("ಹಾಸ್ಟೆಲ್ ಬಾತ್‌ರೂಮ್ ಲೈನ್ (${_buckets.length} ಬಕೆಟ್‌ಗಳು):",
            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 13)),
        const SizedBox(height: 10),

        // Bucket Queue List
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _buckets.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (ctx, i) {
            final b = _buckets[i];
            return Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: i == 0 ? Colors.greenAccent.withAlpha(80) : AppColors.cardBorder),
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: i == 0 ? Colors.green : Colors.white12,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      "#${i + 1}",
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text("🪣", style: TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(b["name"]!,
                            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text(b["note"]!,
                            style: GoogleFonts.poppins(color: const Color(0xFFFDA4AF), fontSize: 11)),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // -------------------------------------------------------------
  // 2. IRON TRUNK SECRET FOOD SCENE
  // -------------------------------------------------------------
  Widget _buildTrunkScene() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "ಪೆಟ್ಟಿಗೆ / ಟ್ರಂಕ್ ಒಳಗೆ ಸೀಕ್ರೆಟ್ ತಿಂಡಿ (Secret Dabba)",
          kannada: "ಯೂನಿಫಾರ್ಮ್ ಬಟ್ಟೆಗಳ ಕೆಳಗೆ ಬೀಗ ಹಾಕಿಟ್ಟ ಮನೆಯ ಶೇಂಗಾ ಚಟ್ನಿ ಪುಡಿ & ಅವಲಕ್ಕಿ!",
          tag: "MIDNIGHT FEAST",
        ),
        const SizedBox(height: 16),

        // Interactive Trunk
        GestureDetector(
          onTap: () {
            HapticFeedback.heavyImpact();
            setState(() => _trunkUnlocked = !_trunkUnlocked);
          },
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: _trunkUnlocked
                    ? [const Color(0xFF3B0B18), const Color(0xFF1F030B)]
                    : [const Color(0xFF1E0A12), const Color(0xFF120308)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: _trunkUnlocked ? Colors.amber : const Color(0xFF7F1D1D), width: 2),
              boxShadow: [
                BoxShadow(
                  color: _trunkUnlocked ? Colors.amber.withAlpha(40) : Colors.black87,
                  blurRadius: 18,
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(
                  _trunkUnlocked ? Icons.lock_open_rounded : Icons.lock_rounded,
                  color: _trunkUnlocked ? Colors.amber : const Color(0xFFFDA4AF),
                  size: 48,
                ),
                const SizedBox(height: 10),
                Text(
                  _trunkUnlocked ? "ಟ್ರಂಕ್ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ! (ಬಾಯಿ ಮುಚ್ಚಿ ತಿನ್ನಿ!)" : "ಸೀಕ್ರೆಟ್ ಕೀಲಿ ಟ್ಯಾಪ್ ಮಾಡಿ ಟ್ರಂಕ್ ಓಪನ್ ಮಾಡಿ!",
                  style: GoogleFonts.poppins(
                    color: _trunkUnlocked ? Colors.amber : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                Text(
                  "ವಾರ್ಡನ್ ಮ್ಯಾಮ್ ಬರ್ತಾರೆ ಎಚ್ಚರ!",
                  style: GoogleFonts.poppins(color: Colors.white60, fontSize: 11),
                ),
              ],
            ),
          ),
        ),

        if (_trunkUnlocked) ...[
          const SizedBox(height: 20),
          Text("ಟ್ರಂಕ್ ಒಳಗಿನ ನಿಧಿಗಳು (Secret Treasures):",
              style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 12),
          _buildSnackTile(
            emoji: "🌶️",
            title: "ಶೇಂಗಾ ಚಟ್ನಿ ಪುಡಿ (Shenga Chutney Pudi)",
            desc: "ಮೆಸ್ ಊಟ ಸಪ್ಪೆ ಅನ್ನಿಸಿದಾಗ ಅನ್ನಕ್ಕೆ ಕಲಸಿ ತಿಂದರೆ ಸ್ವರ್ಗದ ರುಚಿ!",
            btnText: "ಒಂದು ತುತ್ತು ಕೊಡು!",
          ),
          const SizedBox(height: 10),
          _buildSnackTile(
            emoji: "🌾",
            title: "ಮನೆಯ ಮಸಾಲೆ ಅವಲಕ್ಕಿ & ಚಕ್ಕುಲಿ",
            desc: "ರಾತ್ರಿ ಸ್ಟಡಿ ಅವರ್ಸ್ ಆದ್ಮೇಲೆ ಕಂಬಳಿ ಕೆಳಗೆ ನಾಲ್ಕು ಜನ ಹಂಚಿ ತಿಂದಿದ್ದು.",
            btnText: "ಹಂಚಿ ತಿನ್ನಿ!",
          ),
          const SizedBox(height: 10),
          _buildSnackTile(
            emoji: "🥭",
            title: "ಅಮ್ಮ ಮಾಡಿಕೊಟ್ಟ ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ",
            desc: "ಪ್ಲಾಸ್ಟಿಕ್ ಬಾಟಲ್‌ನಲ್ಲಿ ಮುಚ್ಚಿಟ್ಟ ಒಂದು ಚಮಚ ಉಪ್ಪಿನಕಾಯಿಗೆ 10 ಜನ ಕೈ ಚಾಚೋರು!",
            btnText: "ಒಂದ್ ಹನಿ ನೆಕ್ಕೋಣ!",
          ),
        ],
      ],
    );
  }

  Widget _buildSnackTile({required String emoji, required String title, required String desc, required String btnText}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 28)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12.5)),
                const SizedBox(height: 2),
                Text(desc, style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 10.5)),
              ],
            ),
          ),
          TextButton(
            onPressed: () {
              HapticFeedback.lightImpact();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("$title ಹಂಚಿ ತಿಂದ್ರಿ! ❤️"), backgroundColor: const Color(0xFFE11D48)),
              );
            },
            child: Text(btnText, style: const TextStyle(color: Color(0xFFFDA4AF), fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 3. BLANKET TALKS & GHOST STORY SCENE
  // -------------------------------------------------------------
  Widget _buildBlanketScene() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "10 PM ಲೈಟ್ಸ್-ಆಫ್ & ಕಂಬಳಿ ಹರಟೆ",
          kannada: "ವಾರ್ಡನ್ ಚಪ್ಪಲಿ ಸದ್ದು ದೂರ ಹೋದ ತಕ್ಷಣ... ಕಂಬಳಿ ಒಳಗಡೆ ಭೂತದ ಕಥೆ & ಗಾಸಿಪ್!",
          tag: "LATE NIGHT GOSSIP",
        ),
        const SizedBox(height: 14),

        // Torchlight Toggle
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text("ಟಾರ್ಚ್ ಬೆಳಕು (Torchlight under Blanket):",
                style: GoogleFonts.poppins(color: Colors.white70, fontSize: 12)),
            Switch(
              value: _torchOn,
              activeColor: Colors.amber,
              onChanged: (v) {
                HapticFeedback.selectionClick();
                setState(() => _torchOn = v);
              },
            ),
          ],
        ),
        const SizedBox(height: 10),

        AnimatedOpacity(
          duration: const Duration(milliseconds: 300),
          opacity: _torchOn ? 1.0 : 0.2,
          child: Column(
            children: [
              _buildWhisperCard(
                author: "ರೂಮ್‌ಮೇಟ್ ಗೀತಾ (Whispering)",
                msg: "ಏ, ಆ 10th ಸ್ಟ್ಯಾಂಡರ್ಡ್ ಕೃಷ್ಣ ಹೌಸ್ ಕ್ಯಾಪ್ಟನ್ ರವಿ ಇದ್ದಾನಲ್ಲ, ಇವತ್ತು ಗ್ರೌಂಡ್‌ನಲ್ಲಿ ನಿನ್ನ ಕಡೆನೇ ನೋಡ್ತಿದ್ದ ಕಣೇ! 😂",
                tag: "SCHOOL CRUSH GOSSIP",
              ),
              const SizedBox(height: 10),
              _buildWhisperCard(
                author: "ರೂಮ್‌ಮೇಟ್ ಅಶ್ವಿನಿ (Spooky Voice)",
                msg: "ನಿಜ ಹೇಳ್ತೀನಿ ಕೇಳಿ... ಮೊನ್ನೆ ರಾತ್ರಿ 11 ಗಂಟೆಗೆ ನೀರು ಕುಡಿಯೋಕೆ ಹೋದಾಗ ಹಾಸ್ಟೆಲ್ ಬೇವಿನ ಮರದ ಹತ್ರ ಬಿಳಿ ಸೀರೆ ಓಡಾಡುತ್ತಿದ್ದ ಸದ್ದು ಬಂತು! ದೆವ್ವ ಇರಬಹುದಾ?! 😱",
                tag: "GHOST STORY",
              ),
              const SizedBox(height: 10),
              _buildWhisperCard(
                author: "ವಾರ್ಡನ್ ಮ್ಯಾಮ್ ಚಪ್ಪಲಿ ಸದ್ದು (10:15 PM)",
                msg: "ಶತ್... ಎಲ್ಲರೂ ಬಾಯಿ ಮುಚ್ಚಿ ಮಲಗಿ! ಮ್ಯಾಮ್ ಬಂದ್ರು... ಕಂಬಳಿ ಮುಸುಕು ಹಾಕಿ ಕನ್ನಡ ಬುಕ್ ಹಿಡ್ಕೊಳ್ಳಿ!",
                tag: "EMERGENCY ALARM",
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildWhisperCard({required String author, required String msg, required String tag}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF150208),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(author, style: GoogleFonts.poppins(color: const Color(0xFFFDA4AF), fontWeight: FontWeight.bold, fontSize: 11)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(6)),
                child: Text(tag, style: const TextStyle(color: Colors.white70, fontSize: 9, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(msg, style: GoogleFonts.poppins(color: Colors.white, fontSize: 12.5, height: 1.45)),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 4. DESK CHIT SCENE
  // -------------------------------------------------------------
  Widget _buildChitScene() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "ಡೆಸ್ಕ್ ಕೆಳಗೆ ರಹಸ್ಯ ಚೀಟಿ (Classroom Chit Pass)",
          kannada: "ಮಾಸ್ಟರ್ ಬೋರ್ಡ್ ಕಡೆ ತಿರುಗಿದಾಗ ಡೆಸ್ಕ್ ಕೆಳಗಡೆಯಿಂದ ಪಾಸ್ ಆಗ್ತಿದ್ದ ಪುಟ್ಟ ಚೀಟಿಗಳು!",
          tag: "DESK TRANSMISSION",
        ),
        const SizedBox(height: 16),

        Center(
          child: GestureDetector(
            onTap: () {
              HapticFeedback.lightImpact();
              setState(() => _chitUnfolded = !_chitUnfolded);
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutCubic,
              width: _chitUnfolded ? 340 : 220,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: _chitUnfolded ? const Color(0xFFFEF3C7) : const Color(0xFFFFFBEB),
                borderRadius: BorderRadius.circular(14),
                boxShadow: const [
                  BoxShadow(color: Colors.black54, blurRadius: 18, offset: Offset(0, 6)),
                ],
                border: Border.all(color: Colors.black26),
              ),
              child: Column(
                children: [
                  if (!_chitUnfolded) ...[
                    const Text("📩", style: TextStyle(fontSize: 32)),
                    const SizedBox(height: 8),
                    Text(
                      "[ Folded Paper Chit ]",
                      style: GoogleFonts.poppins(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    Text(
                      "(ಟ್ಯಾಪ್ ಮಾಡಿ ಬಿಡಿಸಿ ಓದಿ)",
                      style: GoogleFonts.tiroKannada(color: Colors.black54, fontSize: 11),
                    ),
                  ] else ...[
                    Text(
                      "ರಹಸ್ಯ ಚೀಟಿ ಸಂದೇಶ 💌",
                      style: GoogleFonts.poppins(color: Colors.red[900], fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    const Divider(color: Colors.black26),
                    Text(
                      _activeChit,
                      style: GoogleFonts.caveat(color: const Color(0xFF1E293B), fontSize: 18, fontWeight: FontWeight.w600),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF25D366)),
                      onPressed: _shareChitOnWhatsApp,
                      icon: const Icon(Icons.share, size: 16, color: Colors.white),
                      label: const Text("Share on WhatsApp", style: TextStyle(color: Colors.white, fontSize: 11)),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),

        const SizedBox(height: 24),
        Text("ಇತರ ಕ್ಲಾಸಿಕ್ ಚೀಟಿಗಳು (Tap to Read):",
            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
        const SizedBox(height: 8),
        _buildChitOption("ಆ ಸರ್ ಇವತ್ತು ಸಿಕ್ಕಾಪಟ್ಟೆ ಕೋಪದಲ್ಲಿದ್ದಾರೆ, ಹೋಂವರ್ಕ್ ರೆಡಿ ಇಟ್ಕೋ!"),
        _buildChitOption("ಬೆಲ್ ಆದ ತಕ್ಷಣ ಮೆಸ್‌ಗೆ ಓಡೋಣ, ಇವತ್ತು ಕೇಸರಿ ಬಾತ್ ಇರುತ್ತಂತೆ!"),
        _buildChitOption("ನಿನ್ನ ಗ್ರೀನ್ ಸ್ಕೆಚ್ ಪೆನ್ ಕೊಡು, ಹೆಡ್ಡಿಂಗ್ ಅಂಡರ್‌ಲೈನ್ ಮಾಡ್ಬೇಕು!"),
      ],
    );
  }

  Widget _buildChitOption(String text) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        setState(() {
          _activeChit = text;
          _chitUnfolded = true;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Row(
          children: [
            const Text("📝", style: TextStyle(fontSize: 16)),
            const SizedBox(width: 10),
            Expanded(child: Text(text, style: GoogleFonts.poppins(color: Colors.white70, fontSize: 11.5))),
            const Icon(Icons.chevron_right, size: 16, color: Colors.white38),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------
  // 5. WHITE RIBBON RUSH SCENE
  // -------------------------------------------------------------
  Widget _buildRibbonScene() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "8:15 AM ಮಾರ್ನಿಂಗ್ ಪ್ಯಾನಿಕ್ (The White Ribbon Rush)",
          kannada: "ಅಸೆಂಬ್ಲಿಗೆ ಬೆಲ್ ಹೊಡಿತಾರೆ... 'ನಂದು ವೈಟ್ ರಿಬ್ಬನ್ ಎಲ್ಲಿ?!'",
          tag: "MORNING EMERGENCY",
        ),
        const SizedBox(height: 14),

        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFF1A0208),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE11D48)),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("ಅಸೆಂಬ್ಲಿ ಬೆಲ್‌ಗೆ ಉಳಿದ ಸಮಯ:",
                      style: GoogleFonts.poppins(color: const Color(0xFFFDA4AF), fontSize: 11, fontWeight: FontWeight.bold)),
                  const Text("08:14:42 AM ⏰",
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  minimumSize: const Size(double.infinity, 44),
                ),
                onPressed: () {
                  HapticFeedback.heavyImpact();
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF1B040B),
                      title: const Text("🚨 ರಿಬ್ಬನ್ ಸಿಕ್ತು!", style: TextStyle(color: Colors.white)),
                      content: const Text(
                        "ರೂಮ್‌ಮೇಟ್ ಸೌಮ್ಯ ಕಟ್ಕೊಂಡು ಹೋಗಿದ್ದಳು! ಕಸ್ಕೊಂಡು ಎರಡು ಜಡೆ ಹಾಕಿ ಗ್ರೌಂಡ್ ಕಡೆ ಓಡಿ! ವಾರ್ಡನ್ ಮ್ಯಾಮ್ ಸಿಳ್ಳೆ ಹೊಡೆದ್ರು!",
                        style: TextStyle(color: Color(0xFFFDA4AF)),
                      ),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("OK")),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.search, color: Colors.white, size: 18),
                label: const Text("ವೈಟ್ ರಿಬ್ಬನ್ ಹುಡುಕಿ! 🎀", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),
        _buildPanicCheckItem("ಯೂನಿಫಾರ್ಮ್ ಐರನ್ ಆಗಿಲ್ಲ!", "ರಾತ್ರಿ ತೊಳೆದ ದುಪಟ್ಟಾ ತೇವ ಇದೆ, ಫ್ಯಾನ್ ಕೆಳಗೆ ಹಿಡಿದು ಒಣಗಿಸೋದು!"),
        _buildPanicCheckItem("ಬೆಲ್ಟ್ & ಬ್ಯಾಡ್ಜ್ ನಾಪತ್ತೆ", "ರೂಮ್‌ಮೇಟ್ ಗೀತಾ ಬೆಲ್ಟ್ ಅದಲು-ಬದಲು ಮಾಡ್ಕೊಂಡು ಹೋಗಿದ್ದಾಳೆ!"),
        _buildPanicCheckItem("ಎರಡು ಜಡೆ ಇನ್‌ಸ್ಪೆಕ್ಷನ್", "ವಾರ್ಡನ್ ಮ್ಯಾಮ್ ಲೈನ್‌ನಲ್ಲಿ ನಿಲ್ಲಿಸಿ ಜಡೆ ಚೆಕ್ ಮಾಡ್ತಾರೆ!"),
      ],
    );
  }

  Widget _buildPanicCheckItem(String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Row(
        children: [
          const Text("⚡", style: TextStyle(fontSize: 22)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                Text(desc, style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------
  // 6. BIRTHDAY VIP CANDY SCENE
  // -------------------------------------------------------------
  Widget _buildBirthdayScene() {
    final teachers = [
      {"name": "Revensiddappa Sir", "sub": "Maths", "candy": "Éclairs", "reply": "ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು ಮಗಳೇ! 100/100 ಮಾರ್ಕ್ಸ್ ತೆಗಿಬೇಕು ಲೆಕ್ಕದಲ್ಲಿ!"},
      {"name": "Sumanth Sir", "sub": "English", "candy": "Mango Bite", "reply": "Happy Birthday! Speak fluent English and make MDRS proud!"},
      {"name": "Bhagamma Mam", "sub": "Social Science", "candy": "Alpenliebe", "reply": "ಚಿನ್ನದಂಥ ಹುಡುಗಿ! ಚೆನ್ನಾಗಿ ಓದಿ KAS/IAS ಆಫೀಸರ್ ಆಗು ತಾಯಿ!"},
      {"name": "Warden Mam", "sub": "Hostel", "candy": "Dairy Milk", "reply": "ರೂಮ್‌ನಲ್ಲಿ ಗಲಾಟೆ ಕಡಿಮೆ ಮಾಡಿ ಓದಿಕೋ! ದೀರ್ಘಾಯುಷ್ಯವಾಗಲಿ!"},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSceneHeader(
          title: "ಬರ್ತ್‌ಡೇ ಕಲರ್ ಡ್ರೆಸ್ & ಚಾಕೋಲೇಟ್ (Birthday VIP Day)",
          kannada: "ಯೂನಿಫಾರ್ಮ್ ಬದಲು ಹೊಸ ಕಲರ್ ಡ್ರೆಸ್... ಬೆಸ್ಟ್ ಫ್ರೆಂಡ್ ಜೊತೆ ಸ್ಟಾಫ್ ರೂಮ್‌ಗೆ ಚಾಕೋಲೇಟ್ ಹಂಚೋದು!",
          tag: "CELEBRITY WALK",
        ),
        const SizedBox(height: 14),

        Text("ಮಾಸ್ಟರ್‌ಗಳಿಗೆ ಚಾಕೋಲೇಟ್ ಕೊಡಿ (Tap to Gift Candy):",
            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
        const SizedBox(height: 10),

        Column(
          children: teachers.map((t) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Row(
                children: [
                  const Text("🍬", style: TextStyle(fontSize: 26)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("${t['name']} (${t['sub']})",
                            style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text("ಚಾಕೋಲೇಟ್: ${t['candy']}",
                            style: GoogleFonts.poppins(color: const Color(0xFFFDA4AF), fontSize: 11)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE11D48)),
                    onPressed: () {
                      HapticFeedback.mediumImpact();
                      setState(() {
                        _birthdayBlessing = "${t['name']}: \"${t['reply']}\"";
                      });
                    },
                    child: const Text("ಕೊಡು 🍬", style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }).toList(),
        ),

        if (_birthdayBlessing != null) ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.pink.withAlpha(25),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.pinkAccent),
            ),
            child: Row(
              children: [
                const Text("🌸", style: TextStyle(fontSize: 24)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _birthdayBlessing!,
                    style: GoogleFonts.poppins(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSceneHeader({required String title, required String kannada, required String tag}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFE11D48).withAlpha(30),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFE11D48)),
                ),
                child: Text(tag, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              ),
              const Icon(Icons.favorite_rounded, color: Color(0xFFE11D48), size: 18),
            ],
          ),
          const SizedBox(height: 8),
          Text(title, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 4),
          Text(kannada, style: GoogleFonts.tiroKannada(color: const Color(0xFFFDA4AF), fontSize: 12.5, height: 1.4)),
        ],
      ),
    );
  }
}
