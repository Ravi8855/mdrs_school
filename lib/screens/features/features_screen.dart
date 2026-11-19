import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../gallery/gallery_screen.dart';
import '../hostel/hostel_screen.dart';
import '../teachers_soundboard/teachers_soundboard_screen.dart';
import 'day_at_mdrs_screen.dart';
import 'mdrsian_bingo_screen.dart';

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          "Interactive Features",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 20, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(16),
        children: [
          _buildFeatureTile(
            context,
            title: "Hostel Life & Houses",
            subtitle: "Explore Krishna, Bhima, Sindhu, Godhawari, Kaveri, Yamuna & Ganga houses.",
            icon: Icons.hotel_rounded,
            badge: "COMMUNITY",
            accentColor: Colors.blueAccent,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const HostelScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "How Much MDRSian Are You?",
            subtitle: "Tick classic hostel & school memories you lived and unlock your shareable MDRS Legend Score!",
            icon: Icons.fact_check_rounded,
            badge: "MEMORY BINGO",
            accentColor: AppColors.primary,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const MdrsianBingoScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "A Day at MDRS",
            subtitle: "Live 24-hour hostel & school routine — see what you used to do at this exact hour on campus!",
            icon: Icons.wb_twilight_rounded,
            badge: "LIVE TIMELINE",
            accentColor: const Color(0xFFD97706),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const DayAtMdrsScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "Teachers' Soundboard",
            subtitle: "Revansiddappa Sir, Subhash Sir, Shatlingappa Sir & masters' iconic dialogues with Mic audio!",
            icon: Icons.record_voice_over_rounded,
            badge: "ಗುರುಗಳ ಧ್ವನಿ",
            accentColor: const Color(0xFFE11D48),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TeachersSoundboardScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "Campus Photo Gallery",
            subtitle: "Historical collection of school memories, events, functions, and campus views.",
            icon: Icons.photo_library_rounded,
            badge: "MEMORIES",
            accentColor: Colors.greenAccent,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const GalleryScreen()),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureTile(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required String badge,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.cardBorder, width: 0.8),
          boxShadow: const [
            BoxShadow(
              color: Color(0x187C3AED),
              blurRadius: 18,
              offset: Offset(0, 5),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: accentColor.withAlpha(25),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: accentColor.withAlpha(70)),
              ),
              child: Icon(icon, color: accentColor, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: accentColor.withAlpha(20),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: accentColor.withAlpha(50)),
                        ),
                        child: Text(
                          badge,
                          style: GoogleFonts.poppins(
                            color: accentColor,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: GoogleFonts.poppins(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
