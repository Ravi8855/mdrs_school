import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';
import '../gallery/gallery_screen.dart';
import '../students_zone/students_zone_screen.dart';
import '../uniform_kits/uniform_kits_screen.dart';
import '../voting/voting_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // Hero Campus Header with Royal Purple Atmosphere & Golden Accents
          SliverAppBar(
            expandedHeight: 330,
            pinned: false,
            elevation: 0,
            backgroundColor: AppColors.primaryDeep,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // School building image
                  Image.asset(
                    'assets/images/college.jpg',
                    fit: BoxFit.cover,
                    alignment: Alignment.topCenter,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: AppColors.primaryDeep,
                    ),
                  ),

                  // Crystal-clear building image at top with smooth purple transition towards bottom
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.transparent,
                          const Color(0x552A0D52),
                          const Color(0xEE3B0D66),
                          AppColors.background,
                        ],
                        stops: const [0.0, 0.36, 0.62, 0.88, 1.0],
                      ),
                    ),
                  ),

                  // Glowing Neon Violet / Magenta Aurora Wave Curves
                  Positioned.fill(
                    child: CustomPaint(
                      painter: _HeroWavePainter(),
                    ),
                  ),

                  // Hero Contents (Morarji Photo + Name)
                  Positioned(
                    bottom: 24,
                    left: 20,
                    right: 20,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 66,
                          height: 66,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.gold, width: 2.5),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.gold.withAlpha(150),
                                blurRadius: 14,
                                spreadRadius: 1,
                              ),
                              BoxShadow(
                                color: Colors.black.withAlpha(120),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: ClipOval(
                            child: Image.asset(
                              'assets/images/desai.jpg',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  const Icon(Icons.person, color: Colors.white),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                "Morarji Desai",
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w700,
                                  shadows: const [
                                    Shadow(color: Colors.black54, blurRadius: 6),
                                  ],
                                ),
                              ),
                              Text(
                                "Residential School, Dorigudda",
                                style: GoogleFonts.poppins(
                                  color: AppColors.gold,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  shadows: const [
                                    Shadow(color: Colors.black54, blurRadius: 6),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Main Body Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Floating Campus Location Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.cardBorder, width: 0.8),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x1F7C3AED),
                          blurRadius: 18,
                          spreadRadius: 1,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(9),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withAlpha(25),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.location_on,
                            color: AppColors.primary,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Campus Location",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textViolet,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textSecondary,
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Icon(
                          Icons.chevron_right,
                          color: AppColors.textMuted,
                          size: 22,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Section Title: EXPLORE COMMUNITY
                  Text(
                    "EXPLORE COMMUNITY",
                    style: GoogleFonts.poppins(
                      color: AppColors.textViolet,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // 2x2 Feature Highlights (Matching exact screenshot layout & icons)
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 14,
                    crossAxisSpacing: 14,
                    childAspectRatio: 1.18,
                    children: [
                      _buildFeatureCard(
                        context,
                        title: "Students Zone",
                        subtitle: "Wall of Fame & Legends",
                        icon: Icons.school_rounded,
                        iconColor: const Color(0xFFD946EF), // Vibrant Magenta
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const StudentsZoneScreen()),
                        ),
                      ),
                      _buildFeatureCard(
                        context,
                        title: "Uniform & Kits",
                        subtitle: "School dress & kit box",
                        icon: Icons.checkroom_rounded,
                        iconColor: AppColors.primary, // Royal Violet
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const UniformKitsScreen()),
                        ),
                      ),
                      _buildFeatureCard(
                        context,
                        title: "Class Voting",
                        subtitle: "Who's who titles",
                        icon: Icons.how_to_vote_rounded,
                        iconColor: const Color(0xFF9333EA), // Purple
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const VotingScreen()),
                        ),
                      ),
                      _buildFeatureCard(
                        context,
                        title: "Photo Gallery",
                        subtitle: "Campus memories",
                        icon: Icons.photo_library_rounded,
                        iconColor: AppColors.primaryLight, // Orchid Violet
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const GalleryScreen()),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 26),

                  // School Leadership Section Header
                  Text(
                    "SCHOOL LEADERSHIP",
                    style: GoogleFonts.poppins(
                      color: AppColors.textViolet,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Headmaster Card in Pure White Card Styling
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.cardBorder, width: 0.8),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x1F7C3AED),
                          blurRadius: 18,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.primary.withAlpha(80), width: 1.5),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(15),
                            child: Image.asset(
                              StaticData.principal.image,
                              width: 72,
                              height: 82,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withAlpha(25),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.primary.withAlpha(70)),
                                ),
                                child: Text(
                                  "HEADMASTER",
                                  style: GoogleFonts.poppins(
                                    color: AppColors.primary,
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                StaticData.principal.name,
                                style: GoogleFonts.poppins(
                                  color: AppColors.textPrimary,
                                  fontSize: 15.5,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                StaticData.principal.bio ??
                                    "Principal, Morarji Desai Residential School",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Feature Card: Clean White Card with Drop Shadow, Top Centered Colorful Icon
  Widget _buildFeatureCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.cardBorder, width: 0.8),
          boxShadow: const [
            BoxShadow(
              color: Color(0x187C3AED),
              blurRadius: 16,
              spreadRadius: 1,
              offset: Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(icon, color: iconColor, size: 36),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700,
                fontSize: 13.5,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                color: AppColors.textSecondary,
                fontSize: 10.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Glowing Neon Wave Painter for Hero Sky
class _HeroWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Soft Purple Aurora Ribbon 1
    final wave1 = Path();
    wave1.moveTo(0, h * 0.65);
    wave1.cubicTo(w * 0.35, h * 0.82, w * 0.65, h * 0.55, w, h * 0.72);
    wave1.lineTo(w, h);
    wave1.lineTo(0, h);
    wave1.close();

    final paint1 = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x35C084FC),
          Color(0x40D946EF),
          Color(0x20A855F7),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(wave1, paint1);

    // Flowing Neon Stroke Ribbon 2
    final wave2 = Path();
    wave2.moveTo(-20, h * 0.75);
    wave2.cubicTo(w * 0.38, h * 0.62, w * 0.72, h * 0.85, w + 20, h * 0.68);

    final paint2 = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x779333EA),
          Color(0xCCE879F9),
          Color(0x66C084FC),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;
    canvas.drawPath(wave2, paint2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
