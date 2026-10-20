# datocms-react-ui

## 3.1.0-next.0

### Minor Changes

- **Breaking:** build the components from the components of the DatoCMS interface
  
  This is a new major line, and it starts at 3.1.0: npm has two old 3.0 alphas, which are deprecated. react-ui 3 is a new library. Its components are the components of the CMS itself, thus a plugin looks and behaves like the CMS around it.
  
  - Import the CSS once, and each component from its own path: `import Button from 'datocms-react-ui/Button'`. There is no root import.
  - Put a `Canvas` around the content of each hook that renders in a frame, as in 2.x. The components read the host through it.
  - The names and the props of the components change. See the `README.md` of the package.

### Patch Changes

- Updated dependencies
  - datocms-plugin-sdk@2.6.0-next.0
