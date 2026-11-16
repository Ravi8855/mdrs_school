import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/app_colors.dart';
import 'home/home_screen.dart';
import 'batches/batches_screen.dart';
import 'people/people_screen.dart';
import 'features/features_screen.dart';
import 'feedback/feedback_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    BatchesScreen(),
    PeopleScreen(),
    FeaturesScreen(),
    FeedbackScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF161616),
          border: const Border(
            top: BorderSide(color: Color(0x33EBB325), width: 0.8),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(120),
              blurRadius: 16,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            HapticFeedback.selectionClick();
            setState(() => _currentIndex = index);
          },
          backgroundColor: Colors.transparent,
          indicatorColor: AppColors.primary.withAlpha(50),
          elevation: 0,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined, color: AppColors.textSecondary),
              selectedIcon: Icon(Icons.home, color: AppColors.primary),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.groups_outlined, color: AppColors.textSecondary),
              selectedIcon: Icon(Icons.groups, color: AppColors.primary),
              label: 'Batches',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline, color: AppColors.textSecondary),
              selectedIcon: Icon(Icons.person, color: AppColors.primary),
              label: 'People',
            ),
            NavigationDestination(
              icon: Icon(Icons.grid_view_outlined, color: AppColors.textSecondary),
              selectedIcon: Icon(Icons.grid_view, color: AppColors.primary),
              label: 'Features',
            ),
            NavigationDestination(
              icon: Icon(Icons.chat_bubble_outline, color: AppColors.textSecondary),
              selectedIcon: Icon(Icons.chat_bubble, color: AppColors.primary),
              label: 'Feedback',
            ),
          ],
        ),
      ),
    );
  }
}
