import { useRouter } from 'expo-router';

import { AppScreen } from '@/components/ui/AppScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { useI18n } from '@/lib/i18n';

export default function NotFoundScreen() {
  const router = useRouter();
  const { t } = useI18n();
  return <AppScreen contentStyle={{ justifyContent: 'center' }}><EmptyState icon="wrong-location" title={t('notFound.title')} body={t('notFound.body')} action={t('common.back')} onAction={() => router.replace('/')} /></AppScreen>;
}
