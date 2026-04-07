import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { getColors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { t } from '@/constants/i18n';

const NASA_LOGO =
  'https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg';

function validateEmail(email: string, lang: 'es' | 'en'): string | null {
  const str = t(lang).login;
  if (!email.trim()) return str.emailRequired;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return str.emailInvalid;
  return null;
}

function validatePassword(pw: string, lang: 'es' | 'en'): string | null {
  const str = t(lang).login;
  if (!pw) return str.passwordRequired;
  if (pw.length < 6) return str.passwordMin;
  return null;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const { isDarkMode, language } = usePreferences();
  const colors = getColors(isDarkMode);
  const insets = useSafeAreaInsets();
  const str = t(language).login;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passErr, setPassErr] = useState<string | null>(null);
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setLoginErr(null);
    const ev = validateEmail(email, language);
    const pv = validatePassword(password, language);
    setEmailErr(ev);
    setPassErr(pv);
    if (ev || pv) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = await login(email.toLowerCase().trim(), password, rememberMe);

    if (!result.success) {
      setLoginErr(str.invalidCredentials);
      setSubmitting(false);
    }
  };

  const clearErrors = () => {
    if (emailErr) setEmailErr(null);
    if (passErr) setPassErr(null);
    if (loginErr) setLoginErr(null);
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.form}>
          <View style={s.logoWrap}>
            <Image source={{ uri: NASA_LOGO }} style={s.logo} contentFit="contain" />
          </View>

          <Text style={[s.title, { color: colors.text }]}>{str.title}</Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>{str.subtitle}</Text>

          {loginErr && (
            <View style={[s.errorBanner, { backgroundColor: colors.errorBg, borderColor: colors.errorBorder }]}>
              <Text style={[s.errorBannerText, { color: colors.error }]}>{loginErr}</Text>
            </View>
          )}

          <View style={[s.inputCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <View style={s.field}>
              <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>{str.email}</Text>
              <TextInput
                style={[s.fieldInput, { color: colors.text }]}
                value={email}
                onChangeText={(v) => { setEmail(v); clearErrors(); }}
                placeholder={str.emailPlaceholder}
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!submitting}
              />
              {emailErr && <Text style={[s.fieldError, { color: colors.error }]}>{emailErr}</Text>}
            </View>

            <View style={[s.fieldSep, { backgroundColor: colors.separator }]} />

            <View style={s.field}>
              <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>{str.password}</Text>
              <TextInput
                style={[s.fieldInput, { color: colors.text }]}
                value={password}
                onChangeText={(v) => { setPassword(v); clearErrors(); }}
                placeholder={str.passwordPlaceholder}
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                autoComplete="password"
                editable={!submitting}
              />
              {passErr && <Text style={[s.fieldError, { color: colors.error }]}>{passErr}</Text>}
            </View>
          </View>

          <View style={s.rememberRow}>
            <Text style={[s.rememberLabel, { color: colors.text }]}>{str.rememberMe}</Text>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: colors.border, true: '#34C759' }}
              thumbColor="#FFFFFF"
              disabled={submitting}
            />
          </View>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: colors.primary }, submitting && s.btnDisabled]}
            onPress={handleLogin}
            disabled={submitting}
            activeOpacity={0.75}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.primaryText} />
            ) : (
              <Text style={[s.btnText, { color: colors.primaryText }]}>{str.button}</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={[s.footer, { color: colors.textTertiary }]}>{str.footer}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  form: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl + 8 },
  logo: { width: 88, height: 88 },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSize.callout,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  errorBanner: {
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  errorBannerText: { fontSize: FontSize.footnote, fontWeight: '500' },
  inputCard: {
    borderRadius: BorderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  field: {
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: 12,
  },
  fieldLabel: {
    fontSize: FontSize.caption,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  fieldInput: {
    fontSize: FontSize.body,
    padding: 0,
    margin: 0,
    height: 22,
  },
  fieldSep: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.md,
  },
  fieldError: {
    fontSize: FontSize.caption,
    marginTop: 5,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: 2,
  },
  rememberLabel: { fontSize: FontSize.body },
  btn: {
    height: 50,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontSize: FontSize.headline, fontWeight: '600' },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.caption,
    marginTop: Spacing.xxl,
    letterSpacing: 0.5,
  },
});
