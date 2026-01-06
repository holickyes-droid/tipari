import { Investor } from '../../data/mockInvestors';
import { InvestorAvatar } from '../InvestorAvatar';

interface InvestorTableAvatarProps {
  investor: Investor;
}

export function InvestorTableAvatar({ investor }: InvestorTableAvatarProps) {
  return (
    <InvestorAvatar
      avatarType={investor.avatar}
      investorName={investor.name}
      investorType={investor.type}
      size="sm"
    />
  );
}
