import {
    trigger,
    transition,
    style,
    query,
    group,
    animate,
    AnimationMetadata
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
    transition('LoginPage => RegisterPage', [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#FFFFFF'
            }),
        ], { optional: true }),
        group([
            query(':leave', [
                animate(
                    '700ms ease-out',
                    style({
                        transform: 'translateX(-120%)',
                        opacity: 0,
                    })
                ),
            ], { optional: true }),
            query(':enter', [
                style({
                    transform: 'translateX(-120%)',
                    opacity: 0,
                    backgroundColor: '#FFFFFF'
                }),
                animate(
                    '700ms 200ms ease-out',
                    style({
                        transform: 'translateX(0%)',
                        opacity: 1,
                    })
                ),
            ], { optional: true }),
        ]),
    ]),
    transition('RegisterPage => LoginPage', [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#FFFFFF'
            }),
        ], { optional: true }),
        group([
            query(':leave', [
                animate(
                    '700ms ease-out',
                    style({
                        transform: 'translateX(120%)',
                        opacity: 0,
                    })
                ),
            ], { optional: true }),
            query(':enter', [
                style({
                    transform: 'translateX(-120%)',
                    opacity: 0,
                    backgroundColor: '#FFFFFF'
                }),
                animate(
                    '700ms 200ms ease-out',
                    style({
                        transform: 'translateX(0%)',
                        opacity: 1,
                    })
                ),
            ], { optional: true }),
        ]),
    ]),
]);