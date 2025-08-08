import HealthEntry from '../models/HealthEntry.mjs';
import MoodEntry   from '../models/MoodEntry.mjs';

export const getHealthGuide = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayEntry = await HealthEntry.findOne({
      email: email.toLowerCase(),
      date: { $gte: todayStart, $lt: todayEnd }
    }).lean();

    const dailyMetrics = {
      steps:    todayEntry?.steps    ?? 0,
      sleep:    todayEntry?.sleep    ?? 0,
      water:    todayEntry?.water    ?? 0,
      exercise: todayEntry?.exercise ?? 0,
      mood:     todayEntry?.mood     ?? 'Neutral',
    };

    const dailyRecs = {
      steps: [],
      sleep: [],
      water: [],
      exercise: [],
      mood: [],
    };
    if (dailyMetrics.steps < 5000) {
      dailyRecs.steps.push(
        'Under 5 000 steps today? Try a 10 min walk after lunch to boost your movement.'
      );
    }
    if (dailyMetrics.sleep < 7) {
      dailyRecs.sleep.push(
        'You’ve slept under 7 h. Wind down with a 15 min screen-free routine before bed.'
      );
    }
    if (dailyMetrics.water < 8) {
      dailyRecs.water.push(
        'Less than 8 glasses of water. Keep a reusable bottle handy to sip regularly.'
      );
    }
    if (dailyMetrics.exercise < 0.5) {
      dailyRecs.exercise.push(
        'Only a bit of exercise so far—try a quick bodyweight circuit (squats, lunges, push-ups).'
      );
    }
    if (['sad','angry','stressed','tired'].includes(dailyMetrics.mood.toLowerCase())) {
      dailyRecs.mood.push(
        'Not feeling great? Take 5 deep breaths or a 5 min walk outside for a mental reset.'
      );
    }

    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6); 

    const weekEntries = await HealthEntry.find({
      email: email.toLowerCase(),
      date: { $gte: weekAgo }
    }).lean();

    const weekCount = weekEntries.length || 1;
    const avgSleep  = +(weekEntries.reduce((s,e)=>s + (e.sleep||0), 0) / weekCount).toFixed(1);
    const avgSteps  = Math.round(weekEntries.reduce((s,e)=>s + (e.steps||0), 0) / weekCount);
    const avgEx     = +(weekEntries.reduce((s,e)=>s + (e.exercise||0), 0) / weekCount).toFixed(1);
    const avgWater  = Math.round(weekEntries.reduce((s,e)=>s + (e.water||0), 0) / weekCount);

    const moodEntries = await MoodEntry.find({
      email: email.toLowerCase(),
      date:  { $gte: weekAgo }
    }).lean();
    const sadCount = moodEntries.filter(m=>m.mood.toLowerCase()==='sad').length;

    const weeklyMetrics = {
      avgSleep,
      avgSteps,
      avgExercise: avgEx,
      avgWater,
      sadCount,
      moodHits: moodEntries.length,
    };

    const weeklyRecs = [];
    if (avgSleep < 7) {
      weeklyRecs.push(
        'Over the past week, you averaged under 7 h of sleep. Consider a consistent bedtime routine (same time each night).'
      );
    }
    if (avgSteps < 5000) {
      weeklyRecs.push(
        'Your weekly average steps are below 5 000. Try setting a goal for a 20 min walk on three evenings this week.'
      );
    }
    if (sadCount > moodEntries.length * 0.3) {
      weeklyRecs.push(
        '“Sad” popped up in over 30% of your logs—try a guided journal prompt or a 5 min breathing break daily.'
      );
    }
    if (weeklyRecs.length === 0) {
      weeklyRecs.push(
        'Fantastic week! Youʼre hitting your key metrics—keep reinforcing these healthy habits.'
      );
    }

    res.json({ dailyMetrics, dailyRecs, weeklyMetrics, weeklyRecs });
  }
  catch(err) {
    console.error('Health guide error:', err);
    res.status(500).json({ message: 'Server error generating health guide' });
  }
};

