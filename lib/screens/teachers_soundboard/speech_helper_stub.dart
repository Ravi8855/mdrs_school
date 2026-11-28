import 'package:flutter/services.dart';
import 'package:flutter_tts/flutter_tts.dart';

final FlutterTts _flutterTts = FlutterTts();
bool _ttsInitialized = false;

Future<void> _initTts() async {
  if (_ttsInitialized) return;
  try {
    await _flutterTts.awaitSpeakCompletion(true);
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.48);
    _ttsInitialized = true;
  } catch (_) {}
}

void speakDialogue(String text, String lang) async {
  try {
    await _initTts();
    try {
      await _flutterTts.setLanguage(lang);
    } catch (_) {}

    try {
      SystemSound.play(SystemSoundType.alert);
      HapticFeedback.mediumImpact();
    } catch (_) {}

    await _flutterTts.speak(text);
  } catch (_) {
    try {
      SystemSound.play(SystemSoundType.click);
    } catch (_) {}
  }
}

void stopDialogue() async {
  try {
    await _flutterTts.stop();
  } catch (_) {}
}
