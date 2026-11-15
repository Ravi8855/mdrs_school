import 'package:flutter_test/flutter_test.dart';
import 'package:mdrs_mobile_app/main.dart';

void main() {
  testWidgets('MDRS App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MdrsApp());
    expect(find.byType(MdrsApp), findsOneWidget);
  });
}
