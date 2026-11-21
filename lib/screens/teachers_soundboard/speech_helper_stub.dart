import 'package:flutter/services.dart';

void speakDialogue(String text, String lang) {
  try {
    SystemSound.play(SystemSoundType.click);
    HapticFeedback.heavyImpact();
  } catch (_) {}
}

void stopDialogue() {
  // Stub
}
