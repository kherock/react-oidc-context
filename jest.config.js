module.exports = {
    preset: "ts-jest",
    clearMocks: true,
    testURL: "https://www.example.com/",
    testEnvironment: "jsdom",
    globals: {
        "ts-jest": {
            // skip ts-jest type checking, incremental compilation with tsc is much faster
            isolatedModules: true,
        },
    },
};
