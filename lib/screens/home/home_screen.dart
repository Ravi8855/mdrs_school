import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';
import '../gallery/gallery_screen.dart';
import '../students_zone/students_zone_screen.dart';
import '../uniform_kits/uniform_kits_screen.dart';
import '../farewell_shirt/farewell_shirt_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // Hero Campus Header with Deep Obsidian Crimson Atmosphere & Sculpted Metallic Branding
          SliverAppBar(
            expandedHeight: 340,
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

                  // Smooth Obsidian Crimson transition towards bottom
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          const Color(0x33000000),
                          const Color(0x883B040F),
                          const Color(0xF0120105),
                          AppColors.background,
                        ],
                        stops: const [0.0, 0.30, 0.60, 0.88, 1.0],
                      ),
                    ),
                  ),

                  // Glowing Sculpted Ruby Red Satin Wave Curves (matching reference image)
                  Positioned.fill(
                    child: CustomPaint(
                      painter: _HeroWavePainter(),
                    ),
                  ),


                  // Hero Contents (Morarji Photo + Name)
                  Positioned(
                    bottom: 22,
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
                            border: Border.all(color: AppColors.primaryLight, width: 2.5),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primary.withAlpha(160),
                                blurRadius: 16,
                                spreadRadius: 2,
                              ),
                              BoxShadow(
                                color: Colors.black.withAlpha(150),
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
                                  color: AppColors.chromeSilver,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w700,
                                  shadows: const [
                                    Shadow(color: Colors.black87, blurRadius: 8),
                                  ],
                                ),
                              ),
                              Text(
                                "Residential School, Dorigudda",
                                style: GoogleFonts.poppins(
                                  color: AppColors.primaryLight,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  shadows: const [
                                    Shadow(color: Colors.black87, blurRadius: 8),
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
                  // Floating Campus Location Card (Deep Obsidian Satin Ruby)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.cardBorder, width: 1.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.cardShadow,
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
                            color: AppColors.primary.withAlpha(35),
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.primary.withAlpha(80)),
                          ),
                          child: const Icon(
                            Icons.location_on,
                            color: AppColors.primaryLight,
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
                                  color: AppColors.primaryLight,
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
                      color: AppColors.primaryLight,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // 2x2 Feature Highlights (Sculpted Metallic Cards)
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
                        iconColor: const Color(0xFFFF2A55), // Radiant Scarlet
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
                        iconColor: AppColors.primary, // Ruby Red
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const UniformKitsScreen()),
                        ),
                      ),
                      _buildFeatureCard(
                        context,
                        title: "Farewell Shirt",
                        subtitle: "Class 10th autographs",
                        icon: Icons.draw_rounded,
                        iconColor: const Color(0xFFF43F5E), // Nostalgic Ruby Rose
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const FarewellShirtScreen()),
                        ),
                      ),
                      _buildFeatureCard(
                        context,
                        title: "Photo Gallery",
                        subtitle: "Campus memories",
                        icon: Icons.photo_library_rounded,
                        iconColor: AppColors.chromeSilver, // Polished Silver
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
                      color: AppColors.primaryLight,
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Headmaster Card in Obsidian Ruby Card Styling
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.cardBorder, width: 1.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.cardShadow,
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
                            border: Border.all(color: AppColors.primary.withAlpha(120), width: 1.5),
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
                                  color: AppColors.primary.withAlpha(35),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.primary.withAlpha(90)),
                                ),
                                child: Text(
                                  "HEADMASTER",
                                  style: GoogleFonts.poppins(
                                    color: AppColors.primaryLight,
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

  // Feature Card: Obsidian Ruby Satin Card with Drop Shadow, Top Centered Metallic Icon
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
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.cardBorder, width: 1.0),
          boxShadow: const [
            BoxShadow(
              color: AppColors.cardShadow,
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

// Glowing Sculpted Ruby Red Satin Wave Painter for Hero Sky (matching user reference image)
class _HeroWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Sculpted Deep Ruby Crimson Satin Wave 1
    final wave1 = Path();
    wave1.moveTo(0, h * 0.65);
    wave1.cubicTo(w * 0.35, h * 0.82, w * 0.65, h * 0.55, w, h * 0.72);
    wave1.lineTo(w, h);
    wave1.lineTo(0, h);
    wave1.close();

    final paint1 = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x35DC2626),
          Color(0x50FF2A55),
          Color(0x207F1D1D),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(wave1, paint1);

    // Flowing High-Gloss Neon Scarlet Stroke Ribbon 2
    final wave2 = Path();
    wave2.moveTo(-20, h * 0.75);
    wave2.cubicTo(w * 0.38, h * 0.62, w * 0.72, h * 0.85, w + 20, h * 0.68);

    final paint2 = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x88991B1B),
          Color(0xFFFF2A55),
          Color(0x66DC2626),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.8;
    canvas.drawPath(wave2, paint2);

    // Top-left smooth satin red curve accent (like the image)
    final wave3 = Path();
    wave3.moveTo(0, h * 0.18);
    wave3.cubicTo(w * 0.3, h * 0.05, w * 0.5, h * 0.25, w, h * 0.12);

    final paint3 = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x55DC2626),
          Color(0x20FF2A55),
          Colors.transparent,
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawPath(wave3, paint3);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
