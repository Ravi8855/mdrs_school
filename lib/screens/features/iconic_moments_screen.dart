import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/app_colors.dart';

class IconicMoment {
  final String id;
  final String studentName;
  final String batch;
  final String title;
  final String story;
  final String category;
  final String badgeEmoji;
  final Map<String, int> reactions;

  static const List<String> reactionEmojis = ['👏', '❤️', '😂', '🔥', '🏆'];

  IconicMoment({
    required this.id,
    required this.studentName,
    required this.batch,
    required this.title,
    required this.story,
    required this.category,
    required this.badgeEmoji,
    Map<String, int>? reactions,
  }) : reactions = reactions ?? {for (var e in reactionEmojis) e: 0};

  Map<String, dynamic> toMap() => {
        'id': id,
        'studentName': studentName,
        'batch': batch,
        'title': title,
        'story': story,
        'category': category,
        'badgeEmoji': badgeEmoji,
        'reactions': reactions,
      };

  factory IconicMoment.fromMap(Map<String, dynamic> map) {
    final rawReactions = map['reactions'] as Map<String, dynamic>?;
    final Map<String, int> rx = {
      for (var e in reactionEmojis) e: (rawReactions != null && rawReactions[e] != null) ? (rawReactions[e] as num).toInt() : 0,
    };

    return IconicMoment(
      id: map['id'] ?? '',
      studentName: map['studentName'] ?? '',
      batch: map['batch'] ?? '2013',
      title: map['title'] ?? '',
      story: map['story'] ?? '',
      category: map['category'] ?? 'Campus',
      badgeEmoji: map['badgeEmoji'] ?? '✨',
      reactions: rx,
    );
  }
}

class IconicMomentsScreen extends StatefulWidget {
  const IconicMomentsScreen({super.key});

  @override
  State<IconicMomentsScreen> createState() => _IconicMomentsScreenState();
}

class _IconicMomentsScreenState extends State<IconicMomentsScreen> {
  static const String _storageKey = 'mdrs_iconic_moments_students_v3';
  static const String _userReactionsKey = 'mdrs_user_reacted_emojis_v3';

  List<IconicMoment> _moments = [];
  Set<String> _userReactedKeys = {};
  String _selectedFilter = 'All';

  final List<String> _filters = [
    'All',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    'Sports',
    'Hostel',
    'Pranks',
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Load user reaction set (records which emoji this user already reacted to)
      final savedReactions = prefs.getStringList(_userReactionsKey) ?? [];
      _userReactedKeys = savedReactions.toSet();

      // Load student added moments (no default moments)
      final raw = prefs.getString(_storageKey);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List;
        setState(() {
          _moments = decoded.map((e) => IconicMoment.fromMap(e)).toList();
        });
      } else {
        setState(() {
          _moments = [];
        });
      }
    } catch (_) {
      setState(() {
        _moments = [];
      });
    }
  }

  Future<void> _saveMoments() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final encoded = jsonEncode(_moments.map((e) => e.toMap()).toList());
      await prefs.setString(_storageKey, encoded);
    } catch (_) {}
  }

  Future<void> _saveUserReactions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_userReactionsKey, _userReactedKeys.toList());
    } catch (_) {}
  }

  void _onReact(IconicMoment moment, String emoji) {
    final key = '${moment.id}_$emoji';

    // Student can reply all 5 emojis, but each emoji only ONCE (no multiple replies of the same emoji)
    if (_userReactedKeys.contains(key)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('You have already reacted with $emoji to this moment!'),
          duration: const Duration(seconds: 1),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() {
      moment.reactions[emoji] = (moment.reactions[emoji] ?? 0) + 1;
      _userReactedKeys.add(key);
    });

    HapticFeedback.lightImpact();
    _saveMoments();
    _saveUserReactions();
  }

  void _showShareMomentDialog() {
    final nameCtrl = TextEditingController();
    final titleCtrl = TextEditingController();
    final storyCtrl = TextEditingController();
    String selectedBatch = '2013';
    String selectedCategory = 'Hostel';
    String selectedEmoji = '🏆';

    final emojis = ['🏆', '😂', '🔥', '🎭', '⚡', '✍️', '🌧️', '🌟'];
    final categories = ['Hostel', 'Sports', 'Pranks', 'Classroom', 'Cultural', 'Farewell'];
    final batches = ['2013', '2014', '2015', '2016', '2017', 'Alumni'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalCtx, setModalState) {
            return Container(
              padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(modalCtx).viewInsets.bottom + 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(28),
                  topRight: Radius.circular(28),
                ),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF8B1E3F).withAlpha(20),
                            shape: BoxShape.circle,
                          ),
                          child: const Text('✨', style: TextStyle(fontSize: 22)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Share Your Iconic Moment',
                                style: GoogleFonts.cinzel(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.primaryDeep,
                                ),
                              ),
                              Text(
                                'Share your story with all MDRS students!',
                                style: GoogleFonts.poppins(
                                  fontSize: 11.5,
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: Colors.grey),
                          onPressed: () => Navigator.pop(modalCtx),
                        ),
                      ],
                    ),
                    const Divider(height: 24),

                    // Student Name
                    Text(
                      'Your Name *',
                      style: GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: nameCtrl,
                      decoration: InputDecoration(
                        hintText: 'e.g. Ramesh Patil',
                        hintStyle: GoogleFonts.poppins(fontSize: 12.5, color: Colors.black38),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Batch Selector
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Batch *',
                                style: GoogleFonts.poppins(
                                    fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<String>(
                                    value: selectedBatch,
                                    isExpanded: true,
                                    items: batches
                                        .map((b) => DropdownMenuItem(
                                              value: b,
                                              child: Text('$b Batch', style: GoogleFonts.poppins(fontSize: 12.5)),
                                            ))
                                        .toList(),
                                    onChanged: (val) {
                                      if (val != null) setModalState(() => selectedBatch = val);
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Category *',
                                style: GoogleFonts.poppins(
                                    fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                              ),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFF8FAFC),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.grey.shade300),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<String>(
                                    value: selectedCategory,
                                    isExpanded: true,
                                    items: categories
                                        .map((c) => DropdownMenuItem(
                                              value: c,
                                              child: Text(c, style: GoogleFonts.poppins(fontSize: 12.5)),
                                            ))
                                        .toList(),
                                    onChanged: (val) {
                                      if (val != null) setModalState(() => selectedCategory = val);
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Badge Emoji Selection
                    Text(
                      'Choose Badge Emoji',
                      style: GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: emojis.map((e) {
                        final isPicked = selectedEmoji == e;
                        return GestureDetector(
                          onTap: () => setModalState(() => selectedEmoji = e),
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: isPicked ? const Color(0xFF8B1E3F).withAlpha(30) : const Color(0xFFF8FAFC),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isPicked ? const Color(0xFF8B1E3F) : Colors.grey.shade300,
                                width: isPicked ? 2 : 1,
                              ),
                            ),
                            child: Text(e, style: const TextStyle(fontSize: 18)),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 12),

                    // Title
                    Text(
                      'Moment Title *',
                      style: GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: titleCtrl,
                      decoration: InputDecoration(
                        hintText: 'e.g. Winning 1st Place at District Sports',
                        hintStyle: GoogleFonts.poppins(fontSize: 12.5, color: Colors.black38),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Story
                    Text(
                      'Your Story *',
                      style: GoogleFonts.poppins(fontSize: 12.5, fontWeight: FontWeight.w700, color: Colors.black87),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: storyCtrl,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Share what happened, who was there, and why it is unforgettable...',
                        hintStyle: GoogleFonts.poppins(fontSize: 12.5, color: Colors.black38),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.all(14),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          final name = nameCtrl.text.trim();
                          final title = titleCtrl.text.trim();
                          final story = storyCtrl.text.trim();

                          if (name.isEmpty || title.isEmpty || story.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Please fill all fields to share your iconic moment!'),
                                backgroundColor: Color(0xFFE11D48),
                              ),
                            );
                            return;
                          }

                          final newMoment = IconicMoment(
                            id: 'moment_${DateTime.now().millisecondsSinceEpoch}',
                            studentName: name,
                            batch: selectedBatch,
                            title: title,
                            story: story,
                            category: selectedCategory,
                            badgeEmoji: selectedEmoji,
                          );

                          setState(() {
                            _moments.insert(0, newMoment);
                          });
                          _saveMoments();

                          Navigator.pop(modalCtx);
                          HapticFeedback.mediumImpact();

                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Row(
                                children: [
                                  const Text('🎉 ', style: TextStyle(fontSize: 18)),
                                  Expanded(
                                    child: Text(
                                      'Your Iconic Moment is now live for all students to see!',
                                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600),
                                    ),
                                  ),
                                ],
                              ),
                              backgroundColor: const Color(0xFF059669),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF8B1E3F),
                          foregroundColor: Colors.white,
                          elevation: 3,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        icon: const Icon(Icons.send_rounded, size: 18),
                        label: Text(
                          'Publish Iconic Moment',
                          style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13.5),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  List<IconicMoment> get _filteredMoments {
    if (_selectedFilter == 'All') return _moments;
    if (['2013', '2014', '2015', '2016', '2017'].contains(_selectedFilter)) {
      return _moments.where((m) => m.batch == _selectedFilter).toList();
    }
    return _moments.where((m) => m.category.toLowerCase() == _selectedFilter.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    final displayed = _filteredMoments;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          'Iconic Moments',
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w800,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showShareMomentDialog,
        backgroundColor: const Color(0xFFF59E0B),
        foregroundColor: Colors.black,
        elevation: 4,
        icon: const Text('✨', style: TextStyle(fontSize: 18)),
        label: Text(
          'Share Your Moment',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w800, fontSize: 13),
        ),
      ),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          // Top Hero Card with Share Option
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4A0E1F), Color(0xFF8B1E3F), Color(0xFFB02A50)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4A0E1F).withAlpha(90),
                    blurRadius: 14,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(30),
                          shape: BoxShape.circle,
                        ),
                        child: const Text('🏆', style: TextStyle(fontSize: 24)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'MDRS Iconic Moments',
                              style: GoogleFonts.poppins(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            Text(
                              'Share your memorable school moments for all students to see!',
                              style: GoogleFonts.poppins(
                                color: Colors.white.withAlpha(210),
                                fontSize: 11.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Option Button: Share Your Iconic Moment
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      onPressed: _showShareMomentDialog,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF59E0B), // Radiant Amber
                        foregroundColor: Colors.black,
                        elevation: 3,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                      ),
                      icon: const Text('✨', style: TextStyle(fontSize: 16)),
                      label: Text(
                        'Share Your Iconic Moment',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.w800,
                          fontSize: 13.5,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Filter Chips
          if (_moments.isNotEmpty)
            SliverToBoxAdapter(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  children: _filters.map((filter) {
                    final isSelected = _selectedFilter == filter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(
                          filter == 'All'
                              ? '🌟 All Moments'
                              : (['2013', '2014', '2015', '2016', '2017'].contains(filter)
                                  ? '$filter Batch'
                                  : filter),
                          style: GoogleFonts.poppins(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: isSelected ? Colors.white : AppColors.primaryDeep,
                          ),
                        ),
                        selected: isSelected,
                        selectedColor: const Color(0xFF8B1E3F),
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isSelected ? const Color(0xFF8B1E3F) : Colors.grey.shade300,
                          ),
                        ),
                        onSelected: (val) {
                          setState(() => _selectedFilter = filter);
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 10)),

          // Moments Feed (Shows all students who shared)
          if (displayed.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFF59E0B).withAlpha(100), width: 2),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withAlpha(15),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Text('✨', style: TextStyle(fontSize: 48)),
                      ),
                      const SizedBox(height: 18),
                      Text(
                        'No Iconic Moments Yet',
                        style: GoogleFonts.cinzel(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: AppColors.primaryDeep,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Be the first student to add an unforgettable school moment! Tap the button above to share.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 12.5,
                          color: AppColors.textSecondary,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton.icon(
                        onPressed: _showShareMomentDialog,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF8B1E3F),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                        icon: const Text('✍️', style: TextStyle(fontSize: 16)),
                        label: Text(
                          'Add First Iconic Moment',
                          style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 80),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final item = displayed[index];
                    return _buildMomentCard(item);
                  },
                  childCount: displayed.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildMomentCard(IconicMoment moment) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1E4E8), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(12),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Student Header
            Row(
              children: [
                // Avatar badge
                Container(
                  width: 44,
                  height: 44,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF8B1E3F), Color(0xFFC026D3)],
                    ),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    moment.badgeEmoji,
                    style: const TextStyle(fontSize: 20),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        moment.studentName,
                        style: GoogleFonts.poppins(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w800,
                          color: Colors.black87,
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF8B1E3F).withAlpha(18),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${moment.batch} Batch',
                              style: GoogleFonts.poppins(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF8B1E3F),
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0284C7).withAlpha(18),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              moment.category,
                              style: GoogleFonts.poppins(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF0284C7),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              moment.title,
              style: GoogleFonts.cinzel(
                fontSize: 15.5,
                fontWeight: FontWeight.w800,
                color: AppColors.primaryDeep,
                height: 1.3,
              ),
            ),
            const SizedBox(height: 6),

            // Story
            Text(
              moment.story,
              style: GoogleFonts.poppins(
                fontSize: 12.5,
                color: const Color(0xFF334155),
                height: 1.5,
              ),
            ),
            const Divider(height: 20),

            // 5 Emoji Reactions Bar (Student can reply all 5 emojis, each once only!)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: IconicMoment.reactionEmojis.map((emoji) {
                final key = '${moment.id}_$emoji';
                final isReacted = _userReactedKeys.contains(key);
                final count = moment.reactions[emoji] ?? 0;

                return InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () => _onReact(moment, emoji),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: isReacted ? const Color(0xFF8B1E3F).withAlpha(20) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isReacted ? const Color(0xFF8B1E3F) : Colors.grey.shade200,
                        width: isReacted ? 1.5 : 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(emoji, style: const TextStyle(fontSize: 15)),
                        const SizedBox(width: 4),
                        Text(
                          '$count',
                          style: GoogleFonts.poppins(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: isReacted ? const Color(0xFF8B1E3F) : Colors.black87,
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
      ),
    );
  }
}
