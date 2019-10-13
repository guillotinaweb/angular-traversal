# 1.2.4 (2019-10-13)

- Fix demo and package.json

# 1.2.3 (2019-09-30)

- Fix typing

# 1.2.2 (2019-09-29)

- Add noAutoTraverse parameter to block traverse on location change if routing (Eric Brehault)

# 1.2.1 (2019-09-26)

- Normalize path before resolving when called from outside (Mathilde Pellerin) 

# 1.2.0 (2019-09-01)

- Support usage with routing (ebrehault)

# 1.1.1 (2019-06-15)

- Remove generated e2e tests (Mathilde Pellerin)
- Remove protractor, karma and jasmine dependencies (as we are using jest) (Mathilde Pellerin) 

# 1.1.0 (2019-06-14)

- Upgrade angular to version 7.2.0 (Mathilde Pellerin)
- Build the project using angular cli (Mathilde Pellerin)
- Unit tests with Jest instead of Karma (Mathilde Pellerin)
- fix request header (Thomas Desvenain)

# 1.0.6 (2018-09-20)

- traverseHere utility (Eric BREHAULT)

# 1.0.5 (2018-03-20)

## Bug fixes

- Fix IE support by switching from URLSearchParams to HttpParams from @angular/common/http (Sune Wøller) 

- When we change query string but not context, we request backend. (Thomas Desvenain)

# 1.0.4 (2017-11-04)

## New features

- Add querystring to target. (Thomas Desvenain)

- Use tsconfig path mapping to configure module-name-> location for test project. (Sune Wøller)

- Switch from angular/http to angular/common/http. (HttpClient) (Sune Wøller)

- Angular 5.0.0 compliancy. (Eric Bréhault)

# 1.0.3 (2017-09-24)

## Bug fixes

- Declare Target interface and no implicit any. (Thomas Desvenain)

# 1.0.2 (2017-09-06)

## Bug fixes

- Do not re-use context if empty.

# 1.0.1 (2017-09-06)

## Bug fixes

- Preserve previous location if no context path.

# 1.0.0-alpha.14 (2017-05-29)

## New features

Expose real href attribute on A tags.

# 1.0.0-alpha.13 (2017-05-20)

## Bug fixes

Initialize contextPath properly.

# 1.0.0-alpha.12 (2017-05-15)

## New features

Extract querystring from path and pass it to resolver.

# 1.0.0-alpha.11 (2017-04-19)

## New features

Return the context path.

# 1.0.0-alpha.10 (2017-03-30)

## New features

Allow to provide path normalizer.

# 1.0.0-alpha.9 (2017-03-24)

## New features

Upgrade to Angular 4.0.0.

## Bug Fixes

Fix BasicHttpResolver backend url injection.

# 1.0.0-alpha.8 (2017-03-15)

Initial release.
