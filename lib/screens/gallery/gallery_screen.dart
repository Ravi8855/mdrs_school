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
  static const String _prefKey = 'mdrs_gallery_surprise_index_v2';
  int _surpriseIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadSavedIndex();
  }

  Future<void> _loadSavedIndex() async {
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

    // Current surprise photo to reveal
    final currentIdx = _surpriseIndex % photos.length;
    final currentImage = photos[currentIdx];

    // Advance to next photo (strictly no duplicates; cycles back to first after all finished)
    final nextIdx = (currentIdx + 1) % photos.length;
    setState(() {
      _surpriseIndex = nextIdx;
    });
    _saveIndex(nextIdx);

    _showSurpriseDialog(currentImage, currentIdx, photos.length);
  }

  void _showSurpriseDialog(String initialImage, int initialIndex, int totalPhotos) {
    String activeImage = initialImage;
    int activeIndex = initialIndex;

    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (dialogCtx, setDialogState) {
            return Dialog(
              backgroundColor: Colors.transparent,
              insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2C0A15), Color(0xFF4A1020), Color(0xFF1E050E)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF59E0B).withAlpha(160), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(160),
                      blurRadius: 24,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header Bar with celebration badge and close button
                    Row(
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
                              const Text('🎁 ', style: TextStyle(fontSize: 13)),
                              Text(
                                'SURPRISE PHOTO',
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withAlpha(25),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${activeIndex + 1} of $totalPhotos',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        IconButton(
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          icon: const Icon(Icons.close_rounded, color: Colors.white, size: 22),
                          onPressed: () => Navigator.of(dialogCtx).pop(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Surprise image container with zoom support
                    Flexible(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(18),
                        child: Container(
                          constraints: const BoxConstraints(maxHeight: 360),
                          decoration: BoxDecoration(
                            color: Colors.black.withAlpha(90),
                            border: Border.all(color: Colors.white.withAlpha(20)),
                          ),
                          child: InteractiveViewer(
                            minScale: 0.8,
                            maxScale: 3.5,
                            child: Image.asset(
                              activeImage,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => Container(
                                height: 200,
                                color: AppColors.surface,
                                alignment: Alignment.center,
                                child: const Icon(Icons.broken_image_rounded, color: Colors.white54, size: 48),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),

                    // Subtitle tag
                    Text(
                      '✨ MDRS Nostalgia Moment • No Duplicates',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        color: Colors.white.withAlpha(220),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Action buttons: Next Surprise & Close
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.of(dialogCtx).pop(),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white70,
                              side: BorderSide(color: Colors.white.withAlpha(50)),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: Text(
                              'Close',
                              style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton.icon(
                            onPressed: () {
                              final photos = StaticData.galleryPhotos;
                              final nextI = (activeIndex + 1) % photos.length;
                              setDialogState(() {
                                activeIndex = nextI;
                                activeImage = photos[nextI];
                              });
                              setState(() {
                                _surpriseIndex = (nextI + 1) % photos.length;
                              });
                              _saveIndex(_surpriseIndex);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF59E0B),
                              foregroundColor: Colors.black,
                              elevation: 2,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            icon: const Text('🎁', style: TextStyle(fontSize: 15)),
                            label: Text(
                              'Next Surprise',
                              style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13),
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
      },
    );
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
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 18, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // 🎁 Top Surprise Photo Card
          Container(
            margin: const EdgeInsets.fromLTRB(14, 12, 14, 8),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF5A0E23), Color(0xFF8B1E3F)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF5A0E23).withAlpha(80),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(30),
                        shape: BoxShape.circle,
                      ),
                      alignment: Alignment.center,
                      child: const Text('🎁', style: TextStyle(fontSize: 22)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Campus Nostalgia Surprise',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 14.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            'Tap button to reveal unseen photos in order!',
                            style: GoogleFonts.poppins(
                              color: Colors.white.withAlpha(210),
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton.icon(
                    onPressed: _onSurpriseClick,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B), // Vibrant Amber Gold
                      foregroundColor: Colors.black,
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                    icon: const Text('✨', style: TextStyle(fontSize: 16)),
                    label: Text(
                      'Click to see the surprise',
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w800,
                        fontSize: 13.5,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Showing photo ${_surpriseIndex % photos.length + 1} of ${photos.length} • Loops back when complete',
                  style: GoogleFonts.poppins(
                    color: Colors.white.withAlpha(200),
                    fontSize: 10.5,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),

          // Header for Photo Grid
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 6),
            child: Row(
              children: [
                Text(
                  'ALL CAMPUS PHOTOS',
                  style: GoogleFonts.poppins(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                  ),
                ),
                const Spacer(),
                Text(
                  '${photos.length} Memories',
                  style: GoogleFonts.poppins(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),

          // All Photos Grid
          Expanded(
            child: GridView.builder(
              physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 14),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 1.1,
              ),
              itemCount: photos.length,
              itemBuilder: (ctx, i) {
                final p = photos[i];
                return GestureDetector(
                  onTap: () => _openFullscreen(context, p),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.asset(
                          p,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: AppColors.surface,
                            child: const Icon(Icons.image, color: AppColors.primary),
                          ),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                Colors.black.withAlpha(90),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
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
