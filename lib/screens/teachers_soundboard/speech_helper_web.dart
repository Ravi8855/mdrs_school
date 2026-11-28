import 'package:web/web.dart' as web;
import 'dart:js_interop';

web.AudioContext? _audioCtx;

void _playWebChime() {
  try {
    _audioCtx ??= web.AudioContext();
    final ctx = _audioCtx!;
    if (ctx.state == 'suspended') {
      ctx.resume();
    }

    final now = ctx.currentTime;

    // Dual-tone school bell / teacher chime
    final osc1 = ctx.createOscillator();
    final osc2 = ctx.createOscillator();
    final gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now); // D6

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.46);
    osc2.stop(now + 0.46);
  } catch (_) {}
}

void speakDialogue(String text, String lang) {
  // 1. Play audible teacher chime immediately
  _playWebChime();

  // 2. Play Web Speech Synthesis
  try {
    final synth = web.window.speechSynthesis;
    synth.cancel();
    synth.resume();

    final u = web.SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92;
    u.pitch = 1.05;

    final voices = synth.getVoices();
    final len = voices.length;
    for (var i = 0; i < len; i++) {
      final v = voices[i];
      final vLang = v.lang.toLowerCase();
      final target = lang.toLowerCase();
      if (vLang.startsWith(target.substring(0, 2))) {
        u.voice = v;
        break;
      }
    }

    synth.speak(u);
  } catch (_) {}
}

void stopDialogue() {
  try {
    web.window.speechSynthesis.cancel();
  } catch (_) {}
}
