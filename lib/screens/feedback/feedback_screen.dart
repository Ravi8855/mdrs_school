import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/app_colors.dart';
import '../../services/supabase_service.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _messageController = TextEditingController();
  final _memoriesController = TextEditingController();

  String _selectedRole = "Alumni";
  bool _submitting = false;

  final List<String> _roles = ["Alumni", "Student", "Teacher", "Parent", "Visitor"];

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);
    await SupabaseService.submitFeedback(
      name: _nameController.text.trim(),
      role: _selectedRole,
      message: _messageController.text.trim(),
      moreMemories: _memoriesController.text.trim(),
    );
    setState(() => _submitting = false);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Thank you! Your feedback & memories were received ❤️"),
          backgroundColor: AppColors.success,
        ),
      );
      _nameController.clear();
      _messageController.clear();
      _memoriesController.clear();
    }
  }

  Future<void> _openWhatsApp() async {
    final name = _nameController.text.trim();
    final role = _selectedRole;
    final message = _messageController.text.trim();
    final memories = _memoriesController.text.trim();

    final buffer = StringBuffer();
    buffer.writeln("✨ *MDRS School - Feedback & Memories* ✨\n");
    if (name.isNotEmpty) {
      buffer.writeln("👤 *From:* $name ($role)");
    } else {
      buffer.writeln("👤 *Role:* $role");
    }
    if (message.isNotEmpty) {
      buffer.writeln("💬 *Feedback:* $message");
    }
    if (memories.isNotEmpty) {
      buffer.writeln("🏫 *Memories:* $memories");
    }
    if (name.isEmpty && message.isEmpty && memories.isEmpty) {
      buffer.writeln("Hello MDRS School! I would like to share my feedback.");
    }

    final text = Uri.encodeComponent(buffer.toString());
    const phone = "918855025560";
    final deepLink = Uri.parse("whatsapp://send?phone=$phone&text=$text");
    final webLink = Uri.parse("https://wa.me/$phone?text=$text");

    try {
      if (await canLaunchUrl(deepLink)) {
        await launchUrl(deepLink, mode: LaunchMode.externalApplication);
        return;
      }
    } catch (_) {}

    try {
      await launchUrl(webLink, mode: LaunchMode.externalApplication);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Could not open WhatsApp. Please check if WhatsApp is installed."),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _messageController.dispose();
    _memoriesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryDeep,
        title: Text(
          "Memories & Feedback",
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w700, fontSize: 18, color: Colors.white),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "SHARE YOUR WORDS",
                style: GoogleFonts.poppins(
                  color: AppColors.textViolet,
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.5,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                "Leave a thought, reconnect with friends, or suggest new features for our alumni app.",
                style: GoogleFonts.poppins(color: AppColors.textSecondary, fontSize: 13),
              ),
              const SizedBox(height: 20),

              // Name Field
              TextFormField(
                controller: _nameController,
                validator: (v) => v == null || v.trim().isEmpty ? "Please enter your name" : null,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: "Your Full Name *",
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Role Dropdown
              DropdownButtonFormField<String>(
                initialValue: _selectedRole,
                dropdownColor: AppColors.surface,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: "Your Role *",
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                ),
                items: _roles
                    .map((r) => DropdownMenuItem(value: r, child: Text(r)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedRole = v ?? "Alumni"),
              ),
              const SizedBox(height: 16),

              // Message Field
              TextFormField(
                controller: _messageController,
                maxLines: 4,
                validator: (v) => v == null || v.trim().isEmpty ? "Please enter your message" : null,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: InputDecoration(
                  labelText: "Your Message / Memory *",
                  labelStyle: const TextStyle(color: AppColors.textSecondary),
                  alignLabelWithHint: true,
                  filled: true,
                  fillColor: AppColors.surface,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.cardBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _submitting ? null : _submitForm,
                  icon: _submitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.send_rounded, color: Colors.white),
                  label: Text(
                    _submitting ? "Sending..." : "Submit Feedback",
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    elevation: 3,
                    shadowColor: AppColors.primary.withAlpha(100),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),

              const SizedBox(height: 14),
              Center(
                child: Text(
                  "— OR CHAT WITH US —",
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary.withAlpha(150),
                    letterSpacing: 1.2,
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // WhatsApp Send Feedback Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _openWhatsApp,
                  icon: const Icon(Icons.chat_bubble_rounded, color: Colors.white, size: 20),
                  label: Text(
                    "Send Feedback",
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF25D366), // WhatsApp Green
                    elevation: 3,
                    shadowColor: const Color(0xFF25D366).withAlpha(100),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
