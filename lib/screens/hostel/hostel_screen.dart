import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/app_colors.dart';
import '../../data/static_data.dart';
import '../../data/models.dart';

class HostelScreen extends StatefulWidget {
  const HostelScreen({super.key});

  @override
  State<HostelScreen> createState() => _HostelScreenState();
}

class _HostelScreenState extends State<HostelScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final boysHouses = StaticData.hostelHouses.where((h) => h.gender == 'boys').toList();
    final girlsHouses = StaticData.hostelHouses.where((h) => h.gender == 'girls').toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(
          "Hostel Life",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 20),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 14),
          tabs: const [
            Tab(text: "Boys Hostel"),
            Tab(text: "Girls Hostel"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildHouseList(boysHouses, Colors.blueAccent),
          _buildHouseList(girlsHouses, Colors.pinkAccent),
        ],
      ),
    );
  }

  Widget _buildHouseList(List<HostelHouse> houses, Color accent) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: houses.length,
      itemBuilder: (ctx, i) {
        final house = houses[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.cardBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // House title row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(Icons.villa, color: accent, size: 24),
                      const SizedBox(width: 10),
                      Text(
                        house.name,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: accent.withAlpha(35),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "${house.roommates.length} Members",
                      style: GoogleFonts.poppins(
                        color: accent,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              // House Master & Leader
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "HOUSE MASTER",
                            style: GoogleFonts.poppins(
                              color: AppColors.textMuted,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            house.houseMaster,
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(height: 28, width: 1, color: AppColors.divider),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "HOUSE LEADER",
                            style: GoogleFonts.poppins(
                              color: AppColors.textMuted,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          Text(
                            house.houseLeader,
                            style: GoogleFonts.poppins(
                              color: AppColors.primary,
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),

              // Roommates Pills
              Text(
                "ROOMMATES",
                style: GoogleFonts.poppins(
                  color: AppColors.textMuted,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: house.roommates.map((name) {
                  final isLeader = name.trim().toLowerCase() == house.houseLeader.trim().toLowerCase();
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isLeader ? AppColors.primary.withAlpha(40) : AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isLeader ? AppColors.primary : AppColors.divider,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (isLeader) ...[
                          const Icon(Icons.star, color: AppColors.primary, size: 12),
                          const SizedBox(width: 4),
                        ],
                        Text(
                          name,
                          style: GoogleFonts.poppins(
                            color: isLeader ? AppColors.primary : Colors.white,
                            fontSize: 12,
                            fontWeight: isLeader ? FontWeight.w700 : FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        );
      },
    );
  }
}
