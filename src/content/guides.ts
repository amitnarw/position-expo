import type { Guide } from './types';

export const guides: Guide[] = [
  {
    slug: 'consent',
    order: 1,
    title: 'Consent as a practice',
    kicker: 'The first plate',
    summary:
      'Consent is not a formality at the start. It is a conversation that continues for as long as you are touching.',
    minutes: 4,
    topics: ['consent', 'communication', 'foundations'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Most people learn consent as a single question at the beginning: yes or no. In practice it is closer to a running conversation. Bodies change during sex — an angle that felt good a minute ago can start to ache, a mood can shift, someone can become tired or distracted. Consent that only happens once cannot account for any of that.',
      },
      { kind: 'heading', text: 'What ongoing consent sounds like' },
      {
        kind: 'list',
        items: [
          '"Is this still good?" — asked plainly, not as an interruption.',
          '"Slower." — a complete sentence, no explanation required.',
          '"I want to stop." — answered with "okay", not with a question.',
          '"Can I try something?" — before, not during.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Notice that none of these are dramatic. The goal is not a formal check-in every ninety seconds; it is a low, constant signal that either of you can change your mind without it becoming an event.',
      },
      { kind: 'heading', text: 'The three practical rules' },
      {
        kind: 'steps',
        items: [
          {
            title: 'Ask before something new',
            text: 'New positions, new sensations, new toys. A quick "I want to try something, is that okay?" is enough.',
          },
          {
            title: 'Agree on a stop signal',
            text: 'A word, a tap, a hand squeeze. Pick one before you need it, and make sure it works when someone cannot speak.',
          },
          {
            title: 'Treat a no as information',
            text: 'A no is not a rejection of you. It is the most useful thing your partner can tell you, and the fastest route to something that actually works.',
          },
        ],
      },
      {
        kind: 'note',
        title: 'A note on enthusiasm',
        text: 'Consent is the floor, not the goal. You are aiming for an enthusiastic yes, not a reluctant one. If you are not sure which you are getting, ask.',
      },
    ],
  },
  {
    slug: 'talking',
    order: 2,
    title: 'Talking about it',
    kicker: 'Before, during, after',
    summary:
      'A short guide to the conversations that make everything else easier — including the awkward ones.',
    minutes: 5,
    topics: ['communication', 'scripts', 'foundations'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Talking about sex is awkward for almost everyone, including people who are good at it. The awkwardness does not go away with practice so much as it stops mattering. What helps is having a few sentences ready.',
      },
      { kind: 'heading', text: 'Before: the low-stakes version' },
      {
        kind: 'paragraph',
        text: 'Have this conversation away from the bedroom, fully clothed, with no expectation that anything follows. It is much easier to be honest on a sofa at four in the afternoon than in bed at midnight.',
      },
      {
        kind: 'list',
        items: [
          '"What do you want more of?"',
          '"Is there anything you have been curious about?"',
          '"Is there anything you would rather not do?"',
          '"How do you want me to check in without breaking the mood?"',
        ],
      },
      { kind: 'heading', text: 'During: short and specific' },
      {
        kind: 'paragraph',
        text: 'Long sentences do not survive arousal. Aim for three or four words. "A little slower." "Higher." "Right there." "I need a break." These are not mood-killers, they are directions — and directions make the whole thing better.',
      },
      { kind: 'heading', text: 'After: the part people skip' },
      {
        kind: 'paragraph',
        text: 'The ten minutes after are where trust is built. A hand on the back, a glass of water, one honest sentence: "I liked that." Or: "That thing at the end was a lot — can we talk about it tomorrow?" Both are good.',
      },
      {
        kind: 'quote',
        text: 'You are not trying to say the perfect thing. You are trying to stay in the room.',
      },
    ],
  },
  {
    slug: 'anatomy',
    order: 3,
    title: 'The honest map',
    kicker: 'What actually responds',
    summary:
      'A plain-language overview of anatomy, without diagrams, assumptions or claims.',
    minutes: 6,
    topics: ['anatomy', 'education', 'foundations'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Bodies vary enormously, and most of what is taught about anatomy in this context is either simplified into uselessness or based on one narrow model. What follows is deliberately general. Your body is the specific case.',
      },
      { kind: 'heading', text: 'Most sensation is not where people expect' },
      {
        kind: 'paragraph',
        text: 'For many people, the most responsive areas are external: the clitoris, the glans, the inner thighs, the neck, the lower back. Penetration is one sensation among many rather than the main event, and for a large number of people it is not sufficient on its own.',
      },
      { kind: 'heading', text: 'The clitoris is larger than it looks' },
      {
        kind: 'paragraph',
        text: 'The visible part is the tip of a structure that extends internally on both sides. This is why indirect pressure — above, around, or to one side — often works better than direct contact, especially as arousal builds.',
      },
      { kind: 'heading', text: 'The prostate and the G-spot' },
      {
        kind: 'paragraph',
        text: 'Both are areas that some people find intensely pleasurable and others find neutral or uncomfortable. There is no universal spot and no technique that works for everyone. If something does not feel good, that is ordinary, not a failure.',
      },
      { kind: 'heading', text: 'Arousal is not linear' },
      {
        kind: 'paragraph',
        text: 'The common model — build up, peak, finish — describes one pattern. Many people experience plateau, distraction, dips, second peaks, or none of the above. Erections come and go, and that is normal rather than a verdict.',
      },
      {
        kind: 'note',
        title: 'No medical claims',
        text: 'Nothing here is medical advice. Pain during sex, persistent difficulty with arousal, or sudden changes are worth talking about with a clinician.',
      },
    ],
  },
  {
    slug: 'rhythm',
    order: 4,
    title: 'Rhythm and pace',
    kicker: 'Why slower is usually better',
    summary:
      'The mechanics of timing: why the first minute matters more than the twentieth, and how to vary pace without losing momentum.',
    minutes: 4,
    topics: ['technique', 'pace', 'sensation'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Almost every problem in bed is a pacing problem. Too fast too soon, then a plateau nobody can climb off, then a finish that feels more like a release than a pleasure. Slowing down is not a technique for people who cannot keep up; it is the technique.',
      },
      { kind: 'heading', text: 'Start below the ceiling' },
      {
        kind: 'paragraph',
        text: 'Begin at a pace you could maintain for ten minutes without thinking about it. Most people start at the intensity they want to end at, which leaves nowhere to go and shortens the whole arc.',
      },
      { kind: 'heading', text: 'Three dials' },
      {
        kind: 'steps',
        items: [
          {
            title: 'Speed',
            text: 'The obvious one, and the least interesting. Changing speed suddenly is more effective than changing it gradually.',
          },
          {
            title: 'Pressure',
            text: 'Deeper is not better. The angle and how much weight is behind it often matter more than depth.',
          },
          {
            title: 'Stillness',
            text: 'Stopping completely for five seconds is the most underused move in this atlas. It resets sensitivity.',
          },
        ],
      },
      { kind: 'heading', text: 'Stay out of the target' },
      {
        kind: 'paragraph',
        text: 'If the goal is a particular sensation, circling it — moving close, backing off, returning — produces far more than aiming straight at it. This is true for almost every body.',
      },
      {
        kind: 'paragraph',
        text: 'And when in doubt, go slower than feels necessary. You can always add speed. You cannot get the first ten minutes back.',
      },
    ],
  },
  {
    slug: 'comfort',
    order: 5,
    title: 'Bodies, not contortions',
    kicker: 'Making positions fit you',
    summary:
      'Height, weight, flexibility and pain. How to adjust a position instead of enduring it.',
    minutes: 5,
    topics: ['comfort', 'props', 'accessibility'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Positions in books are drawn for a body that does not exist. Real bodies are different heights, have sore knees, bad backs, limited flexibility, and get tired. Every plate in this atlas is a starting point to be adjusted.',
      },
      { kind: 'heading', text: 'The four things you can change' },
      {
        kind: 'list',
        items: [
          'Height — a pillow, a cushion, a folded towel, the edge of the bed.',
          'Angle — usually solved by raising one partner’s hips a few centimetres.',
          'Support — forearms instead of wrists, a wall, a chair back, a hand under a thigh.',
          'Duration — nothing has to last as long as you think.',
        ],
      },
      { kind: 'heading', text: 'The knee rule' },
      {
        kind: 'paragraph',
        text: 'If a knee is bent past ninety degrees and bearing weight, it will complain. Put a cushion under it, or move to a position where it is not loaded. Knees are the most commonly injured joint in this context and the easiest to protect.',
      },
      { kind: 'heading', text: 'The back rule' },
      {
        kind: 'paragraph',
        text: 'Never lift with a rounded back. If a position needs one partner to hold the other up, get close, bend the knees, and keep the load against your body. And never arch over anything that leaves the neck unsupported.',
      },
      { kind: 'heading', text: 'Adapt, do not endure' },
      {
        kind: 'paragraph',
        text: 'Pain is not part of the technique. If something hurts — sharp, burning, pinching, or a deep ache — change it or stop. There is always another angle, and it is usually one pillow away.',
      },
      {
        kind: 'note',
        title: 'Adaptive bodies',
        text: 'If you or your partner are disabled, injured, pregnant, or recovering, the useful question is not "which position is allowed" but "what does this body need supported". The gift plate and the hands plate are usually the best places to start.',
      },
    ],
  },
  {
    slug: 'lubricant',
    order: 6,
    title: 'Lubricant, plainly',
    kicker: 'The least romantic, most useful thing',
    summary:
      'What to use, what not to use, and why more is usually the answer.',
    minutes: 3,
    topics: ['lubricant', 'comfort', 'practical'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Lubricant is not a workaround for a problem. It is equipment, in the same category as a pillow or a condom. Nearly everything in this atlas is more comfortable with it, including things that do not seem to need it.',
      },
      { kind: 'heading', text: 'The two base types' },
      {
        kind: 'steps',
        items: [
          {
            title: 'Water-based',
            text: 'Safe with every condom and toy material. Absorbs into the skin, so you will need to reapply. The reliable default.',
          },
          {
            title: 'Silicone-based',
            text: 'Lasts much longer and is better for water or long sessions. Do not use with silicone toys — it degrades them.',
          },
        ],
      },
      { kind: 'heading', text: 'What to avoid' },
      {
        kind: 'list',
        items: [
          'Oil-based products with latex condoms — they dissolve the latex.',
          'Anything with warming or tingling additives on sensitive skin. These are a common cause of irritation.',
          'Spit. It dries quickly and is not as slippery as it seems.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Apply more than you think you need, and keep it within reach. The awkward pause to find the bottle is much shorter than the discomfort of not having it.',
      },
      {
        kind: 'note',
        title: 'If it stings',
        text: 'Stop and wash it off. Persistent burning or irritation is not normal and is worth checking with a clinician.',
      },
    ],
  },
  {
    slug: 'after',
    order: 7,
    title: 'The return',
    kicker: 'Aftercare without the performance',
    summary:
      'The ten minutes after, and why they matter more than most people admit.',
    minutes: 4,
    topics: ['aftercare', 'care', 'communication'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Aftercare has a clinical reputation it does not deserve. It is not a checklist or a recovery protocol. It is the recognition that you have just been very close to someone, and that the closeness does not stop when the sex does.',
      },
      { kind: 'heading', text: 'What people usually need' },
      {
        kind: 'list',
        items: [
          'Warmth — a blanket, a body, a shower.',
          'Water and something to eat.',
          'Quiet, or company. These are opposites and both are common.',
          'Reassurance, especially if something new or intense happened.',
        ],
      },
      { kind: 'heading', text: 'Ask, do not assume' },
      {
        kind: 'paragraph',
        text: 'Some people want to be held and talked to. Others want five minutes alone. Neither is a rejection. The useful question is short: "What do you need right now?" — and then believe the answer.',
      },
      { kind: 'heading', text: 'The debrief' },
      {
        kind: 'paragraph',
        text: 'When you are both settled, say one true thing about it. What worked, what you want again, what you would change. This is how a good encounter becomes a good habit instead of an isolated event.',
      },
      {
        kind: 'quote',
        text: 'The last ten minutes are part of the sex. They are not the clean-up.',
      },
    ],
  },
  {
    slug: 'boundaries',
    order: 8,
    title: 'When it goes wrong',
    kicker: 'Pausing, stopping, resetting',
    summary:
      'How to stop well, and how to come back after a difficult moment.',
    minutes: 4,
    topics: ['boundaries', 'safety', 'communication'],
    blocks: [
      {
        kind: 'paragraph',
        text: 'Things go wrong. Someone cries, someone dissociates, someone pushes past a boundary, someone cannot stop laughing, someone gets angry. None of this means the relationship is broken. How you handle the next five minutes matters far more than the thing itself.',
      },
      { kind: 'heading', text: 'Stop cleanly' },
      {
        kind: 'steps',
        items: [
          {
            title: 'Stop all movement first',
            text: 'Not slowly taper. Stop. Then separate enough to see each other.',
          },
          {
            title: 'Say what is happening',
            text: '"I need to stop." — no explanation owed, no negotiation in the moment.',
          },
          {
            title: 'Make space',
            text: 'Physical space, light, water. Give the nervous system something ordinary to work with.',
          },
          {
            title: 'Check in later',
            text: 'Not mid-crisis. Once both of you are calm, ask what happened and what would help next time.',
          },
        ],
      },
      { kind: 'heading', text: 'If you are the one who was hurt' },
      {
        kind: 'paragraph',
        text: 'You do not have to manage the other person’s guilt. If a boundary was crossed, say so plainly and expect it to be taken seriously. An apology that turns into a request for reassurance is not an apology.',
      },
      { kind: 'heading', text: 'Coming back' },
      {
        kind: 'paragraph',
        text: 'After a difficult moment, the next encounter can feel loaded. Go back to something easy and familiar — the hands plate, the shell, the hush. Rebuilding trust is done in small, unremarkable moments, not in grand gestures.',
      },
    ],
  },
];
