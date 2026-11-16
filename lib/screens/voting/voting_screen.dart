import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:confetti/confetti.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';
import '../../data/models.dart';
import '../../services/supabase_service.dart';

class VotingScreen extends StatefulWidget {
  const VotingScreen({super.key});

  @override
  State<VotingScreen> createState() => _VotingScreenState();
}

class _VotingScreenState extends State<VotingScreen> {
  late ConfettiController _confettiController;
  final Map<String, String> _userVotes = {};

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(milliseconds: 900));
    _loadExistingVotes();
  }

  Future<void> _loadExistingVotes() async {
    for (final cat in StaticData.votingCategories) {
      final voted = await SupabaseService.getVotedNominee(cat.id);
      if (voted != null && mounted) {
        setState(() => _userVotes[cat.id] = voted);
      }
    }
  }

  void _onVote(VotingCategory cat, VotingNominee nom) async {
    setState(() {
      _userVotes[cat.id] = nom.id;
    });
    _confettiController.play();
    await SupabaseService.submitVote(cat.id, nom.id);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Voted for ${nom.name} in ${cat.title}! 🎉"),
          backgroundColor: AppColors.surfaceElevated,
          behavior: SnackBarBehavior.floating,
          duration: const Duration(milliseconds: 1400),
        ),
      );
    }
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(
          "Class Voting",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          ListView.builder(
            physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
            padding: const EdgeInsets.all(16),
            itemCount: StaticData.votingCategories.length,
            itemBuilder: (ctx, i) {
              final cat = StaticData.votingCategories[i];
              final currentVote = _userVotes[cat.id];

              return Container(
                margin: const EdgeInsets.only(bottom: 18),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: currentVote != null ? AppColors.primary : AppColors.cardBorder,
                    width: currentVote != null ? 1.5 : 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      children: [
                        Text(cat.emoji, style: const TextStyle(fontSize: 26)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                cat.title,
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              Text(
                                cat.subtitle,
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
                    const SizedBox(height: 14),

                    // Nominees Chips / Radio
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: cat.nominees.map((nom) {
                        final isSelected = currentVote == nom.id;
                        return InkWell(
                          onTap: () => _onVote(cat, nom),
                          borderRadius: BorderRadius.circular(20),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected ? AppColors.primary : AppColors.divider,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (isSelected) ...[
                                  const Icon(Icons.check_circle, size: 14, color: Colors.black),
                                  const SizedBox(width: 6),
                                ],
                                Text(
                                  nom.name,
                                  style: GoogleFonts.poppins(
                                    color: isSelected ? Colors.black : Colors.white,
                                    fontSize: 13,
                                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              );
            },
          ),

          // Confetti explosion over the screen
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              shouldLoop: false,
              colors: const [
                AppColors.primary,
                Colors.orangeAccent,
                Colors.pinkAccent,
                Colors.purpleAccent,
                Colors.cyanAccent,
              ],
            ),
          ),
        ],
      ),
    );
  }
}
