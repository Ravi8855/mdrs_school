import 'package:web/web.dart' as web;

web.HTMLAudioElement? _currentAudio;

void speakDialogue(String text, String lang, {String? teacherId}) {
  try {
    _currentAudio?.pause();
    _currentAudio = null;
  } catch (_) {}

  // 1. Play high-definition native voice recording
  if (teacherId != null && teacherId.isNotEmpty) {
    try {
      final audio = web.HTMLAudioElement();
      audio.src = 'assets/audio/$teacherId.mp3';
      audio.play();
      _currentAudio = audio;
      return;
    } catch (_) {}
  }

  // 2. Secondary fallback: Web Speech Synthesis
  try {
    final synth = web.window.speechSynthesis;
    synth.cancel();
    synth.resume();

    final u = web.SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.90;
    u.pitch = 1.05;

    final voices = synth.getVoices();
    final len = voices.length;
    for (var i = 0; i < len; i++) {
      final v = voices[i];
      final vLang = v.lang.toLowerCase();
      if (vLang.startsWith(lang.toLowerCase().substring(0, 2))) {
        u.voice = v;
        break;
      }
    }

    synth.speak(u);
  } catch (_) {}
}

void stopDialogue() {
  try {
    _currentAudio?.pause();
    _currentAudio = null;
  } catch (_) {}
  try {
    web.window.speechSynthesis.cancel();
  } catch (_) {}
}
