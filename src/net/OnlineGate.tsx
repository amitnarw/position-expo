import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { ChevronRight } from 'lucide-react-native';

export function OnlineGate({ online, onRetry }: { online: boolean | null; onRetry: () => void }) {
  if (online === null) {
    return (
      <Screen edges={['top', 'bottom', 'left', 'right']} padded>
        <View className="flex-1 items-center justify-center pt-10">
          <ActivityIndicator size="large" color="#B25E45" />
          <AppText variant="small" className="mt-4 tone muted">
            Checking connection…
          </AppText>
        </View>
      </Screen>
    );
  }

  if (online) {
    return null;
  }

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']} padded>
      <View className="flex-1 items-center justify-center py-24">
        <View className="h-16 w-16 rounded-full bg-clay flex items-center justify-center mb-8">
          <ChevronRight size={28} color="#FFF" strokeWidth={2} />
        </View>
        <AppText variant="title" className="text-center mb-4">
          No internet
        </AppText>
        <AppText variant="body" className="text-center max-w-[320px] mb-8">
          FORMA needs an internet connection to load plates and guides. Check your connection and try
          again.
        </AppText>
        <Button
          label="Try again"
          size="md"
          onPress={onRetry}
          className="w-[200px]"
        />
        <Rule className="mt-12 mb-4 w-[200px]" />
        <AppText variant="small" className="text-center">
          Local data (favourites, history, settings) still works offline — just not while we are
          verifying the connection.
        </AppText>
      </View>
    </Screen>
  );
}
