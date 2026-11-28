import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  static const String _prefKey = 'mdrs_gallery_surprise_index_v3';
  int _surpriseIndex = 0;
  String? _revealedPhoto;
  int? _revealedIndex;

  @override
  void initState() {
    super.initState();
    _loadSavedState();
  }

  Future<void> _loadSavedState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getInt(_prefKey) ?? 0;
      final photos = StaticData.galleryPhotos;
      if (mounted) {
        setState(() {
          _surpriseIndex = (photos.isNotEmpty && saved >= photos.length)
              ? 0
              : (saved < 0 ? 0 : saved);
        });
      }
    } catch (_) {}
  }

  Future<void> _saveIndex(int nextIndex) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt(_prefKey, nextIndex);
    } catch (_) {}
  }

  void _onSurpriseClick() {
    final photos = StaticData.galleryPhotos;
    if (photos.isEmpty) return;

    // Pick current photo in strict sequential order (no duplicates)
    final currentIdx = _surpriseIndex % photos.length;
    final photoToShow = photos[currentIdx];

    // Prepare next index (loops back to 0 once all 18 photos are shown)
    final nextIdx = (currentIdx + 1) % photos.length;

    setState(() {
      _revealedIndex = currentIdx;
      _revealedPhoto = photoToShow;
      _surpriseIndex = nextIdx;
    });

    _saveIndex(nextIdx);
  }

  @override
  Widget build(BuildContext context) {
    final photos = StaticData.galleryPhotos;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          "Campus Memories",
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w700,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child: Column(
            children: [
              // 🎁 Surprise Action Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF5A0E23), Color(0xFF8B1E3F)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF5A0E23).withAlpha(90),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(28),
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Text('🎁', style: TextStyle(fontSize: 22)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Campus Nostalgia Surprise',
                                style: GoogleFonts.poppins(
                                  color: Colors.white,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              Text(
                                'Tap to reveal one photo at a time • No duplicates!',
                                style: GoogleFonts.poppins(
                                  color: Colors.white.withAlpha(210),
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // ✨ The Main Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: _onSurpriseClick,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF59E0B), // Vibrant Amber Gold
                          foregroundColor: Colors.black,
                          elevation: 4,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(25),
                          ),
                        ),
                        icon: const Text('✨', style: TextStyle(fontSize: 18)),
                        label: Text(
                          _revealedPhoto == null
                              ? 'Click to see the surprise'
                              : 'Click for next surprise (${(_revealedIndex! + 1)} / ${photos.length})',
                          style: GoogleFonts.poppins(
                            fontWeight: FontWeight.w800,
                            fontSize: 14,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _revealedPhoto == null
                          ? 'Total ${photos.length} campus memories waiting to be unlocked'
                          : 'Memory ${(_revealedIndex! + 1)} of ${photos.length} unlocked • Loops back after completion',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        color: Colors.white.withAlpha(200),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 🖼️ The Display Area (Shows ONLY after click, strictly one at a time)
              if (_revealedPhoto == null) ...[
                // Mystery placeholder before first click
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: AppColors.primary.withAlpha(40),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withAlpha(15),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 76,
                        height: 76,
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7ED),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xFFF59E0B).withAlpha(120),
                            width: 2,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: const Text('🔒', style: TextStyle(fontSize: 34)),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Photos Are Hidden',
                        style: GoogleFonts.cinzel(
                          color: AppColors.primaryDeep,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Click the surprise button above to reveal one unseen school photo. No duplicate photos will be shown!',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          color: AppColors.textSecondary,
                          fontSize: 12.5,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // The Revealed Surprise Photo Card
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: const Color(0xFFF59E0B).withAlpha(140),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF8B1E3F).withAlpha(30),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: const BoxDecoration(
                          color: Color(0xFFFFFBEB),
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(22),
                            topRight: Radius.circular(22),
                          ),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF59E0B),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Text('🎁 ', style: TextStyle(fontSize: 12)),
                                  Text(
                                    'SURPRISE MEMORY',
                                    style: GoogleFonts.poppins(
                                      color: Colors.black,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Spacer(),
                            Text(
                              'Photo ${_revealedIndex! + 1} of ${photos.length}',
                              style: GoogleFonts.poppins(
                                color: AppColors.primaryDeep,
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // The Image
                      GestureDetector(
                        onTap: () => _openFullscreen(context, _revealedPhoto!),
                        child: Stack(
                          children: [
                            Container(
                              width: double.infinity,
                              constraints: const BoxConstraints(minHeight: 280, maxHeight: 420),
                              color: Colors.black,
                              child: InteractiveViewer(
                                minScale: 0.8,
                                maxScale: 4.0,
                                child: Image.asset(
                                  _revealedPhoto!,
                                  fit: BoxFit.contain,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    height: 260,
                                    color: AppColors.surface,
                                    alignment: Alignment.center,
                                    child: const Icon(Icons.broken_image_rounded, color: Colors.grey, size: 48),
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              right: 12,
                              bottom: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.black.withAlpha(160),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.fullscreen_rounded, color: Colors.white, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Tap to expand',
                                      style: GoogleFonts.poppins(
                                        color: Colors.white,
                                        fontSize: 11,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Card Footer with next action
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'MDRS Campus Memory',
                                    style: GoogleFonts.poppins(
                                      color: AppColors.primaryDeep,
                                      fontSize: 13.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  Text(
                                    'Pinch or double-tap image to zoom',
                                    style: GoogleFonts.poppins(
                                      color: AppColors.textMuted,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            ElevatedButton.icon(
                              onPressed: _onSurpriseClick,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF8B1E3F),
                                foregroundColor: Colors.white,
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              ),
                              icon: const Text('🎁', style: TextStyle(fontSize: 14)),
                              label: Text(
                                'Next Photo',
                                style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 12.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  void _openFullscreen(BuildContext context, String imagePath) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black,
            iconTheme: const IconThemeData(color: Colors.white),
            title: Text(
              'Memory ${_revealedIndex != null ? _revealedIndex! + 1 : 1} of ${StaticData.galleryPhotos.length}',
              style: GoogleFonts.poppins(color: Colors.white, fontSize: 14),
            ),
          ),
          body: Center(
            child: InteractiveViewer(
              minScale: 0.8,
              maxScale: 4.0,
              child: Image.asset(imagePath),
            ),
          ),
        ),
      ),
    );
  }
}

