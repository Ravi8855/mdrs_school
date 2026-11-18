import 'dart:async';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../main_shell.dart';

class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key});

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _IntroScreenState extends State<IntroScreen>
    with TickerProviderStateMixin {
  late AnimationController _entryController;
  late AnimationController _ambientController;
  late AnimationController _progressController;

  late Animation<double> _bgZoom;
  late Animation<double> _emblemScale;
  late Animation<double> _emblemFade;
  late Animation<double> _titleFade;
  late Animation<Offset> _titleSlide;
  late Animation<double> _detailsFade;
  late Animation<Offset> _detailsSlide;
  late Animation<double> _footerFade;

  Timer? _autoNavTimer;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();

    _entryController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    );

    _ambientController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 4200),
    );

    _bgZoom = Tween<double>(begin: 1.0, end: 1.10).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeOut),
    );

    _emblemFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.0, 0.42, curve: Curves.easeOut),
      ),
    );
    _emblemScale = Tween<double>(begin: 0.78, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.0, 0.50, curve: Curves.easeOutBack),
      ),
    );

    _titleFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.24, 0.65, curve: Curves.easeOut),
      ),
    );
    _titleSlide =
        Tween<Offset>(begin: const Offset(0, 0.22), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.24, 0.68, curve: Curves.easeOutCubic),
      ),
    );

    _detailsFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.45, 0.85, curve: Curves.easeOut),
      ),
    );
    _detailsSlide =
        Tween<Offset>(begin: const Offset(0, 0.18), end: Offset.zero).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.45, 0.85, curve: Curves.easeOutCubic),
      ),
    );

    _footerFade = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _entryController,
        curve: const Interval(0.62, 1.0, curve: Curves.easeIn),
      ),
    );

    _entryController.forward();
    _progressController.forward();

    _autoNavTimer = Timer(const Duration(milliseconds: 4300), _goToMain);
  }

  void _goToMain() {
    if (!mounted || _hasNavigated) return;
    _hasNavigated = true;
    _autoNavTimer?.cancel();

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 650),
        pageBuilder: (context, animation, secondaryAnimation) =>
            const MainShell(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    );
  }

  @override
  void dispose() {
    _autoNavTimer?.cancel();
    _entryController.dispose();
    _ambientController.dispose();
    _progressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryDeep,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Subtle Ken-Burns Campus Photo Background
          AnimatedBuilder(
            animation: _bgZoom,
            builder: (context, child) {
              return Transform.scale(
                scale: _bgZoom.value,
                child: child,
              );
            },
            child: Image.asset(
              'assets/images/college.jpg',
              fit: BoxFit.cover,
              alignment: Alignment.center,
              errorBuilder: (context, error, stackTrace) =>
                  Container(color: AppColors.primaryDeep),
            ),
          ),

          // 2. Royal Midnight-Purple & Indigo Atmospheric Gradient Overlay
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                stops: const [0.0, 0.35, 0.70, 1.0],
                colors: [
                  const Color(0xFF170733).withAlpha(220),
                  const Color(0xFF280D58).withAlpha(185),
                  const Color(0xFF1B093C).withAlpha(232),
                  const Color(0xFF0F0424).withAlpha(252),
                ],
              ),
            ),
          ),

          // 3. Soft Ambient Luxury Light Orbs (Warm Gold & Vivid Violet)
          Positioned(
            top: -80,
            left: -70,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.primaryLight.withAlpha(65),
                    AppColors.primaryLight.withAlpha(0),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: 110,
            right: -90,
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.gold.withAlpha(42),
                    AppColors.gold.withAlpha(0),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: -90,
            left: 30,
            right: 30,
            child: Container(
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.primary.withAlpha(75),
                    AppColors.primary.withAlpha(0),
                  ],
                ),
              ),
            ),
          ),

          // 4. Main Foreground Content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                children: [
                  // Top Bar: Heritage Tag + Refined Skip Pill
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withAlpha(18),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: AppColors.gold.withAlpha(85),
                                width: 0.9,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.auto_awesome_rounded,
                                  size: 13,
                                  color: AppColors.gold,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'CAMPUS PORTAL',
                                  style: GoogleFonts.poppins(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 1.4,
                                    color: Colors.white.withAlpha(235),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(22),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                          child: Material(
                            color: Colors.white.withAlpha(24),
                            child: InkWell(
                              onTap: _goToMain,
                              borderRadius: BorderRadius.circular(22),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 7,
                                ),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(22),
                                  border: Border.all(
                                    color: Colors.white.withAlpha(55),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Skip',
                                      style: GoogleFonts.poppins(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white.withAlpha(240),
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 14,
                                      color: AppColors.gold,
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const Spacer(flex: 2),

                  // 5. Royal Medallion Portrait
                  AnimatedBuilder(
                    animation: Listenable.merge(
                        [_entryController, _ambientController]),
                    builder: (context, child) {
                      return Opacity(
                        opacity: _emblemFade.value,
                        child: Transform.scale(
                          scale: _emblemScale.value,
                          child: SizedBox(
                            width: 150,
                            height: 158,
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // Rotating Subtle Golden-Violet Aura Ring
                                Transform.rotate(
                                  angle: _ambientController.value * 2 * math.pi,
                                  child: Container(
                                    width: 138,
                                    height: 138,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      gradient: SweepGradient(
                                        colors: [
                                          AppColors.gold.withAlpha(210),
                                          AppColors.primaryLight.withAlpha(40),
                                          Colors.white.withAlpha(160),
                                          AppColors.primary.withAlpha(30),
                                          AppColors.gold.withAlpha(210),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                // Inner Dark Spacer Ring
                                Container(
                                  width: 132,
                                  height: 132,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color(0xFF1D0A3B),
                                  ),
                                ),
                                // Golden Framed Portrait
                                Container(
                                  width: 118,
                                  height: 118,
                                  padding: const EdgeInsets.all(3),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: const LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        Color(0xFFFDE68A),
                                        Color(0xFFF59E0B),
                                        Color(0xFFA855F7),
                                      ],
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppColors.gold.withAlpha(85),
                                        blurRadius: 28,
                                        spreadRadius: 2,
                                      ),
                                      BoxShadow(
                                        color: AppColors.primary.withAlpha(110),
                                        blurRadius: 36,
                                        spreadRadius: 4,
                                      ),
                                    ],
                                  ),
                                  child: ClipOval(
                                    child: Image.asset(
                                      'assets/images/desai.jpg',
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) =>
                                              Container(
                                        color: AppColors.primaryDark,
                                        child: const Icon(
                                          Icons.school_rounded,
                                          size: 48,
                                          color: AppColors.gold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                // Bottom Heritage Ribbon Badge
                                Positioned(
                                  bottom: 2,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xFFD97706),
                                          Color(0xFFFBBF24),
                                          Color(0xFFD97706),
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(14),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withAlpha(120),
                                          blurRadius: 8,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: Text(
                                      '★  MDRS LEGACY  ★',
                                      style: GoogleFonts.poppins(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 1.2,
                                        color: const Color(0xFF1E0A3C),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 26),

                  // 6. Metallic Gold & White Institutional Title
                  SlideTransition(
                    position: _titleSlide,
                    child: FadeTransition(
                      opacity: _titleFade,
                      child: Column(
                        children: [
                          ShaderMask(
                            shaderCallback: (bounds) => const LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.white,
                                Color(0xFFFEF3C7),
                                Color(0xFFFBBF24),
                              ],
                              stops: [0.0, 0.65, 1.0],
                            ).createShader(bounds),
                            child: Text(
                              'MDRS SCHOOL',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.cinzel(
                                fontSize: 33,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 4.0,
                                color: Colors.white,
                                height: 1.15,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Ornamental Gold Divider
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 54,
                                height: 1.2,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      AppColors.gold.withAlpha(0),
                                      AppColors.gold.withAlpha(210),
                                    ],
                                  ),
                                ),
                              ),
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 10),
                                child: Icon(
                                  Icons.school_rounded,
                                  size: 16,
                                  color: AppColors.gold,
                                ),
                              ),
                              Container(
                                width: 54,
                                height: 1.2,
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      AppColors.gold.withAlpha(210),
                                      AppColors.gold.withAlpha(0),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // 7. Full School Name, Location Pill & Motto
                  SlideTransition(
                    position: _detailsSlide,
                    child: FadeTransition(
                      opacity: _detailsFade,
                      child: Column(
                        children: [
                          Text(
                            'MORARJI DESAI RESIDENTIAL SCHOOL',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1.8,
                              color: const Color(0xFFEDE9FE),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Crisp Glassmorphic Location Pill
                          ClipRRect(
                            borderRadius: BorderRadius.circular(24),
                            child: BackdropFilter(
                              filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white.withAlpha(20),
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(
                                    color: Colors.white.withAlpha(40),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.location_on_rounded,
                                      size: 14,
                                      color: AppColors.gold,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Dorigudda Ukkenala, Shahapur • Yadgir',
                                      style: GoogleFonts.poppins(
                                        fontSize: 11.5,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.white.withAlpha(230),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 18),

                          Text(
                            'Knowledge  •  Discipline  •  Lifelong Bonds',
                            textAlign: TextAlign.center,
                            style: GoogleFonts.poppins(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w400,
                              fontStyle: FontStyle.italic,
                              letterSpacing: 0.8,
                              color: const Color(0xFFD8B4FE).withAlpha(215),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const Spacer(flex: 3),

                  // 8. Bottom Interactive Enter Button + Sleek Progress Bar
                  FadeTransition(
                    opacity: _footerFade,
                    child: Column(
                      children: [
                        // Direct Enter Button
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [
                                  AppColors.primary,
                                  Color(0xFF9333EA),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: Colors.white.withAlpha(50),
                                width: 1,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.primary.withAlpha(120),
                                  blurRadius: 20,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: _goToMain,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Enter Campus',
                                    style: GoogleFonts.poppins(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w600,
                                      letterSpacing: 0.6,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  const Icon(
                                    Icons.arrow_forward_rounded,
                                    size: 18,
                                    color: AppColors.gold,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 18),

                        // Sleek Animated Auto-Entry Progress Bar
                        AnimatedBuilder(
                          animation: _progressController,
                          builder: (context, child) {
                            return Column(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: Container(
                                    height: 3.5,
                                    width: 140,
                                    color: Colors.white.withAlpha(28),
                                    alignment: Alignment.centerLeft,
                                    child: FractionallySizedBox(
                                      widthFactor: _progressController.value,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          gradient: const LinearGradient(
                                            colors: [
                                              AppColors.primaryLight,
                                              AppColors.gold,
                                            ],
                                          ),
                                          borderRadius:
                                              BorderRadius.circular(4),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  'Official Alumni & Student Community',
                                  style: GoogleFonts.poppins(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w400,
                                    letterSpacing: 0.6,
                                    color: Colors.white.withAlpha(140),
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                      ],
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
