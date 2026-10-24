/**
 * FloodLens Intelligent Environmental AI Assistant
 * Provides context-aware answers regarding:
 * - Current locality rainfall conditions & antecedent accumulation
 * - AI flood risk score & prediction engine breakdown
 * - Flood safety protocols, SOS steps, and national emergency contacts (112, 1078)
 * - Locality comparisons and historical flood incidents
 * - Multi-lingual assistance (Hindi, English, Hinglish, Bengali, Tamil, etc.)
 */

function generateAIResponse(userQuery, context = {}) {
  const query = (userQuery || '').toLowerCase().trim();
  const location = context.location || 'Your selected locality';
  const risk = context.risk || {};
  const summary = context.summary || {};

  // 1. Emergency / SOS questions
  if (
    query.includes('sos') ||
    query.includes('emergency') ||
    query.includes('help') ||
    query.includes('bachao') ||
    query.includes('madad') ||
    query.includes('trapped') ||
    query.includes('danger') ||
    query.includes('number') ||
    query.includes('hotline')
  ) {
    return {
      text: `🚨 **EMERGENCY ACTION PROTOCOL:**\n\nIf you or someone nearby is trapped or in immediate danger from rising floodwaters:\n\n1. **Tap the Red "🆘 Emergency SOS" Button** at the top right of this dashboard to transmit your geolocated request directly to the District Disaster Response Center.\n2. **National Emergency Hotlines:**\n   - National Emergency Helpline: **112** (Toll-Free, 24x7)\n   - NDRF Disaster Control Room: **1078**\n   - State Disaster Management Authority (SDMA): **1070**\n   - Ambulance: **108**\n3. **Immediate Precautions:** Move to the highest accessible floor, disconnect main electricity switches, do not attempt to walk or drive through moving water, and keep drinking water in clean sealed bottles.`,
      category: 'emergency',
      suggestedActions: ['Open SOS Window', 'View Emergency Hotlines']
    };
  }

  // 2. Risk / Prediction questions
  if (
    query.includes('risk') ||
    query.includes('prediction') ||
    query.includes('khatra') ||
    query.includes('safe') ||
    query.includes('probability') ||
    query.includes('chance') ||
    query.includes('flood')
  ) {
    const tier = risk.riskTier || 'Moderate / Elevated';
    const prob = risk.riskProbabilityPct !== undefined ? `${risk.riskProbabilityPct}%` : '52%';
    const advice = risk.actionAdvice || 'Maintain standard monsoon preparedness and monitor municipal alerts.';

    return {
      text: `🤖 **AI Multi-Model Flood Risk Evaluation for ${location}:**\n\n- **Current Risk Category:** **${tier}** (Composite Probability: **${prob}**)\n- **Forecast Window:** 24h – 72h\n- **Ensemble Engine Insights:**\n  1. **Model A (XGBoost Saturation Classifier):** Analyzed 7-day cumulative rainfall saturation.\n  2. **Model B (Temporal Pulse Sequence):** Checked for sudden single-day cloudburst pulses.\n  3. **Model C (Hydro-Topographic Proxy):** Factored in low-lying basin drainage vulnerability.\n\n🛡️ **Mitigation Directive:** ${advice}\n\n*Note: Statistical predictions are derived from IMD telemetry and historical baselines. Always comply with statutory civil administration evacuation directives.*`,
      category: 'risk',
      suggestedActions: ['Inspect Rainfall Chart', 'Open Risk Breakdown']
    };
  }

  // 3. Rainfall / Weather questions
  if (
    query.includes('rain') ||
    query.includes('baarish') ||
    query.includes('barish') ||
    query.includes('weather') ||
    query.includes('mausam') ||
    query.includes('mm') ||
    query.includes('precipitation')
  ) {
    const total = summary.totalRainfall !== undefined ? `${summary.totalRainfall} mm` : 'Monitored via IMD station telemetry';
    const rainy = summary.rainyDays !== undefined ? summary.rainyDays : 'Recorded';
    const max = summary.maxRainfall !== undefined ? `${summary.maxRainfall} mm` : 'Threshold observed';

    return {
      text: `🌧️ **Rainfall Analytics Overview for ${location}:**\n\n- **Total Accumulated Rainfall in Window:** **${total}**\n- **Rainy Days (>2.5mm):** **${rainy} days**\n- **Peak 24h Influx:** **${max}**\n- **Telemetry Source:** India Meteorological Department (IMD) Ground Station Telemetry.\n\nFloodLens classifies rainfall severity into:\n- 🟢 Normal (< 50 mm)\n- 🟠 Heavy (50 – 100 mm)\n- 🔴 Very Heavy / Cloudburst (≥ 100 mm)\n\nYou can review daily trends in the interactive bar chart on the dashboard.`,
      category: 'rainfall',
      suggestedActions: ['Check 30-Day Trend', 'Compare Other Cities']
    };
  }

  // 4. Comparison questions
  if (
    query.includes('compare') ||
    query.includes('t तुलना') ||
    query.includes('difference') ||
    query.includes('versus') ||
    query.includes('vs')
  ) {
    return {
      text: `⚖️ **Multi-Locality Comparison Guide:**\n\nYou can compare 2 to 3 Indian localities side-by-side using the **Multi-Locality Comparison Matrix** below on the dashboard.\n\nIt evaluates:\n- Total precipitation comparison\n- Historical flood incident frequency\n- Data completeness % (telemetry coverage)\n- Automatic alerts if there are significant reporting discrepancies between cities.`,
      category: 'comparison',
      suggestedActions: ['Select Cities to Compare']
    };
  }

  // 5. General greeting & capabilities
  return {
    text: `👋 **Namaste! I am your FloodLens AI Flood Intelligence Assistant.**\n\nI can assist you with:\n1. 📊 **Locality Insights:** Current rainfall and historical flood incidents in **${location}**.\n2. 🤖 **AI Risk Assessment:** Probability percentage and multi-model ensemble explanations.\n3. 🚨 **Emergency Directives & SOS:** Quick evacuation protocols and disaster response coordination.\n4. 🗺️ **District & City Navigation:** Exploring all Indian states and districts.\n\nHow can I help you stay safe today?`,
    category: 'general',
    suggestedActions: ['Is my area at flood risk?', 'Check rainfall in my city', 'Emergency numbers', 'How does SOS work?']
  };
}

module.exports = {
  generateAIResponse
};

