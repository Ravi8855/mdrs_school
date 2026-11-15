import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../data/models.dart';

class SupabaseService {
  static SupabaseClient? _client;
  static bool _initialized = false;

  // Supabase keys from environment or config
  static const String _supabaseUrl = String.fromEnvironment('SUPABASE_URL', defaultValue: '');
  static const String _supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');

  static Future<void> initialize() async {
    if (_supabaseUrl.isNotEmpty && _supabaseAnonKey.isNotEmpty) {
      try {
        await Supabase.initialize(
          url: _supabaseUrl,
          publishableKey: _supabaseAnonKey,
        );
        _client = Supabase.instance.client;
        _initialized = true;
        debugPrint('[MDRS] Supabase initialized successfully.');
      } catch (e) {
        debugPrint('[MDRS] Supabase initialization failed, running in local mode: $e');
      }
    } else {
      debugPrint('[MDRS] Supabase credentials not set, running in local fallback mode.');
    }
  }

  static bool get isConfigured => _initialized && _client != null;

  // Leaderboard
  static Future<List<LeaderboardEntry>> getLeaderboard() async {
    if (isConfigured) {
      try {
        final res = await _client!
            .from('bell_ring_leaderboard')
            .select()
            .order('score', ascending: false)
            .limit(10);
        return (res as List).map((e) => LeaderboardEntry.fromMap(e)).toList();
      } catch (e) {
        debugPrint('[MDRS] Supabase leaderboard fetch error: $e');
      }
    }

    // Local fallback
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('local_leaderboard');
    if (raw != null) {
      try {
        final list = jsonDecode(raw) as List;
        return list.map((e) => LeaderboardEntry.fromMap(e)).toList();
      } catch (_) {}
    }
    return [
      const LeaderboardEntry(name: "Viresh", score: 180),
      const LeaderboardEntry(name: "Hrutik", score: 160),
      const LeaderboardEntry(name: "Arun", score: 150),
      const LeaderboardEntry(name: "Ambadas", score: 140),
      const LeaderboardEntry(name: "Ravi", score: 120),
    ];
  }

  static Future<void> addScore(String name, int score) async {
    if (isConfigured) {
      try {
        await _client!.from('bell_ring_leaderboard').insert({
          'name': name,
          'score': score,
        });
        return;
      } catch (e) {
        debugPrint('[MDRS] Supabase add score error: $e');
      }
    }

    // Local fallback
    final prefs = await SharedPreferences.getInstance();
    final current = await getLeaderboard();
    final updated = List<LeaderboardEntry>.from(current)..add(LeaderboardEntry(name: name, score: score));
    updated.sort((a, b) => b.score.compareTo(a.score));
    await prefs.setString('local_leaderboard', jsonEncode(updated.take(20).map((e) => e.toMap()).toList()));
  }

  // Voting Submissions
  static Future<void> submitVote(String categoryId, String nomineeId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('voted_$categoryId', nomineeId);

    if (isConfigured) {
      try {
        await _client!.from('class_voting_ballots').insert({
          'category_id': categoryId,
          'nominee_id': nomineeId,
        });
      } catch (e) {
        debugPrint('[MDRS] Supabase vote submit error: $e');
      }
    }
  }

  static Future<String?> getVotedNominee(String categoryId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('voted_$categoryId');
  }

  // Feedback Submission
  static Future<bool> submitFeedback({
    required String name,
    required String role,
    required String message,
    required String moreMemories,
  }) async {
    if (isConfigured) {
      try {
        await _client!.from('feedback_submissions').insert({
          'name': name,
          'role': role,
          'message': message,
          'more_memories': moreMemories,
        });
        return true;
      } catch (e) {
        debugPrint('[MDRS] Supabase feedback submit error: $e');
      }
    }

    // Save locally
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList('local_feedback') ?? [];
    raw.add(jsonEncode({
      'name': name,
      'role': role,
      'message': message,
      'more_memories': moreMemories,
      'created_at': DateTime.now().toIso8601String(),
    }));
    await prefs.setStringList('local_feedback', raw);
    return true;
  }
}
