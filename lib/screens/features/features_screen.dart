import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../gallery/gallery_screen.dart';
import '../games/bell_game_screen.dart';
import '../hostel/hostel_screen.dart';
import '../voting/voting_screen.dart';

class FeaturesScreen extends StatelessWidget {
  const FeaturesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(
          "Interactive Features",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 20),
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
            title: "Bell Ring Madness",
            subtitle: "Test your lightning reaction time on the school bell! Global & local leaderboard.",
            icon: Icons.notifications_active_rounded,
            badge: "GAME",
            accentColor: AppColors.primary,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const BellGameScreen()),
            ),
          ),
          const SizedBox(height: 14),
          _buildFeatureTile(
            context,
            title: "Class Voting",
            subtitle: "Vote for Class Comedian, Non-Stop Talker, Debate Champion & celebrate winners!",
            icon: Icons.how_to_vote_rounded,
            badge: "LIVE POLL",
            accentColor: Colors.purpleAccent,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const VotingScreen()),
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
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(60),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: accentColor.withAlpha(35),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: accentColor.withAlpha(100)),
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
                          color: accentColor.withAlpha(30),
                          borderRadius: BorderRadius.circular(6),
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
                      Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textMuted),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
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
