import 'package:flutter/services.dart';

void speakDialogue(String text, String lang, {String? teacherId}) {
  try {
    SystemSound.play(SystemSoundType.alert);
    HapticFeedback.mediumImpact();
  } catch (_) {}
}

void stopDialogue() {
  // Stub
}
