import { Metadata } from 'next';
import MemberCenterClient from './MemberCenterClient';

export const metadata: Metadata = {
  title: '会员中心 - PlayNew.ai',
  description: 'PlayPass积分管理、每日签到、提交玩法、邀请好友',
};

export default function MemberCenterPage() {
  return <MemberCenterClient />;
}
