import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/app_colors.dart';

class _BingoMemory {
  final String id;
  final String emoji;
  final String title;
  final String subtitle;
  final int matchPercent;

  const _BingoMemory({
    required this.id,
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.matchPercent,
  });
}

class MdrsianBingoScreen extends StatefulWidget {
  const MdrsianBingoScreen({super.key});

  @override
  State<MdrsianBingoScreen> createState() => _MdrsianBingoScreenState();
}

class _MdrsianBingoScreenState extends State<MdrsianBingoScreen> {
  static const String _prefsKey = 'mdrs_bingo_checked_ids_v2';

  static const List<_BingoMemory> _memories = [
    _BingoMemory(
      id: 'raju_laxmi',
      emoji: '💛',
      title: 'Raju Anna & Laxmi Aunty',
      subtitle: 'Everyone’s all-time favorites — the warmest hearts on MDRS campus',
      matchPercent: 98,
    ),
    _BingoMemory(
      id: 'sixth_homesick',
      emoji: '🏡',
      title: '6th Std First Days Missing Home',
      subtitle: 'First time living in hostel, quietly thinking only of Amma & home...',
      matchPercent: 96,
    ),
    _BingoMemory(
      id: 'one_day_study',
      emoji: '📖',
      title: 'One-Day Before Exam Batting',
      subtitle: 'Opened the whole textbook one night before exam & still survived!',
      matchPercent: 92,
    ),
    _BingoMemory(
      id: 'holiday_trunk',
      emoji: '🧳',
      title: 'Trunk Packed Before Holiday Notice',
      subtitle: 'Steel trunk locked & ready days before holidays were even announced!',
      matchPercent: 94,
    ),
    _BingoMemory(
      id: 'water_issue',
      emoji: '💧',
      title: 'Water Issue: Girls Suffered More!',
      subtitle: 'Whenever hostel water stopped, girls faced the toughest struggle!',
      matchPercent: 89,
    ),
    _BingoMemory(
      id: 'kit_box_business',
      emoji: '💸',
      title: 'Sold Kit Box for Pocket Money',
      subtitle: 'True hostel CEO — flipped free soap & hair oil for emergency snack cash! 😂',
      matchPercent: 73,
    ),
    _BingoMemory(
      id: 'parents_sunday',
      emoji: '🚪',
      title: 'Waited at Gate on Parents Sunday',
      subtitle: 'Watching the road every 2nd Sunday for home food & warm hugs',
      matchPercent: 97,
    ),
    _BingoMemory(
      id: 'sunday_special',
      emoji: '🍬',
      title: 'Waited All Week for Sunday Special',
      subtitle: 'Pulav, extra sweet & banana/egg feast in the dining hall',
      matchPercent: 95,
    ),
    _BingoMemory(
      id: 'trunk_snacks',
      emoji: '🥜',
      title: 'Hid Snacks Inside Steel Trunk',
      subtitle: 'Homemade chikki, mixture & biscuits guarded like gold',
      matchPercent: 91,
    ),
    _BingoMemory(
      id: 'power_cut',
      emoji: '💡',
      title: 'Cheered on Study Hall Power-Cut',
      subtitle: '5 full minutes of hostel-wide celebration in the dark!',
      matchPercent: 94,
    ),
    _BingoMemory(
      id: 'fake_sleep',
      emoji: '😴',
      title: 'Faked Sleep for Warden Round',
      subtitle: 'Freezing silently under blankets the second footsteps echoed',
      matchPercent: 87,
    ),
    _BingoMemory(
      id: 'bucket_rush',
      emoji: '🪣',
      title: 'Morning Bucket & Tap Queue',
      subtitle: 'Running half-asleep to grab the tap before the rush started',
      matchPercent: 88,
    ),
    _BingoMemory(
      id: 'ghost_stories',
      emoji: '👻',
      title: 'Ghost Stories After 10 PM',
      subtitle: 'Whispering horror stories under blankets after lights-out',
      matchPercent: 84,
    ),
    _BingoMemory(
      id: 'lunch_sprint',
      emoji: '🍽️',
      title: '2-Min Class-to-Mess Sprint',
      subtitle: 'Same-campus magic: bell rings and straight to steel plates',
      matchPercent: 93,
    ),
    _BingoMemory(
      id: 'rain_pt',
      emoji: '🌧️',
      title: 'Prayed for Rain to Cancel PT',
      subtitle: 'Raindrops on the hostel roof meant sweet extra sleep!',
      matchPercent: 86,
    ),
    _BingoMemory(
      id: 'evening_games',
      emoji: '🏏',
      title: 'Evening Ground Matches',
      subtitle: 'Kabaddi, volleyball, kho-kho & dusty cricket until sunset',
      matchPercent: 90,
    ),
    _BingoMemory(
      id: 'borrowed_items',
      emoji: '🧼',
      title: 'Borrowed Soap, Oil or Paste',
      subtitle: 'Hostel brotherhood: what is yours is everyone’s!',
      matchPercent: 79,
    ),
    _BingoMemory(
      id: 'midnight_feast',
      emoji: '🥣',
      title: '1 Snack Shared by 6 Friends',
      subtitle: 'Late-night dormitory feast on one bedsheet in the dark',
      matchPercent: 92,
    ),
    _BingoMemory(
      id: 'last_page',
      emoji: '✍️',
      title: 'Names on Last Notebook Page',
      subtitle: 'Slam books, bench doodles, flames & secret nicknames',
      matchPercent: 82,
    ),
    _BingoMemory(
      id: 'sick_room',
      emoji: '🤒',
      title: 'Faked Fever to Skip a Class',
      subtitle: 'Classic sick-room rest plan when homework wasn’t done',
      matchPercent: 64,
    ),
    _BingoMemory(
      id: 'farewell_tears',
      emoji: '🥹',
      title: 'Tears on 10th SSLC Farewell',
      subtitle: 'Entered the gate as strangers, left as family forever',
      matchPercent: 99,
    ),
  ];

  final Set<String> _checkedIds = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getStringList(_prefsKey);
      if (saved != null && mounted) {
        setState(() {
          _checkedIds.addAll(saved);
        });
      }
    } catch (_) {}
    if (mounted) {
      setState(() => _loading = false);
    }
  }

  Future<void> _saveChecked() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_prefsKey, _checkedIds.toList());
    } catch (_) {}
  }

  void _toggleMemory(String id) {
    HapticFeedback.lightImpact();
    setState(() {
      if (_checkedIds.contains(id)) {
        _checkedIds.remove(id);
      } else {
        _checkedIds.add(id);
      }
    });
    _saveChecked();
  }

  void _resetAll() {
    if (_checkedIds.isEmpty) return;
    HapticFeedback.mediumImpact();
    setState(() => _checkedIds.clear());
    _saveChecked();
  }

  int get _percentage =>
      ((_checkedIds.length / _memories.length) * 100).round();

  ({String emoji, String title, String message}) get _rankInfo {
    final pct = _percentage;
    if (pct == 0) {
      return (
        emoji: '👀',
        title: 'Ready to Recall?',
        message: 'Tap every MDRS hostel & school memory you actually lived!',
      );
    } else if (pct <= 25) {
      return (
        emoji: '🎒',
        title: 'Campus Visitor',
        message: 'Just warming up! Keep scrolling — more memories await.',
      );
    } else if (pct <= 50) {
      return (
        emoji: '🛏️',
        title: 'Hostel Rookie',
        message: 'You definitely survived morning whistles & mess queues!',
      );
    } else if (pct <= 75) {
      return (
        emoji: '🔥',
        title: 'True MDRS Hostelite',
        message: 'Residential campus life runs deep in your veins!',
      );
    } else if (pct < 94) {
      return (
        emoji: '🏆',
        title: 'Senior Hostel Veteran',
        message: 'Warden, mess hall & backbench — you mastered them all!',
      );
    } else {
      return (
        emoji: '👑',
        title: 'Certified MDRS Legend!',
        message: '100% pure Morarji Desai Residential School heritage!',
      );
    }
  }

  void _showShareSheet() {
    HapticFeedback.mediumImpact();
    final rank = _rankInfo;
    final pct = _percentage;
    final pickedTitles = _memories
        .where((m) => _checkedIds.contains(m.id))
        .take(5)
        .map((m) => '${m.emoji} ${m.title}')
        .toList();

    final shareText = '''🏫✨ HOW MUCH MDRSIAN ARE YOU? ✨🛏️
My Score: $pct% (${_checkedIds.length}/${_memories.length} Memories)
Rank: ${rank.emoji} ${rank.title}

${pickedTitles.isNotEmpty ? 'Top Memories I Lived:\n${pickedTitles.join('\n')}\n\n' : ''}Morarji Desai Residential School, Dorigudda Shahapur 💜
Check your score in the MDRS School App!''';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          margin: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF1E0A3C),
                Color(0xFF3B0D66),
                Color(0xFF2E1065),
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: AppColors.gold.withAlpha(140),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withAlpha(160),
                blurRadius: 30,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(22, 14, 22, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(70),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 18),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.gold.withAlpha(35),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.gold.withAlpha(130)),
                  ),
                  child: Text(
                    '★ MDRS ALUMNI MEMORY CARD ★',
                    style: GoogleFonts.poppins(
                      color: AppColors.gold,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  rank.emoji,
                  style: const TextStyle(fontSize: 44),
                ),
                const SizedBox(height: 6),
                Text(
                  '$pct% MDRSian',
                  style: GoogleFonts.cinzel(
                    color: Colors.white,
                    fontSize: 30,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  rank.title,
                  style: GoogleFonts.poppins(
                    color: AppColors.gold,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '${_checkedIds.length} of ${_memories.length} hostel & campus memories lived',
                  style: GoogleFonts.poppins(
                    color: Colors.white.withAlpha(200),
                    fontSize: 12,
                  ),
                ),
                if (pickedTitles.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(18),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.white.withAlpha(30)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'HIGHLIGHTED MEMORIES',
                          style: GoogleFonts.poppins(
                            color: AppColors.gold,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ...pickedTitles.map(
                          (item) => Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Text(
                              item,
                              style: GoogleFonts.poppins(
                                color: Colors.white.withAlpha(235),
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () async {
                          await Clipboard.setData(
                            ClipboardData(text: shareText),
                          );
                          if (ctx.mounted) Navigator.pop(ctx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Score copied! Paste it in your batch WhatsApp group 💜',
                                  style: GoogleFonts.poppins(fontSize: 12.5),
                                ),
                                backgroundColor: AppColors.primaryDeep,
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                            );
                          }
                        },
                        icon: const Icon(Icons.copy_rounded, size: 18),
                        label: Text(
                          'Copy for WhatsApp Group',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.gold,
                          foregroundColor: AppColors.primaryDeep,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final rank = _rankInfo;
    final pct = _percentage;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          'How Much MDRSian?',
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w700,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            tooltip: 'Reset Checklist',
            onPressed: _resetAll,
            icon: const Icon(Icons.refresh_rounded, color: Colors.white),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Top Live Scoreboard Banner
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(18, 16, 18, 18),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppColors.primaryDeep,
                        Color(0xFF3B0D66),
                        AppColors.primary,
                      ],
                    ),
                    borderRadius: BorderRadius.vertical(
                      bottom: Radius.circular(28),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x357C3AED),
                        blurRadius: 20,
                        offset: Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 66,
                            height: 66,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white.withAlpha(20),
                              border: Border.all(
                                color: AppColors.gold,
                                width: 2.2,
                              ),
                            ),
                            child: Center(
                              child: Text(
                                '$pct%',
                                style: GoogleFonts.poppins(
                                  color: AppColors.gold,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      rank.emoji,
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(width: 6),
                                    Expanded(
                                      child: Text(
                                        rank.title,
                                        style: GoogleFonts.poppins(
                                          color: Colors.white,
                                          fontSize: 15.5,
                                          fontWeight: FontWeight.w700,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  rank.message,
                                  style: GoogleFonts.poppins(
                                    color: Colors.white.withAlpha(215),
                                    fontSize: 11.5,
                                    height: 1.3,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      // Animated Overall Progress Bar
                      Row(
                        children: [
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: TweenAnimationBuilder<double>(
                                tween: Tween<double>(
                                  begin: 0,
                                  end: _checkedIds.length / _memories.length,
                                ),
                                duration: const Duration(milliseconds: 350),
                                curve: Curves.easeOutCubic,
                                builder: (context, value, _) {
                                  return LinearProgressIndicator(
                                    value: value,
                                    minHeight: 8,
                                    backgroundColor: Colors.white.withAlpha(35),
                                    valueColor: const AlwaysStoppedAnimation(
                                      AppColors.gold,
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withAlpha(25),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${_checkedIds.length}/${_memories.length}',
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Interactive Bingo Checklist Grid
                Expanded(
                  child: GridView.builder(
                    physics: const BouncingScrollPhysics(
                      parent: AlwaysScrollableScrollPhysics(),
                    ),
                    padding: const EdgeInsets.fromLTRB(14, 16, 14, 16),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.88,
                    ),
                    itemCount: _memories.length,
                    itemBuilder: (context, index) {
                      final memory = _memories[index];
                      final isChecked = _checkedIds.contains(memory.id);
                      final displayMatch = isChecked
                          ? (memory.matchPercent < 99
                              ? memory.matchPercent + 1
                              : 99)
                          : memory.matchPercent;

                      return GestureDetector(
                        onTap: () => _toggleMemory(memory.id),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 220),
                          curve: Curves.easeOutCubic,
                          padding: const EdgeInsets.all(13),
                          decoration: BoxDecoration(
                            gradient: isChecked
                                ? const LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      AppColors.primary,
                                      Color(0xFF9333EA),
                                    ],
                                  )
                                : null,
                            color: isChecked ? null : Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isChecked
                                  ? AppColors.gold
                                  : AppColors.cardBorder,
                              width: isChecked ? 1.8 : 0.9,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: isChecked
                                    ? AppColors.primary.withAlpha(80)
                                    : const Color(0x147C3AED),
                                blurRadius: isChecked ? 16 : 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      color: isChecked
                                          ? Colors.white.withAlpha(35)
                                          : AppColors.background,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Center(
                                      child: Text(
                                        memory.emoji,
                                        style: const TextStyle(fontSize: 19),
                                      ),
                                    ),
                                  ),
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 200),
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: isChecked
                                          ? AppColors.gold
                                          : AppColors.background,
                                      border: Border.all(
                                        color: isChecked
                                            ? AppColors.gold
                                            : AppColors.divider,
                                      ),
                                    ),
                                    child: Icon(
                                      isChecked
                                          ? Icons.check_rounded
                                          : Icons.add_rounded,
                                      size: 15,
                                      color: isChecked
                                          ? AppColors.primaryDeep
                                          : AppColors.textMuted,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                memory.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.poppins(
                                  color: isChecked
                                      ? Colors.white
                                      : AppColors.textPrimary,
                                  fontSize: 12.2,
                                  fontWeight: FontWeight.w700,
                                  height: 1.25,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Expanded(
                                child: Text(
                                  memory.subtitle,
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.poppins(
                                    color: isChecked
                                        ? Colors.white.withAlpha(215)
                                        : AppColors.textSecondary,
                                    fontSize: 10.2,
                                    height: 1.3,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              // Per-Card Student Match Progress Bar
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        '$displayMatch% students match',
                                        style: GoogleFonts.poppins(
                                          color: isChecked
                                              ? const Color(0xFFFDE68A)
                                              : AppColors.primary,
                                          fontSize: 9.5,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: displayMatch / 100,
                                      minHeight: 4.5,
                                      backgroundColor: isChecked
                                          ? Colors.white.withAlpha(40)
                                          : AppColors.divider,
                                      valueColor: AlwaysStoppedAnimation(
                                        isChecked
                                            ? AppColors.gold
                                            : AppColors.primaryLight,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Bottom Share Score Bar
                SafeArea(
                  top: false,
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border(
                        top: BorderSide(color: AppColors.divider),
                      ),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        onPressed: _showShareSheet,
                        icon: const Icon(Icons.share_rounded, size: 19),
                        label: Text(
                          'View & Share My $pct% MDRSian Card',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w700,
                            fontSize: 13.5,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          elevation: 4,
                          shadowColor: AppColors.primary.withAlpha(110),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}
