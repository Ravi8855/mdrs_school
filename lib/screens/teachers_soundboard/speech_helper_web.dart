import 'dart:js_interop';

@JS('eval')
external JSAny? _eval(String code);

void speakDialogue(String text, String lang) {
  try {
    final sanitized = text
        .replaceAll('\\', '\\\\')
        .replaceAll("'", "\\'")
        .replaceAll('"', '\\"')
        .replaceAll('\n', ' ')
        .replaceAll('\r', '');

    final script = """
      (function() {
        try {
          // 1. Play teacher bell/sound ping via Web Audio API
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') { ctx.resume(); }
            
            // Whistle/bell chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
          }
        } catch (e) {
          console.log('AudioContext error:', e);
        }

        // 2. Web Speech Synthesis with voice matching & GC protection
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            window.speechSynthesis.resume();

            const u = new SpeechSynthesisUtterance('$sanitized');
            u.lang = '$lang';
            u.rate = 0.90;
            u.pitch = 1.05;

            // Pick best matching voice
            const voices = window.speechSynthesis.getVoices();
            if (voices && voices.length > 0) {
              let voice = voices.find(v => v.lang.toLowerCase().startsWith('$lang'.toLowerCase().slice(0, 2)));
              if (!voice) {
                // Fallback to Indian English or Hindi or any Indian voice
                voice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi') || v.lang.startsWith('en'));
              }
              if (voice) {
                u.voice = voice;
              }
            }

            // Chrome GC workaround: keep reference on window
            window._mdrsCurrentUtterance = u;
            u.onend = function() { window._mdrsCurrentUtterance = null; };
            u.onerror = function() { window._mdrsCurrentUtterance = null; };

            setTimeout(function() {
              window.speechSynthesis.speak(u);
            }, 100);
          } catch (err) {
            console.warn('SpeechSynthesis error:', err);
          }
        }
      })();
    """;
    _eval(script);
  } catch (_) {}
}

void stopDialogue() {
  try {
    _eval("""
      (function() {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        window._mdrsCurrentUtterance = null;
      })();
    """);
  } catch (_) {}
}
