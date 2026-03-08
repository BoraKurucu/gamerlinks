# Manual Testing Guide for Follow System

Since automated integration tests require Firebase configuration, here's a comprehensive manual testing guide to verify all scenarios work correctly.

## Prerequisites

1. Have at least 2 test accounts ready (or create them)
2. Access to the application
3. Browser developer tools open (to check for errors)

## Test Scenarios

### Scenario 1: Follow User (Logged In)

**Steps:**
1. Log in as User A
2. Navigate to User B's profile (`/view/usernameB`)
3. Verify "Follow" button is visible
4. Click "Follow" button
5. Verify button changes to "Unfollow"
6. Verify follower count on User B's profile increases
7. Verify following count on User A's profile increases

**Expected Results:**
- ✅ Follow button visible when logged in
- ✅ Button changes to "Unfollow" after clicking
- ✅ Counts update in real-time
- ✅ Toast message shows "Following!"

### Scenario 2: Unfollow User

**Steps:**
1. While logged in as User A, on User B's profile
2. Click "Unfollow" button
3. Verify button changes back to "Follow"
4. Verify follower count on User B's profile decreases
5. Verify following count on User A's profile decreases

**Expected Results:**
- ✅ Button changes to "Follow" after clicking
- ✅ Counts update in real-time
- ✅ Toast message shows "Unfollowed"

### Scenario 3: View Own Profile (Logged In)

**Steps:**
1. Log in as User A
2. Navigate to own profile (`/profile/usernameA`)
3. Verify "Follow" button is NOT visible
4. Verify "Home" button is visible (if on ViewProfile)
5. Verify follower/following counts are displayed
6. Click on follower count
7. Verify followers modal opens
8. Click on following count
9. Verify following modal opens

**Expected Results:**
- ✅ No follow button on own profile
- ✅ Home button visible (if applicable)
- ✅ Counts displayed correctly
- ✅ Modals open and display lists

### Scenario 4: View Profile (Not Logged In)

**Steps:**
1. Log out (or use incognito window)
2. Navigate to any user's profile (`/view/username`)
3. Verify "Follow" button is NOT visible
4. Verify "Home" button is NOT visible
5. Verify follower/following counts are displayed
6. Click on follower count
7. Verify followers modal opens
8. Click on following count
9. Verify following modal opens

**Expected Results:**
- ✅ No follow button when logged out
- ✅ No home button when logged out
- ✅ Counts still visible (public)
- ✅ Modals work even when logged out

### Scenario 5: Prevent Self-Follow

**Steps:**
1. Log in as User A
2. Try to navigate to own profile via `/view/usernameA`
3. Verify you're redirected or follow button is hidden
4. Try to manually create a follow relationship to yourself (via browser console if needed)

**Expected Results:**
- ✅ Cannot follow yourself
- ✅ Firestore rules prevent self-follow

### Scenario 6: Followers Modal

**Steps:**
1. Log in as User A
2. Navigate to User B's profile (who has followers)
3. Click on follower count
4. Verify modal opens
5. Verify list of followers is displayed
6. Verify each follower shows:
   - Avatar (or fallback)
   - Username
   - Bio (if available)
7. Click on a follower
8. Verify navigation to their profile
9. Close modal

**Expected Results:**
- ✅ Modal opens correctly
- ✅ List loads and displays
- ✅ Clicking profile navigates correctly
- ✅ Modal closes properly

### Scenario 7: Following Modal

**Steps:**
1. Log in as User A
2. Navigate to User B's profile (who is following others)
3. Click on following count
4. Verify modal opens
5. Verify list of following is displayed
6. Verify each following shows:
   - Avatar (or fallback)
   - Username
   - Bio (if available)
7. Click on a following
8. Verify navigation to their profile
9. Close modal

**Expected Results:**
- ✅ Modal opens correctly
- ✅ List loads and displays
- ✅ Clicking profile navigates correctly
- ✅ Modal closes properly

### Scenario 8: OwnerProfile Counts

**Steps:**
1. Log in as User A
2. Navigate to own profile (`/profile/usernameA`)
3. Verify follower count is displayed
4. Verify following count is displayed
5. Follow another user
6. Verify following count updates in real-time
7. Have another user follow you
8. Verify follower count updates in real-time

**Expected Results:**
- ✅ Counts displayed correctly
- ✅ Counts update in real-time
- ✅ Uses `user.uid` for subscriptions (more reliable)

### Scenario 9: Rapid Follow/Unfollow

**Steps:**
1. Log in as User A
2. Navigate to User B's profile
3. Rapidly click Follow → Unfollow → Follow → Unfollow (5 times)
4. Verify no duplicate follow relationships created
5. Verify final state is correct (following or not following)

**Expected Results:**
- ✅ No duplicate relationships
- ✅ Final state is correct
- ✅ No errors in console

### Scenario 10: Error Handling

**Steps:**
1. Log in as User A
2. Navigate to a profile with missing `ownerUid`
3. Try to follow
4. Verify error message displayed
5. Disconnect internet
6. Try to follow/unfollow
7. Verify error handling

**Expected Results:**
- ✅ Error messages displayed
- ✅ No crashes
- ✅ Graceful error handling

### Scenario 11: Empty States

**Steps:**
1. Log in as User A (new account with no followers/following)
2. Navigate to own profile
3. Verify counts show 0
4. Click on follower count
5. Verify modal shows "No followers yet."
6. Click on following count
7. Verify modal shows "Not following anyone yet."

**Expected Results:**
- ✅ Counts show 0 correctly
- ✅ Empty state messages displayed
- ✅ No errors

### Scenario 12: Home Button

**Steps:**
1. Log in as User A
2. Navigate to User B's profile (`/view/usernameB`)
3. Verify "Home" button is visible
4. Click "Home" button
5. Verify navigation to own profile (`/profile/usernameA`)
6. Log out
7. Navigate to any profile
8. Verify "Home" button is NOT visible

**Expected Results:**
- ✅ Home button visible when logged in
- ✅ Navigates to own profile correctly
- ✅ Home button hidden when logged out

## Browser Console Checks

While testing, check browser console for:
- ❌ No Firebase permission errors
- ❌ No uncaught exceptions
- ❌ No memory leaks (subscriptions not cleaned up)
- ✅ Proper error logging (if errors occur)

## Network Tab Checks

Check Network tab for:
- ✅ Firestore queries are efficient
- ✅ No unnecessary duplicate queries
- ✅ Real-time subscriptions working
- ✅ Proper cleanup when navigating away

## Performance Checks

- ✅ Counts update quickly (< 1 second)
- ✅ Modals open quickly (< 500ms)
- ✅ No lag when clicking buttons
- ✅ Smooth navigation between profiles

## Security Checks

- ✅ Cannot follow without authentication
- ✅ Cannot follow yourself
- ✅ Cannot delete others' follow relationships
- ✅ Public read access works for counts

## Checklist

- [ ] Follow button only shows when logged in
- [ ] Follow button hidden on own profile
- [ ] Home button shows when logged in
- [ ] Home button hidden when logged out
- [ ] Follow/unfollow works correctly
- [ ] Counts update in real-time
- [ ] Modals work correctly
- [ ] Empty states display correctly
- [ ] Error handling works
- [ ] No console errors
- [ ] No memory leaks
- [ ] Security rules enforced

## Reporting Issues

If you find any issues:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check Network tab for failed requests
4. Note which user accounts were used
5. Note browser and version




























