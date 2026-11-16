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
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: Container(
            height: 50,
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              physics: const BouncingScrollPhysics(),
              indicatorSize: TabBarIndicatorSize.tab,
              indicator: BoxDecoration(
                borderRadius: BorderRadius.circular(22),
                color: AppColors.primary.withAlpha(45),
                border: Border.all(color: AppColors.primary, width: 1.5),
              ),
              labelColor: AppColors.primary,
              unselectedLabelColor: AppColors.textSecondary,
              labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13),
              unselectedLabelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w500, fontSize: 13),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              tabs: _batchYears
                  .map(
                    (year) => Tab(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
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
              physics: const BouncingScrollPhysics(),
              children: List.generate(_batchYears.length, (idx) {
                final all = _getBatchList(idx);
                final filtered = _searchQuery.isEmpty
                    ? all
                    : all.where((n) => n.toLowerCase().contains(_searchQuery)).toList();

                return ListView(
                  physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
                  padding: const EdgeInsets.all(16),
                  children: [
                    // Interactive Name Aquarium Canvas Banner
                    Container(
                      height: 200,
                      decoration: BoxDecoration(
                        color: const Color(0xFF141A22),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.primary.withAlpha(60), width: 1.2),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha(120),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          children: [
                            Positioned.fill(
                              child: BouncingNamesAquarium(
                                key: ValueKey("aquarium_${_batchYears[idx]}"),
                                names: all,
                                batchYear: _batchYears[idx],
                              ),
                            ),
                            Positioned(
                              top: 10,
                              left: 14,
                              child: Row(
                                children: [
                                  Container(
                                    width: 7,
                                    height: 7,
                                    decoration: const BoxDecoration(
                                      color: AppColors.primary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    "BATCH ${_batchYears[idx]} AQUARIUM  •  TOUCH TO REFLECT",
                                    style: GoogleFonts.poppins(
                                      color: AppColors.primary,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 1.1,
                                    ),
                                  ),
                                ],
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.cardBorder),
                          ),
                          child: Text(
                            "${filtered.length} Students",
                            style: GoogleFonts.poppins(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
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

// Custom Physics Bouncing Names Aquarium with Non-Overlapping Collision & Touch Reflection
class BouncingNamesAquarium extends StatefulWidget {
  final List<String> names;
  final String batchYear;
  const BouncingNamesAquarium({
    super.key,
    required this.names,
    required this.batchYear,
  });

  @override
  State<BouncingNamesAquarium> createState() => _BouncingNamesAquariumState();
}

class _NameBubble {
  final String text;
  double x;
  double y;
  double vx;
  double vy;
  final double width;
  final double height;
  Color color;
  double scale = 1.0;
  bool isTouched = false;

  _NameBubble({
    required this.text,
    required this.x,
    required this.y,
    required this.vx,
    required this.vy,
    required this.width,
    required this.height,
    required this.color,
  });

  double get cx => x + width / 2;
  double get cy => y + height / 2;
  set cx(double value) => x = value - width / 2;
  set cy(double value) => y = value - height / 2;
}

class _BouncingNamesAquariumState extends State<BouncingNamesAquarium>
    with SingleTickerProviderStateMixin {
  late AnimationController _simController;
  final List<_NameBubble> _bubbles = [];
  final Random _rng = Random();
  double _lastW = 340.0;
  double _lastH = 200.0;
  bool _initialized = false;

  final List<Color> _palette = const [
    Color(0xFFEBB325), // Gold
    Color(0xFF38BDF8), // Sky Blue
    Color(0xFFA855F7), // Purple
    Color(0xFF34D399), // Emerald
    Color(0xFFF472B6), // Pink
    Color(0xFFFB923C), // Amber
    Color(0xFF22D3EE), // Cyan
    Color(0xFFF87171), // Coral
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

  void _setupBubbles(double w, double h) {
    if (_initialized && (w - _lastW).abs() < 10 && (h - _lastH).abs() < 10) {
      return;
    }
    _lastW = w;
    _lastH = h;
    _bubbles.clear();

    // Select up to 10 unique names so they have ample breathing room to float without overlapping
    final sample = widget.names.take(10).toList();
    if (sample.isEmpty) return;

    // Arrange in a clean spaced 3-row grid to guarantee no initial overlap
    const int cols = 4;
    final double colSpacing = (w - 24) / cols;
    final double rowSpacing = (h - 45) / 3;

    for (int i = 0; i < sample.length; i++) {
      final text = sample[i];
      final double width = (text.length * 7.5 + 24).clamp(60.0, 110.0);
      const double height = 30.0;

      final int row = i ~/ cols;
      final int col = i % cols;

      final double startX = 12 + col * colSpacing + (_rng.nextDouble() * 8 - 4);
      final double startY = 32 + row * rowSpacing + (_rng.nextDouble() * 6 - 3);

      final double vx = (_rng.nextBool() ? 1 : -1) * (0.6 + _rng.nextDouble() * 0.7);
      final double vy = (_rng.nextBool() ? 1 : -1) * (0.5 + _rng.nextDouble() * 0.6);

      _bubbles.add(_NameBubble(
        text: text,
        x: startX.clamp(6.0, max(6.0, w - width - 6)),
        y: startY.clamp(28.0, max(28.0, h - height - 6)),
        vx: vx,
        vy: vy,
        width: width,
        height: height,
        color: _palette[i % _palette.length],
      ));
    }

    // Run 15 relaxation steps to ensure strict separation before first frame
    for (int step = 0; step < 15; step++) {
      _resolveCollisions(w, h);
    }

    _initialized = true;
  }

  void _updatePhysics() {
    if (!mounted || _bubbles.isEmpty) return;

    final double w = _lastW;
    final double h = _lastH;

    for (final b in _bubbles) {
      // Move by velocity
      b.x += b.vx;
      b.y += b.vy;

      // Smooth decay of scale pop when touched
      if (b.scale > 1.0) {
        b.scale = max(1.0, b.scale - 0.035);
      }

      // Boundary collision (Bounce off edges with reflection)
      if (b.x < 6) {
        b.x = 6;
        b.vx = b.vx.abs() * 0.95 + 0.1;
      } else if (b.x + b.width > w - 6) {
        b.x = w - 6 - b.width;
        b.vx = -(b.vx.abs() * 0.95 + 0.1);
      }

      if (b.y < 28) {
        // top banner clearance
        b.y = 28;
        b.vy = b.vy.abs() * 0.95 + 0.1;
      } else if (b.y + b.height > h - 6) {
        b.y = h - 6 - b.height;
        b.vy = -(b.vy.abs() * 0.95 + 0.1);
      }
    }

    // Pairwise non-overlapping collision resolution
    _resolveCollisions(w, h);

    // Keep velocities smooth & continuous (avoid stalling or extreme speeds)
    for (final b in _bubbles) {
      final double speed = sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > 3.2) {
        b.vx = (b.vx / speed) * 3.2;
        b.vy = (b.vy / speed) * 3.2;
      } else if (speed < 0.4) {
        b.vx = (b.vx >= 0 ? 0.45 : -0.45);
        b.vy = (b.vy >= 0 ? 0.40 : -0.40);
      }
    }

    setState(() {});
  }

  // Strict non-overlapping distance resolution + elastic bounce
  void _resolveCollisions(double w, double h) {
    for (int i = 0; i < _bubbles.length; i++) {
      for (int j = i + 1; j < _bubbles.length; j++) {
        final b1 = _bubbles[i];
        final b2 = _bubbles[j];

        final double dx = b2.cx - b1.cx;
        final double dy = b2.cy - b1.cy;

        // Minimum required separation along horizontal and vertical axes
        final double minW = (b1.width + b2.width) / 2 + 6.0;
        final double minH = (b1.height + b2.height) / 2 + 5.0;

        // Elliptical normalized distance
        final double distSq = (dx * dx) / (minW * minW) + (dy * dy) / (minH * minH);

        if (distSq < 1.0) {
          // Bubbles touch or overlap!
          final double dist = max(0.001, sqrt(distSq));
          final double overlap = 1.0 - dist;

          // Normalized collision direction
          final double nx = (dx / minW) / dist;
          final double ny = (dy / minH) / dist;

          // Displace apart instantly to guarantee NO OVERLAP
          final double sepX = nx * overlap * minW * 0.52;
          final double sepY = ny * overlap * minH * 0.52;

          b1.cx -= sepX;
          b1.cy -= sepY;
          b2.cx += sepX;
          b2.cy += sepY;

          // Elastic momentum exchange
          final double rvx = b2.vx - b1.vx;
          final double rvy = b2.vy - b1.vy;
          final double normalVel = rvx * nx + rvy * ny;

          if (normalVel < 0) {
            // Moving towards each other: bounce & reflect velocities
            const double restitution = 0.95;
            final double impulse = -(1.0 + restitution) * normalVel * 0.5;

            b1.vx -= impulse * nx;
            b1.vy -= impulse * ny;
            b2.vx += impulse * nx;
            b2.vy += impulse * ny;
          }
        }
      }
    }
  }

  // Requirement 3: When names are touched, it reflects with impulse + scale + haptic feedback
  void _reflectBubble(_NameBubble b) {
    HapticFeedback.mediumImpact();
    setState(() {
      // Reverse velocity (reflection) and add energetic impulse
      b.vx = -b.vx * 1.8;
      b.vy = -b.vy * 1.8;

      if (b.vx.abs() < 1.4) {
        b.vx = (_rng.nextBool() ? 1 : -1) * (1.8 + _rng.nextDouble() * 0.8);
      }
      if (b.vy.abs() < 1.4) {
        b.vy = (_rng.nextBool() ? 1 : -1) * (1.6 + _rng.nextDouble() * 0.8);
      }

      b.vx = b.vx.clamp(-3.2, 3.2);
      b.vy = b.vy.clamp(-3.2, 3.2);

      // Scale pop reflection effect
      b.scale = 1.35;
      b.isTouched = true;

      // Also gently repel neighboring bubbles
      for (final other in _bubbles) {
        if (other != b) {
          final dx = other.cx - b.cx;
          final dy = other.cy - b.cy;
          final d = sqrt(dx * dx + dy * dy);
          if (d > 0 && d < 90) {
            other.vx += (dx / d) * 1.2;
            other.vy += (dy / d) * 1.2;
          }
        }
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
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;
        if (!_initialized || (w - _lastW).abs() > 20) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) {
              setState(() {
                _setupBubbles(w, h);
              });
            }
          });
        }

        return Stack(
          children: _bubbles.map((b) {
            return Positioned(
              left: b.x,
              top: b.y,
              child: GestureDetector(
                onTap: () => _reflectBubble(b),
                child: Transform.scale(
                  scale: b.scale,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: b.color.withAlpha(b.scale > 1.05 ? 85 : 45),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: b.scale > 1.05 ? Colors.white : b.color.withAlpha(160),
                        width: b.scale > 1.05 ? 1.8 : 1.2,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: b.color.withAlpha(b.scale > 1.05 ? 120 : 50),
                          blurRadius: b.scale > 1.05 ? 12 : 6,
                          spreadRadius: b.scale > 1.05 ? 1.5 : 0,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 5,
                          height: 5,
                          decoration: BoxDecoration(
                            color: b.color,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Text(
                          b.text,
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }).toList(),
        );
      },
    );
  }
}
