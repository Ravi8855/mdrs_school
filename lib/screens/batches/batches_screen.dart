import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';

class BatchesScreen extends StatefulWidget {
  const BatchesScreen({super.key});

  @override
  State<BatchesScreen> createState() => _BatchesScreenState();
}

class _BatchesScreenState extends State<BatchesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scroll2013 = ScrollController();
  String _searchQuery = "";

  final List<String> _batchYears = ["2013", "2014", "2015", "2016", "2017"];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _batchYears.length, vsync: this, initialIndex: 0); // default 2013
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scroll2013.dispose();
    super.dispose();
  }

  List<String> _getBatchList(int index) {
    switch (index) {
      case 0:
        return StaticData.batch2013;
      case 1:
        return StaticData.batch2014;
      case 2:
        return StaticData.batch2015;
      case 3:
        return StaticData.batch2016;
      case 4:
        return StaticData.batch2017;
      default:
        return StaticData.batch2014;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        title: Text(
          "School Batches",
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w800, fontSize: 20, color: Colors.white),
        ),
        centerTitle: true,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(52),
          child: Container(
            height: 52,
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primaryDark,
              border: Border(
                bottom: BorderSide(
                  color: AppColors.roseGold.withAlpha(90),
                  width: 1.0,
                ),
              ),
            ),
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              physics: const BouncingScrollPhysics(),
              indicatorSize: TabBarIndicatorSize.label,
              dividerColor: Colors.transparent,
              indicator: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                color: Colors.white,
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              labelColor: AppColors.primary,
              unselectedLabelColor: Colors.white,
              labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 13),
              unselectedLabelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13),
              padding: const EdgeInsets.symmetric(horizontal: 10),
              tabs: _batchYears
                  .map(
                    (year) => Tab(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withAlpha(120),
                            width: 1.0,
                          ),
                        ),
                        child: Text("Batch $year"),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
              decoration: InputDecoration(
                hintText: "Search classmate in aquarium...",
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: AppColors.primary, size: 20),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18, color: AppColors.textMuted),
                        onPressed: () => setState(() => _searchQuery = ""),
                      )
                    : null,
                filled: true,
                fillColor: AppColors.surface,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                ),
              ),
            ),
          ),

          // Main Aquarium Viewport (Full Showcase: all student names swimming, roster list removed)
          Expanded(
            child: TabBarView(
              controller: _tabController,
              physics: const BouncingScrollPhysics(),
              children: List.generate(_batchYears.length, (idx) {
                final all = _getBatchList(idx);
                final year = _batchYears[idx];

                // Batch 2013: Aquarium (pure floating student names) + Memories Gallery below
                if (year == "2013") {
                  return ListView(
                    controller: _scroll2013,
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(14, 4, 14, 28),
                    children: [
                      // 1. Batch 2013 Interactive Fish Aquarium - increased vertically for free floating
                      SizedBox(
                        height: 480,
                        child: FishAquariumTank(
                          key: const ValueKey("aquarium_2013"),
                          names: all,
                          batchYear: "2013",
                          searchQuery: _searchQuery,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 2. Batch 2013 Memories Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withAlpha(25),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.photo_library_rounded,
                                  size: 16,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "BATCH 2013 MEMORIES",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textViolet,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.cardBorder),
                              boxShadow: const [
                                BoxShadow(color: AppColors.cardShadow, blurRadius: 8),
                              ],
                            ),
                            child: Text(
                              "3 Photos",
                              style: GoogleFonts.poppins(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // 3. Official Campus Group Photo
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2013_3.jpg",
                        title: "Batch 2013 Campus Group Photo",
                        subtitle: "Official school portrait with students & teachers",
                        badge: "Official Portrait",
                      ),
                      const SizedBox(height: 12),

                      // 4. Classroom Celebration
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2013_1.jpg",
                        title: "Classroom Celebration",
                        subtitle: "Memorable classroom gathering and fun moments",
                        badge: "Classroom",
                      ),
                      const SizedBox(height: 12),

                      // 5. Cake Cutting Ceremony
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2013_2.jpg",
                        title: "Cake Cutting Ceremony",
                        subtitle: "Special celebration with faculty and classmates",
                        badge: "Celebration",
                      ),
                    ],
                  );
                }

                // Batch 2014: Aquarium + Memories Gallery below
                if (year == "2014") {
                  return ListView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(14, 4, 14, 28),
                    children: [
                      // 1. Batch 2014 Interactive Fish Aquarium - spacious vertical height for 35 students
                      SizedBox(
                        height: 520,
                        child: FishAquariumTank(
                          key: const ValueKey("aquarium_2014"),
                          names: all,
                          batchYear: "2014",
                          searchQuery: _searchQuery,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 2. Batch 2014 Memories Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withAlpha(25),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.photo_library_rounded,
                                  size: 16,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "BATCH 2014 MEMORIES",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textViolet,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.cardBorder),
                              boxShadow: const [
                                BoxShadow(color: AppColors.cardShadow, blurRadius: 8),
                              ],
                            ),
                            child: Text(
                              "2 Photos",
                              style: GoogleFonts.poppins(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // 3. Batch 2014 Group Celebration Photo
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2014_2.jpg",
                        title: "Batch 2014 Group Celebration",
                        subtitle: "Full batch gathering with classmates and faculty",
                        badge: "Class Group Photo",
                      ),
                      const SizedBox(height: 12),

                      // 4. Cake Cutting Celebration
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2014_1.jpg",
                        title: "Cake Cutting Celebration",
                        subtitle: "10th standard celebration moments with teachers",
                        badge: "Celebration",
                      ),
                    ],
                  );
                }

                // Batch 2015: Aquarium + Memories Gallery below
                if (year == "2015") {
                  return ListView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(14, 4, 14, 28),
                    children: [
                      // 1. Batch 2015 Interactive Fish Aquarium - spacious vertical height for 36 students
                      SizedBox(
                        height: 520,
                        child: FishAquariumTank(
                          key: const ValueKey("aquarium_2015"),
                          names: all,
                          batchYear: "2015",
                          searchQuery: _searchQuery,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 2. Batch 2015 Memories Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withAlpha(25),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.photo_library_rounded,
                                  size: 16,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "BATCH 2015 MEMORIES",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textViolet,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.cardBorder),
                              boxShadow: const [
                                BoxShadow(color: AppColors.cardShadow, blurRadius: 8),
                              ],
                            ),
                            child: Text(
                              "3 Photos",
                              style: GoogleFonts.poppins(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // 3. Batch 2015 Campus Portrait
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2015_1.jpg",
                        title: "Batch 2015 Campus Gathering",
                        subtitle: "School portrait with faculty, staff & classmates",
                        badge: "Campus Portrait",
                      ),
                      const SizedBox(height: 12),

                      // 4. Cultural Celebration
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2015_2.jpg",
                        title: "Cultural Celebration",
                        subtitle: "Festive celebration and cultural moments",
                        badge: "Celebration",
                      ),
                      const SizedBox(height: 12),

                      // 5. Corridor Group Portrait
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2015_3.jpg",
                        title: "Corridor Class Gathering",
                        subtitle: "Memorable moments in the school hallway",
                        badge: "Campus Memories",
                      ),
                    ],
                  );
                }

                // Batch 2017 with Aquarium + 10 Memories Photos below
                if (year == "2017") {
                  return ListView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.fromLTRB(14, 4, 14, 28),
                    children: [
                      // 1. Batch 2017 Interactive Fish Aquarium
                      SizedBox(
                        height: 520,
                        child: FishAquariumTank(
                          key: const ValueKey("aquarium_2017"),
                          names: all,
                          batchYear: "2017",
                          searchQuery: _searchQuery,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // 2. Batch 2017 Memories Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withAlpha(25),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.photo_library_rounded,
                                  size: 16,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "BATCH 2017 MEMORIES",
                                style: GoogleFonts.poppins(
                                  color: AppColors.textViolet,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.cardBorder),
                              boxShadow: const [
                                BoxShadow(color: AppColors.cardShadow, blurRadius: 8),
                              ],
                            ),
                            child: Text(
                              "10 Photos",
                              style: GoogleFonts.poppins(
                                color: AppColors.textSecondary,
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Photo 1: Cultural Stage Celebration
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_1.jpg",
                        title: "Cultural Stage Celebration",
                        subtitle: "Traditional gathering & festive celebration on stage",
                        badge: "Cultural Event",
                      ),
                      const SizedBox(height: 12),

                      // Photo 2: Classroom Fellowship
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_2.jpg",
                        title: "Classroom Fellowship",
                        subtitle: "Cheerful classroom selfie in school uniform",
                        badge: "Classroom Fun",
                      ),
                      const SizedBox(height: 12),

                      // Photo 3: Hallway Gathering
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_3.jpg",
                        title: "Hallway Gathering",
                        subtitle: "Memorable get-together with classmates in the hall",
                        badge: "Hall Gathering",
                      ),
                      const SizedBox(height: 12),

                      // Photo 4: Mentor & Students
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_4.jpg",
                        title: "Mentor & Students",
                        subtitle: "Heartwarming moment with respected faculty mentor",
                        badge: "Mentorship",
                      ),
                      const SizedBox(height: 12),

                      // Photo 5: New Year Celebration
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_5.jpg",
                        title: "New Year Celebration",
                        subtitle: "Festive blackboard decoration & cake celebration",
                        badge: "New Year Event",
                      ),
                      const SizedBox(height: 12),

                      // Photo 6: Study & Examination Session
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_6.jpg",
                        title: "Study & Examination Session",
                        subtitle: "Dedicated revision and quiet focus in the examination hall",
                        badge: "Academics",
                      ),
                      const SizedBox(height: 12),

                      // Photo 7: Classroom Cake Ceremony
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_7.jpg",
                        title: "Classroom Cake Ceremony",
                        subtitle: "Festive cake cutting with teachers & decorative rangoli",
                        badge: "Celebration",
                      ),
                      const SizedBox(height: 12),

                      // Photo 8: Grand Cultural Stage Portrait
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_8.jpg",
                        title: "Grand Cultural Stage Portrait",
                        subtitle: "Classmates and respected teachers in traditional attire",
                        badge: "Stage Portrait",
                      ),
                      const SizedBox(height: 12),

                      // Photo 9: Official Farewell Group Photo (2021-22)
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_9.jpg",
                        title: "Official Farewell Group Photo (2021-22)",
                        subtitle: "Historic commemorative batch portrait dated 25-03-2022",
                        badge: "Official Farewell",
                      ),
                      const SizedBox(height: 12),

                      // Photo 10: Teacher Tribute & Gift Presentation
                      _buildMemoryCard(
                        context,
                        imagePath: "assets/images/batch2017_10.jpg",
                        title: "Teacher Tribute & Gift Presentation",
                        subtitle: "Presenting token of heartfelt gratitude & respect to teachers",
                        badge: "Teacher Tribute",
                      ),
                    ],
                  );
                }

                // Other Batches: Increased vertically so all names float freely without overlap
                return ListView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(14, 4, 14, 20),
                  children: [
                    SizedBox(
                      height: 560,
                      child: FishAquariumTank(
                        key: ValueKey("aquarium_${_batchYears[idx]}"),
                        names: all,
                        batchYear: _batchYears[idx],
                        searchQuery: _searchQuery,
                      ),
                    ),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  // Luxury framed memory photo card with tap-to-zoom
  Widget _buildMemoryCard(
    BuildContext context, {
    required String imagePath,
    required String title,
    required String subtitle,
    required String badge,
  }) {
    return GestureDetector(
      onTap: () => _openFullPhotoViewer(context, imagePath, title),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.cardBorder, width: 1.0),
          boxShadow: const [
            BoxShadow(
              color: Color(0x127C3AED),
              blurRadius: 14,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  AspectRatio(
                    aspectRatio: 16 / 10,
                    child: Image.asset(
                      imagePath,
                      fit: BoxFit.cover,
                      errorBuilder: (ctx, err, stack) => Container(
                        color: AppColors.background,
                        child: const Center(
                          child: Icon(Icons.broken_image, color: AppColors.textMuted),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xCC1E1035),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white.withAlpha(60), width: 0.8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.zoom_in, size: 12, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            badge,
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
              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: GoogleFonts.poppins(
                              color: AppColors.textPrimary,
                              fontSize: 13.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            subtitle,
                            style: GoogleFonts.poppins(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withAlpha(15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.fullscreen_rounded,
                        size: 18,
                        color: AppColors.primary,
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

  // Interactive full-screen zoomable photo viewer modal
  void _openFullPhotoViewer(BuildContext context, String imagePath, String title) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Container(
            color: const Color(0xF50D061A),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),
                InteractiveViewer(
                  maxScale: 4.0,
                  child: Image.asset(
                    imagePath,
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 14),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Atmospheric Aerator Bubble model
// ---------------------------------------------------------------------------
class _AirBubble {
  double x;
  double y;
  double radius;
  double speed;
  double wobble;
  double wobbleSpeed;
  double opacity;

  _AirBubble({
    required this.x,
    required this.y,
    required this.radius,
    required this.speed,
    required this.wobble,
    required this.wobbleSpeed,
    required this.opacity,
  });
}

// ---------------------------------------------------------------------------
// Expanding Water Touch Ripple
// ---------------------------------------------------------------------------
class _WaterRipple {
  final Offset center;
  double radius = 2.0;
  final double maxRadius;
  double opacity = 0.65;
  final Color color;

  _WaterRipple({
    required this.center,
    this.maxRadius = 75.0,
    this.color = const Color(0xFF38BDF8),
  });
}

// ---------------------------------------------------------------------------
// Student Name Fish Model
// ---------------------------------------------------------------------------
class _NameFish {
  final String text;
  double x;
  double y;
  double vx;
  double vy;
  final double width;
  final double height;
  final Color color;
  double scale = 1.0;
  bool isTouched = false;
  final int seed;

  _NameFish({
    required this.text,
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.width,
    required this.height,
    required this.color,
    required this.seed,
  });

  double get cx => x + width / 2;
  double get cy => y + height / 2;
  set cx(double value) => x = value - width / 2;
  set cy(double value) => y = value - height / 2;
}

// ---------------------------------------------------------------------------
// Professional Beautiful Fish Aquarium Tank
// ---------------------------------------------------------------------------
class FishAquariumTank extends StatefulWidget {
  final List<String> names;
  final String batchYear;
  final String searchQuery;

  const FishAquariumTank({
    super.key,
    required this.names,
    required this.batchYear,
    required this.searchQuery,
  });

  @override
  State<FishAquariumTank> createState() => _FishAquariumTankState();
}

class _FishAquariumTankState extends State<FishAquariumTank>
    with SingleTickerProviderStateMixin {
  late AnimationController _simController;
  final List<_NameFish> _fishes = [];
  final List<_AirBubble> _airBubbles = [];
  final List<_WaterRipple> _ripples = [];
  final Random _rng = Random();

  double _lastW = 340.0;
  double _lastH = 480.0;
  bool _initialized = false;
  double _animTime = 0.0;

  // Vibrant Tropical Reef Fish Colors
  final List<Color> _palette = const [
    Color(0xFF00E5FF), // Electric Cyan
    Color(0xFFFFD166), // Gold Guppy
    Color(0xFF38BDF8), // Sky Azure
    Color(0xFF06D6A0), // Seafoam Emerald
    Color(0xFFF72585), // Neon Coral Pink
    Color(0xFFB5179E), // Amethyst Tang
    Color(0xFFFB8500), // Tangerine Clownfish
    Color(0xFF4CC9F0), // Turquoise Reef
    Color(0xFFA78BFA), // Lavender Ray
    Color(0xFFFF758F), // Pearl Rose
  ];

  @override
  void initState() {
    super.initState();
    _simController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
    _simController.addListener(_updatePhysics);
  }

  void _setupTank(double w, double h) {
    if (_initialized && (w - _lastW).abs() < 10 && (h - _lastH).abs() < 10) {
      return;
    }
    _lastW = w;
    _lastH = h;
    _fishes.clear();
    _airBubbles.clear();

    // 1. Setup Live Aerator Air Bubbles (Rising continuously from bottom)
    for (int i = 0; i < 22; i++) {
      _airBubbles.add(_AirBubble(
        x: 10 + _rng.nextDouble() * max(20, w - 20),
        y: 40 + _rng.nextDouble() * (h - 70),
        radius: 1.5 + _rng.nextDouble() * 3.0,
        speed: 0.6 + _rng.nextDouble() * 1.4,
        wobble: _rng.nextDouble() * pi * 2,
        wobbleSpeed: 0.04 + _rng.nextDouble() * 0.05,
        opacity: 0.25 + _rng.nextDouble() * 0.45,
      ));
    }

    // 2. Setup All Student Name Fish from the Roster
    final sample = widget.names;

    final int count = sample.length;
    // Multi-column grid distribution to start with maximum spacing
    final int cols = count > 24 ? 5 : (count > 15 ? 4 : 3);
    final int rows = max(1, (count / max(1, cols)).ceil());
    final double colSpacing = (w - 24) / max(1, cols);
    final double rowSpacing = (h - 90) / max(1, rows);

    for (int i = 0; i < count; i++) {
      final text = sample[i];
      // Compact streamlined fish capsule size
      final double width = (text.length * 6.4 + 22).clamp(50.0, 96.0);
      const double height = 25.0;

      final int row = i ~/ max(1, cols);
      final int col = i % max(1, cols);

      final double startX = 12 + col * colSpacing + (_rng.nextDouble() * 8 - 4);
      final double startY = 44 + row * rowSpacing + (_rng.nextDouble() * 6 - 3);

      final double vx = (_rng.nextBool() ? 1 : -1) * (0.35 + _rng.nextDouble() * 0.45);
      final double vy = (_rng.nextBool() ? 1 : -1) * (0.28 + _rng.nextDouble() * 0.40);

      _fishes.add(_NameFish(
        text: text,
        x: startX.clamp(8.0, max(8.0, w - width - 8)),
        y: startY.clamp(42.0, max(42.0, h - height - 42)),
        vx: vx,
        vy: vy,
        width: width,
        height: height,
        color: _palette[i % _palette.length],
        seed: i,
      ));
    }

    // Run 25 relaxation steps to ensure strict separation before first frame
    for (int step = 0; step < 25; step++) {
      _resolveCollisions(w, h);
    }

    _initialized = true;
  }

  void _updatePhysics() {
    if (!mounted || _fishes.isEmpty) return;

    final double w = _lastW;
    final double h = _lastH;
    _animTime += 0.016;

    // 1. Update Aerator Air Bubbles (Live rising water bubbles)
    for (final b in _airBubbles) {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      b.x += sin(b.wobble) * 0.45;

      // Wrap around to tank bottom when reaching water surface
      if (b.y < 38) {
        b.y = h - 18 - _rng.nextDouble() * 20;
        b.x = 10 + _rng.nextDouble() * max(20, w - 20);
        b.speed = 0.6 + _rng.nextDouble() * 1.4;
        b.radius = 1.5 + _rng.nextDouble() * 3.0;
      }
    }

    // 2. Update Water Ripples
    for (int i = _ripples.length - 1; i >= 0; i--) {
      final r = _ripples[i];
      r.radius += 2.8;
      r.opacity -= 0.024;
      if (r.opacity <= 0.0 || r.radius >= r.maxRadius) {
        _ripples.removeAt(i);
      }
    }

    // 3. Update Name Fish positions and boundaries
    for (final f in _fishes) {
      f.x += f.vx;
      f.y += f.vy;

      // Smooth decay of touched scale pop
      if (f.scale > 1.0) {
        f.scale = max(1.0, f.scale - 0.035);
      }

      // Left and Right glass wall reflection
      if (f.x < 8) {
        f.x = 8;
        f.vx = f.vx.abs() * 0.95 + 0.1;
      } else if (f.x + f.width > w - 8) {
        f.x = w - 8 - f.width;
        f.vx = -(f.vx.abs() * 0.95 + 0.1);
      }

      // Top water surface & bottom sandy floor boundaries
      if (f.y < 42) {
        f.y = 42;
        f.vy = f.vy.abs() * 0.95 + 0.1;
      } else if (f.y + f.height > h - 42) {
        f.y = h - 42 - f.height;
        f.vy = -(f.vy.abs() * 0.95 + 0.1);
      }
    }

    // 4. Pairwise non-overlapping collision resolution
    _resolveCollisions(w, h);

    // 5. Velocity regulation (Natural smooth swimming flow)
    for (final f in _fishes) {
      final double speed = sqrt(f.vx * f.vx + f.vy * f.vy);
      if (speed > 2.2) {
        f.vx = (f.vx / speed) * 2.2;
        f.vy = (f.vy / speed) * 2.2;
      } else if (speed < 0.28) {
        f.vx = (f.vx >= 0 ? 0.35 : -0.35);
        f.vy = (f.vy >= 0 ? 0.30 : -0.30);
      }
    }

    setState(() {});
  }

  // Strict non-overlapping distance resolution + elastic bounce
  void _resolveCollisions(double w, double h) {
    for (int i = 0; i < _fishes.length; i++) {
      for (int j = i + 1; j < _fishes.length; j++) {
        final f1 = _fishes[i];
        final f2 = _fishes[j];

        final double dx = f2.cx - f1.cx;
        final double dy = f2.cy - f1.cy;

        // Minimum required separation along horizontal and vertical axes
        final double minW = (f1.width + f2.width) / 2 + 7.0;
        final double minH = (f1.height + f2.height) / 2 + 6.0;

        // Elliptical normalized distance
        final double distSq = (dx * dx) / (minW * minW) + (dy * dy) / (minH * minH);

        if (distSq < 1.0) {
          final double dist = max(0.001, sqrt(distSq));
          final double overlap = 1.0 - dist;

          final double nx = (dx / minW) / dist;
          final double ny = (dy / minH) / dist;

          // Displace apart instantly to guarantee NO OVERLAP
          final double sepX = nx * overlap * minW * 0.54;
          final double sepY = ny * overlap * minH * 0.54;

          f1.cx -= sepX;
          f1.cy -= sepY;
          f2.cx += sepX;
          f2.cy += sepY;

          // Elastic momentum exchange
          final double rvx = f2.vx - f1.vx;
          final double rvy = f2.vy - f1.vy;
          final double normalVel = rvx * nx + rvy * ny;

          if (normalVel < 0) {
            const double restitution = 0.95;
            final double impulse = -(1.0 + restitution) * normalVel * 0.5;

            f1.vx -= impulse * nx;
            f1.vy -= impulse * ny;
            f2.vx += impulse * nx;
            f2.vy += impulse * ny;
          }
        }
      }
    }
  }

  // Touch Reflection & Ripple wave
  void _reflectFish(_NameFish f) {
    HapticFeedback.mediumImpact();
    setState(() {
      // Reverse velocity (reflection) and add energetic impulse
      f.vx = -f.vx * 1.8;
      f.vy = -f.vy * 1.8;

      if (f.vx.abs() < 1.4) {
        f.vx = (_rng.nextBool() ? 1 : -1) * (1.6 + _rng.nextDouble() * 0.8);
      }
      if (f.vy.abs() < 1.4) {
        f.vy = (_rng.nextBool() ? 1 : -1) * (1.5 + _rng.nextDouble() * 0.8);
      }

      f.vx = f.vx.clamp(-3.0, 3.0);
      f.vy = f.vy.clamp(-3.0, 3.0);

      // Scale pop reflection effect
      f.scale = 1.35;
      f.isTouched = true;

      // Emit expanding water ripple at the touch point
      _ripples.add(_WaterRipple(
        center: Offset(f.cx, f.cy),
        color: f.color,
      ));

      // Hydrodynamic impulse: gently push neighboring fish
      for (final other in _fishes) {
        if (other != f) {
          final dx = other.cx - f.cx;
          final dy = other.cy - f.cy;
          final d = sqrt(dx * dx + dy * dy);
          if (d > 0 && d < 90) {
            other.vx += (dx / d) * 1.2;
            other.vy += (dy / d) * 1.2;
          }
        }
      }
    });
  }

  // Playful Shake / Stir Tank Action (All fish swirl with gentle energy)
  void _stirTank() {
    HapticFeedback.heavyImpact();
    setState(() {
      _ripples.add(_WaterRipple(
        center: Offset(_lastW / 2, _lastH / 2),
        maxRadius: 160,
        color: const Color(0xFF00E5FF),
      ));

      for (final f in _fishes) {
        final double angle = _rng.nextDouble() * pi * 2;
        final double speed = 1.2 + _rng.nextDouble() * 1.2;
        f.vx = cos(angle) * speed;
        f.vy = sin(angle) * speed;
        f.scale = 1.2;
      }
    });
  }

  @override
  void dispose() {
    _simController.removeListener(_updatePhysics);
    _simController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = widget.searchQuery;
    final int matchCount = query.isEmpty
        ? _fishes.length
        : _fishes.where((f) => f.text.toLowerCase().contains(query)).length;

    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;

        if (!_initialized || (w - _lastW).abs() > 20 || (h - _lastH).abs() > 20) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) {
              setState(() {
                _setupTank(w, h);
              });
            }
          });
        }

        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            // Double-layered glass aquarium tank border with oceanic highlight
            border: Border.all(
              color: const Color(0xFF38BDF8).withAlpha(150),
              width: 2.0,
            ),
            boxShadow: [
              // Deep ocean water glow
              BoxShadow(
                color: const Color(0xFF0284C7).withAlpha(70),
                blurRadius: 22,
                spreadRadius: 2,
                offset: const Offset(0, 6),
              ),
              // Royal ambient shadow
              BoxShadow(
                color: const Color(0xFF7C3AED).withAlpha(80),
                blurRadius: 30,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22),
            child: Stack(
              children: [
                // 1. Realistic Deep Oceanic Water Gradient
                Positioned.fill(
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Color(0xFF06223F), // Sunlit surface cyan
                          Color(0xFF0C1938), // Mid-depth ocean indigo
                          Color(0xFF160E33), // Deep water abyss
                          Color(0xFF080414), // Ocean floor midnight
                        ],
                        stops: [0.0, 0.32, 0.72, 1.0],
                      ),
                    ),
                  ),
                ),

                // 2. Live Custom Underwater Painter (Caustic sunrays, aerator bubbles, swaying seaweed, ripples)
                Positioned.fill(
                  child: CustomPaint(
                    painter: _AquariumBackdropPainter(
                      airBubbles: _airBubbles,
                      ripples: _ripples,
                      animTime: _animTime,
                    ),
                  ),
                ),

                // 3. Diagonal Specular Glass Reflection Sheen
                Positioned.fill(
                  child: IgnorePointer(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: const Alignment(-0.8, -1.0),
                          end: const Alignment(0.8, 1.0),
                          colors: [
                            Colors.white.withAlpha(22),
                            Colors.white.withAlpha(0),
                            Colors.white.withAlpha(8),
                            Colors.transparent,
                          ],
                          stops: const [0.0, 0.28, 0.45, 1.0],
                        ),
                      ),
                    ),
                  ),
                ),

                // 4. Interactive Student Name Fish (Freely floating classmate names)
                ..._fishes.map((f) {
                  final bool isMatch = query.isEmpty || f.text.toLowerCase().contains(query);
                  final double opacity = query.isEmpty ? 1.0 : (isMatch ? 1.0 : 0.22);
                  // Hydrodynamic swimming tilt angle based on horizontal velocity
                  final double tiltAngle = (f.vx * 0.07).clamp(-0.20, 0.20);
                  // Gentle natural swimming breathing scale
                  final double breathingScale = f.scale * (1.0 + 0.025 * sin(_animTime * 3.5 + f.seed));

                  return Positioned(
                    left: f.x,
                    top: f.y,
                    child: GestureDetector(
                      onTap: () => _reflectFish(f),
                      child: AnimatedOpacity(
                        duration: const Duration(milliseconds: 200),
                        opacity: opacity,
                        child: Transform.rotate(
                          angle: tiltAngle,
                          child: Transform.scale(
                            scale: breathingScale,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3.5),
                              decoration: BoxDecoration(
                                color: f.color.withAlpha(f.scale > 1.05 ? 100 : (isMatch && query.isNotEmpty ? 90 : 55)),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: f.scale > 1.05
                                      ? Colors.white
                                      : (isMatch && query.isNotEmpty
                                          ? const Color(0xFFFFD700)
                                          : f.color.withAlpha(170)),
                                  width: f.scale > 1.05 ? 1.8 : (isMatch && query.isNotEmpty ? 1.6 : 1.1),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: f.scale > 1.05
                                        ? Colors.white.withAlpha(150)
                                        : (isMatch && query.isNotEmpty
                                            ? const Color(0xFFFFD700).withAlpha(130)
                                            : f.color.withAlpha(60)),
                                    blurRadius: f.scale > 1.05 ? 14 : 7,
                                    spreadRadius: f.scale > 1.05 ? 1.5 : 0.5,
                                  ),
                                ],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  // Leading Indicator (Glowing Dot for student fish)
                                  Container(
                                    width: 5.5,
                                    height: 5.5,
                                    decoration: BoxDecoration(
                                      color: f.scale > 1.05 ? Colors.white : f.color,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: f.color,
                                          blurRadius: 4,
                                          spreadRadius: 1,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    f.text,
                                    style: GoogleFonts.poppins(
                                      fontSize: 10.5,
                                      color: Colors.white,
                                      fontWeight: isMatch && query.isNotEmpty ? FontWeight.w700 : FontWeight.w600,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                }),

                // 5. Top Tank Hood & Info Glass Bar
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          const Color(0xFF04182E).withAlpha(220),
                          const Color(0xFF04182E).withAlpha(0),
                        ],
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Left: Batch Aquarium Live Indicator
                        Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Color(0xFF00E5FF),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0xFF00E5FF),
                                    blurRadius: 6,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 7),
                            Text(
                              "BATCH ${widget.batchYear} AQUARIUM",
                              style: GoogleFonts.poppins(
                                color: const Color(0xFF00E5FF),
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.1,
                              ),
                            ),
                          ],
                        ),

                        // Right: Live Swimmers Count Chip
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(25),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF38BDF8).withAlpha(100)),
                          ),
                          child: Text(
                            query.isEmpty
                                ? "${_fishes.length} Swimmers"
                                : "$matchCount / ${_fishes.length}",
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // 6. Bottom Glass Floating Footer (Touch hint & Stir tank action)
                Positioned(
                  bottom: 8,
                  left: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF061426).withAlpha(180),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: const Color(0xFF38BDF8).withAlpha(70),
                        width: 0.8,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x40000000),
                          blurRadius: 10,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.touch_app,
                              size: 14,
                              color: Color(0xFF38BDF8),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              "Touch any student fish to reflect",
                              style: GoogleFonts.poppins(
                                color: const Color(0xFFE0F2FE),
                                fontSize: 10.5,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        // Stir / Ripple Tank Button
                        GestureDetector(
                          onTap: _stirTank,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF0284C7), Color(0xFF7C3AED)],
                              ),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.waves, size: 12, color: Colors.white),
                                const SizedBox(width: 4),
                                Text(
                                  "Stir",
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
              ],
            ),
          ),
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// Atmospheric Aquarium Backdrop Painter:
// - Sun Caustic Beams penetrating water from surface
// - Animated live aerator air bubbles with specular highlights
// - Swaying emerald kelp and seaweed frills at ocean floor
// - Expanding circular water ripples on touch
// ---------------------------------------------------------------------------
class _AquariumBackdropPainter extends CustomPainter {
  final List<_AirBubble> airBubbles;
  final List<_WaterRipple> ripples;
  final double animTime;

  _AquariumBackdropPainter({
    required this.airBubbles,
    required this.ripples,
    required this.animTime,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final double w = size.width;
    final double h = size.height;

    // 1. Sun Caustic Light Shafts (Sunbeams descending through water)
    _drawSunbeams(canvas, w, h);

    // 2. Swaying Aquatic Seaweed / Kelp Frills at the floor
    _drawSeaweed(canvas, w, h);

    // 3. Live Aerator Air Bubbles
    _drawAirBubbles(canvas);

    // 4. Water Ripples
    _drawWaterRipples(canvas);
  }

  void _drawSunbeams(Canvas canvas, double w, double h) {
    final beamPaint = Paint()..style = PaintingStyle.fill;

    // 4 translucent light shafts descending at a 15-degree angle
    for (int i = 0; i < 4; i++) {
      final double startX = (w * 0.15) + (i * w * 0.22) + sin(animTime * 0.8 + i) * 12;
      final double widthTop = w * 0.08;
      final double widthBottom = w * 0.22;

      final path = Path()
        ..moveTo(startX, 0)
        ..lineTo(startX + widthTop, 0)
        ..lineTo(startX + widthBottom + 35, h * 0.75)
        ..lineTo(startX + 35, h * 0.75)
        ..close();

      final double beamOpacity = 0.035 + 0.015 * sin(animTime * 1.2 + i * 1.5);

      beamPaint.shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          const Color(0xFF38BDF8).withAlpha((beamOpacity * 255).toInt()),
          const Color(0xFF38BDF8).withAlpha(0),
        ],
      ).createShader(Rect.fromLTWH(startX, 0, widthBottom + 35, h * 0.75));

      canvas.drawPath(path, beamPaint);
    }
  }

  void _drawSeaweed(Canvas canvas, double w, double h) {
    final weedPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // 7 clumps of swaying seaweed along the floor
    const int kelpCount = 7;
    for (int i = 0; i < kelpCount; i++) {
      final double baseX = (w / (kelpCount + 1)) * (i + 1);
      final double sway = sin(animTime * 1.8 + i * 0.9) * 14.0;
      final double kelpHeight = 45.0 + (i % 3) * 12.0;

      final path = Path()
        ..moveTo(baseX, h)
        ..cubicTo(
          baseX + sway * 0.3,
          h - kelpHeight * 0.4,
          baseX - sway * 0.5,
          h - kelpHeight * 0.7,
          baseX + sway,
          h - kelpHeight,
        );

      weedPaint.strokeWidth = 3.5 - (i % 2) * 1.0;
      weedPaint.color = (i % 2 == 0)
          ? const Color(0xFF059669).withAlpha(65)
          : const Color(0xFF0284C7).withAlpha(55);

      canvas.drawPath(path, weedPaint);
    }
  }

  void _drawAirBubbles(Canvas canvas) {
    final bubblePaint = Paint()..style = PaintingStyle.fill;
    final shinePaint = Paint()
      ..style = PaintingStyle.fill
      ..color = Colors.white.withAlpha(220);

    for (final b in airBubbles) {
      // Translucent bubble body
      bubblePaint.color = const Color(0xFFBAE6FD).withAlpha((b.opacity * 255).toInt());
      canvas.drawCircle(Offset(b.x, b.y), b.radius, bubblePaint);

      // Specular highlight gleam on bubble corner
      if (b.radius > 2.0) {
        final double shineR = b.radius * 0.28;
        canvas.drawCircle(
          Offset(b.x - b.radius * 0.35, b.y - b.radius * 0.35),
          shineR,
          shinePaint,
        );
      }
    }
  }

  void _drawWaterRipples(Canvas canvas) {
    for (final r in ripples) {
      final ripplePaint = Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = max(0.5, 1.8 * (1.0 - r.radius / r.maxRadius))
        ..color = r.color.withAlpha((r.opacity * 255).clamp(0, 255).toInt());

      canvas.drawCircle(r.center, r.radius, ripplePaint);

      // Faint secondary echo ring
      if (r.radius > 12) {
        final echoPaint = Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.0
          ..color = r.color.withAlpha(((r.opacity * 0.45) * 255).clamp(0, 255).toInt());
        canvas.drawCircle(r.center, r.radius - 10, echoPaint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _AquariumBackdropPainter oldDelegate) => true;
}
