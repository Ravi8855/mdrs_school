enum StudentCategory {
  topper,
  wanted,
  backbencher;

  String get displayName {
    switch (this) {
      case StudentCategory.topper:
        return 'Toppers';
      case StudentCategory.wanted:
        return 'Wanted';
      case StudentCategory.backbencher:
        return 'Backbenchers';
    }
  }

  String get emoji {
    switch (this) {
      case StudentCategory.topper:
        return '🏆';
      case StudentCategory.wanted:
        return '🎯';
      case StudentCategory.backbencher:
        return '😎';
    }
  }
}

class StudentZoneEntry {
  final String id;
  final String name;
  final String batch;
  final StudentCategory category;
  final String tag;
  final String description;
  final String? image;
  final String? badge;
  final String? rankOrDetail;

  const StudentZoneEntry({
    required this.id,
    required this.name,
    this.batch = '2013',
    required this.category,
    required this.tag,
    required this.description,
    this.image,
    this.badge,
    this.rankOrDetail,
  });

  StudentZoneEntry copyWith({
    String? id,
    String? name,
    String? batch,
    StudentCategory? category,
    String? tag,
    String? description,
    String? image,
    String? badge,
    String? rankOrDetail,
  }) {
    return StudentZoneEntry(
      id: id ?? this.id,
      name: name ?? this.name,
      batch: batch ?? this.batch,
      category: category ?? this.category,
      tag: tag ?? this.tag,
      description: description ?? this.description,
      image: image ?? this.image,
      badge: badge ?? this.badge,
      rankOrDetail: rankOrDetail ?? this.rankOrDetail,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'batch': batch,
      'category': category.name,
      'tag': tag,
      'description': description,
      'image': image,
      'badge': badge,
      'rankOrDetail': rankOrDetail,
    };
  }

  factory StudentZoneEntry.fromMap(Map<String, dynamic> map) {
    return StudentZoneEntry(
      id: map['id']?.toString() ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: map['name']?.toString() ?? '',
      batch: map['batch']?.toString() ?? '2013',
      category: StudentCategory.values.firstWhere(
        (c) => c.name == map['category'],
        orElse: () => StudentCategory.topper,
      ),
      tag: map['tag']?.toString() ?? '',
      description: map['description']?.toString() ?? '',
      image: map['image']?.toString(),
      badge: map['badge']?.toString(),
      rankOrDetail: map['rankOrDetail']?.toString(),
    );
  }
}
