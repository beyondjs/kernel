# Changelog

## \[0.1.3] - 2025-09-05

### Refactor

-   Improved path normalization by adding `stripIndex` utility to remove `index.html` and normalize slashes
-   Replaced usage of `location` with explicit `window.location` for clarity
-   Ensured `pathname` is cleaned before constructing the URI
-   Updated history check log formatting for consistency
