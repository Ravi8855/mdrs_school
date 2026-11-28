import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../gallery/gallery_screen.dart';
import '../hostel/hostel_screen.dart';
import '../teachers_soundboard/teachers_soundboard_screen.dart';
import 'day_at_mdrs_screen.dart';
import 'iconic_moments_screen.dart';
import 'mdrsian_bingo_screen.dart';

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        title: Text(
          "Interactive Features",
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800, fontSize: 20, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        children: [
          _buildFeatureTile(
            context,
            title: "Hostel Life & Houses",
            subtitle: "Explore Krishna, Bhima, Sindhu, Godhawari, Kaveri, Yamuna & Ganga houses.",
            icon: Icons.hotel_rounded,
            badge: "COMMUNITY",
            accentColor: const Color(0xFF1D4ED8), // Deep Royal Blue
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
            accentColor: AppColors.primary, // Deep Burgundy
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
            accentColor: const Color(0xFFB45309), // Deep Warm Amber
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
            accentColor: const Color(0xFFB91C1C), // Deep Crimson
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
            accentColor: const Color(0xFF047857), // Deep Emerald Forest Green
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const GalleryScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "Iconic Moments",
            subtitle: "Explore legendary stories from all students or share your own iconic campus moment!",
            icon: Icons.military_tech_rounded,
            badge: "HALL OF LEGENDS",
            accentColor: const Color(0xFFD97706), // Warm Gold Amber
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const IconicMomentsScreen()),
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
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.roseGold.withAlpha(100), width: 1.1),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withAlpha(16),
              blurRadius: 14,
              spreadRadius: 1,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: Colors.black.withAlpha(10),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon Container with rich tint
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: accentColor.withAlpha(25),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: accentColor.withAlpha(80), width: 1.0),
              ),
              child: Icon(icon, color: accentColor, size: 28),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Badge Pill
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                        decoration: BoxDecoration(
                          color: accentColor.withAlpha(25),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: accentColor.withAlpha(70), width: 0.9),
                        ),
                        child: Text(
                          badge,
                          style: GoogleFonts.poppins(
                            color: accentColor,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      // Circular Chevron Button
                      Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          color: AppColors.blushPink,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.roseGold.withAlpha(70), width: 0.8),
                        ),
                        child: const Icon(
                          Icons.chevron_right_rounded,
                          size: 18,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      color: AppColors.textPrimary,
                      fontSize: 15.5,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: GoogleFonts.poppins(
                      color: const Color(0xFF4A343F),
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
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
