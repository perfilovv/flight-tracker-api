import type { ConnectionStatus } from '@/shared/socket/useSocket';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

const config: Record<ConnectionStatus, { icon: React.ReactNode; label: string; color: string }> = {
  connected: { icon: <Wifi className='w-3 h-3' />, label: 'Live', color: 'text-green-500' },
  connecting: { icon: <Loader2 className='w-3 h-3 animate-spin' />, label: 'Подключение...', color: 'text-yellow-500' },
  disconnected: { icon: <WifiOff className='w-3 h-3' />, label: 'Нет соединения', color: 'text-gray-400' },
};

export function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const { icon, label, color } = config[status];

  return (
    <div className={`flex items-center gap-1.5 text-xs ${color}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

