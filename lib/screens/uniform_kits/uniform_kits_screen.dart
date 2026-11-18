import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';

class UniformKitsScreen extends StatefulWidget {
  const UniformKitsScreen({super.key});

  @override
  State<UniformKitsScreen> createState() => _UniformKitsScreenState();
}

class _UniformKitsScreenState extends State<UniformKitsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _openImageViewer(String imagePath, String title, String caption) {
    HapticFeedback.lightImpact();
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => Scaffold(
          backgroundColor: const Color(0xFF0F0520),
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            title: Text(
              title,
              style: GoogleFonts.poppins(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            iconTheme: const IconThemeData(color: Colors.white),
          ),
          body: Column(
            children: [
              Expanded(
                child: InteractiveViewer(
                  minScale: 0.8,
                  maxScale: 4.0,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          color: const Color(0xFFFAF7FF),
                          padding: const EdgeInsets.all(14),
                          child: Image.asset(
                            imagePath,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
                child: Text(
                  caption,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    color: Colors.white.withAlpha(220),
                    fontSize: 12.5,
                    height: 1.45,
                  ),
                ),
              ),
            ],
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
        title: Text(
          'Uniform & Kits',
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w700,
            fontSize: 19,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(54),
          child: Container(
            height: 54,
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withAlpha(20),
                borderRadius: BorderRadius.circular(24),
              ),
              child: TabBar(
                controller: _tabController,
                dividerColor: Colors.transparent,
                indicatorSize: TabBarIndicatorSize.tab,
                indicator: BoxDecoration(
                  borderRadius: BorderRadius.circular(22),
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, Color(0xFF9333EA)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryLight.withAlpha(90),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                labelColor: Colors.white,
                unselectedLabelColor: AppColors.navInactive,
                labelStyle: GoogleFonts.poppins(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                ),
                unselectedLabelStyle: GoogleFonts.poppins(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w500,
                ),
                tabs: const [
                  Tab(text: '👔  School Uniforms'),
                  Tab(text: '🎁  Hostel Kit Box'),
                ],
              ),
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        physics: const BouncingScrollPhysics(),
        children: [
          _buildUniformsTab(),
          _buildKitsTab(),
        ],
      ),
    );
  }

  Widget _buildUniformsTab() {
    return ListView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
      children: [
        _buildIntroBanner(
          emoji: '👔',
          tag: 'MDRS SIGNATURE PRIDE',
          title: 'Our Iconic School Uniforms',
          subtitle:
              'Pink-and-white stripes paired with deep royal navy — the uniform every MDRS student wore with pride from 6th to 10th standard!',
        ),
        const SizedBox(height: 16),
        _buildShowcaseCard(
          badge: 'BOYS UNIFORM',
          badgeColor: const Color(0xFF2563EB),
          title: 'MDRS Boys Official Uniform',
          subtitle:
              'Classic pink & white vertical striped half-sleeve shirt paired with deep navy-blue trousers and a formal black belt.',
          imagePath: 'assets/images/mdrs_boys_uniform.png',
          imageHeight: 280,
          chips: const [
            'Pink Striped Shirt',
            'Navy Trousers',
            'Black Belt',
            'Assembly Ready',
          ],
          memoryQuote:
              '“Keeping our uniform folded under the hostel mattress all night so it stayed crisp for Monday assembly!”',
        ),
        const SizedBox(height: 16),
        _buildShowcaseCard(
          badge: 'GIRLS UNIFORM',
          badgeColor: const Color(0xFFDB2777),
          title: 'MDRS Girls Official Uniform',
          subtitle:
              'Iconic pink & white striped kurta with deep navy-blue buttoned waistcoat, matching draped dupatta, and navy bottoms.',
          imagePath: 'assets/images/mdrs_girls_uniform.png',
          imageHeight: 280,
          chips: const [
            'Pink Striped Kurta',
            'Navy Waistcoat',
            'Navy Dupatta',
            'MDRS Pride',
          ],
          memoryQuote:
              '“Pinning the navy dupatta neatly before the 9:00 AM prayer bell while helping roommates get ready!”',
        ),
      ],
    );
  }

  Widget _buildKitsTab() {
    return ListView(
      physics: const BouncingScrollPhysics(
        parent: AlwaysScrollableScrollPhysics(),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
      children: [
        _buildIntroBanner(
          emoji: '🎁',
          tag: 'MONTHLY HOSTEL DISTRIBUTION',
          title: 'The Legendary Hostel Kit Box',
          subtitle:
              'The happiest distribution day of every month! Receiving our fresh Government of Karnataka hygiene & daily essentials kit right inside campus.',
        ),
        const SizedBox(height: 16),
        _buildShowcaseCard(
          badge: 'MONTHLY KIT BOX',
          badgeColor: const Color(0xFF0D9488),
          title: 'Hostel Monthly Essentials Box',
          subtitle:
              'Every student’s prized monthly treasure box packed with Mysore Sandal Soap, Mysore Sandal Detergent Cake, Parachute Coconut Hair Oil, and Toothpaste.',
          imagePath: 'assets/images/mdrs_hostel_kit_box.png',
          imageHeight: 250,
          chips: const [
            '🧼 Mysore Sandal Soap',
            '🫧 Detergent Cake',
            '🥥 Coconut Hair Oil',
            '🪥 Toothpaste',
          ],
          memoryQuote:
              '“That fresh Mysore Sandal soap fragrance filling the entire hostel dormitory on kit distribution day!”',
        ),
        const SizedBox(height: 16),
        _buildShowcaseCard(
          badge: 'SHUCHI SAMBHRAMA KIT',
          badgeColor: const Color(0xFF059669),
          title: 'Nirmala Shuchi Sambhrama Hygiene Kit',
          subtitle:
              'Official Karnataka Government free student hygiene & personal care kit (ಉಚಿತ ವಿತರಣೆ) provided to MDRS residential students with bathing soap and toothbrush.',
          imagePath: 'assets/images/mdrs_shuchi_kit.png',
          imageHeight: 230,
          chips: const [
            '🏛️ Govt. of Karnataka',
            '🪥 Toothbrush',
            '🧼 Bathing Soap',
            '✨ Free Distribution',
          ],
          memoryQuote:
              '“Locking the brand-new soap & hair oil inside our steel trunk immediately before hostel friends could borrow it!”',
        ),
      ],
    );
  }

  Widget _buildIntroBanner({
    required String emoji,
    required String tag,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primaryDeep,
            Color(0xFF3B0D66),
            AppColors.primary,
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withAlpha(75),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withAlpha(25),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.gold.withAlpha(140)),
            ),
            child: Center(
              child: Text(emoji, style: const TextStyle(fontSize: 26)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tag,
                  style: GoogleFonts.poppins(
                    color: AppColors.gold,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: GoogleFonts.poppins(
                    color: Colors.white.withAlpha(215),
                    fontSize: 11.5,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShowcaseCard({
    required String badge,
    required Color badgeColor,
    required String title,
    required String subtitle,
    required String imagePath,
    required double imageHeight,
    required List<String> chips,
    required String memoryQuote,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.cardBorder, width: 0.9),
        boxShadow: const [
          BoxShadow(
            color: Color(0x187C3AED),
            blurRadius: 18,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Showcase Area (Tap to Zoom)
          GestureDetector(
            onTap: () => _openImageViewer(imagePath, title, subtitle),
            child: Container(
              width: double.infinity,
              height: imageHeight,
              decoration: const BoxDecoration(
                color: Color(0xFFFAF7FF),
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Image.asset(
                        imagePath,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) =>
                            const Center(
                          child: Icon(
                            Icons.broken_image_rounded,
                            size: 48,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: badgeColor.withAlpha(230),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: badgeColor.withAlpha(90),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Text(
                        badge,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 9.5,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.9,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 10,
                    right: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primaryDeep.withAlpha(200),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.zoom_in_rounded,
                            color: AppColors.gold,
                            size: 14,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Tap to zoom',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Details Section
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    color: AppColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  subtitle,
                  style: GoogleFonts.poppins(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 7,
                  runSpacing: 7,
                  children: chips
                      .map(
                        (chip) => Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.background,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.divider),
                          ),
                          child: Text(
                            chip,
                            style: GoogleFonts.poppins(
                              color: AppColors.textViolet,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 14),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: AppColors.gold.withAlpha(110),
                    ),
                  ),
                  child: Text(
                    memoryQuote,
                    style: GoogleFonts.poppins(
                      color: const Color(0xFF78350F),
                      fontSize: 11.5,
                      fontStyle: FontStyle.italic,
                      fontWeight: FontWeight.w500,
                      height: 1.35,
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
}
