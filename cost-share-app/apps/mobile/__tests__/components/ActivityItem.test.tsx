import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityItem } from '../../components/ActivityItem';
import type { RecentActivity } from '@cost-share/shared';

const expenseActivity: RecentActivity = {
    id: 'a1',
    activityType: 'expense',
    groupId: 'g1',
    description: 'Coffee',
    amount: 5.5,
    currency: 'USD',
    userId: 'u1',
    userName: 'Alice',
    activityDate: new Date('2026-05-01'),
    createdAt: new Date(),
};

const settlementActivity: RecentActivity = {
    ...expenseActivity,
    id: 's1',
    activityType: 'settlement',
    description: 'Payment',
};

describe('ActivityItem', () => {
    it('renders the description and user name', () => {
        const { getByText } = render(<ActivityItem activity={expenseActivity} />);
        expect(getByText('Coffee')).toBeTruthy();
        expect(getByText(/Alice/)).toBeTruthy();
    });

    it('renders the amount with currency', () => {
        const { getByText } = render(<ActivityItem activity={expenseActivity} />);
        expect(getByText(/USD 5\.50/)).toBeTruthy();
    });

    it('renders the expense icon for expense activities', () => {
        const { getByText } = render(<ActivityItem activity={expenseActivity} />);
        expect(getByText('💰')).toBeTruthy();
    });

    it('renders the settlement icon for settlement activities', () => {
        const { getByText } = render(<ActivityItem activity={settlementActivity} />);
        expect(getByText('🤝')).toBeTruthy();
    });

    it('calls onPress with the activity when pressed', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <ActivityItem activity={expenseActivity} onPress={onPress} />
        );
        fireEvent.press(getByText('Coffee'));
        expect(onPress).toHaveBeenCalledWith(expenseActivity);
    });
});
