class Student {
  final String name;
  final String batch;
  final String? qualification;
  final String? college;
  final String? location;
  final String? image;

  const Student({
    required this.name,
    required this.batch,
    this.qualification,
    this.college,
    this.location,
    this.image,
  });
}

class Teacher {
  final String name;
  final String subject;
  final String image;
  final String? bio;

  const Teacher({
    required this.name,
    required this.subject,
    required this.image,
    this.bio,
  });
}

class HostelHouse {
  final String id;
  final String name;
  final String gender; // 'boys' or 'girls'
  final String houseMaster;
  final String houseLeader;
  final List<String> roommates;

  const HostelHouse({
    required this.id,
    required this.name,
    required this.gender,
    required this.houseMaster,
    required this.houseLeader,
    required this.roommates,
  });
}

class VotingNominee {
  final String id;
  final String name;

  const VotingNominee({
    required this.id,
    required this.name,
  });
}

class VotingCategory {
  final String id;
  final String emoji;
  final String title;
  final String subtitle;
  final List<VotingNominee> nominees;

  const VotingCategory({
    required this.id,
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.nominees,
  });
}

class AlumniMember {
  final String name;
  final String qual;
  final String? qualification;
  final String? collegeUniversity;
  final String? location;
  final String image;

  const AlumniMember({
    required this.name,
    required this.qual,
    this.qualification,
    this.collegeUniversity,
    this.location,
    required this.image,
  });
}

class LeaderboardEntry {
  final String name;
  final int score;

  const LeaderboardEntry({
    required this.name,
    required this.score,
  });

  factory LeaderboardEntry.fromMap(Map<String, dynamic> map) {
    return LeaderboardEntry(
      name: map['name']?.toString() ?? 'Anonymous',
      score: (map['score'] is num) ? (map['score'] as num).toInt() : 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'score': score,
    };
  }
}
