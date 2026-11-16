import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/models.dart';
import '../../services/supabase_service.dart';

class BellGameScreen extends StatefulWidget {
  const BellGameScreen({super.key});

  @override
  State<BellGameScreen> createState() => _BellGameScreenState();
}

class _BellGameScreenState extends State<BellGameScreen> with SingleTickerProviderStateMixin {
  static const int _gameDuration = 20;
  int _timeLeft = _gameDuration;
  int _score = 0;
  bool _isPlaying = false;
  Timer? _timer;

  late AnimationController _bellAnimController;
  late Animation<double> _scaleAnimation;

  List<LeaderboardEntry> _leaderboard = [];

  @override
  void initState() {
    super.initState();
    _bellAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 140),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.25).animate(
      CurvedAnimation(parent: _bellAnimController, curve: Curves.easeInOut),
    );
    _loadLeaderboard();
  }

  Future<void> _loadLeaderboard() async {
    final list = await SupabaseService.getLeaderboard();
    if (mounted) setState(() => _leaderboard = list);
  }

  void _startGame() {
    setState(() {
      _score = 0;
      _timeLeft = _gameDuration;
      _isPlaying = true;
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_timeLeft <= 1) {
        t.cancel();
        _endGame();
      } else {
        setState(() => _timeLeft--);
      }
    });
  }

  void _onBellTap() {
    if (!_isPlaying) {
      _startGame();
    }

    HapticFeedback.lightImpact();
    _bellAnimController.forward().then((_) => _bellAnimController.reverse());

    setState(() {
      _score += 10;
    });
  }

  void _endGame() {
    setState(() => _isPlaying = false);
    HapticFeedback.heavyImpact();
    _showSaveScoreDialog();
  }

  void _showSaveScoreDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
        title: Text(
          "Time's Up! 🔔",
          textAlign: TextAlign.center,
          style: GoogleFonts.cinzel(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Your Final Score",
              style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 6),
            Text(
              "$_score",
              style: GoogleFonts.poppins(
                color: AppColors.primary,
                fontSize: 36,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Enter your name...",
                hintStyle: const TextStyle(color: AppColors.textMuted),
                filled: true,
                fillColor: AppColors.surfaceElevated,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
            },
            child: const Text("Skip", style: TextStyle(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.black,
            ),
            onPressed: () async {
              final name = controller.text.trim();
              if (name.isNotEmpty) {
                await SupabaseService.addScore(name, _score);
                await _loadLeaderboard();
              }
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text("Save Score", style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _bellAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(
          "Bell Ring Madness",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          const SizedBox(height: 16),

          // Score & Timer Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Score Box
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "SCORE",
                        style: GoogleFonts.poppins(
                          color: AppColors.textMuted,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        "$_score",
                        style: GoogleFonts.poppins(
                          color: AppColors.primary,
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),

                // Timer Box
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Column(
                    children: [
                      Text(
                        "TIME LEFT",
                        style: GoogleFonts.poppins(
                          color: AppColors.textMuted,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        "${_timeLeft}s",
                        style: GoogleFonts.poppins(
                          color: _timeLeft <= 5 ? Colors.redAccent : Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Interactive Golden Bell Target
          Center(
            child: GestureDetector(
              onTap: _onBellTap,
              child: ScaleTransition(
                scale: _scaleAnimation,
                child: Container(
                  width: 140,
                  height: 140,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const RadialGradient(
                      colors: [
                        AppColors.primaryLight,
                        AppColors.primary,
                        AppColors.primaryDark,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withAlpha(_isPlaying ? 150 : 80),
                        blurRadius: _isPlaying ? 32 : 16,
                        spreadRadius: _isPlaying ? 6 : 2,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.notifications_active,
                      size: 72,
                      color: Color(0xFF1B1B1B),
                    ),
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),
          Text(
            _isPlaying ? "TAP TAP TAP AS FAST AS YOU CAN!" : "TAP THE BELL TO START",
            style: GoogleFonts.poppins(
              color: AppColors.primary,
              fontSize: 12,
              fontWeight: FontWeight.w700,
              letterSpacing: 1,
            ),
          ),

          const SizedBox(height: 20),

          // Leaderboard Section
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.emoji_events, color: AppColors.primary, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        "TOP RINGERS LEADERBOARD",
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Expanded(
                    child: _leaderboard.isEmpty
                        ? Center(
                            child: Text(
                              "No scores yet. Be the first!",
                              style: GoogleFonts.poppins(color: AppColors.textMuted),
                            ),
                          )
                        : ListView.separated(
                            physics: const BouncingScrollPhysics(),
                            itemCount: _leaderboard.length,
                            separatorBuilder: (context, index) => const SizedBox(height: 8),
                            itemBuilder: (ctx, i) {
                              final entry = _leaderboard[i];
                              final isTop3 = i < 3;
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                  color: isTop3
                                      ? AppColors.primary.withAlpha(25)
                                      : AppColors.surfaceElevated,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isTop3
                                        ? AppColors.primary.withAlpha(80)
                                        : AppColors.divider,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      "#${i + 1}",
                                      style: GoogleFonts.poppins(
                                        color: isTop3 ? AppColors.primary : AppColors.textMuted,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Text(
                                        entry.name,
                                        style: GoogleFonts.poppins(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      "${entry.score} pts",
                                      style: GoogleFonts.poppins(
                                        color: AppColors.primary,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
