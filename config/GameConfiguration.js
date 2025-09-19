import {TIMERTYPE} from "./TimerType.js";

export const GameConfiguration = {
    timer: false,
    timerType: TIMERTYPE.BACKWARD,
    seconds: 13,
    onboardingText: 'Drag objects into the box to bring with you. ' +
        'Every object has a value, some objects deduct points and others add points to your score. ' +
        'The more useful objects you add the higher your score will be. To rotate object, press space.',
    ending1: "you survived 3 days before dying",
    ending2: 'you survived 2 weeks before managing to find shelter. ' +
        'Most of your things were taken by the surviving authorities. ' +
        'You received some compensation for it and will probably survive if you keep your wits about you.',
    ending3: 'Not only did you survive, you managed to rescue people and together you guys created a micro community ' +
        'with a very high chance of survival and growth. However, always beware of social dynamics.',
    ending4: 'Not only did you survive, you managed to rescue people and together you guys created a ' +
        'micro community with a very high chance of survival and growth. However, always beware of social dynamics.',
    ending5: 'you are the packing God. Humanity was saved thanks to your packing genius. How did you do it? You legend.',

    score1: 50,
    score2: 100,
    score3: 180,
    score4: 199,
}