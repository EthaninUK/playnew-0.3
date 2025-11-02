'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useEffect } from 'react';

export function WalletConnectButton() {
  const { isConnected, isAuthenticating, authenticateWithWallet } = useWalletAuth();

  // 自动登录当钱包连接后
  useEffect(() => {
    if (isConnected && !isAuthenticating) {
      authenticateWithWallet();
    }
  }, [isConnected]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isAuthenticating}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    {isAuthenticating ? '登录中...' : '连接钱包登录'}
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button" variant="destructive">
                    切换网络
                  </Button>
                );
              }

              return (
                <div className="flex gap-2">
                  <Button
                    onClick={openChainModal}
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    {chain.hasIcon && (
                      <div className="w-4 h-4 mr-2">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} type="button" className="flex-1">
                    {account.displayName}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
