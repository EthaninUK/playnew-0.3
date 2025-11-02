'use client';

import { useEffect } from 'react';

interface TawkToWidgetProps {
  propertyId?: string;
  widgetId?: string;
}

export function TawkToWidget({
  propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID,
  widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID,
}: TawkToWidgetProps) {
  useEffect(() => {
    // 如果没有配置 Tawk.to ID，则不加载
    if (!propertyId || !widgetId) {
      console.warn('Tawk.to: Property ID or Widget ID not configured');
      return;
    }

    // 检查脚本是否已经加载
    if (window.Tawk_API) {
      return;
    }

    // 加载 Tawk.to 脚本
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // 添加到页面
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // 清理函数
    return () => {
      // 移除 Tawk.to 相关元素
      const tawkScript = document.querySelector(`script[src*="tawk.to"]`);
      if (tawkScript) {
        tawkScript.remove();
      }

      // 移除 Tawk.to widget iframe
      const tawkWidget = document.getElementById('tawk-bubble-container');
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, [propertyId, widgetId]);

  return null; // 这个组件不渲染任何内容，只是加载脚本
}

// 辅助函数 - 可以在其他组件中使用
export const tawkToHelpers = {
  // 打开聊天窗口
  maximize: () => {
    if (window.Tawk_API) {
      window.Tawk_API.maximize();
    }
  },

  // 最小化聊天窗口
  minimize: () => {
    if (window.Tawk_API) {
      window.Tawk_API.minimize();
    }
  },

  // 切换聊天窗口
  toggle: () => {
    if (window.Tawk_API) {
      window.Tawk_API.toggle();
    }
  },

  // 显示聊天按钮
  showWidget: () => {
    if (window.Tawk_API) {
      window.Tawk_API.showWidget();
    }
  },

  // 隐藏聊天按钮
  hideWidget: () => {
    if (window.Tawk_API) {
      window.Tawk_API.hideWidget();
    }
  },

  // 设置访客信息
  setAttributes: (attributes: {
    name?: string;
    email?: string;
    hash?: string;
  }) => {
    if (window.Tawk_API) {
      window.Tawk_API.setAttributes(attributes, (error: any) => {
        if (error) {
          console.error('Tawk.to setAttributes error:', error);
        }
      });
    }
  },

  // 添加标签
  addTag: (tag: string) => {
    if (window.Tawk_API) {
      window.Tawk_API.addTag(tag, (error: any) => {
        if (error) {
          console.error('Tawk.to addTag error:', error);
        }
      });
    }
  },

  // 添加事件
  addEvent: (event: string, metadata?: Record<string, any>) => {
    if (window.Tawk_API) {
      window.Tawk_API.addEvent(event, metadata, (error: any) => {
        if (error) {
          console.error('Tawk.to addEvent error:', error);
        }
      });
    }
  },
};

// TypeScript 类型声明
declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      showWidget: () => void;
      hideWidget: () => void;
      setAttributes: (attributes: any, callback?: (error: any) => void) => void;
      addTag: (tag: string, callback?: (error: any) => void) => void;
      addEvent: (event: string, metadata?: any, callback?: (error: any) => void) => void;
      onLoad?: () => void;
      onStatusChange?: (status: string) => void;
      onChatMaximized?: () => void;
      onChatMinimized?: () => void;
      onChatHidden?: () => void;
      onChatStarted?: () => void;
      onChatEnded?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}
