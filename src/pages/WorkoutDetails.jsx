import React, { useEffect, useState } from "react";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const workoutPlans = {
  "Full Body": {
    Monday: [
      {
        exercise: "Inclined Dumbbell Press",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Set bench to a 30–45° incline.\n2. Lie back with dumbbells at chest level.\n3. Press up until arms are almost straight.\n4.Lower slowly to chest level.\n5. Repeat for desired reps.",
      },
      {
        exercise: "Barbell Squat",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Place barbell on your upper traps.\n2. Stand with feet shoulder-width apart.\n3. Keep chest up and core tight.\n4. Squat down by bending hips and knees, keeping back straight.\n5. Lower until thighs are parallel to the floor.\n6. Push through heels to stand back up.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Dumbbell Chest Supported Row",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set a bench to a 30–45° incline.\n2. Lie chest-down on the bench with a dumbbell in each hand.\n3. Let your arms hang straight down, palms facing in.\n4. Row the dumbbells up by pulling your elbows toward the ceiling.\n5. Squeeze your shoulder blades at the top.\n6. Lower the weights slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Leg Curls",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Lie face down on the leg curl machine.\n2. Position the pad just above your heels, on the back of your lower legs.\n3. Grab the handles and brace your core.\n4. Curl your legs up by bringing your heels toward your glutes.\n5. Squeeze your hamstrings at the top.\n6. Lower the weight slowly back to the starting position.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Dumbbell Bicep Curls",
        sets: 3,
        reps: "10-12",
        instructions:
          "1. Stand tall with a dumbbell in each hand, arms fully extended.\n2. Keep your elbows close to your sides and palms facing forward.\n3. Curl the dumbbells up toward your shoulders.\n4. Squeeze your biceps at the top.\n5. Lower the weights slowly back down.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Tricep Pushdown",
        sets: 3,
        reps: "10-12",
        instructions:
          "1. Stand facing a cable machine with a straight or rope attachment.\n2. Grab the handle with both hands, elbows close to your sides.\n3. Start with your elbows bent at about 90 degrees.\n4. Push the handle down until your arms are fully extended.\n5. Squeeze your triceps at the bottom.\n6. Slowly return to the starting position.\n7. Repeat for desired reps.",
      },
    ],
    Tuesday: "Rest",
    Wednesday: [
      {
        exercise: "Barbell Bench Press",
        sets: 3,
        reps: "3-5",
        instructions:
          "1. Lie flat on a bench with feet planted on the floor.\n2. Grip the bar slightly wider than shoulder-width.\n3. Unrack the bar and hold it above your chest with arms extended.\n4. Lower the bar slowly to mid-chest level.\n5. Press the bar back up until your arms are fully extended.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Romanian Deadlift",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs.\n2. Keep a slight bend in your knees and your back straight.\n3. Hinge at the hips to lower the weights down the front of your legs.\n4. Lower until you feel a stretch in your hamstrings (back stays flat).\n5. Drive your hips forward to return to the starting position.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Lat Pulldowns",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Sit at a lat pulldown machine and grab the bar with a wide grip, palms facing forward.\n2. Secure your thighs under the pads and sit upright.\n3. Pull the bar down toward your upper chest, squeezing your shoulder blades together.\n4. Pause briefly at the bottom of the movement.\n5. Slowly return the bar to the starting position with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Walking Lunges",
        sets: 3,
        reps: "10-12",
        instructions:
          "1. Stand tall with dumbbells at your sides or hands on your hips.\n2. Step forward with one leg and lower your back knee toward the floor.\n3. Keep your front knee above your ankle and chest upright.\n4. Push through your front heel to stand and bring your back leg forward.\n5. Continue stepping forward, alternating legs.\n6. Repeat for desired reps or distance.",
      },
      {
        exercise: "Cable Lateral Raise",
        sets: 3,
        reps: "10-12",
        instructions:
          "1. Stand next to a low cable machine with the handle in the hand farthest from the machine.\n2. Keep your arm straight or slightly bent, at your side.\n3. Raise your arm out to the side until it’s at shoulder height.\n4. Pause briefly at the top.\n5. Lower the handle slowly back to the starting position.\n6. Repeat for desired reps, then switch sides.",
      },
      {
        exercise: "Reverse Crunches",
        sets: 3,
        reps: "12-15",
        instructions:
          "1. Lie flat on your back with your hands by your sides or under your hips.\n2. Bend your knees and lift your legs so your thighs are perpendicular to the floor.\n3. Use your lower abs to curl your hips off the ground, bringing your knees toward your chest.\n4. Pause briefly at the top.\n5. Slowly lower your hips back down without letting your feet touch the floor.\n6. Repeat for desired reps.",
      },
    ],
    Thursday: "Rest",
    Friday: [
      {
        exercise: "Seated Dumbbell Shoulder Press",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Sit on a bench with back support, holding a dumbbell in each hand at shoulder height.\n2. Keep your feet flat on the floor and core engaged.\n3. Press the dumbbells upward until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the dumbbells back down to shoulder height with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Dumbbell Row",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Hold a dumbbell in one hand and place the opposite knee and hand on a bench.\n2. Keep your back flat and core tight.\n3. Let the dumbbell hang straight down.\n4. Row the dumbbell up toward your hip, squeezing your shoulder blade.\n5. Lower the dumbbell slowly back down.\n6. Repeat for desired reps, then switch sides.",
      },
      {
        exercise: "Hip Thrust",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Sit on the ground with your upper back against a bench and feet flat on the floor.\n2. Place a barbell or weight across your hips.\n3. Brace your core and drive through your heels to lift your hips upward.\n4. Squeeze your glutes at the top until your body forms a straight line from shoulders to knees.\n5. Lower your hips back down with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Leg Extensions",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Sit on the leg extension machine with your back against the pad.\n2. Place your feet under the padded bar.\n3. Adjust the machine so the bar rests on your lower shins.\n4. Extend your legs fully by straightening your knees.\n5. Pause briefly at the top.\n6. Lower the weight back down slowly.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Chest Flyes",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Lie flat on a bench holding a dumbbell in each hand above your chest.\n2. Keep a slight bend in your elbows.\n3. Slowly lower the dumbbells out to the sides in a wide arc.\n4. Stop when your elbows are about level with the bench.\n5. Bring the dumbbells back up, squeezing your chest.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Calf Raises",
        sets: 3,
        reps: "12-15",
        instructions:
          "1. Stand with feet hip-width apart, near a wall or support for balance.\n2. Raise your heels off the ground by pushing through the balls of your feet.\n3. Pause briefly at the top, squeezing your calves.\n4. Slowly lower your heels back down.\n5. Repeat for desired reps.",
      },
      {
        exercise: "Reverse Cable Flyes",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Stand between two cable machines with handles set at shoulder height.\n2. Grab the left handle with your right hand and the right handle with your left hand.\n3. Step back slightly, keeping arms slightly bent.\n4. Pull the cables outward and backward, squeezing your shoulder blades.\n5. Pause briefly at the end of the movement.\n6. Slowly return to the starting position.\n7. Repeat for desired reps.",
      },
    ],
    Saturday: "Rest",
    Sunday: "Rest",
  },
  "Push-Pull-Legs": {
    Monday: [
      {
        exercise: "Inclined Barbell Bench Press",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Set bench to a 30–45° incline.\n2. Lie back with dumbbells at chest level.\n3. Press up until arms are almost straight.\n4.Lower slowly to chest level.\n5. Repeat for desired reps.",
      },
      {
        exercise: "Standing Dumbbell Shoulder Press",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Stand with feet shoulder-width apart, holding a dumbbell in each hand at shoulder height.\n2. Keep your core engaged and back straight.\n3. Press the dumbbells overhead until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the dumbbells back down to shoulder height with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Flat Dumbbell Press",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Lie flat on a bench holding a dumbbell in each hand at chest level.\n2. Keep your feet flat on the floor and core engaged.\n3. Press the dumbbells upward until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the dumbbells back down to chest level with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Dumbbell Lateral Raise",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Stand with a dumbbell in each hand at your sides.\n2. Keep a slight bend in your elbows.\n3. Raise your arms out to the sides until they’re at shoulder height.\n4. Pause briefly at the top.\n5. Lower the dumbbells slowly back down.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Seated Decline Cable Flyes",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set cable pulleys to the highest position and sit on a decline bench between them.\n2. Grab the handles with palms facing down.\n3. With a slight bend in your elbows, pull the cables downward and together in front of you.\n4. Squeeze your chest at the bottom.\n5. Slowly return to the start.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Incline Dumbbell Overhead Extensions",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set an incline bench at about 45° and sit back with a dumbbell held by both hands.\n2. Lift the dumbbell overhead with arms fully extended.\n3. Keep your elbows close to your head as you lower the dumbbell behind your head.\n4. Pause briefly at the bottom.\n5. Extend your arms back overhead.\n6. Repeat for desired reps.",
      },
    ],
    Tuesday: [
      {
        exercise: "Pull-ups/Assisted Pull-ups",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Grab the pull-up bar with palms facing away (overhand grip), hands shoulder-width apart.\n2. Hang fully extended with your shoulders engaged.\n3. Pull yourself up by driving your elbows down and back until your chin clears the bar.\n4. Pause briefly at the top.\n5. Lower yourself back down with control.\n6. Repeat for desired reps.\n\nFor assisted pull-ups, use a resistance band or assisted pull-up machine to reduce weight.",
      },
      {
        exercise: "Barbell Row",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Stand with feet hip-width apart, holding a barbell with an overhand grip.\n2. Bend at the hips, keeping your back flat and knees slightly bent.\n3. Let the bar hang at arm’s length.\n4. Pull the bar toward your lower chest or upper stomach.\n5. Squeeze your shoulder blades together at the top.\n6. Lower the bar back down with control.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Lat Pulldown",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Sit at a lat pulldown machine and grab the bar with a wide grip, palms facing forward.\n2. Secure your thighs under the pads and sit upright.\n3. Pull the bar down toward your upper chest, squeezing your shoulder blades together.\n4. Pause briefly at the bottom of the movement.\n5. Slowly return the bar to the starting position with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Chest Supported Rear Delt Row",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set an incline bench at about 30–45°.\n2. Lie chest-down on the bench holding dumbbells with palms facing each other.\n3. Let your arms hang straight down.\n4. Row the dumbbells out to the sides, squeezing your rear delts and shoulder blades.\n5. Pause briefly at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Barbell Curl",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Stand tall holding a barbell with an underhand grip, hands shoulder-width apart.\n2. Keep your elbows close to your sides.\n3. Curl the barbell up toward your shoulders.\n4. Squeeze your biceps at the top.\n5. Lower the barbell slowly back down.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Kneeling Face Pulls",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Kneel in front of a cable machine with the rope attachment set at upper chest height.\n2. Grab the rope with both hands, palms facing inward.\n3. Pull the rope towards your face, separating your hands and squeezing your shoulder blades.\n4. Pause briefly at the peak contraction.\n5. Slowly extend your arms back to the starting position.\n6. Repeat for desired reps.",
      },
    ],
    Wednesday: [
      {
        exercise: "Barbell Squat",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Place barbell on your upper traps.\n2. Stand with feet shoulder-width apart.\n3. Keep chest up and core tight.\n4. Squat down by bending hips and knees, keeping back straight.\n5. Lower until thighs are parallel to the floor.\n6. Push through heels to stand back up.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Hip Thrusts",
        sets: 3,
        reps: "12-15",
        instructions:
          "1. Sit on the ground with your upper back against a bench and feet flat on the floor.\n2. Place a barbell or weight across your hips.\n3. Brace your core and drive through your heels to lift your hips upward.\n4. Squeeze your glutes at the top until your body forms a straight line from shoulders to knees.\n5. Lower your hips back down with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Glute Ham Raise",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Position your feet securely under the footplate or rollers of a glute ham raise machine.\n2. Start kneeling with your body upright and core engaged.\n3. Slowly lower your upper body forward by extending at the knees.\n4. Use your hamstrings and glutes to control the descent.\n5. When you can no longer control the descent, push off slightly with your hands to return.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Standing Single Leg Calf Raise",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand on one foot near a wall or support for balance.\n2. Raise your heel off the ground by pushing through the ball of your foot.\n3. Pause briefly at the top, squeezing your calf.\n4. Slowly lower your heel back down.\n5. Repeat for desired reps, then switch legs.",
      },
      {
        exercise: "Bulgarian Split Squats",
        sets: 3,
        reps: "8-12 (each side)",
        instructions:
          "1. Stand a few feet in front of a bench, facing away from it.\n2. Place one foot behind you on the bench.\n3. Keep your chest up and core engaged.\n4. Lower your back knee toward the floor by bending your front leg.\n5. Go down until your front thigh is about parallel to the ground.\n6. Push through your front heel to return to the starting position.\n7. Repeat for desired reps, then switch legs.",
      },
    ],
    Thursday: "Rest",
    Friday: [
      {
        exercise: "Barbell Bench Press",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Lie flat on a bench with feet planted on the floor.\n2. Grip the bar slightly wider than shoulder-width.\n3. Unrack the bar and hold it above your chest with arms extended.\n4. Lower the bar slowly to mid-chest level.\n5. Press the bar back up until your arms are fully extended.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Barbell Overhead Press",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Stand with feet shoulder-width apart, holding the barbell at shoulder height with palms facing forward.\n2. Keep your core tight and back straight.\n3. Press the barbell overhead until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the barbell back down to shoulder height with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Inclined Dumbbell Press",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set bench to a 30–45° incline.\n2. Lie back with dumbbells at chest level.\n3. Press up until arms are almost straight.\n4.Lower slowly to chest level.\n5. Repeat for desired reps.",
      },
      {
        exercise: "Dumbbell Lateral Raise",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Stand with a dumbbell in each hand at your sides.\n2. Keep a slight bend in your elbows.\n3. Raise your arms out to the sides until they’re at shoulder height.\n4. Pause briefly at the top.\n5. Lower the dumbbells slowly back down.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Seated Decline Cable Flyes",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set the cable pulleys to the highest position and sit on a decline bench between them.\n2. Grab the handles with palms facing down.\n3. With a slight bend in your elbows, pull the cables downward and together in front of you.\n4. Squeeze your chest at the bottom of the movement.\n5. Slowly return to the starting position.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Incline Dumbbell Overhead Extensions",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set an incline bench at about 45° and sit back with a dumbbell held by both hands.\n2. Lift the dumbbell overhead with arms fully extended.\n3. Keep your elbows close to your head as you lower the dumbbell behind your head.\n4. Pause briefly at the bottom.\n5. Extend your arms back overhead.\n6. Repeat for desired reps.",
      },
    ],
    Saturday: [
      {
        exercise: "Deadlift",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Bend at hips and knees to grip the bar just outside your legs.\n3. Keep your back flat and chest up.\n4. Drive through your heels, extending hips and knees to lift the bar.\n5. Stand tall with shoulders back at the top.\n6. Lower the bar by hinging at hips and bending knees.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Seated Cable Row",
        sets: 3,
        reps: "10-12",
        instructions:
          "1. Sit at a cable row machine with feet on the footrests.\n2. Grab the handle with both hands, arms extended.\n3. Keep your back straight and chest up.\n4. Pull the handle toward your lower chest, squeezing your shoulder blades together.\n5. Pause briefly at the end.\n6. Slowly extend your arms back to the start.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Lat Pulldown",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Sit at a lat pulldown machine and grab the bar with a wide grip, palms facing forward.\n2. Secure your thighs under the pads and sit upright.\n3. Pull the bar down toward your upper chest, squeezing your shoulder blades together.\n4. Pause briefly at the bottom of the movement.\n5. Slowly return the bar to the starting position with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Chest Supported Rear Delt Row",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Set an incline bench at about 30–45°.\n2. Lie chest-down on the bench holding dumbbells with palms facing each other.\n3. Let your arms hang straight down.\n4. Row the dumbbells out to the sides, squeezing your rear delts and shoulder blades.\n5. Pause briefly at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Barbell Curl",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Stand tall holding a barbell with an underhand grip, hands shoulder-width apart.\n2. Keep your elbows close to your sides.\n3. Curl the barbell up toward your shoulders.\n4. Squeeze your biceps at the top.\n5. Lower the barbell slowly back down.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Kneeling Face Pulls",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Kneel in front of a cable machine with the rope attachment set at upper chest height.\n2. Grab the rope with both hands, palms facing inward.\n3. Pull the rope towards your face, separating your hands and squeezing your shoulder blades.\n4. Pause briefly at the peak contraction.\n5. Slowly extend your arms back to the starting position.\n6. Repeat for desired reps.",
      },
    ],
    Sunday: [
      {
        exercise: "Barbell Squat",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Place barbell on your upper traps.\n2. Stand with feet shoulder-width apart.\n3. Keep chest up and core tight.\n4. Squat down by bending hips and knees, keeping back straight.\n5. Lower until thighs are parallel to the floor.\n6. Push through heels to stand back up.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Hip Thrusts",
        sets: 3,
        reps: "12-15",
        instructions:
          "1. Sit on the ground with your upper back against a bench and feet flat on the floor.\n2. Place a barbell or weight across your hips.\n3. Brace your core and drive through your heels to lift your hips upward.\n4. Squeeze your glutes at the top until your body forms a straight line from shoulders to knees.\n5. Lower your hips back down with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Glute Ham Raise",
        sets: 3,
        reps: "10-15",
        instructions:
          "1. Position your feet securely under the footplate or rollers of a glute ham raise machine.\n2. Start kneeling with your body upright and core engaged.\n3. Slowly lower your upper body forward by extending at the knees.\n4. Use your hamstrings and glutes to control the descent.\n5. When you can no longer control the descent, push off slightly with your hands to return.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Standing Single Leg Calf Raise",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand on one foot near a wall or support for balance.\n2. Raise your heel off the ground by pushing through the ball of your foot.\n3. Pause briefly at the top, squeezing your calf.\n4. Slowly lower your heel back down.\n5. Repeat for desired reps, then switch legs.",
      },
      {
        exercise: "Bulgarian Split Squats",
        sets: 3,
        reps: "8-12 (each side)",
        instructions:
          "1. Stand a few feet in front of a bench, facing away from it.\n2. Place one foot behind you on the bench.\n3. Keep your chest up and core engaged.\n4. Lower your back knee toward the floor by bending your front leg.\n5. Go down until your front thigh is about parallel to the ground.\n6. Push through your front heel to return to the starting position.\n7. Repeat for desired reps, then switch legs.",
      },
    ],
  },
  "Upper/Lower Split": {
    Monday: [
      {
        exercise: "Inclined Dumbbell Press",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Set bench to a 30–45° incline.\n2. Lie back with dumbbells at chest level.\n3. Press up until arms are almost straight.\n4.Lower slowly to chest level.\n5. Repeat for desired reps.",
      },
      {
        exercise: "Chest Supported Row",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Set an incline bench at about 30–45°.\n2. Lie chest-down on the bench holding dumbbells with palms facing each other.\n3. Let your arms hang straight down.\n4. Row the dumbbells up toward your hips, squeezing your shoulder blades.\n5. Pause briefly at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Barbell Overhead Press",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand with feet shoulder-width apart, holding the barbell at shoulder height with palms facing forward.\n2. Keep your core tight and back straight.\n3. Press the barbell overhead until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the barbell back down to shoulder height with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Lat Pulldowns",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Sit at a lat pulldown machine and grab the bar with a wide grip, palms facing forward.\n2. Secure your thighs under the pads and sit upright.\n3. Pull the bar down toward your upper chest, squeezing your shoulder blades together.\n4. Pause briefly at the bottom of the movement.\n5. Slowly return the bar to the starting position with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Inclined Dumbbell Curl",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set an incline bench at about 45° and sit back holding a dumbbell in each hand.\n2. Let your arms hang straight down with palms facing forward.\n3. Keep your elbows close to your sides.\n4. Curl the dumbbells up toward your shoulders.\n5. Squeeze your biceps at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Inclined Dumbbell Extensions",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set an incline bench at about 45° and sit back holding a dumbbell with both hands.\n2. Lift the dumbbell overhead with arms fully extended.\n3. Keep your elbows close to your head as you lower the dumbbell behind your head.\n4. Pause briefly at the bottom.\n5. Extend your arms back overhead.\n6. Repeat for desired reps.",
      },
    ],
    Tuesday: [
      {
        exercise: "Barbell Squat",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Place barbell on your upper traps.\n2. Stand with feet shoulder-width apart.\n3. Keep chest up and core tight.\n4. Squat down by bending hips and knees, keeping back straight.\n5. Lower until thighs are parallel to the floor.\n6. Push through heels to stand back up.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Romanian Deadlift",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs.\n2. Keep a slight bend in your knees and your back straight.\n3. Hinge at the hips to lower the weights down the front of your legs.\n4. Lower until you feel a stretch in your hamstrings (back stays flat).\n5. Drive your hips forward to return to the starting position.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Bulgarian Split Squats",
        sets: 3,
        reps: "8-12 (each side)",
        instructions:
          "1. Stand a few feet in front of a bench, facing away from it.\n2. Place one foot behind you on the bench.\n3. Keep your chest up and core engaged.\n4. Lower your back knee toward the floor by bending your front leg.\n5. Go down until your front thigh is about parallel to the ground.\n6. Push through your front heel to return to the starting position.\n7. Repeat for desired reps, then switch legs.",
      },
      {
        exercise: "Glute Ham Raise",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Position your feet securely under the footplate or rollers of a glute ham raise machine.\n2. Start kneeling with your body upright and core engaged.\n3. Slowly lower your upper body forward by extending at the knees.\n4. Use your hamstrings and glutes to control the descent.\n5. When you can no longer control the descent, push off slightly with your hands to return.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Standing Single Calf Raise",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand on one foot near a wall or support for balance.\n2. Raise your heel off the ground by pushing through the ball of your foot.\n3. Pause briefly at the top, squeezing your calf.\n4. Slowly lower your heel back down.\n5. Repeat for desired reps, then switch legs.",
      },
    ],
    Wednesday: "Rest",
    Thursday: [
      {
        exercise: "Barbell Bench Press",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Lie flat on a bench with feet planted on the floor.\n2. Grip the bar slightly wider than shoulder-width.\n3. Unrack the bar and hold it above your chest with arms extended.\n4. Lower the bar slowly to mid-chest level.\n5. Press the bar back up until your arms are fully extended.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Chest Supported Row",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Set an incline bench at about 30–45°.\n2. Lie chest-down on the bench holding dumbbells with palms facing each other.\n3. Let your arms hang straight down.\n4. Row the dumbbells up toward your hips, squeezing your shoulder blades.\n5. Pause briefly at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Standing Dumbbell Shoulder Press",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand with feet shoulder-width apart, holding a dumbbell in each hand at shoulder height.\n2. Keep your core engaged and back straight.\n3. Press the dumbbells overhead until your arms are fully extended.\n4. Pause briefly at the top.\n5. Lower the dumbbells back down to shoulder height with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Lat Pulldowns",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Sit at a lat pulldown machine and grab the bar with a wide grip, palms facing forward.\n2. Secure your thighs under the pads and sit upright.\n3. Pull the bar down toward your upper chest, squeezing your shoulder blades together.\n4. Pause briefly at the bottom of the movement.\n5. Slowly return the bar to the starting position with control.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Inclined Dumbbell Curl",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set an incline bench at about 45° and sit back holding a dumbbell in each hand.\n2. Let your arms hang straight down with palms facing forward.\n3. Keep your elbows close to your sides.\n4. Curl the dumbbells up toward your shoulders.\n5. Squeeze your biceps at the top.\n6. Lower the dumbbells slowly back down.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Inclined Dumbbell Extensions",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Set an incline bench at about 45° and sit back holding a dumbbell with both hands.\n2. Lift the dumbbell overhead with arms fully extended.\n3. Keep your elbows close to your head as you lower the dumbbell behind your head.\n4. Pause briefly at the bottom.\n5. Extend your arms back overhead.\n6. Repeat for desired reps.",
      },
    ],
    Friday: [
      {
        exercise: "Barbell Squat",
        sets: 3,
        reps: "6-8",
        instructions:
          "1. Place barbell on your upper traps.\n2. Stand with feet shoulder-width apart.\n3. Keep chest up and core tight.\n4. Squat down by bending hips and knees, keeping back straight.\n5. Lower until thighs are parallel to the floor.\n6. Push through heels to stand back up.\n7. Repeat for desired reps.",
      },
      {
        exercise: "Romanian Deadlift",
        sets: 3,
        reps: "8-10",
        instructions:
          "1. Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs.\n2. Keep a slight bend in your knees and your back straight.\n3. Hinge at the hips to lower the weights down the front of your legs.\n4. Lower until you feel a stretch in your hamstrings (back stays flat).\n5. Drive your hips forward to return to the starting position.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Bulgarian Split Squats",
        sets: 3,
        reps: "8-12 (each side)",
        instructions:
          "1. Stand a few feet in front of a bench, facing away from it.\n2. Place one foot behind you on the bench.\n3. Keep your chest up and core engaged.\n4. Lower your back knee toward the floor by bending your front leg.\n5. Go down until your front thigh is about parallel to the ground.\n6. Push through your front heel to return to the starting position.\n7. Repeat for desired reps, then switch legs.",
      },
      {
        exercise: "Glute Ham Raise",
        sets: 3,
        reps: "8-12",
        instructions:
          "1. Position your feet securely under the footplate or rollers of a glute ham raise machine.\n2. Start kneeling with your body upright and core engaged.\n3. Slowly lower your upper body forward by extending at the knees.\n4. Use your hamstrings and glutes to control the descent.\n5. When you can no longer control the descent, push off slightly with your hands to return.\n6. Repeat for desired reps.",
      },
      {
        exercise: "Standing Single Calf Raise",
        sets: 3,
        reps: "6-10",
        instructions:
          "1. Stand on one foot near a wall or support for balance.\n2. Raise your heel off the ground by pushing through the ball of your foot.\n3. Pause briefly at the top, squeezing your calf.\n4. Slowly lower your heel back down.\n5. Repeat for desired reps, then switch legs.",
      },
    ],
    Saturday: "Rest",
    Sunday: "Rest",
  },
  Custom: {},
};

export default function WorkoutDetails({ user }) {
  const [userData, setUserData] = useState(null);
  const [customPlanData, setCustomPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentDay = days[new Date().getDay()];

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [weightLog, setWeightLog] = useState({});
  const [customPlanName, setCustomPlanName] = useState("");
  const [showLogFieldFor, setShowLogFieldFor] = useState(null);

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressData, setProgressData] = useState([]);

  // Fetch user data (to get selected plan)
  useEffect(() => {
    if (!user) return;

    async function fetchUserData() {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${user._id}`);
        if (res.ok) {
          const data = await res.json();
          console.log("User data with currentPlan:", data);
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    }

    fetchUserData();
  }, [user]);

  // Fetch custom workout if selected
  useEffect(() => {
    async function fetchCustomWorkout() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/custom-workout/user/${user._id}`
        );
        if (res.ok) {
          const data = await res.json();
          const transformed = {};
          data.days.forEach(({ day, exercises }) => {
            transformed[day] = exercises;
          });
          setCustomPlanData(transformed);
          setCustomPlanName(data.name || "Custom Plan");
        }
      } catch (err) {
        console.error("Failed to fetch custom workout", err);
      } finally {
        setLoading(false);
      }
    }

    if (userData?.currentPlan === "Custom") {
      fetchCustomWorkout();
    } else {
      setLoading(false);
    }
  }, [userData, user]);

  if (loading) {
    return <p className="text-center p-6">Loading workout...</p>;
  }

  const planKey = userData?.currentPlan || "Full Body";

  const selectedPlanName =
    planKey === "Custom" ? customPlanName || "Custom Plan" : planKey;

  const selectedPlan =
    planKey === "Custom" ? customPlanData : workoutPlans[planKey];

  const todayWorkout = selectedPlan?.[currentDay];

  const handleShowInstructions = (exercise) => {
    setSelectedExercise(exercise);
    setShowInstructionModal(true);
  };

  const handleLogWeight = (exerciseName) => {
    setShowLogFieldFor((prev) => (prev === exerciseName ? null : exerciseName));
  };

  const handleSaveWeightLog = async (exerciseName, sets, reps) => {
    const weight = weightLog[exerciseName];

    if (!weight || isNaN(weight)) {
      alert("Please enter a valid weight.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/workout-progress/${encodeURIComponent(
          exerciseName
        )}/log`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            weight: parseFloat(weight),
            sets: sets.toString(),
            reps: reps.toString(),
          }),
        }
      );

      if (res.ok) {
        console.log("Weight log saved!");
      } else {
        console.error("Failed to save log");
      }
    } catch (err) {
      console.error("Error logging weight:", err);
    }

    setShowLogFieldFor(null);
  };

  const handleViewProgress = async (exerciseName) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/workout-progress/${encodeURIComponent(
          exerciseName
        )}?userId=${user._id}`
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Progress data fetched:", data);

        setSelectedExercise({ exercise: exerciseName });
        setProgressData(data); 
        setShowProgressModal(true);
      } else {
        console.error("Failed to fetch progress data");
      }
    } catch (error) {
      console.error("Error fetching progress data", error);
    }
  };

  return (
    <div className="p-6 max-w-2xxl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {selectedPlanName} - {currentDay}
      </h1>

      {todayWorkout === "Rest" ? (
        <p className="text-center text-gray-600">Today is a rest day. 🛌</p>
      ) : Array.isArray(todayWorkout) && todayWorkout.length > 0 ? (
        <ul className="space-y-3">
          {todayWorkout.map((exercise, idx) => (
            <li
              key={idx}
              className="bg-white p-4 border rounded shadow-sm text-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>{exercise.exercise}</strong>: {exercise.sets} sets ×{" "}
                  {exercise.reps} reps
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleShowInstructions(exercise)}
                    className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded"
                  >
                    ℹ️ Instructions
                  </button>
                  <button
                    onClick={() => handleLogWeight(exercise.exercise)}
                    className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded"
                  >
                    🏋️ Log Weight
                  </button>
                  <button
                    onClick={() => handleViewProgress(exercise.exercise)}
                    className="ml-2 px-4 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                    style={{ backgroundColor: "#AAD59E" }}
                  >
                    View Progress
                  </button>
                </div>
              </div>

              {/* Weight input field */}
              {showLogFieldFor === exercise.exercise && (
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="Enter weight (lbs)"
                    value={weightLog[exercise.exercise] || ""}
                    onChange={(e) =>
                      setWeightLog({
                        ...weightLog,
                        [exercise.exercise]: e.target.value,
                      })
                    }
                    className="border p-1 text-sm w-32 mr-2"
                  />
                  <button
                    onClick={() => {
                      handleSaveWeightLog(
                        exercise.exercise,
                        exercise.sets,
                        exercise.reps
                      );
                    }}
                    className="px-2 py-1 bg-green-300 hover:bg-green-400 text-xs rounded"
                    style={{ backgroundColor: "#AAD59E" }}
                  >
                    Save
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Today is a rest day!</p>
      )}

      {/* Instruction Modal */}
      {showInstructionModal && selectedExercise && (
        <div className="fixed inset-0 bg-gray-100/30 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">
              {selectedExercise.exercise}
            </h2>
            <p className="whitespace-pre-line text-sm text-gray-700">
              {selectedExercise.instructions ||
                "No instructions available for this exercise."}
            </p>
            <div className="text-right mt-4">
              <button
                onClick={() => setShowInstructionModal(false)}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgressModal && (
        <div className="fixed inset-0 bg-gray-100/30 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-md max-h-96 overflow-y-auto relative inline-block min-w-[400px] max-w-[95vw]">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-bold break-words max-w-[calc(100%-2.5rem)]">
                Progress for {selectedExercise?.exercise}
              </h2>
            </div>

            {progressData.length === 0 ? (
              <p className="text-gray-500">No logs yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {progressData.map((entry, idx) => (
                  <li key={idx} className="border p-2 rounded bg-gray-50">
                    <div>
                      <strong>
                        {entry.sets} × {entry.reps}
                      </strong>{" "}
                      @ <strong>{entry.weight} lbs</strong>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(entry.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowProgressModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              style={{ backgroundColor: "#FFB6B6" }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
