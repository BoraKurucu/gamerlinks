import { collection, doc, setDoc, getDocs, getDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Track a profile view
 * @param {string} username - The username of the profile being viewed
 */
export async function trackProfileView(username) {
  if (!username) {
    console.warn('trackProfileView: No username provided');
    return;
  }
  
  if (!isFirebaseConfigured()) {
    console.warn('trackProfileView: Firebase not configured');
    return;
  }
  
  try {
    console.log('Tracking profile view for:', username);
    const timestamp = new Date().toISOString();
    const analyticsRef = doc(collection(db, 'analytics'));
    
    await setDoc(analyticsRef, {
      type: 'profile_view',
      username: username.toLowerCase(),
      timestamp: serverTimestamp(),
      createdAt: timestamp
    }, { merge: false });
    
    console.log('Analytics event created for profile view');
    
    // Also update aggregated stats
    const statsRef = doc(db, 'profileStats', username.toLowerCase());
    const statsSnap = await getDoc(statsRef);
    const currentViews = statsSnap.exists() ? (statsSnap.data().totalViews || 0) : 0;
    
    await setDoc(statsRef, {
      totalViews: currentViews + 1,
      lastViewAt: serverTimestamp(),
      username: username.toLowerCase()
    }, { merge: true });
    
    console.log('Stats updated. Total views:', currentViews + 1);
  } catch (error) {
    console.error('Error tracking profile view:', error);
    console.error('Error details:', error.message, error.code);
  }
}

/**
 * Track a profile share
 * @param {string} username - The username of the profile being shared
 */
export async function trackProfileShare(username) {
  if (!username || !isFirebaseConfigured()) return;
  
  try {
    const timestamp = new Date().toISOString();
    const analyticsRef = doc(collection(db, 'analytics'));
    
    await setDoc(analyticsRef, {
      type: 'profile_share',
      username: username.toLowerCase(),
      timestamp: serverTimestamp(),
      createdAt: timestamp
    }, { merge: false });
    
    // Also update aggregated stats
    const statsRef = doc(db, 'profileStats', username.toLowerCase());
    const statsSnap = await getDoc(statsRef);
    const currentShares = statsSnap.exists() ? (statsSnap.data().totalShares || 0) : 0;
    
    await setDoc(statsRef, {
      totalShares: currentShares + 1,
      lastShareAt: serverTimestamp(),
      username: username.toLowerCase()
    }, { merge: true });
  } catch (error) {
    console.error('Error tracking profile share:', error);
  }
}

/**
 * Track a link click
 * @param {string} username - The username of the profile owner
 * @param {string} linkUrl - The URL of the clicked link
 * @param {string} linkTitle - The title of the clicked link
 * @param {string} itemType - Type of item: 'link' or 'event'
 */
export async function trackLinkClick(username, linkUrl, linkTitle, itemType = 'link') {
  if (!username) {
    console.warn('trackLinkClick: No username provided');
    return;
  }
  
  if (!linkUrl) {
    console.warn('trackLinkClick: No linkUrl provided');
    return;
  }
  
  if (!isFirebaseConfigured()) {
    console.warn('trackLinkClick: Firebase not configured');
    return;
  }
  
  try {
    console.log('Tracking link click:', { username, linkUrl, linkTitle });
    const timestamp = new Date().toISOString();
    const analyticsRef = doc(collection(db, 'analytics'));
    
    await setDoc(analyticsRef, {
      type: 'link_click',
      username: username.toLowerCase(),
      linkUrl: linkUrl,
      linkTitle: linkTitle || linkUrl,
      itemType: itemType, // 'link' or 'event'
      timestamp: serverTimestamp(),
      createdAt: timestamp
    }, { merge: false });
    
    console.log('Analytics event created for link click');
    
    // Also update aggregated stats for this link
    const linkId = `${username.toLowerCase()}_${linkUrl}`.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 100);
    const linkStatsRef = doc(db, 'linkStats', linkId);
    const linkSnap = await getDoc(linkStatsRef);
    const currentClicks = linkSnap.exists() ? (linkSnap.data().totalClicks || 0) : 0;
    
    await setDoc(linkStatsRef, {
      username: username.toLowerCase(),
      linkUrl: linkUrl,
      linkTitle: linkTitle || linkUrl,
      itemType: itemType,
      totalClicks: currentClicks + 1,
      lastClickAt: serverTimestamp()
    }, { merge: true });
    
    console.log('Link stats updated. Total clicks:', currentClicks + 1);
  } catch (error) {
    console.error('Error tracking link click:', error);
    console.error('Error details:', error.message, error.code);
  }
}

/**
 * Get analytics data for a profile
 * @param {string} username - The username to get analytics for
 * @returns {Promise<Object>} Analytics data with views, shares, and link clicks
 */
export async function getProfileAnalytics(username) {
  if (!username) {
    console.warn('getProfileAnalytics: No username provided');
    return {
      views: [],
      shares: [],
      linkClicks: [],
      totalViews: 0,
      totalShares: 0,
      linkStats: {}
    };
  }
  
  if (!isFirebaseConfigured()) {
    console.warn('getProfileAnalytics: Firebase not configured');
    return {
      views: [],
      shares: [],
      linkClicks: [],
      totalViews: 0,
      totalShares: 0,
      linkStats: {}
    };
  }
  
  try {
    console.log('Getting analytics for username:', username);
    const lowerUsername = username.toLowerCase();
    
    // Get all analytics events for this profile
    // Try with orderBy first, fallback to without if index missing
    let analyticsSnapshot;
    try {
      const analyticsQuery = query(
        collection(db, 'analytics'),
        where('username', '==', lowerUsername),
        orderBy('timestamp', 'desc')
      );
      analyticsSnapshot = await getDocs(analyticsQuery);
    } catch (indexError) {
      // If index missing, query without orderBy and sort in memory
      const analyticsQuery = query(
        collection(db, 'analytics'),
        where('username', '==', lowerUsername)
      );
      analyticsSnapshot = await getDocs(analyticsQuery);
    }
    
    const events = [];
    
    analyticsSnapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        type: data.type,
        timestamp: data.timestamp?.toDate?.() || new Date(data.createdAt || Date.now()),
        linkUrl: data.linkUrl,
        linkTitle: data.linkTitle,
        itemType: data.itemType || 'link'
      });
    });
    
    console.log(`Found ${events.length} analytics events`);
    
    // Sort by timestamp if we couldn't use orderBy
    events.sort((a, b) => {
      const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return bTime - aTime;
    });
    
    // Get aggregated stats
    const statsRef = doc(db, 'profileStats', lowerUsername);
    const statsSnap = await getDoc(statsRef);
    
    let totalViews = 0;
    let totalShares = 0;
    
    // Get from aggregated stats if available, otherwise count from events
    if (statsSnap.exists()) {
      const statsData = statsSnap.data();
      totalViews = statsData.totalViews || 0;
      totalShares = statsData.totalShares || 0;
      console.log('Using aggregated stats:', { totalViews, totalShares });
    } else {
      totalViews = events.filter(e => e.type === 'profile_view').length;
      totalShares = events.filter(e => e.type === 'profile_share').length;
      console.log('Counted from events:', { totalViews, totalShares });
    }
    
    // Get link stats
    const linkStatsQuery = query(
      collection(db, 'linkStats'),
      where('username', '==', lowerUsername)
    );
    const linkStatsSnapshot = await getDocs(linkStatsQuery);
    const linkStats = {};
    
    linkStatsSnapshot.forEach((doc) => {
      const data = doc.data();
      linkStats[data.linkUrl] = {
        url: data.linkUrl,
        title: data.linkTitle || data.linkUrl,
        itemType: data.itemType || 'link',
        totalClicks: data.totalClicks || 0,
        lastClickAt: data.lastClickAt?.toDate?.() || null
      };
    });
    
    // Get link clicks from events for detailed history
    const linkClicks = events
      .filter(e => e.type === 'link_click')
      .map(e => ({
        url: e.linkUrl,
        title: e.linkTitle,
        itemType: e.itemType || 'link',
        timestamp: e.timestamp
      }));
    
    return {
      views: events.filter(e => e.type === 'profile_view'),
      shares: events.filter(e => e.type === 'profile_share'),
      linkClicks: linkClicks,
      totalViews: totalViews,
      totalShares: totalShares,
      linkStats: linkStats,
      allEvents: events
    };
  } catch (error) {
    console.error('Error getting profile analytics:', error);
    return {
      views: [],
      shares: [],
      linkClicks: [],
      totalViews: 0,
      totalShares: 0,
      linkStats: {},
      allEvents: []
    };
  }
}
