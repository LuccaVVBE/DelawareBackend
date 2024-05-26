module.exports = {
    port: 9000,
    log: {
        level: "info",
        disabled: false
    },
    env: "test",
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    }
};