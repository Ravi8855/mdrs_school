import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/student_zone_model.dart';
import '../../services/student_zone_service.dart';

// ============================================================================
// 1. STUDENTS ZONE BATCHES SCREEN (Vertical list of 2013, 14, 15, 16, 17)
// ============================================================================
class StudentsZoneScreen extends StatefulWidget {
  const StudentsZoneScreen({super.key});

  @override
  State<StudentsZoneScreen> createState() => _StudentsZoneScreenState();
}

class _StudentsZoneScreenState extends State<StudentsZoneScreen> {
  int _titleTapCount = 0;
  DateTime _lastTitleTap = DateTime.now();

  final List<_BatchMeta> _batches = const [
    _BatchMeta(
      year: '2013',
      title: '2013 Batch',
      motto: 'The Founding Legends & Trailblazers',
      studentCount: 19,
      image: 'assets/images/batch2013_1.jpg',
      gradientColors: [Color(0xFF7C3AED), Color(0xFF4C1D95)],
      accentColor: Color(0xFFFBBF24),
    ),
    _BatchMeta(
      year: '2014',
      title: '2014 Batch',
      motto: 'The Pioneers & Olympiad Achievers',
      studentCount: 31,
      image: 'assets/images/batch2014_1.jpg',
      gradientColors: [Color(0xFF2563EB), Color(0xFF1E3A8A)],
      accentColor: Color(0xFF60A5FA),
    ),
    _BatchMeta(
      year: '2015',
      title: '2015 Batch',
      motto: 'The Golden Era & Medical Scholars',
      studentCount: 36,
      image: 'assets/images/batch2015_1.jpg',
      gradientColors: [Color(0xFF9333EA), Color(0xFF581C87)],
      accentColor: Color(0xFFE879F9),
    ),
    _BatchMeta(
      year: '2016',
      title: '2016 Batch',
      motto: 'The Rising Stars & Quiz Masters',
      studentCount: 16,
      image: 'assets/images/college.jpg',
      gradientColors: [Color(0xFF0D9488), Color(0xFF115E59)],
      accentColor: Color(0xFF2DD4BF),
    ),
    _BatchMeta(
      year: '2017',
      title: '2017 Batch',
      motto: 'The Record Breakers & Innovators',
      studentCount: 36,
      image: 'assets/images/batch2017_1.jpg',
      gradientColors: [Color(0xFFD97706), Color(0xFF78350F)],
      accentColor: Color(0xFFFDE047),
    ),
  ];

  @override
  void initState() {
    super.initState();
    StudentZoneService.initialize();
  }

  void _onTitleTap() {
    final now = DateTime.now();
    if (now.difference(_lastTitleTap).inMilliseconds < 600) {
      _titleTapCount++;
      if (_titleTapCount >= 3) {
        _titleTapCount = 0;
        _promptAdminAccess(context, defaultBatch: '2013');
      }
    } else {
      _titleTapCount = 1;
    }
    _lastTitleTap = now;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Colors.white, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: GestureDetector(
          onTap: _onTitleTap,
          child: Text(
            "Students Zone",
            style: GoogleFonts.cinzel(
              color: Colors.white,
              fontWeight: FontWeight.w800,
              fontSize: 21,
              letterSpacing: 1.2,
            ),
          ),
        ),
        centerTitle: true,
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(
            parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // Hero Banner
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF1E0A3C),
                    Color(0xFF2E1065),
                    Color(0xFF4C1D95),
                  ],
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x2E7C3AED),
                    blurRadius: 20,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Secret Gesture: Long press emblem triggers Admin Access
                  GestureDetector(
                    onLongPress: () =>
                        _promptAdminAccess(context, defaultBatch: '2013'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.gold.withAlpha(40),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: AppColors.gold.withAlpha(120), width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.school_rounded,
                              color: AppColors.gold, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            "MDRS HALL OF FAME",
                            style: GoogleFonts.poppins(
                              color: AppColors.gold,
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "Select a Batch",
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Choose a batch below to explore its Toppers, Wanted legends, and Backbenchers.",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: const Color(0xFFD8B4FE),
                      fontSize: 12.5,
                      height: 1.45,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Vertical Batches List
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final b = _batches[index];
                  return _buildVerticalBatchCard(context, b);
                },
                childCount: _batches.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVerticalBatchCard(BuildContext context, _BatchMeta batch) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.cardBorder, width: 0.9),
        boxShadow: const [
          BoxShadow(
            color: Color(0x187C3AED),
            blurRadius: 16,
            spreadRadius: 1,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: () {
            HapticFeedback.selectionClick();
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => BatchStudentsZoneScreen(batchYear: batch.year),
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                // Batch Image / Icon Thumbnail
                Container(
                  width: 76,
                  height: 76,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: LinearGradient(
                      colors: batch.gradientColors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: batch.gradientColors.first.withAlpha(90),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(18),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset(
                          batch.image,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Center(
                            child: Icon(Icons.groups_rounded,
                                color: batch.accentColor, size: 36),
                          ),
                        ),
                        // Dark overlay gradient for contrast
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withAlpha(130),
                              ],
                            ),
                          ),
                        ),
                        // Year Badge on thumbnail
                        Positioned(
                          bottom: 6,
                          left: 4,
                          right: 4,
                          child: Text(
                            batch.year,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),

                // Batch Info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Batch Title & Member Count Pill
                      Row(
                        children: [
                          Text(
                            batch.title,
                            style: GoogleFonts.poppins(
                              color: AppColors.textViolet,
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 9, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withAlpha(20),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              "${batch.studentCount} Students",
                              style: GoogleFonts.poppins(
                                color: AppColors.primary,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),

                      // Motto
                      Text(
                        batch.motto,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.poppins(
                          color: AppColors.textSecondary,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Preview Tags (Toppers • Wanted • Backbenchers)
                      Row(
                        children: [
                          _buildMiniBadge("🏆 Toppers"),
                          const SizedBox(width: 6),
                          _buildMiniBadge("🎯 Wanted"),
                          const SizedBox(width: 6),
                          _buildMiniBadge("😎 Backbenchers"),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 8),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: AppColors.textMuted,
                  size: 16,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMiniBadge(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F0FF),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFE9D5FF), width: 0.7),
      ),
      child: Text(
        label,
        style: GoogleFonts.poppins(
          color: AppColors.textViolet,
          fontSize: 9.5,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

// ----------------------------------------------------------------------------
// Helper Model for Vertical Batches
// ----------------------------------------------------------------------------
class _BatchMeta {
  final String year;
  final String title;
  final String motto;
  final int studentCount;
  final String image;
  final List<Color> gradientColors;
  final Color accentColor;

  const _BatchMeta({
    required this.year,
    required this.title,
    required this.motto,
    required this.studentCount,
    required this.image,
    required this.gradientColors,
    required this.accentColor,
  });
}

// ============================================================================
// 2. BATCH STUDENTS ZONE SCREEN (Shows Toppers, Wanted, Backbenchers for Batch)
// ============================================================================
class BatchStudentsZoneScreen extends StatefulWidget {
  final String batchYear;

  const BatchStudentsZoneScreen({
    super.key,
    required this.batchYear,
  });

  @override
  State<BatchStudentsZoneScreen> createState() =>
      _BatchStudentsZoneScreenState();
}

class _BatchStudentsZoneScreenState extends State<BatchStudentsZoneScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  int _titleTapCount = 0;
  DateTime _lastTitleTap = DateTime.now();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onTitleTap() {
    final now = DateTime.now();
    if (now.difference(_lastTitleTap).inMilliseconds < 600) {
      _titleTapCount++;
      if (_titleTapCount >= 3) {
        _titleTapCount = 0;
        _promptAdminAccess(context, defaultBatch: widget.batchYear);
      }
    } else {
      _titleTapCount = 1;
    }
    _lastTitleTap = now;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 220,
              pinned: true,
              elevation: 0,
              backgroundColor: AppColors.primaryDeep,
              leading: IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded,
                    color: Colors.white, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF1E0A3C),
                            Color(0xFF2E1065),
                            Color(0xFF4C1D95),
                          ],
                        ),
                      ),
                    ),
                    Positioned.fill(
                      child: CustomPaint(
                        painter: _StarSparklePainter(),
                      ),
                    ),
                    Positioned(
                      bottom: 20,
                      left: 20,
                      right: 20,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Secret gesture on Badge: Long press opens Admin
                          GestureDetector(
                            onLongPress: () => _promptAdminAccess(context,
                                defaultBatch: widget.batchYear),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 5),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFFBBF24),
                                    Color(0xFFF59E0B),
                                    Color(0xFFD97706),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(30),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.gold.withAlpha(140),
                                    blurRadius: 14,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.workspace_premium_rounded,
                                      color: Color(0xFF1E0A3C), size: 17),
                                  const SizedBox(width: 7),
                                  Text(
                                    "✨ ${widget.batchYear} BATCH",
                                    style: GoogleFonts.poppins(
                                      color: const Color(0xFF1E0A3C),
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 1.1,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),

                          // Secret gesture on Title: Triple tap opens Admin
                          GestureDetector(
                            onTap: _onTitleTap,
                            child: Text(
                              "Students Zone",
                              style: GoogleFonts.cinzel(
                                color: Colors.white,
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.4,
                                shadows: const [
                                  Shadow(
                                      color: Color(0xFF9333EA), blurRadius: 16),
                                  Shadow(
                                      color: Colors.black87,
                                      offset: Offset(0, 3),
                                      blurRadius: 6),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 3),

                          Text(
                            "Toppers • Wanted • Backbenchers",
                            style: GoogleFonts.poppins(
                              color: const Color(0xFFE9D5FF),
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(54),
                child: Container(
                  decoration: const BoxDecoration(
                    color: Color(0xFF1E0A3C),
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(22)),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicatorColor: AppColors.gold,
                    indicatorWeight: 3.5,
                    indicatorSize: TabBarIndicatorSize.label,
                    labelColor: AppColors.gold,
                    unselectedLabelColor: const Color(0xFFD8B4FE),
                    labelStyle: GoogleFonts.poppins(
                        fontSize: 13, fontWeight: FontWeight.w700),
                    unselectedLabelStyle: GoogleFonts.poppins(
                        fontSize: 13, fontWeight: FontWeight.w500),
                    tabs: const [
                      Tab(
                        icon: Icon(Icons.emoji_events_rounded, size: 19),
                        text: "Toppers",
                      ),
                      Tab(
                        icon: Icon(Icons.local_police_rounded, size: 19),
                        text: "Wanted",
                      ),
                      Tab(
                        icon: Icon(Icons.weekend_rounded, size: 19),
                        text: "Backbenchers",
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ];
        },
        body: Column(
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 6),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.cardBorder, width: 0.8),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x147C3AED),
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val.trim()),
                  style: GoogleFonts.poppins(
                      fontSize: 13.5, color: AppColors.textPrimary),
                  decoration: InputDecoration(
                    hintText: "Search ${widget.batchYear} classmates...",
                    hintStyle: GoogleFonts.poppins(
                        color: AppColors.textMuted, fontSize: 13),
                    prefixIcon: const Icon(Icons.search_rounded,
                        color: AppColors.primary, size: 20),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close_rounded,
                                color: AppColors.textMuted, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                ),
              ),
            ),

            // Tab Views for Toppers, Wanted, Backbenchers
            Expanded(
              child: ValueListenableBuilder<List<StudentZoneEntry>>(
                valueListenable: StudentZoneService.entriesNotifier,
                builder: (context, entries, _) {
                  return TabBarView(
                    controller: _tabController,
                    children: [
                      _buildCategoryList(
                        entries: entries,
                        category: StudentCategory.topper,
                        accentColor: const Color(0xFFF59E0B),
                        emptyMessage:
                            "No toppers in ${widget.batchYear} batch yet.",
                      ),
                      _buildCategoryList(
                        entries: entries,
                        category: StudentCategory.wanted,
                        accentColor: const Color(0xFFEF4444),
                        emptyMessage:
                            "No wanted legends in ${widget.batchYear} batch yet.",
                      ),
                      _buildCategoryList(
                        entries: entries,
                        category: StudentCategory.backbencher,
                        accentColor: const Color(0xFF8B5CF6),
                        emptyMessage:
                            "No backbenchers in ${widget.batchYear} batch yet.",
                      ),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryList({
    required List<StudentZoneEntry> entries,
    required StudentCategory category,
    required Color accentColor,
    required String emptyMessage,
  }) {
    var filtered = entries
        .where((e) =>
            e.batch == widget.batchYear && e.category == category)
        .toList();

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      filtered = filtered
          .where((e) =>
              e.name.toLowerCase().contains(q) ||
              e.tag.toLowerCase().contains(q) ||
              e.description.toLowerCase().contains(q) ||
              (e.badge?.toLowerCase().contains(q) ?? false))
          .toList();
    }

    if (filtered.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.person_search_rounded,
                  size: 48, color: AppColors.textMuted.withAlpha(120)),
              const SizedBox(height: 12),
              Text(
                emptyMessage,
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      itemCount: filtered.length,
      itemBuilder: (context, index) {
        final item = filtered[index];
        return _buildStudentCard(item, accentColor);
      },
    );
  }

  Widget _buildStudentCard(StudentZoneEntry student, Color accentColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: student.category == StudentCategory.topper
              ? AppColors.gold.withAlpha(90)
              : student.category == StudentCategory.wanted
                  ? const Color(0xFFEF4444).withAlpha(80)
                  : AppColors.primary.withAlpha(60),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: accentColor.withAlpha(25),
            blurRadius: 16,
            spreadRadius: 1,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(20),
        onTap: () => _showStudentDetails(student),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildAvatar(student, accentColor),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (student.badge != null && student.badge!.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 9, vertical: 3),
                        margin: const EdgeInsets.only(bottom: 6),
                        decoration: BoxDecoration(
                          color: accentColor.withAlpha(25),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                              color: accentColor.withAlpha(80), width: 0.8),
                        ),
                        child: Text(
                          student.badge!,
                          style: GoogleFonts.poppins(
                            color: accentColor,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    Text(
                      student.name,
                      style: GoogleFonts.poppins(
                        color: AppColors.textViolet,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      student.tag,
                      style: GoogleFonts.poppins(
                        color: AppColors.primary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      student.description,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.poppins(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.arrow_forward_ios_rounded,
                  color: AppColors.textMuted, size: 14),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAvatar(StudentZoneEntry student, Color accentColor) {
    final imagePath = student.image;
    final hasImage = imagePath != null && imagePath.trim().isNotEmpty;

    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: accentColor, width: 2),
        boxShadow: [
          BoxShadow(
            color: accentColor.withAlpha(60),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipOval(
        child: hasImage
            ? (imagePath.startsWith('http')
                ? Image.network(
                    imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _buildInitialsFallback(student, accentColor),
                  )
                : Image.asset(
                    imagePath,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _buildInitialsFallback(student, accentColor),
                  ))
            : _buildInitialsFallback(student, accentColor),
      ),
    );
  }

  Widget _buildInitialsFallback(StudentZoneEntry student, Color accentColor) {
    final initial =
        student.name.isNotEmpty ? student.name.substring(0, 1).toUpperCase() : '?';

    return Container(
      color: accentColor.withAlpha(35),
      alignment: Alignment.center,
      child: Text(
        initial,
        style: GoogleFonts.poppins(
          color: accentColor,
          fontSize: 22,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }

  void _showStudentDetails(StudentZoneEntry student) {
    HapticFeedback.lightImpact();
    Color accentColor;
    String categoryLabel;
    IconData categoryIcon;

    switch (student.category) {
      case StudentCategory.topper:
        accentColor = const Color(0xFFF59E0B);
        categoryLabel = '${student.batch} Batch Topper';
        categoryIcon = Icons.emoji_events_rounded;
        break;
      case StudentCategory.wanted:
        accentColor = const Color(0xFFEF4444);
        categoryLabel = '${student.batch} Batch Wanted Legend';
        categoryIcon = Icons.local_police_rounded;
        break;
      case StudentCategory.backbencher:
        accentColor = const Color(0xFF8B5CF6);
        categoryLabel = '${student.batch} Backbencher Elite';
        categoryIcon = Icons.weekend_rounded;
        break;
    }

    showDialog(
      context: context,
      builder: (_) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: accentColor.withAlpha(120), width: 1.8),
              boxShadow: [
                BoxShadow(
                  color: accentColor.withAlpha(70),
                  blurRadius: 28,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 5),
                    decoration: BoxDecoration(
                      color: accentColor.withAlpha(25),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: accentColor.withAlpha(80), width: 1),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(categoryIcon, size: 16, color: accentColor),
                        const SizedBox(width: 6),
                        Text(
                          categoryLabel.toUpperCase(),
                          style: GoogleFonts.poppins(
                            color: accentColor,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: accentColor, width: 3),
                      boxShadow: [
                        BoxShadow(
                          color: accentColor.withAlpha(90),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: student.image != null && student.image!.isNotEmpty
                          ? (student.image!.startsWith('http')
                              ? Image.network(
                                  student.image!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      _buildInitialsFallback(
                                          student, accentColor),
                                )
                              : Image.asset(
                                  student.image!,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      _buildInitialsFallback(
                                          student, accentColor),
                                ))
                          : _buildInitialsFallback(student, accentColor),
                    ),
                  ),
                  const SizedBox(height: 14),

                  Text(
                    student.name,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: AppColors.textViolet,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 2),

                  Text(
                    student.tag,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                      color: AppColors.primary,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 14),

                  if (student.badge != null && student.badge!.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF5F0FF),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Text(
                        student.badge!,
                        style: GoogleFonts.poppins(
                          color: accentColor,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  const SizedBox(height: 18),

                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF7FF),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE9D5FF)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "CAMPUS MEMORIES & LEGACY",
                          style: GoogleFonts.poppins(
                            color: AppColors.textViolet,
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          student.description,
                          style: GoogleFonts.poppins(
                            color: AppColors.textPrimary,
                            fontSize: 13,
                            height: 1.55,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text(
                        "Close Tribute",
                        style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w600, fontSize: 13.5),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// ============================================================================
// 3. SECRET ADMIN ACCESS TRIGGER & BOTTOM SHEET
// ============================================================================
void _promptAdminAccess(BuildContext context, {required String defaultBatch}) {
  HapticFeedback.heavyImpact();
  final pinController = TextEditingController();
  String? errorText;

  showDialog(
    context: context,
    builder: (dialogCtx) {
      return StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            backgroundColor: const Color(0xFF1E0A3C),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(24),
              side: const BorderSide(color: Color(0xFF9333EA), width: 1.5),
            ),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withAlpha(50),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.security_rounded,
                      color: AppColors.gold, size: 22),
                ),
                const SizedBox(width: 12),
                Text(
                  'Admin Access',
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Enter 4-digit security PIN to unlock the Student Zone admin panel:',
                  style: GoogleFonts.poppins(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: pinController,
                  keyboardType: TextInputType.number,
                  obscureText: true,
                  maxLength: 6,
                  autofocus: true,
                  style: GoogleFonts.poppins(
                    color: Colors.white,
                    fontSize: 20,
                    letterSpacing: 6,
                    fontWeight: FontWeight.bold,
                  ),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF2E1065),
                    hintText: 'PIN (Default: 2013)',
                    hintStyle: GoogleFonts.poppins(
                      color: Colors.white30,
                      fontSize: 13,
                      letterSpacing: 1,
                    ),
                    errorText: errorText,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFF7C3AED)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFF7C3AED)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide:
                          const BorderSide(color: AppColors.gold, width: 2),
                    ),
                  ),
                  onSubmitted: (val) async {
                    final isValid =
                        await StudentZoneService.verifyAdminPin(val);
                    if (isValid) {
                      if (dialogCtx.mounted) {
                        Navigator.pop(dialogCtx);
                      }
                      if (context.mounted) {
                        _openAdminPanelSheet(context, currentBatch: defaultBatch);
                      }
                    } else {
                      setDialogState(() {
                        errorText = 'Incorrect PIN. Default is 2013.';
                      });
                    }
                  },
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(dialogCtx),
                child: Text(
                  'Cancel',
                  style: GoogleFonts.poppins(color: Colors.white60),
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: () async {
                  final isValid = await StudentZoneService.verifyAdminPin(
                      pinController.text);
                  if (isValid) {
                    if (dialogCtx.mounted) {
                      Navigator.pop(dialogCtx);
                    }
                    if (context.mounted) {
                      _openAdminPanelSheet(context, currentBatch: defaultBatch);
                    }
                  } else {
                    setDialogState(() {
                      errorText = 'Incorrect PIN. Default is 2013.';
                    });
                  }
                },
                child: Text(
                  'Unlock Panel',
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                ),
              ),
            ],
          );
        },
      );
    },
  );
}

void _openAdminPanelSheet(BuildContext context, {required String currentBatch}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => _AdminPanelSheet(currentBatch: currentBatch),
  );
}

class _AdminPanelSheet extends StatefulWidget {
  final String currentBatch;

  const _AdminPanelSheet({required this.currentBatch});

  @override
  State<_AdminPanelSheet> createState() => _AdminPanelSheetState();
}

class _AdminPanelSheetState extends State<_AdminPanelSheet> {
  late String _selectedBatch;
  StudentCategory _selectedCategoryFilter = StudentCategory.topper;

  @override
  void initState() {
    super.initState();
    _selectedBatch = widget.currentBatch;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.90,
      decoration: const BoxDecoration(
        color: Color(0xFF1E0A3C),
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 44,
            height: 4.5,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(10),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withAlpha(40),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.admin_panel_settings_rounded,
                      color: AppColors.gold, size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Admin Management",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        "Batches 2013-2017 • Secret Panel",
                        style: GoogleFonts.poppins(
                          color: Colors.white54,
                          fontSize: 11.5,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded,
                      color: Colors.white70, size: 22),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.white12, height: 1),

          // Batch Filter Chips
          Container(
            height: 44,
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              itemCount: StudentZoneService.availableBatches.length,
              itemBuilder: (context, idx) {
                final b = StudentZoneService.availableBatches[idx];
                final isSelected = b == _selectedBatch;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: ChoiceChip(
                    label: Text("$b Batch"),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedBatch = b),
                    selectedColor: AppColors.gold,
                    backgroundColor: const Color(0xFF2E1065),
                    labelStyle: GoogleFonts.poppins(
                      color: isSelected
                          ? const Color(0xFF1E0A3C)
                          : Colors.white70,
                      fontWeight:
                          isSelected ? FontWeight.w800 : FontWeight.w500,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: isSelected
                            ? AppColors.gold
                            : const Color(0xFF7C3AED).withAlpha(80),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Action Toolbar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: () => _openAddEditDialog(context),
                    icon: const Icon(Icons.add_rounded, size: 20),
                    label: Text(
                      "Add Student to $_selectedBatch",
                      style: GoogleFonts.poppins(
                          fontWeight: FontWeight.w600, fontSize: 13),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFFD8B4FE),
                    side: const BorderSide(color: Color(0xFF7C3AED)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  onPressed: () => _confirmResetDefaults(context),
                  icon: const Icon(Icons.refresh_rounded, size: 18),
                  label: Text(
                    "Reset All",
                    style: GoogleFonts.poppins(
                        fontSize: 12.5, fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
          ),

          // Category Selector Pills
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              children: StudentCategory.values.map((cat) {
                final isSelected = _selectedCategoryFilter == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text("${cat.emoji} ${cat.displayName}"),
                    selected: isSelected,
                    onSelected: (_) =>
                        setState(() => _selectedCategoryFilter = cat),
                    selectedColor: AppColors.primary,
                    backgroundColor: const Color(0xFF2E1065),
                    labelStyle: GoogleFonts.poppins(
                      color: isSelected ? Colors.white : Colors.white70,
                      fontWeight:
                          isSelected ? FontWeight.w700 : FontWeight.w500,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected
                            ? AppColors.gold
                            : const Color(0xFF7C3AED).withAlpha(80),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // Student List
          Expanded(
            child: ValueListenableBuilder<List<StudentZoneEntry>>(
              valueListenable: StudentZoneService.entriesNotifier,
              builder: (context, entries, _) {
                final filtered = entries
                    .where((e) =>
                        e.batch == _selectedBatch &&
                        e.category == _selectedCategoryFilter)
                    .toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Text(
                      "No students in $_selectedBatch ${_selectedCategoryFilter.displayName}.",
                      style: GoogleFonts.poppins(color: Colors.white54),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final student = filtered[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2A0D52),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                            color: const Color(0xFF7C3AED).withAlpha(80)),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            backgroundColor: AppColors.primary.withAlpha(100),
                            child: Text(
                              student.name.isNotEmpty
                                  ? student.name.substring(0, 1)
                                  : '?',
                              style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  student.name,
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 14.5,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                Text(
                                  student.tag,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.poppins(
                                    color: const Color(0xFFD8B4FE),
                                    fontSize: 11.5,
                                  ),
                                ),
                                if (student.badge != null)
                                  Text(
                                    student.badge!,
                                    style: GoogleFonts.poppins(
                                      color: AppColors.gold,
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.edit_rounded,
                                color: AppColors.gold, size: 19),
                            onPressed: () => _openAddEditDialog(context,
                                existing: student),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded,
                                color: Color(0xFFEF4444), size: 19),
                            onPressed: () =>
                                _confirmDeleteStudent(context, student),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _openAddEditDialog(BuildContext context,
      {StudentZoneEntry? existing}) {
    final nameCtrl = TextEditingController(text: existing?.name ?? '');
    final tagCtrl = TextEditingController(text: existing?.tag ?? '');
    final descCtrl = TextEditingController(text: existing?.description ?? '');
    final badgeCtrl = TextEditingController(text: existing?.badge ?? '');
    final imgCtrl = TextEditingController(text: existing?.image ?? '');
    var category = existing?.category ?? _selectedCategoryFilter;
    var batch = existing?.batch ?? _selectedBatch;

    showDialog(
      context: context,
      builder: (dialogCtx) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: const Color(0xFF1E0A3C),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(22),
                side: const BorderSide(color: Color(0xFF9333EA), width: 1.5),
              ),
              title: Text(
                existing == null ? "Add Student" : "Edit Student",
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 17,
                ),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Batch Year:",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: batch,
                      dropdownColor: const Color(0xFF2E1065),
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration("Batch"),
                      items: StudentZoneService.availableBatches.map((b) {
                        return DropdownMenuItem(
                          value: b,
                          child: Text("$b Batch"),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => batch = val);
                        }
                      },
                    ),
                    const SizedBox(height: 12),

                    Text("Category:",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<StudentCategory>(
                      initialValue: category,
                      dropdownColor: const Color(0xFF2E1065),
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration("Category"),
                      items: StudentCategory.values.map((cat) {
                        return DropdownMenuItem(
                          value: cat,
                          child: Text("${cat.emoji} ${cat.displayName}"),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setDialogState(() => category = val);
                        }
                      },
                    ),
                    const SizedBox(height: 12),

                    Text("Student Name *",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: nameCtrl,
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration("e.g. Ramesh Patil"),
                    ),
                    const SizedBox(height: 12),

                    Text("Title / Tag *",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: tagCtrl,
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration(
                          "e.g. SSLC 95% or Mess Mango Smuggler"),
                    ),
                    const SizedBox(height: 12),

                    Text("Badge / Tagline",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: badgeCtrl,
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration:
                          _inputDecoration("e.g. 🏆 Rank 1 or 🚨 Most Wanted"),
                    ),
                    const SizedBox(height: 12),

                    Text("Campus Memory / Story *",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: descCtrl,
                      maxLines: 3,
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration(
                          "Fun story, memorable achievement, or campus antics..."),
                    ),
                    const SizedBox(height: 12),

                    Text("Photo (Optional Asset or URL)",
                        style: GoogleFonts.poppins(
                            color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    TextField(
                      controller: imgCtrl,
                      style: GoogleFonts.poppins(color: Colors.white, fontSize: 13),
                      decoration: _inputDecoration("assets/images/college.jpg or URL"),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogCtx),
                  child: Text("Cancel",
                      style: GoogleFonts.poppins(color: Colors.white60)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onPressed: () async {
                    if (nameCtrl.text.trim().isEmpty) return;

                    final entry = StudentZoneEntry(
                      id: existing?.id ??
                          DateTime.now().millisecondsSinceEpoch.toString(),
                      name: nameCtrl.text.trim(),
                      batch: batch,
                      category: category,
                      tag: tagCtrl.text.trim().isEmpty
                          ? category.displayName
                          : tagCtrl.text.trim(),
                      badge: badgeCtrl.text.trim().isEmpty
                          ? null
                          : badgeCtrl.text.trim(),
                      description: descCtrl.text.trim().isEmpty
                          ? "Proud $batch batch student of Morarji Desai Residential School."
                          : descCtrl.text.trim(),
                      image: imgCtrl.text.trim().isEmpty
                          ? null
                          : imgCtrl.text.trim(),
                    );

                    if (existing == null) {
                      await StudentZoneService.addEntry(entry);
                    } else {
                      await StudentZoneService.updateEntry(entry);
                    }

                    if (context.mounted) {
                      Navigator.pop(dialogCtx);
                    }
                  },
                  child: Text(existing == null ? "Add" : "Save",
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                ),
              ],
            );
          },
        );
      },
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.poppins(color: Colors.white30, fontSize: 12),
      filled: true,
      fillColor: const Color(0xFF2E1065),
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF7C3AED)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF7C3AED)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.gold, width: 1.5),
      ),
    );
  }

  void _confirmDeleteStudent(BuildContext context, StudentZoneEntry student) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E0A3C),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFFEF4444)),
        ),
        title: Text("Delete ${student.name}?",
            style: GoogleFonts.poppins(color: Colors.white, fontSize: 16)),
        content: Text(
          "Are you sure you want to remove this student from the ${student.category.displayName} list?",
          style: GoogleFonts.poppins(color: Colors.white70, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel",
                style: GoogleFonts.poppins(color: Colors.white60)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
            ),
            onPressed: () async {
              await StudentZoneService.deleteEntry(student.id);
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text("Delete"),
          ),
        ],
      ),
    );
  }

  void _confirmResetDefaults(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E0A3C),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.gold),
        ),
        title: Text("Reset All Batches?",
            style: GoogleFonts.poppins(color: Colors.white, fontSize: 16)),
        content: Text(
          "This will restore the original 2013-2017 Batch lists with Toppers, Wanted legends, and Backbenchers.",
          style: GoogleFonts.poppins(color: Colors.white70, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text("Cancel",
                style: GoogleFonts.poppins(color: Colors.white60)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.gold,
              foregroundColor: const Color(0xFF1E0A3C),
            ),
            onPressed: () async {
              await StudentZoneService.resetToDefaults();
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text("Reset Defaults"),
          ),
        ],
      ),
    );
  }
}

// -------------------------------------------------------------
// Atmospheric Sparkles Background Painter
// -------------------------------------------------------------
class _StarSparklePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFD8B4FE).withAlpha(45)
      ..style = PaintingStyle.fill;

    final offsets = [
      Offset(size.width * 0.15, size.height * 0.25),
      Offset(size.width * 0.85, size.height * 0.30),
      Offset(size.width * 0.30, size.height * 0.65),
      Offset(size.width * 0.70, size.height * 0.70),
      Offset(size.width * 0.50, size.height * 0.18),
      Offset(size.width * 0.90, size.height * 0.82),
      Offset(size.width * 0.08, size.height * 0.75),
    ];

    for (final o in offsets) {
      canvas.drawCircle(o, 2.0, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
