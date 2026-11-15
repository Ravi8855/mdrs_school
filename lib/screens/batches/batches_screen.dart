import 'dart:math';
import 'package:flutter/material.dart';
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
  String _searchQuery = "";

  final List<String> _batchYears = ["2013", "2014", "2015", "2016", "2017"];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _batchYears.length, vsync: this, initialIndex: 1); // default 2014
  }

  @override
  void dispose() {
    _tabController.dispose();
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
        backgroundColor: AppColors.surface,
        title: Text(
          "School Batches",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 20),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: false,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13),
          tabs: _batchYears.map((year) => Tab(text: "Batch '$year")).toList(),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: "Search classmate name...",
                hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                prefixIcon: const Icon(Icons.search, color: AppColors.primary, size: 20),
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
                  borderSide: const BorderSide(color: AppColors.primary),
                ),
              ),
            ),
          ),

          // Tab content (Aquarium + Student Grid)
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: List.generate(_batchYears.length, (idx) {
                final all = _getBatchList(idx);
                final filtered = _searchQuery.isEmpty
                    ? all
                    : all.where((n) => n.toLowerCase().contains(_searchQuery)).toList();

                return ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Interactive Name Aquarium Canvas Banner
                    Container(
                      height: 190,
                      decoration: BoxDecoration(
                        color: const Color(0xFF141A22),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primary.withAlpha(50)),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          children: [
                            Positioned.fill(
                              child: BouncingNamesAquarium(names: all),
                            ),
                            Positioned(
                              top: 10,
                              left: 14,
                              child: Text(
                                "BATCH '${_batchYears[idx]} AQUARIUM",
                                style: GoogleFonts.poppins(
                                  color: AppColors.primary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 1.2,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Batch Student Count Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "STUDENT ROSTER",
                          style: GoogleFonts.poppins(
                            color: AppColors.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.2,
                          ),
                        ),
                        Text(
                          "${filtered.length} Students",
                          style: GoogleFonts.poppins(
                            color: AppColors.textSecondary,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Class list items
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filtered.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 8),
                      itemBuilder: (ctx, i) {
                        final studentName = filtered[i];
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.cardBorder),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 18,
                                backgroundColor: AppColors.primary.withAlpha(40),
                                child: Text(
                                  studentName.isNotEmpty ? studentName[0].toUpperCase() : '?',
                                  style: GoogleFonts.poppins(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Text(
                                  studentName,
                                  style: GoogleFonts.poppins(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              Icon(
                                Icons.school,
                                size: 18,
                                color: AppColors.textMuted.withAlpha(120),
                              ),
                            ],
                          ),
                        );
                      },
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
}

// Custom Physics Bouncing Names Aquarium (Flutter Native implementation)
class BouncingNamesAquarium extends StatefulWidget {
  final List<String> names;
  const BouncingNamesAquarium({super.key, required this.names});

  @override
  State<BouncingNamesAquarium> createState() => _BouncingNamesAquariumState();
}

class _NameBubble {
  final String text;
  double x;
  double y;
  double vx;
  double vy;
  Color color;

  _NameBubble({
    required this.text,
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.color,
  });
}

class _BouncingNamesAquariumState extends State<BouncingNamesAquarium>
    with SingleTickerProviderStateMixin {
  late AnimationController _simController;
  final List<_NameBubble> _bubbles = [];
  final Random _rng = Random();

  final List<Color> _palette = const [
    Color(0xFFEBB325),
    Color(0xFF38BDF8),
    Color(0xFFA855F7),
    Color(0xFF34D399),
    Color(0xFFF472B6),
    Color(0xFFFB923C),
  ];

  @override
  void initState() {
    super.initState();
    _initBubbles();
    _simController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
    _simController.addListener(_updatePhysics);
  }

  void _initBubbles() {
    final sample = widget.names.take(16).toList();
    for (int i = 0; i < sample.length; i++) {
      _bubbles.add(_NameBubble(
        text: sample[i],
        x: 40 + (i % 4) * 70.0 + _rng.nextDouble() * 20,
        y: 30 + (i ~/ 4) * 35.0 + _rng.nextDouble() * 15,
        vx: (_rng.nextDouble() - 0.5) * 1.4,
        vy: (_rng.nextDouble() - 0.5) * 1.4,
        color: _palette[i % _palette.length],
      ));
    }
  }

  void _updatePhysics() {
    if (!mounted) return;
    setState(() {
      for (final b in _bubbles) {
        b.x += b.vx;
        b.y += b.vy;

        // Bouncing boundaries (approx 340 width x 180 height)
        if (b.x < 10) {
          b.x = 10;
          b.vx = -b.vx;
        } else if (b.x > 260) {
          b.x = 260;
          b.vx = -b.vx;
        }

        if (b.y < 25) {
          b.y = 25;
          b.vy = -b.vy;
        } else if (b.y > 145) {
          b.y = 145;
          b.vy = -b.vy;
        }
      }
    });
  }

  @override
  void dispose() {
    _simController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: _bubbles.map((b) {
        return Positioned(
          left: b.x,
          top: b.y,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: b.color.withAlpha(45),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: b.color.withAlpha(140), width: 1),
              boxShadow: [
                BoxShadow(color: b.color.withAlpha(40), blurRadius: 6),
              ],
            ),
            child: Text(
              b.text,
              style: GoogleFonts.poppins(
                fontSize: 10,
                color: b.color,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
