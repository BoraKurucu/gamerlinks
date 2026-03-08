import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../shared/firebase';
import { getProfileAnalytics } from '../shared/analyticsService';
import { getProfileByOwnerUid } from '../shared/profileService';
import { getSubscriptionStatus } from '../shared/subscriptionService';
import UpgradeButton from '../shared/UpgradeButton';

export default function Analytics() {
  const { username } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState('');
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'today', '7d', '30d', '90d', 'all'
  const isPremium = subscription?.isActive || false;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUid(u?.uid || '');
      if (u?.uid) {
        const p = await getProfileByOwnerUid(u.uid);
        setProfile(p);
        const sub = await getSubscriptionStatus(u.uid);
        setSubscription(sub);
      } else {
        setSubscription(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!username || !currentUid || !profile) return;
    
    // Verify user owns this profile
    if (profile.username?.toLowerCase() !== username?.toLowerCase()) {
      setLoading(false);
      return;
    }

    // Force free users to only use 'today' filter
    if (!isPremium && timeFilter !== 'today') {
      setTimeFilter('today');
    }

    async function loadAnalytics() {
      setLoading(true);
      try {
        const data = await getProfileAnalytics(username);
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [username, currentUid, profile, isPremium, timeFilter]);

  // Redirect if not owner
  if (!loading && profile && profile.username?.toLowerCase() !== username?.toLowerCase()) {
    return <Navigate to={`/profile/${profile.username || ''}`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white/80">Loading analytics…</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Unable to load analytics</h1>
        </div>
      </div>
    );
  }

  function formatRelativeTime(date) {
    if (!date) return 'Never';
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
  }

  // Time filter function
  function getTimeFilter() {
    const now = new Date();
    switch (timeFilter) {
      case 'today': {
        // Get start of today in local time (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return todayStart;
      }
      case '7d': {
        // 7 days ago from now (includes today)
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sevenDaysAgo;
      }
      case '30d': {
        // 30 days ago from now (includes today)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return thirtyDaysAgo;
      }
      case '90d': {
        // 90 days ago from now (includes today)
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return ninetyDaysAgo;
      }
      default:
        return null; // All time
    }
  }

  function filterEventsByTime(events) {
    const filterDate = getTimeFilter();
    if (!filterDate) return events; // Return all events if no filter
    
    return events.filter(e => {
      if (!e.timestamp) return false;
      const eventDate = e.timestamp instanceof Date ? e.timestamp : new Date(e.timestamp);
      return eventDate >= filterDate;
    });
  }

  // Filter all events by time
  const filteredEvents = filterEventsByTime(analytics.allEvents || []);
  const filteredViews = filteredEvents.filter(e => e.type === 'profile_view');
  const filteredShares = filteredEvents.filter(e => e.type === 'profile_share');
  const filteredLinkClicks = filteredEvents.filter(e => e.type === 'link_click');

  // Calculate filtered totals
  const filteredTotalViews = filteredViews.length;
  const filteredTotalShares = filteredShares.length;

  // Calculate all-time totals from actual events (not aggregated stats which might be outdated)
  const allEvents = analytics.allEvents || [];
  const allTimeViews = allEvents.filter(e => e.type === 'profile_view').length;
  const allTimeShares = allEvents.filter(e => e.type === 'profile_share').length;
  const allTimeLinkClicks = allEvents.filter(e => e.type === 'link_click' && (!e.itemType || e.itemType === 'link')).length;
  const allTimeContentClicks = allEvents.filter(e => e.type === 'link_click' && e.itemType === 'event').length;

  // Separate link clicks and content clicks from filtered events
  // Note: itemType can be 'link', 'event', or undefined (legacy events default to 'link' in analyticsService)
  const linkClicksOnly = filteredLinkClicks.filter(click => {
    const itemType = click.itemType;
    // If itemType is undefined or 'link', treat as link click
    return itemType === undefined || itemType === 'link' || itemType === null;
  });
  const contentClicksOnly = filteredLinkClicks.filter(click => click.itemType === 'event');
  
  // Sanity check: All clicks should be either link or content
  // linkClicksOnly.length + contentClicksOnly.length should equal filteredLinkClicks.length

  // Get link stats filtered by time
  function getFilteredLinkStats() {
    const linkClicksByUrl = {};
    linkClicksOnly.forEach(click => {
      if (!linkClicksByUrl[click.linkUrl]) {
        linkClicksByUrl[click.linkUrl] = {
          url: click.linkUrl,
          title: click.linkTitle || click.linkUrl,
          totalClicks: 0,
          clicks: []
        };
      }
      linkClicksByUrl[click.linkUrl].totalClicks++;
      linkClicksByUrl[click.linkUrl].clicks.push(click);
    });

    return Object.values(linkClicksByUrl)
      .map(stat => ({
        ...stat,
        lastClickAt: stat.clicks.length > 0 
          ? stat.clicks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
          : null
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks);
  }

  // Get content stats filtered by time
  function getFilteredContentStats() {
    const contentClicksByUrl = {};
    contentClicksOnly.forEach(click => {
      if (!contentClicksByUrl[click.linkUrl]) {
        contentClicksByUrl[click.linkUrl] = {
          url: click.linkUrl,
          title: click.linkTitle || click.linkUrl,
          totalClicks: 0,
          clicks: []
        };
      }
      contentClicksByUrl[click.linkUrl].totalClicks++;
      contentClicksByUrl[click.linkUrl].clicks.push(click);
    });

    return Object.values(contentClicksByUrl)
      .map(stat => ({
        ...stat,
        lastClickAt: stat.clicks.length > 0 
          ? stat.clicks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
          : null
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks);
  }

  const linkStatsArray = getFilteredLinkStats();
  const contentStatsArray = getFilteredContentStats();
  
  const totalLinkClicks = linkStatsArray.reduce((sum, stat) => sum + (stat.totalClicks || 0), 0);
  const totalContentClicks = contentStatsArray.reduce((sum, stat) => sum + (stat.totalClicks || 0), 0);
  
  // Calculate total clicks: links + content (from grouped stats for accuracy)
  // This ensures consistency since we group clicks by URL in getFilteredLinkStats/getFilteredContentStats
  const filteredTotalClicksCombined = totalLinkClicks + totalContentClicks;
  
  const linkStatsWithRanking = linkStatsArray.map((stat, idx) => {
    const percentage = totalLinkClicks > 0 
      ? Math.min(((stat.totalClicks || 0) / totalLinkClicks) * 100, 100).toFixed(1)
      : '0.0';
    return {
      ...stat,
      rank: idx + 1,
      percentage: percentage,
      percentageNum: parseFloat(percentage) // Store as number for calculations
    };
  });

  const contentStatsWithRanking = contentStatsArray.map((stat, idx) => {
    const percentage = totalContentClicks > 0 
      ? Math.min(((stat.totalClicks || 0) / totalContentClicks) * 100, 100).toFixed(1)
      : '0.0';
    return {
      ...stat,
      rank: idx + 1,
      percentage: percentage,
      percentageNum: parseFloat(percentage) // Store as number for calculations
    };
  });

  // Calculate engagement metrics (filtered) - using total clicks (links + content)
  const clickThroughRateNum = filteredTotalViews > 0 
    ? Math.min((filteredTotalClicksCombined / filteredTotalViews) * 100, 100)
    : 0;
  const clickThroughRate = clickThroughRateNum.toFixed(1);
  
  const shareRateNum = filteredTotalViews > 0 
    ? Math.min((filteredTotalShares / filteredTotalViews) * 100, 100)
    : 0;
  const shareRate = shareRateNum.toFixed(1);

  // Time-based analytics - group by day
  function groupByDay(events) {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.timestamp);
      const dayKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      if (!grouped[dayKey]) {
        grouped[dayKey] = { 
          views: 0, 
          shares: 0, 
          clicks: 0,
          timestamp: date.getTime() // Store timestamp for sorting
        };
      }
      if (event.type === 'profile_view') grouped[dayKey].views++;
      else if (event.type === 'profile_share') grouped[dayKey].shares++;
      else if (event.type === 'link_click') grouped[dayKey].clicks++;
    });
    return Object.entries(grouped)
      .map(([date, stats]) => ({ 
        date, 
        views: stats.views,
        shares: stats.shares,
        clicks: stats.clicks,
        timestamp: stats.timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(({ timestamp, ...rest }) => rest)
      .slice(0, 30); // Last 30 days
  }

  const dailyStats = groupByDay(filteredEvents);



  return (
    <div className="min-h-screen flex flex-col items-center px-3 sm:px-4 py-6 sm:py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Analytics</h1>
            <p className="text-white/70">Track your profile performance</p>
          </div>
          <Link 
            to={`/profile/${username || ''}`} 
            className="neon-btn inline-block rounded-md border border-white/10 bg-black/30 px-4 py-2.5 text-sm sm:text-base min-h-[44px] flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Time Filter */}
        <div className="mb-6 glass rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-white/60 font-medium">
              Time Period: {!isPremium && <span className="text-white/40">(Free users limited to Today)</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'today', label: 'Today' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' },
                { value: '90d', label: 'Last 90 Days' },
                { value: 'all', label: 'All Time' }
              ].map((option) => {
                const isLocked = !isPremium && option.value !== 'today';
                const isActive = timeFilter === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (!isLocked) {
                        setTimeFilter(option.value);
                      }
                    }}
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-theme-primary text-black'
                        : isLocked
                        ? 'bg-black/20 border border-white/5 text-white/40 cursor-not-allowed opacity-60'
                        : 'bg-black/30 border border-white/10 text-white/80 hover:bg-black/50'
                    }`}
                    title={isLocked ? 'Upgrade to Premium to unlock this filter' : ''}
                  >
                    {option.label} {isLocked && '🔒'}
                  </button>
                );
              })}
            </div>
          </div>
          {!isPremium && (
            <div className="mt-3 text-xs text-white/50">
              💡 Currently viewing: <span className="text-white/70 font-medium">Today</span> • Upgrade to Premium to unlock all time periods
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Views</div>
            <div className="text-3xl font-bold text-theme-primary">{filteredTotalViews}</div>
            {timeFilter !== 'all' && timeFilter !== 'today' && filteredTotalViews !== allTimeViews && (
              <div className="text-xs text-white/50 mt-1">
                {allTimeViews} all time
              </div>
            )}
            {filteredViews.length > 0 && (
              <div className="text-xs text-white/50 mt-2">
                Last: {formatRelativeTime(filteredViews[0]?.timestamp)}
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Shares</div>
            <div className="text-3xl font-bold text-green-400">{filteredTotalShares}</div>
            {timeFilter !== 'all' && timeFilter !== 'today' && filteredTotalShares !== allTimeShares && (
              <div className="text-xs text-white/50 mt-1">
                {allTimeShares} all time
              </div>
            )}
            {filteredShares.length > 0 && (
              <div className="text-xs text-white/50 mt-2">
                Last: {formatRelativeTime(filteredShares[0]?.timestamp)}
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Link Clicks</div>
            <div className="text-3xl font-bold text-blue-400">{totalLinkClicks}</div>
            {timeFilter !== 'all' && timeFilter !== 'today' && totalLinkClicks !== allTimeLinkClicks && (
              <div className="text-xs text-white/50 mt-1">
                {allTimeLinkClicks} all time
              </div>
            )}
          </div>
          
          <div className="glass rounded-xl p-6 border border-white/10">
            <div className="text-white/60 text-sm mb-1">Content Clicks</div>
            <div className="text-3xl font-bold text-purple-400">{totalContentClicks}</div>
            {timeFilter !== 'all' && timeFilter !== 'today' && totalContentClicks !== allTimeContentClicks && (
              <div className="text-xs text-white/50 mt-1">
                {allTimeContentClicks} all time
              </div>
            )}
          </div>
        </div>

        {/* Unified Premium Upgrade Banner for Free Users */}
        {!isPremium && (
          <div className="glass rounded-xl p-6 border border-neon-blue/30 mb-6 bg-gradient-to-r from-black/60 to-black/80 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock Advanced Analytics with Premium</h3>
              <p className="text-white/70 text-sm mb-4 max-w-md">
                Get detailed insights including engagement metrics, link performance, content analytics, and daily activity trends
              </p>
              {profile && (
                <UpgradeButton 
                  user={{ uid: currentUid, email: auth.currentUser?.email }} 
                  currentLinkCount={profile?.links?.length || 0}
                  currentEventCount={profile?.events?.length || 0}
                  variant="compact"
                />
              )}
            </div>
          </div>
        )}
        
        {/* Blurred Preview of Premium Features for Free Users */}
        {!isPremium && (
          <div className="relative">
            <div className="blur-sm pointer-events-none opacity-50">
              {/* Blurred Engagement Metrics */}
              {filteredTotalViews > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <div className="text-white/60 text-sm mb-2">Click-Through Rate</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-blue-400 h-full transition-all"
                          style={{ width: `${Math.min(clickThroughRateNum, 100)}%` }}
                        />
                      </div>
                      <div className="text-xl font-bold text-blue-400">{clickThroughRate}%</div>
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      {filteredTotalClicksCombined} clicks from {filteredTotalViews} views
                    </div>
                  </div>
                  <div className="glass rounded-xl p-6 border border-white/10">
                    <div className="text-white/60 text-sm mb-2">Share Rate</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-green-400 h-full transition-all"
                          style={{ width: `${Math.min(shareRateNum, 100)}%` }}
                        />
                      </div>
                      <div className="text-xl font-bold text-green-400">{shareRate}%</div>
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      {filteredTotalShares} shares from {filteredTotalViews} views
                    </div>
                  </div>
                </div>
              )}
              
              {/* Blurred Link Performance */}
              {linkStatsWithRanking.length > 0 && (
                <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">Most Clicked Links</h2>
                    <div className="text-sm text-white/60">{totalLinkClicks} clicks</div>
                  </div>
                  <div className="space-y-3">
                    {linkStatsWithRanking.slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="border border-white/10 rounded-lg p-4 bg-black/20">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {idx === 0 && (
                              <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 font-bold">
                                🥇
                              </div>
                            )}
                            {idx === 1 && (
                              <div className="w-10 h-10 rounded-full bg-gray-400/20 border border-gray-400/50 flex items-center justify-center text-gray-300 font-bold">
                                🥈
                              </div>
                            )}
                            {idx === 2 && (
                              <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/50 flex items-center justify-center text-orange-400 font-bold">
                                🥉
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base truncate">{stat.title}</div>
                                <div className="text-xs text-white/60 truncate">{stat.url}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-2xl font-bold text-blue-400">{stat.totalClicks || 0}</div>
                                <div className="text-xs text-white/50">clicks</div>
                              </div>
                            </div>
                            {totalLinkClicks > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-white/60">Share of total clicks</span>
                                  <span className="text-blue-400 font-semibold">{stat.percentage}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all"
                                    style={{ width: `${stat.percentageNum || parseFloat(stat.percentage) || 0}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Blurred Content Performance */}
              {contentStatsWithRanking.length > 0 && (
                <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">Most Clicked Content & Streams</h2>
                    <div className="text-sm text-white/60">{totalContentClicks} clicks</div>
                  </div>
                  <div className="space-y-3">
                    {contentStatsWithRanking.slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="border border-white/10 rounded-lg p-4 bg-black/20">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {idx === 0 && (
                              <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 font-bold">
                                🥇
                              </div>
                            )}
                            {idx === 1 && (
                              <div className="w-10 h-10 rounded-full bg-gray-400/20 border border-gray-400/50 flex items-center justify-center text-gray-300 font-bold">
                                🥈
                              </div>
                            )}
                            {idx === 2 && (
                              <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/50 flex items-center justify-center text-orange-400 font-bold">
                                🥉
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base truncate">{stat.title}</div>
                                <div className="text-xs text-white/60 truncate">{stat.url}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-2xl font-bold text-purple-400">{stat.totalClicks || 0}</div>
                                <div className="text-xs text-white/50">clicks</div>
                              </div>
                            </div>
                            {totalContentClicks > 0 && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-white/60">Share of total clicks</span>
                                  <span className="text-purple-400 font-semibold">{stat.percentage}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all"
                                    style={{ width: `${stat.percentageNum || parseFloat(stat.percentage) || 0}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Blurred Daily Activity Chart */}
              {dailyStats.length > 0 && (
                <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">Activity Over Time</h2>
                    <div className="text-sm text-white/60">Today</div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {dailyStats.slice(0, 5).map((day, idx) => {
                      const maxValue = Math.max(day.views, day.shares, day.clicks, 1);
                      return (
                        <div key={idx} className="border border-white/10 rounded-lg p-3 bg-black/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white/80">{day.date}</span>
                            <span className="text-xs text-white/50">
                              {day.views} views • {day.shares} shares • {day.clicks} clicks
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {day.views > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60 w-16">Views:</span>
                                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-theme-primary h-full"
                                    style={{ width: `${(day.views / maxValue) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white/50 w-8 text-right">{day.views}</span>
                              </div>
                            )}
                            {day.shares > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60 w-16">Shares:</span>
                                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-green-400 h-full"
                                    style={{ width: `${(day.shares / maxValue) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white/50 w-8 text-right">{day.shares}</span>
                              </div>
                            )}
                            {day.clicks > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60 w-16">Clicks:</span>
                                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-blue-400 h-full"
                                    style={{ width: `${(day.clicks / maxValue) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white/50 w-8 text-right">{day.clicks}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Overlay gradient to make blur more apparent */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          </div>
        )}

        {/* Engagement Metrics - Premium Only */}
        {isPremium && filteredTotalViews > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="text-white/60 text-sm mb-2">Click-Through Rate</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full transition-all"
                    style={{ width: `${Math.min(clickThroughRateNum, 100)}%` }}
                  />
                </div>
                <div className="text-xl font-bold text-blue-400">{clickThroughRate}%</div>
              </div>
              <div className="text-xs text-white/50 mt-2">
                {filteredTotalClicksCombined} clicks from {filteredTotalViews} views
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-white/10">
              <div className="text-white/60 text-sm mb-2">Share Rate</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-green-400 h-full transition-all"
                    style={{ width: `${Math.min(shareRateNum, 100)}%` }}
                  />
                </div>
                <div className="text-xl font-bold text-green-400">{shareRate}%</div>
              </div>
              <div className="text-xs text-white/50 mt-2">
                {filteredTotalShares} shares from {filteredTotalViews} views
              </div>
            </div>
          </div>
        )}

        {/* Link Performance - Most Clicked Links - Premium Only */}
        {isPremium && (
          <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Most Clicked Links</h2>
              <div className="text-sm text-white/60">
                {totalLinkClicks} clicks
                {timeFilter !== 'all' && (
                  <span className="text-white/40 ml-2">
                    (filtered by {timeFilter === 'today' ? 'today' : timeFilter === '7d' ? '7 days' : timeFilter === '30d' ? '30 days' : '90 days'})
                  </span>
                )}
              </div>
            </div>
            {linkStatsWithRanking.length > 0 ? (
              <div className="space-y-3">
                {linkStatsWithRanking.map((stat, idx) => (
                <div
                  key={idx}
                  className="border border-white/10 rounded-lg p-4 bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Ranking Badge */}
                    <div className="flex-shrink-0">
                      {stat.rank === 1 && (
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 font-bold">
                          🥇
                        </div>
                      )}
                      {stat.rank === 2 && (
                        <div className="w-10 h-10 rounded-full bg-gray-400/20 border border-gray-400/50 flex items-center justify-center text-gray-300 font-bold">
                          🥈
                        </div>
                      )}
                      {stat.rank === 3 && (
                        <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/50 flex items-center justify-center text-orange-400 font-bold">
                          🥉
                        </div>
                      )}
                      {stat.rank > 3 && (
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 font-bold text-sm">
                          #{stat.rank}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{stat.title}</div>
                          <div className="text-xs text-white/60 truncate">{stat.url}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-blue-400">{stat.totalClicks || 0}</div>
                          <div className="text-xs text-white/50">clicks</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {totalLinkClicks > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/60">Share of total clicks</span>
                            <span className="text-blue-400 font-semibold">{stat.percentage}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all"
                              style={{ width: `${stat.percentageNum || parseFloat(stat.percentage) || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {stat.lastClickAt && (
                        <div className="text-xs text-white/40 mt-2">
                          Last clicked: {formatRelativeTime(stat.lastClickAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <div className="text-4xl mb-3">🔗</div>
                <p>No link clicks yet. Start sharing your profile!</p>
              </div>
            )}
          </div>
        )}

        {/* Content Performance - Most Clicked Content - Premium Only */}
        {isPremium && (
          <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Most Clicked Content & Streams</h2>
              <div className="text-sm text-white/60">
                {totalContentClicks} clicks
                {timeFilter !== 'all' && (
                  <span className="text-white/40 ml-2">
                    (filtered by {timeFilter === 'today' ? 'today' : timeFilter === '7d' ? '7 days' : timeFilter === '30d' ? '30 days' : '90 days'})
                  </span>
                )}
              </div>
            </div>
            {contentStatsWithRanking.length > 0 ? (
              <div className="space-y-3">
                {contentStatsWithRanking.map((stat, idx) => (
                <div
                  key={idx}
                  className="border border-white/10 rounded-lg p-4 bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Ranking Badge */}
                    <div className="flex-shrink-0">
                      {stat.rank === 1 && (
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center text-yellow-400 font-bold">
                          🥇
                        </div>
                      )}
                      {stat.rank === 2 && (
                        <div className="w-10 h-10 rounded-full bg-gray-400/20 border border-gray-400/50 flex items-center justify-center text-gray-300 font-bold">
                          🥈
                        </div>
                      )}
                      {stat.rank === 3 && (
                        <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/50 flex items-center justify-center text-orange-400 font-bold">
                          🥉
                        </div>
                      )}
                      {stat.rank > 3 && (
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 font-bold text-sm">
                          #{stat.rank}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{stat.title}</div>
                          <div className="text-xs text-white/60 truncate">{stat.url}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-purple-400">{stat.totalClicks || 0}</div>
                          <div className="text-xs text-white/50">clicks</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      {totalContentClicks > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-white/60">Share of total clicks</span>
                            <span className="text-purple-400 font-semibold">{stat.percentage}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all"
                              style={{ width: `${stat.percentageNum || parseFloat(stat.percentage) || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {stat.lastClickAt && (
                        <div className="text-xs text-white/40 mt-2">
                          Last clicked: {formatRelativeTime(stat.lastClickAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60">
                <div className="text-4xl mb-3">📺</div>
                <p>No content clicks yet. Start sharing your streams and content!</p>
              </div>
            )}
          </div>
        )}

        {/* Daily Activity Chart - Premium Only */}
        {isPremium && dailyStats.length > 0 && (
          <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Activity Over Time</h2>
              <div className="text-sm text-white/60">
                {timeFilter === 'all' ? 'All Time' : timeFilter === 'today' ? 'Today' : timeFilter === '7d' ? 'Last 7 Days' : timeFilter === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dailyStats.map((day, idx) => {
                const maxValue = Math.max(day.views, day.shares, day.clicks, 1);
                return (
                  <div key={idx} className="border border-white/10 rounded-lg p-3 bg-black/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/80">{day.date}</span>
                      <span className="text-xs text-white/50">
                        {day.views} views • {day.shares} shares • {day.clicks} clicks
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {day.views > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60 w-16">Views:</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-theme-primary h-full"
                              style={{ width: `${(day.views / maxValue) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50 w-8 text-right">{day.views}</span>
                        </div>
                      )}
                      {day.shares > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60 w-16">Shares:</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-green-400 h-full"
                              style={{ width: `${(day.shares / maxValue) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50 w-8 text-right">{day.shares}</span>
                        </div>
                      )}
                      {day.clicks > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60 w-16">Clicks:</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-blue-400 h-full"
                              style={{ width: `${(day.clicks / maxValue) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-white/50 w-8 text-right">{day.clicks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {linkStatsWithRanking.length === 0 && contentStatsWithRanking.length === 0 && dailyStats.length === 0 && (
          <div className="glass rounded-xl p-8 border border-white/10 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No analytics data yet</h3>
            <p className="text-white/60 mb-4">
              Start sharing your profile to see views, shares, and link clicks here.
            </p>
            <Link
              to={`/profile/${username || ''}`}
              className="neon-btn inline-block rounded-md bg-theme-primary px-4 py-2.5 text-black font-semibold text-sm sm:text-base min-h-[44px] flex items-center justify-center"
            >
              Go to Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

