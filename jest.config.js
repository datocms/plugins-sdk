module.exports = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        // The repo's tsconfig compiles to CommonJS for the published builds.
        // Jest, however, loads test modules as ESM (see the default-esm
        // preset), so ts-jest must emit ESM too — otherwise the compiled
        // `exports`/`require` references throw "exports is not defined".
        tsconfig: { module: 'esnext' },
      },
    ],
  },
};
