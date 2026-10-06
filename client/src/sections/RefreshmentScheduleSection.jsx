import React from 'react';
import { 
  Coffee, 
  Utensils, 
  UtensilsCrossed, 
  Wifi, 
  Smartphone, 
  Calendar, 
  Clock, 
  Info, 
  Sparkles, 
  Anchor, 
  Skull, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon,
  GlassWater
} from 'lucide-react';
import AncientParchmentScroll from '../components/AncientParchmentScroll';

/**
 * REFRESHMENT & MEAL SCHEDULE DATA
 * Updated as requested:
 * 1. Day 1 Afternoon (12:00 PM): Fresh Juice
 * 2. Day 1 Afternoon (3:00 PM – 4:00 PM): Tea & Snacks
 * 3. Day 1 Night (8:00 PM Onwards): Dinner Feast
 * 4. Day 1 Midnight (11:00 PM – 12:00 AM): Midnight Tea
 * 5. Day 2 Early Morning (5:30 AM – 6:30 AM): Sunrise Coffee
 * 6. Day 2 Morning (7:00 AM – 8:00 AM): Morning Breakfast
 */
export const MEAL_SCHEDULE = [
  {
    id: 'afternoon-juice',
    numeral: 'I',
    title: 'Fresh Juice',
    handwrittenMatch: '🧃 Juice',
    time: '12:00 PM – 1:00 PM',
    date: '8 October 2026',
    dayLabel: 'DAY 1 • AFTERNOON',
    session: 'Afternoon Refreshment',
    description: 'Chilled refreshing fresh fruit juice served to cool down and hydrate pirate squads as the hackathon voyage gets underway.',
    location: 'Cafeteria Refreshment Counters',
    icon: GlassWater,
  },
  {
    id: 'tea-snacks',
    numeral: 'II',
    title: 'Tea & Snacks',
    handwrittenMatch: '☕ Tea & Snacks',
    time: '3:00 PM – 4:00 PM',
    date: '8 October 2026',
    dayLabel: 'DAY 1 • AFTERNOON',
    session: 'Afternoon Provision',
    description: 'Fresh hot tea paired with crisp savory snacks to refuel teams ahead of Review Round 1.',
    location: 'Cafeteria Refreshment Counters',
    icon: UtensilsCrossed,
  },
  {
    id: 'dinner',
    numeral: 'III',
    title: 'Dinner Feast',
    handwrittenMatch: '🍽️ Dinner',
    time: '8:00 PM – 9:30 PM',
    date: '8 October 2026',
    dayLabel: 'DAY 1 • NIGHT',
    session: 'Night Meal Buffet',
    description: 'Wholesome hot dinner buffet served for all crew members to sustain peak energy throughout the overnight voyage.',
    location: 'Main Campus Dining Hall (Mess)',
    icon: Utensils,
  },
  {
    id: 'midnight-tea',
    numeral: 'IV',
    title: 'Midnight Tea',
    handwrittenMatch: '☕ Midnight Tea',
    time: '11:00 PM – 12:00 AM',
    date: '8 October 2026 – Midnight',
    dayLabel: 'DAY 1 • MIDNIGHT',
    session: 'Midnight Energy Booster',
    description: 'Hot midnight tea served alongside the Midnight DJ bash & games lounge to beat fatigue and keep coding spirits high.',
    location: 'Cafeteria Refreshment Counters',
    icon: Moon,
  },
  {
    id: 'morning-coffee',
    numeral: 'V',
    title: 'Sunrise Coffee',
    handwrittenMatch: '☕ Coffee',
    time: '5:30 AM – 6:30 AM',
    date: '9 October 2026',
    dayLabel: 'DAY 2 • EARLY MORNING',
    session: 'Early Morning Booster',
    description: 'Steaming hot sunrise coffee to awaken minds and fuel the final sprint to the finish line.',
    location: 'Cafeteria Refreshment Counters',
    icon: Coffee,
  },
  {
    id: 'breakfast',
    numeral: 'VI',
    title: 'Morning Breakfast',
    handwrittenMatch: '🍽️ Breakfast',
    time: '7:00 AM – 8:00 AM',
    date: '9 October 2026',
    dayLabel: 'DAY 2 • MORNING',
    session: 'Day 2 Morning Breakfast',
    description: 'Nutritious breakfast buffet to energize teams for final repo freeze, presentation polishing, and live jury evaluations.',
    location: 'Main Campus Dining Hall (Mess)',
    icon: Sun,
  },
];

/**
 * Helper to smoothly scroll to the refreshments parchment scroll and ensure it unrolls
 */
export const scrollToRefreshmentScroll = () => {
  window.dispatchEvent(new CustomEvent('open-parchment-scroll', { detail: { id: 'refreshment-schedule-scroll' } }));
  const el = document.getElementById('refreshments');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const RefreshmentScheduleSection = () => {
  return (
    <section id="refreshments" className="relative z-10 scroll-mt-24">
      <AncientParchmentScroll
        id="refreshment-schedule-scroll"
        subtitle="// FLEET ANNOUNCEMENTS // RATIONS & COMM DISPATCH"
        title="REFRESHMENT & MEAL"
        goldTitle="SCHEDULE"
        description="Official provisions timeline, dining hours, and campus Wi-Fi network connectivity charter for all pirate squads."
        badge="6 SESSIONS + WI-FI"
        defaultOpen={true}
      >
        {/* Direct Text on Ancient Scroll Map */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* Top Charter Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-800/15 border border-red-700/40 text-red-900 font-cinzel font-black text-[10px] sm:text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>OFFICIAL SCHEDULE ANNOUNCEMENT</span>
            </div>

            <h3 className="font-pirate text-xl sm:text-3xl md:text-4xl text-[#3b1f09] tracking-wider drop-shadow-sm uppercase leading-tight px-1">
              Official Refreshment & Meal Schedule
            </h3>
            
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1 rounded-full bg-[#3d2412]/10 border border-[#6b421a]/25 mt-2 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#6b421a]" />
              <span className="font-cinzel text-[10px] sm:text-xs text-[#452811] font-bold tracking-wider uppercase">
                8 October 2026 (Day 1) – 9 October 2026 (Day 2)
              </span>
            </div>
            
            <p className="font-cinzel text-[10px] sm:text-xs text-[#5c3514] font-semibold mt-2 max-w-xl mx-auto px-2">
              All refreshments, snacks, and meals are provided compliantly for registered participants at the Campus Dining Hall & Cafeteria.
            </p>
            <div className="w-20 sm:w-28 h-0.5 bg-[#6b421a]/30 mx-auto mt-3" />
          </div>

          {/* Quick-Glance Live Scrolling Announcement Ticker */}
          <div className="relative overflow-hidden rounded-xl bg-[#2e190b]/[0.08] border border-[#5c3614]/25 py-2.5 px-3 shadow-inner">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center space-x-1.5 text-[9px] sm:text-[11px] font-cinzel font-extrabold text-[#5c3514] uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#b8860b] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Live Provisions & Connectivity Broadcast:</span>
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] text-[#78461c] font-bold bg-[#3d2412]/10 px-2 py-0.5 rounded">
                6 SESSIONS
              </span>
            </div>

            {/* Seamless Infinite Marquee Ticker */}
            <div className="relative flex overflow-x-hidden group/marquee">
              <div className="animate-marquee whitespace-nowrap flex items-center space-x-6 text-[11px] sm:text-xs font-cinzel font-bold text-[#361c0a]">
                <span>🧃 <strong className="text-[#63330f]">12:00 PM – 1:00 PM:</strong> Fresh Juice (8 Oct)</span>
                <span>•</span>
                <span>☕🍪 <strong className="text-[#63330f]">3:00 PM – 4:00 PM:</strong> Tea & Snacks (8 Oct)</span>
                <span>•</span>
                <span>🍽️ <strong className="text-[#63330f]">8:00 PM – 9:30 PM:</strong> Dinner Feast (8 Oct)</span>
                <span>•</span>
                <span>☕ <strong className="text-[#63330f]">11:00 PM – 12:00 AM:</strong> Midnight Tea (8 Oct)</span>
                <span>•</span>
                <span>☕ <strong className="text-[#63330f]">5:30 AM – 6:30 AM:</strong> Sunrise Coffee (9 Oct)</span>
                <span>•</span>
                <span>🍽️ <strong className="text-[#63330f]">7:00 AM – 8:00 AM:</strong> Morning Breakfast (9 Oct)</span>
                <span>•</span>
                <span>📶 <strong className="text-[#104e70]">Free Wi-Fi:</strong> Team Heads Only</span>
                <span>•</span>
                <span>📱 <strong className="text-[#63330f]">Other Members:</strong> Use Personal Mobile Data / Hotspot</span>
                <span>•</span>
              </div>

              <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center space-x-6 text-[11px] sm:text-xs font-cinzel font-bold text-[#361c0a]">
                <span>🧃 <strong className="text-[#63330f]">12:00 PM – 1:00 PM:</strong> Fresh Juice (8 Oct)</span>
                <span>•</span>
                <span>☕🍪 <strong className="text-[#63330f]">3:00 PM – 4:00 PM:</strong> Tea & Snacks (8 Oct)</span>
                <span>•</span>
                <span>🍽️ <strong className="text-[#63330f]">8:00 PM – 9:30 PM:</strong> Dinner Feast (8 Oct)</span>
                <span>•</span>
                <span>☕ <strong className="text-[#63330f]">11:00 PM – 12:00 AM:</strong> Midnight Tea (8 Oct)</span>
                <span>•</span>
                <span>☕ <strong className="text-[#63330f]">5:30 AM – 6:30 AM:</strong> Sunrise Coffee (9 Oct)</span>
                <span>•</span>
                <span>🍽️ <strong className="text-[#63330f]">7:00 AM – 8:00 AM:</strong> Morning Breakfast (9 Oct)</span>
                <span>•</span>
                <span>📶 <strong className="text-[#104e70]">Free Wi-Fi:</strong> Team Heads Only</span>
                <span>•</span>
                <span>📱 <strong className="text-[#63330f]">Other Members:</strong> Use Personal Mobile Data / Hotspot</span>
                <span>•</span>
              </div>
            </div>
          </div>

          {/* PART 1: 6 MEAL & REFRESHMENT SCHEDULE ITEMS */}
          <div>
            <div className="flex items-center space-x-2 mb-3.5 sm:mb-4 px-1">
              <Utensils className="w-4 h-4 text-[#75441b]" />
              <h4 className="font-cinzel text-xs sm:text-sm font-black text-[#4e2b10] tracking-wider uppercase">
                Provisions & Refreshment Timeline (6 Sessions)
              </h4>
            </div>

            {/* Symmetrical 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {MEAL_SCHEDULE.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="group/item flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-[#2e190b]/[0.06] hover:bg-[#2e190b]/[0.12] border border-[#5c3614]/20 hover:border-[#6b421a]/45 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                  >
                    <div>
                      {/* Top Row: Numeral Seal + Title & Day Badge */}
                      <div className="flex items-start justify-between gap-2.5 mb-2.5">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {/* Vintage Red Wax Seal */}
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#8a1c1c] via-[#5c0e0e] to-[#360505] border border-[#d4af37]/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <ItemIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffe57f]" />
                          </div>

                          <div className="min-w-0">
                            <span className="font-cinzel font-extrabold text-[9px] sm:text-[10px] text-[#63330f] tracking-wider block uppercase">
                              SESSION {item.numeral} • {item.dayLabel}
                            </span>
                            <h5 className="font-pirate text-base sm:text-xl text-[#2b1709] tracking-wide leading-tight truncate">
                              {item.title}
                            </h5>
                          </div>
                        </div>

                        {/* Prominent Visible Timing Badge */}
                        <div className="flex-shrink-0 text-right">
                          <span className="inline-flex items-center space-x-1 font-mono font-bold text-[11px] sm:text-xs text-[#2c1404] bg-[#5c3514]/15 px-2.5 sm:px-3 py-1 rounded-full border border-[#5c3514]/30 shadow-sm">
                            <Clock className="w-3 h-3 text-[#63330f]" />
                            <span>{item.time}</span>
                          </span>
                        </div>
                      </div>

                      {/* Content Description */}
                      <p className="font-cinzel text-xs sm:text-[13px] font-semibold text-[#2b1709] leading-relaxed drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] mb-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer: Date & Venue */}
                    <div className="pt-2 border-t border-[#5c3614]/15 flex items-center justify-between text-[10px] sm:text-[11px] font-cinzel text-[#63330f] font-bold">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#75441b]" />
                        <span>{item.date}</span>
                      </span>
                      <span className="text-[#804212] italic">
                        {item.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PART 2: WI-FI INFORMATION (CLEARLY DISTINGUISHABLE FROM FOOD SCHEDULE) */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t-2 border-dashed border-[#5c3614]/30">
            {/* Dedicated Oceanic / Network Container with Distinct Styling */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0c2333]/15 via-[#0e2c45]/20 to-[#081a29]/15 border-2 border-[#155e75]/45 shadow-sm text-left">
              
              {/* Wi-Fi Section Header */}
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-[#155e75]/30">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#075985] via-[#0c4a6e] to-[#082f49] border-2 border-[#38bdf8] flex items-center justify-center text-[#e0f2fe] shadow-md flex-shrink-0">
                  <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-[#38bdf8]" />
                </div>
                <div>
                  <span className="font-cinzel text-[9px] sm:text-[11px] font-black text-[#0c4a6e] uppercase tracking-widest block">
                    CAMPUS NETWORK DIRECTIVE // WI-FI GUIDELINES
                  </span>
                  <h4 className="font-pirate text-lg sm:text-2xl md:text-3xl text-[#082f49] tracking-wide leading-tight">
                    Wi-Fi Connectivity Information
                  </h4>
                </div>
              </div>

              {/* Two Distinguishable Policy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-4">
                
                {/* 1. Team Heads / Leaders Wi-Fi */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/40 border-2 border-[#0284c7]/40 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/50 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0369a1]" />
                        </div>
                        <h5 className="font-cinzel font-black text-xs sm:text-sm text-[#082f49] uppercase tracking-wider">
                          For Team Heads Only
                        </h5>
                      </div>
                      <span className="font-cinzel text-[9px] sm:text-[10px] font-extrabold text-[#0369a1] bg-[#0284c7]/15 px-2 py-0.5 rounded-full border border-[#0284c7]/30">
                        FREE WI-FI ACCESS
                      </span>
                    </div>

                    <p className="font-cinzel text-xs sm:text-[13px] font-semibold text-[#0f354f] leading-relaxed drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                      <strong>Free Wi-Fi will be available for Team Heads only.</strong>
                    </p>
                    <p className="font-cinzel text-[11px] sm:text-xs text-[#1e4d6e] leading-snug mt-1">
                      Official campus network login credentials will be provided directly to the Captain (Team Head) at port check-in for squad repository updates and project submission.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#0284c7]/20 text-[10px] font-cinzel font-bold text-[#0369a1] flex items-center space-x-1.5">
                    <Wifi className="w-3 h-3 text-[#0284c7]" />
                    <span>One high-speed Wi-Fi login per registered team.</span>
                  </div>
                </div>

                {/* 2. Other Participants Mobile Connection */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white/40 border-2 border-[#d97706]/40 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-[#d97706]/20 border border-[#d97706]/50 flex items-center justify-center">
                          <Smartphone className="w-3.5 h-3.5 text-[#b45309]" />
                        </div>
                        <h5 className="font-cinzel font-black text-xs sm:text-sm text-[#451a03] uppercase tracking-wider">
                          Other Participants
                        </h5>
                      </div>
                      <span className="font-cinzel text-[9px] sm:text-[10px] font-extrabold text-[#b45309] bg-[#d97706]/15 px-2 py-0.5 rounded-full border border-[#d97706]/30">
                        OWN DATA REQUIRED
                      </span>
                    </div>

                    <p className="font-cinzel text-xs sm:text-[13px] font-semibold text-[#451a03] leading-relaxed drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">
                      <strong>Other participants are requested to use their own mobile internet/data connection</strong> for additional network access.
                    </p>
                    <p className="font-cinzel text-[11px] sm:text-xs text-[#5c2d12] leading-snug mt-1">
                      Secondary laptops and member devices should connect via personal mobile hotspots to ensure steady internet availability throughout the coding period.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#d97706]/20 text-[10px] font-cinzel font-bold text-[#b45309] flex items-center space-x-1.5">
                    <AlertCircle className="w-3 h-3 text-[#b45309]" />
                    <span>Please ensure active data balance before arrival at port.</span>
                  </div>
                </div>

              </div>

              {/* Distinguishable Bottom Advisory Note */}
              <div className="p-2.5 sm:p-3 rounded-lg bg-[#0e2c45]/15 border border-[#155e75]/35 flex items-center space-x-2 text-[10px] sm:text-[11.5px] font-cinzel text-[#082f49] font-bold">
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0284c7] flex-shrink-0" />
                <span>
                  Team Heads may share tethered connectivity with their squad members as necessary for collaborative development.
                </span>
              </div>
            </div>
          </div>

          {/* Brethren Court Seal of Authenticity */}
          <div className="mt-5 sm:mt-8 pt-3 sm:pt-4 border-t border-[#6b421a]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-cinzel text-[#4e2b10] font-bold px-1 text-center sm:text-left">
            <div className="flex items-center space-x-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#75441b] flex-shrink-0" />
              <span>PORT MESS HALL CATERING // COMPLIMENTARY FOR ALL PIRATE SQUADS</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#8a1c1c] flex-shrink-0">
              <Wifi className="w-3.5 h-3.5" />
              <span>OFFICIAL IT ADMIRALTY NETWORK POLICY</span>
            </div>
          </div>

        </div>
      </AncientParchmentScroll>
    </section>
  );
};

export default RefreshmentScheduleSection;
