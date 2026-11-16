import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/app_colors.dart';
import 'screens/intro/intro_screen.dart';
import 'services/supabase_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Royal Purple status & navigation bars for immersive feel matching the new theme
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
      title: 'MDRS School',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const AppScrollBehavior(),
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        pageTransitionsTheme: const PageTransitionsTheme(
          builders: {
            TargetPlatform.android: CupertinoPageTransitionsBuilder(),
            TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
            TargetPlatform.windows: CupertinoPageTransitionsBuilder(),
          },
        ),
        colorScheme: const ColorScheme.light(
          primary: AppColors.primary,
          secondary: AppColors.accent,
          surface: AppColors.surface,
        ),
        textTheme: GoogleFonts.poppinsTextTheme(
          ThemeData(brightness: Brightness.light).textTheme,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primaryDeep,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: GoogleFonts.cinzel(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            fontSize: 19,
          ),
          iconTheme: const IconThemeData(color: Colors.white),
        ),
        cardTheme: CardThemeData(
          color: AppColors.surface,
          elevation: 2,
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
            // If running on a wide desktop browser, render inside a sleek purple smartphone frame
            if (constraints.maxWidth > 550) {
              return Scaffold(
                backgroundColor: const Color(0xFF140726),
                body: Center(
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 20),
                    width: 412,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(44),
                      border: Border.all(color: const Color(0xFF4C1D95), width: 9),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(220),
                          blurRadius: 50,
                          spreadRadius: 8,
                          offset: const Offset(0, 15),
                        ),
                        BoxShadow(
                          color: AppColors.primary.withAlpha(90),
                          blurRadius: 30,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(35),
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
                                  color: const Color(0xFF6D28D9),
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
