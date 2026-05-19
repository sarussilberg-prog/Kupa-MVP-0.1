import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
        ...actual,
        useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
        useRoute: () => ({ params: {} }),
        useFocusEffect: (cb: () => void) => cb(),
        useIsFocused: () => true,
    };
});

jest.mock('../../../services/auth.service', () => ({
    signOut: jest.fn(),
}));

jest.mock('../../../i18n', () => ({
    changeLanguage: jest.fn().mockResolvedValue(false),
}));

import { ProfileScreen } from '../../../screens/profile/ProfileScreen';
import { useAppStore } from '../../../store';
import { changeLanguage } from '../../../i18n';

const mockChangeLanguage = changeLanguage as jest.MockedFunction<typeof changeLanguage>;

beforeEach(() => {
    mockNavigate.mockClear();
    mockChangeLanguage.mockClear();
    useAppStore.setState({
        language: 'en',
        currentUser: {
            id: 'u1',
            email: 'a@x.com',
            name: 'Alice',
            defaultCurrency: 'USD',
            language: 'en',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
});

describe('ProfileScreen', () => {
    it('renders the user name and email', () => {
        const { getByText } = render(<ProfileScreen />);
        expect(getByText('Alice')).toBeTruthy();
        expect(getByText('a@x.com')).toBeTruthy();
    });

    it('calls changeLanguage when a language button is pressed', () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText('profile.hebrew'));
        expect(mockChangeLanguage).toHaveBeenCalledWith('he');
    });

    it('navigates to EditProfile on edit press', () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText('profile.editProfile'));
        expect(mockNavigate).toHaveBeenCalledWith('EditProfile');
    });
});
