# Implementation Plan: Complete Frontend Screen Flow Rebuild

## [Overview]

Complete rebuild of all frontend screens for the Kupa expense-sharing mobile app, creating a cohesive screen flow that aligns with the database architecture defined in DATABASE_ARCHITECTURE.md. This implementation will establish a comprehensive theme system, rebuild all screens from scratch following strict AI rules (NativeWind-only styling, full i18n support, RTL compatibility), and create a seamless user experience from authentication through expense management and settlement tracking.

### Visual Design Direction

**Color Palette:** Light blue primary theme — clean, airy, and gentle. The primary color shifts from the current `#3B82F6` (Blue 500) to a softer light blue palette:
- Primary: `#60A5FA` (Blue 400) — soft light blue
- Primary Dark: `#3B82F6` (Blue 500) — for pressed/active states
- Primary Light: `#93C5FD` (Blue 300) — for backgrounds, tints
- Primary Extra Light: `#DBEAFE` (Blue 100) — for subtle highlights, card accents
- Background: Clean white `#FFFFFF` with soft gray `#F8FAFC` secondary backgrounds

**Animation Philosophy:** Simple, gentle transitions that feel natural:
- **Screen transitions:** Use React Navigation's default `slide_from_right` for stack screens with slightly reduced duration (~250ms). No custom complex animations.
- **List items:** Subtle `FadeIn` on mount using `react-native-reanimated` `FadeIn.duration(300)` for list items appearing.
- **Button press:** Use React Native's `TouchableOpacity` with `activeOpacity={0.7}` for gentle press feedback.
- **Loading states:** Smooth fade-in/fade-out when loading completes (content appears with a gentle 200ms opacity transition).
- **Tab switching:** Default bottom tab animation (no custom override needed).
- **Pull-to-refresh:** Native pull-to-refresh with light blue accent color.
- **No heavy animations:** No spring physics, no complex gesture animations, no parallax. Keep it minimal and performant.

The rebuild addresses the current state where existing screens don't properly align with the database schema and violate several AI rules (inline styles, hardcoded colors, incomplete i18n). The new implementation will serve as the foundation for the MVP, with all screens following consistent patterns, proper service layer architecture, and complete adherence to the established conventions.

This is a ground-up rebuild that will replace all existing screens while preserving the existing service layer, components (LoadingIndicator, Toast, ConfirmDialog, CurrencyPicker), hooks (useLoading, useToast), and store structure. The focus is on creating a production-ready UI layer that properly consumes the backend API through the service layer.

## [Types]

No new types required - all necessary types already exist in `packages/shared/src/types/index.ts`.

The existing type system comprehensively covers:
- Core entities: User, Group, GroupMember, Expense, ExpenseSplit, Settlement
- View types: UserBalance, GroupSummary, DebtSummary, UserExpenseView, RecentActivity
- DTOs: CreateExpenseDto, CreateSettlementDto, CreateGroupDto, UpdateGroupDto, etc.
- Enums: GroupType, ExpenseCategory, PaymentMethod, Language, Currency
- API wrappers: ApiResponse<T>, PaginatedResponse<T>

All screens will use these existing types with proper TypeScript strict mode compliance.

## [Files]

### New Files to Create

**Theme System Files:**
- `cost-share-app/apps/mobile/theme/typography.ts` - Font sizes, weights, line heights
- `cost-share-app/apps/mobile/theme/spacing.ts` - Spacing scale constants
- `cost-share-app/apps/mobile/theme/shadows.ts` - Shadow definitions for elevation
- `cost-share-app/apps/mobile/theme/borderRadius.ts` - Border radius constants
- Update `cost-share-app/apps/mobile/theme/index.ts` - Export all theme modules

**New Screen Files (Complete Rebuild):**
- `cost-share-app/apps/mobile/screens/auth/LoginScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/groups/GroupsListScreen.tsx` - Replace GroupsScreen.tsx
- `cost-share-app/apps/mobile/screens/groups/GroupDetailScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/groups/CreateGroupScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/groups/EditGroupScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/groups/GroupMembersScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/expenses/ExpenseListScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/expenses/AddExpenseScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/expenses/EditExpenseScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/expenses/ExpenseDetailScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/balances/BalancesScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/balances/SettleUpScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/balances/SettlementHistoryScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/profile/ProfileScreen.tsx` - Replace existing
- `cost-share-app/apps/mobile/screens/profile/EditProfileScreen.tsx` - New screen
- `cost-share-app/apps/mobile/screens/activity/ActivityFeedScreen.tsx` - New screen (replaces HistoryScreen)

**New Component Files:**
- `cost-share-app/apps/mobile/components/GroupCard.tsx` - Reusable group list item
- `cost-share-app/apps/mobile/components/ExpenseCard.tsx` - Reusable expense list item
- `cost-share-app/apps/mobile/components/BalanceCard.tsx` - Reusable balance display
- `cost-share-app/apps/mobile/components/MemberAvatar.tsx` - User avatar component
- `cost-share-app/apps/mobile/components/EmptyState.tsx` - Reusable empty state component
- `cost-share-app/apps/mobile/components/ScreenHeader.tsx` - Consistent screen headers
- `cost-share-app/apps/mobile/components/Button.tsx` - Reusable button component
- `cost-share-app/apps/mobile/components/Input.tsx` - Reusable input component
- `cost-share-app/apps/mobile/components/CategoryPicker.tsx` - Expense category selector
- `cost-share-app/apps/mobile/components/MemberSelector.tsx` - Multi-select for group members
- `cost-share-app/apps/mobile/components/SplitTypeSelector.tsx` - Equal/unequal split selector
- `cost-share-app/apps/mobile/components/ActivityItem.tsx` - Activity feed item

### Files to Modify

**Navigation:**
- `cost-share-app/apps/mobile/navigation/AppNavigator.tsx` - Update all screen references, add new screens to stack navigators

**i18n Translation Files:**
- `cost-share-app/apps/mobile/i18n/locales/en.json` - Add all new translation keys
- `cost-share-app/apps/mobile/i18n/locales/he.json` - Add all new translation keys (Hebrew)

**Theme Export:**
- `cost-share-app/apps/mobile/theme/index.ts` - Export new theme modules

**Tailwind Configuration:**
- `cost-share-app/apps/mobile/tailwind.config.js` - Extend with custom theme values

### Files to Delete

- `cost-share-app/apps/mobile/screens/history/HistoryScreen.tsx` - Replaced by ActivityFeedScreen
- `cost-share-app/apps/mobile/screens/groups/GroupsScreen.tsx` - Replaced by GroupsListScreen

### Configuration Updates

**Tailwind Config** - Extend theme with custom values matching theme system:
```javascript
theme: {
  extend: {
    colors: { /* map from theme/colors.ts */ },
    fontSize: { /* map from theme/typography.ts */ },
    spacing: { /* map from theme/spacing.ts */ },
    borderRadius: { /* map from theme/borderRadius.ts */ },
    boxShadow: { /* map from theme/shadows.ts */ }
  }
}
```

## [Functions]

### New Functions (in new screens)

**GroupsListScreen.tsx:**
- `loadGroups(): Promise<void>` - Load user's groups from service
- `handleGroupPress(groupId: string): void` - Navigate to group detail
- `handleCreateGroup(): void` - Navigate to create group screen
- `handleRefresh(): Promise<void>` - Pull-to-refresh groups list

**GroupDetailScreen.tsx:**
- `loadGroupData(groupId: string): Promise<void>` - Load group, members, summary, balances
- `handleAddExpense(): void` - Navigate to add expense screen
- `handleViewBalances(): void` - Navigate to balances screen
- `handleViewMembers(): void` - Navigate to members screen
- `handleEditGroup(): void` - Navigate to edit group screen
- `handleDeleteGroup(): Promise<void>` - Soft delete group with confirmation

**CreateGroupScreen.tsx:**
- `handleCreateGroup(data: CreateGroupDto): Promise<void>` - Create group via service
- `handleMemberSelection(userIds: string[]): void` - Update selected members
- `validateForm(): boolean` - Validate group creation form

**EditGroupScreen.tsx:**
- `loadGroup(groupId: string): Promise<void>` - Load group data
- `handleUpdateGroup(data: UpdateGroupDto): Promise<void>` - Update group via service
- `handleCancel(): void` - Navigate back without saving

**GroupMembersScreen.tsx:**
- `loadMembers(groupId: string): Promise<void>` - Load group members
- `handleAddMember(): void` - Show member selection dialog
- `handleRemoveMember(userId: string): Promise<void>` - Remove member with confirmation

**AddExpenseScreen.tsx:**
- `handleCreateExpense(data: CreateExpenseDto): Promise<void>` - Create expense via service
- `handleSplitTypeChange(type: 'equal' | 'unequal'): void` - Toggle split type
- `calculateSplits(amount: number, members: string[]): ExpenseSplitInput[]` - Calculate equal splits
- `validateExpense(): boolean` - Validate expense form

**EditExpenseScreen.tsx:**
- `loadExpense(expenseId: string): Promise<void>` - Load expense data
- `handleUpdateExpense(data: UpdateExpenseDto): Promise<void>` - Update expense via service
- `handleDeleteExpense(): Promise<void>` - Soft delete expense with confirmation

**ExpenseDetailScreen.tsx:**
- `loadExpenseDetail(expenseId: string): Promise<void>` - Load expense with splits
- `handleEdit(): void` - Navigate to edit screen
- `handleDelete(): Promise<void>` - Delete expense with confirmation

**BalancesScreen.tsx:**
- `loadBalances(groupId: string): Promise<void>` - Load group balances
- `calculateSimplifiedDebts(balances: UserBalance[]): DebtSummary[]` - Simplify debts
- `handleSettleUp(debt: DebtSummary): void` - Navigate to settle up screen

**SettleUpScreen.tsx:**
- `handleCreateSettlement(data: CreateSettlementDto): Promise<void>` - Record settlement via service
- `validateSettlement(): boolean` - Validate settlement form

**SettlementHistoryScreen.tsx:**
- `loadSettlements(groupId: string): Promise<void>` - Load settlement history
- `renderSettlement(settlement: Settlement): ReactElement` - Render settlement item

**ProfileScreen.tsx:**
- `loadProfile(): Promise<void>` - Load user profile
- `handleLanguageChange(language: Language): Promise<void>` - Change language with restart prompt
- `handleEditProfile(): void` - Navigate to edit profile screen
- `handleLogout(): Promise<void>` - Sign out with confirmation

**EditProfileScreen.tsx:**
- `loadProfile(): Promise<void>` - Load current profile
- `handleUpdateProfile(data: UpdateProfileDto): Promise<void>` - Update profile via service
- `handleCancel(): void` - Navigate back without saving

**ActivityFeedScreen.tsx:**
- `loadActivity(): Promise<void>` - Load recent activity across all groups
- `handleActivityPress(activity: RecentActivity): void` - Navigate to detail screen
- `handleRefresh(): Promise<void>` - Pull-to-refresh activity feed

### Modified Functions (in existing files)

**AppNavigator.tsx:**
- Update all `<Stack.Screen>` components to reference new screen names
- Add new screens to Groups stack: EditGroup, GroupMembers, ExpenseDetail, EditExpense
- Add new screens to root stack: SettleUp, SettlementHistory, EditProfile
- Replace History tab with Activity tab

### Removed Functions

All functions in deleted screens (HistoryScreen.tsx, old GroupsScreen.tsx) will be removed.

## [Classes]

No class-based components - all screens use functional components with hooks.

All components follow the pattern:
```typescript
export function ScreenName() {
  const { t } = useTranslation();
  const { isLoading, startLoading, stopLoading } = useLoading();
  // ... component logic
  return <View>...</View>;
}
```

## [Dependencies]

One new dependency required for gentle list item fade-in animations.

**New dependency to install:**
- `react-native-reanimated` - For subtle FadeIn animations on list items and content transitions. If already installed via Expo, no action needed. Check with `npx expo install react-native-reanimated`.

**Already installed dependencies:**
- `react-native` - Core framework
- `expo` - Development platform
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `nativewind` - Tailwind CSS for React Native
- `react-i18next` - Internationalization
- `zustand` - State management
- `@supabase/supabase-js` - Backend integration
- `react-native-toast-message` - Toast notifications
- `@react-native-async-storage/async-storage` - Local storage

## [Testing]

### Test Setup

No testing framework is currently configured. Set up Jest + React Native Testing Library for automated unit tests.

**Dependencies to install (devDependencies):**
- `jest` - Test runner
- `@testing-library/react-native` - Component rendering and querying
- `@testing-library/jest-native` - Custom matchers for React Native
- `jest-expo` - Expo-compatible Jest preset
- `@types/jest` - TypeScript types for Jest

**Configuration files to create:**

**`cost-share-app/apps/mobile/jest.config.js`:**
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterSetup: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind)',
  ],
  moduleNameMapper: {
    '^@cost-share/shared$': '<rootDir>/../../packages/shared/src',
  },
};
```

**Add to `cost-share-app/apps/mobile/package.json` scripts:**
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Test Files to Create

**Directory structure:** `cost-share-app/apps/mobile/__tests__/`

**Screen Tests (rendering, logic, navigation):**
- `__tests__/screens/auth/LoginScreen.test.tsx`
- `__tests__/screens/groups/GroupsListScreen.test.tsx`
- `__tests__/screens/groups/GroupDetailScreen.test.tsx`
- `__tests__/screens/groups/CreateGroupScreen.test.tsx`
- `__tests__/screens/groups/EditGroupScreen.test.tsx`
- `__tests__/screens/groups/GroupMembersScreen.test.tsx`
- `__tests__/screens/expenses/AddExpenseScreen.test.tsx`
- `__tests__/screens/expenses/EditExpenseScreen.test.tsx`
- `__tests__/screens/expenses/ExpenseDetailScreen.test.tsx`
- `__tests__/screens/expenses/ExpenseListScreen.test.tsx`
- `__tests__/screens/balances/BalancesScreen.test.tsx`
- `__tests__/screens/balances/SettleUpScreen.test.tsx`
- `__tests__/screens/balances/SettlementHistoryScreen.test.tsx`
- `__tests__/screens/profile/ProfileScreen.test.tsx`
- `__tests__/screens/profile/EditProfileScreen.test.tsx`
- `__tests__/screens/activity/ActivityFeedScreen.test.tsx`

**Component Tests:**
- `__tests__/components/Button.test.tsx`
- `__tests__/components/Input.test.tsx`
- `__tests__/components/EmptyState.test.tsx`
- `__tests__/components/GroupCard.test.tsx`
- `__tests__/components/ExpenseCard.test.tsx`
- `__tests__/components/BalanceCard.test.tsx`
- `__tests__/components/MemberAvatar.test.tsx`
- `__tests__/components/CategoryPicker.test.tsx`
- `__tests__/components/MemberSelector.test.tsx`
- `__tests__/components/SplitTypeSelector.test.tsx`
- `__tests__/components/ActivityItem.test.tsx`

**Store Tests:**
- `__tests__/store/index.test.ts`

### Automated Test Coverage Per Screen

Each screen test file should cover the following categories:

**1. LoginScreen.test.tsx:**
- Renders app name and subtitle
- Renders Google sign-in button
- Shows loading indicator when signing in
- Displays error message on sign-in failure
- Calls `signInWithGoogle` service on button press
- Button is disabled during loading

**2. GroupsListScreen.test.tsx:**
- Renders list of groups from store
- Shows EmptyState when no groups exist
- Calls `fetchGroups` service on mount
- Shows LoadingIndicator while loading
- Navigates to GroupDetail on group press
- Navigates to CreateGroup on FAB/button press
- Pull-to-refresh triggers data reload
- Group cards display name, description, member count

**3. GroupDetailScreen.test.tsx:**
- Renders group name and description
- Displays member count, expense count, total spent stats
- Loads group data (group, members, summary, balances) on mount
- Shows LoadingIndicator while loading
- Renders recent expenses list (max 5)
- Shows empty state when no expenses
- "Add Expense" button navigates correctly
- "View Balances" button navigates correctly
- "Members" button navigates correctly
- "Edit" navigates to EditGroupScreen
- "Delete" shows confirmation dialog

**4. CreateGroupScreen.test.tsx:**
- Renders form fields: name, description, type, currency
- Validates required fields (name cannot be empty)
- Shows error for empty group name on submit
- Calls `createGroup` service with correct DTO on submit
- Shows loading state during creation
- Shows success toast on creation
- Shows error toast on failure
- Navigates back or to new group on success
- Cancel navigates back without saving

**5. EditGroupScreen.test.tsx:**
- Loads existing group data into form
- Pre-fills name, description, type, currency
- Validates required fields
- Calls `updateGroup` service with correct DTO
- Shows success/error toasts
- Cancel navigates back without saving

**6. GroupMembersScreen.test.tsx:**
- Renders list of group members
- Displays member avatars and names
- "Add Member" opens member selection
- "Remove Member" shows confirmation dialog
- Calls service to add/remove members
- Shows empty state if no members (edge case)

**7. AddExpenseScreen.test.tsx:**
- Renders form fields: description, amount, currency, category, date, paidBy
- Validates required fields (description, amount > 0)
- Shows error for invalid amount (0, negative, non-numeric)
- Equal split calculates correctly (total / members)
- Unequal split validates sum equals total amount
- Calls `createExpense` service with correct DTO on submit
- Shows loading state during creation
- Shows success/error toasts
- Navigates back on success

**8. EditExpenseScreen.test.tsx:**
- Loads existing expense data into form
- Pre-fills all fields
- Validates required fields
- Calls `updateExpense` service
- Delete button shows confirmation
- Calls `deleteExpense` service on confirm
- Shows success/error toasts

**9. ExpenseDetailScreen.test.tsx:**
- Displays expense description, amount, date
- Shows payer name
- Shows list of splits with amounts per person
- Shows category badge
- "Edit" navigates to EditExpenseScreen
- "Delete" shows confirmation dialog

**10. ExpenseListScreen.test.tsx:**
- Renders list of expenses for a group
- Shows EmptyState when no expenses
- Expense cards display description, amount, payer
- Navigates to ExpenseDetail on press
- Pull-to-refresh works
- Sorts by date (newest first)

**11. BalancesScreen.test.tsx:**
- Renders balance cards for each member
- Shows positive balance (owed to user) in green
- Shows negative balance (user owes) in red
- Shows zero balance as "settled up"
- Renders simplified debts section
- Shows "All settled up!" when no debts
- "Settle Up" button navigates to SettleUpScreen
- Settlement history link navigates correctly

**12. SettleUpScreen.test.tsx:**
- Renders form: from user, to user, amount, currency, payment method
- Pre-fills from/to users and amount from navigation params
- Validates amount > 0
- Validates from_user !== to_user
- Calls `createSettlement` service on submit
- Shows loading state during creation
- Shows success/error toasts
- Navigates back on success

**13. SettlementHistoryScreen.test.tsx:**
- Renders list of settlements for a group
- Shows EmptyState when no settlements
- Displays from/to users, amount, date, payment method
- Sorts by date (newest first)

**14. ProfileScreen.test.tsx:**
- Displays user name and email
- Displays user avatar (or placeholder)
- Language toggle buttons render correctly
- Active language button is highlighted
- Calls `changeLanguage` on language button press
- Shows restart prompt for RTL direction change
- "Edit Profile" navigates to EditProfileScreen
- "Logout" button shows confirmation dialog
- Calls `signOut` service on logout confirm

**15. EditProfileScreen.test.tsx:**
- Loads current profile data
- Pre-fills name, email, phone, currency fields
- Validates required fields (name)
- Calls `updateProfile` service on save
- Cancel navigates back without saving
- Shows success/error toasts

**16. ActivityFeedScreen.test.tsx:**
- Renders list of recent activities across all groups
- Shows expense activities with description and amount
- Shows settlement activities with from/to users
- Shows EmptyState when no activity
- Navigates to relevant screen on activity press
- Pull-to-refresh works
- Shows activity type indicator (expense vs settlement)

### Component Tests

**Button.test.tsx:**
- Renders with correct text
- Calls onPress handler when pressed
- Shows loading indicator when loading prop is true
- Disabled state prevents press
- Renders primary/secondary/outline variants correctly
- activeOpacity is 0.7

**Input.test.tsx:**
- Renders with placeholder text
- Handles text change
- Shows error message when error prop provided
- Handles onSubmitEditing
- Disabled state

**EmptyState.test.tsx:**
- Renders icon, title, and message
- Renders optional action button
- Calls action handler when button pressed

**GroupCard.test.tsx:**
- Renders group name and description
- Shows member count
- Shows group type badge
- Calls onPress with group id

**ExpenseCard.test.tsx:**
- Renders expense description and amount
- Shows payer name
- Shows date formatted
- Shows category badge
- Calls onPress with expense id

**BalanceCard.test.tsx:**
- Renders user name and balance amount
- Shows green for positive, red for negative balance
- Shows "settled" state for zero balance

**Store Tests (index.test.ts):**
- setSession sets session and derives currentUser
- setSession(null) clears session and currentUser
- setGroups replaces groups array
- addGroup appends to groups array
- updateGroup replaces matching group
- removeGroup removes matching group
- setExpenses replaces expenses array
- addExpense appends to expenses array
- updateExpense replaces matching expense
- removeExpense removes matching expense
- setLanguage updates language

### Manual Testing Checklist

**Manual Testing Checklist:**
1. Test all screens in English (LTR)
2. Test all screens in Hebrew (RTL)
3. Test navigation flow between all screens
4. Test form validation on all input screens
5. Test error handling (network errors, validation errors)
6. Test loading states on all data-fetching screens
7. Test empty states (no groups, no expenses, no balances)
8. Test pull-to-refresh on list screens
9. Test confirmation dialogs (delete, logout)
10. Test theme consistency across all screens

### RTL Testing

For each screen, verify:
- [ ] Text aligns correctly (right-aligned in Hebrew)
- [ ] Layout mirrors properly (margins, padding flip)
- [ ] Navigation animations work correctly
- [ ] Icons flip where appropriate
- [ ] Forms display correctly
- [ ] Lists scroll correctly

### Theme Consistency Testing

Verify across all screens:
- [ ] Colors match theme/colors.ts
- [ ] Font sizes match theme/typography.ts
- [ ] Spacing matches theme/spacing.ts
- [ ] Shadows match theme/shadows.ts
- [ ] Border radius matches theme/borderRadius.ts
- [ ] No inline styles present
- [ ] No hardcoded colors present

### i18n Testing

Verify for all screens:
- [ ] All text uses t() function
- [ ] English translations complete
- [ ] Hebrew translations complete
- [ ] Translation keys follow naming convention
- [ ] No hardcoded strings present

## [Implementation Order]

### Phase 1: Theme System Foundation (Day 1)
1. Create `theme/typography.ts` with font scale
2. Create `theme/spacing.ts` with spacing constants
3. Create `theme/shadows.ts` with shadow definitions
4. Create `theme/borderRadius.ts` with radius constants
5. Update `theme/index.ts` to export all modules
6. Update `tailwind.config.js` to extend with theme values
7. Test theme imports in a sample component

### Phase 2: Reusable Components (Day 1-2)
8. Create `components/Button.tsx` - Primary, secondary, outline variants
9. Create `components/Input.tsx` - Text input with validation
10. Create `components/EmptyState.tsx` - Consistent empty states
11. Create `components/ScreenHeader.tsx` - Consistent headers
12. Create `components/MemberAvatar.tsx` - User avatar display
13. Create `components/GroupCard.tsx` - Group list item
14. Create `components/ExpenseCard.tsx` - Expense list item
15. Create `components/BalanceCard.tsx` - Balance display
16. Create `components/ActivityItem.tsx` - Activity feed item
17. Create `components/CategoryPicker.tsx` - Category selector
18. Create `components/MemberSelector.tsx` - Member multi-select
19. Create `components/SplitTypeSelector.tsx` - Split type toggle

### Phase 3: Authentication Flow (Day 2)
20. Rebuild `screens/auth/LoginScreen.tsx` with new theme
21. Add all auth translations to en.json and he.json
22. Test login flow in both languages
23. Test RTL layout for login screen

### Phase 4: Groups Flow (Day 3-4)
24. Rebuild `screens/groups/GroupsListScreen.tsx`
25. Rebuild `screens/groups/GroupDetailScreen.tsx`
26. Rebuild `screens/groups/CreateGroupScreen.tsx`
27. Create `screens/groups/EditGroupScreen.tsx`
28. Create `screens/groups/GroupMembersScreen.tsx`
29. Add all groups translations to en.json and he.json
30. Update AppNavigator.tsx with new group screens
31. Test complete groups flow (create, view, edit, delete)
32. Test RTL for all group screens

### Phase 5: Expenses Flow (Day 5-6)
33. Create `screens/expenses/ExpenseListScreen.tsx`
34. Rebuild `screens/expenses/AddExpenseScreen.tsx`
35. Create `screens/expenses/EditExpenseScreen.tsx`
36. Create `screens/expenses/ExpenseDetailScreen.tsx`
37. Add all expenses translations to en.json and he.json
38. Update AppNavigator.tsx with new expense screens
39. Test complete expenses flow (add, view, edit, delete)
40. Test split calculations (equal and unequal)
41. Test RTL for all expense screens

### Phase 6: Balances & Settlements Flow (Day 7)
42. Rebuild `screens/balances/BalancesScreen.tsx`
43. Create `screens/balances/SettleUpScreen.tsx`
44. Create `screens/balances/SettlementHistoryScreen.tsx`
45. Add all balances translations to en.json and he.json
46. Update AppNavigator.tsx with new balance screens
47. Test balance calculations
48. Test settlement flow
49. Test RTL for all balance screens

### Phase 7: Profile & Activity Flow (Day 8)
50. Rebuild `screens/profile/ProfileScreen.tsx`
51. Create `screens/profile/EditProfileScreen.tsx`
52. Create `screens/activity/ActivityFeedScreen.tsx` (replaces HistoryScreen)
53. Add all profile and activity translations to en.json and he.json
54. Update AppNavigator.tsx - replace History tab with Activity tab
55. Delete old `screens/history/HistoryScreen.tsx`
56. Test profile editing
57. Test language switching with restart prompt
58. Test activity feed across groups
59. Test RTL for profile and activity screens

### Phase 8: Test Setup & Automated Tests (Day 9-10)
60. Install test dependencies: `jest-expo`, `@testing-library/react-native`, `@testing-library/jest-native`, `@types/jest`
61. Create `jest.config.js` with Expo preset and module mappings
62. Create test setup file with mocks for navigation, i18n, store, and services
63. Write store unit tests (`__tests__/store/index.test.ts`)
64. Write component tests for Button, Input, EmptyState, GroupCard, ExpenseCard, BalanceCard
65. Write screen tests for LoginScreen, GroupsListScreen, GroupDetailScreen
66. Write screen tests for CreateGroupScreen, EditGroupScreen, GroupMembersScreen
67. Write screen tests for AddExpenseScreen, EditExpenseScreen, ExpenseDetailScreen, ExpenseListScreen
68. Write screen tests for BalancesScreen, SettleUpScreen, SettlementHistoryScreen
69. Write screen tests for ProfileScreen, EditProfileScreen, ActivityFeedScreen
70. Run full test suite and fix any failures

### Phase 9: Navigation Integration (Day 11)
71. Update all navigation references in AppNavigator.tsx
72. Ensure all screen transitions work correctly
73. Test deep linking between screens
74. Test back navigation from all screens
75. Test tab navigation
76. Verify no broken navigation links

### Phase 11: Final Testing & Polish (Day 12)
77. Run complete manual test checklist (all screens, both languages)
78. Verify all screens follow AI rules (no inline styles, no hardcoded colors)
79. Verify all text uses i18n (no hardcoded strings)
80. Test all error scenarios (network errors, validation errors)
81. Test all loading states
82. Test all empty states
83. Verify theme consistency across all screens
84. Final RTL testing pass (all screens in Hebrew)
85. Performance testing (smooth scrolling, fast navigation)
86. Fix any remaining issues

### Phase 12: Documentation (Day 12)
87. Update README with new screen flow documentation
88. Document navigation structure
89. Document theme system usage
90. Document component library
91. Create screen flow diagram

---

## Summary

This implementation plan provides a complete rebuild of the frontend screen flow for the Kupa MVP expense-sharing app. The plan follows a logical progression from foundation (theme system) through reusable components, then screen-by-screen implementation organized by feature area (auth, groups, expenses, balances, profile, activity).

**Key Deliverables:**
- Comprehensive theme system (colors, typography, spacing, shadows, border radius)
- 19 reusable components for consistent UI
- 16 screens covering complete user journey
- Full i18n support (English and Hebrew)
- Complete RTL compatibility
- Strict adherence to AI rules (NativeWind only, no inline styles, no hardcoded values)
- Service layer integration for all data operations
- Proper error handling and loading states throughout

**Timeline:** 10 days for complete implementation and testing

**Success Criteria:**
- All screens follow AI rules (verified by checklist)
- All text translated (en.json and he.json complete)
- All screens work in RTL (Hebrew tested)
- All navigation flows work correctly
- All CRUD operations work through service layer
- Theme system used consistently across all screens
- No inline styles, no hardcoded colors, no hardcoded strings
