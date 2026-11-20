import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/app_colors.dart';
import 'screens/intro/intro_screen.dart';
import 'services/supabase_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Deep Obsidian Crimson status & navigation bars for immersive feel matching the new theme
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: AppColors.navBackground,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize Supabase (with fallback if keys not yet configured)
  await SupabaseService.initialize();

  runApp(const MdrsApp());
}

class AppScrollBehavior extends MaterialScrollBehavior {
  const AppScrollBehavior();

  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics());
  }

  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
        PointerDeviceKind.stylus,
      };
}

class MdrsApp extends StatelessWidget {
  const MdrsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MDRS',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const AppScrollBehavior(),
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: CupertinoPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
            TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
          },
        ),
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.accent,
          surface: AppColors.surface,
          surfaceTint: Colors.transparent,
        ),
        textTheme: GoogleFonts.poppinsTextTheme(
          ThemeData(brightness: Brightness.dark).textTheme,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primaryDeep,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: GoogleFonts.cinzel(
            color: AppColors.chromeSilver,
            fontWeight: FontWeight.w700,
            fontSize: 19,
          ),
          iconTheme: const IconThemeData(color: AppColors.chromeSilver),
        ),
        cardTheme: CardThemeData(
          color: AppColors.surface,
          elevation: 3,
          shadowColor: AppColors.cardShadow,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.cardBorder, width: 0.8),
          ),
        ),
      ),
      builder: (context, child) {
        return LayoutBuilder(
          builder: (context, constraints) {
            // If running on a wide desktop browser, render inside a sleek obsidian ruby smartphone frame
            if (constraints.maxWidth > 550) {
              return Scaffold(
                backgroundColor: const Color(0xFF070002),
                body: Center(
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 20),
                    width: 412,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(44),
                      border: Border.all(color: const Color(0xFF4A040F), width: 8),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(240),
                          blurRadius: 50,
                          spreadRadius: 8,
                          offset: const Offset(0, 15),
                        ),
                        BoxShadow(
                          color: AppColors.primary.withAlpha(90),
                          blurRadius: 32,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(36),
                      child: Stack(
                        children: [
                          child ?? const SizedBox(),
                          // Mobile speaker notch at top
                          Positioned(
                            top: 8,
                            left: 0,
                            right: 0,
                            child: Center(
                              child: Container(
                                width: 72,
                                height: 5,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF7F1D1D),
                                  borderRadius: BorderRadius.circular(3),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }
            // Real mobile device: take full native screen
            return child ?? const SizedBox();
          },
        );
      },
      home: const IntroScreen(),
    );
  }
}
