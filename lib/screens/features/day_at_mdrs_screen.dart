import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/app_colors.dart';

class _DayMoment {
  final String id;
  final String timeLabel;
  final String phaseLabel;
  final int startMinutes; // minutes since midnight (0..1439)
  final String emoji;
  final String title;
  final String campusSpot;
  final String story;
  final String memoryQuote;
  final List<Color> skyColors;

  const _DayMoment({
    required this.id,
    required this.timeLabel,
    required this.phaseLabel,
    required this.startMinutes,
    required this.emoji,
    required this.title,
    required this.campusSpot,
    required this.story,
    required this.memoryQuote,
    required this.skyColors,
  });
}

class DayAtMdrsScreen extends StatefulWidget {
  const DayAtMdrsScreen({super.key});

  @override
  State<DayAtMdrsScreen> createState() => _DayAtMdrsScreenState();
}

class _DayAtMdrsScreenState extends State<DayAtMdrsScreen> {
  static const String _favPrefsKey = 'mdrs_day_favorite_moments_v2';

  static const List<_DayMoment> _moments = [
    _DayMoment(
      id: 'wakeup',
      timeLabel: '6:00 AM',
      phaseLabel: 'Early Dawn',
      startMinutes: 6 * 60,
      emoji: '⏰',
      title: 'Wake-Up Time (Legends: 7–8 AM)',
      campusSpot: '🛏️ Boys & Girls Hostels',
      story:
          'Official wake-up time was 6:00 AM sharp — but true MDRS legends woke up at 7:00 or 8:00 AM, and sometimes proudly sacrificed the entire morning class just for extra blanket sleep!',
      memoryQuote:
          '“Official bell is 6 AM... legends wake up at 8 AM or skip morning class for sleep!”',
      skyColors: [Color(0xFF14072B), Color(0xFF311068), Color(0xFF5B21B6)],
    ),
    _DayMoment(
      id: 'tea_khari',
      timeLabel: '8:00 AM',
      phaseLabel: 'Morning Refresh',
      startMinutes: 8 * 60,
      emoji: '☕',
      title: 'Tea, Biscuits & Khari',
      campusSpot: '🍽️ Hostel Mess & Veranda',
      story:
          'Steaming hot morning tea paired with crunchy biscuits and crisp khari at 8:00 AM — the true morning fuel that finally opened sleepy eyes across every house!',
      memoryQuote: '“Dip the khari fast before it breaks inside the tea cup!”',
      skyColors: [Color(0xFF7C2D12), Color(0xFFC2410C), Color(0xFFF59E0B)],
    ),
    _DayMoment(
      id: 'tiffin',
      timeLabel: '8:30 AM',
      phaseLabel: 'Breakfast',
      startMinutes: 8 * 60 + 30,
      emoji: '🍛',
      title: 'Morning Tiffin Rush',
      campusSpot: '🍽️ Dining Mess Hall',
      story:
          'Steel plates clinking at 8:30 AM for hot hostel tiffin — finishing breakfast quickly and dashing back to the dorm to slip into crisp school uniforms before the 9 AM bell.',
      memoryQuote: '“Finish tiffin fast — only 15 minutes left for 9 AM class!”',
      skyColors: [Color(0xFF92400E), Color(0xFFD97706), Color(0xFFFBBF24)],
    ),
    _DayMoment(
      id: 'morning_class',
      timeLabel: '9:00 AM',
      phaseLabel: 'Academic Session',
      startMinutes: 9 * 60,
      emoji: '📚',
      title: 'Morning Classes Begin',
      campusSpot: '🏫 Academic Classrooms',
      story:
          '9:00 AM sharp! Stepping straight from the hostel corridor into classrooms — morning roll call, chalk dust on the blackboard, toppers taking notes and backbenchers warming up.',
      memoryQuote: '“Present Sir! (While still half-dreaming of the hostel pillow)”',
      skyColors: [Color(0xFF1D4ED8), Color(0xFF2563EB), Color(0xFF38BDF8)],
    ),
    _DayMoment(
      id: 'break_11',
      timeLabel: '11:00 AM',
      phaseLabel: 'Short Break',
      startMinutes: 11 * 60,
      emoji: '🔔',
      title: '11 AM Short Break',
      campusSpot: '🏛️ Classroom Corridors',
      story:
          'The much-needed 11:00 AM breather! Stretching legs outside the classroom, rushing to the water tap, trading quick jokes with friends from other sections, and resetting before the next period.',
      memoryQuote: '“11 o’clock break felt like 2 minutes long — bell rang too fast!”',
      skyColors: [Color(0xFF3730A3), Color(0xFF6D28D9), Color(0xFF8B5CF6)],
    ),
    _DayMoment(
      id: 'lunch',
      timeLabel: '1:00 PM',
      phaseLabel: 'Midday Lunch',
      startMinutes: 13 * 60,
      emoji: '🍽️',
      title: 'Lunch Time Sprint',
      campusSpot: '🍽️ Classroom → Mess Hall',
      story:
          'The magic of same-campus life: the 1:00 PM lunch bell rings and within 60 seconds the whole school is lined up in the dining hall sharing hot rice, sambar, palya, and laughter!',
      memoryQuote: '“Save a seat next to you at the long dining bench!”',
      skyColors: [Color(0xFF0F766E), Color(0xFF0D9488), Color(0xFF14B8A6)],
    ),
    _DayMoment(
      id: 'classes_dismissed',
      timeLabel: '5:00 PM',
      phaseLabel: 'Dismissal Bell',
      startMinutes: 17 * 60,
      emoji: '🎒',
      title: 'Final Bell • Classes Dismissed',
      campusSpot: '🏫 School to Hostel Walk',
      story:
          'The sweetest sound of the whole day — 5:00 PM Final Bell! Closing textbooks, tossing bags onto hostel beds, and changing out of school uniforms into play clothes.',
      memoryQuote: '“5 PM bell!! Books closed — hostel freedom officially begins!”',
      skyColors: [Color(0xFF4338CA), Color(0xFF7C3AED), Color(0xFFA855F7)],
    ),
    _DayMoment(
      id: 'evening_tea',
      timeLabel: '5:30 PM',
      phaseLabel: 'Evening Refresh',
      startMinutes: 17 * 60 + 30,
      emoji: '🍪',
      title: 'Evening Tea & Snacks',
      campusSpot: '🍽️ Mess & Hostel Veranda',
      story:
          'Hot evening tea and crispy snacks at 5:30 PM to recharge energy after a long day of classes — chatting with friends before heading straight to the playground.',
      memoryQuote: '“Grab your evening tea & snacks fast — the ground is waiting!”',
      skyColors: [Color(0xFF9A3412), Color(0xFFEA580C), Color(0xFFF59E0B)],
    ),
    _DayMoment(
      id: 'playing',
      timeLabel: '5:30 – 6:45 PM',
      phaseLabel: 'Golden Hour',
      startMinutes: 17 * 60 + 45,
      emoji: '🏏',
      title: 'Evening Sports & Ground Time',
      campusSpot: '🏏 Campus Sports Ground',
      story:
          'Pure golden-hour joy from 5:30 to 6:45 PM! Fierce cricket matches, volleyball smashes, kabaddi raids, and kho-kho sprints under the glowing Shahapur sunset sky.',
      memoryQuote: '“Last over! One more match before it gets dark!”',
      skyColors: [Color(0xFF7C2D12), Color(0xFFDB2777), Color(0xFFF97316)],
    ),
    _DayMoment(
      id: 'dinner',
      timeLabel: '7:30 PM',
      phaseLabel: 'Evening Dinner',
      startMinutes: 19 * 60 + 30,
      emoji: '🍲',
      title: 'Hostel Dinner Time',
      campusSpot: '🍽️ Dining Mess Hall',
      story:
          '7:30 PM dinner bell! Sitting together hungry after evening sports, reliving the best catches and goals over warm chapatis, rice, dal, or special pulav.',
      memoryQuote: '“After 1 hour of ground play, hostel dinner tastes like a feast!”',
      skyColors: [Color(0xFF2E1065), Color(0xFF581C87), Color(0xFF7C3AED)],
    ),
    _DayMoment(
      id: 'study_time',
      timeLabel: '9:00 – 10:00 PM',
      phaseLabel: 'Night Study',
      startMinutes: 21 * 60,
      emoji: '📖',
      title: 'Night Study Hour',
      campusSpot: '💡 Study Hall & Dorms',
      story:
          'Dedicated 9:00 to 10:00 PM night study session — revising notes, solving maths problems, prepping for tests, and cheering wildly if the power suddenly went out!',
      memoryQuote: '“One hour of serious study... plus praying for a power-cut!”',
      skyColors: [Color(0xFF1E1B4B), Color(0xFF3B0764), Color(0xFF4C1D95)],
    ),
    _DayMoment(
      id: 'sleep_time',
      timeLabel: '10:30 PM',
      phaseLabel: 'Lights Out',
      startMinutes: 22 * 60 + 30,
      emoji: '🌙',
      title: 'Sleeping Time (Depends on House Leader!)',
      campusSpot: '🛏️ Hostel Dormitories',
      story:
          'Official sleeping time is 10:30 PM — but whether lights actually turn off on time or midnight stories, jokes, and snack parties continue completely depends on your House Leader!',
      memoryQuote:
          '“10:30 PM lights out... unless our House Leader is in a chill mood tonight!”',
      skyColors: [Color(0xFF090418), Color(0xFF1E0A3C), Color(0xFF3B0D66)],
    ),
  ];

  late int _selectedIndex;
  late int _liveIndex;
  final Set<String> _favoriteIds = {};

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _liveIndex = _resolveLiveIndex(now.hour * 60 + now.minute);
    _selectedIndex = _liveIndex;
    _loadFavorites();
  }

  int _resolveLiveIndex(int currentMinutes) {
    if (currentMinutes < 6 * 60) {
      return _moments.length - 1; // Overnight / Sleeping time
    }
    int match = 0;
    for (int i = 0; i < _moments.length; i++) {
      if (currentMinutes >= _moments[i].startMinutes) {
        match = i;
      }
    }
    return match;
  }

  Future<void> _loadFavorites() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getStringList(_favPrefsKey);
      if (saved != null && mounted) {
        setState(() => _favoriteIds.addAll(saved));
      }
    } catch (_) {}
  }

  Future<void> _toggleFavorite(String id) async {
    HapticFeedback.lightImpact();
    setState(() {
      if (_favoriteIds.contains(id)) {
        _favoriteIds.remove(id);
      } else {
        _favoriteIds.add(id);
      }
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_favPrefsKey, _favoriteIds.toList());
    } catch (_) {}
  }

  void _jumpToLiveNow() {
    HapticFeedback.mediumImpact();
    final now = DateTime.now();
    setState(() {
      _liveIndex = _resolveLiveIndex(now.hour * 60 + now.minute);
      _selectedIndex = _liveIndex;
    });
  }

  String _formatCurrentClock() {
    final now = DateTime.now();
    final hour12 = now.hour % 12 == 0 ? 12 : now.hour % 12;
    final min = now.minute.toString().padLeft(2, '0');
    final amPm = now.hour >= 12 ? 'PM' : 'AM';
    return '$hour12:$min $amPm';
  }

  @override
  Widget build(BuildContext context) {
    final current = _moments[_selectedIndex];
    final isLiveMatch = _selectedIndex == _liveIndex;
    final isFav = _favoriteIds.contains(current.id);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          'A Day at MDRS',
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w700,
            fontSize: 19,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        actions: [
          TextButton.icon(
            onPressed: _jumpToLiveNow,
            icon: const Icon(
              Icons.schedule_rounded,
              color: AppColors.gold,
              size: 16,
            ),
            label: Text(
              'Live',
              style: GoogleFonts.poppins(
                color: AppColors.gold,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(
          parent: AlwaysScrollableScrollPhysics(),
        ),
        slivers: [
          // 1. Dynamic Animated Sky Hero Card
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeOutCubic,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: current.skyColors,
                  ),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(
                    color: Colors.white.withAlpha(55),
                    width: 1.2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: current.skyColors.first.withAlpha(110),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Status Row: Live Clock Indicator + Time Pill
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: isLiveMatch
                                ? AppColors.gold.withAlpha(45)
                                : Colors.white.withAlpha(28),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isLiveMatch
                                  ? AppColors.gold
                                  : Colors.white.withAlpha(60),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isLiveMatch
                                      ? AppColors.gold
                                      : Colors.white,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Text(
                                isLiveMatch
                                    ? 'RIGHT NOW (${_formatCurrentClock()})'
                                    : current.phaseLabel.toUpperCase(),
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.9,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black.withAlpha(65),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            current.timeLabel,
                            style: GoogleFonts.poppins(
                              color: AppColors.gold,
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // Emoji Badge + Title + Spot
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          width: 62,
                          height: 62,
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(32),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: Colors.white.withAlpha(70),
                            ),
                          ),
                          child: Center(
                            child: Text(
                              current.emoji,
                              style: const TextStyle(fontSize: 32),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                current.title,
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  height: 1.2,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 9,
                                  vertical: 3,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.black.withAlpha(55),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  current.campusSpot,
                                  style: GoogleFonts.poppins(
                                    color: const Color(0xFFFEF3C7),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Full Nostalgic Story
                    Text(
                      current.story,
                      style: GoogleFonts.poppins(
                        color: Colors.white.withAlpha(240),
                        fontSize: 13,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Memory Quote Box + Favorite Heart
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 11,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withAlpha(55),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withAlpha(35)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              current.memoryQuote,
                              style: GoogleFonts.poppins(
                                color: const Color(0xFFFDE68A),
                                fontSize: 12,
                                fontStyle: FontStyle.italic,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          InkWell(
                            onTap: () => _toggleFavorite(current.id),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: isFav
                                    ? const Color(0xFFEC4899)
                                    : Colors.white.withAlpha(25),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    isFav
                                        ? Icons.favorite_rounded
                                        : Icons.favorite_border_rounded,
                                    size: 16,
                                    color: Colors.white,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    isFav ? 'Missed!' : 'Miss This',
                                    style: GoogleFonts.poppins(
                                      color: Colors.white,
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 2. Interactive Time Travel Slider
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Container(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.cardBorder, width: 0.9),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x147C3AED),
                      blurRadius: 14,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.history_toggle_off_rounded,
                              size: 18,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Slide Through the Hostel Day',
                              style: GoogleFonts.poppins(
                                color: AppColors.textViolet,
                                fontSize: 12.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '${_selectedIndex + 1} / ${_moments.length}',
                          style: GoogleFonts.poppins(
                            color: AppColors.primary,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: AppColors.primary,
                        inactiveTrackColor: AppColors.divider,
                        thumbColor: AppColors.primary,
                        overlayColor: AppColors.primary.withAlpha(40),
                        trackHeight: 5,
                      ),
                      child: Slider(
                        min: 0,
                        max: (_moments.length - 1).toDouble(),
                        divisions: _moments.length - 1,
                        value: _selectedIndex.toDouble(),
                        onChanged: (val) {
                          final idx = val.round();
                          if (idx != _selectedIndex) {
                            HapticFeedback.selectionClick();
                            setState(() => _selectedIndex = idx);
                          }
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '6:00 AM',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '1:00 PM',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '5:30 PM',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            '10:30 PM',
                            style: GoogleFonts.poppins(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Section Label
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(18, 16, 18, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'FULL 24-HOUR CAMPUS TIMELINE',
                    style: GoogleFonts.poppins(
                      color: AppColors.textViolet,
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.1,
                    ),
                  ),
                  if (_favoriteIds.isNotEmpty)
                    Text(
                      '❤️ ${_favoriteIds.length} missed',
                      style: GoogleFonts.poppins(
                        color: const Color(0xFFDB2777),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                ],
              ),
            ),
          ),

          // 3. Connected Vertical Timeline Cards
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 28),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final item = _moments[index];
                  final isSelected = index == _selectedIndex;
                  final isLive = index == _liveIndex;
                  final isHearted = _favoriteIds.contains(item.id);
                  final isLast = index == _moments.length - 1;

                  return IntrinsicHeight(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Left Timeline Rail
                        SizedBox(
                          width: 30,
                          child: Column(
                            children: [
                              Container(
                                width: isSelected ? 16 : 12,
                                height: isSelected ? 16 : 12,
                                margin: const EdgeInsets.only(top: 18),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isSelected
                                      ? AppColors.primary
                                      : (isLive
                                          ? AppColors.gold
                                          : AppColors.divider),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.gold
                                        : Colors.white,
                                    width: 2,
                                  ),
                                ),
                              ),
                              if (!isLast)
                                Expanded(
                                  child: Container(
                                    width: 2,
                                    color: AppColors.divider,
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 6),

                        // Timeline Card
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: InkWell(
                              onTap: () {
                                HapticFeedback.selectionClick();
                                setState(() => _selectedIndex = index);
                              },
                              borderRadius: BorderRadius.circular(18),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 220),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 12,
                                ),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.primary
                                      : Colors.white,
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppColors.gold
                                        : AppColors.cardBorder,
                                    width: isSelected ? 1.5 : 0.9,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: isSelected
                                          ? AppColors.primary.withAlpha(70)
                                          : const Color(0x107C3AED),
                                      blurRadius: isSelected ? 14 : 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  children: [
                                    Text(
                                      item.emoji,
                                      style: const TextStyle(fontSize: 22),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(
                                                item.timeLabel,
                                                style: GoogleFonts.poppins(
                                                  color: isSelected
                                                      ? AppColors.gold
                                                      : AppColors.primary,
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w700,
                                                ),
                                              ),
                                              if (isLive) ...[
                                                const SizedBox(width: 6),
                                                Container(
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                    horizontal: 6,
                                                    vertical: 1,
                                                  ),
                                                  decoration: BoxDecoration(
                                                    color: AppColors.gold,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                      8,
                                                    ),
                                                  ),
                                                  child: Text(
                                                    'NOW',
                                                    style: GoogleFonts.poppins(
                                                      color:
                                                          AppColors.primaryDeep,
                                                      fontSize: 8.5,
                                                      fontWeight:
                                                          FontWeight.w800,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            item.title,
                                            style: GoogleFonts.poppins(
                                              color: isSelected
                                                  ? Colors.white
                                                  : AppColors.textPrimary,
                                              fontSize: 13.5,
                                              fontWeight: FontWeight.w700,
                                            ),
                                          ),
                                          Text(
                                            item.campusSpot,
                                            style: GoogleFonts.poppins(
                                              color: isSelected
                                                  ? Colors.white.withAlpha(210)
                                                  : AppColors.textSecondary,
                                              fontSize: 11,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    if (isHearted)
                                      Icon(
                                        Icons.favorite_rounded,
                                        size: 18,
                                        color: isSelected
                                            ? AppColors.gold
                                            : const Color(0xFFEC4899),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
                childCount: _moments.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
