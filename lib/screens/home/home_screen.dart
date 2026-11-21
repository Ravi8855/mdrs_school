import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';
import '../gallery/gallery_screen.dart';
import '../students_zone/students_zone_screen.dart';
import '../uniform_kits/uniform_kits_screen.dart';
import '../farewell_shirt/farewell_shirt_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Future<void> _openCampusMap(BuildContext context) async {
    HapticFeedback.lightImpact();
    final Uri mapUri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=Morarji+Desai+Residential+School+Dorigudda+Ukkenala+Shahapur+Yadgir',
    );
    try {
      if (await canLaunchUrl(mapUri)) {
        await launchUrl(mapUri, mode: LaunchMode.externalApplication);
      } else {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Campus: Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309'),
              backgroundColor: AppColors.primary,
            ),
          );
        }
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Campus: Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309'),
            backgroundColor: AppColors.primary,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // 1. Luxury White & Rose Gold Hero Header
          SliverToBoxAdapter(
            child: _buildLuxuryHeader(context, topPadding),
          ),

          // 2. Main Body Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 3. Floating Campus Location Card
                  _buildCampusLocationCard(context),

                  const SizedBox(height: 22),

                  // 4. Section: Explore Community
                  _buildSectionHeader(
                    iconWidget: _buildPolaroidIcon(),
                    title: "Explore Community",
                  ),

                  const SizedBox(height: 14),

                  // 5. 2x2 Feature Community Cards
                  _buildCommunityGrid(context),

                  const SizedBox(height: 24),

                  // 6. Section: School Leadership
                  _buildSectionHeader(
                    iconWidget: const Icon(
                      Icons.workspace_premium_rounded,
                      color: AppColors.metallicGold,
                      size: 22,
                    ),
                    title: "School Leadership",
                  ),

                  const SizedBox(height: 14),

                  // 7. Leadership Card (Headmaster Eranna Arkera Sir)
                  _buildLeadershipCard(context),

                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // 1. LUXURY HEADER WITH REAL CAMPUS PHOTO & CURVED GOLDEN RIBBONS
  // ==========================================
  Widget _buildLuxuryHeader(BuildContext context, double topPadding) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.background,
      ),
      child: Column(
        children: [
          // Top Hero Photo & Branding Container
          Stack(
            children: [
              // School Building Photograph with top-right positioning
              SizedBox(
                height: 260 + topPadding,
                width: double.infinity,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Campus photo
                    Image.asset(
                      'assets/images/college.jpg',
                      fit: BoxFit.cover,
                      alignment: Alignment.center,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: const Color(0xFFFBE4E8),
                      ),
                    ),

                    // Soft Ivory & Rose Gold Atmospheric Gradient
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.white.withAlpha(200),
                            Colors.white.withAlpha(120),
                            Colors.white.withAlpha(180),
                            AppColors.background,
                          ],
                          stops: const [0.0, 0.40, 0.80, 1.0],
                        ),
                      ),
                    ),

                    // Top Left Soft White/Pink Vignette for brand readability
                    Positioned(
                      top: 0,
                      left: 0,
                      right: 120,
                      bottom: 80,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: RadialGradient(
                            center: Alignment.topLeft,
                            radius: 1.2,
                            colors: [
                              Colors.white.withAlpha(235),
                              Colors.white.withAlpha(180),
                              Colors.transparent,
                            ],
                            stops: const [0.0, 0.55, 1.0],
                          ),
                        ),
                      ),
                    ),

                    // Cherry blossom petal painter accents
                    Positioned.fill(
                      child: CustomPaint(
                        painter: _CherryBlossomPainter(),
                      ),
                    ),

                    // Flowing Rose Gold & Metallic Gold Wave Ribbon Curves at bottom
                    Positioned(
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 80,
                      child: CustomPaint(
                        painter: _HeroWavePainter(),
                      ),
                    ),

                    // Top Left "School Memory App" Branding
                    Positioned(
                      top: topPadding + 10,
                      left: 16,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          // Camera Logo with Heart
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [Color(0xFFFFF0F2), Color(0xFFFBE4E8)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              border: Border.all(color: AppColors.roseGold.withAlpha(140), width: 1.5),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primary.withAlpha(25),
                                  blurRadius: 10,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: Image.asset(
                                'assets/images/school_memory_logo.png',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => const Icon(
                                  Icons.camera_alt_rounded,
                                  color: AppColors.primary,
                                  size: 26,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    "School ",
                                    style: GoogleFonts.playfairDisplay(
                                      color: AppColors.textPrimary,
                                      fontSize: 19,
                                      fontWeight: FontWeight.w700,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                  Text(
                                    "Memory App",
                                    style: GoogleFonts.poppins(
                                      color: AppColors.primary,
                                      fontSize: 18,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 1),
                              Text(
                                "Capture • Relive • Cherish\nOur School Journey ♡",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textSecondary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w500,
                                  height: 1.25,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Morarji Desai Institution Branding Row (Framed portrait + Name)
          Padding(
            padding: const EdgeInsets.only(top: 6, bottom: 10, left: 20, right: 20),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Circular portrait of Morarji Desai with Metallic Gold Ring & Laurel Accents
                Stack(
                  alignment: Alignment.center,
                  children: [
                    // Golden laurel sprigs behind portrait
                    SizedBox(
                      width: 82,
                      height: 82,
                      child: CustomPaint(
                        painter: _GoldenLaurelPainter(),
                      ),
                    ),
                    // Circular Portrait
                    Container(
                      width: 62,
                      height: 62,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.metallicGold, width: 2.2),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.metallicGold.withAlpha(90),
                            blurRadius: 10,
                            spreadRadius: 1,
                          ),
                          BoxShadow(
                            color: AppColors.primary.withAlpha(35),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/desai.jpg',
                          fit: BoxFit.cover,
                          alignment: Alignment.topCenter,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.person, color: AppColors.primary),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(width: 14),

                // Vertical Rose Gold Divider Line
                Container(
                  width: 2.5,
                  height: 42,
                  decoration: BoxDecoration(
                    color: AppColors.roseGold.withAlpha(180),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),

                const SizedBox(width: 14),

                // Institution Name & Location
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Morarji Desai",
                        style: GoogleFonts.playfairDisplay(
                          color: AppColors.primary,
                          fontSize: 19,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "Residential School, Dorigudda",
                        style: GoogleFonts.poppins(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),

                // Right-side Golden Laurel Branch accent
                Transform.flip(
                  flipX: true,
                  child: SizedBox(
                    width: 32,
                    height: 50,
                    child: CustomPaint(
                      painter: _SingleLaurelPainter(),
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

  // ==========================================
  // 3. CAMPUS LOCATION CARD
  // ==========================================
  Widget _buildCampusLocationCard(BuildContext context) {
    return InkWell(
      onTap: () => _openCampusMap(context),
      borderRadius: BorderRadius.circular(22),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AppColors.cardBorder, width: 1.0),
          boxShadow: const [
            BoxShadow(
              color: AppColors.cardShadow,
              blurRadius: 16,
              spreadRadius: 1,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Soft Blush Pink Circle with Burgundy Pin
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: AppColors.blushPink,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.roseGold.withAlpha(90), width: 1.0),
              ),
              child: const Icon(
                Icons.location_on_rounded,
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
                      color: AppColors.primary,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    "Dorigudda Ukkenala, Shahapur, Yadgir\nDist – 585309",
                    style: GoogleFonts.poppins(
                      color: AppColors.textSecondary,
                      fontSize: 11.5,
                      fontWeight: FontWeight.w500,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            // Right-side circular chevron button
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: AppColors.background,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.cardBorder, width: 1.0),
              ),
              child: const Icon(
                Icons.chevron_right_rounded,
                color: AppColors.primary,
                size: 22,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // SECTION HEADER WITH SERIF TYPOGRAPHY & DIVIDER
  // ==========================================
  Widget _buildSectionHeader({
    required Widget iconWidget,
    required String title,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        iconWidget,
        const SizedBox(width: 8),
        Text(
          title,
          style: GoogleFonts.playfairDisplay(
            color: AppColors.deepWine,
            fontSize: 18,
            fontWeight: FontWeight.w700,
            fontStyle: FontStyle.italic,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Container(
            height: 1.2,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.roseGold.withAlpha(160),
                  AppColors.roseGold.withAlpha(10),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPolaroidIcon() {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        color: AppColors.blushPink,
        borderRadius: BorderRadius.circular(5),
        border: Border.all(color: AppColors.roseGold, width: 1.2),
      ),
      child: const Icon(
        Icons.photo_library_outlined,
        color: AppColors.primary,
        size: 13,
      ),
    );
  }

  // ==========================================
  // 4. EXPLORE COMMUNITY 2x2 FEATURE GRID
  // ==========================================
  Widget _buildCommunityGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 14,
      crossAxisSpacing: 14,
      childAspectRatio: 0.94,
      children: [
        // Card 1: Students Zone
        _buildCommunityCard(
          context,
          title: "Students Zone",
          subtitle: "Wall of Fame & Legends",
          imagePath: "assets/images/students_zone_art.png",
          gradientColors: const [Color(0xFFFFF0F2), Color(0xFFFDE4E8)],
          fallbackIcon: Icons.school_rounded,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const StudentsZoneScreen()),
          ),
        ),

        // Card 2: Uniform & Kits
        _buildCommunityCard(
          context,
          title: "Uniform & Kits",
          subtitle: "School Dress & Kit Box",
          imagePath: "assets/images/uniform_kits_art.png",
          gradientColors: const [Color(0xFFFFF5F0), Color(0xFFFDEAE4)],
          fallbackIcon: Icons.checkroom_rounded,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const UniformKitsScreen()),
          ),
        ),

        // Card 3: Farewell Shirt
        _buildCommunityCard(
          context,
          title: "Farewell Shirt",
          subtitle: "Class 10th Autographs",
          imagePath: "assets/images/farewell_shirt_art.png",
          gradientColors: const [Color(0xFFFFF0F4), Color(0xFFFCE3EC)],
          fallbackIcon: Icons.draw_rounded,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const FarewellShirtScreen()),
          ),
        ),

        // Card 4: Photo Gallery
        _buildCommunityCard(
          context,
          title: "Photo Gallery",
          subtitle: "Campus Memories",
          imagePath: "assets/images/photo_gallery_art.png",
          gradientColors: const [Color(0xFFFFF9F5), Color(0xFFFCEFE9)],
          fallbackIcon: Icons.photo_camera_rounded,
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const GalleryScreen()),
          ),
        ),
      ],
    );
  }

  Widget _buildCommunityCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String imagePath,
    required List<Color> gradientColors,
    required IconData fallbackIcon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
      borderRadius: BorderRadius.circular(22),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.white, width: 1.4),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withAlpha(16),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // 3D Illustrated Graphic Artwork
            Expanded(
              child: Center(
                child: Image.asset(
                  imagePath,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(200),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.roseGold.withAlpha(100)),
                    ),
                    child: Icon(fallbackIcon, color: AppColors.primary, size: 30),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 6),
            // Text & Small Circular Burgundy Arrow Row
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                          fontSize: 12.5,
                        ),
                      ),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          color: AppColors.textSecondary,
                          fontSize: 9.8,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 4),
                // Circular Burgundy Arrow Button
                Container(
                  width: 26,
                  height: 26,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.chevron_right_rounded,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // ==========================================
  // 5. SCHOOL LEADERSHIP CARD (HEADMASTER)
  // ==========================================
  Widget _buildLeadershipCard(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.white, Color(0xFFFFF6F7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.cardBorder, width: 1.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.cardShadow,
            blurRadius: 18,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Stack(
          children: [
            // Soft Rose Gold Satin Curve Wave in bottom-right corner
            Positioned(
              right: 0,
              bottom: 0,
              width: 140,
              height: 70,
              child: CustomPaint(
                painter: _CornerWavePainter(),
              ),
            ),

            // Golden Laurel Sprig on the right edge
            Positioned(
              right: 12,
              top: 12,
              bottom: 12,
              width: 36,
              child: CustomPaint(
                painter: _SingleLaurelPainter(),
              ),
            ),

            // Card Contents
            Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  // Profile Photo with thin Rose Gold border
                  Container(
                    width: 74,
                    height: 86,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppColors.roseGold.withAlpha(180),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withAlpha(25),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(15),
                      child: Image.asset(
                        StaticData.principal.image,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: AppColors.blushPink,
                          child: const Icon(Icons.person, color: AppColors.primary, size: 36),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 14),

                  // Info Column
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // "HEADMASTER" Burgundy Pill
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            "HEADMASTER",
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          StaticData.principal.name.isNotEmpty
                              ? StaticData.principal.name
                              : "Eranna Arkera Sir",
                          style: GoogleFonts.poppins(
                            color: AppColors.textPrimary,
                            fontSize: 15.5,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          "Headmaster guiding and mentoring Morarji Desai Residential School students.",
                          style: GoogleFonts.poppins(
                            color: AppColors.textSecondary,
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            height: 1.3,
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
    );
  }
}

// ==========================================
// CUSTOM PAINTERS FOR LUXURY ROSE GOLD & METALLIC ACCENTS
// ==========================================

// Double Rose Gold & Metallic Gold Wave Ribbon Curves for Header
class _HeroWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Metallic Gold Wave Ribbon
    final goldPath = Path();
    goldPath.moveTo(-20, h * 0.45);
    goldPath.cubicTo(w * 0.28, h * 0.85, w * 0.65, h * 0.15, w + 20, h * 0.55);

    final goldPaint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0xFFD8A45B),
          Color(0xFFF3D29A),
          Color(0xFFC98B73),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.2;
    canvas.drawPath(goldPath, goldPaint);

    // Rose Gold Satin Fill Wave
    final roseFill = Path();
    roseFill.moveTo(0, h * 0.55);
    roseFill.cubicTo(w * 0.32, h * 0.95, w * 0.68, h * 0.35, w, h * 0.65);
    roseFill.lineTo(w, h);
    roseFill.lineTo(0, h);
    roseFill.close();

    final rosePaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFFC98B73).withAlpha(100),
          const Color(0xFFFFF9F7),
        ],
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(roseFill, rosePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Delicate Cherry Blossom Petal Accent in Sky
class _CherryBlossomPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paintPetal = Paint()
      ..color = const Color(0xFFF472B6).withAlpha(120)
      ..style = PaintingStyle.fill;

    final paintBranch = Paint()
      ..color = const Color(0xFF78350F).withAlpha(70)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4;

    // Branch from top-left
    final branch = Path();
    branch.moveTo(0, 30);
    branch.quadraticBezierTo(40, 45, 70, 38);
    branch.quadraticBezierTo(90, 34, 110, 52);
    canvas.drawPath(branch, paintBranch);

    // Petals around branch
    final offsets = [
      const Offset(35, 42),
      const Offset(68, 36),
      const Offset(85, 34),
      const Offset(105, 50),
      const Offset(50, 58),
      const Offset(22, 50),
      const Offset(118, 62),
    ];

    for (final pt in offsets) {
      canvas.drawCircle(pt, 3.5, paintPetal);
      canvas.drawCircle(pt.translate(1.5, 1.5), 2.2, Paint()..color = const Color(0xFFFBCFE8).withAlpha(180));
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Golden Laurel Branch Wreath Framing Portrait
class _GoldenLaurelPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD8A45B)
      ..style = PaintingStyle.fill;

    final cx = size.width / 2;
    final cy = size.height / 2;
    final radius = size.width * 0.44;

    // Draw small golden leaves along the left and right perimeter
    for (int i = 0; i < 7; i++) {
      final angleLeft = math.pi * 0.65 + (i * 0.12);
      final xL = cx + radius * math.cos(angleLeft);
      final yL = cy + radius * math.sin(angleLeft);

      canvas.save();
      canvas.translate(xL, yL);
      canvas.rotate(angleLeft + math.pi / 2);
      canvas.drawOval(
        Rect.fromCenter(center: Offset.zero, width: 4.5, height: 9),
        paint,
      );
      canvas.restore();

      final angleRight = -math.pi * 0.65 - (i * 0.12);
      final xR = cx + radius * math.cos(angleRight);
      final yR = cy + radius * math.sin(angleRight);

      canvas.save();
      canvas.translate(xR, yR);
      canvas.rotate(angleRight - math.pi / 2);
      canvas.drawOval(
        Rect.fromCenter(center: Offset.zero, width: 4.5, height: 9),
        paint,
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Single Vertical Golden Laurel Sprig
class _SingleLaurelPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD8A45B).withAlpha(190)
      ..style = PaintingStyle.fill;

    final stemPaint = Paint()
      ..color = const Color(0xFFD8A45B).withAlpha(140)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    // Stem curve
    final stem = Path();
    stem.moveTo(size.width * 0.5, 4);
    stem.quadraticBezierTo(size.width * 0.7, size.height * 0.5, size.width * 0.5, size.height - 4);
    canvas.drawPath(stem, stemPaint);

    // Leaves
    for (double y = 8; y < size.height - 8; y += 8) {
      canvas.save();
      canvas.translate(size.width * 0.55, y);
      canvas.rotate(0.4);
      canvas.drawOval(Rect.fromCenter(center: Offset.zero, width: 4, height: 8), paint);
      canvas.restore();

      canvas.save();
      canvas.translate(size.width * 0.45, y + 4);
      canvas.rotate(-0.4);
      canvas.drawOval(Rect.fromCenter(center: Offset.zero, width: 4, height: 8), paint);
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// Corner Satin Curve Wave for Leadership Card
class _CornerWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final path = Path();
    path.moveTo(0, h);
    path.cubicTo(w * 0.3, h * 0.4, w * 0.7, h * 0.8, w, h * 0.2);
    path.lineTo(w, h);
    path.close();

    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x18C98B73),
          Color(0x40FBE4E8),
        ],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
