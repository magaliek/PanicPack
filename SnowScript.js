function createSnowflake() {
    const snowflake = document.createElement('img');
    snowflake.src = 'assets/snowflake.png';
    snowflake.classList.add('snowflake');

    snowflake.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 6 + 4;
    snowflake.style.height = size + 'px';
    snowflake.style.width = size + 'px';

    const endY = Math.random() * 40 + 30;
    snowflake.style.setProperty('--endY', `${endY}vh`);

    const duration = Math.random() * 50 + 20;
    snowflake.style.animation = `fall ${duration}s linear forwards`;

    document.getElementById('snowContainer').appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, (duration + 0.1) * 1000);
}

setInterval(createSnowflake, 1500);

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: 'gameContainer', // important!
    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);

