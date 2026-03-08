import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Subscription limits
export const FREE_LINK_LIMIT = 5;
export const PREMIUM_LINK_LIMIT = 50;
export const FREE_EVENT_LIMIT = 3;
export const PREMIUM_EVENT_LIMIT = 50;

// Get subscription status for current user
export async function getSubscriptionStatus() {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { isPremium: false, isLoading: false };
    }

    const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
    if (!profileDoc.exists()) {
      return { isPremium: false, isLoading: false };
    }

    const profileData = profileDoc.data();
    return {
      isPremium: profileData.isPremium || false,
      subscription: profileData.subscription,
      isLoading: false
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { isPremium: false, isLoading: false };
  }
}

// Redirect to subscription cancellation
export function redirectToCancelSubscription() {
  // In a real app, this would redirect to a payment provider's cancellation page
  window.open('https://billing.stripe.com/cancel', '_blank');
}

// Check if user can add more links based on subscription
export function canAddMoreLinks(currentLinkCount, isPremium) {
  const limit = isPremium ? PREMIUM_LINK_LIMIT : FREE_LINK_LIMIT;
  return currentLinkCount < limit;
}

// Check if user can add more events based on subscription
export function canAddMoreEvents(currentEventCount, isPremium) {
  const limit = isPremium ? PREMIUM_EVENT_LIMIT : FREE_EVENT_LIMIT;
  return currentEventCount < limit;
}
