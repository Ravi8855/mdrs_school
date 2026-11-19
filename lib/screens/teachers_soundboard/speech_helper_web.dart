import 'dart:js_interop';

@JS('eval')
external JSAny? _eval(String code);

void speakDialogue(String text, String lang) {
  try {
    final sanitized = text.replaceAll("'", "\\'").replaceAll('\n', ' ');
    final script = """
      (function() {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance('$sanitized');
          u.lang = '$lang';
          u.rate = 0.92;
          u.pitch = 1.05;
          window.speechSynthesis.speak(u);
        }
      })();
    """;
    _eval(script);
  } catch (_) {}
}

void stopDialogue() {
  try {
    _eval("if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); }");
  } catch (_) {}
}

void triggerMicPermission() {
  try {
    final script = """
      (function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
            console.log('MDRS Mic active');
            setTimeout(function() {
              stream.getTracks().forEach(function(t) { t.stop(); });
            }, 3000);
          }).catch(function(err) {
            console.warn('Mic access denied:', err);
          });
        }
      })();
    """;
    _eval(script);
  } catch (_) {}
}
