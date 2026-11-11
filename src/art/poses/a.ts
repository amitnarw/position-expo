import type { Pose } from '../body';

/** Plates 1–12. */
export const a: Record<string, Pose> = {
  'first-light': {
    id: 'first-light',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [200, 610],
        shoulders: [285, 618],
        chest: [400, 622],
        hip: [515, 620],
        armA: [
          [300, 680],
          [386, 700],
        ],
        armB: [
          [296, 548],
          [380, 528],
        ],
        legA: [
          [630, 592],
          [752, 610],
        ],
        legB: [
          [632, 640],
          [754, 664],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [196, 462],
        shoulders: [280, 476],
        chest: [395, 490],
        hip: [505, 504],
        armA: [
          [318, 416],
          [410, 400],
        ],
        armB: [
          [330, 520],
          [420, 540],
        ],
        legA: [
          [620, 540],
          [740, 590],
        ],
        legB: [
          [628, 566],
          [748, 616],
        ],
      },
    ],
  },

  'the-tide': {
    id: 'the-tide',
    padding: 70,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        hip: [430, 520],
        chest: [520, 470],
        shoulders: [604, 424],
        head: [658, 396],
        armA: [
          [610, 372],
          [672, 356],
        ],
        armB: [
          [574, 468],
          [636, 484],
        ],
        legA: [
          [326, 574],
          [226, 620],
        ],
        legB: [
          [352, 602],
          [258, 654],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        hip: [448, 584],
        chest: [538, 534],
        shoulders: [622, 488],
        head: [694, 472],
        armA: [
          [572, 522],
          [512, 546],
        ],
        armB: [
          [608, 550],
          [664, 580],
        ],
        legA: [
          [344, 638],
          [244, 684],
        ],
        legB: [
          [370, 666],
          [276, 718],
        ],
      },
    ],
  },

  'two-vessels': {
    id: 'two-vessels',
    padding: 80,
    figures: [
      {
        tone: 'ink',
        depth: 'front',
        hip: [400, 628],
        chest: [398, 546],
        shoulders: [396, 470],
        head: [394, 400],
        armA: [
          [452, 508],
          [508, 486],
        ],
        armB: [
          [352, 512],
          [318, 560],
        ],
        legA: [
          [504, 566],
          [566, 642],
        ],
        legB: [
          [494, 592],
          [552, 664],
        ],
      },
      {
        tone: 'clay',
        depth: 'back',
        hip: [600, 628],
        chest: [602, 546],
        shoulders: [604, 470],
        head: [606, 400],
        armA: [
          [548, 508],
          [492, 490],
        ],
        armB: [
          [648, 512],
          [682, 560],
        ],
        legA: [
          [496, 572],
          [440, 650],
        ],
        legB: [
          [506, 598],
          [454, 672],
        ],
      },
    ],
  },

  'the-lean': {
    id: 'the-lean',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [316, 236],
        shoulders: [318, 322],
        chest: [322, 412],
        hip: [328, 508],
        armA: [
          [352, 360],
          [410, 392],
        ],
        armB: [
          [350, 440],
          [406, 470],
        ],
        legA: [
          [322, 630],
          [316, 748],
        ],
        legB: [
          [336, 634],
          [346, 754],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [430, 250],
        shoulders: [432, 336],
        chest: [436, 424],
        hip: [442, 518],
        armA: [
          [398, 360],
          [340, 384],
        ],
        armB: [
          [400, 440],
          [348, 462],
        ],
        legA: [
          [446, 638],
          [450, 756],
        ],
        legB: [
          [428, 642],
          [414, 760],
        ],
      },
    ],
  },

  aloft: {
    id: 'aloft',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [180, 620],
        shoulders: [266, 628],
        chest: [380, 632],
        hip: [496, 630],
        armA: [
          [292, 682],
          [378, 700],
        ],
        legA: [
          [612, 600],
          [736, 618],
        ],
        legB: [
          [616, 650],
          [740, 672],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [488, 274],
        shoulders: [484, 344],
        chest: [478, 430],
        hip: [470, 520],
        armA: [
          [512, 380],
          [556, 440],
        ],
        armB: [
          [452, 390],
          [416, 450],
        ],
        legA: [
          [560, 592],
          [566, 672],
        ],
      },
    ],
  },

  'half-turn': {
    id: 'half-turn',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [180, 620],
        shoulders: [266, 628],
        chest: [380, 632],
        hip: [496, 630],
        armA: [
          [292, 682],
          [378, 700],
        ],
        legA: [
          [612, 600],
          [736, 618],
        ],
        legB: [
          [616, 650],
          [740, 672],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [556, 312],
        shoulders: [532, 382],
        chest: [506, 458],
        hip: [474, 536],
        armA: [
          [576, 420],
          [626, 470],
        ],
        armB: [
          [518, 418],
          [566, 472],
        ],
        legA: [
          [432, 598],
          [420, 676],
        ],
      },
    ],
  },

  'the-arch': {
    id: 'the-arch',
    padding: 70,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [168, 668],
        shoulders: [215, 604],
        chest: [370, 556],
        hip: [520, 618],
        armA: [
          [250, 690],
          [320, 706],
        ],
        armB: [
          [244, 624],
          [318, 636],
        ],
        legA: [
          [620, 548],
          [660, 670],
        ],
        legB: [
          [636, 572],
          [690, 688],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [548, 268],
        shoulders: [552, 340],
        chest: [552, 424],
        hip: [548, 512],
        armA: [
          [512, 372],
          [470, 424],
        ],
        armB: [
          [592, 376],
          [632, 430],
        ],
        legA: [
          [470, 582],
          [462, 664],
        ],
      },
    ],
  },

  'the-current': {
    id: 'the-current',
    padding: 60,
    figures: [
      {
        tone: 'ink',
        depth: 'front',
        head: [200, 498],
        shoulders: [280, 518],
        chest: [380, 558],
        hip: [470, 598],
        armA: [
          [330, 468],
          [420, 498],
        ],
        armB: [
          [336, 572],
          [422, 592],
        ],
        legA: [
          [570, 618],
          [690, 638],
        ],
        legB: [
          [576, 650],
          [696, 676],
        ],
      },
      {
        tone: 'clay',
        depth: 'back',
        head: [800, 478],
        shoulders: [720, 508],
        chest: [620, 554],
        hip: [530, 598],
        armA: [
          [670, 458],
          [580, 488],
        ],
        armB: [
          [664, 566],
          [578, 590],
        ],
        legA: [
          [430, 622],
          [310, 642],
        ],
        legB: [
          [424, 654],
          [304, 680],
        ],
      },
    ],
  },

  threshold: {
    id: 'threshold',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [180, 598],
        shoulders: [266, 604],
        chest: [360, 608],
        hip: [450, 606],
        armA: [
          [292, 658],
          [378, 676],
        ],
        legA: [
          [540, 600],
          [600, 690],
        ],
        legB: [
          [546, 632],
          [610, 718],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [612, 306],
        shoulders: [608, 380],
        chest: [604, 468],
        hip: [600, 558],
        armA: [
          [558, 478],
          [544, 618],
        ],
        armB: [
          [642, 484],
          [632, 638],
        ],
        legA: [
          [612, 648],
          [618, 762],
        ],
        legB: [
          [642, 650],
          [654, 766],
        ],
      },
    ],
  },

  'the-chair': {
    id: 'the-chair',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [330, 300],
        shoulders: [332, 390],
        chest: [336, 480],
        hip: [342, 570],
        armA: [
          [380, 430],
          [430, 456],
        ],
        legA: [
          [360, 660],
          [372, 760],
        ],
        legB: [
          [330, 664],
          [322, 764],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [446, 284],
        shoulders: [442, 372],
        chest: [436, 460],
        hip: [428, 550],
        armA: [
          [404, 398],
          [352, 418],
        ],
        armB: [
          [400, 458],
          [350, 484],
        ],
        legA: [
          [498, 596],
          [516, 702],
        ],
      },
    ],
  },

  'the-fold': {
    id: 'the-fold',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [180, 638],
        shoulders: [266, 638],
        chest: [380, 634],
        hip: [490, 626],
        armA: [
          [292, 690],
          [376, 702],
        ],
        legA: [
          [560, 520],
          [690, 470],
        ],
        legB: [
          [540, 544],
          [676, 496],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [636, 310],
        shoulders: [632, 380],
        chest: [626, 460],
        hip: [620, 540],
        armA: [
          [596, 400],
          [552, 452],
        ],
        armB: [
          [668, 404],
          [706, 460],
        ],
        legA: [
          [560, 608],
          [556, 696],
        ],
      },
    ],
  },

  'low-tide': {
    id: 'low-tide',
    padding: 60,
    figures: [
      {
        tone: 'clay',
        depth: 'back',
        head: [200, 640],
        shoulders: [290, 636],
        chest: [400, 630],
        hip: [510, 620],
        armA: [
          [306, 692],
          [388, 704],
        ],
        legA: [
          [620, 636],
          [742, 650],
        ],
        legB: [
          [622, 658],
          [744, 674],
        ],
      },
      {
        tone: 'ink',
        depth: 'front',
        head: [266, 566],
        shoulders: [340, 554],
        chest: [430, 548],
        hip: [520, 544],
        armA: [
          [352, 600],
          [422, 620],
        ],
        armB: [
          [358, 512],
          [432, 494],
        ],
        legA: [
          [640, 558],
          [760, 588],
        ],
        legB: [
          [646, 582],
          [766, 612],
        ],
      },
    ],
  },
};
